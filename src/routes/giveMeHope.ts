import express from 'express'
import { ServerResponse } from 'http';
import {
    getAvailability,
    getMaxDate,
    getMaxMonth,
    slotMonitor,
    stopMonitor,
    playTune,
    isMonitorRunning
} from '../helpers/scanners'

import { refreshSlotDates, getSlotStatus } from '../helpers/slots';

import EndDate from '../models/EndDate'



const GiveMeHopeRouter = express.Router();


/**
 * Sets the maximum slot date 
 */

GiveMeHopeRouter.post('/setMaxdate', async (req, res) => {
    const { newMaxDate } = req.body;
    try {
        const maxDateCollection = await EndDate.findOne();
        if (!maxDateCollection) {
            console.log('About to create collection')
            await EndDate.create({ endDate: newMaxDate })
            res.send({ result: '201', message: `EndDate record created:`, newMaxDate })
        } else {
            console.log('About to update collection')
            await EndDate.updateOne({ id: maxDateCollection._id },
                {
                    $set: {
                        updated: Date.now(),
                        endDate: newMaxDate,
                    }
                });
            res.send({ result: '200', message: `EndDate record updated:`, newMaxDate })
        }

    }
    catch {
        () => {
            const message = ` Updating max date failed : ${newMaxDate}`
            console.log(message)
            res.send({ result: '404', message: message })
        }

    }
})

/**
 * Starts montitoring for vacant slots
 */

GiveMeHopeRouter.get('/startMonitor', async (req, res) => {

    if (!isMonitorRunning()) {
        
        slotMonitor()

        res.send({ result: 200, message: 'monitor started' })
    } else {
        res.send({ result: 400, message: 'monitor is already running' })
    }
})

/**
 * Stops montitoring for vacant slots
 */

GiveMeHopeRouter.get('/stopMonitor', (req, res) => {

    stopMonitor()

    res.send({ result: 200, message: 'monitor stopped' })
})

/**
 * Initialises Slot Db with the current slot end date.
 * db.myoriginal.aggregate([ { $match: {} }, { $out: "mycopy" } ])
 */
GiveMeHopeRouter.get('/getAvailability', async (req, res) => {
    const availability = await getAvailability();
    res.send(availability)
}
)
/**
 * Initialises Slot Db with the current slot end date.
 */
GiveMeHopeRouter.get('/getMaxDate', async (req, res) => {
    const maxDateResult = await getMaxDate();
    res.send(maxDateResult)
}
)

/**
 * Initialises Slot Db with the current slot end date.
 */
GiveMeHopeRouter.get('/getMaxMonth', async (req, res) => {
    const maxMonthResult = await getMaxMonth();

    res.send(maxMonthResult)
}
)

/**
 * Gets the Slot Db initial Status.
 * returns the slot status array.
 *  
 */

GiveMeHopeRouter.get('/getSlotStatus', async (req, res) => {
    const slotsStatus = await getSlotStatus();
    res.send(slotsStatus)
})

GiveMeHopeRouter.post('/email/maxdatechanged', (req, res) => {



    res.send('Current Slot Status requested')
})

GiveMeHopeRouter.get('/refreshSlotDates', async (req, res) => {

    const slotArray = await getAvailability();
    let result = {}
    if (slotArray.status === '200') {
        const refreshResult = await refreshSlotDates(slotArray.availability)
        result = { result: '200', message: 'Successful' }
    } else {
        result = { result: '400', message: 'Error Refreshing Slots' }

    }
    res.send(result)
})

/**
 * Starts montitoring for vacant slots
 */

GiveMeHopeRouter.get('/play', async (req, res) => {

    playTune()

    res.send({ result: 200, message: 'Play tune' })

})

export default GiveMeHopeRouter