import express from 'express'
import mongoose from 'mongoose'
import axios from 'axios'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { exit } from 'process';
import jwt from "jsonwebtoken";

import cookieParser from "cookie-parser";
import {
  SERVER_ROOT_URI,
  GOOGLE_CLIENT_ID,
  JWT_SECRET,
  GOOGLE_CLIENT_SECRET,
  COOKIE_NAME,
  UI_ROOT_URI,
  SERVER_PORT,
} from './config/config'
// helpers
import { getGoogleAuthURL, getTokens } from './helpers/auth'
// Routes
import GiveMeHope from './routes/giveMeHope'
import Test from './routes/test'

dotenv.config();

const app = express();

// logging
if (process.env.NODE_ENV! !== 'production') {
  app.use(morgan('dev'))
}
//cors
app.use(cors({
  origin: UI_ROOT_URI,
  credentials: true
}));
// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

/**
 * dbConnection and http port initialisation
 */

const dbConnnect = async (conn: string, port: number) => {

  try {
    let connected = false;
    await mongoose.connect(conn, { useNewUrlParser: true, useUnifiedTopology: true })
    app.listen(port, () => console.log(`listening on port ${port}`))
    return connected;
  } catch (error) {
    console.log(error)
    exit(1)
  }
}

const mongoProdDBUrl = process.env.MONGODB_PROD_URL!
const mongoTestDBUrl = process.env.MONGODB_TEST_URL!
const environment = process.env.ENVIRONMENT as unknown as string

let conn = mongoTestDBUrl

if (environment === 'PROD') {

  conn = mongoProdDBUrl
}

const port:number = SERVER_PORT!
dbConnnect(conn, port)

const redirectURI = "auth/google/callback";

// Getting login URL
app.get("/auth/google/url", (req, res) => {
  return res.send(getGoogleAuthURL());
});


// Getting the user from Google with the code
app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code as string;
  const client_id = GOOGLE_CLIENT_ID as string
  const client_Secret = GOOGLE_CLIENT_SECRET as string

  const { id_token, access_token } = await getTokens({
    code,
    clientId: client_id,
    clientSecret: client_Secret,
    redirectUri: `${SERVER_ROOT_URI}/${redirectURI}`,
  });

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res: { data: any; }) => res.data)
    .catch((error: { message: string | undefined; }) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });

  const token = jwt.sign(googleUser, JWT_SECRET);

  res.cookie(COOKIE_NAME, token, {
    // cookie to expire in one day
    maxAge: 90000000,
    httpOnly: true,
    secure: false,
  });

  res.redirect(UI_ROOT_URI);
});
// Getting the current user
app.get("/auth/me", (req, res) => {
  console.log("get me");
  try {
    const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
    console.log("decoded", decoded);
    return res.send(decoded);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
});

app.get('/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME)
  res.json({ status: '200', message: 'Logout Sucessful' });
})

app.use('/givemehope', GiveMeHope)
app.use('/test', Test)


