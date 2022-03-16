// [IMPORT] //
import axios from 'axios'


// [INIT] //
const location = 'BlogPostService'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user/blog-post',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
			admin_authorization: `Bearer ${localStorage.admintoken}`
		}
	})
}


// [EXPORT] //
export default {
	authAxios,


	/******************* [CRUD] *******************/
	// [CREATE] Auth Required //
	s_create: async function (title, cleanJSON) {
		try {
			const authAxios = await this.authAxios()
			
			const res = await authAxios.post('/create', { title, cleanJSON })
			
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


	s_delete: async function ({ blogPost_id }) {
		try {
			const authAxios = await this.authAxios()

			const res = await authAxios.post('/delete', { blogPost_id })
			
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