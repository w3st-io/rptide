// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user/post',
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
	s_create: async function (cat_id, title, cleanJSON) {
		try {
			const authAxios = await this.authAxios()
			
			const res = await authAxios.post('/create', { cat_id, title, cleanJSON })
			
			return res.data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostService: Error --> ${err}`
			}
		}
	},


	s_delete: async function ({ post_id }) {
		try {
			const authAxios = await this.authAxios()

			const res = await authAxios.post('/delete', { post_id })
			
			return res.data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostService: Error --> ${err}`
			}
		}
	},


	/******************* [LIKE-SYSTEM] *******************/
	// ADD/REMOVE LIKE //
	s_like: async function (post_id, postUser_id) {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.post('/like', { post_id, postUser_id })).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostService: Error --> ${err}`
			}
		}
	},


	s_unlike: async function (post_id) {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.post('/unlike', { post_id })).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostService: Error --> ${err}`
			}
		}
	},


	/******************* [FOLLOW SYSTEM] *******************/
	// ADD/REMOVE LIKE //
	s_follow: async function (post_id) {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.post('/follow', { post_id })).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostService: Error --> ${err}`
			}
		}
	}
	,


	s_unfollow: async function (post_id) {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.post('/unfollow', { post_id })).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostService: Error --> ${err}`
			}
		}
	},
}