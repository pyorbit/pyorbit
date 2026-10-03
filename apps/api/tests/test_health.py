from fastapi.testclient import TestClient

from pyorbit.main import create_app


def test_health() -> None:
    client = TestClient(create_app())
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_openapi_has_versioned_route() -> None:
    client = TestClient(create_app())
    assert "/api/v1/health" in client.get("/openapi.json").json()["paths"]
