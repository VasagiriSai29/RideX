# Ridex 🚗  
### Real-Time Ride & Earnings Management Platform

Ridex is a full-stack ride tracking and earnings management web application built using **React (Vite)** and **Firebase**.  

It enables drivers or ride operators to manage riders, log rides, track payments, and monitor pending balances in real time through a clean and modern dashboard interface.

---

## 🚀 Live Capabilities

- 🔐 Google Authentication (Firebase Auth)
- 👤 Rider Management
- ➕ Add and manage rides
- 💰 Track ride payments and pending balances
- 📅 Daily ride tracking
- 📊 Real-time dashboard statistics
- 🔄 Firestore real-time synchronization
- 🧱 Scalable project structure

---

## 🧠 Problem It Solves

Independent drivers and small ride operators often manage payments manually using notebooks or spreadsheets.

Ridex provides:
- Centralized digital tracking
- Instant balance calculation
- Organized rider history
- Real-time updates across sessions

---

## 🏗 Architecture Overview

**Frontend**
- React (Vite)
- Component-based architecture
- Protected routing
- Context-based authentication state

**Backend**
- Firebase Authentication
- Firestore (NoSQL database)
- Real-time listeners (onSnapshot)

**Security**
- Auth-protected routes
- Session-based access control
- Firestore-based data isolation

---

## 📂 Project Structure

```
src/
 ├── auth/            # Authentication logic
 ├── components/      # Reusable UI components
 ├── pages/           # Route-level components
 ├── services/        # Firestore data services
 ├── firebase.js      # Firebase configuration
```

---

## 📊 Core Data Model

### Riders Collection
- id
- name
- phone
- createdAt

### Rides Collection
- riderId
- riderName
- date
- pickup
- drop
- amount
- paid
- createdAt

---

## 🎯 Technical Highlights

- Real-time Firestore synchronization
- Clean separation of concerns (services vs UI)
- ProtectedRoute implementation
- Optimized dashboard state using useMemo
- Scalable structure ready for MERN expansion
- Git-based version control with structured commits

---

## 🛠 Tech Stack

- React (Vite)
- Firebase Authentication
- Firestore Database
- React Router
- JavaScript (ES6+)
- Modern CSS

---

## 🔮 Planned Enhancements

- Rider-wise ride history page
- Monthly earnings analytics
- Export reports (CSV/PDF)
- Role-based access control
- Mobile-responsive optimization
- Cloud hosting deployment

---

## 📌 Development Approach

This project is being developed incrementally with structured Git commits to simulate real-world product evolution and engineering workflow.

---

## 👨‍💻 Author

**Sai Hemanth**  
Graduate Student – Computer Science  
Focused on building scalable, real-world web applications.

---

## ⭐ Why This Project Matters

Ridex demonstrates:

- Full-stack system thinking
- Authentication & session handling
- Real-time data modeling
- UI/UX design considerations
- Clean project architecture
- Version control discipline

