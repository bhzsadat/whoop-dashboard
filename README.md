# WHOOP Biometric Performance Engine

A full-stack performance dashboard that visualizes biometric time-series data using React, D3.js, and Supabase. This project focuses on handling high-frequency telemetry and simulating a live data ingestion pipeline.

## 🚀 Overview

This dashboard transforms raw physiological sensor data into actionable insights. It tracks key WHOOP metrics such as **Recovery Score %**, **Heart Rate Variability (HRV)**, and **Resting Heart Rate (RHR)** over 51 physiological cycles.

The core engineering challenge was moving beyond static data visualization to simulate a real-world asynchronous streaming environment where data is processed as it "arrives" from a wearable device.

## 🛠️ Tech Stack

* **Frontend:** React (Vite) & D3.js for complex time-series math and smooth interpolation curves.
* **Backend:** Supabase (PostgreSQL) for structured biometric data storage.
* **Data Processing:** Custom asynchronous ingestion logic to simulate real-time telemetry.

## 🧠 Key Technical Features

### 1. Asynchronous Data Ingestion
Unlike traditional dashboards that load all data at once, this engine implements a **Producer-Consumer pattern**. Data is fetched from the database and fed into the visualization state at 300ms intervals. This mimics the behavior of a real-time message queue (like Kafka or SQS) synchronizing wearable data to the cloud.

### 2. Time-Series Visualization (D3.js)
The dashboard utilizes D3's `scaleTime` and `scaleLinear` modules to manage dynamic axes. As new data points are "ingested," the chart automatically recalculates its domain to expand the timeline while maintaining a smooth, "MonotoneX" interpolation curve for the recovery line.

### 3. Data Integrity & Validation
Real-world sensor data is rarely perfect. During development, I identified null telemetry points in the `Recovery score %` column of the WHOOP dataset. 
* **The Fix:** I implemented a multi-layer filter at the database level (PostgreSQL `.not()` filter) and the frontend layer (D3 `.defined()` method) to ensure the data stream remains continuous and the UI remains resilient to "dirty" data.

## 📊 Dataset Reference

This project utilizes the **WHOOP Physiological Cycles** dataset, which includes:
* Cycle Start/End Times
* Recovery Score (0-100%)
* HRV (ms) and Resting Heart Rate (bpm)
* Sleep Performance, Efficiency, and Respiratory Rate

## 📂 Data Source

The data used in this project is sourced from the **WHOOP Physiological Cycles** dataset available on [Kaggle](https://www.kaggle.com/datasets/andrewcxjin/whoop-dataset). 

## 🚦 Getting Started

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/](https://github.com/)[YOUR_GITHUB_USERNAME]/whoop-dashboard.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Setup:**
    Create a `.env` file and add your Supabase credentials:
    ```text
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_key
    ```
4.  **Run the App:**
    ```bash
    npm run dev
    ```

## 📈 Future Roadmap
* Implement "Strain vs. Recovery" correlation views.
* Add circular gauge indicators for current-day metrics.
* Add Webhooks to trigger alerts when recovery drops below 33% (Red Zone).
