import { minTime } from "date-fns";
import { Model, Mongoose } from "mongoose";
import { ISlot, SlotArray, ISlotDB } from "../interfaces/clientServer"
import Slot from "../models/Slot"

/**
 * Updates DB with slots
 * @param slots slots availability array
 */

export const refreshSlotDates = async (slots: SlotArray) => {
    slots.forEach(async slotInstance => {


        const newSlot: ISlot = {
            available: slotInstance.available,
            slotDate: slotInstance.slotDate,
        }
        if (newSlot.available) {
            // report slotAvaiable
            raiseAlarm(newSlot.slotDate)
        }
        try {
            let slot: ISlotDB = await Slot.findOne({ slotDate: slotInstance.slotDate })

            if (slot) {

                slot = await Slot.update({ available: slotInstance.available, updated: Date.now() })
                console.log('slot updated')
            } else {
                slot = await Slot.create(newSlot)
                console.log('slot created')
            }

        } catch (err) {
            console.log('Slot - error thrown ', err)

        }
    });
}

export const getSlotStatus = async () => {
    let slots = await Slot.find({}, { available: 1, slotDate: 1 }).sort({ slotDate: 1 })
    return slots
}

const raiseAlarm = (slotDate:string) => {
    console.log(`******** ${slotDate} available ***********`)
} 