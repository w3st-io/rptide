// [IMPORT] //
import Vue from 'vue'
import Router from 'vue-router'


// [IMPORT] Personal (Ordered by path) //
import companyInfo from '@/defaults/companyInfo'
// Index //
import index from '@/pages'
// Admin //
import admin from '@/pages/admin'
import admin_function_commentReports from '@/pages/admin/function/comment-reports'
import admin_function_comments from '@/pages/admin/function/comments'
import admin_function_posts from '@/pages/admin/function/posts'
import admin_function_users from '@/pages/admin/function/users'
import admin_login from '@/pages/admin/login'
import admin_profile from '@/pages/admin/profile'
import admin_register from '@/pages/admin/register'
// Blog Post //
import blogPost_create from '@/pages/blog-post/create'
import blogPost_read from '@/pages/blog-post/read'
// Cat //
import cat from '@/pages/cat'
// Comment //
import comment_create from '@/pages/comment/create'
import comment_edit from '@/pages/comment/edit'
import comment_reply from '@/pages/comment/reply'
// Dashboard //
import dashboard from '@/pages/dashboard'
// Documentation //
import documentation from '@/pages/documentation'
// Email //
import emailSent from '@/pages/email-sent'
// Followed //
import followed from '@/pages/followed'
// Notification //
import notification from '@/pages/notification'
// Product //
import product_create from '@/pages/product/create'
import product_read from '@/pages/product/read'
// Product Options //
import productOption_create from '@/pages/product-option/create'
// Post //
import post from '@/pages/post'
import post_create from '@/pages/post/create'
// User //
import user from '@/pages/user'
import user_login from '@/pages/user/login'
import user_password_change from '@/pages/user/password/change'
import user_password_request from '@/pages/user/password/request'
import user_password_reset from '@/pages/user/password/reset'
import user_profile from '@/pages/user/profile'
import user_profile_edit from '@/pages/user/profile/edit'
import user_profile_lookup from '@/pages/user/profile/lookup'
import user_verify from '@/pages/user/verify'
import user_register from '@/pages/user/register'
import user_registered from '@/pages/user/registered'
// Search //
import search from '@/pages/search'
// Section Text //
import sectionText_create from '@/pages/section-text/create'
import sectionText_read from '@/pages/section-text/read'
// z //
import z from '@/pages/z'
// Not-Found //
import NotFound from '@/pages/404'


// [USE] //
Vue.use(Router)


// [EXPORT] //
const router = new Router ({
	mode: 'history',

	routes: [
		// Index //
		{
			path: '/',
			name: '/',
			component: index,
			meta: {
				auth: true,
				title: 'Home'
			}
		},
		// Admin //
		{
			path: '/admin',
			name: 'admin',
			component: admin,
			meta: {
				auth: true,
				title: 'Admin'
			}
		},
		{
			path: '/admin/function/comment-reports/:sort/:limit/:page',
			name: 'admin_f_comment_reports',
			component: admin_function_commentReports,
			meta: {
				auth: true,
				title: 'Admin-f-comment-reports'
			}
		},
		{
			path: '/admin/function/comments/:sort/:limit/:page',
			name: 'admin_f_comment',
			component: admin_function_comments,
			meta: {
				auth: true,
				title: 'Admin-f-comments'
			}
		},
		{
			path: '/admin/function/posts/:sort/:limit/:page',
			name: 'admin_f_posts',
			component: admin_function_posts,
			meta: {
				auth: true,
				title: 'Admin-f-posts'
			}
		},
		{
			path: '/admin/function/users/:sort/:limit/:page',
			name: 'admin_f_users',
			component: admin_function_users,
			meta: {
				auth: true,
				title: 'Admin-f-users'
			}
		},
		{
			path: '/admin/login',
			name: 'admin_login',
			component: admin_login,
			meta: {
				auth: true,
				title: 'Admin Login'
			}
		},
		{
			path: '/admin/profile',
			name: 'admin_profile',
			component: admin_profile,
			meta: {
				auth: true,
				title: 'Admin Profile'
			}
		},
		{
			path: '/admin/register',
			name: 'admin_register',
			component: admin_register,
			meta: {
				auth: true,
				title: 'Admin Register'
			}
		},
		// blog-post //
		{
			path: '/blog-post/create',
			name: 'blogPost_create',
			component: blogPost_create,
			meta: {
				auth: true,
				title: 'Create a Blog Post'
			}
		},
		{
			path: '/blog-post/read/:blogpost_id',
			name: 'blogPost_read',
			component: blogPost_read,
			meta: {
				auth: true,
				title: 'Blog Post'
			}
		},
		// Cat //
		{
			path: '/cat/:cat_id/:sort/:limit/:page',
			name: 'cat',
			component: cat,
			meta: {
				auth: true,
				title: `Cat -`
			}
		},
		// Comment //
		{
			path: '/comment/create/:post_id',
			name: 'comment_create',
			component: comment_create,
			meta: {
				auth: true,
				title: 'Create Comment'
			}
		},
		{
			path: '/comment/edit/:comment_id',
			name: 'comment_edit',
			component: comment_edit,
			meta: {
				auth: true,
				title: 'Edit Comment'
			}
		},
		{
			path: '/comment/reply/:comment_id',
			name: 'comment_reply',
			component: comment_reply,
			meta: {
				auth: true,
				title: 'Reply to Comment'
			}
		},
		// Dashboard //
		{
			path: '/dashboard/:webapp/:tab/:sort/:limit/:page',
			name: 'dashboard',
			component: dashboard,
			meta: {
				auth: true,
				title: 'Dashboard'
			}
		},
		// Documentation //
		{
			path: '/documentation',
			name: 'documentation',
			component: documentation,
			meta: {
				auth: true,
				title: 'Documentation'
			}
		},
		// Email //
		{
			path: '/email-sent',
			name: 'email-sent',
			component: emailSent,
			meta: {
				auth: true,
				title: 'Email Sent'
			},
		},
		// Followed //
		{
			path: '/followed/:page',
			name: 'followed',
			component: followed,
			meta: {
				auth: true,
				title: 'Posts You Are Following'
			}
		},
		// Notifications //
		{
			path: '/notification/:sort/:limit/:page',
			name: 'notification',
			component: notification,
			meta: {
				auth: true,
				title: 'notification'
			}
		},
		// Product //
		{
			path: '/product/create',
			name: 'product_create',
			component: product_create,
			meta: {
				auth: true,
				title: 'Create Product'
			}
		},
		{
			path: '/product/read/:product_id',
			name: 'product_read',
			component: product_read,
			meta: {
				auth: true,
				title: 'Product'
			}
		},
		// Product Options //
		{
			path: '/product-option/create',
			name: 'productOption_create',
			component: productOption_create,
			meta: {
				auth: true,
				title: 'Create Product Option'
			}
		},
		// Post //
		{
			path: '/post/:post_id/:limit/:page',
			name: 'post',
			component: post,
			meta: {
				auth: true,
				title: 'Post -'
			}
		},
		{
			path: '/post/create/:cat_id',
			name: 'post_create',
			component: post_create,
			meta: {
				auth: true,
				title: 'Create a Post'
			}
		},
		// User //
		{
			path: '/user',
			name: 'user',
			component: user,
			meta: {
				auth: true,
				title: 'Your Account'
			}
		},
		{
			path: '/user/login',
			name: 'user_login',
			component: user_login,
			meta: {
				auth: true,
				title: 'Login'
			}
		},
		{
			path: '/user/password/change',
			name: 'password_change',
			component: user_password_change,
			meta: {
				auth: true,
				title: 'Change Password'
			}
		},
		{
			path: '/user/password/request',
			name: 'user_request',
			component: user_password_request,
			meta: {
				auth: true,
				title: 'Request for Password Reset'
			}
		},
		{
			path: '/user/password/reset/:user_id/:verification_code',
			name: 'user_password_reset',
			component: user_password_reset,
			meta: {
				auth: true,
				title: 'Reset Password'
			}
		},
		{
			path: '/user/profile',
			name: 'user_profile',
			component: user_profile,
			meta: {
				auth: true,
				title: 'Your Profile'
			}
		},
		{
			path: '/user/profile/edit',
			name: 'user_profile_edit',
			component: user_profile_edit,
			meta: {
				auth: true,
				title: 'Edit Your Profile'
			}
		},
		{
			path: '/user/profile/lookup/:user_id',
			name: 'user_profile_lookup',
			component: user_profile_lookup,
			meta: {
				auth: true,
				title: ''
			}
		},
		{
			path: '/user/register',
			name: 'user_register',
			component: user_register,
			meta: {
				auth: true,
				title: 'Register'
			}
		},
		{
			path: '/user/registered',
			name: 'user_registered',
			component: user_registered,
			meta: {
				auth: true,
				title: 'Successfully Created Account'
			}
		},
		{
			path: '/user/verify/:user_id/:verification_code',
			name: 'verify',
			component: user_verify,
			meta: {
				auth: true,
				title: 'Verifiying your account..'
			}
		},
		// Search //
		{
			path: '/search/:query/:tab/:type/:limit/:page',
			name: 'search',
			component: search,
			meta: {
				auth: true,
				title: 'Search'
			}
		},
		// section-text //
		{
			path: '/section-text/create',
			name: 'sectionText_create',
			component: sectionText_create,
			meta: {
				auth: true,
				title: 'Create a Section Text'
			}
		},
		{
			path: '/section-text/read/:sectiontext_id',
			name: 'sectionText_read',
			component: sectionText_read,
			meta: {
				auth: true,
				title: 'Section Text'
			}
		},
		// Z //
		{
			path: '/z',
			name: 'z',
			component: z,
		},
		// Not-Found //
		{
			path: '/**',
			name: 'not_found',
			component: NotFound,
			meta: {
				auth: true,
				title: '404 Not Found..'
			},
		},
	],
	
	// [VUE-ROUTER] Scroll Behavior //
	scrollBehavior () { return { x: 0, y: 0 } }
})


// [VUE-ROUTER-SET-TITLE] //
router.beforeEach((to, from, next) => {
	document.title = to.meta.title + ' - ' + companyInfo.name
	next()
})


export default router