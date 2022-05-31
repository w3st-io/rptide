// [IMPORT] //
import axios from 'axios'


// [INIT] //
const location = '/client/ProductService'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user/product',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
		}
	})
}


export default {
	authAxios,


	s_create: async function ({ product }) {
		try {
			const authAxios = await this.authAxios()
	
			const response = await authAxios.post('/create', product)

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


	s_update: async function ({ product }) {
		try {
			const authAxios = await this.authAxios()
	
			const response = await authAxios.post('/update', product)

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
	

	s_delete: async function ({ product_id }) {
		try {
			const authAxios = await this.authAxios()
	
			const response = await authAxios.post('/delete', {
				product_id: product_id
			})

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