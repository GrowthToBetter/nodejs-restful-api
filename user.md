# USER API SPEC

## Register User API

Endpoint : POST /api/users

Request Body :
```json
{
  "username": "baratrahjaga",
  "password": "secret",
  "name": "Jean R"
}
```

Response Body Success:

```json
{
  "status": 201,
  "data": {
    "username": "baratrahjaga",
    "name": "Jean R"
  },
  "message": "register success"
}
```
Response Body Error:

```json
{
  "status": 501,
  "data": null,
  "message": "Internal Server Error"
}
```

## Login User API
Endpoint : POST /api/users/login

Request Body :
```json
{
  "username": "baratrahjaga",
  "password": "secret",
}
```

Response Body Success:
```json
{
  "status": 200,
  "data": {
    "token":"uuid"
  },
  "message": "login success"
}
```

Response Body Error:

```json
{
  "status": 422,
  "data": null,
  "message": "Validation Error [Username or Password Cannot be empty]"
}
```

## Update User API
Endpoint : PATCH /api/users/me

Headers : 
Authorization - token
Request Body :
```json
{
  "name": "Jean R", //optional
  "username": "baratrahjaga", //optional
  "password": "secret", //optional
}
```

Response Body Success:

```json
{
  "status": 200,
  "data": {
    "username": "baratrahjaga",
    "name": "Jean R"
  },
  "message": "update success"
}
```
Response Body Error:

```json
{
  "status": 501,
  "data": null,
  "message": "Internal Server Error"
}
```

## Get User API
Endpoint : GET /api/users/me
Headers :
Authorization - Token


Response Body Success:

```json
{
  "status": 200,
  "data": {
    "username": "baratrahjaga",
    "name": "Jean R"
  },
  "message": "Get data success"
}
```
Response Body Error:

```json
{
  "status": 401,
  "data": null,
  "message": "Unauthorized"
}
```


## Logout User API
Endpoint : DELETE /api/users/logout

Headers: 
authorization - Token
Response Body Success:

```json
{
  "status": 204,
  "data": {
    "username": "baratrahjaga",
    "name": "Jean R"
  },
  "message": "data delete successfully"
}
```
Response Body Error:

```json
{
  "status": 401,
  "data": null,
  "message": "Unauthorized"
}
```