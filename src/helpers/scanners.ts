import puppeteer, { Page, Browser } from 'puppeteer'
import moment from 'moment'
import ResponseMaxDate, { ResponseError } from '../interfaces/clientServer'
import Availability from './Availibility'
import { IOpenDB } from "../interfaces/clientServer"
import Open from "../models/Open"
import EndDate from '../models/EndDate'




/**
 * returns array of days
 * Array.from(document.querySelectorAll('[aria-label]')).map((day) => day.innerText)
 * returns array of classNames
 * Array.from(document.querySelectorAll('[aria-label]')).map((day) => day.className)
 * returns array of dates.
 * Array.from(document.querySelectorAll('[aria-label]')).map((day) => day.ariaLabel)
 * 
 const MIQPORTAL = process.env.MIQPORTAL as unknown as string
    console.log(`About to scan Url: ${MIQPORTAL}`)
    await page.goto(MIQPORTAL);

 * @returns 
 */

export interface DateAvailability {
    available: boolean,
    slotDate: string,
}

interface ElementWithAriaLabel extends Element {
    ariaLabel: string,
    innerText: string,

}


export interface DateAvailabilityResult {

    status: string,
    availability: DateAvailability[]
}

export async function getAvailability() {

    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage()
    const testURL1 = process.env.MIQPORTAL as unknown as string
    console.log(`About to scan Url: ${testURL1}`)
    await page.goto(testURL1);

    const classNames: string[] = await page.evaluate(() => {
        const items: string[] = Array.from(document.querySelectorAll('[aria-label]')).map((className: { className: string; }) => className.className)
        return items
    })

    const dates: string[] = await page.evaluate(() => {
        const items: NodeListOf<ElementWithAriaLabel> = document.querySelectorAll('[aria-label]')
        return Array.from(items).map((date) => date.ariaLabel)
    })

    const months: string[] = await page.evaluate(() => {
        const items: string[] = Array.from(document.querySelectorAll('span'))
            .map((text) => text.innerText).filter((e) => {
                return (e.startsWith('January') ||
                    e.startsWith('February') ||
                    e.startsWith('March') ||
                    e.startsWith('April') ||
                    e.startsWith('May') ||
                    e.startsWith('June') ||
                    e.startsWith('July') ||
                    e.startsWith('August') ||
                    e.startsWith('September') ||
                    e.startsWith('October') ||
                    e.startsWith('November') ||
                    e.startsWith('December'))
            })
        return items
    })

    console.log(months)

    let result: DateAvailabilityResult = { status: '200', availability: [] }

    let dateStr = ""

    for (let i in classNames) {
        let available = false;
        if (dates[i].startsWith('January') ||
            dates[i].startsWith('February') ||
            dates[i].startsWith('March') ||
            dates[i].startsWith('April') ||
            dates[i].startsWith('May') ||
            dates[i].startsWith('June') ||
            dates[i].startsWith('July') ||
            dates[i].startsWith('August') ||
            dates[i].startsWith('September') ||
            dates[i].startsWith('October') ||
            dates[i].startsWith('November') ||
            dates[i].startsWith('December')) {

            if (classNames[i] !== 'no') available = true

            dateStr = `${dates[i]}`
            result.availability.push(new Availability(available, dateStr, months).getAvailability())
        }

    };

    await browser.close();
    return result
}

export async function getMaxDate() {

    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage()
    const testURL1 = process.env.TESTURL1 as unknown as string
    console.log(`About to scan Url: ${testURL1}`)
    await page.goto(testURL1);

    const maxDate = await page.evaluate(() => {
        const items = document.querySelectorAll('span')
        const array = Array.from(items).map((month: { innerText: string; }) => month.innerText)
        const last = array[array.length - 1]
        return last
    })

    console.log(maxDate)


    await browser.close();
    console.log('****maxDate', maxDate)
    if (maxDate) {
        if (moment(maxDate, "YYYY-MM-DD", true).isValid()) {
            const result: ResponseMaxDate = { result: '200', endDate: maxDate }
            console.log('result', result)
            return result;
        } else {
            console.log('Invalid Date ', maxDate)
            const result: ResponseMaxDate = { result: '300' }
            return result

        }
    } else {
        console.log('Invalid Date ', maxDate)
        const result = { result: '300' }
        return result
    }

}

export const getDailySlotStatus = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage()
        const testURL1 = process.env.TESTURL1 as unknown as string
        await page.goto(testURL1)!;
    }
    catch { }

}

export async function getMaxMonth() {

    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage()
    const MIQ = process.env.MIQPORTAL as unknown as string
    await page.goto(MIQ)!;

    console.log(`Monitor Started on ${MIQ}`)

    const maxMonth = await page.evaluate(() => {
        const items = document.querySelectorAll('span')
        const array = Array.from(items).map((month: { innerText: string; }) => month.innerText)
        const last = array[array.length - 1]
        return last
    })

    await browser.close();

    console.log('MaxMonth', maxMonth)

    if (maxMonth) {
        console.log('We have a date ', maxMonth)
        const result = { result: 200, maxMonth: maxMonth }
        return result

    } else {
        console.log('Invalid Date ')
        const result = { result: '300' }
        return result
    }

}

let running = false;

export const slotMonitor = async () => {

    const miqPortal = process.env.MIQPORTAL as unknown as string
    const testPortal = process.env.TESTURL1 as unknown as string
    const environment = process.env.ENVIRONMENT as unknown as string

    let source = testPortal

    if (environment === 'PROD') {

        source = miqPortal
    }
        
    let classNameKey = ""

    //const source = process.env.TESTURL1 as unknown as string
    const intervalMin = 600;
    const intervalMax = 1800;
    running = true;

    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)

    await page.goto(source)!;

    console.log(`Monitor started on ${source}`)

    let counter = 0;
    let slotsFound = 0;

    while (running) {

        //const interval = setInterval(async (page: Page) => {


        await page.reload({ waitUntil: 'load', timeout: 0 }),
            await page.waitForSelector('.container', { visible: true, timeout: 0 })


        const classNames: string[] = await page.evaluate(() => {
            const items: string[] = Array.from(document.querySelectorAll('[aria-label]')).map((className: { className: string; }) => className.className)
            return items
        })

        const dates: string[] = await page.evaluate(() => {
            const items: NodeListOf<ElementWithAriaLabel> = document.querySelectorAll('[aria-label]')
            return Array.from(items).map((date) => date.ariaLabel)
        })


        const months: string[] = await page.evaluate(() => {
            const items: string[] = Array.from(document.querySelectorAll('span'))
                .map((text) => text.innerText).filter((e) => {
                    return (e.startsWith('January') ||
                        e.startsWith('February') ||
                        e.startsWith('March') ||
                        e.startsWith('April') ||
                        e.startsWith('May') ||
                        e.startsWith('June') ||
                        e.startsWith('July') ||
                        e.startsWith('August') ||
                        e.startsWith('September') ||
                        e.startsWith('October') ||
                        e.startsWith('November') ||
                        e.startsWith('December'))
                })
            return items
        })
        
        /**
         * We now need to find the className for a unavailable slot.
         * This is the identifyer that determines whether the slot is avaibale or not.
         * MIQ change the name regularly. sometimes at each refresh. 
         * 
         * Case 1: There are just some available ie greater than 95% are unavaiable
         * 
         * 
         * Case 2: A new month has just been released: The maximum date has changed
         * The maximum date has changed, there could be lots of cases available.
         * 
         * For classNames[i] to be a vaild className, innerText must be equal to 01 to 31
         * ie Array.from(document.querySelectorAll('[aria-label]')).map((day) => day.innerText)
         * 
         */
         const days: string[] = await page.evaluate(() => {
            const items: NodeListOf<ElementWithAriaLabel> = document.querySelectorAll('[aria-label]')
            return Array.from(items).map((days) => days.innerText)
        })
         
        let option1 = "omac"
        let option2 = "omac"
        let countOp1 = 0
        let countOp2 = 0
        let countTot = 0

        let passedTests = true;

        let maxDate = ""

        for (let i in classNames) {
            
            if (parseInt(days[i])) {
                countTot++
                if (classNames[i] === option1) {
                    countOp1++
                } else {
                    if (classNames[i] === option2) {
                        countOp2++
                    } else {
                        if (option1 === 'omac') {
                            option1 = classNames[i]
                            countOp1++
                        } else {
                            if(option2 === 'omac') {
                                option2 = classNames[i]
                                countOp2++
                            } else {
                                console.log(`Error - More than 2 class names??? ${option1} ${option2} ${classNames[i]}: i ${i}`)
                                passedTests=false
                            }
                        }
                    }
                }
                let avail = new Availability(true, dates[i], months)
                maxDate = avail.getSlotDate()
               
            }
        }
        console.log(`classNames: ${option1}: ${countOp1}...${option2}: ${countOp2} Total: ${countTot} maxDate ${maxDate}`)

        if (countOp1 > countOp2) {
            classNameKey = option1
        } else {
            classNameKey = option2
        }
        /**
         * 
        

        let endDateRecs = await EndDate.findOne()
        console.log(endDateRecs)
        if (endDateRecs[0].endDate !== maxDate) {
            

        }
         */

        // for testing
        //passedTests = false
        
        if (passedTests) {
            // Looks like data is correct so process it

            let result: DateAvailabilityResult = { status: '200', availability: [] }

            let dateStr = ""

            for (let i in classNames) {
                let available = false;
                if (dates[i].startsWith('January') ||
                    dates[i].startsWith('February') ||
                    dates[i].startsWith('March') ||
                    dates[i].startsWith('April') ||
                    dates[i].startsWith('May') ||
                    dates[i].startsWith('June') ||
                    dates[i].startsWith('July') ||
                    dates[i].startsWith('August') ||
                    dates[i].startsWith('September') ||
                    dates[i].startsWith('October') ||
                    dates[i].startsWith('November') ||
                    dates[i].startsWith('December')) {

                    if (classNames[i] !== classNameKey) available = true

                    dateStr = `${dates[i]}`
                    // gets the availability for the single item
                    const newSlot = new Availability(available, dateStr, months).getAvailability()
                    if (newSlot.available) {
                        // we have found a slot

                        try {
                            let slot: IOpenDB = await Open.findOne({ slotDate: newSlot.slotDate })

                            if (slot) {
                                if (!slot.available) {
                                    // its a slot that has become avaliable again
                                    let reopenedSlot = await Open.updateOne({ slotDate: newSlot.slotDate }, { available: true, updated: Date.now() })
                                    await Open.updateOne({ slotDate: newSlot.slotDate },
                                        { $push: { event: { desc: ' slotOpen', date: Date.now() } } })
                                    slotsFound = slotsFound + 1
                                    console.log(`New Slot re-opened ${reopenedSlot.slotDate}`)
                                } else { console.log(`Slot is still Available ${newSlot.slotDate}`) }

                            } else {
                                slot = await Open.create(newSlot)
                                await Open.updateOne({ slotDate: newSlot.slotDate }, { available: true, updated: Date.now(), created: Date.now() })
                                await Open.updateOne({ slotDate: newSlot.slotDate },
                                    { $push: { event: { desc: ' slotOpen', date: Date.now() } } })

                                slotsFound = slotsFound + 1
                                console.log(`New Slot Found ${newSlot.slotDate}`)
                            }

                        } catch (err) {
                            console.log('Slot - error thrown ', err)

                        }
                    } else {
                        try {
                            let slotToClose: IOpenDB = await Open.findOneAndUpdate(
                                { available: true, slotDate: newSlot.slotDate },
                                { available: false, unavailable: Date.now(), updated: Date.now() },

                            )

                            if (slotToClose) {
                                await Open.updateOne({ slotDate: newSlot.slotDate },
                                    { $push: { event: { desc: ' slotClosed', date: Date.now() } } })
                                let uDate = new Date(Date.now()).toLocaleString()
                                console.log(`Slot Unavailable: ${slotToClose.slotDate}` +
                                    `created ${slotToClose.created}, unavailable: ${uDate}`)
                            }
                        } catch (err) {
                            console.log('Slot - error thrown ', err)
                        }
                    }
                }
            }
            counter = counter + 1

            /**
             * 1000, 3000 => interval low 1.66 high 5min
             * 3000,5000 => Interval low 5min high 8.33min
             * 4000,8000 => Interval low 6.67min high 13.33min
             * 8000,10000 => Interval low 13.3min high 16.67min  
             */

            let interval = getRandom(intervalMin, intervalMax) * 100
            // 43200000 is number of milliseconds in 12 hours: need to subtract 12 hours as new Date(interval) gives GMT
            let timeStr = new Date(interval - 43200000).toTimeString().substring(0, 8)
            console.log(`${counter} Interval: ${timeStr} found ${slotsFound}`)

            await new Promise(resolve => setTimeout(resolve, interval));
        } else { // stop monitor
            running = false
        }

    }
    console.log(`Monitor has Stopped - iterations ${counter} Slots Found ${slotsFound}`)
}

export const stopMonitor = () => running = false


export const isMonitorRunning = () => { return running }

/**
 * calulates random number so calls to Miq are Random
 * @param min  
 * @param max 
 * @returns 
 */
export const getRandom = (min: number, max: number) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const playTune = async () => {
    /*
        try {
    
            const play = require('audio-play')
            const load = require('audio-loader')
            const path = require('path')
            let tuneurl = path.join(__dirname, '..', '..', 'sacrifice.mp3')
            console.log(tuneurl)
            const audioBuffer: AudioBuffer = await load(tuneurl)
            await play(audioBuffer)
            console.log('should have played')
    
        } catch (error) { console.log('Audio File Load Error', error) }
    */
    const player = require('play-sound')();
    const path = require('path')
    let tuneurl = path.join(__dirname, '..', '..', 'sacrifice.mp3')
    console.log(tuneurl)
    player.play(tuneurl, () => {
        console.log(`Could not play sound???`);
    });
}




