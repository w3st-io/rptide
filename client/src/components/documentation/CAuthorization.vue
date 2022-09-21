<template>
	<!-- Authorization -->
	<BCard
		bg-variant="dark"
		text-variant="light"
		border-variant="secondary"
		id="product"
		class="mb-5 shadow"
	>
		<!-- [HEADER] -->
		<BRow>
			<BCol cols="12">
				<h1>
					<span class="px-2 bg-primary text-dark rounded">
						Authorization
					</span>
				</h1>
				<p>
					You can retrieve your API key from your <RouterLink to="/user">account</RouterLink> page.
				</p>
			</BCol>
		</BRow>

		<!-- [REST-API] -->
		<BRow>
			<BCol cols="12">
				<h2 class="mb-3 pb-1 text-primary">
					REST API
				</h2>
			</BCol>

			<BCol cols="12">
				<p>Pass your API Private Key like below.</p>
				
				<VueJsonPretty
					:data="{
						authorization: 'Bearer < your-api-private-key-here >'
					}"
					class="mb-4 p-2 text-light bg-code"
				/>
			</BCol>
		</BRow>
	</BCard>
</template>

<script>
	// [IMPORT]
	import VueJsonPretty from 'vue-json-pretty';
	import 'vue-json-pretty/lib/styles.css';

	export default {
		components: {
			VueJsonPretty,
		},
	}
</script>