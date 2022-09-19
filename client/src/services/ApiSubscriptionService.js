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
	s_update_tier: async function ({ tier }) {
		try {
			const res = await authAxios.post('/update/tier', { tier });

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