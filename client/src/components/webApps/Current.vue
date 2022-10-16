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
	import axios from "axios";

	import router from "@/router";

	export default {
		data() {
			return {
				authAxios: axios.create({
					baseURL: '/api/user',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`,
					}
				}),

				currentWebApp: this.$store.state.user.workspace.webApp,
				
				resData: {},
			}
		},

		methods: {
			async selectOrganization() {
				this.resData = (
					await this.authAxios.post('/update/workspace--web-app', {
						webApp: this.currentWebApp
					})
				).data;

				this.$store.state.user.workspace.webApp = this.currentWebApp;

				router.push({
					name: "dashboard",
					params: {
						tab: "web-content",
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