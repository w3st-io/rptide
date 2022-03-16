<template>
	<BContainer class="my-3">
		<BCard bg-variant="dark" text-variant="none">
			<h3 class="mb-3 text-light">Edit Comment "{{ comment_id }}"</h3>

			<!-- Comment Edit Component -->
			<CommentEdit
				v-if="!loading && comment != {}"
				:comment="comment"
			/>
		</BCard>

		<!-- [ALERTS] -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import CommentEdit from '@/components/comment/Edit'
	import Alert from '@/components/inform/Alert'
	import PageService from '@/services/PageService'
	import router from '@/router'

	// [EXPORT] //
	export default {
		data() {
			return {
				// Default //
				comment_id: this.$route.params.comment_id,
				loading: true,

				// Comment //
				reqData: {},
				comment: {},

				// Error //
				error: '',
			}
		},

		methods: {
			async getPage() {
				try {
					this.reqData = await PageService.s_comment_edit(this.comment_id)

					if (this.reqData.status) { this.comment = this.reqData.comment }
					else { this.error = this.reqData.message }
				}
				catch (err) { this.error = err }
			},

			log() {
				console.log('%%% [PAGE] CommentEdit %%%')
				console.log('comment:', this.comment)
				console.log('comment_id:', this.comment_id)
			},
		},

		components: {
			CommentEdit,
			Alert,
		},

		async created() {
			// [REDIRECT] Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'user_login' }) }

			// Get Comment Details //
			await this.getPage()

			// Set Loaded //
			this.loading = false
			
			// [LOG] //
			this.log()
		},
	}
</script>