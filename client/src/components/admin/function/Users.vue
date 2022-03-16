<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Email</th>
					<th>Username</th>
					<th>Created At</th>
					<th>View Profile</th>
					<th>Ban</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="user in users" :key="user._id">
					<td>{{ user.email }}</td>
					<td>{{ user.username }}</td>
					<td>{{ new Date(user.createdAt).toLocaleString() }}</td>
					<td>
						<BButton
							variant="secondary"
							class="w-100"
							@click="viewProfile(user._id)"
						>View Profile</BButton>
					</td>
					<td class="text-center">
						<BButton
							variant="outline-danger"
							class="w-100"
							@click="banUser(user._id)"
						>Ban</BButton>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- [ALERTS] -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</section>
</template>

<script>
	// [IMPORT] //
	import router from '@/router'
	import AUserService from '@/services/admin/UserService'
	import Alert from '@/components/inform/Alert'

	// [EXPORT] //
	export default {
		posts: {
			type: Array,
			required: true,
		},

		components: {
			Alert
		},

		data() {
			return {
				error: '',
			}
		},

		async created() {
			// [LOG] //
			//this.log()
		},

		methods: {
			viewProfile(user_id) {
				router.push({
					name: 'user_profile_lookup',
					params: { user_id: user_id, }
				})
			},

			async banUser(user_id) {
				// Ban User //
				try { await AUserService.s_banUser(user_id, 1) }
				catch (err) { this.error = err }

				this.$emit('refreshData')
			},

			log() {
				console.log('%%% [COMPONENT] Admin UsersTable %%%')
				console.log('users:', this.users)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>