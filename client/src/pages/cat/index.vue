<template>
	<BContainer class="my-5">
		<!-- Set Page Title -->
		<VueHeadful :title="`Cat - ${cat.title}`" />

		<BRow>
			<BCol cols="12">
				<BCard bg-variant="dark" text-variant="light" class="shadow">
					<!-- Cat Title Header -->
					<BRow>
						<!-- Title -->
						<BCol cols="12" sm="8" md="8" lg="6">
							<h3 class="m-0 text-light">{{ cat.title }}</h3>
						</BCol>

						<!-- Post Count -->
						<BCol
							cols="12" sm="4" md="4" lg="6"
							class="text-right d-none d-sm-block"
						>
							<BBadge
								v-if="data.postsObj"
								variant="dark"
								class="mb-2 text-secondary"
							>
								<span class="h5">
									Total Posts: {{ data.postsObj.postsCount }}
								</span>
							</BBadge>
						</BCol>

						<!-- PageNumber of totalPages -->
						<BCol cols="12" sm="6">
							<BBadge
								v-if="data.postsObj"
								variant="dark"
								class="mt-3 text-secondary"
							>
								Page {{ page }} of {{ data.postsObj.totalPages }}
							</BBadge>
						</BCol>

						<!-- Limit Set -->
						<BCol cols="12" sm="6" class="mt-3">
							<LimitSetter :limit="limit" @new-limit="newLimit" />
						</BCol>

						<!-- Create Button -->
						<BCol cols="12" sm="3" md="4" lg="2" class="py-2">
							<BButton
								variant="primary"
								size="sm"
								class="w-100"
								@click="redirectToCatPostCreate()"
							>Create Post</BButton>
						</BCol>

						<!-- Page Nav Buttons -->
						<BCol cols="12" sm="9" md="8" lg="10" class="py-2">
							<PageNavButtons
								@start-btn="startPage()"
								@prev-btn="prevPage()"
								@next-btn="nextPage()"
								@end-btn="endPage()"
								:badgeValue="page"
								class="ml-auto"
								style="max-width: 300px;"
							/>
						</BCol>						
					</BRow>

					<BRow class="text-center">
						<!-- Tabs -->
						<BCol cols="12" class="py-2">
							<ButtonTabs
								:tabs="['recent', 'popular']"
								@tabClicked="tab"
								class="mx-auto mb-2"
								style="max-width: 300px;"
							/>
						</BCol>
					</BRow>

					<BRow>
						<!-- Post List -->
						<BCol cols="12">
							<PostList
								v-if="!loading"
								:posts="posts"
								@refreshPosts="getPageData()"
							/>
						</BCol>
					</BRow>

					<BRow v-show="loading" class="mt-3">
						<!-- Loading -->
						<BCol cols="12"><Alert /></BCol>
					</BRow>

					<BRow class="mt-3">
						<!-- Botton Page Control -->
						<BCol cols="12">
							<PageNavButtons
								@start-btn="startPage()"
								@prev-btn="prevPage()"
								@next-btn="nextPage()"
								@end-btn="endPage()"
								:badgeValue="page"
								class="m-auto w-100"
								style="max-width: 300px;"
							/>
						</BCol>
					</BRow>
				</BCard>
			</BCol>
		</BRow>

		<BRow v-show="error" class="mt-3">
			<!-- Error -->
			<BCol cols="12">
				<Alert variant="danger" :message="'Cat Page: ' + error" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import ButtonTabs from '@/components/controls/ButtonTabs'
	import LimitSetter from '@/components/controls/LimitSetter'
	import PageNavButtons from '@/components/controls/PageNavButtons'
	import Alert from '@/components/inform/Alert'
	import PostList from '@/components/post/List'
	import router from '@/router'
	import PageService from '@/services/PageService'

	// [EXPORT] //
	export default {
		components: {
			ButtonTabs,
			LimitSetter,
			PageNavButtons,
			Alert,
			PostList,
		},

		data() {
			return {
				cat_id: this.$route.params.cat_id,
				sort: parseInt(this.$route.params.sort),
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),
				loading: true,
				data: {},
				cats: [],
				posts: [],
				cat: {},
				error: '',
			}
		},

		methods: {
			async tab(tab) {
				this.loading = true

				if (tab == 'recent') { this.sort = 0 }
				else { this.sort = 1 }

				this.refreshRoute()

				await this.getPageData()
			},

			async getPageData() {
				try {
					this.data = await PageService.s_cat(
						this.cat_id,
						this.sort,
						this.limit,
						this.page,
					)
				}
				catch (err) { this.error = `This: --> ${err}` }

				if (this.data.status) {
					// Store Posts & Cats //
					this.posts = this.data.postsObj.posts
					this.categories = this.data.categories

					// Get Cat Details //
					this.categories.forEach(category => {
						category.cats.forEach(cat => {
							if (cat.cat_id === this.cat_id) { this.cat = cat }
						})
					})
				}
				else { this.error = this.data.message }

				this.loading = false
			},

			refreshRoute() {
				// [REDIRECT] Cat Page //
				router.push({
					name: 'cat',
					params: {
						cat_id: this.cat_id,
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
				if (this.page < this.data.postsObj.totalPages) {
					this.loading = true
					this.page++

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async endPage() {
				if (this.page != this.data.postsObj.totalPages) {
					this.loading = true
					this.page = this.data.postsObj.totalPages

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async newLimit(limit) {
				this.limit = limit
				this.loading = true
				this.pageNumber = 1

				this.refreshRoute()

				await this.getPageData()
			},

			redirectToCatPostCreate() {
				router.push({
					name: 'post_create',
					params: { cat_id: this.cat.cat_id }
				})
			},
		},

		created() {},
	}
</script>