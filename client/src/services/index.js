// [IMPORT]
import axios from 'axios';


// [INIT]
const location = '/client/src/services';


// [AUTH-AXIOS]
const authAxios = axios.create({
	baseURL: '/api',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`,
	}
});


export default {
	s_requestResetPassword: async function (email) {
		try {
			return (await authAxios.post('/request-reset-password', { email })).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},

	
	s_notLoggedResetPassword: async function (user_id, verificationCode, password) {
		try {
			return (
				await authAxios.post(
					'/reset-password',
					{
						user_id,
						verificationCode,
						password
					}
				)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},
}