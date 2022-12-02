//Include inquirer package
const inq = require("inquirer");
const fun = require("./lib/functions.js");
const cTable = require("console.table");
var DepartmentOptions = [];
var RoleOptions = [];
var EmployeeOptions = [];
let roleidresult = "";
let manageridresult = "";
let password;
const functions = new fun();

//Define question for database access
const passwordDB = [
    {
        //Ask for password of the database
        type: "password",
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
let rolequestions = [
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
let employeequestions = [
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
let updateemployeequestions = [
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
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Exit"], 
    }

];

function init(){
    inq.prompt(passwordDB).then((answers) => {
        password = answers.Password;
        displayChoices();
    });
}

function createRolesList (RoleTableArray){
    let RList = [];
    for (var i = 0; i < RoleTableArray.length; i++){
        RList.push(RoleTableArray[i].title);
    }
    return RList;
}

function createEmployeesList (EmployeeTableArray){
    let EList = [];
    for (var j = 0; j < EmployeeTableArray.length; j++){
        let fullname = EmployeeTableArray[j].first_name + " " + EmployeeTableArray[j].last_name;
        EList.push(fullname);
    }
    return EList;
}

function createDepartmentsList (DepartmentTableArray){

}


function displayChoices(){
    inq.prompt(options).then((answers) => {
        if (answers.Option == "View All Employees"){
            let employees = [];
            const Promise1 = new Promise ((resolve) => {
                employees = functions.getEmployees(password);
                if (employees){
                    resolve(employees);
                }
            });
            Promise1.then((value) => {
                console.table(value);
                displayChoices();
            });
        } else if (answers.Option == "Add Employee"){
            let roles = [];
            const Promise21 = new Promise ((resolve) => {
                roles = functions.getRoles(password);
                if (roles){
                    resolve(roles);
                }
            });
            Promise21.then((value) => {
                RoleOptions = [];
                RoleOptions = createRolesList(value);
                employeequestions[2].choices = RoleOptions;
                let employees = [];
                const Promise22 = new Promise ((resolve) => {
                    employees = functions.getEmployees(password);
                    if (employees){
                        resolve(employees);
                    }
                });
                Promise22.then((value) => {
                    EmployeeOptions = [];
                    EmployeeOptions = createEmployeesList(value);
                    employeequestions[3].choices = EmployeeOptions;
                    inq.prompt(employeequestions).then((answers) => {
                        let roleid = "";
                        const Promise23 = new Promise ((resolve) => {
                            roleid = functions.getRoleId(password, answers.Role);
                            if (roleid !== ""){
                                resolve(roleid);
                            }
                        });
                        Promise23.then((value) => {
                            console.log(value);
                            roleidresult = value;
                            let managerid = "";
                            const Promise24 = new Promise ((resolve) => {
                                managerid = functions.getManagerId(password, answers.Manager);
                                if (managerid !== ""){
                                    resolve(managerid);
                                }
                            });
                            Promise24.then((value) => {
                                console.log(value);
                                manageridresult = value;
                                let message = "";
                                const Promise25 = new Promise ((resolve) => {
                                    message = functions.addEmployee(password, answers.FirstName, answers.LastName, roleidresult, manageridresult);
                                    if (message !== ""){
                                        resolve(message);
                                    }
                                });
                                Promise25.then((value) =>{
                                    console.log(value);
                                    displayChoices();
                                });
                            });
                        });
                    });
                });
            });
            
        } else if (answers.Option == "Update Employee Role"){
            //getEmployees(password);
            //getRoles(password);
            inq.prompt(updateemployeequestions).then((answers) => {
                //updateEmployee(password);
                displayChoices();
            })
        } else if (answers.Option == "View All Roles"){
            let roles = [];
            const Promise4 = new Promise ((resolve) => {
                roles = functions.getRoles(password);
                if (roles){
                    resolve(roles);
                }
            });
            Promise4.then((value) => {
                console.table(value);
                displayChoices();
            });
        } else if (answers.Option == "Add Role"){
            let departments = [];
            const Promise51 = new Promise ((resolve) => {
                departments = functions.getDepartments(password);
                if (departments){
                    resolve(departments);
                }
            });
            Promise51.then((value) => {
                DepartmentOptions = [];
                DepartmentOptions = createDeparmentsList(value);
                rolequestions[2].choices = DepartmentOptions;
                inq.prompt(rolequestions).then((answers) => {
                    const Promise52 = new Promise ((resolve) => {
                        let message = "";
                        message = functions.addRole(password, answers.title, answers.salary, department_id);
                        if (message !== ""){
                            resolve(message);
                        };
                    });
                    Promise52.then((value) =>{
                        console.log(value);
                        displayChoices();
                    });
                });
            });
        } else if (answers.Option == "View All Departments"){
            let departments = [];
            const Promise6 = new Promise ((resolve) => {
                departments = functions.getDepartments(password);
                if (departments){
                    resolve(departments);
                }
            });
            Promise6.then((value) => {
                console.table(value);
                displayChoices();
            });
        } else if (answers.Option == "Add Department"){
            inq.prompt(departmentquestions).then((answers) => {
                let message = "";
                const Promise7 = new Promise ((resolve) => {
                message = functions.addDepartment(password, answers.Name);
                if (message !== ""){
                    resolve(message);
                }
                });
                Promise7.then((value) => {
                    console.log(value);
                    displayChoices();
                });
            });
        } else if (answers.Option == "Exit"){
            console.log("Goodbye!");
        }
    })
}

init();