<template>
	<div>
		<select
			v-model="currentWebApp"
			class="
				form-control
				form-select
				text-light
				border-light
				bg-dark
			"
			@click="selectOrganization()"
		>
			<option disabled value="">Choose a Web App</option>

			<option
				v-for="w in this.$store.state.dashboard.webApps"
				:key="w._id"
				:value="w._id"
			>{{ w.name }} {{w._id}}</option>
		</select>
	</div>
</template>

<script>
	import router from '@/router';

	import UserService from '../../services/user/UserService';

	export default {
		data() {
			return {
				currentWebApp: this.$store.state.user.workspace.selectedWebApp,
				resData: {},
			}
		},

		methods: {
			async selectOrganization() {
				this.resData = await UserService.s_update_workspaceSelectedWebApp(
					this.currentWebApp
				);

				this.$store.state.user.workspace.selectedWebApp = this.currentWebApp;

				router.push({
					name: 'dashboard',
					params: {
						webapp: this.$store.state.user.workspace.selectedWebApp || null,
						tab: this.$route.params.tab || 'web-content',
						sort: parseInt(this.$route.params.sort) || 0,
						limit: parseInt(this.$route.params.limit) || 5,
						page: parseInt(this.$route.params.page) || 1,
					}
				});
				
				this.$store.state.app.key++;
			},
		},
	}
</script>