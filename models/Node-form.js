const mongoose = require('mongoose'); //4- Appel module mongoose
const nodeFormSchema = new mongoose.Schema({ //4- Définition du schéma JSON de la bdd mongo
    // Voir https://mongoosejs.com/docs/guide.html
    name: { //Clé
        type: String, //Type de la valeur
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model('Node-form', nodeFormSchema);