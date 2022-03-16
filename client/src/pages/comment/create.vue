<template>
	<BContainer class="my-3">
		<BCard bg-variant="dark" text-variant="none">
			<h3 class="mb-3 text-light">Create Comment</h3>
		
			<!-- Informative Message -->
			<Alert variant="info" :message="message" />

			<!-- Comment Create Component -->
			<CommentCreate v-if="!loading" :post_id="post_id" />
		</BCard>

		<!-- [ALERTS] -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import CommentCreate from '@/components/comment/Create'
	import Alert from '@/components/inform/Alert'
	import PageService from '@/services/PageService'
	import router from '@/router'

	// [EXPORT] //
	export default {
		components: {
			CommentCreate,
			Alert,
		},

		data() {
			return {
				// Default //
				loading: true,
				post_id: this.$route.params.post_id,
				pageData: {},
				post: {},
				data: {},

				// Msssage + Error //
				message: 'Please past a URL for any images into a text block (URL must end in either ".jpg" or ".png"). Max amount of blocks is 20',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'user_login' }) }			

			// Get Post Details // Assign post data //
			this.pageData = await PageService.s_comment_create(this.post_id)
			this.post = this.pageData.post

			// Set Loaded //
			this.loading = false

			// [LOG] //
			this.log()
		},

		methods: {
			log() {
				console.log('%%% [PAGE] PostCommentCreate %%%')
				console.log('post_id:', this.post_id)
				console.log('pageData:', this.pageData)
				console.log('post:', this.post)
				console.log('data:', this.data)
			},
		}
	}
</script>