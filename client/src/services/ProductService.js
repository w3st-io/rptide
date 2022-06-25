// [IMPORT] //
import axios from 'axios'


// [INIT] //
const location = '/client/ProductService'


// [AUTH-AXIOS] //
const authAxios = axios.create({
	baseURL: '/api/product',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`,
	}
})


export default {
	s_create: async function ({ product }) {
		try {
			const res = await authAxios.post('/create', product)

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


	s_update: async function ({ product }) {
		try {
			const res = await authAxios.post('/update', product)

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
	

	s_delete: async function ({ product_id }) {
		try {
			const res = await authAxios.post('/delete', { product_id })

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