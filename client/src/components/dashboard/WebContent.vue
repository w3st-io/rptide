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