import React, { FC, ReactNode } from 'react';
import { createContext, useEffect, useCallback, useState} from 'react'
import { MediaItemResult } from '../interfaces/googlePhotos';
import { useGlobalContext } from './GlobalContext';


/**
 * Add Google Photos Interface to select and dispaly photo to be
 * used for drawing.
 * 
 * https://github.com/onmccathy/PictureTool/issues/1
 */
/**
 * ! docs must be a string 
 */

const docs = 'https://photoslibrary.googleapis.com/$discovery/rest?version=v1';
const SCOPES = 'https://www.googleapis.com/auth/photoslibrary.readonly';
const CLIENT_ID = process.env.REACT_APP_GAPI_CLIENT_ID;
const apiKey = process.env.REACT_APP_APIKEY;

export interface IGoogleContext {
    getAlbums : Function;
    googleSignInOut : Function;
    getAlbumsButtonHandler : Function;
    handleAlbumSelected : Function;
}

declare global {
    interface Window {
        gapi:any;  
    }
}

interface IProps {
    children: ReactNode;
}

const initialContext:IGoogleContext = {
    getAlbums: () =>{},
    googleSignInOut: () => {},
    getAlbumsButtonHandler: () => {},
    handleAlbumSelected: MouseEvent, 
};
const GoogleContext = createContext<IGoogleContext>(initialContext);


export const GoogleProvider: FC<IProps>= ({children})  => {

    const {
        setIsAuthorised,
        setIsSignedIntoPhotos,
        addAlbums,
        addPhotos,
        
    } = useGlobalContext();

    const [albumNextPageToken, setAlbumNextPageToken] = useState("");
    const [photoNextPageToken, setPhotoNextPageToken] = useState("");

 //   const { state, dispatch } = useReducer(GoogleReducer, initialState);


    useEffect(() => {

        console.log("We are about to initialise");

        const intervalID = window.setInterval(() => {
            if (!window.gapi) {
                console.log("Window gapi is not initialised");
                return;
            }
            clearInterval(intervalID);
            if (!CLIENT_ID) {
                console.log("ClientID is missing")
                return;
            }

            window.gapi.load('client:auth2', () => {
                window.gapi.client.init({
                    apiKey: apiKey,
                    discoveryDocs: [docs],
                    clientId: CLIENT_ID,
                    scope: SCOPES,
                })
                    .then(function () {
                        // its failing here after
                        const auth = window.gapi.auth2.getAuthInstance();
                        auth.isSignedIn.listen(() => {
                            setIsAuthorised(user.hasGrantedScopes(SCOPES));
                        });
                        const user = auth.currentUser.get();
              
                        setIsAuthorised(user.hasGrantedScopes(SCOPES));
                        console.log("we have reached the end of the auth process")

                    }, (error:string) => console.log("Initialisation Error", error))

            });

        }, 300);
    }, [setIsAuthorised]);

    const googleSignInOut = useCallback(() => {

        if (!window.gapi) {
            console.log("Google Signin Out - gapi not defined");
            return
        }

        if (!window.gapi.auth2) {
            console.log("Google Signin Out - auth2 not defined", window.gapi);
            return
        }
        const GoogleAuth = window.gapi.auth2.getAuthInstance();
        if (GoogleAuth) {

            if (GoogleAuth.isSignedIn.get()) {
                GoogleAuth.signOut();
                GoogleAuth.disconnect();
                setIsSignedIntoPhotos(false);
                setIsAuthorised(false);
            }
            else {
                GoogleAuth.signIn();
                setIsSignedIntoPhotos(true);
            }
        } else {
            console.log("googleSignInOut:GoogleAuth missing ", window.gapi)
        }

    },[setIsAuthorised, setIsSignedIntoPhotos]);

    const getAlbumsButtonHandler = (event:React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        event.preventDefault();
        console.log("getAlbumsButtonHandler about to load albums")
        const promise = getAlbums(albumNextPageToken);
        promise.then((result:any) => {
            console.log("getAlbumsButtonHandler albums", result.albums)
            // TODO What happens if there is an error
            addAlbums(result.albums);
            setAlbumNextPageToken(result.nextPageToken);
    
        });
    }
    /**
    * The User has selected an album and the album Id is stored in the element
    * under the data-index attribute.
    * We are trusting that this will always be the case as the porg will fail.
    */ 
    const handleAlbumSelected = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        
        event.preventDefault();
        // !Note: I am certian that we will never return null so add ! to end
        const albumId =  event.currentTarget.getAttribute("data-index")!;
        const promise = getAlbumPhotos(albumId, photoNextPageToken);
        
        promise.then((result:MediaItemResult) => {
            setPhotoNextPageToken(result.nextPageToken);
            return new Promise(
                addPhotos(result.mediaItems)
                );
            
            
        }, (error:string) => { console.log("Show Albums Error", error) })
    }
    /**
     * getAlbums reads a list of albums 
     * todo Determine typescipt for fullresponse assume data will contain 
     * a list of albums and an optional nextPageToken. 
     */
    const getAlbums = (albumNextPageToken: string) => {

        return window.gapi.client.photoslibrary.albums
            .list({pageToken:albumNextPageToken})

            .then(function (fullResponse:any) {
                return fullResponse.result;
            }, (error:string) => { console.log("getAlbums..Error Response", error) });
    }

    const getAlbumPhotos = (albumId:string | null, nextPageToken:string) => {
        return window.gapi.client.photoslibrary.mediaItems
            .search({albumId: albumId, pageToken: nextPageToken})
            .then (function (response:any) {
                console.log("Good Respone",response);
                return response.result
            }, (error: any) => { console.log("getAlbumPhotos..Error Response", error) });       
    }

    const theContext:IGoogleContext = {
        getAlbums : getAlbums,
        googleSignInOut : googleSignInOut, 
        getAlbumsButtonHandler : getAlbumsButtonHandler, 
        handleAlbumSelected : handleAlbumSelected,
    }


    return (
        <GoogleContext.Provider value={theContext}>
            {children}
        </GoogleContext.Provider>
        
        );

}


export const useGoogleContext = () => {
    return React.useContext(GoogleContext);
};
