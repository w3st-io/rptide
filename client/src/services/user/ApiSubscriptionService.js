// [IMPORT] //
import axios from 'axios'


// [INIT] //
const location = '/client/ApiSubscriptionService'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user/api-subscription',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
		}
	})
}


export default {
	authAxios,


	s_update_pm: async function ({ cardName, cardNumber, cardMonth, cardYear, cardCvc }) {
		try {
			const authAxios = await this.authAxios()
	
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
			const authAxios = await this.authAxios()
	
			const response = await authAxios.post('/delete-pm')

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


	s_update_tier: async function ({ tier }) {
		try {
			const authAxios = await this.authAxios()
	
			console.log('switched');

			const response = await authAxios.post(`/update-tier-${tier}`)

			console.log(response);

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
}