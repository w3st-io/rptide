<template>
	<div class="px-5 py-5">
		<BRow>
			<BCol cols="12">
				{{ webApp }}
				<router-link :to="`/user/web-content/create/${webApp}`">
					<BButton
						variant="success"
					>Create</BButton>
				</router-link> 
			</BCol>
		</BRow>
	</div>
</template>

<script>
	export default {
		props: {
			webApp: {
				required: true,
				type: String,
			},
		},
	}
</script>