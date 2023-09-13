
# [Savage Servidores](https://savageservidores.com) Exclusive API

> [!WARNING]
> DOCUMENTATION UNDER CONSTRUCTION

## API Documentation

### "Aluguel" Route

#### Authorization

```http
  POST /aluguel/oauth
```
##### Request
| Parameter   | Type       | Description                                                 |
| :---------- | :--------- | :---------------------------------------------------------- |
| `email`     | `string`   | **Required**. Email used on store                           |
| `password`  | `string`   | **Required**. Password generated and received on your email |

##### Response
```JSON
  {
    "name": "serverName",
    "ip": "serverIp",
    "serverPassword": "serverPassword",
    "tempo": "serverBoughtTime",
    "email": "yourEmail",
    "token": "generatedToken",
    "created_at": "serverCreatedAt",
    "end_at": "serverEndAt",
  }
```
## Environment variables

To run this project, you will need to add the following environment variables on your .env file

`STEAMID_API_KEY` 

`AUTHCONFIG_SECRET`

`PANEL_API_KEY`

`DATABASE_HOST`

`DATABASE_USER`

`DATABASE_PASSWORD`

`DATABASE_DATABASE`

`DATABASE_PORT`

