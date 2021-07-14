// Vérification modele du mot de passe
const passSchema = require("../models/password");

// vérifie que le mot de passe valide le schema décrit

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
      return res.status(400).json({
        error:
          "mot de passe pas assez fort ! au moins une minuscule et majuscule 8 caracter min et 100 max 2 chiffre min pas d'espace" +
          passwordSchema.validate("retente ta chance", { list: true }),
      });
    } else {
      next();
    }
  };