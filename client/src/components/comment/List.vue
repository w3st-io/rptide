<template>
	<BRow>
		<BCol cols="12">
			<ul
				v-if="comments != ''"
				class="m-0 p-0 border border-bottom-0 border-secondary"
			>
				<li v-for="comment in comments" :key="comment._id" class="list-unstyled li">
					<BRow class="m-0 comment border-bottom border-secondary text-light">
						<!-- Profile/Timestamp Bar -->
						<BCol cols="6" class="p-1 border-bottom border-secondary">
							<span class="small text-secondary">
								{{ new Date(comment.createdAt).toLocaleString() }}
							</span>
						</BCol>

						<!-- replyTo Comment Btn -->
						<BCol
							cols="6"
							class="p-1 border-bottom border-secondary text-right"
						>
							<BButton
								v-if="comment.replyToComment != null"
								variant="none"
								size="sm"
								class="dropdown-toggle"
								:class="{
									'btn-outline-secondary': openedRepliedTo != comment._id,
									'btn-outline-primary': openedRepliedTo == comment._id,
								}"
								@click="toggleOpenRepliedTo(comment._id)"
							>In Reply to Comment</BButton>
						</BCol>

						<!-- replyTo Comment -->
						<BCol
							v-if="comment.replyToComment != null"
							v-show="openedRepliedTo == comment._id"
							cols="12"
							class="p-1 border-bottom border-secondary"
						>
							<p class="small text-secondary">
								{{ comment.replyToComment.user.username }} -
								{{ new Date(comment.replyToComment.createdAt).toLocaleString() }}
								:
							</p>

							<CleanJSONToHTML
								:cleanJSON="comment.replyToComment.cleanJSON"
								class="small"
							/>
						</BCol>

						<!-- Profile Section -->
						<BCol
							cols="12" sm="2" md="2" lg="2"
							class="px-0 py-3 border-secondary"
						>
							<div class="m-auto border border-primary rounded-lg pro-img-holder">
								<img
									:src="comment.user.profile_img"
									class="m-auto w-100 pro-img"
								>
							</div>

							<p class="m-0 mt-2 text-center small">
								<span class="mark bg-primary">
									{{ comment.user.username }}
								</span>
							</p>
						</BCol>

						<!-- Comment Section -->
						<BCol cols="12" sm="10" md="10" lg="10" class="px-2 pt-3">
							<CleanJSONToHTML :cleanJSON="comment.cleanJSON" />
						</BCol>
					
						<!-- Bottom Bar -->
						<BCol cols="12" class="p-2 border-top border-secondary">
							<BRow>
								<!-- Left -->
								<BCol cols="4" class="m-0 small">
									<!-- [COMPONENT] Drop Down Menu Button -->
									<BDropdown
										variant="outline-secondary"
										left
										text="Report"
										size="sm"
										bg-variant="dark"
									>
										<BDropdownItemButton
											:disabled="disabled"
											@click="report('Innapropiate', comment._id)"
										>Innapropiate</BDropdownItemButton>

										<BDropdownItemButton
											:disabled="disabled"
											@click="report('Offensive', comment._id)"
										>Offensive</BDropdownItemButton>

										<BDropdownItemButton
											:disabled="disabled"
											@click="report('Scam', comment._id)"
										>Scam</BDropdownItemButton>

										<BDropdownItemButton
											:disabled="disabled"
											@click="report('Bot', comment._id)"
										>Bot</BDropdownItemButton>

										<BDropdownItemButton
											:disabled="disabled"
											@click="report('Spam', comment._id)"
										>Spam</BDropdownItemButton>

										<BDropdownItemButton
											:disabled="disabled"
											@click="report('Other', comment._id)"
										>Other</BDropdownItemButton>
									</BDropdown>

									<!-- Edit -->
									<BButton
										v-if="comment.user._id == $store.state.user.decoded.user_id"
										variant="none"
										size="sm"
										@click="redirectToEdit(comment._id)"
										class="py-0 text-secondary"
									>Edit</BButton>
								</BCol>
								
								<!-- Middle -->
								<BCol cols="4" class="text-center">
									<!-- Reply -->
									<BButton
										variant="outline-secondary"
										size="sm"
										@click="redirectToReply(comment._id)"
										class="text-secondary"
									>Reply</BButton>
								</BCol>

								<!-- Right -->
								<BCol
									cols="4"
									class="m-0 text-right small text-secondary"
								>
									<!-- Like Btn -->
									<BButton
										variant="none"
										@click="likeBtn(comment)"
										:class="{
											'btn-outline-success': comment.liked,
											'btn-outline-light': !comment.liked
										}"
										style="font-size: 1em;"
									>{{ comment.likeCount }} ▲</BButton>
								</BCol>
							</BRow>
						</BCol>

						<!-- Admin Bar -->
						<BCol
							v-if="adminLoggedIn"
							cols="12"
							class="p-2 border border-warning"
						>
							<BButton
								variant="outline-secondary"
								size="sm"
								@click="redirectToEdit(comment._id)"
								class="mr-1"
							>Edit</BButton>

							<BButton
								variant="outline-danger"
								size="sm"
								@click="deleteComment(comment._id)"
								class="mr-1"
							>Delete</BButton>
							
							<BButton
								variant="outline-danger"
								size="sm"
								@click="adminDelete(comment._id)"
								class="mr-1"
							>Admin-Delete</BButton>

							<span class="ml-1 small text-secondary">
								comment: {{ comment._id }} -
								User: {{ comment.user._id }}
							</span>
						</BCol>
					</BRow>
				</li>
			</ul>
			
			<!-- [DEFAULT] If No content -->
			<NoContent v-if="comments == ''" text="No comments" class="my-3" />
		</BCol>
	</BRow>
</template>

<script>
	// [IMPORT] Personal //
	import CleanJSONToHTML from './CleanJSONToHTML'
	import NoContent from '@/components/placeholders/NoContent'
	import router from '@/router'
	import a_commentService from '@/services/admin/CommentService'
	import commentService from '@/services/user/CommentService'
	
	// [EXPORT] //
	export default {
		components: {
			CleanJSONToHTML,
			NoContent,
		},
		
		props: {
			post_id: {
				type: String,
				required: true,
			},

			comments: {
				type: Array,
				required: true,
			},
		},

		data() {
			return {
				adminLoggedIn: false,
				disabled: false,
				openedRepliedTo: null,
				error: '',
			}
		},

		async created() {
			if (localStorage.admintoken) { this.adminLoggedIn = true }

			// [LOG] //
			//this.log()
		},

		methods: {	
			/******************* [DELETE] *******************/
			async deleteComment(comment_id) {
				try {
					// [DELETE] Comment //
					await commentService.s_delete(comment_id)

					// [EMIT] Refresh Comments //
					this.$emit('refreshComments') 
				}
				catch (err) { this.error = err }
			},

			async adminDelete(comment_id) {
				try {
					// [DELETE] Comment //
					await a_commentService.s_delete(comment_id)

					// [EMIT] Refresh Comments //
					this.$emit('refreshComments') 
				}
				catch (err) { this.error = err }
			},
			
			/******************* [BTN] Like *******************/
			async likeBtn(comment) {
				try { 
				// [LOG REQUIRED] //
					if (localStorage.usertoken) {
						if (comment.liked) {
							this.disabled = true

							await commentService.s_unlike(comment._id)

							this.disabled = false
						}
						else {
							this.disabled = true

							await commentService.s_like(
								this.post_id,
								comment._id,
								comment.user._id
							)

							this.disabled = false
						}

						// [READ] Update Comments //
						this.$emit('refreshComments')
					}
				}
				catch (err) { this.error = err }
			},

			/******************* [BTN] openRepliedTo *******************/
			toggleOpenRepliedTo(comment_id) {
				if (this.openedRepliedTo == comment_id) {
					this.openedRepliedTo = null
				}
				else { this.openedRepliedTo = comment_id }
			},

			/******************* [REPORT] *******************/
			report(type, comment_id) {
				commentService.s_report(this.post_id, comment_id, type)
			},

			/******************* [ROUTER + LOG] *******************/
			redirectToEdit(comment_id) {
				if (!this.disabled) {
					// [REDIRECT] //
					router.push({
						name: 'comment_edit',
						params: { comment_id, }
					})
				}
			},

			redirectToReply(comment_id) {
				if (!this.disabled) {
					// [REDIRECT] //
					router.push({
						name: 'comment_reply',
						params: { comment_id, }
					})
				}
			},

			log() {
				console.log('%%% [COMPONENT] CommentList %%%')
				console.log('Comments:', this.comments)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>

<style lang="scss" scoped>
	// [IMPORT] Personal //
	@import 'src/assets/styles/style.scss';

	.li:nth-child(even) { background: $backgroundGrey !important; }

	// Make Comments Wordwrapped
	.multiline { white-space: pre-wrap; }

	// Profile Image Holder // Profile Image //
	.pro-img-holder {
		max-width:100px;
		max-height:100px;
		width: auto;
		height: auto;
		overflow: hidden;
		
	}
	.pro-img {
		min-height: 100%;
		min-width: 100%;
	}

	// Comment List Image Fix //
	.comment img { max-width: 100%; }

	// Distinct blockquotes //
	.comment blockquote {
		margin: 0;
		padding: 0px 10px;
		background-color: rgba(127.5, 127.5, 127.5, 0.171);
		border-color: #535353;
		border-style: solid;
		border-width: 1px;
	}

	// Distinct p //
	.comment p { margin: 0; }
</style>