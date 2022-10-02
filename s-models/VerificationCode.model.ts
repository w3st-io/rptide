// [IMPORT]
import mongoose from "mongoose";


export interface IVerificationCode extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId,
	user: mongoose.Schema.Types.ObjectId,
	verificationCode: string,
	createdAt: Date,
};

export const VerificationCodeSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	verificationCode: {
		type: String,
		required: [true, 'This is required'],
		maxlength: 50,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model<IVerificationCode>('VerificationCode', VerificationCodeSchema);
