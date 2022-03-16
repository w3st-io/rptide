<template>
	<BContainer class="my-5">
		<!-- Informative Message -->
		<Alert variant="info" :message="message" />

		<BCard bg-variant="dark" text-variant="light" class="shadow">
			<BRow v-if="!loading">
				<BCol cols="12">
					<h3 class="mb-3 text-light">Create Post in {{ catTitle }}</h3>
				</BCol>

				<BCol cols="12">
					<ValidationObserver v-slot="{ handleSubmit }">
						<!-- [FORM] Create Post -->
						<form @submit.prevent="handleSubmit(submit)">
							<!-- Text Input -->
							<ValidationProvider
								tag="div"
								class="form-group" 
								name="confirmation"
								rules="required"
								v-slot="{ errors }"
							>
								<label class="font-weight-bold text-primary">
									Post Title
								</label>
								<input
									id="create-post"
									type="text"
									class="
										w-100
										form-control
										text-dark
										bg-light
										border-secondary
									"
									:class="{
										'is-invalid border-danger': errors != ''
									}"
									placeholder="Post Title Here"
									aria-label="Recipient's username"
									v-model="title"
								>
								
								<!-- [ERROR] -->
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>

							<!-- Text Area -->
							<ValidationProvider
								tag="div"
								class="form-group" 
								name="confirmation"
								rules=""
								v-slot="{ errors }"
							>
								<!-- Editorjs -->
								<Editor
									ref="editor"
									holder="vue-editor-js"
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
									class="bg-white text-dark border border-primary"
								/>

								<!-- Error -->
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>

							<!-- Submit Button -->
							<BButton
								:disabled="disabled"
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
			</BRow>

			<BRow v-if="error">
				<BCol cols="12">
					<!-- [ERROR] -->
					<Alert
						v-if="error"
						variant="danger"
						:message="error"
						class="mt-3 mb-0"
					/>
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@/components/inform/Alert'
	import router from '@/router'
	import PageService from '@/services/PageService'
	import PostService from '@/services/user/PostService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
		},

		data() {
			return {
				cat_id: this.$route.params.cat_id,

				message: 'Please past a URL for any images into a text block (URL must end in either ".jpg" or ".png"). Max amount of blocks is 20',
				disabled: false,
				loading: false,
				error: '',

				reqData: {},
				cats: [],
				cat: {},
				catTitle: '',

				title: '',
				cleanJSON: {},
			}
		},

		methods: {
			submit() {
				if (localStorage.usertoken) {
					this.$refs.editor._data.state.editor.save()
						.then((cleanJSON) => {
							this.cleanJSON = cleanJSON
							this.postCreate()
						})
						.catch(err => { this.error = err })
				}
				else {
					this.error = 'Error unable to update comment, no token passed'
				}
			},

			// [CREATE] Create Post Via PostService Function //
			async postCreate() {
				try {
					this.disabled = true
					this.loading = true

					if (!localStorage.usertoken) {
						this.error = 'Error unable to create post, not logged in'

						this.disabled = false
						this.loading = false
						return
					}

					this.reqData = await PostService.s_create(
						this.cat.cat_id,
						this.title,
						this.cleanJSON
					)

					this.disabled = false
					this.loading = false

					if (this.reqData.status) {
						// [REDIRECT] Cat Page //
						router.push({
							name: 'cat',
							params: {
								cat_id: this.cat.cat_id,
								sort: 0,
								limit: 20,
								page: 1,
							}
						})
					}
					else { this.error = this.reqData.message }

					this.disabled = false
					this.loading = false
				}
				catch (err) {
					this.error = err
					this.disabled = false
					this.loading = false
				}
			},

			async getPageData() {
				this.loading = true

				this.reqData = await PageService.s_post_create()

				if (this.reqData.status) {
					// Store Cats //
					this.categories = this.reqData.categories
					
					// Get Cat Details //
					this.categories.forEach(category => {
						category.cats.forEach(cat => {
							if (cat.cat_id === this.cat_id) { this.cat = cat }
						})
					})

					this.catTitle = this.cat.title
				}

				this.loading = false
			},
		},

		async created() {
			// [REDIRECT] Not Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'user_login' }) }

			// Get Page Data //
			await this.getPageData()
		},
	}
</script>