// [IMPORT]
import Vue from 'vue';
import Router from 'vue-router';


// [IMPORT] Personal (Ordered by path)
// Index
import index from '@/pages';
// Dashboard
import dashboard from '@/pages/dashboard';

// Documentation
import documentation from '@/pages/documentation';
// Email
import emailSent from '@/pages/email-sent';
// Product
import product_create from '@/pages/product/create';
import product_read from '@/pages/product/read';
// Product Options
import productOption_create from '@/pages/product-option/create';
// User
import user from '@/pages/user';
import user_login from '@/pages/user/login';
import user_password_request from '@/pages/user/password/request';
import user_password_reset from '@/pages/user/password/reset';
import user_verify from '@/pages/user/verify';
import user_register from '@/pages/user/register';
import user_registered from '@/pages/user/registered';
// Web App
import webApp from '@/pages/web-app';
import webApp_update from '@/pages/web-app/update';
// Web Content
import webContent_create from '@/pages/web-content/create';
import webContent_update from '@/pages/web-content/update';
// Not-Found
import NotFound from '@/pages/404';


// [USE]
Vue.use(Router);


// [EXPORT]
const router = new Router ({
	mode: 'history',

	routes: [
		// Index
		{
			path: '/',
			name: '/',
			component: index,
			meta: {
				auth: true,
				title: 'Home'
			}
		},
		// Documentation
		{
			path: '/documentation',
			name: 'documentation',
			component: documentation,
			meta: {
				auth: true,
				title: 'Documentation'
			}
		},
		// Email
		{
			path: '/email-sent',
			name: 'email-sent',
			component: emailSent,
			meta: {
				auth: true,
				title: 'Email Sent'
			},
		},
		// Product
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
		// Product Options
		{
			path: '/product-option/create',
			name: 'productOption_create',
			component: productOption_create,
			meta: {
				auth: true,
				title: 'Create Product Option'
			}
		},
		// User
		{
			path: '/user',
			name: 'user',
			component: user,
			meta: {
				auth: true,
				title: 'Your Account'
			}
		},
		// Dashboard
		{
			path: '/dashboard/:webapp/:tab/:sort/:limit/:page',
			name: 'dashboard',
			component: dashboard,
			meta: {
				auth: true,
				title: 'Dashboard'
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
		{
			path: '/web-app',
			name: 'web-app',
			component: webApp,
			meta: {
				auth: true,
				title: 'Web Apps'
			}
		},
		{
			path: '/web-app/update/:webapp',
			name: 'Web App Update',
			component: webApp_update,
			meta: {
				auth: true,
				title: ''
			}
		},
		{
			path: '/web-content/create/:webapp',
			name: 'Web Content Create',
			component: webContent_create,
			meta: {
				auth: true,
				title: ''
			}
		},
		{
			path: '/web-content/update/:webcontent',
			name: 'Web Content Update',
			component: webContent_update,
			meta: {
				auth: true,
				title: ''
			}
		},
		// Not-Found
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
	
	// [VUE-ROUTER] Scroll Behavior
	scrollBehavior () { return { x: 0, y: 0 }; }
});


// [VUE-ROUTER-SET-TITLE]
router.beforeEach((to, from, next) => {
	document.title = to.meta.title + ' - RpTide';
	next();
})


export default router;