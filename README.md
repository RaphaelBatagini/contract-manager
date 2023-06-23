# ContractManager

ContractManager is a comprehensive Node.js/Express.js backend application that offers a REST API for efficient contract management. It simplifies the process of creating, tracking, and managing contracts between clients and contractors. With ContractManager, you can easily handle tasks such as retrieving contract details, managing payments, and generating insightful reports. The application follows a clean architecture design pattern, ensuring scalability, maintainability, and extensibility. ContractManager is the ideal solution to streamline contract-related operations and enhance collaboration between clients and contractors.

## 🚀 Technologies Used

- Node.js
- Express.js
- Sequelize (ORM)
- SQLite
- Jest (Testing framework)
- Supertest (HTTP testing)
- Faker.js (Data mocking)
- Docker (TODO)
- TypeScript (TODO)
- Swagger (TODO)

## Project Structure

The project follows a clean architecture pattern, which provides a clear separation between different layers of the application.

```
├─ scripts
├─ src
│  ├─ adapters
│  │  └─ http
│  ├─ application
│  │  ├─ errors
│  │  └─ use-cases
│  ├─ domain
│  ├─ infrastructure
│  │  ├─ config
│  │  ├─ database.js
│  │  ├─ middleware
│  │  ├─ repositories
│  │  └─ webserver
│  └─ server.js
└─ tests
   ├─ integration
   ├─ mocks
   ├─ runTests.js
   ├─ setup.js
   └─ unit
```

## Getting Started

To run the project, follow the steps below:

1. Clone the repository:
```shell
git clone https://github.com/RaphaelBatagini/contract-manager.git
cd contract-manager
```

2. Install the dependencies:
```
npm install
```

3. Configure the environment variables:
- Copy the .env.example file and rename it to .env.
- Adjust the values in the .env file according to your environment.

4. Seed the database:
```
npm run seed
```

5. Start the application:
```
npm run start
```

The application will be accessible at http://localhost:3001.

## :test_tube: Running Tests

To run the unit tests, use the following command:
```
npm run test:unit
```

To run the integration tests, use the following command:
```
npm run test:integration
```

To run all the application tests, use the following command:
```
npm run test
```

## Routes

| HTTP Method | Route                          | Description                                                   |
|-------------|--------------------------------|---------------------------------------------------------------|
| GET         | `/contracts/:id`               | Retrieves a contract by its ID                                 |
| GET         | `/contracts`                   | Retrieves a list of non-terminated contracts                   |
| GET         | `/jobs/unpaid`                 | Retrieves all unpaid jobs for the user (client or contractor)  |
| POST        | `/jobs/:job_id/pay`            | Pays for a job if the client's balance is sufficient           |
| POST        | `/balances/deposit/:userId`    | Deposits money into the client's balance                       |
| GET         | `/admin/best-profession`       | Retrieves the profession that earned the most money            |
| GET         | `/admin/best-clients`          | Retrieves the clients who paid the most for jobs               |

## 📝 TODO List

- Improve unit tests coverage
- Create missing integration tests
- Run tests on pull requests using GitHub Actions
- Create a Docker environment
- Uncouple domain classes from Sequelize models
- Move some business rules from repositories into use cases
- Implement TypeScript to make better use of Clean Architecture, defining interfaces and other contracts
- Implement documentation using Swagger

## License
This project is licensed under the [MIT License](./LICENSE.md).
Feel free to contribute and provide feedback.
