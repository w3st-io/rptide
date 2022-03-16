<template>
	<div>
		<!-- Search and Button -->
		<form @submit.prevent="searchRedirect()">
			<BInputGroup>
				<BFormInput
					v-model="query"
					type="text"
					placeholder="Search"
					class="border-primary bg-dark text-light"
				/>
				<div class="input-group-append">
					<BButton
						variant="outline-primary"
						type="submit"
					>Search</BButton>
				</div>
			</BInputGroup>
		</form>
	</div>
</template>

<script>
	import { EventBus } from '@/main'
	import router from '@/router'

	export default {
		data() {
			return {
				query: '',
			}
		},

		methods: {
			searchRedirect() {
				if (this.query) {
					router.push({
						name: 'search',
						params: {
							type: 'posts',
							query: this.query,
							tab: 0,
							limit: 5,
							page: 1,
						}
					})

					EventBus.$emit('force-rerender')

					this.$store.state.show.SideMenu = false
				}
			},
		},
	}
</script>