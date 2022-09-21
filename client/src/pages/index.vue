<template>
	<BContainer fluid class="p-0">
		<main>
			<BContainer class="py-3">
				<BRow>
					<BCol cols="12">
						<header class="pb-3 text-center">
							<!-- Logo -->
							<RouterLink to="/" class="navbar-brand">
								<mark class="h2 px-5 bg-primary text-dark rounded">
									RpTide
								</mark>
							</RouterLink>
						</header>
					</BCol>

					<!-- 1 -->
					<BCol cols="12" lg="8">
						<div
							class="
								h-100
								p-3 p-lg-5
								bg-primary 
								text-light
								rounded-3
								rounded-lg
								shadow
							"
						>
							<h1 class="display-3 display-5 text-center font-weight-bold text-light">
								Your Content, Our Service.
							</h1>
							<h3 class="font-weight-light text-center text-dark">{{ caption1 }}</h3>
							
							<DatabaseIcon size="10x" stroke-width=".4" class="w-100 text-center text-dark" />
						</div>
					</BCol>

					<!-- 2 -->
					<BCol cols="12" lg="4">
						<BCard
							bg-variant="dark"
							class="
								mb-3
								text-light
								shadow
							"
						>
							<h4 class="text-center text-primary">{{ caption3 }}</h4>
							
							<RouterLink to="/user/register">
								<BButton
									variant="primary"
									size="lg"
									type="button"
									class="w-100 mb-4 p-3"
								><h5 class="m-0">Register</h5></BButton>
							</RouterLink>

							<h4 class="text-center text-light">Already have an account?</h4>

							<RouterLink to="/user/login">
								<BButton
									variant="light"
									size="lg"
									type="button"
									class="w-100 mb-4 p-3"
								><h5 class="m-0">Login</h5></BButton>
							</RouterLink>
						</BCard>

						<BCard
							bg-variant="dark"
							class="
								mb-3
								text-light
								shadow
							"
						>
							<router-link to="/documentation">
								<BButton variant="outline-light" class="w-100">
									Documentation
								</BButton>
							</router-link>
						</BCard>
					</BCol>
				</BRow>
			</BContainer>
		</main>
	</BContainer>
</template>

<script>
	// [IMPORT]
	import { DatabaseIcon } from 'vue-feather-icons'


	// [IMPORT] Personal
	import router from '@/router'

	export default {
		data() {
			return {
				caption1: 'Its hard to manage your content in so many different places, we want to simplify that for you..',
				caption2: 'Store all of your content on 1 platform and let all of your digital outlets come to us!',
				caption3: 'Its Simple & Easy to Start!',
			}
		},

		components: {
			DatabaseIcon
		},

		created() {
			// [USER-LOGGED][REDIRECT]
			if (localStorage.usertoken) {
				router.push({
					name: 'dashboard',
					params: {
						tab: 'web-content',
						sort: 0,
						limit: 5,
						page: 1,
					},
				})
			}
			else {
				this.$store.state.show.NavBar = false
				this.$store.state.show.Footer = false
			}
		},

		destroyed() {
			this.$store.state.show.NavBar = true
			this.$store.state.show.Footer = true
		},
	}
</script>