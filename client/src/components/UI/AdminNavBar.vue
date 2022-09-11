<template>
	<nav class="navbar navbar-dark fixed-bottom bg-warning">
		<div>
			<BButton size="sm" class="mr-2" @click="redirectAdmin()">
				Admin Dashboard
			</BButton>

			<BButton size="sm" class="mr-2" @click="redirectAdminProfile()">
				Admin Profile
			</BButton>
		</div>
	</nav>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@/router'

	// [EXPORT]
	export default {
		methods: {
			redirectAdmin() { router.push({ name: 'admin' }) },

			redirectAdminProfile() { router.push({ name: 'admin_profile' }) },
		},
	}
</script>