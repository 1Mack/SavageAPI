import { Request } from "express"
import AppError from "../errors/AppError"
import SteamID from "steamid"
import axios from "axios"

export class UtilidadesController {
  private request
  constructor(request: Request) {
    this.request = request
  }
  public async getSteamid(steamURL: string) {
    if (!steamURL) throw new AppError('Você deve fornecer o parametro /steamURL/')

    if (steamURL.includes('STEAM_')) return steamURL

    if (!((steamURL.includes('steamcommunity.com/id/') || steamURL.includes('steamcommunity.com/profiles/')) &&
      (steamURL.includes('http') || steamURL.includes('https')))

    ) {
      if (!isNaN(Number(steamURL)) && Number(steamURL) > 10) {

        try {
          return new SteamID(steamURL).getSteam2RenderedID(true)
        } catch (error) {
          throw new AppError('Erro no Link')
        }
      } else {

        throw new AppError('Você digitou o link do seu perfil Errado')
      }
    }


    if (steamURL.charAt(steamURL.length - 1) == '/') {
      steamURL = steamURL.slice(0, -1);
    }
    steamURL = steamURL.slice(steamURL.lastIndexOf('/') + 1)
    let steamid64;
    async function getSteamid64() {
      try {
        return await axios.get(
          `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${process.env.STEAMID_API_KEY}&vanityurl=${steamURL}`
        ).then(async ({ data }) => {

          if (data.response['message']) throw Error('erro')

          return data.response.steamid;
        });
      } catch (error) {

        throw new AppError('Erro no link')
      }
    }
    if (!isNaN(Number(steamURL)) && Number(steamURL) > 10) {

      try {
        return new SteamID(steamURL).getSteam2RenderedID(true)
      } catch (error) {
        try {
          steamid64 = await getSteamid64()
          return new SteamID(steamid64).getSteam2RenderedID(true).toString()
        } catch (error) {
          throw new AppError('Erro no link')
        }
      }
    }



    try {
      steamid64 = await getSteamid64()
      return new SteamID(steamid64).getSteam2RenderedID(true).toString()
    } catch (error) {
      throw new AppError('Erro no link')
    }

  }

}


