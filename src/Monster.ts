import { rollD10, rollsCrit } from './DiceRoll';

const MIN_HITPOINTS = 10
const MIN_DAMAGE = 10
const SIZE_BONUS_MULTIPLIER = 0.05
const EFFECTIVENESS_MULTIPLIER = 2
const CRIT_MULTIPLIER = 5

/*
Monster business object (should have that more often in any project)
*/
class Monster {
	private _maxHitpoints: number
	private _height: number;
	private _weight: number;
	private _id: number;
	private _name: string;
	private _type: string[];
	private _img: string;
	private _weaknesses: string[];

	constructor(
			id: number, 
			name: string, 
			type: string[],
			img: string, 
			h: string,
			w: string,
			weaknesses: string[]) {

		this._id = id;
		this._name = name;
		this._type = type;
		this._img = img;

		this._height = parseFloat(h)
		this._weight = parseFloat(w)
		this._weaknesses = weaknesses;
		this._maxHitpoints = Math.round(MIN_HITPOINTS + this._height + this._weight)
	}

	isEffectiveAgainst(otherMonster: Monster): boolean {
		for(const t of this._type) {
			if (otherMonster._weaknesses.includes(t)) {
				return true;
			}	
		}
		return false;
	}

	/*
		Totally made-up logic to calculate how much damage a pokemon does to another.
		Factors in
		- base damage
		- size bonus
		- effectiveness
		- A D10 attack roll
		- possible critical bonus
	*/
	attacks(otherMonster: Monster): number {
		let damage = MIN_DAMAGE;

		const normalAttackRoll = rollD10();
		const sizeBonus = (this._weight - otherMonster._weight) * SIZE_BONUS_MULTIPLIER

		damage += normalAttackRoll;

		if (this.isEffectiveAgainst(otherMonster)) {
			damage *= EFFECTIVENESS_MULTIPLIER
		}

		damage += sizeBonus

		if (rollsCrit()) {
			damage *= CRIT_MULTIPLIER
		}

		return Math.round(damage);
	}

	get name(): string {
		return this._name;
	}

	get maxHitpoints(): number {
		return this._maxHitpoints;
	}

	get weight(): number {
		return this._weight;
	}
}

export default Monster;