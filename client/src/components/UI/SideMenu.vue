<template>
	<nav
		class="bg-dark shadow opacity-90 nav-drawer-menu"
		:class="{ isOpen: $store.state.show.SideMenu }"
		style="z-index: 1040;"
	>
		<!-- Close Button -->
		<BButton
			variant="dark"
			class="w-100 m-0 p-4 bg-secondary text-primary"
			@click="closeMenu()"
		><XIcon size="36" /></BButton>

		<!-- Menu Page Link -->
		<RouterLink
			v-show="$store.state.show.SideMenu"
			v-for="(button, i) in buttons"
			:key="i"
			:to="button.path"
		>
			<!-- Menu Items -->
			<BButton
				variant="outline-seconadry"
				class="w-100 text-primary"
				@click="closeMenu()"
			>
				<p v-if="button.text" class="h1 my-1">{{ button.text }}</p>
				<span v-else v-html="button.sideMenuIcon"></span>
			</BButton>
		</RouterLink>
	</nav>
</template>
<script>
	// [IMPORT] //
	import { XIcon } from 'vue-feather-icons'

	// [IMPORT] Personal //
	import companyInfo from '@/defaults/companyInfo'
	import buttons from '@/defaults/pageLinks'
	import router from '@/router'

	export default {
		components: {
			XIcon,
		},

		data() {
			return {
				companyInfo: companyInfo,
				buttons: buttons,
				query: ''
			}
		},

		methods: {
			closeMenu() {
				this.$store.state.show.SideMenu = !this.$store.state.show.SideMenu
				this.$emit('closeMenu')
			},

			homeBtn() {
				this.$store.state.show.SideMenu = !this.$store.state.show.SideMenu
				router.push({ name: '/' })
			},
		}
	}
</script>

<style lang="scss" scoped>
	.nav-drawer-menu {
		position: fixed;
		top: 0;
		left: 0;

		height: 100%;
		width: 0;

		overflow-x: hidden;
		transition: 0.5s;
	}

	.nav-drawer-menu button {
		transition: 0.3s;
		font-size: 2em;

		&:hover { background: rgba(127.5, 127.5, 127.5, 0.2); }
	}
	
	.isOpen { width: 75%; }
</style>