const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes");
const session = require('express-session');
const { Issuer, generators } = require('openid-client');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - allow frontend (React on 3000) to send credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',  // or 'none' if you use https and want cross-site cookies
    secure: false     // true if you use https
  }
}));

app.use("/uploads", express.static("uploads"));
app.use("/api", router);

const PORT = 3001 || process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Connect to DB");
    console.log("Server is running");
  });
});


let client;
// Initialize OpenID Client
async function initializeClient() {
    const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_JQiAhJMQA');
    client = new issuer.Client({
        client_id: '49pc4octfmiutv2br0cnjoda4h',
        client_secret: 'm9iq9u2ng22h10ncjolkptc1cbg7nu21f8bdou0jm96ubflk7oh',
        redirect_uris: ['http://localhost:3001/callback'],
        response_types: ['code']
    });
    console.log('OIDC Client initialized');
};

initializeClient().catch(console.error);



const checkAuth = (req, res, next) => {
    if (!req.session.userInfo) {
        req.isAuthenticated = false;
    } else {
        req.isAuthenticated = true;
        
    }
    next();
};

app.get('/api/user', checkAuth, (req, res) => {
    if (req.isAuthenticated) {
        console.log('CheckAuth - isAuthenticated:', req.isAuthenticated);
        console.log('User info:', req.session.userInfo);
        res.json({
            authenticated: true,
            user: req.session.userInfo
        });
    } else {
        res.json({
            authenticated: false
        });
    }
});





app.get('/login', (req, res) => {
    const nonce = generators.nonce();
    const state = generators.state();

    req.session.nonce = nonce;
    req.session.state = state;

    const authUrl = client.authorizationUrl({
        scope: 'email openid phone profile',
        state: state,
        nonce: nonce,
    });

    res.redirect(authUrl);
});


// OAuth callback
app.get('/callback', async (req, res) => {
  try {
    const params = client.callbackParams(req);
    const tokenSet = await client.callback('http://localhost:3001/callback', params, {
      nonce: req.session.nonce,
      state: req.session.state
    });
    console.log('Tokens received:', tokenSet);

    const userInfo = await client.userinfo(tokenSet.access_token);
    req.session.userInfo = userInfo;
    console.log('UserInfo received:', userInfo);
    res.redirect('http://localhost:3000/home');
  } catch (err) {
    console.error('Callback error:', err);
    res.redirect('http://localhost:3000');
  }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    const logoutUrl = `https://us-east-1jqiahjmqa.auth.us-east-1.amazoncognito.com/logout?client_id=49pc4octfmiutv2br0cnjoda4h&logout_uri=http://localhost:3000/`;
    res.redirect(logoutUrl);
});



