import {IMeetUp} from './meetUp'
import {IMediaItem, IAlbum} from './googlePhotos'
import { UnknownReturnType } from 'd3-scale'


export type GlobalState = {
    isAuthorised: boolean;
    isSignedIntoPhotos: boolean;
    albums: IAlbum[];
    photos: IMediaItem[];
    meetUps:  Array<IMeetUp> ;
    setIsAuthorised: (isAuthorised:boolean) => void;
    setIsSignedIntoPhotos: (isSignedIntoPhotos:boolean) =>void;
    addAlbums: (albums:Ialbum[]) => UnknownReturnType; 
    addPhotos: (photos:IMediaItem[]) => UnknownReturnType;
    addMeetUps: (meetUps: IMeetUp[]) => UnknownReturnType ;
}


type  GlobalBooleanFieldName = 'isAuthorised' | 'isSignedIntoPhotos' | 'isPlacesApiLoaded'
    
type  GlobalCollectionName = 'addAlbums' | 'addPhotos' | 'addMeetUps'  
export type IGlobalContext =  GlobalState;

export type GlobalAction =  
  | { type:  'booleanflag' ; fieldName: GlobalBooleanFieldName; payload: boolean;}
  | { type:  'addAlbums'; payload: IAlbum[];}
  | { type:  'addPhotos'; payload: IMediaItem[];}
  | { type:  'addMeetUps'; payload: IMeetUp[];}
  
  
