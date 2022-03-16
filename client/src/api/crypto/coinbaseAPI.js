// [IMPORT] //
import axios from 'axios'
import FuzzySearch from 'fuzzy-search'


// [IMPORT] Personal //
import cryptoUtil from './Util'


// [INIT] //
const coinbaseGranularities = [60, 300, 900, 3600, 21600, 86400]


export default {
	getGranularity: function ({ timeFrame }) {
		let returnVal

		switch (timeFrame) {
			case '1m':
				returnVal = coinbaseGranularities[0]
			break

			case '5m':
				returnVal = coinbaseGranularities[1]
			break

			case '15m':
				returnVal = coinbaseGranularities[2]
			break

			case '1h':
				returnVal = coinbaseGranularities[3]
			break

			case '6h':
				returnVal = coinbaseGranularities[4]
			break

			case '1d':
				returnVal = coinbaseGranularities[5]
			break
		}

		return returnVal
	},


	searchProducts: async function ({ query }) {
		try {
			const {
				data: products
			} = await axios.get('https://api.pro.coinbase.com/products')
	
			//console.log(data)
	
			const searcher = new FuzzySearch(
				products,
				['id', 'base_currency', 'display_name'],
				{ caseSensitive: false, }
			)
			
			const results = searcher.search(query)
	
			return {
				executed: true,
				status: true,
				results: results,
			}	
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: '/client/src/crypto/coinbase:',
				message: `Error --> ${err}`,
			}
		}
	},


	// [READ] Product price history //
	getProductHistoricRate: async function ({ timeFrame, product_id, candleCount = 300 }) {
		try {
			// [INIT] //
			let graph = {
				labels: [],
				times: [],
				opens: [],
				highs: [],
				lows: [],
				closes: [],
				volumes: [],
			}

			const { data } = await axios.get(`
				https://api.pro.coinbase.com
				/products/${product_id}
				/candles?granularity=${this.getGranularity({ timeFrame })}
			`)

			// [INSERT] graph data recieved //
			if (data) {
				for (let i = 0; i < candleCount; i++) {
					const d = data[i]
					
					// [CONVERT] ISO to Timestamp //
					d[0] = new Date(d[0] * 1000)
	
					// Generate labels based on timeframe //
					const labels = cryptoUtil.labelGenerator(timeFrame, d[0])
	
					graph.labels.unshift(labels)
					graph.times.unshift(d[0])
					graph.opens.unshift(d[3])
					graph.highs.unshift(d[2])
					graph.lows.unshift(d[1])
					graph.closes.unshift(d[4])
					graph.volumes.unshift(d[5])
				}
				
				return {
					executed: true,
					status: true,
					data: data,
					graph: graph,
				}
			}
			else {
				return {
					executed: true,
					status: false,
					location: '/client/src/crypto/coinbase:',
					message: 'Error: Data not recieved',
				}
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: '/client/src/crypto/coinbase:',
				message: `Error --> ${err}`,
			}
		}
	},
}