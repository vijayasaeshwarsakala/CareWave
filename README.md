# CAREWAVE – Smarter Queues, Faster Care
> **Next-Generation Healthcare Queue and OPD Appointment Management Platform**

CareWave is a full-stack health-tech web application engineered to eliminate waiting-room congestion, reduce uncertainty, and optimize patient flow across Indian hospitals.

---

## 🌟 1. Project Overview & Motivation

Long wait times, crowded OPD corridors, and unpredictable doctor delays cause high anxiety for patients and caregivers across India. CareWave solves this by providing:

1. **Digital 7-Step Appointment Booking**: Filter by city, choose premier Indian hospitals, select medical departments and specialists, and book an exact consultation slot.
2. **Live Simulated OPD Queue Tracking**: Dynamic digital token system displaying your token number, current serving token, number of patients ahead, and estimated wait times.
3. **Queue State Transitions**: Visual tracking through `WAITING`, `ALMOST YOUR TURN`, and `YOUR TURN` states.
4. **Interactive Queue Simulator**: In-app "Simulate Next Patient" action allowing evaluators, professors, or startup judges to test live queue progression on demand.
5. **Centralized Patient Dashboard**: Personalized health portal with upcoming visits, active queue tokens, visit history, and instant alerts.

---

## 🏗️ 2. Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    CAREWAVE ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   [React + Vite Frontend] (Port 5173)                       │
│     ├── AuthContext (JWT Session & 1-Click Demo Login)      │
│     ├── 7-Step Guided Stepper Appointment Booking Flow      │
│     ├── Live Queue Tracker (Token, Ahead, Wait Minutes)     │
│     └── Indian Hospital Directory & Real-time Dashboard    │
│                           │                                 │
│                     REST / Axios (Bearer JWT)               │
│                           ▼                                 │
│   [Node.js + Express Backend] (Port 5000)                   │
│     ├── /api/auth (Register, Login, Me, Demo-Login)         │
│     ├── /api/hospitals & /api/hospitals/:id/doctors         │
│     ├── /api/appointments (Create, List, Cancel)            │
│     ├── /api/queue/:id (Status, Simulate Advance)           │
│     └── /api/notifications                                  │
│                           │                                 │
│                           ▼                                 │
│   [Dual-Mode Resilient Database Layer]                      │
│     ├── MongoDB / Mongoose (when URI is provided)           │
│     └── Auto-Fallback Resilient Storage Engine (Zero-Setup) │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Highlights

- **Frontend**:
  - React 18 & Vite (Ultra-fast HMR)
  - Tailwind CSS (Healthcare Teal & Emerald Palette)
  - React Router v6
  - Axios (JWT Bearer token interceptor)
  - Lucide React (Heart + ECG pulse brand icons)

- **Backend**:
  - Node.js & Express.js (Modular MVC REST API)
  - JWT Authentication & bcrypt password hashing
  - CORS and global error handling middleware

- **Database**:
  - MongoDB & Mongoose-ready schema models (`User`, `Hospital`, `Doctor`, `Appointment`, `Queue`, `Notification`).
  - **Zero-Setup Resilient Engine**: Automatically connects to local MongoDB or MongoDB Atlas when available. If MongoDB is offline, it activates an embedded persistent storage engine so the app runs instantly out of the box with zero errors!

---

## 📂 3. Project Structure

```
TecExpo/
├── backend/
│   ├── config/
│   │   └── db.js                 # Dual-mode DB connection & fallback
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, demo access
│   │   ├── hospitalController.js # Hospitals, departments, doctors
│   │   ├── appointmentController.js # Booking, list, cancellation
│   │   ├── queueController.js    # Live queue tracking & demo advance engine
│   │   └── notificationController.js # In-app alerts & stats
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification
│   │   └── errorMiddleware.js    # Global error response handler
│   ├── models/
│   │   ├── User.js               # Patient schema
│   │   ├── Hospital.js           # Indian hospital schema
│   │   ├── Doctor.js             # Doctor profile schema
│   │   ├── Appointment.js        # Appointment records
│   │   ├── Queue.js              # Token and position tracker
│   │   └── Notification.js       # Patient alerts
│   ├── routes/                   # Express routes
│   ├── seed/
│   │   ├── indianHospitals.json  # Comprehensive Indian hospitals dataset
│   │   └── seeder.js             # Auto-seeder on boot
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Heart + ECG heartbeat favicon
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProtectedRoute, DisclaimerBanner
│   │   ├── context/              # AuthContext (state & session management)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Hero, value props, hospital showcase
│   │   │   ├── LoginPage.jsx     # Login + 1-Click Demo Login button
│   │   │   ├── RegisterPage.jsx  # Sign-up with form validation
│   │   │   ├── DashboardPage.jsx # Patient overview, stats & active token
│   │   │   ├── BookingPage.jsx   # 7-Step guided appointment booking
│   │   │   ├── QueuePage.jsx     # Visual live queue tracker with simulator
│   │   │   ├── MyAppointmentsPage.jsx # Past & upcoming bookings list
│   │   │   └── HospitalsPage.jsx # Searchable Indian hospitals directory
│   │   ├── services/             # Axios API client with token interceptors
│   │   ├── App.jsx               # Routes setup & protected route guards
│   │   ├── index.css             # Tailwind setup & modern health-tech tokens
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚡ 4. Windows Setup & Run Instructions

### Prerequisites
- **Node.js**: v18+ (Tested on v22.19.0)
- **npm**: v9+ (Tested on v10.9.3)
- Optional: MongoDB local daemon or MongoDB Atlas URI (if not running, CareWave automatically uses its built-in persistent store).

### Step 1: Start Backend Server
Open PowerShell / Terminal:
```powershell
cd backend
npm install
npm run dev
```
The backend starts on `http://localhost:5000`.

### Step 2: Start Frontend Dev Server
Open a second PowerShell / Terminal window:
```powershell
cd frontend
npm install
npm run dev
```
Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🔑 5. Demo Credentials

For instant evaluation during college presentations or interviews:

- **1-Click Demo Login**: Click the **"1-Click Demo Login"** button on the Navbar or Login page.
- **Demo Patient Email**: `rahul.patient@carewave.in`
- **Demo Password**: `CareWave@123`
- Pre-populated with:
  - Apollo Hospitals Jubilee Hills consultation
  - Attending: Dr. Priya Sharma (General Medicine)
  - Active Queue Token: `A-12`

---

## 🏥 6. Indian Hospitals Dataset Included

CareWave includes realistic records for leading Indian healthcare facilities:
- **Apollo Hospitals**: Jubilee Hills (Hyderabad), Bannerghatta Road (Bengaluru), Greams Road (Chennai)
- **AIIMS**: Ansari Nagar (New Delhi), Bibinagar (Hyderabad)
- **Fortis Hospitals**: Bannerghatta Road (Bengaluru), Vasant Kunj (Delhi)
- **Manipal Hospital**: Old Airport Road (Bengaluru)
- **KIMS Hospitals**: Secunderabad (Hyderabad)
- **Yashoda Hospitals**: Somajiguda (Hyderabad)
- **CARE Hospitals**: Banjara Hills (Hyderabad)
- **Narayana Health City**: Bommasandra (Bengaluru)

Associated with 20+ demo specialist doctors across Cardiology, Neurology, General Medicine, Orthopedics, Pediatrics, and Dermatology.

---

## 📡 7. REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new patient account | Public |
| `POST` | `/api/auth/login` | Authenticate with email & password | Public |
| `POST` | `/api/auth/demo-login` | Instant demo login for evaluation | Public |
| `GET` | `/api/auth/me` | Get current logged-in patient session | Private |

### Hospitals & Doctors (`/api/hospitals`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/hospitals` | List all hospitals (with `city`, `department`, `search`) | Public |
| `GET` | `/api/hospitals/:id` | Get single hospital details | Public |
| `GET` | `/api/hospitals/:id/departments`| List hospital departments | Public |
| `GET` | `/api/hospitals/:id/doctors` | Get doctors filtered by department | Public |

### Appointments (`/api/appointments`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/appointments` | Book appointment & generate queue token | Private |
| `GET` | `/api/appointments` | Get user's upcoming & past appointments | Private |
| `GET` | `/api/appointments/:id` | Get specific appointment details | Private |
| `PUT` | `/api/appointments/:id/cancel` | Cancel upcoming appointment | Private |

### Queue Engine (`/api/queue`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/queue/:appointmentId` | Fetch live simulated queue token & wait time | Public/Private |
| `POST` | `/api/queue/:appointmentId/simulate-advance` | Advance queue simulation (next token called) | Public/Private |

---

## ⚠️ 8. Academic & Demonstration Disclaimer

> **Hospital information shown for demonstration purposes.** CareWave is an academic MVP and prototype. CareWave is not officially affiliated with the hospitals listed unless explicitly stated. Doctor schedules, consultation slots, and queue positions are realistically simulated for demonstration and academic evaluation.

---

## 🔮 9. Future Enhancements

- **AI Waiting-Time Prediction**: Incorporating an ML regression model trained on historical OPD consultation durations, emergency surge factors, and doctor pace.
- **WhatsApp / SMS Gateway**: Integrating Twilio or Gupshup for automated WhatsApp token alerts when 2 patients remain ahead.
- **Hospital Doctor Portal**: Real-time tablet interface for doctors to call tokens and log consultation completion.
