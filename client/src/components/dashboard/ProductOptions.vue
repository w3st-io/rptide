<template>
	<div class="px-5 py-5">
		<BRow>
			<BCol cols="12" md="9">
				<h3 class="text-primary">
					Product Options
				</h3>
			</BCol>

			<!-- Create Product Button -->
			<BCol cols="12" md="3" class="text-right">	
				<RouterLink to="/product-option/create">
						<BButton
							variant="success"
							class="w-100 w-sm-auto"
							style="max-width: 561px;"
							pill
						>+ Create</BButton>
					</RouterLink>
				</BCol>

			<BCol cols="12">
				<BCol cols="12">
					<h6 class="my-3 text-right text-light">
						{{ productOptions.length }} /
						{{
							this.$store.state.limit.productOptions[
								this.$store.state.apiSubscription.tier
							]
						}}
						<span>
							<RouterLink to="/user">
								<BButton size="sm" class="ml-3">Upgrade</BButton>
							</RouterLink>
						</span>
					</h6>
				</BCol>
			</BCol>

			<BCol
				v-for="(pa, i) in productOptions"
				:key="i"
				cols="12" lg="4"
			>
				<BCard
					bg-variant="dark"
					no-body
					class="mb-4 shadow product-card"
				>
					<BCardHeader>
						<h5 class="m-0 text-center font-weight-bold text-primary">
							{{ pa.name }}
						</h5>
					</BCardHeader>

					<BCardBody
						v-for="(pav, i) in pa.variants"
						:key="i"
						class="text-primary transparent"
					>
						{{ pav.name }}
						<BBadge variant="primary" pill class="float-right">
							{{ pav.price.string }}
						</BBadge>
					</BCardBody>
				</BCard>
			</BCol>
		</BRow>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				productOptions: [],
			}
		}
	}
</script>

<style lang="scss" scoped>
	.transparent {
		background-color: rgba(255, 255, 255, 0) !important;
	}

	.right-content {
		min-height: 500px !important;
	}
</style>