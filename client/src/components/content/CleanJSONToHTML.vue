<template>
	<div>
		<div v-for="(block, index) in cleanJSON.blocks" :key="index">
			<!-- Code -->
			<code v-if="block.type == 'code'">
				{{ block.data.code }}
			</code>

			<!-- Delimiter -->
			<hr v-if="block.type == 'delimiter'" class="w-100 border-light">

			<!-- Embed -->
			<div v-if="block.type == 'embed' && block.data.service == 'youtube'">
				<youtube
					:video-id="getIdFromURL(block.data.embed)"
					player-width="100%"
					style="max-width: 700px;"
				/>
				<p>{{ block.data.caption }}</p>
			</div>

			<!-- Headers -->
			<h1 v-if="block.type == 'header' && block.data.level == 1">
				{{ block.data.text }}
			</h1>

			<h2 v-if="block.type == 'header' && block.data.level == 2">
				{{ block.data.text }}
			</h2>

			<h3 v-if="block.type == 'header' && block.data.level == 3">
				{{ block.data.text }}
			</h3>

			<h4 v-if="block.type == 'header' && block.data.level == 4">
				{{ block.data.text }}
			</h4>

			<h5 v-if="block.type == 'header' && block.data.level == 5">
				{{ block.data.text }}
			</h5>

			<h6 v-if="block.type == 'header' && block.data.level == 6">
				{{ block.data.text }}
			</h6>

			<!-- Image -->
			<viewer
				v-if="block.type == 'image'"
				:options="{ title: false, transition: false, }"
				class="text-center"
			>
				<img :src="block.data.url" alt="">
				<p>{{ block.data.caption }}</p>
			</viewer>

			<!-- List Unordered -->
			<ul v-if="block.type == 'list' && block.data.style == 'unordered'" class="my-2">
				<li v-for="(li, index) in block.data.items" :key="index">
					{{ li }}
				</li>
			</ul>

			<!-- List Ordered -->
			<ol v-if="block.type == 'list' && block.data.style == 'ordered'" class="my-2">
				<li v-for="(li, index) in block.data.items" :key="index">
					{{ li }}
				</li>
			</ol>

			<!-- Paragraph -->
			<p v-if="block.type == 'paragraph'" class="mb-2">{{ block.data.text }}</p>

			<!-- Quote -->
			<figure v-if="block.type == 'quote'">
				<blockquote>
					<i>{{ block.data.text }}</i>
				</blockquote>
				<figcaption>{{ block.data.caption }}</figcaption>
			</figure>

			<!-- Table -->
			<table v-if="block.type == 'table'" class="table table-striped table-dark">
				<tr v-for="(row, index) in block.data.content" :key="index">
					<td v-for="(col, index) in row" :key="index">{{ col }}</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
	import { getIdFromURL } from 'vue-youtube-embed'

	export default {
		props: {
			cleanJSON: {
				type: Object,
				required: true,
			}
		},

		methods: {
			getIdFromURL(url) { return getIdFromURL(url) }
		},
	}
</script>