// [IMPORT] //
import axios from 'axios'


// [INIT] //
const location = 'WebAppService'


// [AUTH-AXIOS] //
const authAxios = axios.create({
	baseURL: '/api/user/web-content',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`
	}
})


export default {
	/******************* [TOKEN-DECODE] *******************/
	s_create: async function (webContent) {
		try {
			const res = await authAxios.post('/create', { webContent })

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

	/******************* [TOKEN-DECODE] *******************/
	s_find: async function ({ webApp }) {
		try {
			const res = await authAxios.post('/find', { webApp })

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