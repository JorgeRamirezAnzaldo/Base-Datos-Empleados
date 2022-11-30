// Importar y requerir mysql2
const mysql = require('mysql2/promise'); 

function Functions(){

    this.getEmployees = async function (password) {
        const connection = await mysql.createConnection(
            {
                host: 'localhost',
                // Nombre de usuario de MySQL,
                user: 'root',
                // TODO: Agregar contraseña MySQL
                password: password,
                database: 'employees_db'
              },

        );
        let [employees] = await connection.query("SELECT * FROM employees");
        return employees;
        

    }


}

module.exports = Functions;