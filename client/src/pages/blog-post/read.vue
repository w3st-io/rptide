<template>
	<BContainer class="my-5">
		<BCard bg-variant="dark" text-variant="light" no-body class="shadow">
			<BCardHeader>
				<BRow>
					<BCol cols="12" md="10">
						<RouterLink to="/dashboard/unset/blog-post/0/5/1">
							<BButton
								variant="primary"
								size="sm"
								class=""
							>
								<h6 class="my-1">
									<ArrowLeftCircleIcon size="1.2x" class="m-0" />
									Back to Dashboard
								</h6>
							</BButton>
						</RouterLink>							
					</BCol>

					<BCol cols="12" md="2">
						<BButton
							variant="outline-danger"
							class="w-100"
							@click="showConfirm = true"
						>Delete</BButton>

						<Confirm
							v-if="showConfirm"
							@xClicked="showConfirm = false"
							@yesClicked="deleteBlog()"
							@noClicked="showConfirm = false"
						/>
					</BCol>
				</BRow>
			</BCardHeader>

			<BCardBody>
				<BRow>
					<BCol cols="12">
						<h6 class="text-secondary">
							{{ new Date(blogPost.createdAt).toLocaleString() }}
						</h6>

						<h3 class="text-primary">{{ blogPost.title }}</h3>
						<br>
					</BCol>
					
					<BCol cols="12">
						<h5>
							<CleanJSONToHTML :cleanJSON="blogPost.cleanJSON" />
						</h5>
					</BCol>
				</BRow>
			</BCardBody>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import { ArrowLeftCircleIcon } from 'vue-feather-icons'

	// [IMPORT] Personal //
	import CleanJSONToHTML from '@/components/comment/CleanJSONToHTML'
	import Confirm from '@/components/popups/Confirm'
	import PageService from '@/services/PageService'
	import BlogPostService from '@/services/user/BlogPostService'
	import router from '@/router'

	
	export default {
		data() {
			return {
				resData: {},
				error: '',
				showConfirm: false,

				blogPost: {},
			}
		},

		components: {
			Confirm,
			ArrowLeftCircleIcon,
			CleanJSONToHTML
		},

		methods: {
			async getPageData() {
				this.resData = await PageService.s_blogPost_read({
					blogPost_id: this.$route.params.blogpost_id
				})

				if (this.resData.status) { this.blogPost = this.resData.blogPost }
				else { this.error = this.resData.message }
			},

			async deleteBlog() {
				this.resData = await BlogPostService.s_delete({
					blogPost_id: this.$route.params.blogpost_id
				})

				if (this.resData.status) {
					router.push('/dashboard/unset/blog-post/0/5/1')
				}
			},
		},

		async created() {
			await this.getPageData()
		},
	}
</script>