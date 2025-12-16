
import asyncio
import logging
from datetime import datetime
from typing import Any, BinaryIO

import boto3
from backend.infrastructure.storage.models import (
    FileMetadata,
    StorageConfig,
    UploadResult,
)
from botocore.config import Config
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

class S3StorageService:
    def __init__(self, config: StorageConfig):
        self.config = config
        self.bucket_name = config.bucket_name

        boto_config = Config(
            region_name=config.region,
            s3={"addressing_style": "path", "signature_version": "s3v4"}
        )

        self.s3_client = boto3.client(
            "s3",
            endpoint_url=config.endpoint,
            aws_access_key_id=config.access_key,
            aws_secret_access_key=config.secret_key,
            config=boto_config,
            use_ssl=config.secure,
        )
        # Ensure bucket exists (synchronously during init, or handle lazily)
        try:
             self.s3_client.head_bucket(Bucket=self.bucket_name)
        except ClientError:
             try:
                 self.s3_client.create_bucket(Bucket=self.bucket_name)
                 # Make bucket public readable for this use case
                 policy = {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"AWS": ["*"]},
                            "Action": ["s3:GetObject"],
                            "Resource": [f"arn:aws:s3:::{self.bucket_name}/*"]
                        }
                    ]
                 }
                 import json
                 self.s3_client.put_bucket_policy(Bucket=self.bucket_name, Policy=json.dumps(policy))
             except Exception as e:
                 logger.error(f"Failed to create bucket: {e}")

    async def _run_sync(self, func, *args, **kwargs):
        loop = asyncio.get_event_loop()
        import functools
        partial_func = functools.partial(func, *args, **kwargs)
        return await loop.run_in_executor(None, partial_func)

    async def upload_file(
        self,
        file_data: BinaryIO,
        file_path: str,
        content_type: str,
        metadata: dict[str, Any] = None,
    ) -> UploadResult:
        try:
            file_data.seek(0, 2)
            file_size = file_data.tell()
            file_data.seek(0)

            s3_metadata = {str(k): str(v) for k, v in (metadata or {}).items()}

            await self._run_sync(
                self.s3_client.put_object,
                Bucket=self.bucket_name,
                Key=file_path,
                Body=file_data,
                ContentType=content_type,
                Metadata=s3_metadata,
            )

            # Construct Public URL
            base_url = self.config.public_base_url or self.config.endpoint or ""
            # Remove trailing slash if present
            if base_url.endswith("/"):
                base_url = base_url[:-1]
            file_url = f"{base_url}/{self.bucket_name}/{file_path}"

            return UploadResult(
                success=True,
                file_path=file_path,
                file_url=file_url,
                metadata=FileMetadata(
                    file_name=file_path.split("/")[-1],
                    file_path=file_path,
                    content_type=content_type,
                    size=file_size,
                    created_at=datetime.utcnow(),
                    metadata=s3_metadata
                )
            )
        except Exception as e:
            logger.error(f"Upload error: {e}")
            return UploadResult(
                success=False,
                file_path=file_path,
                file_url=None,
                metadata=FileMetadata(
                    file_name=file_path, file_path=file_path, content_type=content_type, size=0, created_at=datetime.utcnow()
                ),
                error=str(e)
            )

    async def delete_file(self, file_path: str) -> bool:
        try:
            await self._run_sync(
                self.s3_client.delete_object,
                Bucket=self.bucket_name,
                Key=file_path
            )
            return True
        except Exception as e:
            logger.error(f"Delete error: {e}")
            return False

# Singleton instance
storage_config = StorageConfig() # Load from env in real app
s3_service = S3StorageService(storage_config)

def get_storage_service():
    return s3_service
