# Backend BankHub

A robust backend service for a banking application, built with Node.js, Express, TypeScript, and MongoDB. This service handles user authentication, account management, and secure money transfers.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **Account Management**: Create accounts, view balances, and manage user details.
- **Transactions**: Secure money transfers between accounts with transaction history.
- **Security**: Implements Helmet for headers, CORS configuration, and input validation.
- **Email Notifications**: Integration with Nodemailer for sending transactional emails (e.g., welcome emails).

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Email Service**: Nodemailer (Gmail OAuth2)

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: v14.x or higher
- **pnpm**: v6.x or higher (or npm/yarn)
- **MongoDB**: A local or cloud MongoDB instance (e.g., MongoDB Atlas)

## ⚙️ Configuration

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd backend-bankhub
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=3000
    DB_URI=your_mongodb_connection_string
    JWT_SECRET=your_strong_jwt_secret

    # Email Configuration (for Nodemailer)
    EMAIL_USER=your_email@gmail.com
    CLIENT_ID=your_oauth_client_id
    CLIENT_SECRET=your_oauth_client_secret
    REFRESH_TOKEN=your_oauth_refresh_token
    ```

## ▶️ Running the Application

### Development Mode

Run the server with hot-reloading using `tsx` and `nodemon`:

```bash
pnpm dev
```

The server will start at `http://localhost:3000`.

### Production Build

Build the TypeScript code and start the production server:

```bash
pnpm build
pnpm start
```

### Linting

Run ESLint to check for code quality issues:

```bash
pnpm lint
```

## 🔌 API Endpoints

All API routes are prefixed with `/api/v1`.

### Authentication (`/auth`)

| Method | Endpoint    | Description            | Body Parameters             |
| :----- | :---------- | :--------------------- | :-------------------------- |
| POST   | `/register` | Register a new user    | `name`, `email`, `password` |
| POST   | `/login`    | Login an existing user | `email`, `password`         |

### Accounts (`/account`)

_Requires Authentication Header: `Authorization: Bearer <token>` or Cookie: `token`_

| Method | Endpoint       | Description                | Body Parameters |
| :----- | :------------- | :------------------------- | :-------------- |
| POST   | `/create`      | Create a new bank account  | -               |
| GET    | `/`            | Get user's account details | -               |
| GET    | `/balance/:id` | Get account balance        | -               |

### Transactions (`/transaction`)

_Requires Authentication Header: `Authorization: Bearer <token>` or Cookie: `token`_

| Method | Endpoint          | Description              | Body Parameters                      |
| :----- | :---------------- | :----------------------- | :----------------------------------- |
| POST   | `/create`         | Transfer money           | `toAccountId`, `amount`, `pin`       |
| POST   | `/admin/initiate` | Admin initiated transfer | `toAccountId`, `amount` (Admin only) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
