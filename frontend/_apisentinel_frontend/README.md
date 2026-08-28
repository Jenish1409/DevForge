# ApiSentinel - Frontend

This is the frontend dashboard for **ApiSentinel**, a developer platform to monitor REST APIs and visualize their health, response times, and incident logs.

The frontend is a single-page application (SPA) built for high performance and a modern aesthetic, using Recharts for graphing ping history.

## Technologies Used

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Date/Time Handling**: Moment & Luxon

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or your preferred package manager (yarn, pnpm, etc.)

## Setup & Configuration

1. **Clone the repository** and navigate to the `frontend` directory.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure API Endpoint**:
   Ensure the frontend knows where the backend is hosted. By default, it expects the backend to run on `http://localhost:8080`.
   If you deploy the backend or run it on a different port, update the API configuration, usually located in a `.env` file (e.g., `VITE_API_URL`) or directly within `src/services/api.js` to point to the backend's URL.

## Running the Application

To start the Vite development server with hot-module replacement (HMR):

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be generated in the `dist/` directory, ready to be served by any static file server (Nginx, Apache, etc.).

## Deployment

This frontend is optimized for seamless deployment on platforms like **Vercel** or **Netlify**. 
A `vercel.json` file is already included for automatic routing configuration on Vercel. 
Simply link the repository to your Vercel project, set the root directory to `frontend`, and configure your environment variables for the production backend URL.
