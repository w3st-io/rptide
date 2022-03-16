<template>
	<ul class="pagination w-100 text-primary m-0">
		<li class="page-item text-center" style="width: 15%;">
			<a class="p-1 page-link bg-dark border-primary" @click="start()">«</a>
		</li>

		<!-- Left -->
		<li class="page-item text-center" style="width: 25%;">
			<a class="p-1 page-link bg-dark border-primary" @click="prev()">⟵</a>
		</li>

		<!-- Page Number -->
		<li class="page-item text-center" style="width: 20%;">
			<a class="p-1 page-link bg-dark border-primary">{{ badgeValue }}</a>
		</li>

		<!-- Right -->
		<li class="page-item text-center" style="width: 25%;">
			<a class="p-1 page-link bg-dark border-primary" @click="next()">⟶</a>
		</li>

		<li class="page-item text-center" style="width: 15%;">
			<a class="p-1 page-link bg-dark border-primary" @click="end()">»</a>
		</li>
	</ul>
</template>

<script>
	export default {
		props: {
			badgeValue: { type: Number, required: true, },
		},

		created: async function() {
			// [LOG] //
			//this.log()
		},

		methods: {
			start() { this.$emit('start-btn') },
			
			prev() { this.$emit('prev-btn') },

			next() { this.$emit('next-btn') },

			end() { this.$emit('end-btn') },

			log() {
				console.log('%%% [COMPONENT] PageNavButtons %%%')
				console.log('leftBtnEmitName:', this.leftBtnEmitName)
				console.log('rightBtnEmitName:', this.rightBtnEmitName)
				console.log('badgeValue:', this.badgeValue)
			},
		},
	}
</script>