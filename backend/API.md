# API Reference

## Requests
All requests must be sent using POST method with parameters in the JSON encoded
body. Server needs `Content-Type` set to `application/json`.

## Responses
Status code is:
- `200` if success
- `400` if client/parameter error
Error should return a `message` parameter to provide informations about the
error.

All response parameters are sent into a JSON encoded object as the body
with `Content-Type` set to `application/json`.


## /login

### Request parameters
- account: the name of the account trying to login

### Response parameters
- key: access key
- type: The type of the user


## /addDocument

### Request parameters
- key: access key
- content: base64 encoded content
- houseId : id of the house that the document is linked

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
- houseId : id of the house that the document is linked

### Response parameters
None


## /validated

### Request parameters
- key: access key
- url: file url
- houseId : id of the house that the document is linked

### Response parameters
-validated: boolean wether or not this file has been validated


## /getHouses

### Request parameters
- key: access key

### Response parameters
-content : list of houses and for each house a list of files



## /addHouse

### Request parameters
- key: access key
- street : street of the house
- zipCode : zip code of the house 
- city : of the house
- country : of the house
 

### Response parameters
none



## /getDocuments

### Request parameters
- key: access key
- houseId : id of the house

 

### Response parameters
none



