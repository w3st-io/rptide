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

			opens: {
				type: Array,
				required: true,
			},

			highs: {
				type: Array,
				required: true,
			},

			lows: {
				type: Array,
				required: true,
			},

			closes: {
				type: Array,
				required: true,
			},
		},

		mounted() {
			this.renderChart(
				{
					labels: this.labels,
					datasets: [
						// Opens
						{
							data: this.opens,
							backgroundColor: '#ffffff00',
							//borderDash: [5],
							borderColor: 'grey',
							borderWidth: 1,
							pointRadius: 2,
							pointBackgroundColor: 'grey',
						},
						// Highs
						{
							data: this.highs,
							backgroundColor: '#ffffff00',
							//borderDash: [5],
							borderColor: 'green',
							borderWidth: 1,
							pointRadius: 2,
							pointBackgroundColor: 'green',
						},
						// Lows
						{
							data: this.lows,
							backgroundColor: '#ffffff00',
							//borderDash: [5],
							borderColor: 'red',
							borderWidth: 1,
							pointRadius: 2,
							pointBackgroundColor: 'red',
						},
						// Closes
						{
							data: this.closes,
							backgroundColor: '#ffffff00',
							//borderDash: [5],
							borderColor: 'white',
							borderWidth: 1,
							pointRadius: 3,
							pointBackgroundColor: 'white',

						},
					]
				},
				{
					animation: { duration: 0 },
					interaction: { mode: 'nearest' },
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
									fontSize: 12,
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