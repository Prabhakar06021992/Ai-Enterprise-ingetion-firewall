
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from app.schemas.ingestion import IngestionRequest, IngestionResponse
from app.services.lim_servises import analyze_message
from app.utils.token_counter import estimate_tokens

app = FastAPI(
    title="AI-Project1",
    description="Classifies user messages and validates structured AI output",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Ingestion Firewall is up and running!",
    }


@app.post("/api/analyze", response_model=IngestionResponse)
def analyze(request: IngestionRequest):
    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=422,
            detail="Message cannot be empty",
        )

    try:
        result = analyze_message(message)
        result.token_metadata.estimate_tokens = estimate_tokens(message)
        return result

    except ValidationError as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error": "The model response did not pass schema validation",
                "validation_errors": exc.errors(),
            },
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "An unexpected error occurred while processing the request."
            },
        ) from exc
