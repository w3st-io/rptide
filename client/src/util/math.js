export default {
	percentChange: (oldV, newV) => {
		const difference = newV - oldV
		const returnVal = difference / oldV * 100

		return returnVal
	},
}