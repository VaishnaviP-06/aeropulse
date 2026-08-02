<img width="1905" height="964" alt="Cinematic Intro" src="https://github.com/user-attachments/assets/9da04205-f678-44f4-9cad-fa74f57a12a1" /><div align="center">

# ✈️ AeroPulse

### Aviation Operational Intelligence Dashboard

A premium aviation command center experience designed to visualize airport operations through interactive analytics, real-time monitoring, and intelligent operational insights.

AeroPulse transforms complex aviation data into a unified operational dashboard where airport teams can monitor flights, passenger movement, delays, weather conditions, revenue performance, and live events.

Built for **Frontend Wars 2026** — focused on creating a next-generation Airport Operations Center experience using modern frontend technologies, cinematic animations, and enterprise SaaS design principles.

<br/>

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/Animation-GSAP-88CE02)](https://gsap.com/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-FF6384)](https://recharts.org/)
[![Lucide React](https://img.shields.io/badge/Icons-Lucide%20React-black)](https://lucide.dev/)

<br/>

[Live Demo](https://aeropulse-khaki.vercel.app/)

</div>


---

# Overview

AeroPulse is a futuristic **Airport Operations Intelligence Platform** that transforms complex aviation operations into a centralized visual command center.

Instead of monitoring disconnected systems, airport teams can:

- Monitor flight performance
- Analyze delays
- Track passenger movement
- Understand revenue trends
- Observe weather conditions
- Monitor live operational events

Everything is presented through a premium aviation-inspired interface designed for fast operational decision-making.

---

# 🚀 Key Features


## 🎬 Cinematic Aviation Introduction

AeroPulse begins with an immersive airport experience.

The experience flow:

```
Cloud Environment

        ↓

Aircraft Approaches Camera

        ↓

Cinematic Transition

        ↓

AeroPulse Command Center
```

Powered by:

- GSAP animations
- Custom aviation assets
- Smooth transitions
- Premium landing experience


---

## 🛰️ Command Center Dashboard

The central operational workspace of AeroPulse.

Provides:

- Airport overview
- Flight performance summary
- System health monitoring
- Critical operational insights
- Real-time status visibility


The Command Center acts as the primary decision-making interface for airport operations.


---

## ✈️ Flight Operations Analytics

Monitor complete flight performance through interactive analytics.

Tracks:

- Total flights
- On-time percentage
- Delayed flights
- Cancelled flights
- Flight status distribution


Example:

```
Flights Today

12,480 Total Flights

94% On Time
5% Delayed
1% Cancelled
```


---

## ⏱️ Delay Intelligence

Analyze operational disruptions and identify bottlenecks.

Provides:

- Hourly delay trends
- Peak congestion periods
- Delay impact analysis
- Operational performance tracking


Helps airport teams understand when and where disruptions occur.


---

## 👥 Passenger Flow Analytics

Visualize passenger movement across airport terminals.

Tracks:

- Hourly passenger traffic
- Terminal activity
- Peak travel periods
- Passenger volume changes


Useful for:

- Crowd management
- Resource allocation
- Terminal optimization


---

## 💰 Revenue Intelligence

Monitor airport commercial performance.

Includes:

- Terminal revenue
- Retail analytics
- Food & beverage insights
- Duty-free performance


Provides visibility into non-aviation revenue streams.


---

## 🌦️ Weather Operations Module

Weather intelligence for aviation operations.

Displays:

- Temperature
- Visibility
- Wind speed
- Runway conditions


Supports:

- Flight planning
- Runway operations
- Safety decisions


---

## 🕒 Live Operations Timeline

A real-time airport event monitoring system.

Tracks:

- Flight delays
- Gate changes
- Maintenance events
- Security alerts


Features:

- Operational clock
- Event filtering
- Severity tracking
- Timeline visualization


---

## 🎨 Premium Aviation Experience

Inspired by:

- Linear
- Vercel
- Raycast
- Enterprise control systems


Includes:

- Dark aviation theme
- Glassmorphism interface
- Minimal enterprise layout
- Data-first visualization
- Smooth animations
- Professional dashboard experience


---

# 📸 Screenshots


## Cinematic Intro

<img width="1905" height="964" alt="Cinematic Intro" src="https://github.com/user-attachments/assets/c168674b-0688-4372-ac68-93fe82fde9de" />


## Command Center Dashboard

<img width="1919" height="910" alt="Command Center" src="https://github.com/user-attachments/assets/6cd900a1-af35-4417-b347-a9f3989614f6" />


## Maintenance Dashboard
<img width="1919" height="910" alt="Maintenance_light_bg" src="https://github.com/user-attachments/assets/c8e89489-97a4-4a73-a106-e564612dc261" />
<img width="1919" height="900" alt="Maintenance_Dark_bg" src="https://github.com/user-attachments/assets/e8ecd036-d6b8-48c2-b909-5dd01501c0f5" />


---

# 🛠 Tech Stack


| Category | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 4 |
| Animation | GSAP |
| Data Visualization | Recharts |
| Icons | Lucide React |
| Routing | React Router |


---

# 🏗 Architecture


AeroPulse is designed as a modular frontend dashboard application.


## Application Flow


```
Application Start

        ↓

Cinematic Aviation Intro

        ↓

Command Center Dashboard

        ↓

Operational Intelligence Modules

        ↓

Analytics & Monitoring
```


---

## Main Architecture


```
src/

├── intro/
│
│   ├── assets/
│   │   ├── clouds.png
│   │   └── aircraft.png
│   │
│   ├── AeroIntro.tsx
│   ├── AeroIntro.css
│   └── IntroTimeline.ts
│
├── features/
│
│   └── analytics/
│
│       ├── components/
│       │
│       │   ├── FlightAnalytics.tsx
│       │   ├── DelayChart.tsx
│       │   ├── PassengerFlow.tsx
│       │   ├── RevenueAnalytics.tsx
│       │   └── WeatherCard.tsx
│       │
│       └── data/
│           └── analyticsData.ts
│
├── pages/
│
│   ├── command-center/
│   │   └── CommandCenterPage.tsx
│   │
│   ├── flights/
│   ├── passengers/
│   ├── gates/
│   ├── baggage/
│   ├── maintenance/
│   ├── security/
│   └── timeline/
│
├── components/
│
├── layouts/
│
├── hooks/
│
├── services/
│
├── store/
│
└── router/
```


---

# 🚀 Getting Started


## Requirements

- Node.js 18+
- npm


---

## Installation


```bash
git clone <repository-url>

cd aeropulse

npm install
```


---

## Development


```bash
npm run dev
```


Open:

```
http://localhost:5173
```


---

## Production Build


```bash
npm run build
```


---

# 📜 Available Scripts


| Command | Description |
|-|-|
| npm run dev | Start development server |
| npm run build | Create production build |
| npm run preview | Preview production build |


---

# 🛫 User Workflow


Typical experience:


```
Launch AeroPulse

        ↓

Experience Cinematic Intro

        ↓

Enter Command Center

        ↓

Monitor Airport Operations

        ↓

Analyze Intelligence Reports

        ↓

Make Operational Decisions
```


---

# 📊 Dashboard Architecture


```
Command Center

│
├── Flight Analytics
│
├── Delay Intelligence
│
├── Passenger Flow Analytics
│
├── Revenue Intelligence
│
├── Weather Monitoring
│
└── Live Operations Timeline
```


---

# 🚀 Future Improvements


Possible future features:


- Real-time flight API integration
- Live airport operational feeds
- AI-powered delay prediction
- Smart resource recommendations
- 3D airport visualization
- Aircraft tracking system
- Gate utilization mapping
- Multi-airport management


---

# Deployment


The application can be deployed on:


- Vercel
- Netlify
- GitHub Pages


The project requires only static frontend hosting.


---

<div align="center">

Built using **React, TypeScript, Vite, Tailwind CSS, GSAP, and modern frontend technologies.**

</div>
