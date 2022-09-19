<template>
	<BContainer class="py-5">
		<VerificationCodeEmailer />
		
		<BRow>
			<!-- Account Details -->
			<BCol cols="12">
				<h2 class="mb-5 text-primary">Your Account</h2>
			</BCol>

			<BCol cols="12">
				<MyCard class="mb-5" />
			</BCol>

			<BCol cols="12">
				<TierSelector class="mb-5" />
			</BCol>

			<BCol cols="12">
				<BCard bg-variant="dark" class="shadow">
					<APIKeys />
				</BCard>
			</BCol>

			<BCol cols="12">
				<!-- Update Password -->
				<UpdatePassword />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal
	import APIKeys                 from '../../components/apiSubscription/APIKeys.vue';
	import TierSelector            from '../../components/apiSubscription/TierSelector.vue';
	import MyCard                  from '../../components/stripe/MyCard.vue';
	import UpdatePassword          from '../../components/user/UpdatePassword.vue';
	import VerificationCodeEmailer from '../../components/user/VerificationCodeEmailer.vue';
	import router                  from '../../router';

	export default {
		components: {
			APIKeys,
			MyCard,
			TierSelector,
			UpdatePassword,
			VerificationCodeEmailer
		},

		methods: {
			redirectPasswordChange() { router.push({ name: 'password_change' }); }
		},

		async created() {
			// [REDIRECT] Not Log Required
			if (!localStorage.usertoken) { router.push({ name: 'user_login' }); }
		},
	}
</script>