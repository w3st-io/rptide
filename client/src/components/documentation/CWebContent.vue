<template>
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
					<span class="px-2 bg-primary text-dark rounded">WebContent</span>
				</h1>
				<p>
					Maintain your WebContent with RpTide.
				</p>
			</BCol>
		</BRow>

		<BRow>
			<!-- [OFFICIAL-SITE] -->
			<BCol cols="12" md="6">
				<h2 class="mb-3 pb-1 text-primary">
					On Official Site
				</h2>
				<p class="mb-3">Create a WebContent</p>
			</BCol>

			<!-- [REST-API] -->
			<BCol cols="12" md="6">
				<h2 class="mb-3 pb-1 text-primary">
					REST API
				</h2>
				<p class="mb-3">Retrieve All WebContent</p>
				<p>
					<code class="p-1 bg-code">
						POST /api/web-content/find
					</code>
				</p>
				<p>
					Required in POST request body:
					<VueJsonPretty
						:data="{
							webApp: '< webApp _id >'
						}"
						class="bg-code p-2 text-light"
					/>
				</p>
			</BCol>
		</BRow>


		<!-- [JSON-EXAMPLES] -->
		<BRow>
			<BCol cols="12">
				<h2 class="mb-3 pb-1 text-primary">
					Object Example
				</h2>
			</BCol>

			<!-- Table -->
			<BCol cols="12" md="6" class="bg-dark">
				<BTableSimple
					borderless
					striped
					class="border border-primary text-light bg-code"
				>
					<BThead class="border-bottom border-primary">
						<BTr>
							<BTh><u>Property</u></BTh>
							<BTh><u>Type</u></BTh>
							<BTh><u>Definition</u></BTh>
						</BTr>
					</BThead>
			
					<BTbody>
						<BTr>
							<BTd><code class="p-1 bg-code">webContents</code></BTd>
							<BTd>Array</BTd>
							<BTd>Array of WebContents stored on RpTide</BTd>
						</BTr>

						<BTr>
							<BTd>
								<code class="p-1 bg-code">WebContents[x].name</code>
							</BTd>
							<BTd>String</BTd>
							<BTd>
								Name of the WebContent
							</BTd>
						</BTr>

						<BTr>
							<BTd>
								<code class="p-1 bg-code">WebContents[x].cleanJSON</code>
							</BTd>
							<BTd>Object</BTd>
							<BTd>
								The contents of the WebContent to be rendered by the front-end. It contains an array of blocks which contain the text, images, etc.
							</BTd>
						</BTr>

						<BTr>
							<BTd><code class="p-1 bg-code">WebContents[x].tags</code></BTd>
							<BTd>Array</BTd>
							<BTd>
								Array of strings called tags. These tags allow categorization which then allows them to be queried
							</BTd>
						</BTr>
					</BTbody>
				</BTableSimple>
			</BCol>

			<!-- JSON Example -->
			<BCol cols="12" md="6">
				<div>
					<VueJsonPretty
						:data="webContentExample"
						class="p-2 text-light bg-code"
					/>
				</div>
			</BCol>
		</BRow>
	</BCard>
</template>

<script>
	// [IMPORT]
	import VueJsonPretty from 'vue-json-pretty';
	import 'vue-json-pretty/lib/styles.css';

	export default {
		data() {
			return {
				webContentExample: {
					"executed": true,
					"status": true,
					"location": "/api/web-content/find",
					"message": "Found WebContent",
					"webContents": [
						{
							"cleanJSON": {
								"time": 1662986800649,
								"blocks": [],
								"version": "2.25.0"
							},
							"_id": "629a4d56ac275e6cd744603a",
							"user": "62965bdd4ec038b42125c475",
							"webApp": "629a4d25ac275e6cd744601a",
							"name": "The Future of Environmental Cleanups",
							"connectedWalletRequired": false,
							"tags": [
								"pinned",
							],
							"likeCount": 0,
							"liked": false,
							"createdTimeStamp": "2022-06-03T18:05:10.876Z",
							"__v": 0,
							"visible": false
						},
					]
				}
			}
		},

		components: {
			VueJsonPretty,
		},
	}
</script>