# Calm Commander: the coaching features

Written November 10, 2026, from a read of the code (`server.js` and `public/index.html`). I didn't run the app, so this describes what the code does, including the places where it doesn't do what it was meant to.

The coaching side of Calm Commander has six parts:

1. The chat with the coach
2. Coach Mode
3. Crisis Mode
4. The context the coach is given (your energy, calendar and task list)
5. Tasks the app pulls out of the coach's replies
6. Break Down, which uses the coach to split a task into steps

Each part below has what you see, how it works, and what's broken.

## 1. The chat

### What you see

- A chat window with a text box that says "What's on your mind?"
- Press Enter or click Send. The box is locked and "Thinking..." shows until the reply arrives.
- Three kinds of messages: yours, the coach's, and small system notes (mode changes and errors).
- The first time you open the app, the coach says:

```
Hi there. I'm here to help you feel calmer and more clear. Let's take this one step at a time. What's on your mind right now?
```

### How it works

1. The browser adds your message to the chat and saves the whole chat in the browser (`localStorage`, under `calmCommanderMessages`).
2. It checks your message for mode-switch words (see Crisis Mode).
3. It builds a context block and attaches it to the end of your message (see part 4).
4. It sends one request to the app's own server: `POST /api/chat` with three things, the message, the mode (`coach` or `crisis`) and your Anthropic API key.
5. The server picks the instructions for that mode and calls Anthropic with them and your one message. The reply is capped at 1,024 tokens, which is roughly 750 words.
6. The reply goes back to the browser, is added to the chat and saved.
7. The app scans the reply for tasks (see part 5).

The API key is typed in once on the setup screen and kept in the browser. It travels to the app's server with every message, and the server passes it to Anthropic.

### What's broken

- **The model is retired.** The server asks for `claude-3-5-haiku-20241022` (`server.js:86`). Anthropic retired it on February 19, 2026, so every message should come back as an error.
- **The coach has no memory.** Only your newest message is sent, never the conversation (`server.js:89`). The coach is told to ask one question at a time, but it never sees your answer in context. Each message is a fresh start for it.
- **Errors are vague.** When Anthropic rejects a request, the chat shows "Error: Failed to get response from AI". The real reason is in the server's reply but the screen doesn't show it.
- **The chat grows forever.** Every message is kept in the browser with no limit and no way to clear it from the screen.

## 2. Coach Mode

Coach Mode is the default. The header shows "🧘 Coach Mode".

It's defined entirely by the instructions the server sends to the AI. This is the full text (`server.js:15`):

```
You are Calm Commander in COACH MODE. You help people with ADHD and autism manage tasks calmly.

IMPORTANT: The user's message may include a "CURRENT TASK LIST" section showing their active tasks with details like energy requirements, time estimates, and clients. Use this information to give specific, personalized advice about prioritization and task management.

CRITICAL RULES:
- Ask ONE question at a time (never multiple)
- Help organize tasks into Now / Soon / Later (Today/This Week/Later in the app)
- When you see their task list, reference specific tasks by name to help prioritize
- Offer choices by energy or urgency, not vague open options
- Encourage micro-actions: one small, achievable next step
- Use consistent structure and visual spacing (bullets, headers, or lists)
- Check for readiness before adding complexity
- Be warm, clear, and patient
- Use plain language
- Recognize time blindness: use anchors like 'after lunch' not exact times
- Be sensory-aware: avoid loud punctuation or excessive emojis
- Periodically offer body check-ins: 'Need water or a short reset?'
- When they mention overwhelm, look at their energy level and today's calendar to help them set realistic boundaries

When organizing tasks, format like this:
✅ Now (Today): [most urgent or easiest tasks]
⏳ Soon (This Week): [can wait a bit]
📅 Later: [future tasks]

Always end with ONE calm next step and reassurance.
Your goal is reduced stress and renewed self-trust, not productivity.
```

The ideas worth keeping from this prompt:

- One question at a time
- Choices framed by energy or urgency
- One small next step at the end of every reply
- Time anchors ("after lunch") instead of clock times
- Body check-ins
- The stated goal: less stress and more self-trust, not productivity

## 3. Crisis Mode

### What you see

- The header badge changes to "🚨 Crisis Mode".
- Replies get short. No questions. One thing to do now, one thing to delay, and maybe one thing to ask for help with.

### How you get in and out

There are three ways in or out:

- **The two buttons in the header**, "Coach Mode" and "Crisis Mode". The chat shows "Switched to crisis mode." or "Switched to coach mode."
- **Trigger words in your message.** If your message contains any of these, the app switches to Crisis Mode and shows "Switching to crisis mode. I'm here...":

```
overwhelmed, frozen, shutdown, too much, crisis, can't do this, help, drowning, stuck
```

- **Typing your way back.** A message containing "back to normal mode" or "coach mode" switches to Coach Mode. This is checked before the trigger words, so it wins if both appear.

The match is simple: lowercase the message and look for the word anywhere in it. The mode is saved in the browser, so it's still set when you come back later.

### The instructions

The full Crisis Mode prompt (`server.js:42`):

```
You are Calm Commander in CRISIS MODE. The user is overwhelmed or shutting down.

IMPORTANT: The user's message may include a "CURRENT TASK LIST" section. Use this to pick specific tasks from their actual list.

CRITICAL RULES:
- STOP asking questions
- Be minimal, direct, and soothing
- Auto-organize their tasks into exactly 3 categories:
  ✅ One thing to do now (the smallest, easiest step - pick from their actual task list)
  ⏳ One thing to delay (can wait until later - pick a specific task)
  💬 One thing to ask for help with (if relevant, otherwise skip this)
- Keep response under 100 words total
- Validate their struggle without adding complexity
- End with reassurance and permission to rest
- Use plain, warm language
- Be sensory-aware: minimal punctuation

Format your response like this:
✅ Do now: [one simple action from their list]
⏳ Delay: [one specific task that can wait]
💬 Ask for help: [optional - only if relevant]

You've got this. One small step is enough.
```

### What's broken

- **The message that triggers Crisis Mode gets a Coach Mode answer.** The app switches the mode and sends the message in the same breath, and the request still carries the old mode (`index.html:1011`). So the moment you say you're overwhelmed is the one moment you get the longer, question-asking reply. Crisis Mode only starts with your next message.
- **"help" is a trigger word.** "Can you help me plan Thursday" puts you in Crisis Mode. So does any word containing a trigger, like "helpful" or "stuck" inside "unstuck".
- **It never switches back by itself.** Once you're in Crisis Mode you stay there, across visits, until you click the button or type "coach mode".
- **The switch note disappears.** "Switching to crisis mode. I'm here..." is added to the chat and then overwritten when the reply arrives, so you never really see it.
- **This is a tone setting, not a safety feature.** The app has no crisis phone numbers or resources anywhere. Someone in real distress gets a short task list.

## 4. What the coach is told about you

Before your message is sent, the app adds a block of context to the end of it. You don't see this in the chat. The coach does.

It can include three things.

**Your energy.** At the top of the app, "What's your energy level today?" has three buttons: Low, Medium, High. Your answer is saved with today's date and expires the next day. If set, the coach gets:

```
Current energy level: low
```

**Your calendar.** A text box asks "What's on your calendar today?" with the example "Client call 2-3pm, team meeting 4pm, or '3 hours in meetings'". The app works out busy hours from what you type:

- Stated hours ("3 hours in meetings", "2 hrs") are added up.
- Time ranges ("2-3pm", "9:30-11am") are measured and added.
- If neither is found, each single time mentioned ("4pm") counts as one hour.
- The total is capped at 16 hours.

The coach gets your text and the total:

```
Calendar today: Client call 2-3pm, team meeting 4pm (1.0h in meetings/calls)
```

**Your task list.** Every active task, grouped by tab, with its time estimate, energy level and client:

```
--- CURRENT TASK LIST (5 tasks) ---

Today (2):
- Send proposal [est: 1h] (medium energy) [Acme]
- Book dentist [est: 0.25h] (low energy)

This Week (1):
- Draft workshop outline [est: 2h] (high energy) [Acme]

Later (2):
- Update website bio (low energy)
- Research CRM options [est: 1h] (medium energy)
--- END TASK LIST ---
```

### What's broken

- **This Week tasks never reach the coach.** The tabs save them as `this-week` but this code looks for `thisweek` (`index.html:963`). The count at the top still includes them, so the coach is told "5 tasks" and shown fewer.
- **Later tasks are sent without their client.** Today and This Week include it. Later doesn't.
- **The calendar reading is rough.** In the example above, "team meeting 4pm" is ignored because a time range was already found. Single times only count when there's nothing else.
- **Clearing the calendar box doesn't stick.** Empty text isn't saved, so yesterday's entry for today comes back when you reload.
- **Because the coach has no memory, this block is all it knows.** That makes these gaps matter more than they would in a normal chat.

## 5. Tasks pulled from the coach's replies

### How it works

After every reply, the app reads it line by line (`index.html:872`). Any line that starts with ✅, ⏳ or 📅 becomes a new task:

- The emoji is removed.
- The first of these labels is removed: "now:", "soon:", "later:", "do now:", "delay:", "ask for help:".
- If more than three characters are left, that text becomes the task title.
- The task is saved with the category "From AI".

Lines starting with 💬 (ask for help) are skipped.

### What's broken

- **These tasks are invisible.** They're saved without a tab (Today, This Week or Later), and every tab only shows tasks assigned to it. They sit in storage where you can't see, complete or delete them.
- **The coach's own format doesn't parse.** Coach Mode is told to write "✅ Now (Today): ...". The label remover looks for "now:" and doesn't match "Now (Today):", so the whole line, label and all, becomes one task title. A line listing three tasks becomes one task.
- **Duplicates pile up.** The coach is told to name your existing tasks back to you. Each time it does, those lines are saved again as new hidden tasks.
- **There's no review step.** Nothing asks "add these?" before saving.

The idea is good: the coach suggests, and the list updates. As built, it adds clutter you can't see.

## 6. Break Down

### What you see

A purple "Break Down" button on a task. Click it and a window opens while the coach works. You get a list of steps and can add them to your list as subtasks under the original task.

### How it works

The app sends this to the coach, in Coach Mode, with the task title filled in (`index.html:722`):

```
I have a task that feels overwhelming: "[task title]"

Please break this down into 3-5 smaller, concrete steps that I can do one at a time. Make each step:
- Specific and actionable
- Small enough to complete in one sitting
- Clear about what "done" looks like

Format your response as a simple numbered list, one step per line.
```

Every line in the reply that starts with a number or a bullet becomes a step. When you add them:

- Each step becomes a subtask that copies the parent's tab, energy level, client and billable setting.
- If the parent had a time estimate, it's split evenly across the steps.
- The parent is marked as having subtasks and opens up to show them.

### What's broken

- **It rides on the Coach Mode prompt.** That prompt tells the coach to end with a next step and offer check-ins, so the reply can include extra bulleted lines that get saved as steps.
- **The estimate is counted twice.** The parent keeps its full estimate and the steps share it again, which inflates the day's total.
- **Subtask progress always shows 0 done**, and steps can vanish if the parent is deleted or completed first.
- **Errors become steps.** If the request fails, "Error: Could not get breakdown from AI" shows up in the list as if it were a step you could add.

Quiet Hours already has its own "Break this down" with a review step and steps that save properly, so this part doesn't need carrying over.

## If this moves into Quiet Hours

My opinion on what to keep and what to change.

**Keep:**

- The two prompts, nearly as written. They're the best thing in this app. Both already avoid urgency and shame, which fits the Quiet Hours voice rules. They'd need the emoji and "You've got this" checked against those rules, and the exclamation-free, no-em-dash rules applied.
- The context block idea. Quiet Hours knows far more about your day (spoons left, check-in state, what's on today), so the coach could be much better informed there.
- The short mode: no questions, one thing now, one thing to let wait.

**Change:**

- Send the conversation, not only the last message. Without that it isn't coaching.
- Keep the API key on the server side, the way Quiet Hours already does for Brain Dump. Users shouldn't paste a key.
- Don't trigger the short mode from single words. Quiet Hours already has a check-in with states like "frozen" and a spoon budget. Those are better signals than the word "help". A button the person presses is better still.
- Rename it. Quiet Hours uses "crisis" for real crisis resources (988 and the others in the footer). A mode that hands you a short task list should be called something else, like a low-capacity or "just one thing" mode, and the real crisis resources should stay visible next to it.
- Suggested tasks go through a review step, like Brain Dump does, and never save silently.
- A coach that talks with people about overwhelm and burnout stores sensitive conversations. That's worth a deliberate decision about what's saved, for how long, and whether it's in Export and Delete my account. It may be a question for counsel alongside the others already on the list.

The build log for Quiet Hours lists "Talk it through" as planned and not built. This coach looks like a natural starting point for it.
