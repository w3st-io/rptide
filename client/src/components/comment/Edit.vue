<template>
	<!-- [FORM] Edit Comment -->
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
					data: initialEditorText
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
				<span v-show="!loading">+ Update</span>
				<span v-show="loading" class="spinner-grow"></span>
			</BButton>
		</form>

		<!-- Error -->
		<span v-if="error" class="text-danger">{{ error }}</span>
	</ValidationObserver>
</template>

<script>
	import CommentService from '@/services/user/CommentService'
	import router from '@/router'

	// [EXPORT] //
	export default {
		props: {
			comment: {
				type: Object,
				required: true,
			}
		},

		data() {
			return {
				loading: false,
				showEditor: false,
				error: '',
				initialEditorText: {},
				cleanJSON: {},
				reqData: {},
			}
		},

		methods: {
			async submit() {
				this.loading = true

				this.$refs.editor._data.state.editor.save()
					.then((cleanJSON) => {
						this.cleanJSON = cleanJSON
						this.update()
					})
					.catch((err) => {
						this.error = err

						this.loading = false
					})
			},

			async update() {
				try {
					if (localStorage.usertoken) {
						this.reqData = await CommentService.s_update(
							this.comment._id,
							this.cleanJSON
						)

						if (this.reqData.status) {
							// [REDIRECT] Post Page //
							router.push({
								name: 'post',
								params: {
									post_id: this.comment.post,
									limit: 20,
									page: 1,
								}
							})
						}
						else { this.error = this.reqData.message }
					}
					else { this.error = 'Error unable to update comment, not logged in' }
				}
				catch (err) { this.error = err }
			},

			log() {
				console.log('%%% [COMPONENT] CommentEdit %%%')
				console.log('comment:', this.comment)
				console.log('error:', this.error)
			},
		},

		async created() {
			this.initialEditorText = this.comment.cleanJSON

			// [LOG] //
			//this.log()
		},
	}
</script>