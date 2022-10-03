// [IMPORT]
import mongoose from "mongoose";


// [INTERFACE]
export interface IPasswordRecovery extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId,
	user: mongoose.Schema.Types.ObjectId,
	verificationCode: string,
	createdAt: Date,
};


export const PasswordRecoverySchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	verificationCode: {
		type: String,
		required: true,
		maxlength: 50,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});


export default mongoose.model<IPasswordRecovery>(
	'PasswordRecovery',
	PasswordRecoverySchema
);