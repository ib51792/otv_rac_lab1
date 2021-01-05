const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var hateoasLinker = require('express-hateoas-links');
const path = require('path')
var s = require('./routes/serije')

app.use(hateoasLinker);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/serije', s)

/**
 * Dohvati openapi.json datoteku
 */
app.get('/openapi.json', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'openapi.json'));
});

/**
 * Uhvati 501
 */
app.use((req, response, next) => {
    response.status(501)
    response.json({
        status: 'Not Implemented',
        message: 'Method not implemented for requested resource',
        response: null
    });
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});