const sql = require("./db.js");

const User = ( user ) => {
    this.id = user.id;
    this.name = user.name;
    this.room = user.name;
}

User.create = ( newUser, result ) => {
    sql.query("INSERT INTO users SET ?", newUser, ( err, res ) => {
        if( err ) 
        {
            console.log( "error: ", err );
            result( err, null );
            return;
        }

        console.log( "User created: ", { id: res.insertId, ...newUser} );
        result( null, { id: res.insertId, ...newUser } );
    });
}

User.findById = ( userId, result ) => {
    sql.query(`SELECT * FROM users WHERE id = ${ userId }`, ( err, res ) => {
        if ( err ) 
        {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
    
        if ( res.length ) 
        {
            console.log( "Found customer: ", res[0] );
            result( null, res[0] );
            return;
        }
    
        // not found user with the id
        result({ kind: "not_found" }, null);
      });
}

User.getAll = result => {
    sql.query("SELECT * FROM users", ( err, res ) => {
        if ( err ) 
        {
            console.log( "error: ", err );
            result( null, err );
            return;
        }
    
        console.log( "customers: ", res );
        result( null, res );
    });
};

User.remove = ( id, result ) => {
    sql.query("DELETE FROM customers WHERE id = ?", id, ( err, res ) => {
        if ( err )
        {
            console.log( "error: ", err );
            result( null, err );
            return;
        }
    
        if ( res.affectedRows == 0 ) {
            // not found a user with the id
            result({ kind: "not_found" }, null);
            return;
        }
    
        console.log("deleted user with id: ", id);
        result(null, res);
    });
};

module.exports = User;
  