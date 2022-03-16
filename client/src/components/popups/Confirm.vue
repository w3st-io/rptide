<template>
	<div class="overlay h-100 w-100 position-fixed">
		<div class="overlay-content w-100 position-relative text-center">
			<BCard
				no-body
				bg-variant="dark"
				text-variant="white"
				class="m-auto text-center"
				style="max-width: 300px;"
			>
				<BCardHeader>
					<h1 class="mt-2 float-left h5">{{ header }}</h1>
					<BButton
						size="sm"
						variant="dark"
						class="float-right"
						@click="$emit('xClicked')"
					>✖</BButton>
				</BCardHeader>

				<BCardBody>
					<BRow>
						<BCol cols="6" class="px-2">
							<BButton
								size="lg"
								variant="outline-success"
								class="w-100"
								@click="$emit('yesClicked')"
							>Yes</BButton>
						</BCol>

						<BCol cols="6" class="px-2">
							<BButton
								size="lg"
								variant="outline-secondary"
								class="w-100"
								@click="$emit('noClicked')"
							>No</BButton>
						</BCol>
					</BRow>
				</BCardBody>
			</BCard>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			header: {
				type: String,
				default: 'Are you sure?'
			}
		}
	}
</script>

<style>
	.overlay {
		z-index: 2000;
		top: 0;
		left: 0;
		background-color: rgb(0, 0, 0);
		background-color: rgba(0, 0, 0, 0.6);
	}

	.overlay-content { top: 25%; }
</style>