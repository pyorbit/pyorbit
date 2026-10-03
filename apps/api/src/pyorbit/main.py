import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from pyorbit.api.v1.health import router as health_router
from pyorbit.core.logging import configure_logging
from pyorbit.core.settings import Settings, get_settings

logger = logging.getLogger(__name__)


def create_app(settings: Settings | None = None) -> FastAPI:
    config = settings or get_settings()
    configure_logging(config.log_level)
    app = FastAPI(
        title="PyOrbit API", version="0.1.0", description="Versioned user data API for PyOrbit"
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=config.cors_origins,
        allow_credentials=True,
        allow_methods=["GET"],
        allow_headers=["Content-Type"],
    )
    app.include_router(health_router, prefix="/api/v1")

    @app.exception_handler(Exception)
    async def unexpected_error(_request: Request, error: Exception) -> JSONResponse:
        logger.exception("Unhandled API error", exc_info=error)
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})

    return app


app = create_app()
