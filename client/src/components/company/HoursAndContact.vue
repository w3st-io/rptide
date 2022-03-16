<template>
	<!-- Operations -->
	<BCard bg-variant="dark" text-variant="light">
		<h3 class="mb-3 text-center text-primary">Hours & Location</h3>
		<hr class="border-light">

		<!-- Hours Of Operation -->
		<p class="mt-3 h4 text-primary">Hours</p>
		<BListGroup>
			<BListGroupItem
				v-for="(hOO, index) in companyInfo.hoursOfOperation"
				:key="index"
				class="p-1 bg-dark font-weight-bold"
			>
				{{ hOO.days }}
				<br>
				{{ hOO.hours }}
			</BListGroupItem>
		</BListGroup>

		<!-- Location -->
		<p class="mt-3 h4 text-primary">Location</p>
		<a
			:href="companyInfo.googleMapsLink"
			class="mt-3 text-light"
		>{{ companyInfo.address }}</a>

		<!-- Phone # -->
		<p class="h4 mt-3 text-primary">Phone Number</p>
		<a
			:href="companyInfo.phoneNumberLink"
			class="text-light"
		>{{ companyInfo.phoneNumber }}</a>

		<!-- Fax # -->
		<p class="h4 mt-3 text-primary">Fax Number:</p>
		<a
			:href="companyInfo.faxNumberLink"
			class="text-light"
		>{{ companyInfo.faxNumber }}</a>
	</BCard>
</template>

<script>
	import companyInfo from '@/defaults/companyInfo'

	export default {
		data() {
			return {
				companyInfo: companyInfo
			}
		},
	}
</script>