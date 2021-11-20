# Store API behavior

*As this version is just a PoC, we pack every endpoint in here to get it running, no microservice-like separation yet.*

## `/v1/secret`

GET request: -

POST request:
```json
{
    "admin": [
        userid
    ],
    "data": base64EncodedSecret
}
```