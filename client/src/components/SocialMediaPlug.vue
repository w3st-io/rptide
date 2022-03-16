<template>
	<div class="text-center">
		<a :href="defaultData.facebookLink" :class="`text-${variant}`">
			<FacebookIcon :size="size" class="mr-3" />
		</a>

		<a :href="defaultData.instagramLink" :class="`text-${variant}`">
			<InstagramIcon :size="size" class="mr-3" />
		</a>

		<a :href="defaultData.youtubeLink" :class="`text-${variant}`">
			<YoutubeIcon :size="size" class="" />
		</a>
	</div>
</template>

<script>
	// [IMPORT] //
	import { FacebookIcon, InstagramIcon, YoutubeIcon } from 'vue-feather-icons'

	// [IMPORT] Personal //
	import defaultData from '@/defaults/companyInfo'

	export default {
		props: {
			size: {
				type: String,
				default: '24',
			},

			variant: {
				type: String,
				default: 'light'
			},
		},

		components: {
			FacebookIcon,
			InstagramIcon,
			YoutubeIcon
		},
		
		data() {
			return {
				defaultData: defaultData,
			}
		},
	}
</script>