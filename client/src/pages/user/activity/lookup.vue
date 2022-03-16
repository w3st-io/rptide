<template>
	<BContainer class="my-3">
		<BRow>
			<BCol cols="12">
				<BCard bg-variant="dark" text-variant="light">
					<BRow class="mb-3">
						<BCol cols="6">
							<h4>{{ user_id }} Activity</h4>
						</BCol>

						<BCol cols="6">
							<!-- Page Control -->
							<PageNavButtons
								@start-btn="startPage()"
								@prev-btn="prevPage()"
								@next-btn="nextPage()"
								@end-btn="endPage()"
								:badgeValue="page"
								class="w-100 ml-auto"
								style="max-width: 300px;"
							/>
						</BCol>
					</BRow>

					<BRow class="mb-3">
						<BCol cols="12">
							<ActivityList :activities="activities" />
						</BCol>
					</BRow>

					<BRow v-show="error" class="mb-3">
						<BCol cols="12">
							<!-- Error -->
							<Alert variant="danger" :message="error" />
						</BCol>
					</BRow>

					<BRow v-show="loading" class="mb-3">
						<BCol class="12">
							<!-- Loading -->
							<Alert variant="dark" />
						</BCol>
					</BRow>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import ActivityList from '@/components/activity/List'
	import PageNavButtons from '@/components/controls/PageNavButtons'
	import Alert from '@/components/inform/Alert'
	import router from '@/router'
	import pageService from '@/services/PageService'

	export default {
		components: {
			ActivityList,
			Alert,
			PageNavButtons,
		},

		data() {
			return {
				user_id: this.$route.params.user_id,
				sort: parseInt(this.$route.params.sort),
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),
				loading: true,
				data: {},
				activities: [],
				error: '',
			}
		},

		created: async function() {
			await this.getPageData()

			this.log()
		},

		methods: {
			async startPage() {
				// As long as the page is not going into 0 or negative //
				if (this.page != 1) {
					this.loading = true
					this.page = 1
					
					this.refreshRoute()

					await this.getPageData()
				}
			},

			async prevPage() {
				// As long as the page is not going into 0 or negative //
				if (this.page != 1) {
					this.loading = true
					this.page--
					
					this.refreshRoute()
					
					await this.getPageData()
				}
			},

			async nextPage() {
				// As long as page does not exceed max Number of Pages //
				if (this.page < this.data.totalPages) {
					this.loading = true
					this.page++

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async endPage() {
				if (this.page != this.data.totalPages) {
					this.loading = true
					this.page = this.data.totalPages

					this.refreshRoute()

					await this.getPageData()
				}
			},

			refreshRoute() {
				router.push({
					user_id: this.user_id,
					name: 'user_activity_lookup',
					params: {
						user_id: this.user_id,
						sort: this.sort,
						limit: this.limit,
						page: this.page,
					}
				})
			},

			async getPageData() {
				try {
					this.data = await pageService.s_user_activity_lookup(
						this.user_id,
						this.sort,
						this.limit,
						this.page
					)
				}
				catch (err) { this.error = `This: --> ${err}` }

				if (this.data.status) { this.activities = this.data.activities }
				else { this.error = this.data.message }

				this.loading = false
			},

			log() {
				console.log('%%% [PAGE] /user/activity %%%')
				console.log('limit:', this.limit)
				console.log('page:', this.page)
				console.log('data:', this.data)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>