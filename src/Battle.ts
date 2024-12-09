import Monster from './Monster'
import { rollD10 } from './DiceRoll'
// TODO: replace public by private

class BattleResult {
	constructor(public message: string, 
		public winningMonster: string,
		public winningTeam: number) {
	}
}

class Battle {
	public roundNum: number = 0;
	private _log: string[] = [];
	public firstMonsterCurrentHitpoints: number;
	public secondMonsterCurrentHitpoints: number;
	public firstMonster: Monster;
	public secondMonster: Monster;
	public firstMonsterTeam: number;
	public secondMonsterTeam: number;

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

		// determine order of monster attacks.
		if (this.isM1Faster(m1, m2)) {
			this.firstMonster = m1
			this.secondMonster = m2
			this.firstMonsterTeam = 1;
			this.secondMonsterTeam = 2;
		} else {
			this.firstMonster = m2
			this.secondMonster = m1
			this.firstMonsterTeam = 2;
			this.secondMonsterTeam = 1;
		}
		
		this.firstMonsterCurrentHitpoints = this.firstMonster.maxHitpoints
		this.secondMonsterCurrentHitpoints = this.secondMonster.maxHitpoints
	}

	public isOver(): boolean {
		return this.firstMonsterCurrentHitpoints < 1|| this.secondMonsterCurrentHitpoints < 1
	}

	public fightNextRound(): void {
		this.roundNum++;

		let damage: number;

		damage = this.firstMonster.attacks(this.secondMonster);
		this.secondMonsterCurrentHitpoints = Math.max(this.secondMonsterCurrentHitpoints - damage, 0)
		let attackLog = `${this.firstMonster.name} attacks ${this.secondMonster.name} for ${damage} hitpoints (${this.secondMonsterCurrentHitpoints} remains)`
		this.log.push(attackLog);
		if (this.secondMonsterCurrentHitpoints < 1) {
			this.log.push(`${this.secondMonster.name} is defeated`)
			return;
		}
	
		damage = this.secondMonster.attacks(this.firstMonster);
		this.firstMonsterCurrentHitpoints = Math.max(this.firstMonsterCurrentHitpoints - damage, 0)
		attackLog = `${this.secondMonster.name} attacks ${this.firstMonster.name} for ${damage} hitpoints (${this.firstMonsterCurrentHitpoints} remains)`
		this.log.push(attackLog);

		if (this.firstMonsterCurrentHitpoints < 1) {
			this.log.push(`${this.firstMonster.name} is defeated`)
		}
	}

	public fightUntilTheEnd() {
		while (!this.isOver()) {
			this.fightNextRound();
		}
	}

	public get log(): string[] {
		return this._log
	}

	getResult(): BattleResult {
		
		let message = `Battle between ${this.firstMonster.name} and ${this.secondMonster.name} `;
		let winningMonster: string;
		let winningTeam: number;

		if (this.firstMonsterCurrentHitpoints < 1) {
			winningMonster = this.secondMonster.name
			winningTeam = this.secondMonsterTeam
			message += `ended with ${this.secondMonster.name} as the winner`
		} else if (this.secondMonsterCurrentHitpoints < 1) {
			winningMonster = this.firstMonster.name
			winningTeam = this.firstMonsterTeam
			message += `ended with ${this.firstMonster.name} as the winner`
		} else {
			message += 'is still raging!'
			winningMonster = ''
			winningTeam = 0
		}

		return new BattleResult(message, winningMonster, winningTeam);
	}
}

export { Battle, BattleResult };