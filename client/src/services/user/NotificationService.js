// [IMPORT] //
import axios from 'axios'


export default {
	// [AUTH-TOKEN-SETUP] //
	authAxios: async function () {
		return axios.create({
			baseURL: '/api/user/notification',
			headers: {
				user_authorization: `Bearer ${localStorage.usertoken}`,
				admin_authorization: `Bearer ${localStorage.admintoken}`
			}
		})
	},


	/******************* [OTHER-CRUD] *******************/
	s_readUnread: async function (sort, limit, page) {
		try {
			const authAxios = await this.authAxios()
	
			return (
				await authAxios.get(`/read-unread/${sort}/${limit}/${page}`)
			).data
		}
		catch (err) { return err }
	},


	/******************* [MARK-READ-STATUS] *******************/
	s_markRead: async function (notification_id) {
		try {
			const authAxios = await this.authAxios()
	
			return (await authAxios(`/mark-read/${notification_id}`)).data
		}
		catch (err) { return err }
	},
}