require('dotenv').config();

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use( express.json() );

const dataBase = [
    { userName: 'Me', text: 'Txt 1' },
    { userName: 'Not Me', text: 'Txt 2' },
    { userName: 'user', text: 'Txt 3' }
];
app.get('/data', authenticateToken, ( req, res ) => {
    const name = req.user.user;
    console.log( name );
    const results = dataBase.filter( data => data.userName === name );
    res.json( results );
})

function authenticateToken( req, res, next )
{
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN
    const token = authHeader && authHeader.split( ' ' )[1];
    if ( token === null )
        res.sendStatus( 401 );

    jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, ( err, user ) => {
        if ( err )
            return res.sendStatus( 403 );
        req.user = user;
        next();
    });
}

app.listen(4000);