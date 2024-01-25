FROM golang:latest
WORKDIR /backend-api/

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .
RUN go build -v -o bin

RUN addgroup --system api && adduser --system --ingroup api --disabled-password api
USER api:api

EXPOSE 8000/tcp
CMD ["./bin"]
