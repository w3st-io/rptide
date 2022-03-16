<template>
	<BContainer class="my-3">
		<BRow v-if="!loading">
			<BCol cols="12" sm="8">
				<BCard bg-variant="dark">
					<!-- Image Display -->
					<div class="w-100 p-3 text-center">
						<img
							:src="imgUrl"
							alt="Profile Pic Here"
							class="border border-warning"
							style="width: 200px;"
						>
					</div>

					<!-- Image URL -->
					<label for="profile_imgInput" class="text-light">
						Profile Pic Url
					</label>
					<input
						name="profile_imgInput"
						type="text"
						class="my-2 form-control"
						v-model="imgUrl"
					>

					<!-- Bio -->
					<label for="profile_imgInput" class="mt-3 text-light">
						Bio
					</label>
					<input
						name="profile_imgInput"
						type="text"
						class="my-2 form-control"
						v-model="bio"
					>

					<BButton
						variant="secondary"
						class="w-100 mt-3"
						@click="updateUserData()"
					>Edit Your Profile</BButton>

					<!-- [LOADING + ERROR] -->
					<Alert v-if="loading" variant="warning" message="Loading.." />
					<Alert v-if="error" variant="danger" :message="error" class="my-3" />
				</BCard>
			</BCol>

			<BCol cols="12" sm="8"></BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@/components/inform/Alert'
	import router from '@/router'
	import PageService from '@/services/PageService'
	import UserService from '@/services/user/UserService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
		},

		data() {
			return {
				loading: true,
				userData: {},
				data: {},
				imgUrl: '',
				bio: '',
				error: '',
			}
		},

		async created() {
			// [REDIRECT] Not Log Required //
			if (!localStorage.usertoken) { router.push({ name: '/' }) }

			// Retrieve User Profile Data //
			try { this.data = await PageService.s_user_profile_edit() }
			catch (err) { this.error = err }

			if (this.data.status) {
				this.userData = this.data.user

				// Set Image //
				this.imgUrl = this.userData.profile_img
				this.bio = this.userData.bio
			}
			else { this.error = this.data.message }

			// Enable Loading //
			this.loading = false

			// [LOG] //
			//this.log()
		},

		methods: {
			async updateUserData() {
				try { this.data = await UserService.s_update(this.imgUrl, this.bio) }
				catch (err) { this.error = err }

				console.log('ASDFASD', this.data)
				if (this.data.status) {
					// [REDIRECT] //
					router.push({ name: 'user_profile' })
				}
				else { this.error = this.data.message }
			},

			log() {
				console.log('%%% [PAGE] User Profile %%%')
				console.log('userData:', this.userData)
				console.log('imgUrl:', this.imgUrl)
			},
		},
	}
</script>