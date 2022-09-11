<template>
	<BContainer fluid class="p-0">
		<main>
			<BContainer class="py-5">
				<BRow>
					<BCol cols="12">
						<header class="pb-3 mb-4 text-center">
							<!-- Logo -->
							<RouterLink to="/" class="navbar-brand">
								<mark class="h2 px-5 bg-primary text-dark rounded">
									Rptide
								</mark>
							</RouterLink>
						</header>
					</BCol>

					<!-- 1 -->
					<BCol cols="12" lg="9" class="py-3">
						<div
							class="
								h-100
								p-3 p-lg-5
								bg-primary 
								text-light
								rounded-3
								border
								border-secondary
								rounded-lg
								shadow
							"
						>
							<h1 class="display-3 display-5 text-center font-weight-bold text-light">
								Your Content, Our Service.
							</h1>
							<h1 class="font-weight-light text-center text-dark">{{ caption1 }}</h1>
							<h5 class="font-weight-light text-center text-dark">{{ caption2 }}</h5>
							
						</div>
					</BCol>

					<!-- 2 -->
					<BCol cols="12" lg="3" class="py-3">
						<div
							class="
								h-100
								p-5 p-lg-3 p-xl-5
								bg-dark
								text-light
								rounded-3
								border
								border-secondary
								rounded-lg
								shadow
							"
						>
							<h4 class="text-center text-primary">{{ caption3 }}</h4>
							
							<RouterLink to="/user/register">
								<BButton
									variant="primary"
									size="lg"
									type="button"
									class="w-100 my-4 p-3"
								><h5 class="m-0">Register</h5></BButton>
							</RouterLink>

							<DatabaseIcon size="10x" stroke-width=".75" class="w-100 text-center text-primary" />
						</div>
					</BCol>
				</BRow>

				<BRow class="row align-items-md-stretch">
					<!-- 3 -->
					<BCol cols="12" md="6" lg="5" class="py-3">
						<div
							class="
								h-100
								p-3 p-lg-5
								bg-dark
								text-light
								rounded-3
								border
								border-secondary
								rounded-lg
								shadow
							"
						>
							<h3 class="text-center text-primary">Already have an account?</h3>
							<hr class="bg-primary">

							<RouterLink to="/user/login">
								<BButton
									variant="primary"
									size="lg"
									type="button"
									class="w-100 my-4 p-3"
								><h3 class="m-0">Login</h3></BButton>
							</RouterLink>
						</div>
					</BCol>

					<!-- 4 -->
					<BCol cols="12" md="6" lg="7" class="py-3">
						<div
							class="
								h-100
								p-3 p-lg-5
								bg-primary
								text-light
								rounded-3
								border
								border-secondary
								rounded-lg
								shadow
							"
						>
							<h2 class="text-center text-dark">Check Out Our Plans!</h2>
							<hr class="bg-dark">

							<RouterLink to="/user/login">
								<BButton
									variant="dark"
									size="lg"
									type="button"
									class="w-100 my-4 p-3 text-primary"
								><h3 class="m-0">View</h3></BButton>
							</RouterLink>
						</div>
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
				caption3: 'Its Simple, Free, & Easy to Start!',
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
						webapp: this.$store.state.user.workspace.webApp,
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