# IP to Country API

## New Markdown

## Overview

This project provides an API service to determine the country associated with a given IP address. It features caching for performance and includes rate limiting to handle API quotas.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Linting](#linting)
- [Documentation](#documentation)
- [Caching Strategy](#caching-strategy)
- [Vendor Management](#vendor-management)
- [External Libraries](#external-libraries)
- [Current Limitations](#current-limitations)
- [Future Improvements for Production Readiness](#future-improvements-for-production-readiness)

## Installation

To get started with this project, follow these steps:

1. **Clone the Repository**

   ```
   git clone https://github.com/yrameshk26/IpCountryResolver.git
   ```

2. **Navigate to the Project Directory**

   ```
    cd IpCountryResolver
   ```

3. **Install Dependencies**

   ```
   npm install
   ```

4. **Create a .env File**

   - Copy the .env.example file to .env and update the values to your own.

   ```
   cp .env.example .env
   ```

## Usage

- Start the Server in Development Mode:

  ```
  npm run dev
  ```

- Start the Server in Production Mode:

  ```
  npm run prod
  ```

The server will be available at http://localhost:3000.

## API Endpoints

1. **GET Country By IP**

   ```
   GET /api/country
   ```

   - _Parameters:_

     - ip (query parameter): The IP address to look up (IPv4 or IPV6).

   - _Returns the country name associated with the provided IP address._

   - _Responses:_
     - 200 OK: { "country": "<country-name>" }
     - 400 Bad Request: { "error": "<error-message>" }
     - 429 Too Many Requests: { "error": "<error-message>" }
     - 500 Internal Server Error: { "error": "Failed to get country information" }

2. **Clear Cache**

   ```
   DELETE /api/clear-cache
   ```

   - Clears the cache and returns the number of items removed.

## Testing

To run tests, use the following command:

```
npm run test
```

**Postman Collection**

A Postman collection is included with the project, containing all the API endpoints. The collection includes response validation for different valid and error scenarios, making it easier to test and verify the behavior of the API under various conditions. You can import the collection into Postman and use it to interact with the API.

## Linting

To check for linting errors:

```
npm run lint
```

To automatically fix linting errors:

```
npm run lint:fix
```

Tests are written using Mocha, Chai, and Supertest. They cover all happy path scenarios as well as various error conditions, ensuring robust and reliable API behavior.

## Documentation

The API documentation is available at /api-docs. This documentation is generated using Swagger and provides an interactive interface to test the API endpoints.

## Caching Strategy

**Why LRU Cache?**

_lru-cache_ was chosen for this project due to its efficiency and simplicity in managing memory usage. By using the Least Recently Used (LRU) caching strategy, we ensure that the most frequently accessed IP address lookups remain in cache, while less frequently accessed entries are evicted when the cache reaches its maximum size. This approach optimizes performance by minimizing the need to make repeated external calls for the same IP address, thus reducing latency and load on external vendors.

- Efficient Memory Usage: LRU cache keeps the memory footprint manageable by automatically removing the least recently used items when the cache limit is reached.

- Improved Performance: Reduces the number of external API calls by caching results, leading to faster response times for frequently accessed data.

- Scalability: Easy to adjust cache size and implement different cache expiration policies as needed.

## Vendor Management

To ensure flexibility and reliability in determining the country associated with an IP address, the system is designed with robust vendor management features:

1. Seamless Vendor Integration:

   - The system is built to easily support adding new IP-to-country vendors. Vendor-specific logic is abstracted into separate modules, which allows new vendors to be integrated with minimal changes to the core system. This design makes it simple to extend the system's capabilities by integrating additional data sources as needed.

2. Fallback Mechanisms:

   - Reliability is crucial for this service. If one vendor fails to provide a response, the system automatically queries another vendor. This fallback mechanism ensures that the service remains operational even if some vendors experience downtime or failures, thereby providing a robust and dependable service.

## External Libraries

This project utilizes several external libraries to enhance its functionality and maintainability:

1. Express: A fast, unopinionated, minimalist web framework for Node.js, used to set up the API endpoints and handle HTTP requests and responses.
2. Lru-cache: Implements a Least Recently Used (LRU) caching strategy to efficiently manage memory usage and improve the performance of IP address lookups.
3. Axios: A promise-based HTTP client for making requests to external IP-to-country vendors. It simplifies making API calls and handling responses.
4. Mocha: A feature-rich JavaScript test framework running on Node.js, used for writing and running tests.
5. Chai: An assertion library used with Mocha for testing, providing a variety of assertion styles for test validation.
6. Supertest: A library for testing HTTP servers, used to test the API endpoints in conjunction with Mocha and Chai.
7. Prettier: A code formatter to maintain consistent code style across the project.
8. ESLint: A static code analysis tool for identifying and fixing problems in JavaScript code, ensuring code quality and consistency.
9. Husky: A tool for running Git hooks, used to enforce linting and other checks before commits and pushes.
10. Rate-limiter-flexible: A library to enforce rate limits and quotas, providing protection against API abuse and ensuring fair usage.
11. Dotenv: Loads environment variables from a .env file into process.env. This makes it easy to manage configuration settings.
12. Swagger-jsdoc: A library to generate Swagger documentation from JSDoc comments, allowing for automatic generation of interactive API documentation.
13. Winston: A versatile logging library for Node.js, used for logging information about the application's behavior, errors, and other events.
14. Jest: A testing framework with a focus on simplicity. It's used for running unit tests and integration tests.

## Current Limitations

While this API service is designed to be robust and efficient, there are some current limitations to be aware of:

1. Single IP Lookup Only:

   - The current API only supports looking up the country for a single IP address per request. Batch processing of multiple IP addresses is not yet supported.

2. In-Memory Caching:

   - The service uses an in-memory LRU cache, which will reset when the service is scaled up or restarted. Since the cache data is not persisted, this can result in a loss of cached data and an increase in external API calls. Future improvements could include persisting the cache data to disk and loading it during service startup to mitigate this issue.

3. Vendor Dependency:

   - The API relies on external IP-to-country vendors. If all configured vendors fail, the service might not be able to provide a response. While fallback mechanisms are in place, dependency on external services can introduce points of failure.

4. Rate Limiting:

   - Rate limiting is implemented, but it may need to be fine-tuned based on real-world usage patterns and traffic volumes to prevent abuse while ensuring fair access for all users.

5. Error Handling and Reporting:

   - Error handling is basic and may need to be enhanced to provide more detailed information for debugging and monitoring purposes.

## Future Improvements for Production Readiness

As this API service scales up and moves towards production readiness, several improvements can be made to ensure it remains robust, performant, and scalable:

1. API for Multiple IPs:

   - Batch IP Lookup Endpoint: Develop an additional API endpoint that accepts a list of IP addresses and returns a list of countries for each IP. This would allow clients to query multiple IP addresses in a single request, improving efficiency and reducing the number of individual API calls needed.
   - Optimized Processing: Ensure that the batch processing is optimized to handle large numbers of IP addresses efficiently, and that results are returned in a structured format for ease of use.

2. Distributed Systems:

   - Load Balancing: Implement load balancers to distribute incoming traffic across multiple instances of the service, ensuring high availability and fault tolerance.

3. Distributed Caching:

   - Redis/Memcached: Replace the current in-memory cache with a distributed cache system like Redis or Memcached. This would allow the cache to be shared across multiple instances of the service, improving performance and scalability.
   - Cache Expiration Policies: Implement advanced caching strategies with appropriate expiration policies to manage cache size and freshness.

4. Rate Limiting and Throttling:

   - Distributed Rate Limiting: Implement distributed rate limiting to ensure consistent enforcement of API usage quotas across all instances of the service.

   - Adaptive Throttling: Use adaptive throttling mechanisms to adjust the rate limits dynamically based on system load or user behavior.

5. Monitoring and Observability:

   - Centralized Logging: Implement centralized logging with tools like ELK Stack (Elasticsearch, Logstash, Kibana) or Splunk to monitor API usage, errors, and performance across all instances.

   - Metrics and Alerts: Integrate with monitoring tools like Prometheus and Grafana to collect and visualize metrics. Set up alerts for critical events like increased error rates or degraded performance.

6. High Availability and Disaster Recovery:

   - Multi-Region Deployment: Deploy the service across multiple regions to reduce latency and improve fault tolerance.
   - Automated Backups and Failover: Implement automated backup strategies and failover mechanisms to ensure data integrity and service continuity in case of failures.

7. CI/CD Pipeline:

   - Continuous Integration and Continuous Deployment: Set up a CI/CD pipeline using a cloud provider like Azure. This would automate testing, building, and deployment processes, ensuring that new changes are seamlessly integrated and deployed to production environments.

   - Environment Consistency: Use the CI/CD pipeline to maintain consistency across different environments (development, staging, production) and to automate the roll-out of updates and patches.
