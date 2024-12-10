import { readFileSync } from 'fs'

import Monster from './Monster'

class MonsterDataProvider {
    protected _data: Map<number, Monster>;

    constructor() {
        this._data = new Map();
    }

    public get data(): Map<number, Monster> {
        return this._data;
    }

    protected set data(_data: Map<number, Monster>) {
        this._data = _data;
    }
}

class FileBasedMonsterDataProvider extends MonsterDataProvider {

    constructor() {
        super();

        const dataBuffer = readFileSync('./pokedex.txt');
        const pokemonData = JSON.parse(dataBuffer.toString());

        let data = new Map<number, Monster>();
        for (const m of pokemonData.pokemon) {
            const monster = new Monster(m.id, 
                m.name,
                m.type,
                m.img,
                m.height,
                m.weight,
                m.weaknesses)
            data.set(m.id, monster)
        }
        this._data = data;
    }

}

export { 
    MonsterDataProvider, 
    FileBasedMonsterDataProvider 
};