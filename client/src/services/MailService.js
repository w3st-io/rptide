// [IMPORT] //
import axios from 'axios'


// [AUTH-TOKEN-SETUP] //
async function authAxios() {
	return axios.create({
		baseURL: '/api/mail',
		headers: {
			user_authorization: `Bearer ${localStorage.usertoken}`,
			admin_authorization: `Bearer ${localStorage.admintoken}`
		}
	})
}


export default {
	authAxios,


	s_careers: async function (formData) {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios.post('/careers', formData)).data
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `MailService: Error --> ${err}`,
			}
		}
	},
}