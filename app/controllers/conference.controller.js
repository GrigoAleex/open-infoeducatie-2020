const Conference = require("../models/conference.model.js");
const { v4: uuidV4 } = require('uuid')

//* Create and save a conference
exports.create = ( req, res ) => {
    //* Validate request
    if ( !req.body ) {
        res.status(400).send({
            message: "Te rugam sa completezi formularul!"
        });
    }
    
    //* Create a conference
    const conference = new Conference({
        name: req.body.name,
        slug_see: uuidV4(),
        slug_participate: uuidV4(),
    });

    //* Save the conference in the database
    Conference.create( conference, ( err, data ) => {
        if ( err )
            res.status(500).send({
                message:
                err.message || "Ceva nu a mers bine te rugam sa reincerci mai tarziu."
            });
        else res.redirect(`/conference/${ conference.slug_participate }`);
    });
}

//* Find a single Customer with a customerId
exports.findOne = ( req, res ) => {
    Conference.findById( req.body.slug, ( err, data ) => {
        if ( err ) 
        {
          if ( err.kind === "not_found" ) 
          {
            res.status(404).send({
              message: `Nu am putut gasi conferinta cu id-ul: ${req.params.customerId}.`
            });
          } else {
            res.status(500).send({
              message: "Nu am putut primi conferinta cu id-ul: " + req.params.customerId
            });
          }
        } else res.redirect(`/conference/${ req.body.slug }`);
    });
};

exports.show = ( req, res ) => {
    Conference.findById( req.params.conferenceSlug, ( err, data ) => {
        if ( err ) 
        {
          if ( err.kind === "not_found" ) 
          {
            res.status(404).send({
              message: `Nu am putut gasi conferinta cu id-ul: ${req.params.customerId}.`
            });
          } else {
            res.status(500).send({
              message: "Nu am putut primi conferinta cu id-ul: " + req.params.customerId
            });
          }
        } else {
            if(data.slug_participate == req.params.conferenceSlug)
                res.render('room', {
                    roomId: data.slug_participate,
                    canParticipate: true,
                    url: req.params.conferenceSlug,
                    title: data.name,
                    streamingUrl: data.slug_see
                })
            else
                res.render('room', {
                    roomId: data.slug_participate,
                    canParticipate: "Monkey coud not jump the rope :(",
                    url: req.params.conferenceSlug,
                    title: data.name,
                    streamingUrl: data.slug_see
                })
            return;
        }
    });
}

//* Delete a Customer with the specified customerId in the request
exports.delete = ( req, res ) => {
    Conference.remove( req.params.conferenceSlug, ( err, data ) => {
        if ( err ) 
        {
            if ( err.kind === "not_found" ) 
            {
                res.status(404).send({
                    message: `Nu am putut gasi conferinta cu id-ul: ${req.params.customerId}.`
                });
            } else {
                res.status(500).send({
                    message: "Nu am putut primi conferinta cu id-ul: " + req.params.customerId
                });
            }
        } else res.send({ message: `Conferinta a fost stearsa cu succes!` });
      });
};