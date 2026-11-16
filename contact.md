# CONTACT API SPEC

## Create Contact API

Endpoint : POST /api/contacts

Headers :
Authorization - Token
Request Body :

```json
{
  "first_name": "Jean",
  "last_name": "Rantabaratrahjaga",
  "email": "baratrahjaga@gmail.com",
  "phone": "081235667629"
}
```

Response Body Success:

```json
{
  "status": 201,
  "data": {
    "id": 1,
    "first_name": "Jean",
    "last_name": "Rantabaratrahjaga",
    "email": "baratrahjaga@gmail.com",
    "phone": "081235667629"
  },
  "message": "create data success"
}
```

Response Body Error:

```json
{
  "status": 422,
  "data": null,
  "message": "email is not valid format"
}
```

## Update Contact API

Endpoint : PUT /api/users/login

Request Body :

```json
{
  "first_name": "Jean",
  "last_name": "Rantabaratrahjaga",
  "email": "baratrahjaga@gmail.com",
  "phone": "081235667629"
}
```

Response Body Success:

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "first_name": "Jean",
    "last_name": "Rantabaratrahjaga",
    "email": "baratrahjaga@gmail.com",
    "phone": "081235667629"
  },
  "message": "login success"
}
```

Response Body Error:

```json
{
  "status": 422,
  "data": null,
  "message": "email is not valid format"
}
```

## Get Contact API

Endpoint : GET /api/contacts/:id

Headers :
Authorization - token

Response Body Success:

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "first_name": "Jean",
    "last_name": "Rantabaratrahjaga",
    "email": "baratrahjaga@gmail.com",
    "phone": "081235667629"
  },
  "message": "get success"
}
```

Response Body Error:

```json
{
  "status": 404,
  "data": null,
  "message": "Contact not  found"
}
```

## Search Contact API

Endpoint : GET /api/contacts
Headers :
Authorization - Token

Query Params :

- name : search by first_name or last_name using like query //optional
- email : search email using like //optional,
- phone : search by phone using like //optional
- page : number of page, default 1
- size : size perpage, default 10

Response Body Success:

```json
{
  "status": 200,
  "data": [{
    "id": 1,
    "first_name": "Jean",
    "last_name": "Rantabaratrahjaga",
    "email": "baratrahjaga@gmail.com",
    "phone": "081235667629"
  }, {
    "id": 1,
  "first_name": "Jean",
  "last_name": "Rantabaratrahjaga",
  "email": "baratrahjaga@gmail.com",
  "phone": "081235667629"
}{
    "id": 1,
  "first_name": "Jean",
  "last_name": "Rantabaratrahjaga",
  "email": "baratrahjaga@gmail.com",
  "phone": "081235667629"
}{
    "id": 1,
  "first_name": "Jean",
  "last_name": "Rantabaratrahjaga",
  "email": "baratrahjaga@gmail.com",
  "phone": "081235667629"
}],
"paging": {
    "page":1,
    "total_page":3,
    "size_item":10
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

## Remove Contact API

Endpoint : DELETE /api/contacts/:id

Headers:
authorization - Token
Response Body Success:

```json
{
  "status": 204,
  "data": {
    "id": 1,
    "first_name": "Jean",
    "last_name": "Rantabaratrahjaga",
    "email": "baratrahjaga@gmail.com",
    "phone": "081235667629"
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
