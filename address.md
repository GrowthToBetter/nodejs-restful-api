# ADDRESS API SPEC

## Create Address API

Endpoint : POST /api/contacts/:contactId/addresses

Headers :
Authorization - Token
Request Body :

```json
{
  "street": "jl danur wenda 3",
  "city": "malang",
  "province": "jatim",
  "country": "indonesia",
  "postal_code": 65362
}
```

Response Body Success:

```json
{
  "status": 201,
  "data": {
    "id": 1,
    "street": "jl danur wenda 3",
    "city": "malang",
    "province": "jatim",
    "country": "indonesia",
    "postal_code": 65362
  },
  "message": "create success"
}
```

Response Body Error:

```json
{
  "status": 422,
  "data": null,
  "message": "[country] is required"
}
```

## Update Address API

Endpoint : PUT /api/contacts/:contactId/adresses/:addressesId

Request Body :

```json
{
  "street": "jl danur wenda 3",
  "city": "malang",
  "province": "jatim",
  "country": "indonesia",
  "postal_code": 65362
}
```

Response Body Success:

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "street": "jl danur wenda 3",
    "city": "malang",
    "province": "jatim",
    "country": "indonesia",
    "postal_code": 65362
  },
  "message": "update success"
}
```

Response Body Error:

```json
{
  "status": 422,
  "data": null,
  "message": "[country] is required"
}
```

## Get Address API

Endpoint : GET /api/contacts/:contactsId/addresses/:addressesId

Headers :
Authorization - token

Response Body Success:

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "street": "jl danur wenda 3",
    "city": "malang",
    "province": "jatim",
    "country": "indonesia",
    "postal_code": 65362
  },
  "message": "get success"
}
```

Response Body Error:

```json
{
  "status": 404,
  "data": null,
  "message": "address not found"
}
```

## List Address API

Endpoint : GET /api/contacts/:contactsId/addresses
Headers :
Authorization - Token

Response Body Success:

```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "street": "jl danur wenda 3",
      "city": "malang",
      "province": "jatim",
      "country": "indonesia",
      "postal_code": 65362
    },
    {
      "id": 1,
      "street": "jl danur wenda 3",
      "city": "malang",
      "province": "jatim",
      "country": "indonesia",
      "postal_code": 65362
    },
    {
      "id": 1,
      "street": "jl danur wenda 3",
      "city": "malang",
      "province": "jatim",
      "country": "indonesia",
      "postal_code": 65362
    }
  ],

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

## Remove Address API

Endpoint : DELETE /api/contacts/:contactsId/addresses/:addressesId

Headers:
authorization - Token
Response Body Success:

```json
{
  "status": 204,
  "data": {
    "id": 1,
    "street": "jl danur wenda 3",
    "city": "malang",
    "province": "jatim",
    "country": "indonesia",
    "postal_code": 65362
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
