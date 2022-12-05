// Importar y requerir mysql2
require('dotenv').config();
const mysql = require('mysql2/promise'); 


function Functions(){

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
        return employees;
    };

    this.getRoles = async function () {
        let [roles] = await this.connection.query(`SELECT roles.id, roles.title, departments.department_name AS department, roles.salary
                                              FROM roles
                                              JOIN departments ON roles.department_id = departments.id`);
        return roles;
    };

    this.getDepartments = async function () {
        let [departments] = await this.connection.query("SELECT departments.id, departments.department_name AS name FROM departments");
        return departments;
    }

    this.addDepartment = async function (department) {
        await this.connection.query(`INSERT INTO departments (department_name) VALUES (?)`, department);
        let message = "Added " + department + " department to the database";
        return message;
    } 



    this.getRoleId = async function (role) {
        let [roleid] = await this.connection.query(`SELECT roles.id 
                                             FROM roles
                                             WHERE title = ?`, role);                                    
        let result = roleid[0].id;
        return result;
    }


    this.getManagerId = async function (manager) {
        let managerarray = manager.split(" ");
        let m_first = managerarray[0];
        let m_last = managerarray[1];
        let [managerid] = await this.connection.query(`SELECT employees.id 
                                                FROM employees
                                                WHERE first_name = ? AND last_name = ?`, [m_first, m_last]);
        if (managerid.length == 0){
            return null;
        } else {                        
            let result = managerid[0].id;
            return result;
        }
    }


    this.getDepartmentId = async function (department) {
        let [managerid] = await this.connection.query(`SELECT departments.id 
                                             FROM departments
                                             WHERE department_name = ?`, department);                                    
        let result = managerid[0].id;
        return result;
    }



    this.addEmployee = async function (firstName, lastName, roleid, managerid) {
        await this.connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstName, lastName, roleid, managerid]);
        let message = "Added " + firstName + " " + lastName + " employee to the database";
        return message;

    }

    this.addRole = async function (title, salary, departmentid) {
        await this.connection.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, departmentid]);
        let message = "Added " + title + " role to the database";
        return message;

    }

    this.updateEmployee = async function (employee, roleid) {
        let employeearray = employee.split(" ");
        let e_first = employeearray[0];
        let e_last = employeearray[1];
        await this.connection.query(`UPDATE employees SET role_id = ? WHERE first_name = ? AND last_name = ?`, [roleid, e_first, e_last]);
        let message = employee + " role updated in database";
        return message;

    }

    this.connectend = async function(){
        await this.connection.end();
        return;
    }

}

module.exports = Functions;