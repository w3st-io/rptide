<template>
	<div>
		<select
			v-model="$store.state.dashboard.webApp"
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
				v-for="w in $store.state.dashboard.webApps"
				:key="w._id"
				:value="w._id"
			>{{ w.name }}</option>
		</select>
	</div>
</template>

<script>
	import router from '@/router'

	export default {
		methods: {
			selectOrganization() {
				// [LOCALSTORAGE] //
				localStorage.selectedWebApp = this.$store.state.dashboard.webApp;

				router.push({
					name: 'dashboard',
					params: {
						webapp: this.$store.state.dashboard.webApp,
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