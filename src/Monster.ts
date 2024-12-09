const MIN_HITPOINTS = 10

class Monster {

	public maxHitpoint: number

	constructor(
			public id: number, 
			public name: string, 
			public type: string[],
			public img: string, 
			public height: number,
			public weight: number,
			public weaknesses: string[]) {

		this.maxHitpoint = MIN_HITPOINTS + height * weight
		// console.log(`${this.name} has ${this.maxHitpoint} hitpoints`)
	}
}

export default Monster;