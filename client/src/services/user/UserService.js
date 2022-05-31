// [IMPORT] //
import axios from 'axios'


// [IMPORT] Personal //
import store from '@/store'


// [INIT] //
const location = '/client/src/services/UserService'


// [AUTH-AXIOS] //
const authAxios = axios.create({
	baseURL: '/api/user',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`,
	}
})


async function checkIn() {
	if (localStorage.usertoken) {
		const res = await authAxios.post('/check-in')
		
		if (res.status) {
			// [STORE] //
			store.state.user = res.data.user
			store.state.dashboard.webApps = res.data.webApps
		
			// [STORE][SOCKET] //
			store.state.socket.emit('user-login', store.state.user.user_id)
		}
	}
}


function checkOut() {
	// [STORE][JWT] Get decoded //
	store.state.user = null
		
	// [STORE] //
	store.state.dashboard = {
		webApps: [],
		webApp: ''
	}

	// [STORE][SOCKET][EMIT] //
	store.state.socket.emit('user-logout')
}


export default {
	/******************* [CRUD] *******************/
	// [UPDATE] Auth Required //
	s_update: async function (img_url, bio) {
		try {
			return (await authAxios.post('/update', { img_url, bio })).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	/******************* [USER-LOGIN-LOGOUT-REGISTER-CHECKIN] *******************/
		// [LOGIN] //
	s_login: async function (email, password) {
		try {
			const { data } = await authAxios.post('/login', { email, password })
			
			if (data.validation) {
				// [TOKEN] //
				localStorage.setItem('usertoken', data.token)
	
				await checkIn()
			}
	
			return data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	// [LOGOUT] //
	s_logout: async function () {
		// [TOKEN] //
		localStorage.removeItem('usertoken')
		
		checkOut()
	},


	// [REGISTER] //
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


	// [CHECK-IN] //
	s_checkIn: async function () { await checkIn() },
	
	
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
	
	
	/******************* [PASSWORD] *******************/
	s_changePassword: async function (currentPassword, password) {
		try {
			return (
				await authAxios.post('/change-password', {
					currentPassword, password
				})
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


	s_generateApiKey: async function () {
		try {
			const res = await authAxios.post('/generate-api-key')
			
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
}