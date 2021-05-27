/**
 * Google Photos Api
 */

export interface IAlbum {
    id: string;
    productUrl: string;
    isWriteable: boolean;
    shareInfo: object;
    mediaItemsCount: number;
    coverPhotoBaseUrl: string;
    coverPhotoMediaItemId: string;
}

export interface IMediaItem {
    id: string;
    description: string;
    productUrl: string;
    baseUrl: string;
    mimeType: string;
    mediaMetadata: {
        creationTime: Date;
        width: number;
        height: number;
        type: "image" | "video";
    }
}

export interface MediaItemResult {
    mediaItems: IMediaItem[];
    nextPageToken: string;
}