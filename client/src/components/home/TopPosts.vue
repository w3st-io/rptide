<template>
	<!-- Popular Posts -->
	<BCard bg-variant="dark" text-variant="light">
		<BListGroup>
			<BListGroupItem class="p-2 text-center bg-dark">
				<h5>Top Posts</h5>
			</BListGroupItem>

			<BListGroupItem
				v-for="post in topPosts" :key="post._id"
				class="p-2 bg-dark"
			>
				<h6>
					<a href="#" @click="redirectToPost(post._id)">
						{{ post.title.replace(/(.{60})..+/, '$1…') }}
					</a>
				</h6>

				{{ post.user.username }}
				<span class="text-secondary">
					-
					{{ new Date(post.createdAt).toLocaleString() }}
				</span>
			</BListGroupItem>
		</BListGroup>
	</BCard>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@/router'

	export default {
		props: {
			topPosts: {
				type: Array,
				required: true,
			},
		},

		methods: {
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
		}
	}
</script>