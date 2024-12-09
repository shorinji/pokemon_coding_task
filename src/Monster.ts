import { rollD10, rollsCrit } from './DiceRoll';

const MIN_HITPOINTS = 10
const MIN_DAMAGE = 10
const SIZE_BONUS_MULTIPLIER = 0.05
const EFFECTIVENESS_MULTIPLIER = 2
const CRIT_MULTIPLIER = 5

class Monster {

	public maxHitpoints: number
	public height: number;
	public weight: number;

	constructor(
			public id: number, 
			public name: string, 
			public type: string[],
			public img: string, 
			h: string,
			w: string,
			public weaknesses: string[]) {

		this.height = parseFloat(h)
		this.weight = parseFloat(w)

		this.maxHitpoints = Math.round(MIN_HITPOINTS + this.height + this.weight)
	}

	isEffectiveAgainst(otherMonster: Monster): boolean {
		for(const t of this.type) {
			if (otherMonster.weaknesses.includes(t)) {
				return true;
			}	
		}
		return false;
	}

	attacks(otherMonster: Monster): number {
		let damage = MIN_DAMAGE;

		const normalAttackRoll = rollD10();
		const sizeBonus = (this.weight - otherMonster.weight) * SIZE_BONUS_MULTIPLIER

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
}

export default Monster;