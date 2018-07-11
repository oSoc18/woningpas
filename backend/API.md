# API Reference

## Requests
- GET parameters are included in URL
- POST parameters are sent in a JSON encoded object as the body ; server
needs `Content-Type` set to `application/json`

## Responses
Status code is:
- `200` if success
- `400` if client/parameter error
- `500` if server error
Error returns a `message` parameter to provide informations about the
error.

All response parameters are sent into a JSON encoded object as the body
with `Content-Type` set to `application/json`.


## GET /login

### Request parameters
- type=owner/inspector/admin

### Response parameters
- key: access key


## POST /upload

### Request parameters
- key: access key
- name: file name
- content: base64 encoded content

### Response parameters
None


## GET /download

### Request parameters
- key: access key
- name: file name

### Response parameters
- name: file name
- content: base64 encoded content


## POST /validate

### Request parameters
- key: access key
- name: file name

### Response parameters
None
