//Include dotenv and configure it
require('dotenv').config();
//Include inquirer package
const inq = require("inquirer");
//Include console.table package
const cTable = require("console.table");
//Include Functions file to connect to database
const fun = require("./lib/functions.js");

//Initialize variables
var DepartmentOptions = [];
var RoleOptions = [];
var EmployeeOptions = [];
let roleidresult = "";
let manageridresult = "";
let departmentidresult = "";
const functions = new fun();

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

//Function to start the application
function init(){
    functions.connect(); //Create connection to the database
    displayChoices(); //Display the menu with options to the user
}
//Function to create a list of roles based on the result from the query to the database
function createRolesList (RoleTableArray){
    let RList = []; //Initialize the list
    for (var i = 0; i < RoleTableArray.length; i++){ //Loop over each item of the roles array obtained from the database
        RList.push(RoleTableArray[i].title); //Create an array with roles only
    }
    return RList; //Return the list with roles
}
//Function to create a list of employees based on the result from the query to the database
function createEmployeesList (EmployeeTableArray){
    let EList = []; //Initialize the list
    for (var j = 0; j < EmployeeTableArray.length; j++){ //Loop over each item of the employees array obtained from the database
        let fullname = EmployeeTableArray[j].first_name + " " + EmployeeTableArray[j].last_name; //Create the employee full name (first name + last name)
        EList.push(fullname); //Create an array with the full names
    }
    return EList; //Return the list with the full names
}
//Function to create a list of departments based on the result from the query to the database
function createDepartmentsList (DepartmentTableArray){
    let DList = []; //Initialize the list
    for (var k = 0; k < DepartmentTableArray.length; k++){ //Loop over each item of the departments array obtained from the database
        DList.push(DepartmentTableArray[k].name); //Create an array with the departments
    }
    return DList; //Return the list with the departments
}

//Function to display the choices and perform each action
function displayChoices(){
    //Display the options to the user
    inq.prompt(options).then((answers) => {
        if (answers.Option == "View All Employees"){ //If the user chooses to view all employees
            let employees = []; //Initialize array for employees
            const Promise1 = new Promise ((resolve) => { //Create Promise
                employees = functions.getEmployees(); //Get employees from the database
                if (employees){ //If query is done and we have data
                    resolve(employees); //Resolve promise with the query result
                }
            });
            Promise1.then((value) => { //After promise is fulfilled
                console.table(value); //Print table with all employees
                displayChoices(); //Display the options to the user again
            });
        } else if (answers.Option == "Add Employee"){ //If the user chooses to add an employee
            let roles = []; //Initialize array for roles
            const Promise21 = new Promise ((resolve) => { //Create Promise
                roles = functions.getRoles(); //Get roles from the database
                if (roles){ //If query is done and we have data
                    resolve(roles); //Resolve promise with the query result
                }
            });
            Promise21.then((value) => { //After promise is fulfilled
                RoleOptions = []; //Initialize array for the role options
                RoleOptions = createRolesList(value); //Create Roles list using the data from database
                employeequestions[2].choices = RoleOptions; //Modify the questions to add an employee by including the actual Roles list
                let employees = []; //Initialize employees array
                const Promise22 = new Promise ((resolve) => { //Create Promise
                    employees = functions.getEmployees(); //Get employees from the database
                    if (employees){ //If query is done and we have data
                        resolve(employees); //Resolve promise with the query result
                    }
                });
                Promise22.then((value) => { //After promise is fulfilled
                    EmployeeOptions = []; //Initialize array for the employees options
                    EmployeeOptions = createEmployeesList(value); //Create Employees list using the data from database
                    EmployeeOptions.push("None"); //Include None Option for the manager selection
                    employeequestions[3].choices = EmployeeOptions; //Modify the questions by including the actual Employees list to select a manager for the new employee
                    inq.prompt(employeequestions).then((answers) => { //Display all questions to add a new employee
                        let roleid = ""; //Initialize variable for role id
                        const Promise23 = new Promise ((resolve) => { //Create Promise
                            roleid = functions.getRoleId(answers.Role); //Get role id from the database using the role selected by user
                            if (roleid !== ""){ //If query is done and we have the role id
                                resolve(roleid); //Resolve promise with the role id
                            }
                        });
                        Promise23.then((value) => { //After promise is fulfilled
                            roleidresult = value; //Get role id and store it
                            let managerid = ""; //Initialize variable for managerid
                            const Promise24 = new Promise ((resolve) => { //Create Promise
                                managerid = functions.getManagerId(answers.Manager); //Get manager id from the database using the manager selected by user
                                if (managerid !== ""){ //If query is done and we have the manager id
                                    resolve(managerid); //Resolve promise with the manager id
                                }
                            });
                            Promise24.then((value) => { //After promise is fulfilled
                                manageridresult = value; //Get the manager id and store it 
                                let message = ""; //Initialize message
                                const Promise25 = new Promise ((resolve) => { //Create Promise
                                    message = functions.addEmployee(answers.FirstName, answers.LastName, roleidresult, Number(manageridresult)); //Add an employee to the database
                                    if (message !== ""){ //If query is done and the message is not empty
                                        resolve(message); //Resolve promise with the message
                                    }
                                });
                                Promise25.then((value) =>{ //After promise is fulfilled
                                    console.log(value); //Display message to the user
                                    displayChoices(); //Display options to the user again
                                });
                            });
                        });
                    });
                });
            });
            
        } else if (answers.Option == "Update Employee Role"){ //If the user chooses to update an employee role
            let employees = []; //Initialize the array for the employees
            const Promise31 = new Promise ((resolve) => { //Create new promise
                employees = functions.getEmployees(); //Get the list of employees from the database
                if (employees){ //If query is done and there is data
                    resolve(employees); //Resolve promise with data from database
                }
            });
            Promise31.then((value) => { //After Promise is fulfilled
                EmployeeOptions = []; //Initialize array for the employee options
                EmployeeOptions = createEmployeesList(value); //Create employee options array using the data from database
                updateemployeequestions[0].choices = EmployeeOptions; //Modify the questions to update an employee role, using the employee options
                let roles = []; //Initialize roles array
                const Promise32 = new Promise ((resolve) => { //Create new Promise
                    roles = functions.getRoles(); //Get all the role from the database
                    if (roles){ //If query is done and roles were obtained
                        resolve(roles); //Resolve promise with the roles
                    }
                });
                Promise32.then((value) =>{ //After Promise is fulfilled
                    RoleOptions = []; //Initialize array for the role options
                    RoleOptions = createRolesList(value); //Create role options array using the data from database
                    updateemployeequestions[1].choices = RoleOptions; //Modify the questions to update an employee role, using the role options
                    inq.prompt(updateemployeequestions).then((answers) => { //Display questions to update an employee role
                        let roleid = ""; //Initialize variable for role id 
                        const Promise33 = new Promise ((resolve) => { //Create new Promise
                            roleid = functions.getRoleId(answers.RoleUpdate); //Get the role id from database using the role selected by user
                            if (roleid !== ""){ //If query is done and the role id is not empty
                                resolve(roleid); //Resolve Promise with the role id
                            }
                        });
                        Promise33.then((value) => { //After Promise is fulfilled
                            roleidresult = value; //Get the role id and store it
                            const Promise34 = new Promise ((resolve) => { //Create new Promise
                                let message = ""; //Initialize message
                                message = functions.updateEmployee(answers.EmployeeUpdate, roleidresult); //Update the employee role in the database
                                if (message !== ""){ //If the query is done and the message is not empty
                                    resolve(message); //Resolve Promise with the message
                                }
                            });
                            Promise34.then((value) => { //After Promise is fulfilled
                                console.log(value); //Display message to the user
                                displayChoices(); //Display options to the user again
                            });
                        });
                    });
                });
            });
        } else if (answers.Option == "View All Roles"){ //If the user chooses to view all roles
            let roles = []; //Initialize array for roles
            const Promise4 = new Promise ((resolve) => { //Create new Promise
                roles = functions.getRoles(); //Get all roles from database
                if (roles){ //If query is done and we have data
                    resolve(roles); //Resolve Promise with the roles
                }
            });
            Promise4.then((value) => { //After Promise is fulfilled
                console.table(value); //Display roles as a table to the user
                displayChoices(); //Display options to the user again
            });
        } else if (answers.Option == "Add Role"){ //If the user chooses to add a role
            let departments = []; //Initialize array for departments
            const Promise51 = new Promise ((resolve) => { //Create new Promise
                departments = functions.getDepartments(); //Get departments from database
                if (departments){ //If the query is done and we have the departments
                    resolve(departments); //Resolve Promise with departments
                } 
            });
            Promise51.then((value) => { //If Promise is fulfilled
                DepartmentOptions = []; //Initialize array for department options
                DepartmentOptions = createDepartmentsList(value); //Create the department list using the departments obtained from database
                rolequestions[2].choices = DepartmentOptions; //Modify the role questions by including the departments list
                inq.prompt(rolequestions).then((answers) => { //Display the questions for the role creation to the user
                    let departmentid = ""; //Initialize the department id
                    const Promise52 = new Promise ((resolve) => { //Create new Promise
                        departmentid = functions.getDepartmentId(answers.Department); //Get the department id for the department selected by the user
                        if (departmentid !== ""){ //If the query is done and we have the department id
                            resolve(departmentid); //Resolve Promise with department id
                        }
                    });
                    Promise52.then((value) => { //If the Promise is fulfilled
                        departmentidresult = value; //Get the department id and store it
                        const Promise53 = new Promise ((resolve) => { //Create new Promise
                            let message = ""; //Initialize the message
                            message = functions.addRole(answers.Role, answers.Salary, departmentidresult); //Add role to the database
                            if (message !== ""){ //If the query is done and the message is not empty
                                resolve(message); //Resolve Promise with the message
                            };
                        });
                        Promise53.then((value) =>{ //If the Promise is fulfilled
                            console.log(value); //Display the message to the user
                            displayChoices(); //Display the options to the user again
                        });
                    });
                });
            });
        } else if (answers.Option == "View All Departments"){ //If the user chooses to display all departments
            let departments = []; //Initialize array for departments
            const Promise6 = new Promise ((resolve) => { //Create new Promise
                departments = functions.getDepartments(); //Get all departments from database
                if (departments){ //If query is done and we have data
                    resolve(departments); //Resolve Promise with the departments
                }
            });
            Promise6.then((value) => { //After Promise is fulfilled
                console.table(value); //Display all departments as table to the user
                displayChoices(); //Display options to the user again
            });
        } else if (answers.Option == "Add Department"){ //If the user chooses to add a department
            inq.prompt(departmentquestions).then((answers) => { //Display questions to user to add a department
                let message = ""; //Initialize message
                const Promise7 = new Promise ((resolve) => { //Create new Promise
                message = functions.addDepartment(answers.Name); //Add department to database using the department name introduced by user
                if (message !== ""){ //If the query is done and the message is not empty
                    resolve(message); //Resolve promise with the message
                }
                });
                Promise7.then((value) => { //After Promise is fulfilled
                    console.log(value); //Display message to the user
                    displayChoices(); //Display options to the user again
                });
            });
        } else if (answers.Option == "Exit"){ //If the user chooses to Exit
            functions.connectend(); //End connection to database
            console.log("Goodbye!"); //Display message to the user
        }
    })
}

init(); //Call the initial function