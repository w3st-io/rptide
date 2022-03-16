<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Report Type</th>
					<th>Reporter</th>
					<th>Date Created</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="report in commentReports" :key="report._id">
					<td>{{ report.reportType }}</td>
					<td>{{ report.user.username }}</td>
					<td>{{ new Date(report.createdAt).toLocaleString() }}</td>
					<td class="text-center">
						<BButton variant="danger" @click="handleReport(report._id)">
							Handle
						</BButton>
					</td>
				</tr>
			</tbody>
		</table>
		
		<!-- Error -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@/components/inform/Alert'
	import a_CommentReportService from '@/services/admin/CommentReportService'

	export default {
		components: {
			Alert, 
		},

		props: {
			commentReports: {
				type: Array,
				required: true,
			},
		},

		data() {
			return {
				error: '',
			}
		},

		async created() {
			// [LOG] //
			//this.log()
		},

		methods: {
			async handleReport(report_id) {
				// Handle Report //
				try { await a_CommentReportService.s_markHandled(report_id) }
				catch (err) { this.error = err }
				
				this.$emit('refreshData')
			},

			log() {
				console.log('%%% [COMPONENT] Admin ReportsTable %%%')
				console.log('commentReports:', this.commentReports)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>