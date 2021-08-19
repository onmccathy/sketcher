import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const EndDateSchema = new Schema({

    endDate: String,
    prevEndDate: String,
    startDate:String,
    slots: Number,
    created: {type:Date, default: Date.now()},
    updated: {type:Date, default: Date.now()},
})

const EndDate = mongoose.model('enddate', EndDateSchema);

export default EndDate