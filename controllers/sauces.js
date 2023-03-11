const Thing = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  console.log(req);
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  delete thingObject._userId;
  const thing = new Thing({
      ...thingObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  thing.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getOneSauce = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const thingObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete thingObject._userId;
  Thing.findOne({_id: req.params.id})
      .then((thing) => {
          if (thing.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteSauce = (req, res, next) => {
  Thing.findOne({ _id: req.params.id})
      .then(thing => {
          if (thing.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = thing.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Thing.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllSauce = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeOrDislike = (req, res, next) => {   
  const likes = req.body.like;

  if (req.body.userId != req.auth.userId) {
      res.status(403).json({ message: 'Non autorisé !'});
  } else {

  Thing.findOne({ _id: req.params.id })
      .then((objetSauces)=> {
          if (!objetSauces.usersLiked.includes(req.body.userId) && likes === 1 ) {
              console.log("like = 1")
              // je prend en param l'id de la sauce et je push l'userid dans userlike
              Thing.updateOne({ _id: req.params.id }, {
                  $inc: { likes : 1 },
                  $push: { usersLiked : req.body.userId }
          })
              .then(() => res.status(200).json({ message: "Like" }))
              .catch((error) => res.status(400).json({ error }))
          }

          if (!objetSauces.usersDisliked.includes(req.body.userId) && likes === -1 ){
              console.log("like = -1 / dislike = 1")
               Thing.updateOne({ _id: req.params.id }, {
                  $inc: { dislikes : 1 },
                  $push: { usersDisliked : req.body.userId }
              })
                  .then(() => res.status(200).json({ message: "Unlike" }))
                  .catch((error) => res.status(400).json({ error }))
          }

          if (objetSauces.usersLiked.includes(req.body.userId) && likes === 0){
              console.log("il y a zero like");
  
              Thing.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
                  .then(() => res.status(200).json({ message: "Nothing" }))
                  .catch((error) => res.status(400).json({ error }))
                            
          }
          if (objetSauces.usersDisliked.includes(req.body.userId) && likes === 0){
              console.log("il y a zero Dislike");

              Thing.updateOne({ _id: req.params.id }, {$inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
                  .then(() => res.status(200).json({ message: "Nothing" }))
                  .catch((error) => res.status(400).json({ error }))
          }
      })
      .catch((error) => res.status(500).json({ error }))
  }

};