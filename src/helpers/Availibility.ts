/**
 * holds availability for one day
 * 
 * months example
 * [
  'July 2021',
  'August 2021',
  'September 2021',
  'October 2021',
  'November 2021'
]
 */
import moment from 'moment'

class Availability {
    private available: boolean
    private slotDate: string
    /**
     * 
     * @param available 
     * @param date holds the month and day
     * @param months contains a list of months and year open to receive bookings. for an example see above
     */

    public constructor(available: boolean, date: string, months: string[]) {
        
        this.available = available
        
        
        let split: string[] = date.split(' ')
        let month: string = split[0].trim()
        let day = split[1].trim()
        if (day.length <2) day = `0${day}`
        // given month get year
        // todo What happens if there are more than 12 months of month values in array ie November 2021 and November 2022
        let year = months.filter((monthItem) => {
            if (monthItem.startsWith(month)) {
                return true
            }
        })[0].split(' ')[1]
        // convert month to digits
        let monthNum = new Date(Date.parse(`${day} ${month} ${year}`)).getMonth() +1
        let monthString = monthNum.toString()
        if(monthString.length < 2) monthString = `0${monthString}`
        this.slotDate = `${year}-${monthString}-${day}`
       
    }

    public getAvailability() {
        return {available: this.available, slotDate: this.slotDate}
    }

    public getSlotDate() {
        return this.slotDate
    }
}

export default Availability