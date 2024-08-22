# IP to Country API

## Overview

This project provides an API service to determine the country associated with a given IP address. It features caching for performance and includes rate limiting to handle API quotas.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Documentation](#documentation)
- [License](#license)

## Installation

To get started with this project, follow these steps:

1. **Clone the Repository**

   ```
        git clone <repository-url>
   ```

2. **Navigate to the Project Directory**
   ```
       cd <project-directory>
   ```
3. **Install Dependencies**
   ```
       npm install
   ```
4. **Create a .env File**
   - Copy the .env.example file to .env and update the values to your values.
   ```
       cp .env.example .env
   ```

## Usage

    - Start the Server
    ```
        npm start
    ```

The server will be available at http://localhost:3000.

## API Endpoints

1. **GET Country By IP**
   ```
       GET /api/country
   ```
   - _Parameters:_
     - ip (query parameter): The IP address to look up.
   - _Returns the country name associated with the provided IP address._
   - _Responses_
     - 200 OK: { "country": "<country-name>" }
     - 400 Bad Request: { "error": "<error-message>" }
     - 429 Too Many Requests: { "error": "<error-message>" }
     - 500 Internal Server Error: { "error": "Failed to get country information" }
2. **Clear Cache**
   ```
       DELETE /api/clear-cache
   ```

- Clears the cache and returns the number of items removed.

**Testing**

To run tests, use the following command:

    ```
        npm start
    ```

Tests are written using Mocha, Chai, and Supertest.

**Documentation**
The API documentation is available at /api-docs. This documentation is generated using Swagger and provides an interactive interface to test the API endpoints.

**License**
This project is licensed under the MIT License. See the LICENSE file for details.
