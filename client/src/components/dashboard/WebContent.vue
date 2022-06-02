<template>
	<div class="px-5 py-5">
		<BRow>
			<BCol cols="12" md="9">
				<h3 class="text-primary">Web Content</h3>
			</BCol>

			<BCol cols="12" md="3">
				<router-link :to="`/user/web-content/create/${webApp}`">
					<BButton
						class="w-100 mb-3"
						variant="success"
						pill
					>+ Create</BButton>
				</router-link> 
			</BCol>

			<BCol
				v-for="(w,i) in webContents" :key="i"
				cols="12" md="6" lg="4"
			>
				<RouterLink :to="`/user/web-content/update/${w._id}`" class="text-decoration-none">
					<BCard
						bg-variant="dark"
						text-variant="light"
						border-variant="secondary"
						class="mb-3 hover-card"
					>
						<h5 class="text-primary">{{ w.name }}</h5>
						<h6 lass="m-0">{{ w.createdTimeStamp }}</h6>
						<h6 class="m-0 small text-muted">{{ w._id }}</h6>
					</BCard>
				</RouterLink>
			</BCol>
		</BRow>
	</div>
</template>

<script>
	import WebContentService from '../../services/user/WebContentService'

	export default {
		props: {
			webApp: {
				required: true,
				type: String,
			},
		},

		data() {
			return {
				resData: {},
				webContents: []
			}
		},

		async created() {
			this.resData = await WebContentService.s_find({ webApp: this.webApp })

			if (this.resData.status) {
				this.webContents = this.resData.webContents
			}
		},
	}
</script>

<style lang="scss" scoped>
	.hover-card:hover {
		background-color: rgba(255, 255, 255, 0.15) !important;
	}
</style>