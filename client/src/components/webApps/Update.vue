<template>
	<div>
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
					</BCol>

					<!-- [SUBMIT] -->
					<BCol cols="12">
						<BButton
							:disabled="loading"
							variant="primary"
							size="lg"
							pill
							class="w-100"
							@click="updateWebApp()"
						>
							<span v-show="!loading">Update</span>
							<span v-show="loading" class="spinner-grow"></span>
						</BButton>
					</BCol>
				</BRow>

				<BRow v-if="error">
					<!-- [ERROR] -->
					<BCol cols="12">
						<h6 class="mt-3 mb-0 text-danger">{{ error }}</h6>
					</BCol>
				</BRow>
			</BCardBody>
		</BCard>

		<!-- [HIDDEN] -->
		<Confirm
			v-if="showConfirm"
			@xClicked="showConfirm = false"
			@yesClicked="deleteWebApp()"
			@noClicked="showConfirm = false"
		/>
	</div>
</template>

<script>
	// [IMPORT]
	import axios from 'axios'

	// [IMPORT] Personal
	import Confirm from '@/components/popups/Confirm'
	import router from '@/router'

	export default {
		props: {
			webApp_id: {
				required: true,
			},
		},

		data() {
			return {
				// [AUTH-AXIOS]
				authAxios: axios.create({
					baseURL: '/api/web-app',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`
					}
				}),
				
				success: false,
				loading: true,
				resData: {},
				error: '',
				showConfirm: false,

				webApp: {},
			}
		},

		methods: {
			async updateWebApp() {
				this.resData = await this.authAxios.post(
					'/find-one-and-update',
					{
						webApp: this.webApp
					}
				)

				if (this.resData.data.status) {
					this.success = true

					// [store] webApps
					this.$store.state.webApps = this.resData.data.webApps

					router.push({
						name: 'dashboard',
						params: {
							webapp: this.$store.state.user.workspace.webApp,
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

			async deleteWebApp() {
				this.showConfirm = false

				this.resData = await this.authAxios.post(
					'/delete-one',
					{
						webApp: {
							_id: this.webApp_id
						}
					}
				)

				if (this.resData.data.status) {
					router.push({
						name: 'dashboard',
						params: {
							webapp: this.$store.state.user.workspace.webApp,
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


			async getPageData() {
				try {
					this.resData = await this.authAxios.post(
						'/find-one',
						{
							webApp: {
								_id: this.webApp_id
							}
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
					this.message = err
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