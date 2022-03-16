<template>
	<BContainer class="my-3">
		<BRow>
			<BCol cols="12">
				<BCard bg-variant="dark" text-variant="light">
					<!-- Title -->
					<h2>Your Admin Profile</h2>

					<table class="table table-border table-dark">
						<tr>
							<td>Admin Id</td>
							<td>{{ adminDecoded.admin_id }}</td>
						</tr>
						<tr>
							<td>Username</td>
							<td>{{ adminDecoded.username }}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{{ adminDecoded.email }}</td>
						</tr>
						<tr>
							<td>First Name</td>
							<td>{{ adminDecoded.first_name }}</td>
						</tr>
						<tr>
							<td>Last Name</td>
							<td>{{ adminDecoded.last_name }}</td>
						</tr>
					</table>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@/router'
	import AdminService from '@/services/admin/AdminService'

	// [EXPORT] //
	export default {
		data() {
			return {
				adminDecoded: {},
			}
		},

		created: async function() {
			// [REDIRECT] Log Required //
			if (!localStorage.admintoken) { router.push({ name: '/' }) }

			// Retrieve User Data //
			await this.getAdminData()

			// [LOG] //
			//this.log()
		},

		methods: {
			async getAdminData() {
				try { this.adminDecoded = await AdminService.s_getAdminTokenDecodeData() }
				catch (err) { this.error = err }
			},

			log() {
				console.log('%%% [PAGE] Admin Profile %%%')
				console.log('adminDecoded:', this.adminDecoded)
			},
		},
	}
</script>

<style scoped>
	td { color: white; }
</style>