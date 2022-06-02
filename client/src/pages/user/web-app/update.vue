<template>
	<BContainer class="py-5">
		<BCard
			no-body bg-variant="dark"
			text-variant="light"
			border-variant="secondary"
		>
			<BCardHeader class="border-secondary">
				<BRow>
					<BCol cols="9" sm="9" md="10" lg="10">
						<h3 class="m-0 text-center text-primary">Update Web App</h3>
					</BCol>

					<BCol cols="3" sm="3" md="2" lg="2">
						<BButton
							pill
							variant="danger"
							class="w-100"
							@click="showConfirm = true"
						>Delete</BButton>
					</BCol>
				</BRow>
			</BCardHeader>

			<BCardBody>
				<BRow v-if="!loading">
					<BCol cols="12">
						<BFormInput
							v-model="webApp.name"
							placeholder="Web Content Name"
							class="mb-3"
						/>

						{{ webApp }}
					</BCol>

					<!-- [SUBMIT] -->
					<BCol cols="12">
						<BButton
							:disabled="loading"
							variant="primary"
							size="lg"
							pill
							class="w-100"
							@click="submit()"
						>
							<span v-show="!loading">Update</span>
							<span v-show="loading" class="spinner-grow"></span>
						</BButton>
					</BCol>
				</BRow>

				<BRow>
					<!-- [ERROR] -->
					<BCol v-if="error" cols="12">
						<h6 class="mt-3 mb-0 text-danger">{{ error }}</h6>
					</BCol>
				</BRow>
			</BCardBody>
		</BCard>

		<!-- [HIDDEN] -->
		<Confirm
			v-if="showConfirm"
			@xClicked="showConfirm = false"
			@yesClicked="deleteWebContent()"
			@noClicked="showConfirm = false"
		/>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import axios from 'axios'

	// [IMPORT] Personal //
	import Confirm from '@/components/popups/Confirm'
	import router from '@/router'

	export default {
		data() {
			return {
				success: false,
				loading: true,
				resData: {},
				error: '',
				showConfirm: false,

				// [AUTH-AXIOS] //
				authAxios: axios.create({
					baseURL: '/api/user/web-app',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`
					}
				}),

				webApp: {},
			}
		},

		methods: {
			async updateWebApp() {
				this.resData = await this.authAxios.post(
					'/find-one-and-update',
					{
						webContent: this.webContent
					}
				)

				if (this.resData.data.status) {
					this.success = true

					router.push({
						name: 'user_dashboard',
						params: {
							webapp: this.$store.state.dashboard.webApp,
							tab: 'web-content',
							sort: 0,
							limit: 5,
							page: 1,
						},
					})
				}
				else {
					this.error = this.resData.data.message
				}
			},

			submit() {
				this.updateWebApp()
			},

			async deleteWebApp() {
				this.showConfirm = false

				this.resData = await this.authAxios.post(
					'/delete-one',
					{
						webApp: {
							_id: this.$route.params.webapp
						}
					}
				)

				if (this.resData.data.status) {
					router.push({
						name: 'user_dashboard',
						params: {
							webapp: this.$store.state.dashboard.webApp,
							tab: 'web-app',
							sort: 0,
							limit: 5,
							page: 1,
						},
					})
				}
				else {
					this.error = this.resData.data.message
				}
			},


			async getPageData() {
				try {
					this.resData = await this.authAxios.post(
						'/find-one',
						{
							webApp: this.$route.params.webapp
						}
					)

					if (this.resData.data.status) {
						this.webApp = this.resData.data.webApp

						this.loading = false
					}
					else {
						this.error = this.resData.data.message
					}
				}
				catch (err) {
					this.message = this.resData.data.message
				}
			},
		},

		components: {
			Confirm,
		},

		async created() {
			await this.getPageData()
		},
	}
</script>

<style lang="scss" scoped>
	@import 'src/assets/styles/style.scss';

	.form-control {
		@extend .bg-dark;
		@extend .text-light;
		@extend .border-primary;
	}
</style>