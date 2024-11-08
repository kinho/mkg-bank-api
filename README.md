# **MongoDB KoaJS GraphQL Bank API**

## **Overview**

This project is a sample bank API built with **MongoDB**, **KoaJS**, and **GraphQL**. It provides CRUD operations for managing **users**, **companies**, **accounts**, and **transactions**. The API enables secure transactions between accounts, calculates balances based on transaction history, and includes JWT authentication for access control.

### **Key Features**

- **Account and Transaction Management**: Complete CRUD operations for accounts and transactions.
- **Account Transfers**: Enables secure transactions between accounts.
- **Balance Calculation**: Automatically calculates account balances based on the transaction history.
- **JWT Authentication**: Protects routes, allowing access only to authenticated users.
- **Access Control**: Verifies access permissions for sensitive operations.

## **Prerequisites**

Ensure the following are installed and configured:

- [**Git**](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [**SSH Key**](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [**Docker**](https://docs.docker.com/engine/install)
- [**Node.js**](https://nodejs.org/) (for running locally)

## **Running the Project**

After cloning the repository, run the following command on project directory to start the Docker environment in the background:

```bash
$ docker compose up -dV
```

## **Exploring the API**

#### **Apollo Explorer**: **http://localhost:4000/graphql**

Use the [**Apollo Explorer**](https://www.apollographql.com/tutorials/lift-off-part1/06-apollo-explorer) at the above link to test queries and mutations, visualize the schema, and explore the data.

## **Testing**

To run the test suite and validate API functionality, use the command:

```bash
$ npm run test
```

This command will execute the defined tests, ensuring reliability of operations.

## **Exporting to Postman**

To facilitate development and testing with Postman, the GraphQL schema can be converted into a JSON file, allowing you to import API definitions directly into Postman.

To generate the JSON file, run:

```bash
$ npm run postman:json
```

This file can be imported into Postman, enabling quick testing of the defined queries and mutations.
