"""WSGI entry point for production deployment."""

from src.web.app import app

if __name__ == "__main__":
    app.run()
