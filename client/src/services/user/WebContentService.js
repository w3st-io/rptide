// [IMPORT] //
import axios from 'axios'


// [INIT] //
const location = 'WebAppService'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user/web-content',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`
		}
	})
}


export default {
	authAxios,
	

	/******************* [TOKEN-DECODE] *******************/
	s_create: async function () {
		try {
			const authAxios = await this.authAxios()
	
			const response = await authAxios.post('/create', {})

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