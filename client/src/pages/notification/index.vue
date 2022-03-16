<template>
	<BContainer>
		<BRow class="my-5">
			<BCol cols="12">
				<BCard bg-variant="dark" text-variant="light" border-variant="primary" class="shadow">
					<BRow>
						<!-- Title -->
						<BCol cols="12" sm="5" md="6" lg="8">
							<h4 class="text-primary">Notifications</h4>
						</BCol>

						<!-- Page Control -->
						<BCol cols="12" sm="7" md="6" lg="4">
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

					<!-- Main -->
					<BRow class="mt-3">
						<BCol cols="12">
							<BCard
								v-for="notification in notifications"
								:key="notification._id"
								no-body
								bg-variant="dark"
								border-variant="secondary"
								class="mb-2 p-2"
							>
								<a
									@click="clicked(
										notification._id,
										notification.comment.post._id
									)"
								>
									<BRow class="text-secondary">
										<!-- Header -->
										<h5
											class="col-md-10 m-0"
											:class="{
												'font-weight-bold text-light': !notification.read,
											}"
										>
											<span v-if ="!notification.read" class="text-primary">
												&#9679;
											</span>
											<span v-if="notification.type == 'comment'">
												{{ notification.comment.user.username }}
												made a comment in 
												{{ notification.comment.post.title }}
											</span>

											<span v-if="notification.type == 'reply'">
												{{ notification.comment.user.username }}
												replied to you comment in  
												{{ notification.comment.post.title }}
											</span>
										</h5>

										<!-- Timestamp -->
										<small class="col-md-2">
											{{ new Date(notification.createdAt).toLocaleString() }}
										</small>

										<!-- Text -->
										<p v-html="notification.comment.text" class="col-12 m-0"></p>
									</BRow>
								</a>
							</BCard>
						</BCol>
					</BRow>

					<!-- [LOADING] -->
					<BRow v-show="loading" class="mt-3">
						<BCol cols="12"><Alert /></BCol>
					</BRow>

					<!-- [ALERTS] -->
					<BRow v-show="error" class="mt-3">
						<BCol cols="12">
							<Alert variant="danger" :message="'Notification Page: ' + error" />
						</BCol>
					</BRow>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@/components/controls/PageNavButtons'
	import Alert from '@/components/inform/Alert'
	import router from '@/router'
	import NotificationService from '@/services/user/NotificationService'
	import PageService from '@/services/PageService'
	import { EventBus } from '@/main'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			PageNavButtons,
		},

		data() {
			return {
				sort: parseInt(this.$route.params.sort),
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),
				loading: true,
				error: '',
				data: {},
				notifications: [],
			}
		},

		created: async function() {
			await this.getPageData()

			this.log()
		},
		
		methods: {
			async getPageData() {
				try {
					this.data = await PageService.s_notification(
						this.sort,
						this.limit,
						this.page
					)
				}
				catch (err) { this.error = `This: --> ${err}` }

				if (this.data.status) {
					this.notifications = this.data.notifications
				}
				else { this.error = this.data.message }

				this.loading = false
			},

			refreshRoute() {
				// [REDIRECT] Notifications Page //
				router.push({
					name: 'notification',
					params: {
						sort: this.sort,
						limit: this.limit,
						page: this.page,
					}
				})
			},

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
					this.page = this.data.postsObj.totalPages

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async clicked(notification_id, post_id) {
				// Mark Read
				NotificationService.s_markRead(notification_id)

				// [UPDATE] //
				EventBus.$emit('update-notification')

				// [REDIRECT] //
				router.push({
					name: 'post',
					params: {
						post_id: post_id,
						limit: 20,
						page: 1,
					}
				})
			},

			log() {
				console.log('%%% [PAGE] activity %%%')
				console.log('limit:', this.limit)
				console.log('page:', this.page)
				console.log('data:', this.data)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>