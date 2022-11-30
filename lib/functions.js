// Importar y requerir mysql2
const mysql = require('mysql2'); 

function Functions(){

    this.getEmployees = function (password) {
        const connection = mysql.createConnection(
            {
                host: 'localhost',
                // Nombre de usuario de MySQL,
                user: 'root',
                // TODO: Agregar contraseña MySQL
                password: password,
                database: 'employees_db'
              },
              console.log(`Connected to the employees_db database.`)

        );
        const result = connection.query("SELECT * FROM employees");

        console.log(result);

    }


}

module.exports = Functions;