import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const OpenSchema = new Schema({
    available: Boolean,
    slotDate: String,
    unavailable:{ type: Date, delault: new Date(2021,0,1) },
    event: [{desc: String, date: Date }],
    created: {type:Date, default: Date.now()},
    updated: {type:Date, default: Date.now()},
    version: {type:String, default: '2.0'}
})

const Open = mongoose.model('open', OpenSchema);

export default Open