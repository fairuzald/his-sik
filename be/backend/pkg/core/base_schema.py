"""
Base schema abstraction with comprehensive type safety and validation support
"""

from datetime import datetime
from typing import Any, TypeVar

from pydantic import BaseModel, ConfigDict, model_validator

T = TypeVar("T")


class BaseSchema(BaseModel):
    """
    Base Pydantic schema with common configuration and validation utilities.
    All DTOs and DAOs should inherit from this class for consistency.
    """

    model_config = ConfigDict(
        validate_assignment=True,
        use_enum_values=True,
        validate_default=True,
        extra="forbid",
        from_attributes=True,
        str_strip_whitespace=True,
        json_encoders={
            datetime: lambda v: v.isoformat() if v else None,
        },
    )

    def to_dict(self) -> dict[str, Any]:
        """Convert model to dictionary with type safety"""
        return self.model_dump()

    def to_dict_exclude_none(self) -> dict[str, Any]:
        """Convert model to dictionary excluding None values"""
        return self.model_dump(exclude_none=True)

    def to_dict_exclude_unset(self) -> dict[str, Any]:
        """Convert model to dictionary excluding unset values"""
        return self.model_dump(exclude_unset=True)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "BaseSchema":
        """Create instance from dictionary with type validation"""
        try:
            return cls(**data)
        except Exception as e:
            raise ValueError(
                f"Failed to create {cls.__name__} from dictionary: {e}"
            ) from e

    @classmethod
    def get_field_names(cls) -> list[str]:
        """Get all field names for the model"""
        return list(cls.model_fields.keys())

    @classmethod
    def get_required_fields(cls) -> list[str]:
        """Get required field names for the model"""
        return [name for name, field in cls.model_fields.items() if field.is_required()]

    @classmethod
    def get_optional_fields(cls) -> list[str]:
        """Get optional field names for the model"""
        return [
            name for name, field in cls.model_fields.items() if not field.is_required()
        ]

    def validate_field_types(self) -> bool:
        """Validate that all fields have correct types"""
        try:
            self.model_validate(self.model_dump())
            return True
        except Exception:
            return False

    @model_validator(mode="after")
    def validate_model(self) -> "BaseSchema":
        """Post-validation hook for additional model-level validation"""
        return self


class BaseRequestSchema(BaseSchema):
    """Base schema for request DTOs with common validation"""

    model_config = ConfigDict(
        validate_assignment=True,
        use_enum_values=True,
        validate_default=True,
        extra="forbid",
        from_attributes=True,
        str_strip_whitespace=True,
    )


class BaseResponseSchema(BaseSchema):
    """Base schema for response DTOs/DAOs with serialization config"""

    model_config = ConfigDict(
        validate_assignment=True,
        use_enum_values=True,
        validate_default=True,
        extra="forbid",
        from_attributes=True,
        str_strip_whitespace=True,
    )
