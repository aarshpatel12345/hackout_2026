# CarbonTrace 🌱

**Decarbonize Today. A Greener Tomorrow.**

CarbonTrace is a comprehensive environmental sustainability and de-carbonization tracking platform. It empowers manufacturing, energy, and logistics companies to track their carbon footprint, manage resource consumption, optimize waste management, and strategically plan their path to Net Zero using AI-driven insights.

## ✨ Key Features

- **📊 Centralized Dashboard:** A unified view of your organization's sustainability metrics, emissions tracking, and resource consumption.
- **🤖 AI Insights:** Leverages Google's Gemini AI to analyze your baseline data and provide actionable, intelligent recommendations for emission reduction.
- **💰 ROI & Cost Calculator:** Evaluate the financial viability of sustainability interventions. Calculate payback periods for upgrading machinery, installing renewable energy sources, and more.
- **♻️ Waste Reusability Exchange:** Track your waste types and disposal methods, and explore ways to implement circular economy principles by reusing or selling waste materials.
- **🔥 Emission Leak Detector:** Identify inefficiencies and hidden emission leaks within your core operational processes.
- **🏭 Comprehensive Baseline Onboarding:** Set up detailed business profiles encompassing energy consumption, raw materials, waste management, processes, and budget constraints. 

## 🛠️ Tech Stack

**Frontend (Client)**
- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM

**Backend (Server)**
- **Environment:** Node.js
- **Framework:** Express.js
- **AI Integration:** Gemini API (Google)
- **Authentication:** JWT / Custom Auth

---

## 🚀 Project Setup Guidelines

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (if running a local database)
- Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/carbon_trace.git
cd carbon_trace
```

### 2. Backend Setup (`/server`)
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and configure your environment variables. You will likely need:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup (`/client`)
1. Open a new terminal window and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.
