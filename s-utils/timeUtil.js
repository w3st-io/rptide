module.exports = {
	pastTimeByMinutes: (t) => {
		let time = new Date()
		time.setMinutes(time.getMinutes() - t)
	
		return time
	},


	secondsTillNext1MinInterval: () => {
		const seconds = 60 - new Date().getSeconds()
		
		console.log(`5m Time Till Intiation: ${seconds}`)
		
		return seconds
	},


	secondsTillNext5MinInterval: () => {
		// [INIT]
		const coeff = 1000 * 60 * 5
		
		// [TIME] //
		const now = new Date()
		const nextInterval = new Date(Math.ceil(now.getTime() / coeff) * coeff)

		// [CALCULATE] //
		const seconds = Math.abs(nextInterval - now) / 1000

		console.log(`5m Time Till Intiation: ${seconds}`)

		return seconds
	},


	secondsTillNext15MinInterval: () => {
		// [INIT]
		const coeff = 1000 * 60 * 15
		
		// [TIME] //
		const now = new Date()
		const nextInterval = new Date(Math.ceil(now.getTime() / coeff) * coeff)
		
		// [CALCULATE] //
		const seconds = Math.abs(nextInterval - now) / 1000

		console.log(`15m Time Till Intiation: ${seconds}`)

		return seconds
	},


	secondsTillNext1HourInterval: () => {
		// [INIT]
		const coeff = 1000 * 60 * 60
		
		// [TIME] //
		const now = new Date()
		const nextInterval = new Date(Math.ceil(now.getTime() / coeff) * coeff)
		
		// [CALCULATE] //
		const seconds = Math.abs(nextInterval - now) / 1000

		console.log(`1h Time Till Intiation: ${seconds}`)

		return seconds
	},


	secondsTillNext6HourInterval: () => {
		// [INIT]
		const coeff = 1000 * 60 * 360

		// [TIME] //
		const now = new Date()
		const nextInterval = new Date(Math.ceil(now.getTime() / coeff) * coeff)

		// [CALCULATE] //
		const seconds = Math.abs(nextInterval - now) / 1000

		console.log(`6h Time Till Intiation: ${seconds}`)

		return seconds
	},

	secondsTillNext1DayInterval: () => {
		// [INIT]
		const coeff = 1000 * 60 * 1440

		// [TIME] //
		const now = new Date()
		const nextInterval = new Date(Math.ceil(now.getTime() / coeff) * coeff)

		// [CALCULATE] //
		const seconds = Math.abs(nextInterval - now) / 1000

		console.log(`1d Time Till Intiation: ${seconds}`)

		return seconds
	},
}