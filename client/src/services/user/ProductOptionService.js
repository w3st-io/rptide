// [IMPORT] //
import axios from 'axios'


// [INIT] //
const location = '/client/ProductService'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user/product-option',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
		}
	})
}


export default {
	authAxios,


	s_create: async function ({ productOption }) {
		try {
			const authAxios = await this.authAxios()
	
			const response = await authAxios.post('/create', productOption)

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