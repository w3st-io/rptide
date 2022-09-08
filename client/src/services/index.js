// [IMPORT] //
import axios from 'axios';


// [IMPORT] Personal //
import store from '@/store';


// [INIT] //
const location = '/client/src/services';


// [AUTH-AXIOS] //
const authAxios = axios.create({
	baseURL: '/api',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`,
	}
});


export default {
	/******************* [USER-LOGIN-LOGOUT-REGISTER] *******************/
	// [LOGIN]
	s_login: async function (email, password) {
		try {
			const { data } = await authAxios.post('/login', { email, password });
			
			if (data.validation) {
				// [LOCAL-STORAGE] usertoken
				localStorage.setItem('usertoken', data.token);

				// [STORE]
				// user
				store.state.user = data.user;
				// webApps
				store.state.webApps = data.webApps;
				// key
				store.state.key++;
			}
	
			return data;
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			};
		}
	},


	// [REGISTER]
	s_register: async function ({ email, password }) {
		try {
			return (await authAxios.post('/register', { email, password })).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	
	s_completeRegistration: async function (user_id, verificationCode) {
		try {
			const res = await authAxios.post(
				'/complete-registration',
				{ user_id, verificationCode }
			)
			
			return res.data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},
	
	
	/******************* [VERIFY] *******************/
	s_resendVerificationEmail: async function (email) {
		try {
			return (
				await authAxios.post('/resend-verification-email', { email })
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