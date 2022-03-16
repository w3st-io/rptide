function minuteFormatter(n) {
	return n > 9 ? "" + n: "0" + n;
}

module.exports = {
	labelGenerator: function (timeFrame, v) {
		const month = v.getMonth() + 1
		const day = v.getDate()
		const hour = v.getHours()
		const minute = v.getMinutes()
		let returnValue
		
		switch (timeFrame) {
			case '1m':
				returnValue = `${hour}:${minuteFormatter(minute)}`
			break

			case '5m':
				returnValue = `${hour}:${minuteFormatter(minute)}`
			break

			case '15m':
				returnValue = `${hour}:${minuteFormatter(minute)}`
			break

			case '1h':
				returnValue = `${hour}:${minuteFormatter(minute)}`
			break

			case '6h':
				returnValue = `${hour}:${minuteFormatter(minute)}`
			break

			case '1d':
				returnValue = `${month}/${day}`
			break
		}

		return returnValue
	},
}