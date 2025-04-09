# Learning Management System Backend (NestJS)

Backend system for a Learning Management System ( LMS ) built with **NestJS**, supporting **RESTful API**, **user authentication**, and **Docker Compose** for container orchestration.

## 💡 About the project

This project aims to provide a scalable API for LMS. Key features include:

- User management (CRUD)
- Course management
- Enrollment handling
- Authentication and role-based access control

## 📦 Technologies Used
- Nestjs ( Backend Framework )
- TypeScript
- PostgreSQL ( Relational Database: created by Docker )
- Redis ( In-memory Data: created by Docker )
- Prisma ( ORM )

## ✅ Requirement
- Docker
- Node.js ( version 18 up )

## 🛠️ How to install
1. Clone repository
   ```bash
   git clone https://github.com/ntwsam/learning-management-backend-nestjs.git
   cd learning-management-backend-nestjs
   ```
2. setting environment
   - create `.env` file 
      example:
     
       ```bash
       - DATABASE_URL="postgresql://ntwsam:root@postgres:5432/lms_nestjs?schema=public"
       - REDIS_HOST=redis
       - REDIS_PORT=6379
       - ADMIN_SECRET=admin_secret
       - JWT_SECRET=jwt_secret
       - JWT_REFRESH_SECRET=jwt_refresh_secret
       ```
3. run docker
   - `PostgreSQL` and `Redis` will running in Container
     
     ```
     docker compose up -d --build
     ```
5. run prisma
   
   ```
   npx prisma migrate dev
   npx prisma generate
   ```
6. API Endpoints
   - auth
     - `POST /auth/signup` : register new user
     - `POST /auth/admin/signup` : register new admin
     - `POST /auth/login` : logged in
     - `POST /auth/logout` : logged out
     - `POST /auth/refresh` : generate new accessToken and new refreshToken(rotation)
   - user
     - `GET /users/myAccount` : check my data
     - `PATCH /users/myAccount` : update my data
     - `GET /users` : get all users ( admin only )
     - `GET /users/:id` : get user by id ( admin only )
     - `PATCH /users/:id` : update user by id ( admin only )
     - `DELETE /users/:id` : delete user by id ( admin only )
   - courses
     - `GET /courses` : check all courses
     - `GET /courses/:id` check course by id
     - `GET /courses/myCourse` : check my course
     - `POST /courses/create` : create new course ( teacher only )
     - `PATCH /courses/:id` : update course ( teacher ( course advisor ) and admin only )
     - `DELETE /courses/:id` : delete course ( teacher ( course advisor ) and admin only )
   - enrollments
     - `POST /enrollments` : create new enrollment ( student only )
     - `DELETE /enrollments/:id` : delete enrollment ( student ( enroll owner ), teacher ( course advisor ) and admin only )
     - `GET /enrollments/myEnrollment`: get my enrollment
7. Authentication
   - use JWT send access token to Header `Authorization: Bearer <accessToken>`
   - keep refresh token in cookie HttpOnly
8. Role-Based Access Control
   - use authorize role ( 'admin', 'instructor', 'student' ) to access API Endpoints
## 🧑‍💻 Author
  Nuntawat Jongtaweesuksan
   
