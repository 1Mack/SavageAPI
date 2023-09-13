import axios from "axios"
import { Request } from 'express'
import AppError from "../errors/AppError"
import { Database } from "../database"
import Functions from "../functions"

interface ICommands {
  commands: string[]
}
interface IPower {
  power: string
}

export class AluguelController {
  private request
  constructor(request: Request) {
    this.request = request
  }
  public async setCommands({ commands }: ICommands) {
    if (!commands || commands.length == 0) throw new AppError('API errada, forma correta do body /{commands: {["comando1", "comando2"]}} ----- Exemplo: {commands: {["sm_map dust2"]}}')


    const erros: string[] = []

    commands.map(command => {
      if (typeof command == 'number') return erros.push(`Comando /${command}/ tem que ser string!`)
      try {
        axios.post(`https://panel.mjsv.us/api/client/servers/${this.request.user?.identifier}/command`,
          { "command": command },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${process.env.PANEL_API_KEY}`,
            }
          })
      } catch (error) {
        erros.push(`Erro ao Executar o comando /${command}/`)
      }
    })
    if (erros.length == commands.length) throw new AppError(erros.join(" | "))

    return { message: `Comandos executados com sucesso: ${commands.filter(m => erros.length > 0 ? erros.some(err => !err.includes(m)) : m).join(" | ")}`, ...erros.length > 0 && { error: erros.join(" | ") } }
  }
  public async setPower({ power }: IPower) {
    if (!power || !['restart', 'start', 'stop', 'kill'].includes(power)) throw new AppError('Você fornecer a propriedade /body/, passando /"restart","start","stop" ou "kill"')

    let response
    try {
      response = await axios.post(`https://panel.mjsv.us/api/client/servers/${this.request.user?.identifier}/power`, { signal: power },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.PANEL_API_KEY}`,
          }
        })
    } catch (error) { throw new AppError('Erro ao executar a ação no servidor') }

    if (!response) throw new AppError('Erro ao executar a ação no servidor')

    return 'Comando de energia executado com sucesso...espere uns segundos até que o servidor termine de executar o comando!'
  }

  public async getMatchInfos() {

    try {

      const response = await new Database().query(`SELECT * FROM rankme_${this.request.user?.server_id}`)
      if (response.length == 0) throw new AppError('Nenhuma informação encontrada')

      return response
    } catch (error: any) {

      throw new AppError('Error ao buscar informações do rank no servidor')

    }

  }
  public async deleteMatchInfos() {

    try {
      await new Database().query(`DELETE FROM rankme_${this.request.user?.server_id}`)
      return true
    } catch (error: any) {

      throw new AppError('Error ao buscar informações do rank no servidor')

    }

  }
  public async getDemos({ maxDemos }: any) {
    if (maxDemos && maxDemos.match(/[^0-9]/g)) throw new AppError('Ao fornecer o /maxDemos/, forneça-o como número inteiro!')

    try {
      let { data } = await axios.get(`https://panel.mjsv.us/api/client/servers/${this.request.user?.identifier}/files/list?directory=%2Fcsgo%2Fwarmod`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.PANEL_API_KEY}`,
          }
        })
      data = data.data.filter((m: any) => m.attributes.name.endsWith('.dem')).slice(0, maxDemos || 1)

      if (data.length == 0) throw new AppError('Nenhuma demo encontrada!')

      data = await Promise.all(data.map(async (d: any) => {
        let result: any = await axios.get(`https://panel.mjsv.us/api/client/servers/${this.request.user?.identifier}/files/download?file=%2Fcsgo%2Fwarmod%2F${d.attributes.name}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${process.env.PANEL_API_KEY}`,
            }
          })
        result = result.data

        return { url: result.attributes.url, name: d.attributes.name, size: d.attributes.size, created_at: d.attributes.modified_at }
      }))

      return data
    } catch (err) {
      if (err instanceof AppError) throw new AppError(err.message)
      throw new AppError('Erro ao buscar as demos')

    }
  }
  public async getConfigurations() {
    const functions = new Functions(this.request)
    const admins = await functions.getAdmins()
    const password = await functions.getPassword(true)
    const tk = await functions.getTk(true)

    return [
      { property: 'admin', result: admins },
      { property: 'password', result: password },
      { property: 'tk', result: tk },
    ]
  }
  public async setConfigurations(body: any) {
    if (Object.keys(body).length == 0) throw new AppError('Você deve fornecer ao menos uma propriedade!')

    const allowedProperties = ['password', 'admin', 'tk']

    if (Object.keys(body).map(m => allowedProperties.find(a => a == m) ? 1 : 0).find(m => m == 0) == 0) throw new AppError(`Você forneceu alguma propriedade errada! As aceitas são: /${allowedProperties.join(', ')}/`)

    const functions: any = new Functions(this.request)
    const executed: any[] = []

    await Promise.all(Object.keys(body).map(async (property: string) => {
      let result = await functions[`set${property.charAt(0).toUpperCase()}${property.slice(1)}`](body[property])
      executed.push({ result, property })
    }))
    return executed
  }
}