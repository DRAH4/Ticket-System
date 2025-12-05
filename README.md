# Full Stack Ticketing System
## Overview

The Full Stack Ticketing System is a project designed to manage tickets for tasks or projects. It allows users to create, view, edit, and track tickets in a system that could be used by a development or IT support team. Each ticket includes information such as priority, type, assignee, owner, and status.

The goal of this project is to build a full stack web application that demonstrates frontend design, backend integration, database management, and data driven functionality.

Currently, the frontend is complete using HTML, CSS and JavaScript functionality. The backend is complete and connected to a MySQL database, and implements the core CRUD features.

# Current Status

This project has progressed and now includes a fully functional client side implementation of a Ticketing System. The frontend layout is built using the Vuexy Admin Dashboard Template, and the system supports creating, viewing, editing, deleting, and filtering tickets using JavaScript and a worling database. A comment system, sorting, dropdown filtering, and dynamic page navigation are also fully implemented.

The backend and MySQL database layer have now been introduced as part of the CS-499 Capstone enhancements. API routes have been added to retrieve, create, update, delete, and post comments to and from the database. This project represents the transition point from a purely frontend/localStorage version to a true full stack application.

## Features

Create, edit, and delete tickets

Assign tickets to different users

Filter and sort tickets by status, priority, or assignee

Add and view comments on individual tickets

Track changes and updates to tickets

View open tickets in a calendar format

## Current Progress

Frontend layout built using the Vuexy HTML template

Ticket list page with design and layout completed

Create ticket page completed

Edit ticket page completed

View ticket page completed

Database completed

Backend completed

Calendar page available in the template, to be integrated later

At this stage, ticket data is receiveing and sending data to the database.

## Tech Stack

Frontend: HTML, CSS, JavaScript
Backend: Node.js with Express
Database: MySQL
Template Framework: Vuexy Admin Dashboard (HTML version)
UI Components: Vuexy layout and form components

## Template Credit

This project uses the Vuexy Admin Dashboard Template (HTML version) created by PIXINVENT.
Template License: Purchased from ThemeForest
URL: https://themeforest.net/item/vuexy-vuejs-html-laravel-admin-dashboard-template/23328599

All design rights belong to PIXINVENT. All project specific logic, scripts, database code, and enhancements are original work.

## Getting Started

This version of the project is viewed locally.

1. Clone or download the repository.
3. npm run dev.
2. Open http://localhost:3000/index.html in your web browser.


## Backend and Database Setup

1. Make sure MySQL Server is installed and running.

2. Create the database and tables:

   - Open MySQL Workbench (or your MySQL client).
   - Run the following SQL:

     ```sql
     CREATE DATABASE ticket_system;
     USE ticket_system;

     CREATE TABLE tickets (
         id INT AUTO_INCREMENT PRIMARY KEY,
         subject VARCHAR(255) NOT NULL,
         description TEXT,
         priority VARCHAR(50),
         assignee VARCHAR(100),
         type VARCHAR(100),
         status VARCHAR(50),
         owner VARCHAR(100),
         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE comments (
         id INT AUTO_INCREMENT PRIMARY KEY,
         ticket_id INT NOT NULL,
         author VARCHAR(100),
         text TEXT,
         date DATETIME DEFAULT CURRENT_TIMESTAMP,
         FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
     );
     ```

3. Install backend dependencies:

   npm install

4. Create a .env file in the project root

   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=ticket_system
   DB_PORT=3306
    
   PORT=3000

5. Create a .env file in the project root
   
   node server.js

## Database Structure

tickets – stores ticket information such as title, description, priority, status, assignee, owner, and timestamps.
comments – stores comments linked to specific tickets.
users – contains a predefined set of demo users used for ticket assignment(Real users are not planed for the Capstone).

## Future Enhancements

Calendar integration for due dates and scheduling

Input validation and improved error handling

Optional user authentication

## Author

David J Rahmey
