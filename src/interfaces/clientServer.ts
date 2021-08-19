import { Profile } from 'passport';
export default interface IMaxDate {
    endDate?: string,
    startDate?: string,
    prevEndDate?: string,
    slots?: Number,
    created?: Date,
    udated?: Date,
}

export default interface ResponseMaxDate {
    result: string,
    maxDateRet?: string,
    created?: Date,
    udated?: Date,
}

export  interface ResponseError {
    status?:string,
    message?: string,
    data?: string,
}

export type ResponseGetMaxDate = IMaxDate | ResponseError
    
export interface ISlot {
    available: boolean,
    slotDate: string,

}


export interface ISlotDB extends ISlot {
    _id: String
}

export interface IOpen {
    available: boolean,
    slotDate: string,
    unavailable: Date,
}

export interface IOpenDB extends IOpen {
    _id: String
    created: Date,
    updated: Date,
}

export type SlotArray = ISlot[]

export type Global {
        process: {
            env: {
                SERVERPORT: Number,
                DBNAME: String,
                DBPASSWORD:String,
                TESTURL1:String,
                SESSIONKEY:String,
                GOOGLE_CLIENTID: String,
                GOOGLE_SECRET: String,
                GOOGLE_AUTH_CALLBACK:String,
              }
        }  
    }
export interface IUser {
        googleId: String,
        displayName: String,
        firstName: String,
        lastName: String,
        image: String,
        email: String
}

export interface IUserDB extends IUser{
    _id: String
    
}

export interface IUserWithRefreshToken extends IUser {
    refreshToken: {
        value: string,
        refreshed: String,
        expires: String,
    }


}

export interface ProfileWithJson extends Profile {
    _json: {
        sub: String,
        name: String,
        given_name: String,
        family_name: String,
        picture: String,
        email: String,
        email_verified: Boolean,
    }

}