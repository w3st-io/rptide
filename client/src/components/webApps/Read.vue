<template>
	<div>
		<BRow v-if="$store.state.dashboard.webApps.length !== 0">
			<BCol
				v-for="(w, i) in $store.state.dashboard.webApps"
				:key="i"
				cols="12" sm="6" md="4" lg="3"
			>
				<BCard
					bg-variant="dark"
					text-variant="light"
					border-variant="secondary"
					class="mb-3"
				>
					<h6 class="small">Organization Name</h6>
					<h5 class="text-primary">{{ w.title }}</h5>
					<h6 class="m-0 small text-secondary">{{ w._id }}</h6>
				</BCard>
			</BCol>
		</BRow>

		<div v-else class="mb-5">
			<h6 class="my-1 text-center text-secondary">No web apps</h6>
		</div>
	</div>
</template>