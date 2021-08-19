import express from 'express'

const TestRouter = express.Router();

TestRouter.get('/testDate', async (req, res) => {

    let toJSON = new Date(Date.now()).toJSON()
    let testDate2 = new Date( Date.now()).toLocaleDateString()
    let testDate3 = new Date( Date.now()).toLocaleString()
    let testDate4 = new Date( Date.now()).toLocaleTimeString()
    let testDate5 = new Date( Date.now()).toString()
    let testDate6 = new Date(Date.now()).toTimeString()
    let testDate7 = new Date( Date.now()).toUTCString()
    let testDate8 = new Date(356789-43200000).toTimeString().substring(0,8)

    
    res.send({result:200, 
        toJSON: toJSON, 
        toLocaleDateString: testDate2,
        toLocaleString: testDate3,
        toLocaleTimeString: testDate4,
        toString: testDate5,
        toTimeString: testDate6,
        toUTCString: testDate7,
        interval: testDate8,
     })
})

export default TestRouter