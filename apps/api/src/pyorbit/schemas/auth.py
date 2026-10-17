from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class EmailInput(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()


class RegisterRequest(EmailInput):
    password: str = Field(
        min_length=8,
        max_length=128,
        repr=False,
    )


class LoginRequest(EmailInput):
    password: str = Field(
        min_length=1,
        max_length=128,
        repr=False,
    )


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
