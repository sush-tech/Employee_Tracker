const inquirer = require('inquirer');
// const cTable = require('console.table');
const express = require('express');
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password:'',
        database: 'employee_db'
    },
    console.log('connected to employee_db database')
);


// to prompt user for inputs
const init =() => {
inquirer
  .prompt([
    {
      type: 'list',
      message: "Choose from the following options:",
      name: 'options',
      choices:["view all departments", "view all roles", "view all employees","add a department","add a role","add an employee","update an employee role","exit"],
    },
  ])
.then((response) => {
    switch(response.options){
        case "view all departments": viewDept();
                    break;
        case "view all roles": viewRoles();
                    break;
        case "view all employees": viewEmployees();
                    break;
        case "add a department": addDept();
                    break;
        case "add a role": addRole();
                    break;
        case "add an employee": addEmployee();
                    break;
        case "update an employee role": updateRole();
                    break;
        case "exit":
                    console.log("You are exiting now!");
                    process.exit();
    }
    })
.catch(err => {
        console.log(err);
  })
}

init();

//view all departments
const viewDept = () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
};
// view all roles
const viewRoles = () => {
    db.query(`SELECT * FROM role`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
};

// view all employees
const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
}
// add a department
const addDept = () => {
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is the name of the department you want to add?",
            name: "addDept"
        }
    ]).then(ans => {
        db.query(`INSERT INTO department(dep_name)
                VALUES(?)`, ans.addDept, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                db.query(`SELECT * FROM department`, (err, results) => {
                    err ? console.error(err) : console.table(results);
                })
            }
            init();
        })
    })
};

// add a role
function addRole() {
    //pass one array in
    const getDepartments = () => {return this.db.promise().query(
        "SELECT * FROM department"
      );}
    getDepartments()
      .then(([departments]) => {
        return inquirer.prompt([
          {
            name: 'title',
            message: "What is the name of the role?"
          },
          {
            name: 'salary',
            message: "What is the salary amount?"
          },
          {
            type: 'list',
            name: 'departmentPrompt',
            message: "What is the role's department?",
            //map each with name as display, value as return value
            choices: departments.map(department => ({ name: department.name, value: department.id })),
          },
        ])
      },
        //destructure result object to FN, LM, etc.
      ).then(({ title, salary, departmentPrompt }) => {
        // CREATE a role
        db.addRole(title, salary, departmentPrompt)
        console.log("The role has been added!")
        init()
      })
  }
//add employee
const addEmployee = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastName"
            },
        ]).then(ans => {
            db.query(`INSERT INTO employee(first_name, last_name)
                    VALUES(?, ?)`, [ans.firstName, ans.lastName], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    db.query(`SELECT * FROM employee`, (err, results) => {
                        err ? console.error(err) : console.table(results);
                        init();
                    })
                }
            }
            )
        })
}
//update role
function updateRole() {
    //pass one array in
   const getEmployees = () => {
        return this.connection.promise().query(
          `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dep_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
            FROM employee 
            LEFT JOIN role 
            ON employee.role_id = role.id 
            LEFT JOIN department 
            ON role.department_id = department.id 
            LEFT JOIN employee manager 
            ON manager.id = employee.manager_id;`
        );
      };


    getEmployees()
      .then(([employees]) => {
        inquirer.prompt([
          {
            type: 'list',
            name: 'employeePrompt',
            message: "Which employee do you want to update?",
            //map each with name as display, value as return value. Map with employee object array
            choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
          }
        ])
          .then(res => {
            let employee_id = res.employeePrompt;
            db.getRoles()
              .then(([roles]) => {
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'rolePrompt',
                    message: "What role do you want to update the employee to?",
                    //map each with name as display, value as return value
                    choices: roles.map(role => ({ name: role.title, value: role.id })),
                  }
                ])
                  .then(res => db.updateRole(employee_id, res.rolePrompt))
                  .then(() => console.log("The employee's role has been updated!"))
                  .then(() => startNewPrompt())
  
              });
          });
      });
  };
  