module.exports = {
	publicPath: '/',
	devServer: {
		proxy: {
			'^/api': {
				target: 'http://localhost:5000',
				ws: true,
				changeOrigin: true
			},
			'^/pages': {
				target: 'http://localhost:5000',
				ws: true,
				changeOrigin: true
			}
		}
	}
}