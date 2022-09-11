// [IMPORT]
import axios from 'axios'


// [AUTH-TOKEN-SETUP]
async function authAxios() {
	return axios.create({
		baseURL: '/api/admin/user',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
		}
	})
}


/******************* [USER PROFILE] *******************/
async function s_banUser(user_id, hours) {
	try {
		const authAxios = await this.authAxios()

		return (await authAxios.get(`/ban/${user_id}/${hours}`)).data
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserService: Error --> ${err}`
		}
	}
}


// [EXPORT]
export default {
	authAxios,
	s_banUser,
}