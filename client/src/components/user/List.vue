<template>
	<BRow>
		<BCol cols="12">
			<BListGroup class="w-100 m-0 px-0">
				<BListGroupItem
					v-for="user in users" :key="user._id"
					class="p-0 bg-dark border-secondary rounded-0"
				>
					<BRow class="m-0">
						<!-- Image Section -->
						<BCol
							cols="2"
							class="align-self-center"
							@click="redirectProfile(user._id)"
						>
							<div class="w-100 overflow-auto text-center">
								<img
									:src="user.profile_img" class="w-100"
									style="max-width: 50px;"
								>
							</div>
						</BCol>

						<!-- Profile Info -->
						<BCol
							cols="10"
							@click="redirectProfile(user._id)"
						>
							<h5 class="m-0 mt-2 align-middle">{{ user.username }}</h5>
							<p>{{ user.bio.replace(/(.{60})..+/, '$1…') }}</p>
						</BCol>
					</BRow>
				</BListGroupItem>
			</BListGroup>

			<!-- [DEFAULT] If No content -->
			<NoContent v-if="users == ''" text="No Users Found" class="my-3" />
		</BCol>
	</BRow>
</template>

<script>
	// [IMPORT] Personal
	import NoContent from '@/components/placeholders/NoContent'
	import router from '@/router'

	export default {
		components: {
			NoContent,
		},

		props: {
			users: { type: Array, required: true, },
		},

		created: async function() {
			// [LOG]
			//this.log()
		},


		methods: {
			redirectProfile(user_id) {
				router.push({
					name: 'user_profile_lookup',
					params: { user_id: user_id, }
				})
			},

			log() {
				console.log('%%% [COMPONENT] Users List %%%')
				console.log('users:', this.users)
				console.log('totalUsers:', this.totalUsers)
			},
		}
	}
</script>

<style lang="scss" scoped>
	// [IMPORT] Personal
	@import 'src/assets/styles/style.scss';

	.list-group-item {
		&:hover { background-color: rgba(127.5, 127.5, 127.5, 0.4) !important; }
	}
	.list-group-item:nth-child(even) {
		background-color: rgba(127.5, 127.5, 127.5, 0.2) !important;
		&:hover { background-color: rgba(127.5, 127.5, 127.5, 0.4) !important; }
	}
</style>