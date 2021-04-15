//Appel des modules node supplémentaires :
require('colors');
require('dotenv').config(); //Module qui charge les variables d'environnement à partir d'un .envfichier dans process.env
require('./models/Node-form');

const colors = require('colors');
const app = require('./app');
const mongoose = require('mongoose'); // module qui permet de faire des requetes sur bdd mongo


mongoose.connect(process.env.DATABASE, { //connection à la base via la var env : DATABASE
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection
    .on('open', () => {
        console.log('-: Mongoose connection open :-');
    })
    .on('error', (err) => {
        console.log(`-: Connection error: ${err.message} :-`);
    });

//Création du serveur : 
const server = app.listen(3001, () => {

    //console.log(`.: Express is running on port ${server.address().port} :.`.bgGray.white); //ici on utlise l'interpolation.
    //console.log(('.: Express is running on port ' + server.address().port + ' :.').bgGray.white); //ici la concatenation.
    //Test nouvel affichage console :
    console.log(`
              ,---------------------------,            
              |  -----------------------  |            
              | | Express is running    | |
              | |     on port ${server.address().port}      | |
              | |                       | |            
              | |                       | |            
              |  -_____________________-  |
              |___________________________|
            ,----_____     []     _______/------,
          /         -______________-           /|
        /___________________________________ /  | ___
        |                                   |   |    )
        |  _ _ _                 [--SEB--]  |   |   (
        |  o o o                 [--DWWM-]  |  /    _)_
        |__________________________________ |/     /  /
        /-------------------------------------/|  ( )/
        /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ /
        /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ /
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       
`.bgWhite.green);
});