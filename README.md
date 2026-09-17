# JalVigyan | Household Water Use & Leak Detection Sentinel
### ANAVANDI 2026 Hackathon Selection Round Prototype (Track 2: Water and Coast — Challenge SC-06)

[![Go Version](https://img.shields.io/badge/Go-1.27-00ADD8?style=flat&logo=go)](https://go.dev/)
[![React Version](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Pure_Go_No_CGO-003B57?style=flat&logo=sqlite)](https://modernc.org/sqlite)

---

## 1. Problem Statement Overview (SC-06)

* **Problem**: In India, households connected to municipal water networks (such as the Kerala Water Authority - KWA) receive bills bimonthly (every 60 days). Concealed leaks, such as faulty toilet cistern flapper valves, overhead tank overflow pipes, or subterranean fractured joints, waste hundreds of liters every day and are only discovered when a massive penalty bill arrives.
* **Build Goal**: A tool for recording meter readings, viewing consumption patterns, and warning users when usage suggests an active leak. Normalizes and compares usage against statistically matched cohorts so warnings are meaningful.
* **Core Evaluation Deliverable**: A working logger and anomaly detector that finds an injected leak without flagging normal changes.

---

## 2. Key Features

### 1. High-Precision Water Meter Logger
* **Dual-Unit Input**: Supports logging in Liters or cubic meters ($m^3$) directly from analog rotary or digital pulse meters.
* **Defensive Dial Validation**: Rejects rollback readings (where input is lower than previous recorded reading) and computes incremental delta and flow rate in real time.
* **Batch CSV Ingestion**: Provides full support for uploading historical spreadsheets and downloading a standardized CSV template.

### 2. Diurnal Consumption & Pattern Analytics
* **30-Day Trend Visualizer**: High-resolution Composed Chart tracking daily consumption alongside Minimum Night Flow (MNF).
* **24-Hour Diurnal Demand Curve**: Displays domestic morning peak (06:00 to 09:00 AM), afternoon moderate flow, evening peak (18:00 to 21:00), and quiescent night flow (01:00 to 04:30 AM).

### 3. Minimum Night Flow (MNF) & Hampel Anomaly Detector
* **Quiescent Night Gate**: Evaluates flow during 01:00 - 04:30 AM. Normal domestic households exhibit intermittent or 0 L/h flow during these hours because residents are asleep. A persistent flow $\ge 5.0$ L/h across 2 consecutive nights flags a confirmed leak.
* **Hampel Filter (Median Absolute Deviation)**:
  $$\hat{\sigma} = 1.4826 \times \text{Median}(|x_i - \text{Median}(X)|)$$
  Unlike standard deviation, MAD cannot be distorted by high-demand laundry or party days.
* **Zero False Alarms**: A daytime surge (such as Sunday laundry of +340 L) is recognized as `ELEVATED_NORMAL` with zero leak alerts because night flow safely returns to 0 L/h.

### 4. Demographic Cohort Benchmarking
* **Occupancy Normalization**: Evaluates consumption in Liters Per Capita per Day (LPCD).
* **Ward Cohort Matching**: Compares user consumption against 248 demographic peers in the municipality.
* **National Benchmark**: Calibrated against the Ministry of Housing and Urban Affairs / CPHEEO benchmark of **135 LPCD**.

### 5. Interactive Reviewer Leak Injection Suite
* A built-in test cockpit specifically created for hackathon reviewers to test:
  * Scenario 1: **Toilet Cistern Flapper Leak** (+18 L/h continuous 24/7 trickle -> Alarm Triggered).
  * Scenario 2: **Concealed Pipe Joint Crack** (+45 L/h continuous fracture -> Critical Alarm Triggered).
  * Scenario 3: **Sunday Laundry Day** (+340 L daytime volume -> Correctly Filtered with 0 Alarms).
  * Scenario 4: **Visiting Relatives Event** (+215 L/day daytime -> Correctly Filtered with 0 Alarms).
  * Scenario 5: **Baseline Reset** (Restores pristine 30-day baseline).
* Returns a live **Verification Scorecard** with 100% Sensitivity (True Positive Rate) and 100% Specificity (True Negative Rate).

### 6. Interactive 8-Slide Pitch Deck
* Built directly into the application and accessible via the top navigation bar or `/presentation`.
* Strictly follows the exact 8-slide order required on page 6 of the ANAVANDI selection round brochure.

### 7. Production Readiness
* **Custom Domain & Favicon**: Includes SVG water meter favicon and full DNS configuration documentation.
* **Compliance Pages**: Complete Privacy Policy (`/privacy`) and Terms of Service (`/terms`).
* **Design Standards**: Clean engineering aesthetic. No purple gradients, no pill buttons, no fake counters, no emoji icons, and no em dashes.

---

## 3. Technology Stack

* **Backend**: Go (Go 1.22+ / 1.27) using the standard library `net/http` router.
* **Database**: SQLite powered by `modernc.org/sqlite` (100% Pure Go, zero CGO compiler required, runs natively on Windows, Linux, and macOS).
* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS v4.
* **Visualizations**: Recharts SVG charting library.
* **Resilience**: Dual-engine architecture. If the backend is unreachable or the application is opened from a static review export, the client-side engine transparently executes identical statistical math.

---

## 4. Quick Start Guide

### Option 1: Run with Go (Single Service)

Build the frontend bundle and run the unified Go server:

```powershell
# 1. Build client static bundle
cd client
npm install
npm run build
cd ..

# 2. Run Go server
go run main.go
```
Open **http://localhost:8085** in your browser.

---

### Option 2: Run in Development Mode (Hot Reload)

```powershell
# Terminal 1: Backend
go run main.go

# Terminal 2: Frontend
cd client
npm run dev
```
Open **http://localhost:5173** in your browser.

---

### Option 3: Run with Docker

```bash
docker compose up --build
```
Open **http://localhost:8085** in your browser.

---

## 5. Verification & Unit Tests

Run the automated leak detector test suite to verify that leaks are identified while normal domestic spikes are rejected:

```powershell
go test ./server/detector/... -v
```

Expected output:
```text
=== RUN   TestDetector_FindsLeakWithoutFlaggingNormalChanges
--- PASS: TestDetector_FindsLeakWithoutFlaggingNormalChanges (0.00s)
=== RUN   TestDetector_CohortStats
--- PASS: TestDetector_CohortStats (0.00s)
PASS
ok      water-use-sentinel/server/detector      0.521s
```

---

## 6. Project Directory Structure

```text
├── client/                     # React + Vite + Tailwind Frontend
│   ├── public/
│   │   └── favicon.svg         # SVG Water Meter Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Municipal header & status indicator
│   │   │   ├── Dashboard.tsx          # Summary KPIs, 30-day trend, 24h curve
│   │   │   ├── MeterLogger.tsx        # Reading log, delta check, CSV import
│   │   │   ├── CohortComparison.tsx   # Peer distribution vs CPHEEO 135 LPCD
│   │   │   ├── LeakInjectionSuite.tsx # Reviewer verification test harness
│   │   │   ├── PresentationDeck.tsx   # 8-slide pitch deck (Page 6 format)
│   │   │   ├── Legal.tsx              # Privacy Policy & Terms of Service
│   │   │   └── DeployGuideModal.tsx   # Domain & Vercel deployment modal
│   │   ├── services/
│   │   │   ├── api.ts                 # REST API client with dual fallback
│   │   │   └── engine.ts              # Resilient client-side engine
│   │   ├── types/                     # Shared TypeScript interfaces
│   │   ├── App.tsx                    # Main state machine & routing shell
│   │   └── index.css                  # Tailwind v4 utility styles
│   └── vite.config.ts
├── server/                     # Go Backend Services
│   ├── db/
│   │   └── database.go         # SQLite store, migration & 30-day seeder
│   ├── detector/
│   │   ├── detector.go         # Minimum Night Flow & Hampel MAD engine
│   │   └── detector_test.go    # Unit tests for leak detection vs spikes
│   ├── handlers/
│   │   └── handlers.go         # REST API endpoints
│   ├── models/
│   │   └── models.go           # Data structures & schemas
│   └── main.go                 # Backend launcher
├── Dockerfile                  # Multi-stage production container
├── docker-compose.yml          # Local container orchestration
├── main.go                     # Root entrypoint
└── README.md                   # Comprehensive documentation
```

---

## 7. ANAVANDI 2026 Submission Summary

* **Track**: Track 2 (Water and Coast)
* **Challenge**: SC-06 Household water use and leak detection
* **Institution**: Amal Jyothi College of Engineering (AJCE), Kerala
* **Team Members**: 2 Members
* **Official Project Update Form**: `forms.gle/iPRFq7zTfPL84Dqq9`
