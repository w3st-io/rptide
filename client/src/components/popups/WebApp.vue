<template>
	<div class="overlay h-100 w-100 position-fixed">
		<div class="overlay-content w-100 position-relative text-center">
			<BCard
				bg-variant="dark"
				text-variant="light"
				class="mx-auto"
				style="max-width: 600px;"
			>
				<CreateAndDropDown />
			</BCard>
		</div>
	</div>
</template>

<script>
	import CreateAndDropDown from '../../components/webApps/CreateAndDropDown'

	export default {
		components: {
			CreateAndDropDown,
		},
	}
</script>