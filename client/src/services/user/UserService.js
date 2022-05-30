// [IMPORT] //
import jwtDecode from 'jwt-decode'
import axios from 'axios'


// [IMPORT] Personal //
import store from '@/store'


// [INIT] //
const location = 'UserService'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
			admin_authorization: `Bearer ${localStorage.admintoken}`
		}
	})
}


function checkIn() {
	if (localStorage.usertoken) {
		// [STORE][JWT] Get decoded //
		store.state.user.decoded = jwtDecode(localStorage.usertoken)

		// [STORE] //
		store.state.user.logged = true

		// [STORE][SOCKET] //
		store.state.socket.emit('user-login', store.state.user.decoded.user_id)
	}
}


function checkOut() {
	// [STORE][JWT] Get decoded //
	store.state.user.decoded = {}
		
	// [STORE] //
	store.state.user.logged = false

	// [EMIT] //
	store.state.socket.emit('user-logout')
}


export default {
	authAxios,
	

	/******************* [TOKEN-DECODE] *******************/
	s_getUserTokenDecodeData: async function () {
		if (localStorage.usertoken) { return jwtDecode(localStorage.usertoken) }
		else {
			return {
				user_id: '',
				email: '',
				username: '',
			}
		}
	},


	/******************* [CRUD] *******************/
	// [UPDATE] Auth Required //
	s_update: async function (img_url, bio) {
		try {
			const authAxios = await this.authAxios()
			
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
			const authAxios = await this.authAxios()
			
			const { data } = await authAxios.post('/login', { email, password })
			
			if (data.validation) {
				// [TOKEN] //
				localStorage.setItem('usertoken', data.token)
	
				checkIn()
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
	s_register: async function ({ username, email, password }) {
		try {
			const authAxios = await this.authAxios()
			
			const res = await authAxios.post(
				'/register',
				{ username, email, password }
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


	
	s_completeRegistration: async function (user_id, verificationCode) {
		try {
			const authAxios = await this.authAxios()
			
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
	s_checkIn: async function () { checkIn() },
	
	
	/******************* [VERIFY] *******************/
	s_resendVerificationEmail: async function (email) {
		try {
			const authAxios = await this.authAxios()
			
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
			const authAxios = await this.authAxios()
			
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
			const authAxios = await this.authAxios()
			
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
			const authAxios = await this.authAxios()
			
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
			const authAxios = await this.authAxios()

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