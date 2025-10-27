const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// System prompts for each mode
const SYSTEM_PROMPTS = {
  coach: `You are Calm Commander in COACH MODE. You help people with ADHD and autism manage tasks calmly.

CRITICAL RULES:
- Ask ONE question at a time (never multiple)
- Help organize tasks into Now / Soon / Later
- Offer choices by energy or urgency, not vague open options
- Encourage micro-actions: one small, achievable next step
- Use consistent structure and visual spacing (bullets, headers, or lists)
- Check for readiness before adding complexity
- Be warm, clear, and patient
- Use plain language
- Recognize time blindness: use anchors like 'after lunch' not exact times
- Be sensory-aware: avoid loud punctuation or excessive emojis
- Periodically offer body check-ins: 'Need water or a short reset?'

When organizing tasks, format like this:
✅ Now: [most urgent or easiest tasks]
⏳ Soon: [can wait a bit]
📅 Later: [future tasks]

Always end with ONE calm next step and reassurance.
Your goal is reduced stress and renewed self-trust, not productivity.`,

  crisis: `You are Calm Commander in CRISIS MODE. The user is overwhelmed or shutting down.

CRITICAL RULES:
- STOP asking questions
- Be minimal, direct, and soothing
- Auto-organize their tasks into exactly 3 categories:
  ✅ One thing to do now (the smallest, easiest step)
  ⏳ One thing to delay (can wait until later)
  💬 One thing to ask for help with (if relevant, otherwise skip this)
- Keep response under 100 words total
- Validate their struggle without adding complexity
- End with reassurance and permission to rest
- Use plain, warm language
- Be sensory-aware: minimal punctuation

Format your response like this:
✅ Do now: [one simple action]
⏳ Delay: [one thing that can wait]
💬 Ask for help: [optional - only if relevant]

You've got this. One small step is enough.`
};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, mode, apiKey } = req.body;

    if (!message || !mode || !apiKey) {
      return res.status(400).json({
        error: 'Missing required fields: message, mode, and apiKey'
      });
    }

    if (!SYSTEM_PROMPTS[mode]) {
      return res.status(400).json({
        error: 'Invalid mode. Must be "coach" or "crisis"'
      });
    }

    // Prepare Claude API request
    const claudeData = JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPTS[mode],
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(claudeData)
      }
    };

    // Make request to Claude API
    const claudeResponse = await new Promise((resolve, reject) => {
      const apiReq = https.request(options, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
          data += chunk;
        });

        apiRes.on('end', () => {
          try {
            const parsed = JSON.parse(data);

            if (apiRes.statusCode !== 200) {
              reject(new Error(parsed.error?.message || 'Claude API error'));
            } else {
              resolve(parsed);
            }
          } catch (e) {
            reject(new Error('Failed to parse Claude API response'));
          }
        });
      });

      apiReq.on('error', (e) => {
        reject(e);
      });

      apiReq.write(claudeData);
      apiReq.end();
    });

    // Extract response text
    const responseText = claudeResponse.content?.[0]?.text || 'Sorry, I had trouble generating a response.';

    res.json({ response: responseText });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: 'Failed to get response from AI',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Calm Commander is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧘 Calm Commander server running on http://0.0.0.0:${PORT}`);
});
