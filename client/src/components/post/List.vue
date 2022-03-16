<template>
	<BRow>
		<BCol cols="12">
			<ul v-if="posts != ''" class="m-0 px-0 border border-secondary">
				<li v-for="post in posts" :key="post._id" class="list-unstyled bg-dark">
					<BRow class="m-0">
						<!-- Title --> 
						<BCol
							cols="12" md="8" lg="9"
							class="p-2"
							@click="redirectToPost(post._id)"
						>
							<h5 class="text-light">
								<img
									v-if="post.pinned"
									:src="require('../../assets/images/symbol-icons/pin.svg')"
									class="small text-secondary"
									style="width: 18px;"
								>
								{{ post.title }}
							</h5>
							<p class="m-0 small text-secondary">
								<span v-if="post.user.username" class="text-light">
									{{ post.user.username }}
								</span>
								- {{ new Date(post.createdAt).toLocaleString() }}
							</p>
						</BCol>

						<!-- Total Comments -->
						<BCol
							cols="2"
							class="p-2 d-none d-md-block text-center" 
							@click="redirectToPost(post._id)"
						>
							<p class="pb-0 m-0 align-self-center text-light">
								<span class="m-0">
									<p class="h4 m-0">
										{{ post.commentCount }}
									</p>
									<span>Comments</span>
								</span>
							</p>
						</BCol>

						<!-- Like -->
						<BCol cols="12" md="2" lg="1"
							class="p-2 text-center" 
							@click="redirectToPost(post._id)"
						>
							<h4 class="m-0 text-white">
								<button
									:disabled="disabled"
									class="w-100 btn btn-sm"
									:class="{
										'btn-outline-success': post.liked,
										'btn-outline-light': !post.liked,
									}"
									@click.prevent.stop="likeBtn(post)"
								>{{ post.likeCount }} ▲</button>
							</h4>
						</BCol>
					</BRow>

					<BRow v-if="adminLoggedIn" class="border border-warning m-0">
						<BCol cols="12" class="p-2">
							<!-- Edit -->
							<BButton
								variant="outline-warning"
								size="sm"
								class="py-0"
								@click="redirectToAdminEdit(post._id)"
							>Admin-Edit</BButton>
						
							<span class="ml-1 small text-secondary">
								{{ post._id }}
							</span>
						</BCol>
					</BRow>
				</li>
			</ul>

			<!-- Error -->
			<Alert v-if="error" variant="danger" :message="error" class="mt-3" />

			<!-- [DEFAULT] If No content -->
			<NoContent v-if="posts == ''" text="No Posts Found" class="my-3" />
		</BCol>
	</BRow>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@/components/inform/Alert'
	import NoContent from '@/components/placeholders/NoContent'
	import router from '@/router'
	import PostService from '@/services/user/PostService'

	// [EXPORT] //
	export default {
		props: {
			posts: {
				type: Array,
				required: true,
			},
		},

		components: {
			Alert,
			NoContent
		},

		data() {
			return {
				adminLoggedIn: false,
				disabled: false,
				returned: '',
				error: '',
			}
		},

		created: async function() {
			if (localStorage.admintoken) { this.adminLoggedIn = true }

			// [LOG] //
			//this.log()
		},

		methods: {
			/******************* [BTN] Like *******************/
			async likeBtn(post) {
				// [LOG-REQUIRED] //
				if (localStorage.usertoken) {
					this.disabled = true
					
					try {
						if (post.liked) {
							this.returned = await PostService.s_unlike(post._id)
						}
						else {
							this.returned = await PostService.s_like(
								post._id,
								post.user._id
							)
						}

						if (this.returned.status == true)  {
							// [UPDATE] Posts //
							this.$emit('refreshPosts')

							// Wait 1 seconds before enabling
							setTimeout(() => { this.disabled = false }, 1000)
						}
					}
					catch (err) { this.error = err }
				}
			},

			redirectToPost(post_id) {
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

			redirectToAdminEdit() {},

			log() {
				console.log('%%% [COMPONENT] PostList %%%')
				console.log('posts:', this.posts)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>

<style lang='scss' scoped>
	// [IMPORT] Personal //
	@import 'src/assets/styles/style.scss';

	li {
		&:hover { background-color: rgba(127.5, 127.5, 127.5, 0.4) !important; }
	}
	
	li:nth-child(even) {
		background-color: rgba(127.5, 127.5, 127.5, 0.2) !important;
		&:hover { background-color: rgba(127.5, 127.5, 127.5, 0.4) !important; }
	}

	.btn { font-size: 1em; }
</style>