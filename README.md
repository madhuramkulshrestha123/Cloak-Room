# 🕵️‍♂️ Cloak-Room

Cloak-Room is an **Anonymous ChatRoom Generator** that enables **real-time**, **secure**, and **scalable** chat functionality using multi-server architecture. Built using **Next.js**, **Socket.io**, **Kafka**, and **Docker**, it ensures fast, distributed, and reliable anonymous messaging...

---

## ✨ Features

* 🔒 Anonymous, secure room creation
* 💬 Real-time chat with WebSocket (Socket.io)
* 🌐 Multi-server scalability using Apache Kafka
* 🚀 Dockerized backend for containerized deployment
* 🧠 Intelligent Room Management
* 🎨 Clean UI with TailwindCSS
* ⚿ Authentication using Google

---

## 🧽 Guide – How It Works

1. **Get Signed Up**
   Sign in with your Google account to begin.
   
   ![Step 1](https://github.com/user-attachments/assets/e65df86c-a420-4550-aeb8-202d532a827e)


3. **Create or Choose a Chat Room**
   Click on `"Create Chat"` or select from existing chat rooms.
   
![Step 3](https://github.com/user-attachments/assets/b57154e3-a1e9-47de-bdca-f4575954e48f)

5. **Share & Chat**
   Click the chat, copy the link, paste it into any browser, and start chatting anonymously.
   
![Step 2](https://github.com/user-attachments/assets/a6eae40d-ca3d-4d24-b61e-23e59c2535c4)

---

## 🚀 Getting Started

### 📦 Frontend

1. **Clone the repo & move into project folder**

   ```bash
   git clone https://github.com/madhuramkulshrestha123/cloak-room.git
   cd cloak-room/frontend
   ```

2. **Setup your `.env` file**

   Create a `.env` file in the `frontend` folder and set your credentials (e.g., NEXTAUTH\_SECRET, NEXTAUTH\_URL, etc.).

3. **Install dependencies & run the dev server**

   ```bash
   npm install
   npm run dev
   ```

---

### ⚙️ Backend

1. **Initialize Docker**

   Make sure [Docker](https://www.docker.com/products/docker-desktop) is installed and running.

2. **Setup PostgreSQL, Redis, Kafka with Docker**

   Ensure your Docker Compose or containers for **PostgreSQL**, **Redis**, and **Kafka** are up and running.

3. **Run the backend server**

   Navigate to the backend folder and start your Node.js/Express/Koa server:

   ```bash
   cd backend
   npm install
   npm start
   ```

---

## 🛠️ Tech Stack

### 📚 Frameworks & Libraries

* **Next.js** – React Framework
* **TypeScript** – Static Typing
* **Socket.io** – Real-time bidirectional communication

### 🖌️ UI & Styling

* **TailwindCSS** – Utility-first CSS

### 📃 Database & Messaging

* **PostgreSQL** – Primary database
* **Redis** – Caching and Pub/Sub
* **Apache Kafka** – Message broker for distributed messaging

### 🐳 DevOps & Infrastructure

* **Docker** – Containerization for scalable deployment
* **Docker Compose** – Multi-container orchestration

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📬 Contact

Feel free to reach out via 
- [LinkedIn](https://www.linkedin.com/in/ojaswigahoi/) [Ojaswi Gahoi]
- [LinkedIn](https://www.linkedin.com/in/madhuram-kulshrestha-24593a251/) [Madhuram Kulshrestha]

or open an issue.

---
## 🙌 Team

This project is a team collaboration by:

- **Ojaswi Gahoi** — [GitHub](https://github.com/ojaswi2c9t)
- **Madhuram Kulshrestha** — [GitHub](https://github.com/madhuramkulshrestha123) 
