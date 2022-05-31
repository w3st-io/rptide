// [IMPORT] //
import axios from 'axios'


// [INIT] //
const location = 'WebAppService'


// [AUTH-AXIOS] //
const authAxios = axios.create({
	baseURL: '/api/user/web-app',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`,
	}
})


export default {
	/******************* [TOKEN-DECODE] *******************/
	s_create: async function ({ title }) {
		try {
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
			const res = await authAxios.post('/find')
			
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