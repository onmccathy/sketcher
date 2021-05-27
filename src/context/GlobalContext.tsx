import React, { useContext, createContext, FC, useReducer} from 'react';
import GlobalReducer from '../reducers/GlobalReducer';
import {IMeetUp} from '../interfaces/meetUp'
import {IMediaItem, IAlbum} from '../interfaces/googlePhotos'
import { GlobalState } from '../interfaces/globalContext';


interface IProps {
    children: React.ReactNode
}

export const initialState: GlobalState= {

    isAuthorised: false,
    isSignedIntoPhotos: false,
    
    albums: [],
    photos: [],
    meetUps: [],

    setIsAuthorised: () => {},
    setIsSignedIntoPhotos: () => {},
    addAlbums: () => {},
    addPhotos: () => {},
    addMeetUps: () => {},
   
}  

/**
 * 
 */
export const GlobalContext = createContext(initialState);

export const GlobalProvider: FC<IProps> = ({children})  => {
 
    const [state, dispatch] = useReducer (GlobalReducer,initialState) ;

    const setIsAuthorised = (value:boolean) => {
         
        dispatch({ type: 'booleanflag',fieldName:'isAuthorised',payload:value})
    }
     
    const setIsSignedIntoPhotos = (value:boolean) => {
         
      dispatch({ type: 'booleanflag',fieldName:'isSignedIntoPhotos',payload:value})
    }

    const addAlbums = (albumCollection:IAlbum[]) => {
         
      dispatch({type: 'addAlbums',payload:albumCollection});
    }
     
    const addPhotos = (photoCollection:IMediaItem[]) => {
       dispatch({type: 'addPhotos',payload:photoCollection});
    }
     
    const addMeetUps = (meetUpCollection: IMeetUp[]) => {
       dispatch({type: 'addMeetUps',payload:meetUpCollection});
       
    }

    return (
        <GlobalContext.Provider value={{
            ...state,
            setIsAuthorised,
            setIsSignedIntoPhotos,
            addAlbums,
            addPhotos,
            addMeetUps,
            
        }}> {children}
        </GlobalContext.Provider>
       
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};

//function useImmerReducer(_GlobalReducer: (state: GlobalState, action: import("../interfaces/globalContext").GlobalAction) => GlobalState, _initialState: GlobalState): [any, any] {
////    throw new Error('Function not implemented.');
//}

