# API Reference

## Requests
All requests must be sent using POST method with parameters in the JSON encoded
body. Server needs `Content-Type` set to `application/json`.

## Responses
Status code is:
- `200` if success
- `400` if client/parameter error
- `500` if server error
Error should return a `message` parameter to provide informations about the
error.

All response parameters are sent into a JSON encoded object as the body
with `Content-Type` set to `application/json`.


## /login

### Request parameters
- type=owner/inspector/admin

### Response parameters
- key: access key


## /upload

### Request parameters
- key: access key
- content: base64 encoded content

### Response parameters
- url: file url


## /download

### Request parameters
- key: access key
- url: file url

### Response parameters
- content: base64 encoded content


## /validate

### Request parameters
- key: access key
- url: file url

### Response parameters
None


## /validated

### Request parameters
- key: access key
- url: file url

### Response parameters
-validated: boolean wether or not this file has been validated
