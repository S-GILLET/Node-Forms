/*-----------------------------------------------------------
 Appel des modules */

const express = require('express');
const router = require('./routes/index');
const path = require('path');
const app = express();
//-----------------------------------------------------------
const bodyParser = require('body-parser');

/*
using 'body-parser' 'urlencoded' method allows us to 
handle data sent as application/x-www-form-urlencoded
There are various ways to format the data you POST to the server
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
/*-----------------------------------------------------------
 Ajout de l'appel aux vues + definition du moteur de views */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// ----------------------------------------------------------

/*-----------------------------------------------------------
 Ajout de l'appel aux vues + definition du moteur de views */
app.use('/', router);


//......
app.use(express.static('public')); //6- permet de faire le lien vers le CSS dans le dossier 'public'

module.exports = app;