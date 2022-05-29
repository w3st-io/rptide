<template>
	<BContainer class="py-5">
		<BCard bg-variant="dark" text-variant="light">
			<BRow>
				<BCol cols="12">
					{{ webContent }}
					<h6>Name</h6>
					<input v-model="webContent.name" type="text" class="mb-3">
				</BCol>

				<BCol cols="12">
					<BButton
						variant="success"
						class="w-100"
						@click="createWebContent()"
					>Create Web Content</BButton>
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
// [IMPORT] Personal //
import WebContentService from '../../../services/user/WebContentService'

export default {
	data() {
		return {
			webContent: {
				name: '',
				webApp: this.$route.params.webapp,

				cleanJSON: {
					blocks: [],
				},
			},
		}
	},
	methods: {
		async createWebContent() {
			await WebContentService.s_create(this.webContent)
		}
	},
}
</script>

<style lang="scss" scoped>
	@import 'src/assets/styles/style.scss';
	
	input {
		@extend .form-control;
		@extend .bg-dark;
		@extend .text-light;
		@extend .border-primary;
	}
</style>