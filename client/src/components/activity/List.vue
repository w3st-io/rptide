<template>
	<BListGroup>
		<li
			v-for="activity in activities"
			:key="activity._id"
			class="card card-body mb-2 border-secondary bg-dark"
		>
			<BRow>
				<BCol cols="sm-8">
					<!-- Created User -->
					<BRow v-if="activity.type == 'user'">
						<BCol class="m-0 p-0" style="max-width: 35px;">
							<img :src="activity.createdUser.profile_img" class="w-100">
						</BCol>

						<BCol>
							<h5>
								<a
									href="#"
									class="text-success"
									@click="redirectProfilePage(activity.user._id)"
								>{{ activity.user.username }}</a>
								joined the site!
							</h5>
						</BCol>
					</BRow>

					<!-- Created Post -->
					<BRow v-if="activity.type == 'post'">
						<BCol class="m-0 p-0" style="max-width: 35px;">
							<img :src="activity.user.profile_img" class="w-100">
						</BCol>
						<BCol>
							<h5>
								<a
									href="#"
									class="text-success"
									@click="redirectProfilePage(activity.user._id)"
								>{{ activity.user.username }}</a>

								created post: 
								<a href="#" @click="redirectPost(activity.createdPost._id)">
									{{ activity.createdPost.title.replace(/(.{60})..+/, '$1…') }}
								</a>
							</h5>
						</BCol>
					</BRow>
					
					<!-- Created Comment -->
					<BRow v-if="activity.type == 'comment'">
						<BCol class="m-0 p-0" style="max-width: 35px;">
							<img :src="activity.user.profile_img" class="w-100">
						</BCol>
						
						<BCol>
							<h5>
								<a
									href="#"
									class="text-success"
									@click="redirectProfilePage(activity.user._id)"
								>{{ activity.user.username }}</a>

								created a comment in
								<a href="#" @click="redirectPost(activity.post._id)">
									{{ activity.post.title.replace(/(.{60})..+/, '$1…') }}
								</a>
							</h5>
						</BCol>
					</BRow>
				</BCol>

				<!-- Timestamp -->
				<BCol cols="sm-4" class="text-right text-secondary">
					{{ new Date(activity.createdAt).toLocaleString() }}
				</BCol>
			</BRow>
		</li>
	</BListGroup>
</template>

<script>
	import router from '@/router'

	export default {
		props: {
			activities: {
				type: Array,
				required: true,
			},
		},

		methods: {
			redirectProfilePage(user_id) {
				router.push({
					name: 'user_profile_lookup',
					params: { user_id: user_id, }
				})
			},

			redirectPost(post_id) {
				router.push({
					name: 'post',
					params: {
						post_id: post_id,
						limit: 20,
						page: 1,
					}
				})
			},
		},
	}
</script>