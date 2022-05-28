<template>
	<div class="px-5 py-5">
		<BRow>
			<BCol cols="12">
				<button
					@click="createWebContent()"
				>Create Web Content</button>
			</BCol>
		</BRow>
	</div>
</template>

<script>
// [IMPORT] Personal //
import WebContentService from '../../services/user/WebContentService'

export default {
	methods: {
		async createWebContent() {
			await WebContentService.s_create()
		}
	},
}
</script>