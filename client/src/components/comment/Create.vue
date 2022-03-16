<template>
	<!-- [FORM] Create Comment -->
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

		<!-- Error -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</ValidationObserver>
</template>

<script>
	// [IMPORT] //
	import Alert from '@/components/inform/Alert'
	import CommentService from '@/services/user/CommentService'
	import router from '@/router'

	// [EXPORT] //
	export default {
		props: {
			post_id: {
				type: String,
				required: true,
			},

			replyToComment_id: {
				type: String,
				required: false,
				default: null,
			}
		},

		data() {
			return {
				loading: false,
				error: '',
				cleanJSON: {},
			}
		},

		components: {
			Alert
		},

		methods: {
			/******************* [BTN] Submit *******************/
			async submit() {
				this.loading = true

				this.$refs.editor._data.state.editor.save()
					.then((cleanJSON) => {
						this.cleanJSON = cleanJSON
						this.commentCreate()
					})
					.catch((err) => {
						this.error = err
						this.loading = false
					})
			},

			async commentCreate() {
				try {
					if (!localStorage.usertoken) {
						this.error = 'Unable to create a comment, no token passed'
						return
					}

					this.data = await CommentService.s_create(
						this.post_id,
						this.cleanJSON,
						this.replyToComment_id,
					)

					if (this.data.status) {
						// [REDIRECT] Post Page //
						router.push({
							name: 'post',
							params: {
								post_id: this.post_id,
								limit: 20,
								page: 1,
							}
						})
					}
					else { this.error = this.data.message }
				}
				catch (err) { this.error = err }
			},
		},
	}
</script>