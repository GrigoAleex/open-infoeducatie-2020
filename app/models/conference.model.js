const sql = require("./db.js");
const { Module } = require("module");

//* constructor
const Conference = function( conference )
{
    this.name = conference.name;
    this.slug_participate = conference.slug_participate;
}

Conference.create = ( newConference, result ) => {
    sql.query("INSERT INTO conferences SET slug_participate = ?, name = ?", [
        newConference.slug_participate,
        newConference.name
    ], ( err, res ) => {
        if ( err ) 
        {
          console.log( "error: ", err );
          result( err, null );
          return;
        }
    
        console.log( "Created conference: ", { id: res.insertId, ...newConference } );
        result( null, { id: res.insertId, ...newConference } );
    });
}

Conference.findById = ( slug, result ) => {
    sql.query("SELECT * FROM conferences WHERE slug_participate = ? ", [
        slug
    ], ( err, res ) => {
        if ( err ) 
        {
            console.log("error: ", err);
            result(err, null);
            return;
        }
    
        if ( res.length ) 
        {
            console.log("Am gasit conferinta: ", res[0]);
            result(null, res[0]);
            return;
        }
    
        //* Nu a fost gasita nicio conferinta
        result({ kind: "not_found" }, null);
    });
};

Conferenceremove = (id, result) => {
  sql.query("DELETE FROM customers WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted customer with id: ", id);
    result(null, res);
  });
};

Conference.remove = ( id, result ) => {
    sql.query("DELETE FROM customers WHERE id = ?", id, ( err, res ) => {
      if ( err ) 
      {
        console.log( "error: ", err );
        result( null, err );
        return;
      }
  
      if ( res.affectedRows == 0 ) 
      {
        //* Nu a fost gasita nicio conferinta
        result( { kind: "not_found" }, null );
        return;
      }
  
      console.log( "A fost stearsa conferinta: ", id );
      result( null, res );
    });
};

module.exports = Conference;