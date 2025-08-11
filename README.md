# 📄 DocuFlow

**DocuFlow** is a document workflow management tool designed for organizations to efficiently handle incoming documents.
It supports processing operations such as delegating, adding processors, returning, recalling, and marking completion,
while maintaining detailed processing history.

---

## 📑 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Architecture](#architecture)
* [Setup & Running](#setup--running)
* [Tech Stack](#tech-stack)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## 📖 Overview

**DocuFlow** streamlines document management and processing with an intuitive interface and clear role-based permissions.

Key capabilities include:

* Search and filter documents by multiple criteria (received date, status, type, urgency, confidentiality, etc.)
* View document details, attachments, and processing history
* Assign, delegate, add processors, return, recall, and mark completion
* Automatically log all processing actions
* Responsive design suitable for desktop and mobile

---

## ✨ Features

| Feature                         | Description                                                                 |
| ------------------------------- | --------------------------------------------------------------------------- |
| **Advanced filtering & search** | Filter by keyword, status, time range, urgency level, confidentiality, etc. |
| **Document detail view**        | Full metadata, attachments, and processing history                          |
| **Processing management**       | Delegate, add processors, return, recall, complete documents                |
| **History logging**             | Track user actions, notes, and deadlines                                    |
| **Real-time UI updates**        | Automatically sync document state and selection after actions               |
| **Role-based permissions**      | Restrict actions according to defined role hierarchy                        |

---

## 🏗 Architecture

* **Frontend**: React + Context API for state management (DocumentsContext handles all document-related API calls)
* **Backend**: Node.js + Express REST API providing CRUD and document workflow endpoints
* **Database**: MongoDB for storing documents, assignments, and processing history
* **Auth**: JWT-based authentication for all API requests
* **Communication**: Axios for HTTP requests between frontend and backend

---

## ⚙️ Setup & Running

### 1️⃣ Backend

```bash
cd backend
npm install
# Configure environment variables (.env) for DB, JWT_SECRET, etc.
npm run start
```

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm start
```

Access the application in your browser at: **[http://localhost:3000](http://localhost:3000)**

### Notes

* MongoDB must be installed and running
* Update `.env` with your database connection string
* Ensure a valid JWT token is stored in `localStorage` for API requests

---

## 🛠 Tech Stack

* **Frontend**: React, Context API, React Router, Axios
* **Backend**: Node.js, Express, Mongoose
* **Database**: MongoDB
* **Authentication**: JWT (Bearer tokens)
* **Code Style**: ESLint, Prettier (optional)

---

## 🤝 Contributing

1. Fork the repository and create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Implement and test your changes
3. Submit a Pull Request with a clear description
4. The reviewer will check and merge when approved

---

## 📜 License

No specific license yet. Consider adding a `LICENSE` file (e.g., MIT License) to allow open-source usage.

---

## 📬 Contact

* **Author**: *Nguyen Dac Cuong*
* **Email**: *[nguyendaccuong1103@gmail.com](mailto:nguyendaccuong1103@gmail.com)*
* **GitHub**: [daccuong-uit-personal/DocuFlow](https://github.com/daccuong-uit-personal/DocuFlow)

