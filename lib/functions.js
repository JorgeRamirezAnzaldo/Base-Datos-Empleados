//Include dotenv and configure it
require('dotenv').config();
// Importar y requerir mysql2
const mysql = require('mysql2/promise'); 

//Functions that involve the connection/queries to the database
function Functions(){

    //Function to create connection to the database
    this.connect = async function (){
        this.connection  = await mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: process.env.DB_PASS,
                database: 'employees_db'
                },
        );
        return;
    };

     
    //Function to get the employees from the database
    this.getEmployees = async function () {
        let [employees] = await this.connection.query(`SELECT emp.id, emp.first_name, emp.last_name, rol.title, dep.department_name AS name,
                                                  rol.salary, CONCAT(man.first_name, " ", man.last_name) AS manager
                                                  FROM employees AS emp
                                                  JOIN roles AS rol
                                                  ON emp.role_id = rol.id
                                                  JOIN departments AS dep
                                                  ON rol.department_id = dep.id
                                                  LEFT JOIN employees AS man
                                                  ON emp.manager_id = man.id
                                                  ORDER BY emp.id ASC`);
        return employees; //Return full array with all data
    };

    //Function to get the roles from the database
    this.getRoles = async function () {
        let [roles] = await this.connection.query(`SELECT roles.id, roles.title, departments.department_name AS department, roles.salary
                                              FROM roles
                                              JOIN departments ON roles.department_id = departments.id`);
        return roles; //Return full array with all data
    };

    //Function to get the departments from the database
    this.getDepartments = async function () {
        let [departments] = await this.connection.query("SELECT departments.id, departments.department_name AS name FROM departments");
        return departments; //Return full array with all data
    }

    //Function to add a department to the database
    this.addDepartment = async function (department) {
        await this.connection.query(`INSERT INTO departments (department_name) VALUES (?)`, department);
        let message = "Added " + department + " department to the database"; //Create success message
        return message; //Return message
    } 

    //Function to get the role id for a role
    this.getRoleId = async function (role) {
        let [roleid] = await this.connection.query(`SELECT roles.id 
                                             FROM roles
                                             WHERE title = ?`, role);                                    
        let result = roleid[0].id; //Get role id from the array
        return result; //Return role id
    }

    //Function to get the manager id based on an employee name
    this.getManagerId = async function (manager) {
        let managerarray = manager.split(" "); //Split the full name by space into an array
        let m_first = managerarray[0]; //Get the first name
        let m_last = managerarray[1]; //Get the last name
        let [managerid] = await this.connection.query(`SELECT employees.id 
                                                FROM employees
                                                WHERE first_name = ? AND last_name = ?`, [m_first, m_last]);
        if (managerid.length == 0){ //If the query gives an empty array
            return null; //Return manager id equal to null
        } else {                        
            let result = managerid[0].id; //Get manager id from the array
            return result; //Return manager id
        }
    }

    //Function to get the department id for a department name
    this.getDepartmentId = async function (department) {
        let [departmentid] = await this.connection.query(`SELECT departments.id 
                                             FROM departments
                                             WHERE department_name = ?`, department);                                    
        let result = departmentid[0].id; //Get department id from the array
        return result; //Return department id
    }

    //Function to add an employee
    this.addEmployee = async function (firstName, lastName, roleid, managerid) {
        await this.connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstName, lastName, roleid, managerid]);
        let message = "Added " + firstName + " " + lastName + " employee to the database"; //Create success message
        return message; //Return message

    }

    //Function to add a role
    this.addRole = async function (title, salary, departmentid) {
        await this.connection.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, departmentid]);
        let message = "Added " + title + " role to the database"; //Create success message
        return message; //Return message

    }

    //Function to update an employee
    this.updateEmployee = async function (employee, roleid) {
        let employeearray = employee.split(" "); //Split the full name by space into an array
        let e_first = employeearray[0]; //Get the first name of the employee
        let e_last = employeearray[1]; //Get the last name of the employee
        await this.connection.query(`UPDATE employees SET role_id = ? WHERE first_name = ? AND last_name = ?`, [roleid, e_first, e_last]);
        let message = employee + " role updated in database"; //Create success message
        return message; //Return message

    }

    //Function to end the connection to the database
    this.connectend = async function(){
        await this.connection.end();
        return;
    }

}

module.exports = Functions; //Export Functions