// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/admin/comment',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
			admin_authorization: `Bearer ${localStorage.admintoken}`
		}
	})
}


/******************* [CRUD] *******************/
// [DELETE] //
async function s_delete(comment_id) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.delete(`/delete/${comment_id}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `ACommentService: Error --> ${err}`
		}
	}
}


// [EXPORT] //
export default {
	authAxios,
	s_delete,
}