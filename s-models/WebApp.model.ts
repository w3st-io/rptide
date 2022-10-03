// [IMPORT]
import mongoose from "mongoose";


// [INTERFACE]
export interface IWebApp extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId,
	user: mongoose.Schema.Types.ObjectId,
	name: string,
	createdAt: Date,
};


// [SCHEMA]
export const WebAppSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	name: {
		type: String,
		required: true,
		maxlength: 200,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});


export default mongoose.model<IWebApp>('WebApp', WebAppSchema);
