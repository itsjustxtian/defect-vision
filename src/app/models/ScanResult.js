// ScanResults.js
import mongoose from 'mongoose';

const ScanResultSchema = new mongoose.Schema({
	// Add the 'id' field, which is a string in your documents
	id: {
		type: String,
		required: true,
		unique: true,
	},
	count_objects: {
		type: Number,
		required: true,
	},
	output_image: {
		type: String,
		required: true,
	},
	image_name: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	predictions: {
		image: {
			width: {
				type: Number,
			},
			height: {
				type: Number,
			},
		},
		predictions: [
			{
				width: {
					type: Number,
				},
				height: {
					type: Number,
				},
				x: {
					type: Number,
				},
				y: {
					type: Number,
				},
				confidence: {
					type: Number,
				},
				class_id: {
					type: Number,
				},
				class: {
					type: String,
				},
				detection_id: {
					type: String,
				},
				parent_id: {
					type: String,
				},
			},
		],
	},
});

export default mongoose.models.ScanResult ||
	mongoose.model('ScanResult', ScanResultSchema, 'development');
