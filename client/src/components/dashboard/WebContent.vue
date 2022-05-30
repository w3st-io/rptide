<template>
	<div class="px-5 py-5">
		<BRow>
			<BCol cols="12" md="8">
				
			</BCol>

			<BCol cols="12" md="4">
				<router-link :to="`/user/web-content/create/${webApp}`">
					<BButton
						class="w-100"
						variant="success"
					>Create</BButton>
				</router-link> 
			</BCol>

			<BCol>
				{{ webContents }}
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