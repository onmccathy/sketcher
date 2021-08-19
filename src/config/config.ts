export const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || '832554697781-e5513424ch2okaifcudo0cn4klkpbbeg.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_SECRET || 'WbU6wDYZkDDg4WkT7Zdp5T8B';
export const UI_ROOT_URI = "http://localhost:3000";
export const JWT_SECRET = "shhhhh";
export const COOKIE_NAME = "auth_token";
export const GOOGLE_CALLBACK = 
  process.env.GOOGLE_CALLBACK || 'auth/google/callback'; 
export const GOOGLE_EMAIL_SCOPE = 
  process.env.GOOGLE_EMAIL_SCOPE || 'https://www.googleapis.com/auth/gmail/gmail.compose' 

// Server
let serverPort = process.env.ENVIRONMENT as unknown as number
export const SERVER_PORT =  serverPort || 5010 
export const SERVER_ROOT_URI = process.env.ERVER_ROOT_URI || "http://localhost:5010"; 