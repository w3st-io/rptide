<template>
	<div class="px-5 py-5">
		<BRow>
			<BCol cols="12" md="9">
				<h3 class="text-primary">Web Content</h3>
			</BCol>

			<BCol cols="12" md="3">
				<RouterLink to="/web-content/create">
					<BButton
						class="w-100 mb-3"
						variant="success"
						pill
					>+ Create</BButton>
				</RouterLink> 
			</BCol>

			<BCol
				v-for="(w,i) in webContents"
				:key="i"
				cols="12" md="6" lg="4"
				class="d-flex align-items-stretch mb-3"
			>
				<RouterLink
					:to="`/web-content/update/${w._id}`"
					class="w-100 text-decoration-none"
				>
					<BCard
						no-body
						bg-variant="dark"
						text-variant="light"
						border-variant="secondary"
						class="h-100 mb-3 hover-card shadow"
					>
						<BCardHeader class="border-secondary">
							<h5 class="text-primary">{{ w.name }}</h5>
							<h6 class="m-0 small text-muted">{{ w._id }}</h6>
						</BCardHeader>

						<BCardBody>
							<h6 class="m-0">
								{{ new Date(w.createdTimeStamp).toLocaleString() }}
							</h6>
						</BCardBody>
					</BCard>
				</RouterLink>
			</BCol>
		</BRow>
	</div>
</template>

<script>
	import axios from 'axios';

	export default {
		data() {
			return {
				authAxios: axios.create({
					baseURL: '/api/web-content',
					headers: {
						user_authorization: `Bearer ${localStorage.usertoken}`
					}
				}),
				
				resData: {},
				webContents: [],
				error: '',
			};
		},

		async created() {
			try {
				this.resData = await this.authAxios.post('/find', {
					webApp: this.$store.state.user.workspace.webApp
				});

				if (this.resData.status) {
					this.webContents = this.resData.data.webContents;
				}
			}
			catch (err) {
				this.error = err;
			}
		},
	}
</script>