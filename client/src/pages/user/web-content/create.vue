<template>
	<BContainer class="py-5">
		<BCard bg-variant="dark" text-variant="light" border-variant="secondary" no-body>
			<BCardHeader class="border-secondary">
				<h3 class="m-0 text-center text-primary">Create Web Content</h3>
			</BCardHeader>

			<BCardBody>
				<BRow>
					<BCol cols="12">
						<input
							v-model="webContent.name"
							placeholder="Web Content Name"
							type="text"
							class="mb-3"
						>
					</BCol>

					<BCol cols="12" md="9">
						<!-- Editorjs -->
						<Editor
							ref="editor"
							:config="{
								tools: {
									code: require('@editorjs/code'),
									delimiter: require('@editorjs/delimiter'),
									header: require('@editorjs/header'),
									link: require('@editorjs/link'),
									list: require('@editorjs/list'),
									quote: require('@editorjs/quote'),
									simpleimage: require('@editorjs/simple-image'),
									table: require('@editorjs/table'),
									embed: require('@editorjs/embed'),
								},
							}"
							class="mb-3 bg-white border border-primary text-dark"
						/>
					</BCol>
				
					<BCol cols="12" md="3">
						<div>
							<label for="tags-separators">
								<span class="h5 text-primary">Tags</span>
							</label>
							<h6 class="small">separated by space, comma or semicolon</h6>
							<b-form-tags
								v-model="webContent.tags"
								no-add-on-enter
								tag-pills
								separator=",;"
								input-id="tags-separators"
								placeholder="blog-post, home,.."
								addButtonVariant="primary"
								class="mb-3 border-primary"
								:limit="20"
							></b-form-tags>
						</div>

						<BFormCheckbox
							v-model="webContent.draft"
							size="lg"
							class="mb-3"
						><span class="h5 text-primary">Draft</span></BFormCheckbox>
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
							<span v-show="!loading">Submit</span>
							<span v-show="loading" class="spinner-grow"></span>
						</BButton>
					</BCol>

					<!-- [ERROR] -->
					<BCol v-if="error" cols="12">
						<h6 class="mt-3 mb-0 text-danger">{{ error }}</h6>
					</BCol>
				</BRow>
			</BCardBody>
		</BCard>
	</BContainer>
</template>

<script>
// [IMPORT] Personal //
import router from '../../../router'
import WebContentService from '../../../services/user/WebContentService'

export default {
	data() {
		return {
			resData: {},
			loading: false,
			success: false,
			error: '',

			webContent: {
				name: '',
				webApp: this.$route.params.webapp,
				draft: true,
				cleanJSON: {},
			},
		}
	},
	methods: {
		async submit() {
			this.loading = true
			this.error = ''

			this.$refs.editor._data.state.editor.save().then(
				(data) => {
					this.webContent.cleanJSON = data

					this.createWebContent()
				}
			).catch(
				(err) => {
					this.error = err
					this.loading = false
				}
			)
		},

		async createWebContent() {
			this.resData = await WebContentService.s_create(this.webContent)

			if (this.resData.status) {
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

				console.log(this.$store.state.dashboard);
			}
			else {
				this.error = this.resData.message
			}

			this.loading = false
		},
	},
}
</script>

<style lang="scss" scoped>
	@import 'src/assets/styles/style.scss';
	
	input {
		@extend .form-control;
		@extend .bg-dark;
		@extend .text-light;
		@extend .border-primary;
	}
</style>