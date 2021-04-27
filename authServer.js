require('dotenv').config();

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use( express.json() );

app.post('/login', ( req, res ) => {
    // Authenticate user
    const userName = req.body.username;
    const user = { user: userName };

    // const secret = require('crypto').randomBytes(64).toString('hex');

    const accessToken = generateAccessToken( user );
    const refreshToken = jwt.sign( user, process.env.REFRESH_TOKEN_SECRET ); // we handle manually refresh tokens
    res.json( { accessToken: accessToken, refreshToken: refreshToken } );
})

function generateAccessToken( user )
{
    // 1h
    // 1m
    // 1s
    const accessToken = jwt.sign( user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' } );
    return accessToken;
}

app.listen(5000);