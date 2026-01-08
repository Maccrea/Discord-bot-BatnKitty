**Discord Voice Session Tracker** is a robust logging application designed to monitor voice channel activity in real-time. It tracks user presence, calculates session duration with precision, and generates detailed audit logs via Discord Embeds upon session completion.

This application includes a **Time Offset Calibration** feature, allowing administrators to manually configure start-time metrics for specific channels—useful for session simulation, testing, or historical data adjustment.

---

## 🚀 Key Features

* **📊 Real-Time Console Dashboard**
    Monitors active voice sessions directly from the terminal with a live, ticking digital clock interface.
    
* **⏱️ Time Offset Configuration**
    Advanced capability to preset initial session durations (Hours, Minutes, Seconds). This allows for manual calibration of the "Start Time" for targeted voice channels.

* **📝 Rich Embed Logging**
    Automatically generates and sends aesthetically pleasing reports (Embeds) to a designated log channel when a user leaves, detailing the exact duration of the session.

* **🔄 Auto-Recovery & Persistence**
    Smart detection logic handles users already present in voice channels upon bot startup/restart.

---

## ⚙️ Configuration Variables

The application is highly configurable via `index.js`. Below are the key parameters for the Time Offset feature:

| Variable | Description | Type |
| :--- | :--- | :--- |
| `TARGET_CHANNEL_ID` | The specific Voice Channel ID to apply the time offset. | String |
| `JAM_YANG_MAU_DISET` | Hours offset to be added to the session duration. | Integer |
| `MENIT_YANG_MAU_DISET` | Minutes offset to be added to the session duration. | Integer |
| `DETIK_YANG_MAU_DISET` | Seconds offset to be added to the session duration. | Integer |

---

## 🛠️ Installation & Setup

### Prerequisites
* Node.js (v16.9.0 or higher)
* NPM (Node Package Manager)

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/voice-session-tracker.git](https://github.com/yourusername/voice-session-tracker.git)
cd voice-session-tracker
