<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Cat Id</th>
					<th>Title</th>
					<th>Owner Email</th>
					<th>Owner Username</th>
					<th>Created At</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="post in posts" :key="post._id">
					<td>{{ post.cat_id }}</td>
					<td>{{ post.title }}</td>
					<td>{{ post.user.email }}</td>
					<td>{{ post.user.username }}</td>
					<td>{{ new Date(post.createdAt).toLocaleString() }}</td>
					<td class="text-center">
						<BButton
							variant="danger"
							@click="deletePost(post._id)"
						>Delete</BButton>
					</td>
				</tr>
			</tbody>
		</table>
		
		<!-- [AELRTS] -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@/components/inform/Alert'
	import APostService from '@/services/admin/PostService'

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
			async deletePost(post_id) {
				// Delete Post //
				try { await APostService.s_delete(post_id) }
				catch (err) { this.error = err }
				
				this.$emit('refreshData')
			},

			log() {
				console.log('%%% [COMPONENT] Admin PostsTable %%%')
				console.log('posts:', this.posts)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>