<template>
	<BContainer class="my-5">
		<!-- Set Page Title -->
		<VueHeadful :title="`Post - ${postTitle}`" />

		<BCard bg-variant="dark">
			<BRow v-if="!loading">
				<!-- Title -->
				<BCol cols="12" sm="10">
					<h3 v-if="post" class="m-0 text-light">
						{{ post.title }}
					</h3>
					<span class="m-0 h6 text-secondary">
						Posted by: {{ post.user.username }} -
						{{ new Date(post.createdAt).toLocaleString() }}
					</span>
				</BCol>

				<!-- Count + Follow -->
				<BCol sm="2">
					<div class="mb-3 float-right">
						<BBadge variant="light" class="ml-2">
							{{ post.followsCount }}
						</BBadge>
						<button
							:disabled="disabled"
							@click="followBtn()"
							class="ml-2 btn btn-sm btn-outline-secondary"
							:class="{ 'btn-outline-success': post.followed }"
						>{{ post.followed ? 'following ✓' : 'follow' }}</button>
					</div>
				</BCol>

				<!-- PageNumber of totalPages -->
				<BCol cols="12" sm="6">
					<BBadge variant="dark" class="mt-3 text-secondary">
						Page {{ pageNumber }} of {{ totalPages }}
					</BBadge>
				</BCol>

				<!-- Limit Set -->
				<BCol cols="12" sm="6" class="mt-3">
					<LimitSetter :limit="limit" @new-limit="newLimit" />
				</BCol>

				<!-- Add Comment -->
				<BCol cols="12" sm="6" class="mt-3">
					<BButton
						:disabled="disabled"
						variant="primary"
						size="sm"
						@click="redirectToPostCommentCreate()"
					>Add Comment</BButton>
				</BCol>

				<!-- Page Control -->
				<BCol cols="12" sm="6" class="mt-3">
					<PageNavButtons
						:badgeValue="pageNumber"
						@start-btn="startPage()"
						@prev-btn="prevPage()"
						@next-btn="nextPage()"
						@end-btn="endPage()"
						class="ml-auto"
						style="max-width: 300px;"
					/>
				</BCol>

				<!-- Comments List -->
				<BCol cols="12" class="mt-3">
					<CommentList
						:comments="comments"
						:post_id="post_id"
						@refreshComments="getPageData()"
					/>
				</BCol>

				<!-- Botton Page Control -->
				<BCol cols="12" class="mt-3">
					<PageNavButtons
						@start-btn="startPage()"
						@prev-btn="prevPage()"
						@next-btn="nextPage()"
						@end-btn="endPage()"
						:badgeValue="pageNumber"
						class="m-auto w-100"
						style="max-width: 300px;"
					/>
				</BCol>
			</BRow>

			<!-- Loading -->
			<BRow v-if="loading">
				<BCol cols="12" class="my-3">
					<Alert variant="primary" />
				</BCol>
			</BRow>

			<BRow v-if="error">
				<BCol cols="12">
					<!-- [ALERTS] -->
					<Alert variant="danger" :message="error" class="mt-3" />
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import LimitSetter from '@/components/controls/LimitSetter'
	import PageNavButtons from '@/components/controls/PageNavButtons'
	import CommentList from '@/components/comment/List'
	import Alert from '@/components/inform/Alert'
	import router from '@/router'
	import PageService from '@/services/PageService'
	import PostService from '@/services/user/PostService'

	// [EXPORT] //
	export default {
		components: {
			LimitSetter,
			PageNavButtons,
			CommentList,
			Alert,
		},

		data() {
			return {
				loading: true,
				disabled: false,
				error: '',

				post_id: this.$route.params.post_id,
				pageNumber: parseInt(this.$route.params.page),
				limit: parseInt(this.$route.params.limit),
				totalPages: 100000000,

				returned: {},
				comments: [],
				post: {},
				postTitle: 'unset',
			}
		},

		methods: {
			async followBtn() {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					// Disable Buttons //
					this.disabled = true

					if (!this.post.followed) {
						try { await PostService.s_follow(this.post._id) }
						catch (err) { this.error = err }
					}
					else {
						try { await PostService.s_unfollow(this.post._id) }
						catch (err) { this.error = err }
					}

					this.getPageData()

					// Enable Buttons //
					this.disabled = false
				}
			},


			refreshRoute() {
				// [REDIRECT] Cat Page //
				router.push({
					name: 'post',
					params: {
						cat_id: this.post_id,
						limit: this.limit,
						page: this.pageNumber,
					}
				})
			},


			async startPage() {
				if (this.pageNumber != 1) {
					this.loading = true
					this.pageNumber = 1

					this.refreshRoute()

					await this.getPageData()
				}
			},


			async prevPage() {
				if (this.pageNumber != 1) {
					this.loading = true
					this.pageNumber--

					this.refreshRoute()

					await this.getPageData()
				}
			},


			async nextPage() {
				if (this.pageNumber < this.totalPages) {
					this.loading = true
					this.pageNumber++

					this.refreshRoute()

					await this.getPageData()
				}
			},


			async endPage() {
				if (this.pageNumber != this.returned.commentsObj.totalPages) {
					this.loading = true
					this.pageNumber = this.returned.commentsObj.totalPages

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


			redirectToPostCommentCreate() {
				router.push({
					name: 'comment_create',
					params: { post_id: this.post._id, }
				})
			},


			async getPageData() {
				try {
					this.returned = await PageService.s_post(
						this.post_id,
						this.limit,
						this.pageNumber
					)

					if (this.returned.status) {
						this.post = this.returned.postObj.post
						this.comments = this.returned.commentsObj.comments
						this.totalPages = this.returned.commentsObj.totalPages
						this.postTitle = this.post.title
					}
					else { this.error = this.returned.message }

					this.loading = false
				}
				catch (err) { this.error = `This: --> ${err}` }
			},

			log() {
				console.log('%%% [PAGE] Post %%%')
				console.log('returned:', this.returned)
				console.log('post_id:', this.post_id)
				console.log('post:', this.post)
				console.log('comments:', this.comments)
				if (this.error) { console.error('error:', this.error) }
			},
		},

		created: async function() {
			// [INIT] //
			await this.getPageData()

			// [LOG] //
			//this.log()
		},
	}
</script>