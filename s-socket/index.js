// [REQUIRE] Personal //
const socketService = require('./socketService')


module.exports = {
	start: (io) => {
		io.on('connection', (socket) => {
			// [JOIN] sockets //
			socketService.joinSockets(socket.id)
		

			// [ON] User Join //
			socket.on(
				'user-login',
				(user_id) => {
					// [EXISTANCE] user_id not in room // 
					if (user_id) {
						socketService.joinSocketUsers(socket.id, user_id)
					}
				}
			)

		
			// [ON] User Leave //
			socket.on('user-logout', () => { socketService.userLogout(socket.id) })
		
		
			// [ON] Disconnect //
			socket.on('disconnect', () => { socketService.disconnected(socket.id) })
		})
	},
}