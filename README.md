
# [Savage Servidores](https://savageservidores.com) Exclusive API

> [!WARNING]
> DOCUMENTATION UNDER CONSTRUCTION

## API Documentation

### "Aluguel" Route

#### Authorization

```HTTP
  POST /aluguel/oauth
```
##### Request
| Parameter   | Type       | Description                                                 |
| :---------- | :--------- | :---------------------------------------------------------- |
| `email`     | `string`   | **Required**. Email used on store                           |
| `password`  | `string`   | **Required**. Password generated and received on your email |

##### Example
```JSON
  {
    "email": "teste@email.com",
    "password": "123",
  }
```

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

#### Send Command

```HTTP
  POST /aluguel/command
```
##### Request
| Parameter   | Type              | Authentication   | Description                                                                                |
| :---------- | :--------         | :--------------- | :----------------------------------------------------------------------------------------- |
| `commands`  | `object[string]`  | `Bearer`         | **Required**. Send commands to the server by console, like mp_restartgame, mp_roundtime... |

##### Example
```JSON
  {
    "commands": {
      ["mp_restartgame 1", "mp_roundtime 3"]
    }
  }
```

##### Response
```JSON
  {
    "message": "Comandos executados com sucesso: mp_restartgame 1",
    "error?": "Erro ao Executar o comando /mp_roundtime 3/"
  }
```

#### Execute Power Action
```HTTP
  POST /aluguel/power
```
##### Request
| Parameter     | Type       | Authentication   | Description                                      |
| :------------ | :--------- | :--------------- | :----------------------------------------------- |
| `power`       | `string`   | `Bearer`         | **Required**. Execute power action on the server |

##### Example
```JSON
  {
    "power": "restart | start | stop | kill"
  }
```

##### Response
```JSON
  {
    "message": "Comando de energia executado com sucesso...espere uns segundos até que o servidor termine de executar o comando!",
  }
```


#### Get Infos of the Current Match
```HTTP
  GET /aluguel/match/infos
```

##### Response
```JSON
  {
    "timestamp": "Date", 
    "data": {"key": "any"} // to-do: collet infos on DB
  }
```

#### Delete Infos of the Current Match
```HTTP
  DELETE /aluguel/match/infos
```

##### Response
```JSON
  {
    "timestamp": "Date", 
    "message": "Deletado com sucesso"
  }
```

#### Get Demos
```HTTP
  GET /aluguel/match/infos
```
##### Query Parameter
| Parameter      | Type       | Authentication   | Description                                      |
| :------------- | :--------- | :--------------- | :----------------------------------------------- |
| `maxDemos?`     | `integer`   | `Bearer`       | Specify a max numbers of demos to return         |

##### Response
```JSON
  {
    "url": "downloadUrl", 
    "name": "demoName", 
    "size": "demoSize", 
    "created_at": "demoCreatedAt", 
  }
```

#### Edit Configurations
```HTTP
  PUT /aluguel/configurations
```
##### Request
| Parameter      | Type             | Authentication   | Description                     |
| :------------- | :--------------- | :--------------- | :------------------------------ |
| `password?`    | `string`         | `Bearer`         | Change the server password      |
| `admins?`      | `array<object>`  | `Bearer`         | Remove, add and edit admins     |
| `tk?`          | `boolean`        | `Bearer`         | Change TeamKill                 |

##### Example
```JSON
  {
    "password": "teste123",
    "tk": true,
    "admins": [{"old?": "oldSteamid", "new?": "newSteamid"}]
  }
```

> [!IMPORTANT]
> Only /old/ = Delete
> Only /new/ = Add
> /old/ and /new/ = Edit


##### Response
```JSON
  {
    {
      "timestamp": "13/09/2023, 14:17:59",
      "data": [
        {
          "result": [
            true
          ],
          "property": "admin"
        },
        {
          "result": {"error": "Erro ao mudar a senha"},
          "property": "password"
        },
         {
          "result": "TK ativado com sucesso!",
          "property": "tk"
        },
      ]
    }
  }
```

#### Get Configurations
```HTTP
  GET /aluguel/configurations
```

##### Response
```JSON
  {
    {
	"timestamp": "13/09/2023, 09:57:58",
	"data": [
		{
			"property": "admin",
			"result": [
				{
					"Id": 1,
					"timestamp": "2023-09-12T02:29:34.000Z",
					"playerid": "STEAMID",
					"enddate": "2023-10-12T02:29:34.000Z",
					"flags": "a/z/t",
					"server_id": 123,
					"discordID": null
				}
			]
		},
		{
			"property": "password",
			"result": "123_password"
		},
		{
			"property": "tk",
			"result": "1"
		}
	]
}
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

