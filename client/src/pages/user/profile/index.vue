<template>
	<BContainer class="my-5">
		<BRow>
			<!-- [LOADING] -->
			<BCol v-if="loading" cols="12">
				<Alert variant="primary" />
			</BCol>

			<!-- User Not Verifed -->
			<BCol v-if="!isVerified" cols="12">
				<BCard bg-variant="danger" class="mb-3">
					<h5 class="text-center text-light">Account Not Verified!</h5>
					<BButton
						variant="outline-light"
						class="w-100"
						@click="resendvCodeEmail()"
					>Click to Resend Email</BButton>
				</BCard>
			</BCol>

			<!-- Email Sent -->
			<BCol v-if="vCodeSent" cols="12" class="mb-3">
				<BCard bg-variant="success" class="m-auto">
					<h5 class="text-center text-light">Email Sent!</h5>
				</BCard>
			</BCol>
		</BRow>
		
		<BRow v-if="!error && !loading" class="">
			<!-- Account Details -->
			<BCol sm="12" lg="9">
				<BCard bg-variant="dark" text-variant="light" class="mb-4">
					<!-- Profile Details -->
					<BRow>
						<!-- Profile -->
						<BCol cols="12" lg="3" class="mt-2">
							<BBadge variant="primary" class="w-100 mb-3 p-0 rounded">
								<h5 class="mb-1">
									{{ data.user.username }}
								</h5>
							</BBadge>

							<div class="m-auto" style="max-width: 170px;">
								<img
									:src="data.user.profile_img"
									alt="Profile Image Not Available"
									class="w-100 mx-auto border border-primary rounded"
								>
							</div>

							<h6 class="mt-3">
								<span class="text-secondary">Email:</span><br>
								{{ data.user.email }}
							</h6>

							<h6 class="mt-3">
								<span class="text-secondary">Bio:</span><br>
								{{ data.user.bio }}
							</h6>					

							<h6 class="mt-3">
								<span class="text-secondary">Joined:</span><br>
								{{ new Date(data.user.createdAt).toLocaleString() }}
							</h6>

							<h6 class="mt-3 small text-secondary">{{ data.user.user_id }}</h6>
						</BCol>

						<!-- Account Details -->
						<BCol cols="12" lg="9" class="mt-2">
							<BRow>
								<!-- Total Comments -->
								<BCol cols="12" sm="6" md="6" lg="3">
									<BBadge
										variant="dark"
										class="w-100 mb-2"
									>
										<h6>Total Comments</h6>
										<h4>{{ data.commentCount }}</h4>
									</BBadge>
								</BCol>

								<!-- Total Posts -->
								<BCol cols="12" sm="6" md="6" lg="3">
									<BBadge variant="dark" class="w-100 mb-2">
										<h6>Total Posts</h6>
										<h4>{{ data.postCount }}</h4>
									</BBadge>
								</BCol>

								<!-- Post Score -->
								<BCol cols="12" sm="6" md="6" lg="3">
									<BBadge variant="dark" class="w-100 mb-2">
										<h6>Post Score</h6>
										<h4>{{ data.postLikeCount }}</h4>
									</BBadge>
								</BCol>

								<!-- Comment Score -->
								<BCol cols="12" sm="6" md="6" lg="3">
									<BBadge variant="dark" class="w-100 mb-2">
										<h6>Comment Score</h6>
										<h4>{{ data.commentLikeCount }}</h4>
									</BBadge>
								</BCol>
							</BRow>

							<hr class="border-primary">
							<BRow>
								<BCol cols="12">
									<h3>Awards</h3>
									<h6 class="py-5 text-center text-secondary">
										No awards yet
									</h6>
								</BCol>
							</BRow>

							<hr class="mt-4 border-secondary">
							<BRow>
								<BCol cols="6">
									<BButton
										variant="outline-secondary"
										class="w-100 mt-3"
										@click="redirectProfileEdit()"
									>Edit Profile</BButton>
								</BCol>

								<BCol cols="6">
									<BButton
										variant="outline-secondary"
										class="w-100 mt-3"
										@click="redirectPasswordChange()"
									>Change Password</BButton>
								</BCol>
							</BRow>
						</BCol>
					</BRow>
				</BCard>

				<!-- [ACTIVITY] -->
				<BCard bg-variant="dark" text-variant="light">
					<BRow>
						<!-- Wrapped Chart -->
						<BCol cols="12" lg="12" class="mt-2">
							<WrappedLineChart
								:title="'Activity'"
								:labels="activityLabels"
								:data="activityValues"
								:height="350"
							/>
						</BCol>

						<BCol cols="12">
							<BButton
								variant="outline-primary"
								class="w-100 mt-3"
								@click="redirectYourActivity()"
							>View Your Activity</BButton>
						</BCol>
					</BRow>
				</BCard>
			</BCol>

			<BCol sm="12" lg="3"></BCol>
		</BRow>

		<!-- [ERROR] -->
		<BRow v-if="error" class="mt-3">
			<BCol cols="12">
				<Alert variant="danger" :message="error" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import WrappedLineChart from '@/components/chartjs/WrappedLineChart'
	import Alert from '@/components/inform/Alert'
	import router from '@/router'
	import PageService from '@/services/PageService'
	import UserService from '@/services/user/UserService'


	export default {
		components: {
			WrappedLineChart,
			Alert,
		},

		data() {
			return {
				returned: {},
				user: {},
				data: {},
				activityLabels: [],
				activityValues: [],
				isVerified: true,
				vCodeSent: false,
				loading: true,
				error: '',
			}
		},

		methods: {
			async getPageData() {
				this.returned = await PageService.s_user_profile()

				this.loading = false

				if (this.returned.status) {
					this.data = this.returned
					this.user = this.returned.user
					this.isVerified = this.user.verified

					// Map Data activityData //
					this.activityLabels = this.data.activityData.map(d => d.time)
					this.activityValues = this.data.activityData.map(d => d.count)
				}
				else { this.error = this.returned.message }
			},

			async resendvCodeEmail() {
				if (this.user) {
					this.returned = await UserService.s_resendVerificationEmail(
						this.user.email
					)

					if (this.returned.status) { this.vCodeSent = true }
					else { this.error = this.returned.message }
				}
			},

			redirectProfileEdit() { router.push({ name: 'user_profile_edit' }) },

			redirectPasswordChange() { router.push({ name: 'password_change', }) },

			redirectYourActivity() {
				router.push({
					name: 'user_activity',
					params: {
						sort: 1,
						limit: 5,
						page: 1,
					}
				})
			},

			log() {
				console.log('%%% [PAGE] User Profile %%%')
				console.log('returned:', this.returned)
				console.log('user:', this.user)
			},
		},

		async created() {
			try {
				// [REDIRECT] Not Log Required //
				if (!localStorage.usertoken) { router.push({ name: 'user_login' }) }

				await this.getPageData()

				// [LOG] //
				this.log()
			}
			catch (err) { this.error = err }
		},
	}
</script>