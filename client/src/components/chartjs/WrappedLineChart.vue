<template>
	<div>
		<h4 class="text-center text-primary">{{ title }}</h4>
		<LineChart
			:labels="labels"
			:data="data"
			class="w-100"
			:style="{ height: height + 'px' }"
		/>
	</div>
</template>

<script>
	// [IMPORT] //
	import LineChart from './LineChart'

	// [EXPORT] //
	export default {
		props: {
			title: {
				type: String,
				required: false,
				default: 'unset',
			},

			labels: {
				type: Array,
				required: true,
			},

			data: {
				type: Array,
				required: true,
			},
			
			height: {
				type: Number,
				required: false,
				default: 300
			}
		},

		components: {
			LineChart,
		},
	}
</script>