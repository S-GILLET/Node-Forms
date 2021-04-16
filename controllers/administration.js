 //import modules pour faire fonctionner les code ci-dessous :

 const alert = require('alert');
 const nodemailer = require("nodemailer");
 const mongoose = require('mongoose'); //Appel module mongoose
 const NodeForm = mongoose.model('Node-form'); // Nom de la base de données à renseigner
 const { check, validationResult, matchedData } = require('express-validator');

 //-----Nommage de la fonction pour pouvoir l'exporter ailleurs :
 exports.fctAdministration = (req, res) => {
     //-----EO Nommage fct


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
     };
 }