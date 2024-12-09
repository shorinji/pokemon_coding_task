import express, { Express, Response, Request, NextFunction } from 'express'
import { readFileSync } from 'fs'

import Monster from './monster'

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'dev';
const IS_DEV = (NODE_ENV === 'development');

const app: Express = express();

const dataBuffer = readFileSync('./pokedex.txt');
const pokemonData = JSON.parse(dataBuffer.toString());

const monsterDataById: Map<number, Monster> = new Map(); 

for (const m of pokemonData.pokemon) {
  const monster = new Monster(m.id, 
      m.name,
      m.type,
      m.img,
      parseInt(m.height as string, 10),
      parseInt(m.weight as string, 10),
      m.weaknesses)
  monsterDataById.set(m.id, monster)
}

// hide error dump in production
if (IS_DEV) {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
      message: err.message,
      stack: err.stack
    });
  });
} else {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
      message: 'Something went wrong'
    });
  });
}

app.get('/', (req: Request, res: Response) => {
  res.send('root request');
});


app.get('/battle/', (req: Request, res: Response) => {
  let responseText = '';

  if(req.query.id1 === undefined || req.query.id2 === undefined) {
    res.status(400);
    if (IS_DEV) {
      responseText = "missing mandatory query parameters id1 and id2"
    }
    res.send(responseText)
    return;
  }

  const id1 = parseInt(req.query.id1 as string, 10);
  const id2 = parseInt(req.query.id2 as string, 10);

  if (!monsterDataById.has(id1)) {
    res.status(400);
    if (IS_DEV) {
      responseText = `invalid id1=${id1}`
    }

    res.send(responseText)  
    return;
  }
  if (!monsterDataById.has(id2)) {
    res.status(400)
    if (IS_DEV) {
      responseText = `invalid id2=${id2}`
    }
    res.send(responseText)
    return;
  }

  const m1 = monsterDataById.get(id1);
  const m2 = monsterDataById.get(id2);

  if (m1 === undefined || m2 === undefined) {
    res.status(500);
    if (IS_DEV) {
      responseText = "Unable to load monster data";
    }
    res.send(responseText)
    return;
  }

  

  res.send(`we have a fight between ${m1.name} and ${m2.name}`)
});


app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});



/*
for (const m of monsters) {
  console.log(m.name, "weights",m.weight,", has type",m.type, "and is weak to", m.weaknesses)
}
*/