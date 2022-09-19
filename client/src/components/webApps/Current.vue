<template>
	<select
		v-model="currentWebApp"
		class="
			form-control
			form-select
			text-primary
			border-primary
			bg-dark
		"
		@click="selectOrganization()"
	>
		<option disabled value="">Choose a Web App</option>

		<option
			v-for="w in $store.state.webApps"
			:key="w._id"
			:value="w._id"
		>{{ w.name }}</option>
	</select>
</template>

<script>
	import router from '@/router';

	import UserService from '../../services/UserService';

	export default {
		data() {
			return {
				currentWebApp: this.$store.state.user.workspace.webApp,
				resData: {},
			}
		},

		methods: {
			async selectOrganization() {
				this.resData = await UserService.s_update_workspaceWebApp(
					this.currentWebApp
				);

				this.$store.state.user.workspace.webApp = this.currentWebApp;

				router.push({
					name: 'dashboard',
					params: {
						tab: 'web-content',
						sort: parseInt(this.$route.params.sort) || 0,
						limit: parseInt(this.$route.params.limit) || 5,
						page: parseInt(this.$route.params.page) || 1,
					}
				});
				
				this.$store.state.key++;
			},
		},
	}
</script>