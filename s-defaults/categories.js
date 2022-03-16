// [REQUIRE] //
const config = require('../s-config')


// [INIT] //
const baseURL = config.app.baseURL.server


module.exports = [
	{
		category: 'General',
		cats: [
			{
				cat_id: 'general',
				title: 'General Discussion',
				description: 'General discussions about anything relating to blockchain',
				index: 0,
				imgSrc: `${baseURL}/static/images/category-icons/message-square.svg`,
				recentPost: null,
				totalPosts: null,
			},
			{
				cat_id: 'news',
				title: 'News',
				description: 'Latest news about the industry',
				index: 1,
				imgSrc: `${baseURL}/static/images/category-icons/globe.svg`,
				recentPost: null,
				totalPosts: null,
			},
		],
	},
	{
		category: 'Trade Token Market Place',
		cats: [
			{
				cat_id: 'NFTs',
				title: 'Non-fungible tokens (NFTs)',
				description: 'Swap/trade, anything you want!',
				index: 2,
				imgSrc: `${baseURL}/static/images/category-icons/globe.svg`,
				recentPost: null,
				totalPosts: null,
			},
			{
				cat_id: 'prices',
				title: 'Prices',
				description: 'Discuss prices here!',
				index: 3,
				imgSrc: `${baseURL}/static/images/category-icons/dollar-sign.svg`,
				recentPost: null,
				totalPosts: null,
			},
		],
	},
	{
		category: 'Productivity',
		cats: [
			{
				cat_id: 'ideas',
				title: 'Dapp Ideas, Tips, Tricks',
				description: 'Share some ideas & find new partners!',
				index: 4,
				imgSrc: `${baseURL}/static/images/category-icons/zap.svg`,
				recentPost: null,
				totalPosts: null,
			},
			{
				cat_id: 'smart-contracts',
				title: 'Smart Contracts',
				description: 'Discuss smart contracts, share your smart contracts!',
				index: 5,
				imgSrc: `${baseURL}/static/images/category-icons/codesandbox.svg`,
				recentPost: null,
				totalPosts: null,
			},
			{
				cat_id: 'layertwo',
				title: 'Layer 2 Solutions',
				description: 'Discuss your favorite layer 2 solutions!',
				index: 6,
				imgSrc: `${baseURL}/static/images/category-icons/trending-up.svg`,
				recentPost: null,
				totalPosts: null,
			},
		],
	},
	{
		category: 'Education',
		cats: [
			{
				cat_id: 'help',
				title: 'Get Help',
				description: 'Need help? Ask us & we might be able to help with that!',
				index: 7,
				imgSrc: `${baseURL}/static/images/category-icons/flag.svg`,
				recentPost: null,
				totalPosts: null,
			},
			{
				cat_id: 'learn',
				title: 'Learn',
				description: 'Learn about blockchain & learn what it can do for you..',
				index: 8,
				imgSrc: `${baseURL}/static/images/category-icons/book-open.svg`,
				recentPost: null,
				totalPosts: null,
			},
			{
				cat_id: 'misc',
				title: 'Misc.',
				description: 'Anything uncategorized',
				index: 9,
				imgSrc: `${baseURL}/static/images/category-icons/archive.svg`,
				recentPost: null,
				totalPosts: null,
			},
		],
	},
	{
		category: 'Other',
		cats: [
			{
				cat_id: 'blogs',
				title: 'Blogs',
				description: 'Blogs',
				index: 7,
				imgSrc: `${baseURL}/static/images/category-icons/globe.svg`,
				recentPost: null,
				totalPosts: null,
			},
		],
	},
]