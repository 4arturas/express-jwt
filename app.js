require('dotenv').config();

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use( express.json() );

const posts = [
    { userName: 'Me', title: 'Post 1' },
    { userName: 'Not Me', title: 'Post 2' },
    { userName: 'user', title: 'Post 3' }
];
app.get('/posts', authenticateToken, ( req, res ) => {
    const name = req.user.user;
    console.log( name );
    const results = posts.filter( post => post.userName === name );
    res.json( results );
})
app.post('/login', ( req, res ) => {
    // Authenticate user
    const userName = req.body.username;
    const user = { user: userName };

    // const secret = require('crypto').randomBytes(64).toString('hex');

    const accessToken = jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);
    res.json( { accessToken: accessToken } );
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