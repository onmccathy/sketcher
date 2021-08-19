import {Request, Response, NextFunction} from 'express'
/**
 * Checks that the user is authenticated and to control what routes they can access
 * 
 * !The req will have a isAthenticated function 
 */
module.exports  = {
    ensureAuth: function (req:Request, res:Response, next:NextFunction) {
        if (req.isAuthenticated()) {
            return next()
        } else {
             
            console.log('User is not authenticated')
            res.set({status:200})
            res.send("User is not authenticated")
            res.redirect('/')
        }
    },

    ensureGuest: function (req: Request, res: Response, next:NextFunction) {
        if (!req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/log')
        }
    }
}

