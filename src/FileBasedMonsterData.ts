import { readFileSync } from 'fs'

import Monster from './Monster'

class FileBasedMonsterDataProvider {
    private _data: Map<number, Monster>;

    constructor() {
        const dataBuffer = readFileSync('./pokedex.txt');
        const pokemonData = JSON.parse(dataBuffer.toString());

        this._data = new Map(); 

        for (const m of pokemonData.pokemon) {
            const monster = new Monster(m.id, 
                m.name,
                m.type,
                m.img,
                m.height,
                m.weight,
                m.weaknesses)
            this._data.set(m.id, monster)
        }
    }

    get data(): Map<number, Monster> {
        return this._data;
    }
}

export default FileBasedMonsterDataProvider;