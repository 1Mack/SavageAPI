
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
| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Required**. Email used on store |
| `password` | `string` | **Required**. Password generated and received on your email |

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
## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`STEAMID_API_KEY` 

`AUTHCONFIG_SECRET`

`PANEL_API_KEY`

`DATABASE_HOST`

`DATABASE_USER`

`DATABASE_PASSWORD`

`DATABASE_DATABASE`

`DATABASE_PORT`

