<template>
	<BContainer class="my-3">
		<BCard bg-variant="dark" text-variant="light" class="mb-3">
			<FunctionButtons />
		</BCard>

		<BCard bg-variant="dark" text-variant="light" class="mb-3">
			<BRow>
				<!-- Page Nav Buttons -->
				<BCol cols="12" sm="7" class="py-2">
					<PageNavButtons
						@start-btn="startPage()"
						@prev-btn="prevPage()"
						@next-btn="nextPage()"
						@end-btn="endPage()"
						:badgeValue="page"
						style="max-width: 300px;"
					/>
				</BCol>
				
				<!-- Total Posts -->
				<BCol cols="12" sm="5" class="py-2 text-right">
					<BBadge variant="dark">
						<h6 class="m-0">
							Total Posts:<br>{{ returned.postCount }}
						</h6>
					</BBadge>
				</BCol>
			</BRow>
			
			<BRow class="mt-3">
				<BCol cols="12">
					<!-- Posts -->
					<Posts :posts="posts" @refreshData="getPageData()" />
				</BCol>
			</BRow>

			<!-- [ALERTS] -->
			<BRow class="my-3">
				<BCol cols="12">
					<Alert v-if="error" variant="danger" :message="error" />
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Posts from '@/components/admin/function/Posts'
	import FunctionButtons from '@/components/admin/FunctionButtons'
	import PageNavButtons from '@/components/controls/PageNavButtons'
	import Alert from '@/components/inform/Alert'
	import router from '@/router'
	import PageService from '@/services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Posts,
			FunctionButtons,
			PageNavButtons,
			Alert
		},

		data() {
			return {
				sort: parseInt(this.$route.params.sort),
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),
				returned: {},
				posts: [],
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Admin Log Required //
			if (!localStorage.admintoken) { router.push({ name: 'admin_login' }) }

			await this.getPageData()

			this.log()
		},

		methods: {
			switchTab(tabClicked) { this.activeTab = tabClicked },
			
			async getPageData() {
				try {
					this.returned = await PageService.s_admin_function_posts(
						this.sort,
						this.limit,
						this.page
					)
				}
				catch (err) { this.error = err }

				if (this.returned.status) { this.posts = this.returned.posts }
				else { this.error = this.returned.message }
			},

			refreshRoute() {
				router.push({
					name: 'admin_f_posts',
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
				if (this.page < this.returned.totalPages) {
					this.loading = true
					this.page++

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async endPage() {
				if (this.page != this.returned.totalPages) {
					this.loading = true
					this.page = this.returned.totalPages

					this.refreshRoute()

					await this.getPageData()
				}
			},

			log() {
				console.log('%%% [PAGE] /admin/function/posts %%%')
				console.log('returned:', this.returned)
			},
		}
	}
</script>