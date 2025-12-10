# Calm Commander - Quick Start Card

**One-page reference for getting started with spoon-aware task management**

---

## 🚀 First Time Setup (5 minutes)

### 1. Open the App
- Replit: Click "Run" → Opens automatically
- Local: `npm start` → Open `http://localhost:3000`

### 2. Do Your First Neuro-Check
Click **"Start Daily Neuro-Check"** button

**Answer honestly:**
- 😊 **Mood**: 1 (terrible) to 5 (great)
- 😴 **Sleep**: 1 (none) to 5 (8+ hours)
- ⚡ **Energy**: 1 (crashed) to 5 (energized)
- 🧠 **Brain Mode**: ADHD / Autism / Balanced
- ⚠️ **Burnout Indicators**: Check all that apply
  - Sleep disrupted
  - Executive dysfunction
  - Sensory overwhelm
  - Social withdrawal
  - Task paralysis
  - Physical symptoms
  - Emotional dysregulation

**Result:** "🥄 You have X spoons today"

### 3. Add Your First Task

**Quick Add (3 buttons):**
- 🟢 Low Energy (1 spoon)
- 🟡 Medium Energy (2 spoons)
- 🔴 High Energy (3 spoons)
- Then select time: 15min / 30min / 1hr / 2hr / Custom

**OR Advanced Add:**
- Full form with all metadata
- Urgency, Focus Level, Due Date
- Client, Billable, Waiting For

---

## 📋 Daily Workflow

### Morning (5 minutes)
1. ✅ **Do Neuro-Check** → Get your spoon capacity
2. 👀 **Review Today tasks** → See what's planned
3. 💧 **Use Quick Boosters** as you do them:
   - 💧 Water (16oz)
   - 🍗 Protein (snack)
   - 🚶 Movement (5-10min)
   - 🌳 Fresh Air (step outside)
   - 💬 Connection (text someone)
   - 🎵 Stim Break (5-10min)

### During Day (ongoing)
4. ✅ **Complete tasks** → Green "Complete" button
5. ⚠️ **If Override needed:**
   - ✉️ Text accountability person FIRST
   - ✅ Check "I texted my accountability person"
   - 📝 Enter reason (10+ chars)
   - ⚡ Complete override
6. 📊 **Break down complex tasks** → "Break Down Task" button
7. 🔄 **Move tasks** → Change timeframe dropdown

### Throughout Week (ongoing)
8. 📈 **Stay under 5 overrides** → Weekly limit
9. ⚠️ **Watch for alerts:**
   - 🟡 48-hour alert (2 days in debt)
   - 🔴 5-day burnout alert (MUST take action)
10. 🔥 **Crisis Mode** → Only when truly needed

---

## 🎯 Key Features at a Glance

### Spoon System
- **Daily Capacity**: Based on mood/sleep/energy/burnout
- **Task Cost**: 1-3+ spoons depending on energy + focus level
- **Spoon Debt**: Trying to complete tasks over capacity = debt
- **Debt Carries Over**: Tomorrow starts at -X spoons

### Override Safety System (Burnout Prevention)
- **When**: Task costs more spoons than you have
- **Requires**: Text accountability person + reason
- **Limit**: 5 overrides per week maximum
- **Why**: External accountability prevents burnout

### Pattern Alerts
- **48-hour**: 2 days in spoon debt → Yellow warning
- **5-day**: 5 days in spoon debt → RED ALERT (can't dismiss without action)

### Crisis Mode
- **Use for**: True emergencies only
- **Effect**: Removes spoon limits temporarily
- **Still tracks**: Debt accumulates (pay it back later)
- **Auto-exits**: Tomorrow at 8 AM
- **Requires**: Reason explaining crisis

---

## 📊 Task Organization

### Five Timeframe Views
- 🔥 **Today** - Do these today
- 📅 **This Week** - This week's tasks
- 📆 **Next Week** - Next week's tasks
- 🗓️ **This Month** - This month's tasks
- 🌊 **Later** - Someday/maybe

### Auto-Placement
Set a **due date** → Task automatically moves to correct timeframe!

### Inline Editing
Click any field to edit:
- ✏️ Title, Category, Client
- ⚡ Energy level, Focus level
- ⏱️ Time estimate, Due date
- 🏷️ Urgency, Waiting For
- 💼 Billable checkbox

---

## ⚡ Quick Reference

### Task Metadata
| Field | Options | Effect |
|-------|---------|--------|
| **Energy Level** | Low/Med/High | Base spoon cost |
| **Focus Level** | Low/Med/High | Multiplies spoons (0.75x - 1.5x) |
| **Urgency** | Low/Normal/Important/Critical | Visual indicator only |
| **Due Date** | Calendar picker | Auto-moves to timeframe |
| **Waiting For** | Text field | Dependency tracking |
| **Time Estimate** | Hours | Used for capacity check |

### Time Capacity Check (Today View)
1. **Enter calendar time** → Meetings/calls in hours
2. **System calculates**:
   - Available hours = 8hr workday - meetings
   - Total task time = Sum of estimates
3. **Warnings**:
   - 🔵 Good: Tasks < 4 hours
   - 🟡 Overcommitted: Tasks > available time
   - 🔴 Very overcommitted: Tasks > 8 hours

### Billing View
- 💼 **Monthly tab** → See all completed tasks
- 💰 **Filter by client**
- ✏️ **Edit completed tasks** → Client, billable, time
- 📊 **See totals** → Billable hours per client

---

## 🆘 Common Questions

### "I can't complete a task - Override modal is blocking me"
**This is the system working!** Options:
1. ✉️ Text accountability person → Complete override
2. 🔄 Defer task to tomorrow/next week
3. 📊 Break down task into smaller parts
4. 🔥 Enter crisis mode (if truly urgent)

### "How do I know if I should use Crisis Mode?"
**Use for:**
- ✅ True emergencies (client crisis, urgent deadline, family emergency)
- ✅ When override system blocks genuinely critical work

**Don't use for:**
- ❌ Regular work that feels urgent
- ❌ Every week (defeats protective purpose)

### "What if I hit 5 overrides for the week?"
**You can't override anymore until next week (Monday).** This is intentional:
- 🛡️ Hard limit protects you from burnout
- 🔥 Use crisis mode if truly needed
- 📅 Otherwise defer to next week
- 🧠 Your brain can't negotiate with this limit

### "Dates are showing wrong"
**Fixed in latest version!** If you see this:
```bash
git pull origin claude/setup-replit-import-011CUg89Cg7Fd9bnL6PHdXri
```

### "How do I backup my data?"
1. Click **"Export Data"** button (in settings/bottom)
2. Downloads JSON file with all tasks/neuro-checks
3. Save this file somewhere safe
4. To restore: Import JSON (future feature)

### "I cleared my browser data - can I recover?"
❌ No - localStorage data is gone without backup

**Prevention:**
- Export data weekly
- Don't clear browser data without exporting first

---

## 🎨 Pro Tips

### Morning Routine
1. ☕ Get coffee/tea first
2. 🧠 Do Neuro-Check before checking email
3. 👀 Review Today list - move non-critical items
4. 💧 Start with Quick Boosters (water, protein)

### Task Management
- 🎯 **Use urgency wisely** - Not everything is Critical
- 🧠 **Set focus level honestly** - High focus = 1.5x spoons
- 📅 **Set due dates** - Tasks auto-move to correct view
- 🏷️ **Use categories** - Helps identify patterns
- ⏱️ **Estimate time** - Enables capacity warnings

### Preventing Burnout
- 📊 **Check spoon debt daily** - Don't let it accumulate
- ⚠️ **Take pattern alerts seriously** - Your brain won't notice
- ✉️ **Actually text accountability person** - External witness works
- 🔥 **Use crisis mode sparingly** - It's an escape hatch, not daily tool
- 📈 **Review override log** - Look for patterns

### Advanced Features
- 📊 **Break down complex tasks** - AI suggests subtasks
- 💼 **Track billable work** - See monthly totals
- 🔄 **Move tasks between views** - Adjust as priorities shift
- ✏️ **Edit everything inline** - Click any field
- 📅 **Use calendar picker** - Visual date selection

---

## 🔧 Troubleshooting

### App won't load (purple background only)
1. Open browser console: `F12` → Console tab
2. Look for error message
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. If persists: Pull latest code

### Task disappeared
**Check:**
- Different timeframe view?
- Completed tasks list?
- Did you clear browser data?

### Override modal won't close
**You must:**
1. ✅ Check "I texted my accountability person"
2. 📝 Enter reason (minimum 10 characters)
3. ⚡ Click "Complete Override"

### Can't enter crisis mode
**Requires:**
- 📝 Reason (minimum 10 characters explaining crisis)
- 🔥 Click "Enter Crisis Mode"

---

## 📖 More Help

- **[Complete User Guide](USER_GUIDE.md)** - 831 lines of comprehensive docs
- **[README](README.md)** - Full project overview
- **[Screenshot Guide](SCREENSHOTS.md)** - Visual documentation

---

**Remember: You're doing great. One spoon at a time. 💜**

*Built for brains that work differently - because that's not broken, just different.*
