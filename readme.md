# Athlo Blitz

Welcome to `Athlo Blitz`, the premier Sports Facility Booking Platform designed to simplify the booking process for Sports Facility.

## Overview 

`Athlo Blitz` is a comprehensive web application that streamlines the process of reserving sports facilities. Whether you're a freelancer, entrepreneur, or doing work from home and looking for sports facility to keep you body fit, `Athlo Blitz` provides an intuitive platform to efficiently manage your sports facility needs.

## Table of Contents

- [Athlo Blitz](#athlo-blitz)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Technology Stack](#technology-stack)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Scripts](#scripts)
  - [Contributing](#contributing)


## Technology Stack

- **Backend**: `Node.js` and `Express.js` for building a robust server-side application.
- **Database**: MongoDB with `Mongoose` for efficient data storage and retrieval.
- **Authentication**: `JSON Web Tokens (JWT)` for secure user authentication and authorization.
- **TypeScript**: Enhancing codebase maintainability and scalability with statically typed `JavaScript`.


## Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/antudaa/Athlo_Blitz.git
   cd athlo-blitz
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

```sh
PORT = 5000
MONGODB_URI = your-mongodburi
JWT_SECRET = your-jwt-secret
```

## Scripts

Start the development server:

```sh
npm run start:dev
```


## Contributing

Contributions are welcome.! If you'd like to contribute to this project, please follow these steps:

- Fork the repository.
- Create your feature branch: `git checkout -b feature-name`.
- Commit your changes: `git commit -m 'Add some feature'`.
- Push to the branch: `git push origin feature-name`.
- Submit a pull request.