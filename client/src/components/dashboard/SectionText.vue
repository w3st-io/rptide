<template>
	<div class="px-5 py-5">
		<BRow>
			<BCol cols="12" sm="7">
				<h3 class="text-primary">Section Texts</h3>
			</BCol>

			<!-- Create Product Button -->
			<BCol cols="12" sm="5" class="text-right">	
				<RouterLink to="/section-text/create">
					<BButton
						variant="primary"
						class="w-100 w-sm-auto"
						style="max-width: 561px;"
					>+ Create a Section Text</BButton>
				</RouterLink>
			</BCol>

			<BCol cols="12">
				<h6 class="my-3 text-right text-light">
					{{ sectionTexts.length }} / {{ sectionTextsLimit }}
					<span>
						<RouterLink to="/user">
							<BButton size="sm" class="ml-3">Upgrade</BButton>
						</RouterLink>
					</span>
				</h6>
			</BCol>

			<BCol
				v-for="p in sectionTexts"
				:key="p._id"
				cols="12" md="6" lg="4" xl="3"
			>
				<RouterLink :to="`/section-text/read/${p._id}`" class="text-decoration-none">
					<BCard
						text-variant="light"
						bg-variant="dark"
						border-variant="none"
						no-body
						class="mb-4 shadow product-card"
					>
						<BCardHeader>
							<h3 class="m-0 text-primary">{{ p.title }}</h3>
						</BCardHeader>

						<BCardBody>
							<h6 class="small text-muted">Created</h6>
							<h5>{{ new Date(p.createdAt).toLocaleString() }}</h5>
						</BCardBody>
					</BCard>
				</RouterLink>
			</BCol>
		</BRow>
	</div>
</template>

<script>
	export default {
		props: {
			sectionTexts: {
				type: Array,
				required: true,
				default: () => {
					return []
				},
			},

			sectionTextsLimit: {
				type: Number,
				required: true,
				default: 0,
			},
		},
	}
</script>

<style lang="scss" scoped>
	.product-card:hover {
		background-color: rgba(127.5, 127.5, 127.5, 0.50) !important;
		transition: .5s;
	}

	.product-img {
		float: left;
		width:  100%;
		height: 200px;
		object-fit: cover;
	}
</style>