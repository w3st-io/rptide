// [REQUIRE] //
const feather = require('feather-icons')


// [INIT] const //
const navIconConfig = {
	'stroke-width': 2,
	width: 18,
	height: 18,
	class: ''
}
const sideMenuIconConfig = {
	'stroke-width': 2.4,
	width: 34,
	height: 34,
	class: 'my-2'
}


module.exports = [
	{
		text: '',
		path: '/',
		navIcon: feather.icons.home.toSvg(navIconConfig),
		sideMenuIcon: feather.icons.home.toSvg(sideMenuIconConfig),
		subMenu: [],
	},
	{
		text: 'Dashboard',
		path: '/dashboard/unset/product/0/5/1',
		subMenu: [],
	},
	{
		text: 'Documentation',
		path: '/documentation',
		subMenu: [],
	},
]