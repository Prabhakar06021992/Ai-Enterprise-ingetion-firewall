
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict, field_validator


Intent = Literal[
    "greeting",
    "farewell",
    "thanks",
    "complaint",
    "request",
    "question",
    "feedback",
    "other",
    "suggestion",
]

RiskProfile = Literal["low", "medium", "high", "critical", "unknown"]
Priority = Literal["low", "medium", "high"]


class IngestionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    message: str = Field(
        min_length=1,
        max_length=5000,
        description="The user's original message",
        examples=["Hello, I have a question about my account."],
    )

    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Message cannot be empty")
        return value


class TokenMetaData(BaseModel):
    estimate_tokens: int = Field(default=0, ge=0)
    note: str = (
        "Estimated number of tokens in the message. "
        "This is a rough estimate and may not be accurate."
    )


class IngestionResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    intent: Intent
    risk_profile: RiskProfile
    priority: Priority
    required_actions: bool
    summary: str = Field(min_length=1, max_length=1000)
    token_metadata: TokenMetaData = Field(default_factory=TokenMetaData)

