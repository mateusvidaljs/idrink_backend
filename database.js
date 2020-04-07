const mysql = require('mysql');
const connection = module.exports = mysql.createConnection({
	multipleStatements: true,
	host     : 'macros',
	user     : 'master',
	password : 'mata444-',
	database : 'idrinkdb'
});

module.exports = connection;