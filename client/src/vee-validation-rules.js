/**
 * %%%%%%%%%%%%%%%%%
 * %%% VEE RULES %%%
 * %%%%%%%%%%%%%%%%%
 * This contains rules for vee-validatation
 * which lets you make forms be verified for
 * validity before being summited. 
*/
// [IMPORT]
import { extend } from 'vee-validate'
import { email } from 'vee-validate/dist/rules'

// [VEE-VALIDATE] Rules
// Confirmed
extend('confirmed', {
	params: ['target'],
	validate(value, { target }) {
		return value === target
	},
	message: 'Password confirmation does not match'
})

// Email
extend('email', email)

// Required
extend('required', {
	validate (value) {
		return {
			required: true,
			valid: ['', null, undefined].indexOf(value) === -1
		}
	},
	computesRequired: true,
	message: 'This field is required'
})

// Password
extend('password', {
	params: ['min', 'max'],
	validate(value, { min, max }) {
		return value.length >= min && value.length <= max
	},
	message: `Password must be longer than 8 characters`
})