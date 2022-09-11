// [IMPORT]
import axios from 'axios'


// [AUTH-AXIOS]
const authAxios = axios.create({
	baseURL: '/api/mail',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`,
	}
})


export default {
	s_careers: async function (formData) {
		try {
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