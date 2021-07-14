const jwt = require("jsonwebtoken");
const User =    require('../models/user'); 
const bcrypt = require('bcrypt')  // pour hasher le mot de passe   

const passwordValidator = require('password-validator'); //Plugin mot de passe

const passwordSchema = new passwordValidator();

// Shema de données de l utilsateur 

passwordSchema  //Schema du mot de passe
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);


// Inscription utilsateurs

exports.signup = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    return res.status(400).json({
      message: 'Le mot de passe ne respecte pas les règles'
    });
  }
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({
            message: 'Utilisateur créé !'
          }))
          .catch(error => res.status(400).json({
            error
          })); 
      })
      .catch(error => res.status(500).json({
        error
      }));
  
  };
  
// Connexion utilsateurs

  exports.login = (req, res, next) => {
    User.findOne({
        email: req.body.email
      })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            error: 'Utilisateur non trouvé !'
          });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {

            if (!valid) {
              return res.status(401).json({
                error: 'Mot de passe incorrect !'
              });
            }
            res.status(200).json({ 
              userId: user._id,
              token: jwt.sign( 
                {
                  userId: user._id
                }, 
                'RANDOM_TOKEN_SECRET', 
                {
                  expiresIn: '24h'
                }
              )
            });
          })
          .catch(error => res.status(500).json({
            error
          }));
      })
      .catch(error => res.status(500).json({
        error
      }));
  };
