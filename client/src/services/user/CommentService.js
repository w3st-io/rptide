// [IMPORT] //
import axios from 'axios'


// [INIT] //
const location = 'CommentService'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/user/comment',
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
	s_create: async function (post_id, cleanJSON, replyToComment_id = null) {
		try {
			const authAxios = await this.authAxios()
			
			return (
				await authAxios.post(
					'/create',
					{ post_id, cleanJSON, replyToComment_id }
				)
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	// [UPDATE] Auth Required //
	s_update: async function (comment_id, cleanJSON) {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.post('/update', { comment_id, cleanJSON })).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	// [DELETE] Auth Required //
	s_delete: async function (comment_id) {
		try {
			const authAxios = await this.authAxios()	
	
			return (await authAxios.delete(`/delete/${comment_id}`)).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	/******************* [LIKE-SYSTEM] *******************/
	// ADD/REMOVE LIKE //
	s_like: async function s_like(post_id, comment_id, commentUser_id) {
		try {
			const authAxios = await this.authAxios()
	
			// Add the liker from the Post Object
			return (
				await authAxios.post('/like', { post_id, comment_id, commentUser_id })
			).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	s_unlike: async function (comment_id) {
		try {
			const authAxios = await this.authAxios()
	
			// Remove the liker from the Post Object
			return (await authAxios.post('/unlike', { comment_id })).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	/******************* [REPORT] *******************/
	s_report: async function (post_id, comment_id, reportType) {
		try {
			const authAxios = await this.authAxios()

			return (
				await authAxios.post('/report', { post_id, comment_id, reportType })
			).data
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