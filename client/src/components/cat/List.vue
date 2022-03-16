<template>
	<div>
		<BCard
			v-for="(category, i) in categories"
			:key="i"
			no-body
			bg-variant="dark"
			class="mb-3"
		>
			<!-- Card Header -->
			<BCardHeader class="p-1">
				<h6 v-if="groupName" class="m-0 p-0">{{ category.category }}</h6>
			</BCardHeader>

			<!-- Card Body -->
			<BCardBody class="p-0">
				<BListGroup class="w-100 m-0 px-0">
					<BListGroupItem
						v-for="(cat, index) in category.cats" :key="index"
						class="p-0 border-secondary"
						bg-variant="dark"
					>
						<BRow class="m-0">
							<!-- Image Section -->
							<BCol
								cols="3" sm="2" md="2" lg="1" xl="1"
								class="align-self-center"
								@click="redirectToCatPosts(cat.cat_id)"
							>
								<div class="overflow-auto rounded">
									<img
										:src="cat.imgSrc"
										class="w-100 img-padding bg-secondary"
									>
								</div>
							</BCol>

							<!-- Title -->
							<BCol
								cols="9" sm="10" md="10" lg="7" xl="6"
								class="py-3"
								@click="redirectToCatPosts(cat.cat_id)"
							>
								<h4 class="text-primary">{{ cat.title }}</h4>
								<p class="m-0 d-none d-sm-block text-light">
									{{ cat.description }}
								</p>
							</BCol>

							<!-- Count -->
							<BCol
								cols="12" sm="12" md="2" lg="1" xl="1"
								class="p-3 text-right d-none d-md-block"
								@click="redirectToCatPosts(cat.cat_id)"
							>
								<a href="#" class="text-secondary">
									<BBadge variant="unset" class="p-0 align-self-center">
										<h5 class="m-0">{{ cat.totalPosts }}</h5>
										<span class="small"><h6 class="m-0">Posts</h6></span>
									</BBadge>
								</a>
							</BCol>

							<!-- Recent Posts -->
							<BCol
								v-if="cat.recentPost"
								cols="12" sm="12" md="10" lg="3" xl="4"
								class="d-none d-md-block rounded"
							>
								<BRow>
									<BCol cols="12">
										<h1 class="m-0 mt-1 text-center small text-secondary">
											Recent Post
										</h1>
									</BCol>

									<!-- Post -->
									<BCol cols="9">
										<a
											href="#"
											class="small"
											@click="redirectToRecentPost(cat.recentPost._id)"
										>
											{{ cat.recentPost.title.replace(/(.{60})..+/, '$1…') }}
										</a>
										<p class="mb-1 small text-light">
											{{ new Date(cat.recentPost.createdAt).toLocaleString() }}
										</p>
									</BCol>

									<!-- Profile -->
									<BCol cols="3" class="p-1 text-center">
										<img
											:src="cat.recentPost.user.profile_img"
											alt="x" 
											class="w-100 border border-primary rounded"
											style="max-width:50px;"
										>
										<p class="m-0 small">
											{{ cat.recentPost.user.username }} 
										</p>
									</BCol>
								</BRow>
							</BCol>
						</BRow>
					</BListGroupItem>
				</BListGroup>
			</BCardBody>
		</BCard>
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@/router'

	export default {
		props: {
			categories: {
				type: Array,
				required: true,
			},
			groupName: {
				type: String,
				required: false,
			},
		},

		async created() {
			// [LOG] //
			//this.log()
		},

		methods: {
			redirectToCatPosts(cat_id) {
				router.push({
					name: 'cat',
					params: {
						cat_id: cat_id,
						sort: 0,
						limit: 20,
						page: 1,
					}
				})
			},

			redirectToRecentPost(post_id) {
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

			log() {
				console.log('%%% [COMPONENT] Cat List %%%')
				console.log('cats:', this.categories)
				console.log('totalPosts:', this.totalPosts)
			},
		}
	}
</script>

<style lang="scss" scoped>
	// [IMPORT] Personal //
	@import 'src/assets/styles/style.scss';

	.list-group-item {
		@extend .bg-dark;
		&:hover { background-color: rgba(255, 255, 255, 0.15) !important; }
	}
	.list-group-item:nth-child(even) {
		background: $backgroundGrey !important;
		&:hover { background-color: rgba(255, 255, 255, 0.15) !important; }
	}

	.img-padding { padding: 20%; }
</style>