import querystring from 'querystring'
import axios from 'axios'
import {
  SERVER_ROOT_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CALLBACK,
  GOOGLE_EMAIL_SCOPE,
  
} from '../config/config'

const redirectURI = GOOGLE_CALLBACK;

export const getGoogleAuthURL = () => {

    console.log('GOOGLE_CLIENT_ID', GOOGLE_CLIENT_ID)
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `${SERVER_ROOT_URI}/${redirectURI}`,
      client_id: GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        GOOGLE_EMAIL_SCOPE,
      ].join(" "),
    };
  
    return `${rootUrl}?${querystring.stringify(options)}`;

    
    }

    export const getTokens = ({
      code,
      clientId,
      clientSecret,
      redirectUri,
    }: {
      code: string;
      clientId: string;
      clientSecret: string;
      redirectUri: string;
    }): Promise<{
      access_token: string;
      expires_in: Number;
      refresh_token: string;
      scope: string;
      id_token: string;
    }> => {
      /*
       * Uses the code to get tokens
       * that can be used to fetch the user's profile
       */
      const url = "https://oauth2.googleapis.com/token";
      const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      };
    
      return axios
        .post(url, querystring.stringify(values), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => res.data)
        .catch((error) => {
          console.error(`Failed to fetch auth tokens`);
          throw new Error(error.message);
        })
      };