<script>
	// [IMPORT] //
	import { Line } from 'vue-chartjs'

	// [EXPORT] //
	export default {
		mixins: [Line],

		props: {
			labels: {
				type: Array,
				required: true,
			},

			data: {
				type: Array,
				required: true
			},
		},

		mounted() {
			// Render the Chart //
			this.renderChart(
				{
					labels: this.labels,
					datasets: [
						{
							data: this.data,
							backgroundColor: '#f45d223f',
							borderColor: '#f45d22',
						}
					]
				},
				{
					elements: { line: { tension: 0 } },
					legend: { display: false, },
					maintainAspectRatio: false,
					responsive: true,
					scales: {
						yAxes: [
							{
								ticks: {
									fontColor: 'white',
									fontSize: 12,
									stepSize: 1,
									beginAtZero: false
								}
							}
						],
						xAxes: [
							{
								ticks: {
									fontColor: 'white',
									fontSize: 10,
									stepSize: 1,
									beginAtZero: false
								}
							}
						]
					}
				},
			)
		},
	}
</script>