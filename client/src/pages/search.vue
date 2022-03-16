<template>
	<BContainer class="my-5">
		<!-- Search Result -->
		<BRow class="">
			<BCol cols="12" class="text-primary">
				<h4>Search Results for "{{ $route.params.query }}"</h4>
			</BCol>
		</BRow>

		<BCard bg-variant="dark" text-variant="light" class="shadow">
			<BTabs pills>
				<!-- Searches -->
				<BTab
					title="Searches"
					v-bind="{ 'active': $route.params.tab == 1 }"
					class="py-5"
					@click="switchTab('1')"
				>
					<BRow>
						<BCol cols="12" md="2">
							<!-- Controls -->
							<BNav class="mb-3 flex-column nav-pills">
								<!-- Users -->
								<BButton
									variant="none"
									class="m-0 mb-3 border border-primary"
									:class="{
										'btn-primary': type == 'posts',
										'btn-outline-primary': type !== 'posts'
									}"
									@click="searchRedirect('posts')"
								>
									<span class="float-left">Posts</span>

									<!-- Count -->
									<div
										class="float-right px-2 font-weight-bold rounded"
										:class="{
											'bg-dark text-primary': type == 'posts',
											'bg-primary text-dark': type !== 'posts'
										}"
										style="font-size: 1em;"
									>{{ search.postCount }}</div>
								</BButton>

								<!-- Users -->
								<BButton
									variant="none"
									class="m-0 mb-3 border border-primary"
									:class="{
										'btn-primary': type == 'users',
										'btn-outline-primary': type !== 'users'
									}"
									@click="searchRedirect('users')"
								>
									<span class="float-left">Users</span>

									<!-- Count -->
									<div
										class="float-right px-2 font-weight-bold rounded"
										:class="{
											'bg-dark text-primary': type == 'users',
											'bg-primary text-dark': type !== 'users'
										}"
										style="font-size: 1em;"
									>{{ search.userCount }}</div>
								</BButton>
							</BNav>
						</BCol>

						<BCol cols="10">
							<!-- Page Control -->
							<PageNavButtons
								:badgeValue="page"
								@start-btn="startPage()"
								@prev-btn="prevPage()"
								@next-btn="nextPage()"
								@end-btn="endPage()"
								class="ml-auto"
								style="max-width: 300px;"
							/>
							<br>

							<!-- Loading -->
							<Alert v-if="loading" variant="primary" />

							<!-- Post List -->
							<PostList
								v-if="!loading && type == 'posts'"
								:posts="search.posts"
								@refreshPosts="getPageData()"
							/>

							<!-- User List -->
							<UserList
								v-if="!loading && type == 'users'"
								:users="search.users"
							/>
						</BCol>
					
						<BCol cols="12">
							<!-- Alert -->
							<h6 class="text-danger">{{ error }}</h6>
						</BCol>
					</BRow>
				</BTab>
			</BTabs>
		</BCard>
	</BContainer>
</template>

<script>
	import PageNavButtons from '@/components/controls/PageNavButtons'
	import Alert from '@/components/inform/Alert'
	import PostList from '@/components/post/List'
	import UserList from '@/components/user/List'
	import PageService from '@/services/PageService'
	import router from '@/router'
	import { EventBus } from '@/main'

	export default {
		components: {
			PageNavButtons,
			Alert,
			PostList,
			UserList,
		},

		data() {
			return {
				// [ROUTER] //
				type: this.$route.params.type,
				tab: this.$route.params.tab,
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),
				
				search: {
					posts: [],
					postCount: 0,
					users: [],
					userCount: 0,
				},
				
				reqData: '',

				loading: true,
				error: '',
			}
		},

		methods: {
			async getPageData() {
				this.loading = true
				
				try {
					this.reqData = await PageService.s_search(
						this.$route.params.query,
						this.type,
						this.limit,
						this.page,
					)

					if (this.reqData.status) {
						this.search.posts = this.reqData.postResults
						this.search.postCount = this.reqData.postCount
						this.search.users = this.reqData.userResults
						this.search.userCount = this.reqData.userCount
					}
					else { this.error = this.reqData.message }
				}
				catch (err) { this.error = err }

				this.loading = false
			},

			refreshRoute() {
				router.push({
					name: 'search',
					params: {
						query: this.$route.params.query,
						tab: this.tab,
						type: this.type,
						limit: this.limit,
						page: this.page,
					}
				})
	
				EventBus.$emit('force-rerender')
			},

			async startPage() {
				if (this.page != 1) {
					this.loading = true
					this.page = 1

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async prevPage() {
				if (this.page != 1) {
					this.loading = true
					this.page--

					this.refreshRoute()


					await this.getPageData()
				}
			},

			async nextPage() {
				if (this.page < this.reqData.totalPages) {
					this.loading = true
					this.page++

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async endPage() {
				if (this.page != this.reqData.totalPages) {
					this.loading = true
					this.page = this.reqData.totalPages

					this.refreshRoute()

					await this.getPageData()
				}
			},

			searchRedirect(type) {
				if (this.$route.params.query) {
					router.push({
						name: 'search',
						params: {
							query: this.$route.params.query,
							tab: 1,
							type: type,
							limit: 5,
							page: 1,
						}
					})
	
					EventBus.$emit('force-rerender')
				}
			},

			async switchTab(tab) {
				this.tab = tab

				this.refreshRoute()

				await this.getPageData()
			},
		},

		async created() {
			await this.getPageData()
		},
	}
</script>

<style lang="scss" scoped>
	.result-option {
		:hover {
			background-color: rgba(255, 255, 255, 0.171) !important;
		}
	}
</style>