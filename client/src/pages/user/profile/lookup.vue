<template>
	<BContainer class="my-3">
		<!-- [LOADING] -->
		<BRow>
			<BCol v-if="loading" cols="12">
				<Alert variant="primary" />
			</BCol>
		</BRow>

		<BRow v-if="!error && !loading" class="mt-3">
			<!-- Account Details -->
			<BCol sm="12" lg="9">
				<BCard bg-variant="dark" text-variant="light" class="mb-4">
					<BRow>
						<!-- Profile -->
						<BCol cols="12" lg="3" class="mt-2">
							<BBadge variant="primary" class="w-100 mb-3 p-0 rounded">
								<h5 class="mb-1">{{ reqData.user.username }}</h5>
							</BBadge>

							<div class="m-auto" style="max-width: 170px;">
								<img
									:src="reqData.user.profile_img"
									alt="Profile Image Not Available"
									class="w-100 mx-auto border border-primary rounded"
								>
							</div>

							<h6 class="mt-3">
								<span class="text-secondary">Email:</span><br>
								{{ reqData.user.email }}
							</h6>

							<h6 class="mt-3">
								<span class="text-secondary">Bio:</span><br>
								{{ reqData.user.bio }}
							</h6>					

							<h6 class="mt-3">
								<span class="text-secondary">Joined:</span><br>
								{{ new Date(reqData.user.createdAt).toLocaleString() }}
							</h6>

							<h6 class="mt-3 small text-secondary">
								{{ reqData.user._id }}
							</h6>

							<BButton
								variant="outline-danger"
								class="w-100 mt-3"
								@click="reportUser()"
							>Report User</BButton>
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
										<h4>{{ reqData.commentCount }}</h4>
									</BBadge>
								</BCol>

								<!-- Total Posts -->
								<BCol cols="12" sm="6" md="6" lg="3">
									<BBadge variant="dark" class="w-100 mb-2">
										<h6>Total Posts</h6>
										<h4>{{ reqData.postCount }}</h4>
									</BBadge>
								</BCol>

								<!-- Post Score -->
								<BCol cols="12" sm="6" md="6" lg="3">
									<BBadge variant="dark" class="w-100 mb-2">
										<h6>Post Score</h6>
										<h4>{{ reqData.postLikeCount }}</h4>
									</BBadge>
								</BCol>

								<!-- Comment Score -->
								<BCol cols="12" sm="6" md="6" lg="3">
									<BBadge variant="dark" class="w-100 mb-2">
										<h6>Comment Score</h6>
										<h4>{{ reqData.commentLikeCount }}</h4>
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
						</BCol>
					
						<!-- [ACTIVITY] Wrapped Chart -->
						<BCol cols="12" class="mt-2">
							<WrappedLineChart
								title="Activity"
								:labels="activityLabels"
								:data="activityValues"
								:height="350"
							/>
						</BCol>

						<BCol cols="12">		
							<BButton
								variant="outline-primary"
								class="w-100 mt-3"
								@click="redirectActivity(reqData.user._id)"
							>View Activity</BButton>
						</BCol>
					</BRow>
				</BCard>
			</BCol>
			
			<BCol sm="12" lg="3"></BCol>
		</BRow>

		<BRow v-if="!error && !loading && reqData.adminData">
			<BCol cols="12" class="mt-3 text-light">
				<BCard bg-variant="dark" border-variant="warning">
					<BRow>
						<!-- commentReports -->
						<BCol cols="12" class="text-center">
							<h5>Admin Data</h5>
						</BCol>

						<!-- commentReports -->
						<BCol cols="12" lg="4" class="mb-3">
							<BBadge variant="secondary" class="w-100">
								<h6>
									Comment Report<br>
									{{ reqData.adminData.commentReportCount }}
								</h6>
							</BBadge>
						</BCol>

						<!-- Handled commentReports -->
						<BCol cols="12" lg="4" class="mb-3">
							<BBadge variant="secondary" class="w-100">
								<h6>
									Handled Comment Report<br>
									{{ reqData.adminData.commentReportHandledCount }}
								</h6>
							</BBadge>
						</BCol>

						<!-- Unhandled commentReports -->
						<BCol cols="12" lg="4" class="mb-3">
							<BBadge variant="secondary" class="w-100">
								<h6>
									Unhandled Comment Report<br>
									{{ reqData.adminData.commentReportUnhandledCount }}
								</h6>
							</BBadge>
						</BCol>
					</BRow>					
				</BCard>
			</BCol>
		</BRow>

		<!-- [ERROR] -->
		<BRow v-if="error">
			<BCol cols="12" class="mt-3">
				<Alert variant="danger" :message="error" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	import WrappedLineChart from '@/components/chartjs/WrappedLineChart'
	import Alert from '@/components/inform/Alert'
	import router from '@/router'
	import PageService from '@/services/PageService'


	export default {
		components: {
			WrappedLineChart,
			Alert,
		},

		data() {
			return {
				user_id: this.$route.params.user_id,
				profile_img: require('../../../assets/images/pages/user/profile/lookup/DefaultProfileImg.png'),
				reqData: {},
				loading: true,
				error: '',
			}
		},

		methods: {
			async getPageData() {
				this.reqData = await PageService.s_user_profile_lookup(
					this.$route.params.user_id
				)

				if (this.reqData.status) {
					// Map Data activityData //
					this.activityLabels = this.reqData.activityData.map(d => d.time)
					this.activityValues = this.reqData.activityData.map(d => d.count)
					
				}
				else { this.error = this.reqData.message }

				this.loading = false
			},

			redirectActivity() {
				router.push({
					name: 'user_activity_lookup',
					params: {
						user_id: this.$route.params.user_id,
						sort: 1,
						limit: 5,
						page: 1,
					}
				})
			},

			log() {
				console.log('%%% [PAGE] user/profile/lookup/:user_id %%%')
				console.log('reqData:', this.reqData)
			},
		},

		async created() {
			await this.getPageData()

			this.log()
		},
	}
</script>