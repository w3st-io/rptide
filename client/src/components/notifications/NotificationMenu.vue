<template>
	<span>
		<!-- Button -->
		<BButton
			variant="outline-primary"
			size="sm"
			class="position-relative z-index-button"
			@click="showPopper = !showPopper"
		>
			<span v-if="notifications.length != 0" class="mr-1 badge badge-danger">
				{{ reqData.unreadNotificationCount }}
			</span>

			<BellIcon size="16" />
		</BButton>

		<!-- Dropdown Menu -->
		<div
			v-show="showPopper"
			v-click-outside="outsideClicked"
			class="dropdown-menu-right position-absolute mt-1 p-1 border border-light bg-dark rounded shadow z-index-menu"
			style="width: 100%; max-width: 300px; float: left;"
		>
			<a
				v-for="notification in notifications"
				:key="notification._id"
				@click="
					clicked(notification._id, notification.comment.post._id)
					showPopper = !showPopper
				"
				class="dropdown-item text-light"
			>
				<p class="m-0 text-wrap">
					{{ notification.comment.post.title.replace(/(.{60})..+/, '$1…') }}<br>
					<span v-if="notification.type == 'comment'" class="text-secondary">
						{{ notification.comment.user.username }} made a comment
					</span>

					<span v-if="notification.type == 'reply'" class="text-secondary">
						{{ notification.comment.user.username }} replied to your comment
					</span>
				</p>
				<small class="text-secondary">
					{{ new Date(notification.createdAt).toLocaleString() }}
				</small>
			</a>

			<p
				v-if="reqData.unreadNotificationCount > 5"
				class="m-0 text-center text-wrap text-light"
			>+{{ reqData.unreadNotificationCount - 5 }} More</p>

			<!-- See All Notifications Page -->
			<div class="w-100 text-center text-light">
				<a href="" @click="redirectNotifications()">See All Notifications</a>
			</div>
		</div>
	</span>
</template>
 
<script>
	// [IMPORT] //
	import ClickOutside from 'vue-click-outside'
	import { BellIcon } from 'vue-feather-icons'

	// [IMPORT] Personal //
	import router from '@/router'
	import NotificationService from '@/services/user/NotificationService'
	import { EventBus } from '@/main'
 
	// [EXPORT] //
	export default {
		components: {
			BellIcon,
		},

		data() {
			return {
				showPopper: false,
				reqData: {},
				notifications: [],
			}
		},

		mounted() {
			// prevent click outside event with popupItem.
			this.popupItem = this.$el
		},

		async created() {
			// [UPDATE] //
			await this.readAllNotifications()

			// [EVENTBUS] //
			EventBus.$on('update-notification', () => { this.readAllNotifications() })

			// [LOG] //
			//this.log()
		},

		methods: {
			async readAllNotifications() {
				this.reqData = await NotificationService.s_readUnread(1, 5, 1)

				if (this.reqData.status) {
					this.notifications = this.reqData.notifications
				}
			},

			async clicked(notification_id, post_id) {
				// Mark Read
				NotificationService.s_markRead(notification_id)

				// [UPDATE] //
				try { await this.readAllNotifications() }
				catch (err) { console.log(`Error --> ${err}`) }

				// [UPDATE] //
				EventBus.$emit('update-notification')

				// [REDIRECT] //
				router.push({
					name: 'post',
					params: {
						post_id: post_id,
						limit: 20,
						page: 1,
					}
				})
			},

			outsideClicked() { this.showPopper = false },

			redirectNotifications() {
				// [REDIRECT] //
				router.push({
					name: 'notification',
					params: {
						sort: 1,
						limit: 5,
						page: 1,
					},
				})
			},

			log() {
				console.log('%%% [COMPONENT] NotificationMenu %%%')
				console.log('_id:', this._id)
				console.log('list:', this.list)
				console.log('btnName:', this.btnName)
				console.log('variant:', this.variant)
			}
		},

		directives: { ClickOutside }
	}
</script>

<style scoped>
	.z-index-button { z-index: 1001 !important; }

	.z-index-menu { z-index: 1000 !important; }
</style>