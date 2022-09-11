// [IMPORT]
import axios from 'axios'


// [INIT]
const location = '/client/src/services/ProductService'


// [AUTH-AXIOS]
const authAxios = axios.create({
	baseURL: '/api/product-option',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`,
	}
})


export default {
	s_create: async function ({ productOption }) {
		try {
			const res = await authAxios.post('/create', productOption)

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