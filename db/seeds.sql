INSERT INTO department (dep_name)
VALUES  ("Information Technology"),
        ("Software Development"),
        ("Human Resources"),
        ("Management");

INSERT INTO role (title,salary,department_id)
VALUES  ("Sr. Software Developer","9000","2"),
        ("Sr.HR","5000","3"),
        ("Manager","5000","4"),
        ("Technical Support","3000","1");

INSERT INTO employee(first_name,last_name,role_id, manager_id)
VALUES  ("Sushmitha","Reddy","1","1"),
        ("Rose","Solano","2","2"),
        ("Rafel","Slokani","1","3"),
        ("Jane","Vuverio","3","4"),
        ("Rohelio","Rane","4","5"),
        ("Jhon","Kims","1","6"),
        ("Lila","Fernandes","3","7"),
        ("Marry","Cooper","4","8");
