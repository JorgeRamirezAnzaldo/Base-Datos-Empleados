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
        let [employees] = await connection.query(`SELECT emp.id, emp.first_name, emp.last_name, rol.title, dep.department_name AS name,
                                                  rol.salary, CONCAT(man.first_name, " ", man.last_name) AS manager
                                                  FROM employees AS emp
                                                  JOIN roles AS rol
                                                  ON emp.role_id = rol.id
                                                  JOIN departments AS dep
                                                  ON rol.department_id = dep.id
                                                  LEFT JOIN employees AS man
                                                  ON emp.manager_id = man.id
                                                  ORDER BY emp.id ASC`);
        return employees;
    };

    this.getRoles = async function (password) {
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
        let [roles] = await connection.query(`SELECT roles.id, roles.title, departments.department_name AS department, roles.salary
                                              FROM roles
                                              JOIN departments ON roles.department_id = departments.id`);
        return roles;
    };

    this.getDepartments = async function (password) {
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
        let [departments] = await connection.query("SELECT departments.id, departments.department_name AS name FROM departments");
        return departments;
    }

    this.addDepartment = async function (password, department) {
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
        await connection.query(`INSERT INTO departments (department_name) VALUES (?)`, department);
        let message = "Added " + department + " department to the database";
        return message;
    } 


}

module.exports = Functions;