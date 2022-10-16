// [IMPORT]
import axios from 'axios';


// [INIT]
const location = '/client/src/services/UserService';


// [AUTH-AXIOS]
const authAxios = axios.create({
	baseURL: '/api/user',
	headers: {
		user_authorization: `Bearer ${localStorage.usertoken}`,
	}
});


export default {
	/******************* [PASSWORD] *******************/
	s_update_password: async function (currentPassword, password) {
		try {
			return (
				await authAxios.post('/update/password', {
					currentPassword, password
				})
			).data;
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			};
		}
	},
}