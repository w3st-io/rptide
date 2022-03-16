// [IMPORT] Personal //
import coinbaseAPI from './coinbaseAPI'


export default {	
	// [COINBASE] //
	productHistoricRate: async function ({ exchange, product_id, timeFrame, candleCount }) {
		let returnVal

		switch (exchange) {
			case 'coinbase':
				returnVal = await coinbaseAPI.getProductHistoricRate({
					timeFrame: timeFrame,
					product_id: product_id,
					candleCount: candleCount,
				})
			break

			default:
				returnVal = {
					executed: true,
					status: false,
					location: '/client/src/crypto',
					message: 'Exchange not found and/or Supported'
				}
			break
		}

		return returnVal
	},


	getGranularity: function ({ exchange, timeFrame }) {
		let returnVal

		switch (exchange) {
			case 'coinbase':
				returnVal = coinbaseAPI.getGranularity({ timeFrame: timeFrame })
			break

			default:
				returnVal = {
					executed: true,
					status: false,
					location: '/client/src/crypto',
					message: 'Exchange not found and/or Supported'
				}
			break
		}

		return returnVal
	},
}