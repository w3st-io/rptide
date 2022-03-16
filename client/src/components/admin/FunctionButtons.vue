<template>
	<div>
		<BRow>
			<BCol sm="6" md="3" class="mb-2">
				<BButton
					variant="outline-warning"
					class="w-100"
					@click="redirectAdmin()"
				>Dashboard</BButton>
			</BCol>
		</BRow>

		<BRow>
			<BCol sm="6" md="3" class="mb-2">
				<BButton
					variant="outline-warning"
					class="w-100"
					@click="redirectCommentReports()"
				>commentReports</BButton>
			</BCol>

			<BCol sm="6" md="3" class="mb-2">
				<BButton
					variant="outline-warning"
					class="w-100"
					@click="redirectComments()"
				>comments</BButton>
			</BCol>

			<BCol sm="6" md="3" class="mb-2">
				<BButton
					variant="outline-warning"
					class="w-100"
					@click="redirectPosts()"
				>posts</BButton>
			</BCol>

			<BCol sm="6" md="3" class="mb-2">
				<BButton
					variant="outline-warning"
					class="w-100"
					@click="redirectUsers()"
				>users</BButton>
			</BCol>
		</BRow>
	</div>
</template>

<script>
	import router from '@/router'

	export default {
		methods: {
			redirectAdmin() {
				router.push({ name: 'admin' }) 
			},

			redirectCommentReports() {
				router.push({
					name: 'admin_f_comment_reports',
					params: {
						sort: 0,
						limit: 5,
						page: 1,
					}
				})
			},

			redirectComments() {
				router.push({
					name: 'admin_f_comment',
					params: {
						sort: 0,
						limit: 5,
						page: 1,
					}
				})
			},


			redirectPosts() {
				router.push({
					name: 'admin_f_posts',
					params: {
						sort: 0,
						limit: 5,
						page: 1,
					}
				})
			},

			redirectUsers() {
				router.push({
					name: 'admin_f_users',
					params: {
						sort: 0,
						limit: 5,
						page: 1,
					}
				})
			},
		},
	}
</script>