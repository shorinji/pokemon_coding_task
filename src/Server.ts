import express, { Express, Response, Request, NextFunction } from 'express'
import { readFileSync } from 'fs'

import Monster from './Monster'
import { Battle, BattleResult } from './Battle'

class ValidationStatus {
  constructor (public isValid: boolean, 
    public statusCode: number, 
    public errorMessage: string,
    public monsters1: Monster[],
    public monsters2: Monster[]) {

  }
}

class Server {
  private is_dev: boolean;
  private app: Express;
  private monsterDataById: Map<number, Monster>;

  constructor(public port: number, public node_env: string) {
    this.is_dev = (node_env === 'development');
    this.app = express();

    const dataBuffer = readFileSync('./pokedex.txt');
    const pokemonData = JSON.parse(dataBuffer.toString());

    this.monsterDataById = new Map(); 

    for (const m of pokemonData.pokemon) {
      const monster = new Monster(m.id, 
          m.name,
          m.type,
          m.img,
          m.height,
          m.weight,
          m.weaknesses)
      this.monsterDataById.set(m.id, monster)
    }


    this.setErrorMiddleware();
  }

  setErrorMiddleware() {
    // hide error dump in production
    if (this.is_dev) {
      this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({
          message: err.message,
          stack: err.stack
        });
      });
    } else {
      this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({
          message: 'Something went wrong'
        });
      });
    }
  }

  private validateTeamIds(team1idsUnvalidated: any, team2idsUnvalidated: any): ValidationStatus {
    if(team1idsUnvalidated === undefined || team2idsUnvalidated === undefined) {
      return new ValidationStatus(false, 400, 'missing mandatory query parameters team1ids and team2ids', [], []);
    }

    if (!Array.isArray(team1idsUnvalidated)) {
      return new ValidationStatus(false, 400, 'Parameter team1ids must be an array of integer ids', [], []);
    }

    if (!Array.isArray(team2idsUnvalidated)) {
      return new ValidationStatus(false, 400, 'Parameter team2ids must be an array of integer ids', [], []);
    }

    if (team1idsUnvalidated.length !== team2idsUnvalidated.length) {
      return new ValidationStatus(false, 400, 'Parameters team1ids and team2ids must be of equal length', [], []);
    }

    const team1ids = team1idsUnvalidated!
    const team2ids = team2idsUnvalidated!

    let monsters1 : Monster[] = []
    let monsters2 : Monster[] = []

    for (const id of team1ids) {
      const numId = parseInt(id as string, 10)
      
      if (!isNaN(numId) && this.monsterDataById.has(numId)) {
        const m = this.monsterDataById.get(numId) as Monster
        monsters1.push(m)
      } else {
        return new ValidationStatus(false, 400, `invalid id=${id} in team1ids`, [], []);
      }
    }

    for (const id of team2ids) {
      const numId = parseInt(id as string, 10)
      if (!isNaN(numId) && this.monsterDataById.has(numId)) {
        const m = this.monsterDataById.get(numId) as Monster
        monsters2.push(m)
      } else {
        return new ValidationStatus(false, 400, `invalid id=${id} in team2ids`, [], []);
      }
    }

    return new ValidationStatus(true, 200, 'ok', monsters1, monsters2)
  }

  start() {
    this.app.get('/log', (req: Request, res: Response) => {
      // TODO implement
      res.send('root request');
    });

    this.app.get('/battle/', (req: Request, res: Response) => {

      const validationStatus = this.validateTeamIds(req.query.team1ids, req.query.team2ids)

      if (!validationStatus.isValid) {
        res.status(validationStatus.statusCode)
        if (this.is_dev) {
          res.send(validationStatus.errorMessage);
        } else {
          res.send('');
        }

        return;
      }

      const monsters1 : Monster[] = validationStatus.monsters1;
      const monsters2 : Monster[] = validationStatus.monsters2;


      let responseText = `we have a team fight between ${monsters1.length} pair${monsters1.length!==1?'s':''} of monsters\n`
      responseText += 'Team 1:'.padEnd(40) + 'Team 2:\n'
      for (let i = 0 ; i < monsters1.length ; i++) {
        responseText += monsters1[i].name.padEnd(40, ' ') + monsters2[i].name + "\n"
      }

      let battles: Battle[] = [];

      for (let i = 0 ; i < monsters1.length ; i++) {
        const b = new Battle(monsters1[i], monsters2[i])
        battles.push(b)
      }

      for (const battle of battles) {
        battle.fightUntilTheEnd();

        console.log(battle.log);        
      }

      let winsTeam1 = 0;
      let winsTeam2 = 0;

      responseText += '\nThe battle is ON!\n'

      for (let i = 0; i < battles.length ; i++) {
        const m1 = monsters1[i]
        const m2 = monsters2[i]

        const result = battles[i].getResult();

        responseText += `${result.winningMonster} wins\n`
        if (result.winningTeam === 1) { 
          winsTeam1++;
        } else {
          winsTeam2++;
        }
      }

      const winningTeam = winsTeam1 > winsTeam2 ? 1 : 2;
      const wins = winsTeam1 > winsTeam2 ? winsTeam1 : winsTeam2;
      const losses = winsTeam1 < winsTeam2 ? winsTeam1 : winsTeam2;
      responseText += `\nTeam ${winningTeam} has WON (${wins} vs ${losses})\n`

      res.set('Content-Type', 'text/plain');
      res.send(responseText)
    });


    this.app.listen(this.port, () => {
     console.log(`Server running on port ${this.port}`);
    });
  }
}

export default Server;