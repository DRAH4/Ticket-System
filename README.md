# Full Stack Ticketing System
## Overview

The Full Stack Ticketing System is a project designed to manage tickets for tasks or projects. It allows users to create, view, edit, and track tickets in a system that could be used by a development or IT support team. Each ticket includes information such as priority, type, assignee, owner, and status.

The goal of this project is to build a full stack web application that demonstrates front-end design, back-end integration, database management, and data-driven functionality.

Currently, the front-end is complete using HTML and CSS from a purchased template. The next steps include adding JavaScript functionality, connecting to a MySQL database, and implementing the core CRUD features.

## Features (Planned)

Create, edit, and delete tickets

Assign tickets to different users

Filter and sort tickets by status, priority, or assignee

Add and view comments on individual tickets

Track changes and updates to tickets

View open tickets in a calendar format

Dashboard metrics for ticket analytics

## Current Progress

Front-end layout built using the Vuexy HTML template

Ticket list page with design and layout completed

Create ticket page completed

Edit ticket page planned (same layout as create page, pre-filled with existing data)

View ticket page planned (show ticket details and comments)

Calendar page available in the template, to be integrated later

At this stage, ticket data is hard-coded for layout and testing purposes. Functional data handling and database connectivity will be implemented during later milestones.

## Tech Stack

Frontend: HTML, CSS, JavaScript
Backend (Planned): Node.js with Express or PHP
Database: MySQL
Template Framework: Vuexy Admin Dashboard (HTML version)
UI Components: Vuexy layout and form components

## Template Credit

This project uses the Vuexy Admin Dashboard Template (HTML version) created by PIXINVENT.
Template License: Purchased from ThemeForest
URL: https://themeforest.net/item/vuexy-vuejs-html-laravel-admin-dashboard-template/23328599

All design rights belong to PIXINVENT. All project-specific logic, scripts, database code, and enhancements are original work.

## Getting Started

This version of the project is front-end only and can be viewed locally.

1. Clone or download the repository.
2. Open index.html in your web browser.


When the backend and database are added, setup instructions will include installation and startup commands such as:

npm install
npm start

## Planned Database Structure

tickets – stores ticket information such as title, description, priority, status, assignee, owner, and timestamps.
comments – stores comments linked to specific tickets.
users – contains a predefined set of demo users used for ticket assignment.

## Future Enhancements

Full database integration with MySQL

Complete CRUD functionality

Comment system with timestamped updates

Analytics dashboard with ticket metrics

Calendar integration for due dates and scheduling

Input validation and improved error handling

Optional user authentication

## Author

David Rahmey
