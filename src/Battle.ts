import Monster from './Monster'
import { rollD10 } from './DiceRoll'


/*
	Convinience Data bearer class for the result of a Battle.
*/
class BattleResult {
	constructor(public message: string, 
		public winningMonster: string,
		public winningTeam: number) {
	}
}

/*
	Represent a battle between two monsters.

	_firstMonster gets to hit first. This is decided by the logic below.

	Note: the order of attacking is not connected to in what order the
	monsters were passed into the constructor
*/
class Battle {
	private _log: string[] = [];
	private _firstMonster: Monster;
	private _secondMonster: Monster;
	private _firstMonsterTeam: number;
	private _secondMonsterTeam: number;
	private _firstMonsterCurrentHitpoints: number;
	private _secondMonsterCurrentHitpoints: number;

	/*
	Totally made-up logic to determine which of the monsters
	are faster, and therefore get to attack first.
	- If a monster type is effective against the other, it gets a little more speed
	- If it weights less, it gets a little more speed
	- Also each monster gets a D10 roll to determine its form for the day
	*/
	isM1Faster(m1: Monster, m2: Monster): boolean {
		let speedM1 = 10
		let speedM2 = 10

		if (m1.isEffectiveAgainst(m2)) {
			speedM1 += 10
		}

		if (m2.isEffectiveAgainst(m1)) {
			speedM2 += 10
		}

		if (m1.weight < m2.weight) {
			speedM1 += 10
		} else {
			speedM2 += 10
		}

		speedM1 += rollD10()
		speedM2 += rollD10()

		return speedM1 > speedM2
	}

	constructor(
			public m1: Monster,
			public m2: Monster) {

		console.log(`setting up battle between ${m1.name} and ${m2.name}`)
		if (this.isM1Faster(m1, m2)) {
			this._firstMonster = m1
			this._secondMonster = m2
			this._firstMonsterTeam = 1;
			this._secondMonsterTeam = 2;
		} else {
			this._firstMonster = m2
			this._secondMonster = m1
			this._firstMonsterTeam = 2;
			this._secondMonsterTeam = 1;
		}
		
		this._firstMonsterCurrentHitpoints = this._firstMonster.maxHitpoints
		this._secondMonsterCurrentHitpoints = this._secondMonster.maxHitpoints
	}

	public isOver(): boolean {
		return this._firstMonsterCurrentHitpoints < 1|| this._secondMonsterCurrentHitpoints < 1
	}

	/*
		Each monster attacks the other in order, and the damage is calculated.
		If a monster's hitpoints reaches 0, the round is cut short
	*/
	public fightNextRound(): void {
		let damage: number;

		damage = this._firstMonster.attacks(this._secondMonster);
		this._secondMonsterCurrentHitpoints = Math.max(this._secondMonsterCurrentHitpoints - damage, 0)
		let attackLog = `${this._firstMonster.name} attacks ${this._secondMonster.name} for ${damage} hitpoints (${this._secondMonsterCurrentHitpoints} remains)`
		this.log.push(attackLog);
		if (this._secondMonsterCurrentHitpoints < 1) {
			this.log.push(`${this._secondMonster.name} is defeated`)
			return;
		}
	
		damage = this._secondMonster.attacks(this._firstMonster);
		this._firstMonsterCurrentHitpoints = Math.max(this._firstMonsterCurrentHitpoints - damage, 0)
		attackLog = `${this._secondMonster.name} attacks ${this._firstMonster.name} for ${damage} hitpoints (${this._firstMonsterCurrentHitpoints} remains)`
		this.log.push(attackLog);

		if (this._firstMonsterCurrentHitpoints < 1) {
			this.log.push(`${this._firstMonster.name} is defeated`)
		}
	}

	/*
		Fight until the death. Not really - this is a kids-friendly game after all!
	*/
	public fightUntilTheEnd() {
		while (!this.isOver()) {
			this.fightNextRound();
		}
	}

	public get log(): string[] {
		return this._log
	}

	/*
		Returns status after the battle to determine who won, and which team the
		monster was on.
	*/
	getResult(): BattleResult {
		
		let message = `Battle between ${this._firstMonster.name} and ${this._secondMonster.name} `;
		let winningMonster: string;
		let winningTeam: number;

		if (this._firstMonsterCurrentHitpoints < 1) {
			winningMonster = this._secondMonster.name
			winningTeam = this._secondMonsterTeam
			message += `ended with ${this._secondMonster.name} as the winner`
		} else if (this._secondMonsterCurrentHitpoints < 1) {
			winningMonster = this._firstMonster.name
			winningTeam = this._firstMonsterTeam
			message += `ended with ${this._firstMonster.name} as the winner`
		} else {
			message += 'is still raging!'
			winningMonster = ''
			winningTeam = 0
		}

		return new BattleResult(message, winningMonster, winningTeam);
	}
}

export { Battle, BattleResult };