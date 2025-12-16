
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict


class StorageConfig(BaseSettings):
    """MinIO/S3 storage configuration."""
    bucket_name: str = "his-uploads"
    region: str = "us-east-1"
    endpoint: Optional[str] = "http://minio:9000"
    access_key: str = "minioadmin"
    secret_key: str = "minioadmin"
    secure: bool = False
    public_base_url: Optional[str] = "http://localhost:9000"

    model_config = SettingsConfigDict(
        env_prefix="MINIO_",
        env_file=".env",
        extra="ignore"
    )

class FileMetadata(BaseModel):
    file_name: str
    file_path: str
    content_type: str
    size: int
    etag: Optional[str] = None
    created_at: datetime
    metadata: dict[str, Any] = {}

class UploadResult(BaseModel):
    success: bool
    file_path: str
    file_url: Optional[str]
    metadata: FileMetadata
    error: Optional[str] = None

class DownloadResult(BaseModel):
    success: bool
    content: Optional[bytes]
    content_type: str
    size: int
    error: Optional[str] = None
