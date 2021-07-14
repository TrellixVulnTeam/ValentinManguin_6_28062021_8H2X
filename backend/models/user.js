const mongoose = require('mongoose');  //Création d'un model user avec mongoose

const uniqueValidator = require('mongoose-unique-validator'); //Plugin de validation d'email



const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },    
    password: { type: String, required: true 
    }
  });

  userSchema.plugin(uniqueValidator); // Plugin pour garantir un email unique



  




module.exports = mongoose.model('User', userSchema);

