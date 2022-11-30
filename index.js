//Include inquirer package
const inq = require("inquirer");
const fun = require("./lib/functions.js")
const DepartmentOptions = [];
const RoleOptions = [];
const EmployeeOptions = [];
let password;

//Define question for database access
const passwordDB = [
    {
        //Ask for password of the database
        type: "input",
        name: "Password",
        message: "Which is your password for Database access?",
    },
]

//Define questions to be displayed to create department
const departmentquestions = [
    {
        //Ask for the name of the department
        type: "input",
        name: "Name",
        message: "Which is the name of the new department?",
    },
];

//Define questions to be displayed to create role
const rolequestions = [
    {
        //Ask for the name of the role
        type: "input",
        name: "Role",
        message: "Which is the name of the new role?",
    },
    {
        //Ask for the salary of the role
        type: "number",
        name: "Salary",
        message: "Which is the salary of the new role?",
    },
    {
        //Ask for the department of the role
        type: "list",
        name: "Department",
        message: "Which is the department of the new role?",
        choices: DepartmentOptions,
    },

];

//Define questions to be displayed to create employee
const employeequestions = [
    {
        //Ask for the first name of the employee
        type: "input",
        name: "FirstName",
        message: "Which is the first name of the new employee?",
    },
    {
        //Ask for the last name of the employee
        type: "input",
        name: "LastName",
        message: "Which is the last name of the new employee?",
    },
    {
        //Ask for the role of the employee
        type: "list",
        name: "Role",
        message: "Which is the role of the new employee?",
        choices: RoleOptions,
    },
    {
        //Ask for the manager of the employee
        type: "list",
        name: "Manager",
        message: "Which is the manager of the new employee?",
        choices: EmployeeOptions,
    },

];

//Define questions to update employee role
const updateemployeequestions = [
    {
        //Ask for the employee to update
        type: "list",
        name: "EmployeeUpdate",
        message: "Which employee's role do you want to update?",
        choices: EmployeeOptions,
    },
    {
        //Ask for the new role
        type: "list",
        name: "RoleUpdate",
        message: "Which role do you want to assign the selected employee?",
        choices: RoleOptions,
    },

];

//Define options for the action
const options = [
    {
        //Ask the user what to do
        type: "list",
        name: "Option",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"], 
    }

];

function init(){
    inq.prompt(passwordDB).then((answers) => {
        password = answers.Password;
        displayChoices();
    });
}

function displayChoices(){
    inq.prompt(options).then((answers) => {
        if (answers.Option == "View All Employees"){
            const functions = new fun();
            functions.getEmployees(password);
            displayChoices();
        } else if (answers.Option == "Add Employee"){
            //getRoles(password);
            //getEmployees(password);
            inq.prompt(employeequestions).then((answers) => {
                //addEmployee(password);
                displayChoices();
            });
        } else if (answers.Option == "Update Employee Role"){
            //getEmployees(password);
            //getRoles(password);
            inq.prompt(updateemployeequestions).then((answers) => {
                //updateEmployee(password);
                displayChoices();
            })
        } else if (answers.Option == "View All Roles"){
            //getRoles(password);
            displayChoices();
        } else if (answers.Option == "Add Role"){
            //getDepartments(password);
            inq.prompt(rolequestions).then((answers) => {
                //addRole(password);
                displayChoices();
            });
        } else if (answers.Option == "View All Departments"){
            //getDepartments(password);
            displayChoices();
        } else if (answers.Option == "Add Department"){
            inq.prompt(departmentquestions).then((answers) => {
                //addDepartment(password);
                displayChoices();
            });
        }
    })
}

init();