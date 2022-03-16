<template>
	<BContainer class="my-5">
		<!-- [PAGE] -->
		<BRow v-if="!loading && !error" class="mb-3">
			<BCol cols="lg-9" class="mb-3 p-0">
				<BCard bg-variant="dark" text-variant="light">
					<CatList
						:categories="categories"
						groupName="General"
						class="mb-3"
					/>
				</BCard>				
			</BCol>

			<!-- Side Content -->
			<BCol cols="12" lg="3">
				<TopPosts :topPosts="topPosts" />
			</BCol>
		</BRow>

		<!-- [LOADING] -->
		<BRow v-if="loading">
			<BCol cols="12">
				<Alert variant="dark" class="m-0" />
			</BCol>
		</BRow>

		<!-- [ERROR] -->
		<BRow v-if="error">
			<BCol cols="12">
				<Alert variant="danger" :message="error" class="m-0" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import CatList from '@/components/cat/List'
	import Alert from '@/components/inform/Alert'
	import TopPosts from '@/components/home/TopPosts'
	import router from '@/router'
	import PageService from '@/services/PageService'

	export default {
		data() {
			return {
				loading: true,
				error: '',
				reqData: [],
				categories: [],
				topPosts: [],
				newsObj: {},
			}
		},

		components: {
			CatList,
			Alert,
			TopPosts,
		},

		methods: {
			async getPageData() {
				try {
					this.reqData = await PageService.s_home()
					
					// [REDIRECT] Custom Home Page Available //
					if (this.reqData.customHome == true) {
						router.push({ name: 'home' })
					}

					if (this.reqData.status) {
						this.categories = this.reqData.categories

						this.topPosts = this.reqData.topPosts
					}
					else { this.error = this.reqData.message }
					
					this.loading = false
				}
				catch (err) {
					this.error = err
					this.loading = false
				}
			},
		},

		async created() {
			await this.getPageData()
		},
	}
</script>