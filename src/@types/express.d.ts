declare namespace Express {
  export interface Request {
    user: {
      id: number;
      name: string;
      ip: string;
      password: string;
      steamid: string;
      discord_id: string;
      tempo: string;
      server_id: number;
      identifier: string;
      email: string;
      panel_password: string;
      token: string;
      created_at: string;
      end_at: string;
    },
    servers?: array<{
      name: string,
      redirectTo: string,
      serversInfos: [
        {
          name: string,
          map: string,
          ip: string,
          players: number,
          playersTotal: number
        }
      ],
    }>
  }
}
