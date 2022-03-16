<template>
	<section
		class="w-100 d-flex flex-column-reverse fixed-bottom my-3 mr-4 ml-auto"
		style="max-width: 300px;"
	>
		<!-- Show Button -->
		<BButton
			variant="primary"
			size="lg"
			class="ml-auto p-0 rounded-circle shadow"
			style="width: 50px; height: 50px; font-family: monospace;"
			@click="userShowClicked()"
		>
			<span v-if="!show" style="font-size: 1em;">
				{{ !userShow ? '+' : '-' }}
			</span>
			<span
				v-if="show"
				class="spinner-grow spinner-grow-sm"
				role="status"
				aria-hidden="true"
			></span>
		</BButton>

		<BCard
			v-show="show || userShow"
			v-for="notification in notifications"
			:key="notification._id"
			no-body
			bg-variant="primary"
			text-variant="light"
			class="flex-card w-100 mb-3 fade-in shadow"
		>
			<BCardHeader class="p-2">
				<span class="small">
					{{ notification.comment.post.title.replace(/(.{60})..+/, '$1…') }}
				</span>
				<button
					type="button"
					class="ml-2 mb-1 close"
					@click="closeClicked(notification._id)"
				><span aria-hidden="true">&times;</span></button>
			</BCardHeader>
			<BCardBody class="p-2">
				<p class="card-text small">
					{{ notification.comment.user.username }}
					posted a
					{{ notification.type }}
				</p>
			</BCardBody>
		</BCard>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import NotificationService from '@/services/user/NotificationService'
	import { EventBus } from '@/main'

	// [EXPORT] //
	export default {
		data() {
			return {
				show: true,
				userShow: false,
				reqData: {},
				notifications: [],
			}
		},

		created: async function() {
			// [UPDATE] //
			await this.readAllUnreadNotifications()

			// [ON-EVENTBUS] //
			EventBus.$on('update-notification', () => {
				this.readAllUnreadNotifications()
			})

			// [LOG] //
			//this.log()
		},

		methods: {
			async readAllUnreadNotifications() {
				this.show = true

				this.reqData = await NotificationService.s_readUnread(1, 5, 1)

				if (this.reqData.status) {
					this.notifications = this.reqData.notifications
				}

				// Wait 3 seconds
				setTimeout(() => { this.show = false }, 5000)
			},

			closeClicked(notification_id) {
				NotificationService.s_markRead(notification_id)

				// [UPDATE] //
				EventBus.$emit('update-notification')
			},

			userShowClicked() {
				this.userShow = !this.userShow
			},
		
			log() {
				console.log('%%% [COMPONENT] PopUpNotifications %%%')
				console.log('reqData:', this.reqData)
				console.log('nothifications:', this.notifications)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.fade-in {
		opacity: 1;
		animation-name: fadeInOpacity;
		animation-iteration-count: 1;
		animation-timing-function: ease-in;
		animation-duration: .5s;
	}

	@keyframes fadeInOpacity {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}
</style>