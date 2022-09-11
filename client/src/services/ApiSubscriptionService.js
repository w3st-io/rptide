// [IMPORT]
import axios from 'axios'


// [INIT]
const location = '/client/ApiSubscriptionService'


// [AUTH-AXIOS]
const authAxios = axios.create({
	baseURL: '/api/api-subscription',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`,
	}
})


export default {
	s_update_pm: async function ({ cardName, cardNumber, cardMonth, cardYear, cardCvc }) {
		try {
			const response = await authAxios.post(
				'/update-pm',
				{
					cardName,
					cardNumber,
					cardMonth,
					cardYear,
					cardCvc 
				}
			)

			return response.data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`,
			}
		}
	},


	s_delete_pm: async function () {
		try {
			const res = await authAxios.post('/delete-pm')

			return res.data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`,
			}
		}
	},


	s_update_tier: async function ({ tier }) {
		try {
			const res = await authAxios.post(`/update-tier-${tier}`)

			return res.data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`,
			}
		}
	},
}