#  PrimeTrade.ai - Task Management System

A **full-stack task management application** with **role-based access control**, built using **Node.js (Express)** for the backend and **React** for the frontend.

---

##  Features

###  Backend Features
- **User Authentication:** Secure JWT-based registration and login  
- **Role-Based Access Control:** Separate permissions for **User** and **Admin** roles  
- **CRUD Operations:** Full Create, Read, Update, Delete for **tasks** and **users**  
- **API Versioning:** Organized and maintainable endpoint structure (`/api/v1/...`)  
- **Input Validation:** Strong regex-based validation for all inputs  
- **Security:** 
  - Password hashing with **bcrypt**
  - **JWT** authentication for protected routes
  - Input sanitization  
- **Database:** **SQLite3** with a properly normalized schema  
- **Pagination:** Efficient server-side pagination for large datasets  
- **Error Handling:** Centralized and consistent error management  

---

###  Frontend Features
- **Responsive Design:** Mobile-first, adaptive layout  
- **User Authentication:** Login and register using JWT tokens  
- **Task Management:** Create, view, edit, and delete tasks  
- **User Management:** Admin dashboard for managing users  
- **Search & Filtering:** Real-time search with **debouncing**  
- **Pagination:** Smooth client-side pagination for tasks and users  
- **Modern UI:** Clean, professional interface with subtle CSS animations  
- **Role-Based UI:** Dynamic views based on user role (User/Admin)  

---

##  Tech Stack

###  Backend
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** SQLite3  
- **Authentication:** JWT, bcryptjs  
- **Security:** CORS, dotenv, input sanitization  

###  Frontend
- **Framework:** React 18  
- **Routing:** React Router DOM  
- **HTTP Client:** Axios  
- **Styling:** Plain CSS (no frameworks)  
- **State Management:** React Context API  
