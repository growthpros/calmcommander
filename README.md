# Calm Commander - AuDHD Edition

An AI-powered executive function support app designed specifically for people with ADHD and autism. Calm Commander helps you manage overwhelm, organize tasks, and build self-trust through two distinct modes: Coach Mode for everyday support and Crisis Mode for moments of shutdown or overload.

## Features

### Two AI Modes

**Coach Mode** (Default)
- Asks ONE question at a time
- Helps organize tasks into Now / Soon / Later
- Offers choices by energy or urgency
- Encourages micro-actions
- Time-blind friendly (uses anchors like "after lunch")
- Sensory-aware communication
- Body check-ins

**Crisis Mode** (Auto-activates on crisis keywords)
- Minimal, soothing responses (under 100 words)
- NO questions asked
- Auto-organizes tasks into 3 simple categories
- Validates struggle without adding complexity
- Permission to rest

### Smart Features

- **Automatic Crisis Detection**: Switches to Crisis Mode when you use words like "overwhelmed", "frozen", "shutdown", "too much", "stuck"
- **Task Organization**: Extracts and displays tasks in color-coded categories (Now/Soon/Later)
- **Local Storage**: Everything stays private on your device
- **Manual Mode Override**: Switch modes anytime with visible toggle buttons
- **Mobile Responsive**: Works on all screen sizes
- **Calming Design**: Soft purple gradients, generous whitespace, dyslexic-friendly fonts

## Quick Start

### Option 1: Deploy to Replit (Easiest)

1. Click the "Import from GitHub" button on Replit
2. Paste this repository URL
3. Click "Run" - that's it!
4. Get your Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
5. Enter your API key when prompted

### Option 2: Local Development

**Prerequisites:**
- Node.js 16 or higher
- npm (comes with Node.js)
- Anthropic API key

**Installation:**

```bash
# Clone the repository
git clone <your-repo-url>
cd calmcommander

# Install dependencies
npm install

# Start the server
npm start
```

The app will be available at `http://localhost:3000`

## Getting Your API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new key
5. Copy it (starts with `sk-ant-`)

**Important**: Your API key never leaves your device. It's stored in your browser's localStorage and sent directly to Claude's API (not our server).

## How to Use

### First Time Setup

1. Open the app
2. Enter your Anthropic API key
3. Click "Start Using Calm Commander"

### Using Coach Mode

1. Type what's on your mind
2. Calm Commander will help you break it down
3. Tasks are automatically extracted and organized
4. Check your task list below the chat

**Example conversation:**
```
You: I have so many things to do and don't know where to start
Commander: Let's sort this out together. What are all the things on your mind?
            Just list them - no need to organize yet.
```

### Using Crisis Mode

When you're overwhelmed:
1. Type how you're feeling (it will auto-detect crisis words)
2. OR click the red "Crisis Mode" button
3. Get immediate, minimal guidance with one clear next step

**Example conversation:**
```
You: I'm completely overwhelmed and frozen
Commander: [Switches to Crisis Mode]
           ✅ Do now: Take three slow breaths
           ⏳ Delay: Everything can wait 10 minutes
           You've got this. One small step is enough.
```

## Project Structure

```
calmcommander/
├── server.js           # Express backend with Claude API integration
├── package.json        # Node.js dependencies
├── public/
│   └── index.html      # Single-page React app (no build needed)
├── .replit             # Replit deployment config
└── README.md           # This file
```

## Technology Stack

**Backend:**
- Node.js
- Express
- Native HTTPS module (no extra dependencies)

**Frontend:**
- React 18 (loaded via CDN)
- Babel Standalone (for JSX in browser)
- Vanilla CSS
- localStorage for data persistence

**AI:**
- Claude Haiku 4.5 (`claude-haiku-4-20250514`)
- Anthropic Messages API

## How It Works

### Architecture

1. **Frontend** (public/index.html): React app runs entirely in browser
2. **Backend** (server.js): Express server proxies requests to Claude API
3. **API Key**: Stored in browser, sent with each request to authenticate with Claude

### Mode Switching Logic

**Auto-Detection:**
```javascript
// Frontend checks for crisis keywords
const CRISIS_KEYWORDS = [
  "overwhelmed", "frozen", "shutdown", "too much",
  "crisis", "can't do this", "help", "drowning", "stuck"
];
```

**Manual Override:**
- Click mode buttons anytime
- Say "back to normal mode" or "coach mode" to return

### Task Parsing

The app looks for these patterns in Claude's responses:

- `✅` or "Now:" → Now category (green)
- `⏳` or "Soon:" → Soon category (yellow)
- `📅` or "Later:" → Later category (gray)

Tasks are automatically extracted and displayed in the task list.

## API Costs

Claude Haiku 4.5 pricing (as of 2024):
- ~$0.25 per million input tokens
- ~$1.25 per million output tokens

**What this means:**
- Average conversation: ~$0.001 - $0.01
- Daily use: ~$0.10 - $0.50
- Monthly use: ~$3 - $15

Very affordable for personal use!

## Privacy & Security

✅ **What's private:**
- Your API key (stored locally, never sent to our server)
- Your conversations (stored in browser localStorage)
- Your tasks (stored in browser localStorage)

⚠️ **What's sent to Anthropic:**
- Your messages (to generate responses)
- Your API key (to authenticate)

🔒 **Security notes:**
- Clear browser data to delete everything
- Don't share your API key
- Use in private browsing for temporary use

## Troubleshooting

### "API Error" or "Failed to get response"

**Possible causes:**
1. Invalid API key → Check your key at console.anthropic.com
2. No API credits → Add payment method to Anthropic account
3. Network issue → Check your internet connection

### Messages not loading

**Solution:**
- Refresh the page
- Check browser console (F12) for errors
- Clear localStorage: `localStorage.clear()` in browser console

### Tasks not appearing

**Why:**
- Claude's response might not include the task emoji markers
- Try asking: "Can you organize those as Now/Soon/Later tasks?"

### App won't start locally

**Checklist:**
- Node.js installed? → `node --version`
- Dependencies installed? → `npm install`
- Port 3000 available? → Close other apps using port 3000

## Future Enhancements

These features are documented for future development:

### Phase 2 Possibilities

**Pattern Learning**
- Track crisis times/triggers
- Proactive mode suggestions
- Energy pattern recognition

**Energy Tracking**
- Daily check-ins with emoji scales
- Energy history graphs
- Optimal task timing suggestions

**Calendar Integration**
- Google Calendar OAuth
- Auto-schedule tasks based on energy patterns
- Time-blind friendly scheduling

**Voice Input**
- Speak instead of type
- Hands-free mode for high overwhelm moments

**Multi-Device Sync**
- Optional cloud storage
- Sync across devices
- Privacy-first encryption

**Customization**
- Adjust AI tone/style
- Custom crisis keywords
- Personalized task categories

## Contributing

This is a personal project built for the neurodivergent community. If you have ideas or want to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

**Please ensure:**
- Changes respect neurodivergent needs (clear, calm, minimal)
- No breaking changes to existing features
- Documentation is updated

## License

MIT License - Use freely, modify as needed, share with others.

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Open a GitHub issue with details
3. Include browser console errors if applicable

## Credits

Built with care for the AuDHD community by Caroline.

Powered by:
- Anthropic's Claude AI
- React
- Express
- The neurodivergent community's feedback and lived experience

---

**Remember:** You're doing great. One step at a time. 💜
