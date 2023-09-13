import { Database } from "../database";
import cache from 'memory-cache'
import axios from "axios";
import { Request } from "express";
import SteamID from "steamid";
import moment from "moment";
moment.locale('en-gb')

export default class Functions {
  private user

  constructor(request: Request) {
    this.user = request?.user
  }

  async getAdmins(steamid?: string, reloadCache?: boolean) {
    const findCache = !reloadCache && cache.get(`@admins:${this.user.server_id}`)

    if (!findCache || reloadCache) {

      let result
      try {
        result = await new Database().query(`SELECT * FROM Cargos WHERE server_id = '?' ${steamid ? `AND playerid = ?` : ''}`, [this.user.server_id, steamid ? steamid : ''])
      } catch (err) {

        return ({ error: 'Erro ao buscar as informações' });
      }

      if (!result || result.length == 0) return ({ error: 'Nenhum admin encontrado' })

      if (steamid == undefined) {

        cache.put(`@admins:${this.user.server_id}`, result, 600000)
      }

      return result

    }

    return findCache
  }
  public async getPassword(onlyPassword?: boolean, reloadCache?: boolean) {
    const findCache = !reloadCache && cache.get(`@password:${this.user.server_id}`)
    if (!findCache || reloadCache) {
      let response
      try {
        response = await axios.get(`https://panel.mjsv.us/api/client/servers/${this.user.identifier}/files/contents?file=%2Fcsgo%2Fcfg%2Fserver.cfg`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${process.env.PANEL_API_KEY}`,
            }
          })
      } catch (error) { return { error: 'Erro ao buscar informações no server.cfg' } }
      let index = response.data.indexOf('sv_password')
      let password = response.data.substring(index, response.data.indexOf('\n', index)).split(' ')
      cache.put(`@password:${this.user.server_id}`, { completeCFG: response.data, password: password[1], index })

      if (onlyPassword) return password[1]

      return { completeCFG: response.data, password: password[1], index }
    }
    if (onlyPassword) return findCache.password

    return findCache
  }
  public async getTk(onlyTk?: boolean, reloadCache?: boolean) {
    const findCache = !reloadCache && cache.get(`@tk:${this.user.server_id}`)
    if (!findCache || reloadCache) {
      let response
      try {
        response = await axios.get(`https://panel.mjsv.us/api/client/servers/${this.user.identifier}/files/contents?file=%2Fcsgo%2Fcfg%2Fwarmod%2Fruleset_default.cfg`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${process.env.PANEL_API_KEY}`,
            }
          })
      } catch (error) { return ({ error: 'Erro ao buscar informações no server.cfg' }) }
      let index = response.data.indexOf('mp_friendlyfire')

      let tk = response.data.substring(index, response.data.indexOf('\n', index)).split(' ')
      cache.put(`@tk:${this.user.server_id}`, { completeCFG: response.data, tk: tk[1], index })

      if (onlyTk) return tk[1]

      return { completeCFG: response.data, tk: tk[1], index }
    }

    if (onlyTk) return findCache.tk

    return findCache
  }
  public async getSteamid(steamURL: string) {
    if (!steamURL) return { error: 'Você deve fornecer o parametro /steamURL/' }

    if (steamURL.includes('STEAM_')) return steamURL

    if (!((steamURL.includes('steamcommunity.com/id/') || steamURL.includes('steamcommunity.com/profiles/')) &&
      (steamURL.includes('http') || steamURL.includes('https')))

    ) {
      if (!isNaN(Number(steamURL)) && Number(steamURL) > 10) {

        try {
          return new SteamID(steamURL).getSteam2RenderedID(true)
        } catch (error) {
          return { error: 'Erro no Link' }
        }
      } else {

        return { error: 'Você digitou o link do seu perfil Errado' }
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
          `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=1EF908743086093E1FB911BC9BF2CCE8&vanityurl=${steamURL}`
        ).then(async ({ data }) => {

          if (data.response['message']) return { error: 'erro' }

          return data.response.steamid;
        });
      } catch (error) {

        return { error: 'Erro no link' }
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
          return { error: 'Erro no link' }
        }
      }
    }



    try {
      steamid64 = await getSteamid64()
      return new SteamID(steamid64).getSteam2RenderedID(true).toString()
    } catch (error) {
      return { error: 'Erro no link' }
    }

  }
  public async setAdmin(admins: [{ old?: string, new?: string }]) {

    if (!admins || admins.length < 1) return { error: 'Você deve passar um array sem ser vazio!' }

    const result = await Promise.all(admins.map(async steamid => {
      let oldSteamid: any, newSteamid: any

      if (steamid['old']) oldSteamid = await this.getSteamid(steamid['old'])
      if (steamid['new']) newSteamid = await this.getSteamid(steamid['new'])

      if (newSteamid && newSteamid['error']) return { error: `new: ${newSteamid.error}` }
      if (oldSteamid && oldSteamid['error']) return { error: `old: ${oldSteamid.error}` }

      if (oldSteamid && !newSteamid) {
        const checkIfAdmin: any = await this.getAdmins(oldSteamid).catch(m => m)

        if (!checkIfAdmin || checkIfAdmin['error']) return { error: 'Admin não encontrado ou erro na requisição!' }

        try {
          await new Database().query(`DELETE FROM Cargos WHERE Id = ?`, [checkIfAdmin[0].Id])

        } catch (error) {

          return { error: 'Erro ao deletar o cargo' }
        }

      } else if (oldSteamid && newSteamid) {
        const checkIfAlreadyAdminOld: any = await this.getAdmins(oldSteamid).catch(m => m)
        if (!checkIfAlreadyAdminOld || checkIfAlreadyAdminOld['error']) return { error: 'Admin não encontrado ou erro na requisição!' }

        const checkIfAlreadyAdminNew: any = await this.getAdmins(newSteamid).catch(m => m)
        if ((checkIfAlreadyAdminNew && checkIfAlreadyAdminNew.length > 0) || (checkIfAlreadyAdminNew && checkIfAlreadyAdminNew['error'] && checkIfAlreadyAdminNew['error'] != 'Nenhum admin encontrado')) return { error: 'Admin já cadastrado ou erro na requisição!' }
        try {

          await new Database().query(`UPDATE Cargos SET playerid = ? WHERE Id = ?`, [newSteamid, checkIfAlreadyAdminOld[0].Id])

        } catch (error) {

          return { error: 'Erro ao editar o cargo' }
        }

      } else if (!oldSteamid && newSteamid) {
        const checkIfAlreadyAdmin: any = await this.getAdmins(newSteamid).catch(m => m)

        if ((checkIfAlreadyAdmin && checkIfAlreadyAdmin.length > 0) || (checkIfAlreadyAdmin && checkIfAlreadyAdmin['error'] && checkIfAlreadyAdmin['error'] != 'Nenhum admin encontrado')) return { error: 'Admin já cadastrado ou erro na requisição!' }

        try {
          await new Database().query(`INSERT IGNORE INTO Cargos
       (playerid, enddate, flags, server_id, discordID) 
      VALUES
          (?, ?, 'a/z/t', ?, ?)`, [newSteamid, moment(this.user.end_at, 'DD-MM-YYYY hh-mm-ss').local().add(3, 'hours').format('YYYY-MM-DD hh-mm-ss'), this.user.server_id, this.user.discord_id])
        } catch (error) {
          return { error: 'Erro ao setar' }
        }
      } else return { error: 'Você preencheu a API de forma errada' }

      return true
    }))

    await this.getAdmins(undefined, true)

    return result
  }
  public async setTk(bool: boolean) {

    let tk = await this.getTk()

    if (!tk || tk['error']) { return { error: tk['error'] ? tk.error : 'Erro ao buscar informações' } }

    if (tk.tk == 1 && bool) {
      return { error: 'O TK já estava ativado!' }
    } else if (tk.tk == 0 && !bool) {
      return { error: 'O TK já estava desativado!' }
    } else {
      let data = tk.completeCFG.replace(tk.completeCFG.substring(tk.index, tk.completeCFG.indexOf('\n', tk.index)), `mp_friendlyfire ${bool ? 1 : 0}`)
      await axios.post(`https://panel.mjsv.us/api/client/servers/${this.user.identifier}/files/write?file=%2Fcsgo%2Fcfg%2Fwarmod%2Fruleset_default.cfg`, data,
        {
          headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.PANEL_API_KEY}`,
          },

        }).catch(err => {
          return { error: 'Erro ao ativar o TK' }
        })

      await this.getTk(undefined, true)

      return `TK ${bool ? 'ativado' : 'desativado'} com sucesso!`
    }
  }
  public async setPassword(password: string) {

    if (password.match(/[^a-zA-Z_:0-9]/g)) return { error: 'Caracter especial detectado! A senha deve conter apenas letras ou números, não podendo ter [espaço, @,-,especiais da língua portuguesa como ç e ~,...]' }


    let passwordCfg = await this.getPassword()

    if (!passwordCfg || passwordCfg['error']) { return { error: passwordCfg['error'] ? passwordCfg.error : 'Erro ao buscar informações' } }


    let data = passwordCfg.completeCFG.replace(passwordCfg.completeCFG.substring(passwordCfg.index, passwordCfg.completeCFG.indexOf('\n', passwordCfg.index)), `sv_password ${password}`)
    await axios.post(`https://panel.mjsv.us/api/client/servers/${this.user.identifier}/files/write?file=%2Fcsgo%2Fcfg%2Fserver.cfg`, data,
      {
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.PANEL_API_KEY}`,
        },

      }).catch(err => {
        return { error: 'Erro ao mudar a senha' }
      })

    new Database().query('UPDATE Servidor_Aluguel SET password = ? WHERE server_id = ?', [password, this.user.server_id])

    await this.getPassword(undefined, true)

    return `Senha alterada para /${password}/ com sucesso!`
  }
}