const Sauce = require('../models/sauce');

// module 'file system' pour gérer les téléchargements et modifications d'images
const fs = require('fs');


// créer une sauce

exports.createSauce = (req, res, next) => {
const sauceObject = JSON.parse(req.body.sauce);
delete sauceObject._id;
const sauce = new Sauce({
   ...sauceObject,
 imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
});
sauce.save()
  .then( () => {
    res.status(201).json({message: 'sauce créée.'}); 
  })
  .catch((error) => {
    res.status(400).json({error})});
  };

  // modifier une sauce 

  exports.modifySauce = (req, res, _) => {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'sauce modifiée.' }))
      .catch(error => res.status(400).json({error}));
      };

      // Supprimer une sauce

      exports.deleteSauce = (req, res, _) => {
        Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
            if (sauce.userId !== req.user) {
              res.status(401).json({message: "action non autorisée"});  
              return sauce;
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'sauce supprimée.'}))
                .catch(error => res.status(400).json({ error }));  
            })
          });  
    };

    //accéder à une sauce

exports.getOneSauce = (req, res, _) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => { res.status(200).json(sauce);})
    .catch((error) => {res.status(404).json({error});
  });
};

//accéder à toutes les sauces

exports.getAllSauce = (req, res, _) => {
  Sauce.find()
  .then((sauces) => {res.status(200).json(sauces);})
  .catch((error) => {res.status(400).json({error});
  });
};

// Liker ou disliker une sauce

exports.likeSauce = (req, res, next) => {
  console.log({ _id: req.params.id });
  console.log({ likes: req.body.like });
  console.log({ usersLiked: req.body.userId });

  const sauceObject = req.body;
  console.log(sauceObject);


  const userId = req.body.userId;
  const sauceId = req.params.id;
  const likeStatusRequested = req.body.like;



  Sauce.findOne({ _id: req.params.id }) 
      .then((sauce) => {
        console.log(sauce);
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 },
            }
          )
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: sauceid },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .then(()=>{
        if (sauceObject.like === 1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: +1 },
              $push: { usersLiked: req.body.userId },
            }
          )
            .then(() => res.status(200).json({ message: "Like !" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (sauceObject.like === -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: +1 },
              $push: { usersDisliked: req.body.userId },
            }
          )
            .then(() => res.status(200).json({ message: "Dislike !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        else
        {
          res.status(200).json({ message: " vous êtes neutre" });
        }
      })
      .catch((error) => res.status(400).json({ error }));
  
};
