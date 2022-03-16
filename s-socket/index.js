// [REQUIRE] Personal //
const socketService = require('./socketService')


module.exports = {
	start: (io) => {
		io.on('connection', (socket) => {
			// [JOIN] sockets //
			socketService.joinSockets(socket.id)


			// [EMIT] User //
			//socket.emit('user', socketService.getUserSocket(socket.id))
		

			// [ON] User Join //
			socket.on('user-login', (user_id) => {
				// [EXISTANCE] user_id not in room // 
				if (user_id) { socketService.joinSocketUsers(socket.id, user_id) }
			})
			

			// [ON] asset subscribe //
			socket.on('asset-subscribe', (exchange, product_id, timeFrame) => {
				socket.join(`${exchange}-${product_id}`)
				socket.join(`${exchange}-${timeFrame}`)

				io.to(`${exchange}-${product_id}`).emit(
					'asset-data',
					'connection establised'
				)

				socketService.joinSocketsCoinbase({
					socket_id: socket.id,
					exchange: exchange,
					product_id: product_id
				})
			})


			// [ON] asset unsubscribe //
			socket.on('asset-unsubscribe', () => {
				socketService.leaveSocketsCoinbase({ socket_id: socket.id, })
			})

		
			// [ON] User Leave //
			socket.on('user-logout', () => { socketService.userLogout(socket.id) })
		
		
			// [ON] Disconnect //
			socket.on('disconnect', () => { socketService.disconnected(socket.id) })
		})
	},
}