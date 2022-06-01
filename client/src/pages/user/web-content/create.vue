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

					<BCol cols="12" md="9" lg="10">
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
				
					<BCol cols="12" md="3" lg="2">
						<BFormCheckbox
							v-model="webContent.draft"
							size="lg"
							class="mb-3"
						>Draft</BFormCheckbox>

						<h6>Name: {{ webContent.name }}</h6>
						<h6>Draft: {{ webContent.draft }}</h6>
						<h6>CleanJSON Blocks: {{ webContent.cleanJSON.blocks }}</h6>
					</BCol>

					<!-- [SUBMIT] -->
					<BCol cols="12">
						<BButton
							:disabled="loading"
							variant="primary"
							size="lg"
							pill
							class="w-100"
							@click="createWebContent()"
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

			if (this.resData) {
				this.success = true
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