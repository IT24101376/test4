const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
name: { type: String, required: true },
description: { type: String, required: true },
Price:{type:Number,required:true}
// TODO: Add price field here
}, { timestamps: true });
module.exports = mongoose.model('Item', ItemSchema);