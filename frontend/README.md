# Frontend Project

This project sets up a frontend development environment using Docker. It allows you to build and run the application in a containerized environment, ensuring consistent dependencies across different machines.

## Prerequisites

- Docker installed on your machine  


## Development Setup

### 1. Build the Docker Image

```bash
sudo docker build -f Dockerfile.dev -t frontend .
sudo docker run -it -p 5173:5173 -v $(pwd):/app -v /app/node_modules frontend
```

## Production Setup

```bash
sudo docker build -f Dockerfile.prod -t frontend .
sudo docker run frontend
```


