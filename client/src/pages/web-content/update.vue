<template>
	<BContainer class="py-5">
		<BCard
			no-body bg-variant="dark"
			text-variant="light"
			border-variant="secondary"
		>
			<BCardHeader class="border-secondary">
				<BRow>
					<BCol cols="3" md="2">
						<BButton
							pill
							variant="danger"
							class="w-100"
							@click="showConfirm = true"
						>Delete</BButton>
					</BCol>

					<BCol cols="6" md="8">
						<h3 class="m-0 text-center text-primary">Update Web Content</h3>
					</BCol>

					<BCol cols="3" md="2">
						<BButton
							:disabled="loading"
							variant="success"
							pill
							class="w-100"
							@click="submit(false)"
						>
							<span v-show="!loading">Save</span>
							<span v-show="loading" class="spinner-grow"></span>
						</BButton>
					</BCol>
				</BRow>
			</BCardHeader>

			<BCardBody>
				<BRow v-if="!loading">
					<BCol cols="12">
						<BFormInput
							v-model="webContent.name"
							placeholder="Web Content Name"
							class="mb-3"
						/>
					</BCol>

					<BCol md="9">
						<!-- Editorjs -->
						<Editor
							ref="editor"
							:config="{
								tools: {
									code: require('@editorjs/code'),
									delimiter: require('@editorjs/delimiter'),
									header: require('@editorjs/header'),
									list: require('@editorjs/list'),
									quote: require('@editorjs/quote'),
									image: require('@editorjs/simple-image'),
									table: require('@editorjs/table'),
									embed: require('@editorjs/embed'),
								},
								data: webContent.cleanJSON
							}"
							class="mb-3 bg-white border border-primary text-dark"
						/>
					</BCol>

					<BCol md="3">
						<div>
							<BFormCheckbox
								v-model="webContent.visible"
								size="lg"
								class="mb-3"
							><span class="h5 text-primary">Visible</span></BFormCheckbox>

							<hr class="border-secondary">

							<label for="tags-separators">
								<span class="h5 text-primary">Tags</span>
							</label>
							<h6 class="small">separated by space, comma or semicolon</h6>

							<BFormTags
								v-model="webContent.tags"
								no-add-on-enter
								tag-pills
								separator=",;"
								input-id="tags-separators"
								placeholder="blog-post, home,.."
								addButtonVariant="primary"
								class="mb-3 border-primary bg-white"
								:limit="20"
							></BFormTags>
						</div>
					</BCol>

					<!-- [SUBMIT] -->
					<BCol md="9">
						<BButton
							:disabled="loading"
							variant="primary"
							size="lg"
							pill
							class="w-100 mb-3 mb-md-0"
							@click="submit(true)"
						>
							<span v-show="!loading">Update</span>
							<span v-show="loading" class="spinner-grow"></span>
						</BButton>
					</BCol>

					<BCol md="3">
						<BButton
							:disabled="loading"
							variant="success"
							size="lg"
							pill
							class="w-100"
							@click="submit(false)"
						>
							<span v-show="!loading">Save</span>
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
	// [IMPORT]
	import axios from 'axios'

	// [IMPORT] Personal
	import Confirm from '@/components/popups/Confirm'
	import router from '@/router'

	export default {
		data() {
			return {
				// [AUTH-AXIOS]
				authAxios: axios.create({
					baseURL: '/api/web-content',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`
					}
				}),

				success: false,
				loading: true,
				resData: {},
				error: '',
				
				showConfirm: false,
				
				webContent: {},
			}
		},

		methods: {
			async updateWebContent(jump) {
				this.resData = await this.authAxios.post(
					'/find-one-and-update',
					{
						webContent: this.webContent
					}
				)
				if (this.resData.data.status) {
					this.success = true

					if (jump) {
						router.push({
							name: 'dashboard',
							params: {
								webapp: localStorage.selectedWebApp,
								tab: 'web-content',
								sort: 0,
								limit: 5,
								page: 1,
							},
						})
					}
				}
				else {
					this.error = this.resData.data.message
				}
			},

			submit(jump) {
				this.$refs.editor._data.state.editor.save().then(
					(data) => {
						this.webContent.cleanJSON = data
						this.updateWebContent(jump)
					}
				).catch(
					(err) => {
						this.error = err
						this.loading = false
					}
				)
			},

			async deleteWebContent() {
				this.showConfirm = false
				this.resData = await this.authAxios.post(
					'/delete-one',
					{
						webContent: {
							_id: this.$route.params.webcontent
						}
					}
				)
				console.log(this.resData);
				if (this.resData.data.status) {
					router.push({
						name: 'dashboard',
						params: {
							webapp: localStorage.selectedWebApp,
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
							webContent: this.$route.params.webcontent
						}
					)

					console.log(this.resData);
					if (this.resData.data.status) {
						this.webContent = this.resData.data.webContent
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