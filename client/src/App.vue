<template>
	<div :key="this.$store.state.key" id="app">
		<!-- Top Navbar & Side Menu -->
		<NavBar v-if="!this.$store.state.loading && this.$store.state.show.NavBar" />

		<!-- Router -->
		<RouterView
			v-if="!this.$store.state.loading"
			:key="$route.name + ($route.params.id || '')"
		/>

		<!-- Bottom Footer -->
		<Footer v-if="!this.$store.state.loading && this.$store.state.show.Footer" />
	</div>
</template>

<script>
	// [IMPORT]
	import axios from "axios";

	// [IMPORT] Personal
	import Footer from "./components/UI/Footer";
	import NavBar from "./components/UI/NavBar";

	export default {
		name: "App",

		components: {
			Footer,
			NavBar
		},

		data() {
			return {
				authAxios: axios.create({
					baseURL: "/api",
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`,
					}
				}),
			};
		},

		methods: {
			async initializeApp() {
				this.$store.state.loading = true;

				const res = (await this.authAxios.get("/")).data;

				if (res.status) {
					// [LOCAL-STORAGE]
					localStorage.setItem("node_env", res.node_env);

					this.$store.replaceState({
						...this.$store.state,
						limit: res.limit,
						user: res.user || null,
						webApps: res.webApps || []
					});
				}

				this.$store.state.loading = false;
			},
		},

		async created() {
			await this.initializeApp();
		},
	}
</script>