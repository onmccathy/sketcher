import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const SlotSchema = new Schema({
    available: Boolean,
    slotDate: String,
    created: {type:Date, default: Date.now()},
    updated: {type:Date, default: Date.now()},
})

const Slot = mongoose.model('slot', SlotSchema);

export default Slot