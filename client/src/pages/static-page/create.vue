<template>
	<div>
		<BListGroup>
			<BListGroupItem
				v-for="(pa, i) in product.optionalProductOptions"
				:key="i"
				variant="none"
				class="text-light py-2 border-secondary transparent"
			>
				<BRow>
					<BCol cols="9">
						<h6 class="mx-0 my-1">
							{{ pa.name }}
						</h6>
					</BCol>

					<BCol
						v-if="edit.optionalProductOptions"
						cols="3"
					>
						<BButton
							size="sm"
							variant="danger"
							class="w-100 py-0"
							@click="removeOptionalPA(pa)"
						>Delete</BButton>
					</BCol>
				</BRow>
			</BListGroupItem>

			<BListGroupItem
				v-if="edit.optionalProductOptions"
				variant="none"
				class="text-light py-2 border-secondary transparent"
			>
				<!-- [EDIT] -->
				<BRow>
					<!-- [SELECT] -->
					<BCol cols="12">
						<div class="my-1 input-group input-group-sm">
							<select
								v-model="selectedOptionalProductOption"
								class="
									form-control
									text-light
									border-success
									bg-dark
								"
							>
								<option disabled value="">
									Choose a Product Option to Add
								</option>
								<option
									v-for="pa in productOptions"
									:key="pa._id"
									:value="pa"
								>{{ pa.name }}</option>
							</select>

							<div class="input-group-append">
								<!-- [ADD] -->
								<BButton
								variant="outline-success"
								class="w-100"
								@click="addOptionalPA()"
							>+ Add PO</BButton>
							</div>
						</div>
					</BCol>
				</BRow>
			</BListGroupItem>
		</BListGroup>
	</div>
</template>