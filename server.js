const inquirer = require('inquirer');
const fs = require('fs');
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
        password:'Osuniversity@9889',
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
        case "update an employee role": updateEmployee();
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
// view all roles
// view all employees
// add a department
// add a role
// add an employee
// update an employee role

