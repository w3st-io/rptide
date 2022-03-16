<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Post Id</th>
					<th>Comment</th>
					<th>Owner Email</th>
					<th>Owner Username</th>
					<th>Created At</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="comment in comments" :key="comment._id">
					<td>{{ comment.post.title }}</td>
					<td>{{ comment.text }}</td>
					<td>{{ comment.user.email }}</td>
					<td>{{ comment.user.username }}</td>
					<td>{{ new Date(comment.createdAt).toLocaleString() }}</td>
					<td class="text-center">
						<BButton
							variant="danger"
							@click="deleteComment(comment._id)"
						>Delete</BButton>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- [ALERTS] -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@/components/inform/Alert'
	import a_commentService from '@/services/admin/CommentService'

	// [EXPORT] //
	export default {
		props: {
			comments: {
				type: Array,
				required: true,
			},
		},

		components: {
			Alert,
		},

		data() {
			return {
				error: '',
			}
		},

		async created() {
			// [LOG] //
			//this.log()
		},

		methods: {
			async deleteComment(comment_id) {
				// Delete Comment //
				try { await a_commentService.s_delete(comment_id) }
				catch (err) { this.error = err }
				
				this.$emit('refreshData')
			},

			log() {
				console.log('%%% [COMPONENT] Admin CommentsTable %%%')
				console.log('comments:', this.comments)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>