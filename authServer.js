require('dotenv').config();

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use( express.json() );

const refreshTokensDatabase = [];

app.post('/token', ( req, res ) => {
    const refreshToken = req.body.token;
    if ( refreshToken === null )
        res.sendStatus( 401 );
    if ( !refreshTokensDatabase.includes( refreshToken ) )
        res.sendStatus( 403 ); // do not have access
    jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if ( err )
            return res.sendStatus( 403 ); // do not have access

        const accessToken = generateAccessToken( { user: user.user } );
        res.json( { accessToken: accessToken } );
    } );
})
app.post('/login', ( req, res ) => {
    // Authenticate user in DB
    const userName = req.body.username;
    const user = { user: userName };

    // const secret = require('crypto').randomBytes(64).toString('hex');

    const accessToken = generateAccessToken( user );

    const refreshToken = jwt.sign( user, process.env.REFRESH_TOKEN_SECRET ); // we handle manually refresh tokens
    refreshTokensDatabase.push( refreshToken );

    res.json( { accessToken: accessToken, refreshToken: refreshToken } );
})

function generateAccessToken( user )
{
    // 1h
    // 1m
    // 1s
    const accessToken = jwt.sign( user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' } );
    return accessToken;
}

app.listen(5000);