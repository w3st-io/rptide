// [IMPORT] //
import axios from 'axios'


// [AUTH-AXIOS] //
const authAxios = axios.create({
	baseURL: '/api',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`,
	}
})


// [EXPORT] //
export default {
	index: async function () {
		const { data } = await authAxios.get('/')
		
		return data
	},
}