//------- Appel des modules complémentaires ------------

const express = require('express');
const router = express.Router();
const alert = require('alert');
const nodemailer = require("nodemailer");
const PopupClass = require('js-popup');


const { check, validationResult, matchedData } = require('express-validator');

const mongoose = require('mongoose'); //Appel module mongoose
const NodeForm = mongoose.model('Node-form'); // Nom de la base de données à renseigner

// ------------- Prépa Gestion du login ----------------------
const path = require('path');
const auth = require('http-auth');
const basic = auth.basic({ // appel du chemin vers le fichier de gestion des login/pswd
    file: path.join(__dirname, '../users.htpasswd'),
});
// ------------- EO Prépa Gestion du login -------------------

//------------ Affichage vue : "index" du site via 'form.pug' ----------------
router.get('/', (req, res) => {
    //res.send('.: Il continue de dire NON avec la tête ! :.');
    //res.render('form');
    res.status(200).render('form', {
        title: '-HomePage-',
        cancre: '.: Bienvenue sur le site :.'
    });
});

// ------------ VIEW = > sur route '/list' + log in---------------

router.get('/list', basic.check((req, res) => { // ajout objet basic.check : affiche un "pop up" pour se loguer
    NodeForm.find() // basic.check cherche la concordance des login du fichier user.htpasswd
        .then((nodeForms) => {
            res.render('index', {
                title: '-:List of records:-',
                nodeForms,
                cancre: 'Liste des données Name&Emails&Messages présents en bdd'
            }); // possible d'ajouter au render les clés avec leur valeurs, qu'on renvoie ensuite vers 'index.pug'
        })
        .catch(() => { res.send('-:Sorry! Something went wrong ( ͡ ͜ʖ ͡ ) :-'); });
}));
//--------------EO VIEW ---------------------------------------

//*------------ PAGE ADMINISTRATION sur route '/administration' + log in---------------
//**------------ Affichage vue 'administration.pug' ----------------
router.get('/administration', basic.check((req, res) => {
    res.status(200).render('administration', {
        title: 'Page administration',
        titleH2: 'Veuillez créer un nouveau contact :',
        cancre: 'Bienvenue sur la page d\'administration'
    });
}));

//**------------EO Affichage vue 'administration.pug' ----------------
//** ----------- Post des infos issues de '/Administration'-----------
router.post('/administration', [
    check('name') //verifie si le champ 'name' est égal à 1 char mini sinon affiche 1 message d'erreur
    .isLength({ min: 1 })
    .withMessage('-Please, enter the name-')
    .trim(),

    check('email') //verifie si le champ 'email' est égal a une adresse mail sinon affiche 1 message d'erreur
    .isEmail()
    .withMessage('-Please enter an email-')
    .bail()
    .trim()
    .normalizeEmail(),

    check('message') //verifie si le champ 'message' est égal à 1 char mini sinon affiche 1 message d'erreur
    .isLength({ min: 1 })
    .withMessage('-Please, enter a message-')
    .trim(),
], (req, res) => {
    // A)SAUVEGARDE + B)ENVOI DE MAIL
    // A)SAUVEGARDE EN BDD
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        console.log(req.body); //4- envoie en console les infos renseignées par l'admin
        const nodeForm = new NodeForm(req.body); //4- declar const qui enregistre les données renseignées par le user

        nodeForm.save() //4- save des infos de nodeForm dans la bdd
            // .then(() => { res.send('.:Thank you (￣▽￣)ノ to persist U data :.'); })
            .then(() => {
                res.render('administration', {
                    success: 'Données enregistrées en bdd et Mail envoyé'
                });
                //alert(".:Thank you (￣▽￣)ノ to persist U data :.\nRenvoi vers la page administration\n Mail envoyé ! ");
                /*Popup = new PopupClass();
                let messageText = ".:Thank you (￣▽￣)ノ to persist U data :.\nRenvoi vers la page administration\n Mail envoyé ! ";
                Popup.show(messageText);*/
                //res.redirect('./administration/:refresh');
                //codage d'une tempo avant de traiter la suite d'une code ! (non utilisé au final)
                /*setTimeout(() => {
                     res.redirect('./administration');
                     console.log('.:Thank you (￣▽￣)ノ to persist U data :.');
                 }, 5 * 1000); */
            })
            .catch((err) => {
                console.log(err);
                res.send('.: Sorry! Something went wrong :.');
            }); // EO SAUVEGARDE EN BDD
        // B)ENVOI DE MAIL
        // 1) Prépa du chemin d'envoi des mails    
        let transport = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PSWD // Provient de la variable dans le fichier .ENV
            },
        });
        //2) Prépa du contenu du mail
        let message = ({
            from: 'admin@test.fr', // sender address
            to: req.body.email,
            subject: "✔ Bonjour " + req.body.name + " votre compte est créé !", // Subject line
            text: "Bonjour " + req.body.name + "\nMessage de votre administrateur : " + req.body.message // plain text body
        });
        // 3) Envoi du mail
        transport.sendMail(message, function(err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        }); // EO SAUVEGARDE + ENVOI DE MAIL
    } else {
        res.render('administration', {
            title: '-:POST:-',
            errors: errors.array(),
            data: req.body,
        });
    }
});

module.exports = router; //permet de rendre toutes les fonctions de ce fichier en public !