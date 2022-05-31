// [IMPORT] //
import axios from 'axios'


// [INIT] //
const location = 'WebAppService'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user/web-app',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
		}
	})
}


export default {
	authAxios,
	

	/******************* [TOKEN-DECODE] *******************/
	s_create: async function ({ title }) {
		try {
			const authAxios = await this.authAxios()
	
			const res = await authAxios.post('/create', { title })

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

	s_find: async function () {
		try {
			const res = await authAxios.post('/finnd')
			
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