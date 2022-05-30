<template>
	<BContainer class="py-5">
		<BCard bg-variant="dark" text-variant="light">
			<BRow>
				<BCol cols="12">
					<h6>Name</h6>
					<input v-model="webContent.name" type="text" class="mb-3">
				</BCol>

				<BCol>
					<ValidationObserver v-slot="{ handleSubmit }">
						<form @submit.prevent="handleSubmit(submit)" class="text-dark">
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
										image: require('@editorjs/simple-image'),
										table: require('@editorjs/table'),
										embed: require('@editorjs/embed'),
									},
								}"
								class="mb-3 bg-white border border-primary"
							/>
							
							<!-- Submit Button -->
							<BButton
								:disabled="loading"
								variant="primary"
								type="submit"
								class="w-100"
							>
								<span v-show="!loading">+ Create</span>
								<span v-show="loading" class="spinner-grow"></span>
							</BButton>
						</form>
					</ValidationObserver>
				</BCol>

				<BCol cols="12">
					<h6>{{ webContent }}</h6>
					{{ resData }}
				</BCol>
			</BRow>
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
			error: '',

			webContent: {
				name: '',
				webApp: this.$route.params.webapp,
				cleanJSON: {},
			},
		}
	},
	methods: {
		/******************* [BTN] Submit *******************/
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

			this.loading = false
		}
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