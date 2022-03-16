<template>
	<BContainer class="my-3">
		<BRow>
			<BCol cols="12">
				<BCard bg-variant="dark" text-variant="light">
					<BRow>
						<!-- Title -->
						<BCol cols="12" sm="6">
							<h4>Posts You Are Following</h4>
						</BCol>

						<!-- Page Control -->
						<BCol cols="12" sm="6">
							<PageNavButtons
								@prev-btn="prevPage()"
								@next-btn="nextPage()"
								:badgeValue="pageNumber"
								class="w-100 ml-auto"
								style="max-width: 300px;"
							/>
						</BCol>

						<!-- Total -->
						<BCol cols="12" sm="2">
							<BBadge variant="light" class="w-100">
								Total: {{ totalFollows }}
							</BBadge>
						</BCol>
					</BRow>

					<BRow>
						<BCol cols="12" class="mt-3">
							<!-- Display All the Posts -->
							<PostList
								v-if="!loading"
								:posts="posts"
								@refreshPosts="getData()"
							/>
						</BCol>
					</BRow>

					<!-- [LOADING] -->
					<BRow v-show="loading" class="mt-3">
						<BCol cols="12">
							<Alert />
						</BCol>
					</BRow>

					<!-- [ERROR] -->
					<BRow v-show="error" class="mt-3">
						<BCol cols="12">
							<Alert variant="danger" :message="'Follow Page: ' + error" />
						</BCol>
					</BRow>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import PageNavButtons from '@/components/controls/PageNavButtons'
	import Alert from '@/components/inform/Alert'
	import PostList from '@/components/post/List'
	import pageService from '@/services/PageService'
	import router from '@/router'

	export default {
		components: {
			Alert,
			PageNavButtons,
			PostList,
		},

		data() {
			return {
				pageNumber: parseInt(this.$route.params.page),
				limit: 3,
				loading: true,
				data: {},
				posts: [],
				totalFollows: 0,
				error: '',
			}
		},

		async created() {
			this.getData()

			console.log(this.posts)
		},

		methods: {
			async getData() {
				try {
					this.data = await pageService.s_followed(
						1,
						this.limit,
						this.pageNumber
					)
				}
				catch (err) { this.error = err }
				
				if (this.data.status) {
					this.posts = this.data.posts
					this.totalFollows = this.data.totalFollows
				}
				else { this.error = this.data.message }
				
				this.loading = false
			},

			prevPage() {
				// As long as the page is not going into 0 or negative //
				if (this.pageNumber != 1) {
					this.loading = true
					this.pageNumber--

					this.getData()
					
					// [REDIRECT] Cat Page //
					router.push({
						name: 'followed',
						params: { page: this.pageNumber }
					})
				}
			},

			nextPage() {
				// As long as page does not exceed max Number of Pages //
				if (this.pageNumber < this.data.totalPages) {
					this.loading = true
					this.pageNumber++

					this.getData()
					
					// [REDIRECT] Cat Page //
					router.push({
						name: 'followed',
						params: { page: this.pageNumber }
					})
				}
			},
		}
	}
</script>