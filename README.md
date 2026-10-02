# Student Management System

A full-stack Student Management System developed using React, Spring Boot, REST APIs, and MySQL.

## Project Overview

The Student Management System is a web application that allows users to manage student records easily.

The application provides functionality to:

- Add new students
- View all students
- Update student details
- Delete student records
- Store student information in MySQL
- Communicate between frontend and backend using REST APIs

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST API

### Database
- MySQL

### Tools
- Visual Studio Code
- IntelliJ IDEA
- MySQL
- Postman
- Git

## Features

### Add Student
Users can enter the student's:

- Name
- Email
- Age
- Course

and add the student to the database.

### View Students
All student records are displayed in a table.

### Update Student
Users can edit an existing student's information.

### Delete Student
Users can delete a student after confirming the deletion.

### Data Persistence
Student data is stored in MySQL and remains available after refreshing the application.

### Responsive Design
The frontend is designed to work on different screen sizes.

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| GET | `/students/{id}` | Get a student by ID |
| POST | `/students` | Add a new student |
| PUT | `/students/{id}` | Update a student |
| DELETE | `/students/{id}` | Delete a student |

## Project Structure

```text
student-management/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
├── src/
│   └── main/
│       ├── java/
│       │   └── student_management/
│       │       ├── Student.java
│       │       ├── StudentRepository.java
│       │       ├── StudentController.java
│       │       └── StudentManagementApplication.java
│       │
│       └── resources/
│           └── application.properties
│
├── pom.xml
└── README.md