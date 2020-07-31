module.exports = app => {
    const conferences = require("../controllers/conference.controller.js");

    //* Homepage
    app.get('/', (req, res) => {
        res.render('index')
    })
    
    //* Create a new conference
    app.post('/conference', conferences.create );

    //* Search a conference
    app.post('/conference/search', conferences.findOne );
    
    //* Retrive one conference
    app.get('/conference/:conferenceSlug', conferences.show );
    
    //* Delete a conference
    app.delete('/conference/:conferenceSlug', conferences.delete );

};