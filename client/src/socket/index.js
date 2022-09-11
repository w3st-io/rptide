// [IMPORT] Personal
import { EventBus } from '@/main'
import store from '../store'

export default {
	// [INIT] Initial setup
	initialize: async function () {
		try {
			EventBus.$emit('update-notification')

			// [NOTIFICATIONS] Upon recieving socket update-notification
			store.state.socket.on('update-notification', () => {
				setTimeout(() => { EventBus.$emit('update-notification') }, 1500)
			})
		}
		catch (err) { `Socket: Error --> ${err}` }
	},
}