# Hodee Interior

### End-to-End Home Design and Construction Platform

Hodee Interior is a full-stack web application designed to connect clients with interior designers, architects, and construction professionals. It provides a seamless platform for users to explore services, submit consultation requests, and for admins to manage projects and client enquiries efficiently.

---

## Features

### Client Side

* Submit enquiry form (Name, Email, Phone/WhatsApp, Service, Message)
* View latest projects uploaded by admin
* Responsive and user-friendly interface
* WhatsApp integration (click-to-chat)
* Direct contact via phone and social media (Instagram)

### Admin Panel

* Admin login authentication
* View all client enquiries
* Delete enquiries
* Upload projects (title, description, image, status)
* Manage project listings
* Dashboard analytics (total and service-wise enquiries)

### Backend Features

* REST API using Node.js & Express.js
* PostgreSQL database integration
* Image upload using Multer
* Email alerts using Nodemailer
* CSV export of enquiry data
* WhatsApp auto-message integration

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Libraries & Tools

* Multer (file uploads)
* Nodemailer (email notifications)
* Git & GitHub (version control)
* Postman (API testing)

### Integrations

* WhatsApp (Click-to-Chat)
* Instagram (social link)
* Phone (click-to-call)

---

## 📁 Project Structure

```
HODEEINTERIOR/
│
├── public/                # Client website
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── uploads/
│   ├── index.html
│   └── success.html
│
├── admin/                 # Admin panel
│   ├── login.html
│   ├── dashboard.html
│   ├── enquiries.html
│   └── projects.html
│
├── server/                # Backend
│   ├── server.js
│   └── db.js
│
├── database/
│   └── schema.sql
│
├── package.json
└── README.md
```



### 5️⃣ Open Application

Client Website:

```
http://localhost:3000
```

Admin Panel:

```
http://localhost:3000/admin/login.html
```

---

## 🔐 Default Admin Credentials

```
Email: admin@hodeeinterior.com
Password: admin123
```

---

## 📡 API Endpoints

### Enquiries

* `POST /api/enquiry` → Submit enquiry
* `GET /api/enquiries` → Fetch all enquiries
* `DELETE /api/enquiry/:id` → Delete enquiry
* `PUT /api/enquiry/:id` → Update enquiry status

### Projects

* `POST /api/projects` → Upload project
* `GET /api/projects` → Fetch projects
* `DELETE /api/projects/:id` → Delete project

### Dashboard

* `GET /api/dashboard` → Analytics data

### Export

* `GET /api/export` → Download CSV

---

## 🌐 Deployment

* Frontend → Vercel
* Backend → Render
* Database → Supabase (PostgreSQL)
* Domain → hodeeinterior.com

---

## 🔄 System Flow

Client submits enquiry
→ Data stored in PostgreSQL
→ Email notification sent to admin
→ Admin views enquiry
→ Admin contacts client via WhatsApp
→ Admin uploads project
→ Project displayed on homepage

---
📦 All Dependencies

The project uses the following Node.js dependencies:

express – Backend framework for building APIs
cors – Enables cross-origin resource sharing
body-parser – Parses incoming request bodies
pg – PostgreSQL database client
multer – Handles file/image uploads
cloudinary – Cloud-based image storage
multer-storage-cloudinary – Cloudinary integration with Multer
nodemailer – Sends email notifications
resend – Modern email service (alternative to Nodemailer)
dotenv – Manages environment variables

## 💡 Future Enhancements

* JWT-based secure admin authentication
* Role-based access control
* Payment integration for services
* AI-based design recommendations
* Mobile application version

---

## 👨‍💻 Author

**Haidar Ali**


---

## ⭐ Support

If you found this project useful, please ⭐ the repository and share it!

---
