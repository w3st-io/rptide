<template>
	<div class="w-100 btn-group btn-group-toggle">
		<!-- For Each Passed Item in Tabs Array -->
		<label
			v-for="(tab, index) in tabs" :key="index"
			:class="{ 'active': activeTab == tab }"
			class="btn btn-sm btn-outline-primary py-0"
		>
			<input @click="toggler(index)" type="radio" autocomplete="off">
			{{ tab }}
		</label>
	</div>
</template>

<script>
	/**
	 * this component takes in 2 properties,
	 * 1) the list of tabs
	 * 2) what the emit is going to be called
	*/
	// [EXPORT]
	export default {
		props: {
			tabs: {
				type: Array,
				required: true,
			},
			
			initialTab: {
				type: Number,
				default: 0,
			}
		},

		data() {
			return {
				activeTab: '',
			}
		},

		created: async function() {
			// Set Active Tab //
			this.activeTab = this.tabs[this.initialTab]

			// [EMIT]
			this.$emit('tabClicked', this.activeTab)
		},

		methods: {
			toggler(index) {
				this.activeTab = this.tabs[index]
				this.$emit('tabClicked', this.activeTab)
			}
		}
	}
</script>