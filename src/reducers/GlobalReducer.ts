import {GlobalState,GlobalAction} from '../interfaces/globalContext'


const  GlobalReducer =  (state:GlobalState, action:GlobalAction):GlobalState => {

    console.log("GlobalState", state);
    console.log("GlobalAction", action);
 
    switch (action.type) {

        case 'booleanflag': {
            return {...state, [action.fieldName]:action.payload}}
        case 'addMeetUps':  
            let newMeetUps = action.payload;
            let currentMeetUps  = {...state.meetUps}
            if (currentMeetUps.length > 0) {
                currentMeetUps.push(...newMeetUps)
            } else {
                currentMeetUps=newMeetUps
            }
            return {...state,  meetUps:currentMeetUps }

        case 'addAlbums':  
            let newAlbums = action.payload;
            let currentAlbums  = {...state.albums}
            if (currentAlbums.length > 0) {
                currentAlbums.push(...newAlbums)
            } else {
                currentAlbums=newAlbums
            }
            return {...state,  albums:currentAlbums }
           
        case 'addPhotos':
            let newPhotos = action.payload;
            let currentPhotos  = {...state.photos}
            if (currentPhotos.length > 0) {
                currentPhotos.push(...newPhotos)
            } else {
                currentPhotos=newPhotos
            }
            return {...state,  photos:currentPhotos }
            
              
        default:
            neverReached(action)
            return state
    }
    function neverReached(_never:never){}
}



export default GlobalReducer;


