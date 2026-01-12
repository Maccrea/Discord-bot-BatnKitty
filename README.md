# Discord Voice Session Tracker

**Discord Voice Session Tracker** is a robust logging application designed to monitor voice channel activity in real-time. It tracks user presence, calculates session duration with precision, and generates detailed audit logs via Discord Embeds upon session completion.

This application features a **Time Offset Calibration** system configurable via `.env`, allowing administrators to manually simulate or adjust session durations (Hours, Minutes, Seconds) for specific channels.

---

## 🚀 Key Features

* **📊 Real-Time Console Dashboard**
  Monitors active voice sessions directly from the terminal with a live, ticking digital clock interface.

* **⏱️ Precision Time Offset**
  Advanced capability to preset initial session durations. You can configure `Hours`, `Minutes`, and `Seconds` to be added to the session time for a specific **Target Channel**.

* **📝 Rich Embed Logging**
  Automatically generates and sends aesthetically pleasing reports (Embeds) to a designated log channel when a user leaves, detailing the exact duration.

* **🔐 Secure Configuration**
  Built with `dotenv` to keep sensitive credentials (Tokens) and configuration variables secure.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
* **Node.js** (v16.9.0 or higher recommended)
* **NPM** (Node Package Manager)

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/discord-voice-tracker.git
cd discord-voice-tracker
```

### 3. Install Dependencies
Install the required packages (`discord.js` and `dotenv`):
```bash
npm install discord.js dotenv
```

### 4. Configuration
You need to set up your environment variables and the log channel.

#### A. Environment Variables (`.env`)
Create a file named `.env` in the root directory of your project. Copy and paste the following configuration, then fill in your details:

```env
# 1. Your Discord Bot Token (REQUIRED)
TOKEN=your_bot_token_here

# 2. Target Voice Channel ID for Time Offset (Leave empty to disable)
TARGET_CHANNEL_ID=123456789012345678

# 3. Time Offset Settings (How much time to add to the duration)
OFFSET_JAM=0
OFFSET_MENIT=0
OFFSET_DETIK=0
```

| Variable | Description |
| :--- | :--- |
| `TOKEN` | Your Discord Bot Token (Get it from Discord Developer Portal). |
| `TARGET_CHANNEL_ID` | The ID of the Voice Channel where you want the time manipulation to happen. |
| `OFFSET_JAM` | Number of **Hours** to add to the timer. |
| `OFFSET_MENIT` | Number of **Minutes** to add to the timer. |
| `OFFSET_DETIK` | Number of **Seconds** to add to the timer. |

#### B. Log Channel Setup
Open `index.js` and find the following line to set where the Embed Logs will be sent:
```javascript
// Replace with your text channel ID where logs should be sent
const LOG_CHANNEL_ID = '1456959703807561790'; 
```

---

## ▶️ Usage

### Run the Bot
```bash
node index.js
```

### Console Output
Once running, the console will show a live status:
```text
✅ Bot Logger berhasil login sebagai BotName#1234!
🎯 Target Channel SET: 1234567890 (Mundur 1j 30m)
```

When a user joins a voice channel:
```text
========================================
      🔴 LIVE CALL MONITORING 🔴      
========================================
🔊 Room: General
⏱️  Time: 01:30:05
----------------------------------------
```

---

## ⚠️ Security Note
* **NEVER** share your `.env` file or commit it to GitHub.
* Ensure `.env` is listed in your `.gitignore` file.

## 📜 License
This project is open-source. Feel free to modify and distribute.