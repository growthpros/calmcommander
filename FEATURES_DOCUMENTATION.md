# Calm Commander - Complete Feature Documentation

## Overview
Calm Commander is an AI-powered executive function support application designed specifically for people with ADHD and autism. It helps manage overwhelm, organize tasks, and build self-trust through neurodivergent-friendly interfaces and AI coaching.

**Target Audience**: People with ADHD, autism, or AuDHD (both)
**AI Model**: Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)
**Tech Stack**: React 18 (CDN), Express.js, Tailwind CSS, localStorage for persistence

---

## Current Architecture

### Frontend
- **Framework**: React 18 (loaded via CDN, no build step required)
- **Styling**: Tailwind CSS + custom CSS
- **State Management**: React hooks (useState, useEffect, useRef)
- **Data Persistence**: Browser localStorage
- **Location**: `/public/index.html` (single-page app with inline JSX)

### Backend
- **Framework**: Express.js (Node.js)
- **API Integration**: Anthropic Claude API via native HTTPS module
- **Location**: `/server.js`
- **Port**: 3000 (configurable via `PORT` environment variable)

### Data Storage (Current)
- **Method**: Browser localStorage
- **Keys Used**:
  - `calmCommanderApiKey` - User's Anthropic API key
  - `calmCommanderMessages` - Chat conversation history
  - `calmCommanderTasks` - Active task list
  - `calmCommanderMode` - Current AI mode (coach/crisis)
  - `ccDailyEnergy` - Daily energy level check-in
  - `ccCompletedTasks` - Historical completed tasks
  - `ccCalendarInput` - Today's calendar input

---

## Core Features

### 1. Two AI Coaching Modes

#### Coach Mode (Default)
**Purpose**: Everyday executive function support with gentle guidance

**AI Behavior**:
- Asks ONE question at a time (never multiple)
- Helps organize tasks into Now/Soon/Later (Today/This Week/Later)
- Offers choices by energy level or urgency
- Encourages micro-actions and small steps
- Uses time-blind friendly language (e.g., "after lunch" instead of "2pm")
- Sensory-aware communication (minimal emojis, clear structure)
- Periodically suggests body check-ins ("Need water or a short reset?")
- References specific tasks from user's task list for personalized advice

**System Prompt Location**: `server.js:14-40`

**Response Format**:
```
✅ Now (Today): [most urgent or easiest tasks]
⏳ Soon (This Week): [can wait a bit]
📅 Later: [future tasks]
```

#### Crisis Mode
**Purpose**: Support during moments of overwhelm, shutdown, or paralysis

**Auto-Detection**: Activates automatically when user message contains crisis keywords:
- "overwhelmed", "frozen", "shutdown", "too much", "crisis"
- "can't do this", "help", "drowning", "stuck"

**AI Behavior**:
- STOPS asking questions
- Minimal, soothing responses (under 100 words)
- Auto-organizes tasks into exactly 3 categories
- Validates struggle without adding complexity
- Provides permission to rest
- Plain, warm language with minimal punctuation

**System Prompt Location**: `server.js:42-64`

**Response Format**:
```
✅ Do now: [one simple action]
⏳ Delay: [one specific task that can wait]
💬 Ask for help: [optional - only if relevant]

You've got this. One small step is enough.
```

**Manual Override**: Users can switch modes anytime via toggle buttons with visual feedback (active state shows border and shadow).

---

### 2. Task Management System

#### Master Task List
**Location**: Persistent across sessions via localStorage

**Task Properties**:
```javascript
{
  id: timestamp,
  title: string,
  category: string,           // Default: "Uncategorized"
  energyRequired: string,      // "low" | "medium" | "high"
  view: string,               // "today" | "this-week" | "later"
  client: string,             // Optional client name
  billable: boolean,          // Whether task is billable
  estimatedTime: number,      // Hours (decimal, e.g., 0.5 = 30min)
  status: string,             // "active" | "completed"
  createdDate: timestamp,
  parentTaskId: number,       // Optional - for subtasks
  hasSubtasks: boolean,       // Flag for parent tasks
  subtaskCount: number        // Number of subtasks
}
```

#### Task Views (Today/This Week/Later)
**Purpose**: Organize tasks by timeframe to reduce overwhelm

**Views**:
1. **Today**: Tasks to focus on today
2. **This Week**: Tasks for the current week
3. **Later**: Backlog/brain dump location

**View Switching**: Dropdown on each task allows moving between views

**Task Count Badges**: Each tab shows total task count for that view

**Implementation**: `index.html:1417-1496`

---

### 3. Energy-Based Task Management

#### Daily Energy Check-In
**Purpose**: Help users work within their capacity, not against it

**Interface**: Prompt appears on app load if no energy set for today
- Three buttons: Low / Medium / High energy
- Stored with today's date
- Resets daily (checks `new Date().toDateString()`)

**Data Structure**:
```javascript
{
  date: "Mon Jan 15 2025",
  level: "low" | "medium" | "high",
  timestamp: 1705324800000
}
```

**Energy Filtering**:
- Tasks are filtered based on energy level
- If user has LOW energy: only shows LOW energy tasks
- If user has MEDIUM energy: shows LOW and MEDIUM tasks
- If user has HIGH energy: shows all tasks
- Hidden task count displayed with explanation

**Visual Indicators**:
- Low energy tasks: Red badge (#fee2e2 background)
- Medium energy tasks: Yellow badge (#fef3c7 background)
- High energy tasks: Green badge (#d1fae5 background)

**Implementation**: `index.html:657-665`, `index.html:1422-1432`

---

### 4. Time Management Features

#### Calendar Input
**Purpose**: Help time-blind users understand their available work time

**Input Format Examples**:
- "Client call 2-3pm, team meeting 4pm"
- "3 hours in meetings"
- "Meeting 9:30-11am"

**Parsing Logic** (`parseCalendarInput` function):
- Extracts explicit hours: "3 hours", "3h", "3 hrs"
- Parses time ranges: "2-3pm", "9:30-11am", "2pm-4pm"
- Falls back to single time mentions (counts as 1h each)
- Caps at 16 hours to avoid nonsense

**Integration with AI**: Calendar info is sent to Claude with each message:
```
Calendar today: Client call 2-3pm (1.0h in meetings/calls)
```

**Implementation**: `index.html:1200-1227`, `index.html:823-870`

#### Time Estimation System
**When Adding Tasks**:
- Modal prompts for time estimate
- Quick options: 15min, 30min, 1h, 2h
- Custom time input option
- "Skip / Not Sure" option (sets estimatedTime to null)

**Time Display**:
- Tasks under 1 hour: Shows in minutes ("30min")
- Tasks 1+ hours: Shows in hours ("2h")

**Daily Time Summary** (Today view only):
Calculates and displays:
1. **Calendar hours**: Time in meetings/calls
2. **Available hours**: 8-hour workday minus calendar time
3. **Task time estimate**: Sum of all estimated times for Today tasks
4. **Overcommitment warnings**:
   - Green: Good balance (≤4h tasks with calendar time)
   - Yellow: Might be overcommitted (tasks > available time)
   - Red: Seriously overcommitted (tasks > 8h total workday)

**Visual Feedback Colors**:
- Good balance: Blue background (#e0e7ff)
- Overcommitted: Yellow background (#fef3c7)
- Very overcommitted: Red background (#fee2e2)

**Implementation**: `index.html:1906-2052`, `index.html:1518-1577`

---

### 5. Client & Billing Features

#### Client Tagging
**Purpose**: Track work by client for billing and organization

**Adding Client to Task**:
- Prompted during task creation
- Optional field (can be blank)
- Applies to individual tasks or bulk upload

**Visual Display**:
- Purple badge with client name
- Shown on each task card
- Groups tasks in task list

**Implementation**: `index.html:596-614`

#### Billable Flag
**Purpose**: Distinguish billable vs. non-billable work

**Setting Billable**:
- Checkbox during task creation
- Prompted if client name is provided
- Can be set for all tasks in bulk upload

**Visual Display**:
- Green "$ Billable" badge on task cards
- Stands out with darker green color (#065f46)

**Implementation**: `index.html:1670-1682`

#### Time Tracking on Completion
**When Marking Task Complete**:
- Modal asks: "How long did this actually take?"
- Shows estimated time for comparison
- Quick options: 15min, 30min, 1h, 2h, Custom
- Stores actual time with completed task

**Completed Task Data**:
```javascript
{
  ...taskProperties,
  status: 'completed',
  completedDate: timestamp,
  actualTime: "1.5"  // hours as string
}
```

**Implementation**: `index.html:630-655`, `index.html:1781-1903`

#### Monthly Billing View
**Purpose**: Generate billable hours reports grouped by client

**Features**:
1. **Month Selector**: Choose any month/year
2. **Summary Section**:
   - Total hours across all clients
   - Total billable hours (highlighted in green)
3. **Client Breakdown**:
   - Grouped by client name
   - Shows total and billable hours per client
   - Lists individual tasks with:
     - Task title
     - Completion date (e.g., "Jan 15")
     - Hours spent
     - Billable indicator

**Data Filtering**:
- Filters `completedTasks` by selected month
- Groups by `task.client` (defaults to "No Client")
- Sums `task.actualTime` for totals

**Visual Design**:
- Summary in gray box at top
- Each client in separate card
- Client header with gray background
- Task list with subtle separators
- Billable badge on applicable tasks

**Implementation**: `index.html:2171-2379`

**Modal Access**: Button in main interface ("💰 View Billing")

---

### 6. Task Breakdown Assistant

#### Purpose
Help users break down overwhelming tasks into smaller, actionable steps using AI

#### How It Works
1. **Trigger**: Click "Break Down" button on any task (not available for tasks that already have subtasks)
2. **AI Processing**:
   - Sends task title to Claude with specialized prompt
   - Asks for 3-5 smaller, concrete steps
   - Each step should be:
     - Specific and actionable
     - Small enough to complete in one sitting
     - Clear about what "done" looks like
3. **Response Parsing**:
   - Extracts numbered list from AI response
   - Handles formats: "1. ", "1) ", "- ", "• "
   - Filters out very short entries (< 3 chars)

#### Subtask Creation
When user clicks "Add These Steps as Tasks":
- **Parent Task Updates**:
  - Sets `hasSubtasks: true`
  - Adds `subtaskCount: N`
  - Remains in task list but shows progress indicator
- **Subtasks Created**:
  - Inherit properties from parent:
    - Same `category`
    - Same `energyRequired`
    - Same `view` (Today/This Week/Later)
    - Same `client`
    - Same `billable` status
  - Linked via `parentTaskId`
  - If parent has `estimatedTime`, it's divided equally among subtasks
  - Each gets unique ID: `Date.now() + Math.random() + index`

#### Parent-Child Display
- **Expand/Collapse**: Triangle button (▶/▼) to show/hide subtasks
- **Progress Indicator**: Shows "X/Y done" badge on parent
  - Green background when all subtasks complete
  - Blue background when in progress
- **Visual Hierarchy**:
  - Subtasks indented 30px
  - Lighter background color (#fafafa)
  - Thinner left border (3px vs 4px)
- **Auto-expand**: Parent automatically expands after subtasks added

#### Implementation
- Breakdown logic: `index.html:715-816`
- Display rendering: `index.html:1597-1765`
- Modal UI: `index.html:2381-2473`

---

### 7. Bulk Upload Feature

#### Purpose
Quickly add multiple tasks at once (brain dump functionality)

#### How to Use
1. Click "📋 Bulk Upload" button
2. Paste task list in textarea (one task per line)
3. Optionally set:
   - **Client name**: Applies to all tasks
   - **Billable checkbox**: Marks all as billable
4. Click "Add Tasks"

#### Input Parsing
Automatically cleans common formats:
- Bullet points: `- `, `• `, `* `
- Numbered lists: `1. `, `2) `
- Checkboxes: `[ ]`, `[x]`, `(x)`
- Empty lines: Skipped
- Very short entries: Skipped (< 2 chars after cleaning)

#### Default Properties
All bulk uploaded tasks get:
- `category: "Bulk Upload"`
- `energyRequired: "medium"`
- `view: "later"` (brain dump location)
- `status: "active"`
- `createdDate: Date.now()`

#### Visual Feedback
- Tasks added to "Later" view by default
- Can be moved to Today/This Week individually after upload
- Grouped under "Bulk Upload" category

#### Implementation
- Modal UI: `index.html:2054-2168`
- Upload logic: `index.html:667-713`

---

### 8. Quick Add Task Buttons

#### Purpose
Fast task creation without opening chat or bulk upload

#### Interface
**Collapsible Section**: "+ Add Task" button with arrow
- Click to expand/collapse
- Visual feedback: Changes color when expanded (blue border)
- Three energy-level buttons when expanded

#### Task Creation Flow
1. Click energy level button (Low/Medium/High)
2. Prompt for task name
3. Prompt for client name (optional)
4. If client provided: Prompt for billable (yes/no)
5. **Time Estimation Modal** appears:
   - Shows task name for confirmation
   - Quick time options: 15min, 30min, 1h, 2h, Custom
   - "Skip / Not Sure" option
6. Task added to "Later" view with selected energy level

#### Button Colors
- **Low Energy**: Red (#fee2e2 background, #991b1b text)
- **Medium Energy**: Yellow (#fef3c7 background, #92400e text)
- **High Energy**: Green (#d1fae5 background, #065f46 text)

#### Implementation
- Collapsible UI: `index.html:1265-1386`
- Time estimate modal: `index.html:1906-2052`

---

### 9. AI Context Integration

#### What the AI Sees
When user sends a message, the AI receives:

**1. User's Message**

**2. Energy Level** (if set today):
```
Current energy level: medium
```

**3. Calendar Context**:
```
Calendar today: Client call 2-3pm, team meeting 4pm (3.0h in meetings/calls)
```

**4. Complete Task List**:
```
--- CURRENT TASK LIST (15 tasks) ---

Today (5):
- Finish proposal [est: 2h] (high energy) [Acme Corp] $ Billable
- Email client [est: 0.25h] (low energy) [Acme Corp]
...

This Week (7):
- Review budget [est: 1h] (medium energy)
...

Later (3):
- Research new tools (low energy)
...
--- END TASK LIST ---
```

#### How AI Uses This Context
- **Coach Mode**: References specific tasks by name for prioritization advice
- **Crisis Mode**: Picks specific tasks from actual list for "do now" and "delay" suggestions
- **Time Planning**: Considers calendar time vs. task estimates
- **Energy Matching**: Suggests tasks appropriate for current energy level

**Why This Matters**: Makes AI advice personalized and actionable, not generic

#### Implementation
- Context building: `index.html:942-998`
- Sent with message: `index.html:1010`

---

### 10. Conversation Chat Interface

#### Layout
- **Chat Container**: 400px high scrollable area (300px on mobile)
- **Message Types**:
  1. **User messages**: Blue background (#e0e7ff), right-aligned
  2. **Assistant messages**: White background, left-aligned, bordered
  3. **System messages**: Yellow background (#fef3c7), centered, italic
     - Used for mode switches, errors, connection issues

#### Features
- **Auto-scroll**: Scrolls to bottom only when new messages are added
  - Uses ref tracking to prevent scroll on re-renders
  - Smooth scroll behavior
- **Loading Indicator**: "Thinking..." message while waiting for AI response
- **Enter to Send**: Press Enter (without Shift) to send message
- **Disabled During Loading**: Input and send button disabled while loading

#### Message Persistence
- All messages saved to localStorage
- Loaded on app mount
- Includes conversation history across sessions
- Welcome message added on first setup

#### Welcome Message
Shown on first use after API key setup:
```
Hi there. I'm here to help you feel calmer and more clear.
Let's take this one step at a time. What's on your mind right now?
```

#### Implementation
- Chat UI: `index.html:1388-1414`
- Auto-scroll: `index.html:558-568`
- Send logic: `index.html:923-1046`

---

### 11. Task Display & Interaction

#### Task Card Layout
Each task shows:
1. **Expand/Collapse** (if has subtasks)
2. **Task Title**
3. **Progress Badge** (if parent with subtasks): "X/Y done"
4. **Energy Badge**: Low/Medium/High with color coding
5. **Client Badge** (if set): Purple background
6. **Billable Badge** (if true): Green "$ Billable"
7. **Time Estimate** (if set): Yellow badge with hours/minutes
8. **Actions**:
   - View dropdown (Today/This Week/Later)
   - "Break Down" button (if no subtasks)
   - "Complete" button
   - "Delete" button

#### Grouping
Tasks grouped by category:
- Category header shows: "Category Name (X)" where X is task count
- Only parent tasks counted (subtasks shown under parents)
- Categories auto-created from task categorization

#### Subtask Display
- Indented 30px from parent
- Lighter background (#fafafa)
- Thinner border (3px)
- No "Break Down" button (can't break down a subtask)
- All other actions available (move, complete, delete)

#### Visual Consistency
- Color coding matches throughout app
- Hover states on buttons
- Cursor pointer on interactive elements
- Consistent spacing and padding

#### Implementation
- Task rendering: `index.html:1597-1765`
- Task list container: `index.html:1417-1778`

---

## Reusable UI Components

### Card Component
```javascript
<Card className="...">
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```
- White background, rounded corners, subtle shadow
- Consistent padding and borders

### Badge Component
```javascript
<Badge variant="success">Text</Badge>
```
Variants: default, primary, success, warning, danger, purple

### Button Component
```javascript
<Button variant="primary" size="md">Click Me</Button>
```
Variants: default, primary, success, danger, ghost
Sizes: sm, md, lg

### Modal Component
```javascript
<Modal isOpen={true} onClose={handler} title="Title">
  Content
</Modal>
```
- Fixed overlay with dark background
- Centered content box
- Click outside to close
- Close X button in header
- Max height with scroll

**Implementation**: `index.html:346-442`

---

## Data Flow & Architecture

### State Management
All state managed via React hooks:
```javascript
- apiKey, setApiKey
- isSetup, setIsSetup
- messages, setMessages
- tasks, setTasks
- completedTasks, setCompletedTasks
- currentMode, setCurrentMode (coach/crisis)
- currentView, setCurrentView (today/this-week/later)
- dailyEnergy, setDailyEnergy
- calendarInput, setCalendarInput
- showBulkUploadModal, setShowBulkUploadModal
- showBillingView, setShowBillingView
- showBreakdownModal, setShowBreakdownModal
- showCompleteModal, setShowCompleteModal
- showEstimateModal, setShowEstimateModal
- showAddTask, setShowAddTask
- expandedParents, setExpandedParents
- billingMonth, setBillingMonth
```

### localStorage Synchronization
**On Load** (`useEffect` on mount):
- Read all saved data
- Validate and parse JSON
- Check date-based data (energy, calendar) is for today
- Add welcome message if first time

**On Change**:
- Every state change that should persist writes to localStorage
- Uses `localStorage.setItem(key, JSON.stringify(data))`

**Data Validation**:
- Tasks array: Validates `Array.isArray()`, resets if corrupted
- Energy: Checks if date matches today
- Calendar: Checks if date matches today
- Handles parse errors gracefully with try/catch

### API Communication

#### Endpoint: `POST /api/chat`
**Request**:
```javascript
{
  message: string,      // User message + context
  mode: string,         // "coach" or "crisis"
  apiKey: string        // User's Anthropic API key
}
```

**Response**:
```javascript
{
  response: string      // AI's response text
}
```

**Error Handling**:
- 400: Missing fields or invalid mode
- 500: AI API errors
- Network errors: Shown as system message in chat

#### Backend Proxy
Server proxies to Claude API:
1. Receives request from frontend
2. Validates required fields
3. Constructs Claude API request with:
   - Model: `claude-3-5-haiku-20241022`
   - Max tokens: 1024
   - System prompt: Based on mode
   - User message
4. Makes HTTPS request to `api.anthropic.com`
5. Parses response
6. Returns text content to frontend

**Why Proxy?**: Keeps API calls server-side, provides consistent error handling

**Implementation**: `server.js:68-154`

---

## Design Philosophy & Accessibility

### Neurodivergent-Friendly Design
1. **Visual Calm**:
   - Soft purple gradient background (#667eea to #764ba2)
   - Generous whitespace
   - Rounded corners (8px, 16px)
   - Subtle shadows

2. **Clarity**:
   - Clear hierarchy with headings
   - Color-coded categories (not color-dependent, also has text)
   - Consistent button placement
   - One action at a time prompts

3. **Reduced Cognitive Load**:
   - Collapsible sections
   - Progressive disclosure (show more when needed)
   - Clear labels and descriptions
   - No overwhelming lists

4. **Time-Blindness Support**:
   - Calendar input instead of time tracking
   - Time estimates in relatable chunks (15min, 30min)
   - Visual time summaries
   - Warnings when overcommitted

5. **Sensory Awareness**:
   - Minimal emoji use (only in buttons/labels)
   - No autoplay or animations
   - Calm color palette
   - Readable font sizes

### Mobile Responsiveness
**Breakpoint**: 700px

**Mobile Adjustments**:
- Reduced padding (20px → 10px body, 30px → 20px content)
- Smaller chat height (400px → 300px)
- Less message margin (20px → 10px on user/assistant messages)
- Touch-friendly button sizes (maintained)

**Implementation**: `index.html:315-335`

---

## Security & Privacy

### Current Security Model

#### API Key Storage
- **Location**: Browser localStorage (client-side only)
- **Type**: `password` input field (hidden characters)
- **Transmission**: Sent to backend with each chat request
- **Backend Handling**: Backend receives key but doesn't store it
- **Risk**: Stored in plain text in localStorage

#### Data Privacy
**What stays private:**
- ✅ API key (never sent to app server, only to Claude API)
- ✅ All conversations (localStorage only)
- ✅ All tasks (localStorage only)
- ✅ Energy levels and calendar data (localStorage only)

**What's sent externally:**
- User messages + task context → Claude API (via backend proxy)
- API key → Claude API (for authentication)

#### Current Limitations
❌ No encryption of localStorage data
❌ No user authentication
❌ No backend database
❌ No multi-device sync
❌ No data backup

**Privacy Upside**: Complete data isolation per browser/device

### Clearing Data
Users can clear all data by:
1. Clearing browser localStorage manually
2. Using private/incognito mode (data deleted on close)
3. Running `localStorage.clear()` in browser console

---

## Supabase Integration (Planned/Future)

**Current Status**: ❌ NOT IMPLEMENTED

**Note**: The following branches were mentioned for future development but are not yet in the repository:
- `claude/phase6-enhanced-completion-011CUhqn3G8BxBmhR8DkC7tN` - Enhanced completion features
- `localStorage-backup` - Backup/restore functionality
- `claude/add-supabase-auth-011CUiCZGmK4YCj2JeVSC9r6` - Supabase authentication
- `claude/plan-supabase-migration-011CUiCZGmK4YCj2JeVSC9r6` - Migration planning

The app currently uses only localStorage. Below is documentation for planned Supabase integration for beta users.

### Why Supabase?
1. **Multi-device sync**: Access tasks from phone, tablet, computer
2. **Data backup**: Don't lose data if browser cache clears
3. **User authentication**: Secure, private accounts
4. **Collaboration features**: Future ability to share tasks or billing reports
5. **Advanced querying**: Better reporting and analytics

### Planned Database Schema

#### Table: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_beta_user BOOLEAN DEFAULT false,
  anthropic_api_key_encrypted TEXT,  -- Encrypted, not plain text
  settings JSONB DEFAULT '{}'::jsonb
);
```

#### Table: `tasks`
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Uncategorized',
  energy_required TEXT CHECK (energy_required IN ('low', 'medium', 'high')),
  view TEXT CHECK (view IN ('today', 'this-week', 'later')),
  client TEXT,
  billable BOOLEAN DEFAULT false,
  estimated_time DECIMAL(5,2),  -- Hours
  actual_time DECIMAL(5,2),     -- Hours
  status TEXT CHECK (status IN ('active', 'completed', 'deleted')),
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  has_subtasks BOOLEAN DEFAULT false,
  subtask_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_view ON tasks(view);
CREATE INDEX idx_tasks_completed_at ON tasks(completed_at);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);
```

#### Table: `messages`
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  mode TEXT CHECK (mode IN ('coach', 'crisis')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for loading conversation history
CREATE INDEX idx_messages_user_id_created_at ON messages(user_id, created_at DESC);
```

#### Table: `daily_metrics`
```sql
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
  calendar_input TEXT,
  calendar_busy_hours DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, date)  -- One record per user per day
);

CREATE INDEX idx_daily_metrics_user_date ON daily_metrics(user_id, date DESC);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own record" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Daily metrics policies
CREATE POLICY "Users can view own metrics" ON daily_metrics
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own metrics" ON daily_metrics
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own metrics" ON daily_metrics
  FOR UPDATE USING (user_id = auth.uid());
```

### Migration Plan

#### Step 1: Initial Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase project
supabase init

# Link to remote project
supabase link --project-ref YOUR_PROJECT_REF
```

#### Step 2: Create Migration File
```bash
supabase migration new initial_schema
```

#### Step 3: Migration SQL
**File**: `supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_beta_user BOOLEAN DEFAULT false,
  anthropic_api_key_encrypted TEXT,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Uncategorized',
  energy_required TEXT CHECK (energy_required IN ('low', 'medium', 'high')),
  view TEXT CHECK (view IN ('today', 'this-week', 'later')),
  client TEXT,
  billable BOOLEAN DEFAULT false,
  estimated_time DECIMAL(5,2),
  actual_time DECIMAL(5,2),
  status TEXT CHECK (status IN ('active', 'completed', 'deleted')),
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  has_subtasks BOOLEAN DEFAULT false,
  subtask_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  mode TEXT CHECK (mode IN ('coach', 'crisis')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_metrics table
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
  calendar_input TEXT,
  calendar_busy_hours DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_view ON tasks(view);
CREATE INDEX idx_tasks_completed_at ON tasks(completed_at);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX idx_messages_user_id_created_at ON messages(user_id, created_at DESC);
CREATE INDEX idx_daily_metrics_user_date ON daily_metrics(user_id, date DESC);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own record" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own metrics" ON daily_metrics
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own metrics" ON daily_metrics
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own metrics" ON daily_metrics
  FOR UPDATE USING (user_id = auth.uid());
```

#### Step 4: Apply Migration
```bash
supabase db push
```

---

## Beta User Authentication System (Planned)

**Current Status**: ❌ NOT IMPLEMENTED

### Authentication Flow

#### Option 1: Email Magic Links (Recommended)
**Why**: Neurodivergent-friendly (no password to remember/forget)

**Flow**:
1. User enters email on login page
2. Supabase sends magic link to email
3. User clicks link → automatically logged in
4. Session persists across devices

**Implementation** (planned):
```javascript
// Frontend
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
)

async function signInWithEmail(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: 'https://calmcommander.app/auth/callback'
    }
  })

  if (error) console.error('Error:', error.message)
  else console.log('Check your email for the login link!')
}
```

#### Option 2: Social Auth (Google, etc.)
**Pros**: One-click login
**Cons**: Privacy concerns for some users

```javascript
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
}
```

#### Option 3: Email + Password
**Pros**: Traditional, familiar
**Cons**: Password management burden

```javascript
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })
}
```

### Beta User Management

#### Invite System
**Goal**: Controlled rollout to beta testers

**Database Addition**:
```sql
CREATE TABLE beta_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES users(id)
);

CREATE INDEX idx_beta_invites_code ON beta_invites(invite_code);
CREATE INDEX idx_beta_invites_email ON beta_invites(email);
```

**Invite Flow**:
1. Admin generates invite codes
2. Sends invite email with unique code
3. User signs up with code
4. Code marked as used, user marked as `is_beta_user: true`

**Validation Function** (Supabase Edge Function):
```javascript
// supabase/functions/validate-beta/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { invite_code, email } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Check if invite code is valid and unused
  const { data: invite, error } = await supabase
    .from('beta_invites')
    .select('*')
    .eq('invite_code', invite_code)
    .is('used_at', null)
    .single()

  if (error || !invite) {
    return new Response(
      JSON.stringify({ valid: false, message: 'Invalid or expired invite code' }),
      { status: 400 }
    )
  }

  // If email matches invite or invite has no email restriction
  if (invite.email && invite.email !== email) {
    return new Response(
      JSON.stringify({ valid: false, message: 'This invite code is for a different email' }),
      { status: 400 }
    )
  }

  return new Response(
    JSON.stringify({ valid: true, invite_id: invite.id }),
    { status: 200 }
  )
})
```

**Sign-up Flow with Beta Code**:
```javascript
// Frontend
async function signUpBeta(email, inviteCode) {
  // 1. Validate invite code
  const validateRes = await fetch('/functions/v1/validate-beta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invite_code: inviteCode, email: email })
  })

  const { valid, invite_id } = await validateRes.json()

  if (!valid) {
    alert('Invalid beta invite code')
    return
  }

  // 2. Sign up user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        is_beta_user: true,
        invite_id: invite_id
      }
    }
  })

  if (authError) {
    alert('Error signing up: ' + authError.message)
    return
  }

  // 3. Mark invite as used
  await supabase
    .from('beta_invites')
    .update({
      used_at: new Date().toISOString(),
      used_by: authData.user.id
    })
    .eq('id', invite_id)

  // 4. Create user record
  await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: email,
      is_beta_user: true
    })
}
```

#### Admin Dashboard (Future)
Features needed:
- Generate beta invite codes
- View beta user list
- Monitor user activity/feedback
- Revoke access if needed

### Session Management

**Supabase handles**:
- JWT tokens (short-lived access, long-lived refresh)
- Automatic refresh before expiration
- Session persistence across tabs
- Logout functionality

**Frontend Integration**:
```javascript
// Check if user is logged in
const { data: { user } } = await supabase.auth.getUser()

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Load user data
    loadUserData(session.user.id)
  }
  if (event === 'SIGNED_OUT') {
    // Clear local state
    clearLocalData()
  }
})

// Sign out
async function signOut() {
  await supabase.auth.signOut()
}
```

### Data Migration: localStorage → Supabase

**Goal**: Preserve existing user data when they create an account

**Implementation** (planned):
```javascript
async function migrateLocalDataToSupabase(userId) {
  // 1. Get data from localStorage
  const localTasks = JSON.parse(localStorage.getItem('calmCommanderTasks') || '[]')
  const localMessages = JSON.parse(localStorage.getItem('calmCommanderMessages') || '[]')
  const localCompleted = JSON.parse(localStorage.getItem('ccCompletedTasks') || '[]')
  const localEnergy = JSON.parse(localStorage.getItem('ccDailyEnergy') || 'null')
  const localCalendar = JSON.parse(localStorage.getItem('ccCalendarInput') || 'null')

  // 2. Insert tasks
  const tasksToInsert = localTasks.map(task => ({
    user_id: userId,
    title: task.title,
    category: task.category,
    energy_required: task.energyRequired,
    view: task.view === 'thisweek' ? 'this-week' : task.view,
    client: task.client,
    billable: task.billable,
    estimated_time: task.estimatedTime,
    status: task.status,
    parent_task_id: task.parentTaskId,
    has_subtasks: task.hasSubtasks,
    subtask_count: task.subtaskCount,
    created_at: new Date(task.createdDate).toISOString()
  }))

  await supabase.from('tasks').insert(tasksToInsert)

  // 3. Insert completed tasks
  const completedToInsert = localCompleted.map(task => ({
    user_id: userId,
    title: task.title,
    category: task.category,
    energy_required: task.energyRequired,
    view: task.view === 'thisweek' ? 'this-week' : task.view,
    client: task.client,
    billable: task.billable,
    estimated_time: task.estimatedTime,
    actual_time: parseFloat(task.actualTime),
    status: 'completed',
    created_at: new Date(task.createdDate).toISOString(),
    completed_at: new Date(task.completedDate).toISOString()
  }))

  await supabase.from('tasks').insert(completedToInsert)

  // 4. Insert messages
  const messagesToInsert = localMessages.map(msg => ({
    user_id: userId,
    role: msg.role,
    content: msg.content,
    mode: 'coach'  // Default, since old messages didn't track mode
  }))

  await supabase.from('messages').insert(messagesToInsert)

  // 5. Insert today's metrics (if set)
  if (localEnergy && localEnergy.date === new Date().toDateString()) {
    await supabase.from('daily_metrics').insert({
      user_id: userId,
      date: new Date().toISOString().split('T')[0],  // YYYY-MM-DD
      energy_level: localEnergy.level
    })
  }

  if (localCalendar && localCalendar.date === new Date().toDateString()) {
    const busyHours = parseCalendarInput(localCalendar.input)

    await supabase.from('daily_metrics').upsert({
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      calendar_input: localCalendar.input,
      calendar_busy_hours: busyHours
    })
  }

  // 6. Clear localStorage after successful migration
  localStorage.removeItem('calmCommanderTasks')
  localStorage.removeItem('calmCommanderMessages')
  localStorage.removeItem('ccCompletedTasks')
  // Keep API key and energy/calendar for now

  console.log('✅ Data migrated successfully to Supabase')
}
```

**When to trigger migration**:
- Automatically on first successful sign-in
- Or via "Import Local Data" button in settings

### Fallback Mode

**Hybrid Approach**: Support both localStorage and Supabase

```javascript
const isOnline = navigator.onLine
const isAuthenticated = !!user

if (isAuthenticated && isOnline) {
  // Use Supabase
  await saveTaskToSupabase(task)
} else {
  // Use localStorage
  saveTaskToLocalStorage(task)

  if (isAuthenticated) {
    // Queue for sync when back online
    addToSyncQueue('tasks', task)
  }
}
```

**Benefits**:
- Works offline
- No data loss
- Graceful degradation

---

## Implementation Checklist for Supabase Migration

### Phase 1: Setup
- [ ] Create Supabase project
- [ ] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] Set up environment variables
- [ ] Create database schema (run migration)
- [ ] Enable RLS policies
- [ ] Test database access

### Phase 2: Authentication
- [ ] Add Supabase Auth to frontend
- [ ] Create login/signup UI
- [ ] Implement magic link sign-in
- [ ] Add session management
- [ ] Create beta invite system
- [ ] Build invite validation Edge Function
- [ ] Test auth flow end-to-end

### Phase 3: Data Layer
- [ ] Create Supabase client utility
- [ ] Replace localStorage tasks with Supabase queries
- [ ] Replace localStorage messages with Supabase queries
- [ ] Replace localStorage metrics with Supabase queries
- [ ] Implement real-time subscriptions (optional)
- [ ] Add offline sync queue
- [ ] Test data CRUD operations

### Phase 4: Migration
- [ ] Build migration tool (localStorage → Supabase)
- [ ] Add "Import Local Data" button to UI
- [ ] Test migration with sample data
- [ ] Add migration success/error handling
- [ ] Create migration documentation for users

### Phase 5: Security
- [ ] Encrypt API keys before storing in database
- [ ] Audit RLS policies
- [ ] Add rate limiting
- [ ] Implement CORS properly
- [ ] Add input validation/sanitization
- [ ] Security testing

### Phase 6: Beta Launch
- [ ] Generate initial beta invite codes
- [ ] Send invites to beta testers
- [ ] Monitor for errors/issues
- [ ] Collect feedback
- [ ] Iterate based on feedback

### Phase 7: Post-Launch
- [ ] Add admin dashboard
- [ ] Implement analytics (privacy-first)
- [ ] Add data export feature
- [ ] Create backup/restore functionality
- [ ] Document API for potential future integrations

---

## File Structure

```
calmcommander/
├── .git/                       # Git repository
├── .replit                     # Replit configuration
├── .gitignore                  # Git ignore file
├── package.json                # Node.js dependencies
├── package-lock.json           # Locked dependency versions
├── server.js                   # Express backend + Claude API proxy
├── README.md                   # User-facing documentation
├── FEATURES_DOCUMENTATION.md   # This file (developer documentation)
└── public/
    └── index.html              # Single-page React app (frontend)

# Future structure with Supabase:
supabase/
├── config.toml                 # Supabase CLI config
├── migrations/
│   └── YYYYMMDDHHMMSS_initial_schema.sql
└── functions/
    └── validate-beta/
        └── index.ts
```

---

## API Reference

### Backend Endpoints

#### `POST /api/chat`
Send a message to the AI coach

**Request Body**:
```json
{
  "message": "I have 10 things to do and feel overwhelmed",
  "mode": "coach",
  "apiKey": "sk-ant-api03-..."
}
```

**Response** (Success):
```json
{
  "response": "Let's sort this out together. What are all the things on your mind? Just list them - no need to organize yet."
}
```

**Response** (Error):
```json
{
  "error": "Missing required fields: message, mode, and apiKey",
  "details": "Additional error info"
}
```

**Status Codes**:
- `200`: Success
- `400`: Bad request (missing fields, invalid mode)
- `500`: Server error (Claude API failure, network error)

---

#### `GET /api/health`
Health check endpoint

**Response**:
```json
{
  "status": "ok",
  "message": "Calm Commander is running"
}
```

---

### Frontend API (State Management)

#### Task Functions

**`addTask(title, category, energyRequired, view, client, billable, estimatedTime)`**
- Creates new task
- Saves to localStorage
- Returns: void

**`deleteTask(taskId)`**
- Removes task from list
- Updates localStorage
- Returns: void

**`moveTask(taskId, newView)`**
- Moves task to different view (today/this-week/later)
- Updates localStorage
- Returns: void

**`completeTask(taskId, actualTime)`**
- Marks task as complete
- Moves to completedTasks array
- Records completion time
- Updates localStorage
- Returns: void

**`handleBreakdownTask(task)`**
- Sends task to AI for breakdown
- Displays modal with suggestions
- Returns: Promise<void>

**`addSubtasksToList()`**
- Converts breakdown suggestions to subtasks
- Links to parent task
- Expands parent by default
- Updates localStorage
- Returns: void

#### Energy Functions

**`setEnergy(level)`**
- Records daily energy level
- Stores with today's date
- Filters visible tasks based on energy
- Updates localStorage
- Returns: void

#### Bulk Upload

**`handleBulkUpload()`**
- Parses textarea input
- Creates multiple tasks
- Applies client and billable to all
- Updates localStorage
- Closes modal
- Returns: void

---

## Testing Strategy (Recommended)

### Manual Testing Checklist

#### Task Management
- [ ] Add task via quick buttons
- [ ] Add task with time estimate
- [ ] Add task with client and billable flag
- [ ] Move task between views
- [ ] Complete task with time tracking
- [ ] Delete task
- [ ] Break down task into subtasks
- [ ] Expand/collapse parent tasks
- [ ] Complete all subtasks and verify parent shows all complete

#### Energy System
- [ ] Set energy level
- [ ] Verify task filtering by energy
- [ ] Verify hidden task count
- [ ] Update energy level
- [ ] Verify daily reset (change system date)

#### Time Management
- [ ] Enter calendar with time ranges
- [ ] Enter calendar with explicit hours
- [ ] Verify busy hours calculation
- [ ] Add estimated time to tasks
- [ ] Verify overcommitment warnings (yellow, red)
- [ ] Verify time summary in Today view

#### Billing
- [ ] Tag task with client
- [ ] Mark task as billable
- [ ] Complete billable task
- [ ] Open billing view
- [ ] Select different months
- [ ] Verify totals calculation
- [ ] Verify client grouping

#### AI Modes
- [ ] Send normal message in Coach mode
- [ ] Trigger Crisis mode with keyword
- [ ] Verify mode badge updates
- [ ] Manually switch between modes
- [ ] Verify system messages appear
- [ ] Verify AI references task list in responses

#### Bulk Upload
- [ ] Paste task list with bullets
- [ ] Paste numbered list
- [ ] Add client to bulk upload
- [ ] Mark bulk upload as billable
- [ ] Verify all tasks created correctly

#### Persistence
- [ ] Add tasks and refresh page
- [ ] Complete tasks and refresh page
- [ ] Set energy and refresh page
- [ ] Enter calendar and refresh page (same day)
- [ ] Verify chat history persists

#### Responsive Design
- [ ] Test on mobile viewport (< 700px)
- [ ] Test on tablet viewport
- [ ] Test on desktop
- [ ] Verify touch targets are accessible

### Automated Testing (Future)

**Unit Tests** (Jest + React Testing Library):
```javascript
// Example: Task creation
test('addTask creates task with correct properties', () => {
  const task = addTask('Test task', 'Work', 'high', 'today', 'Acme', true, 2)
  expect(task.title).toBe('Test task')
  expect(task.energyRequired).toBe('high')
  expect(task.billable).toBe(true)
})

// Example: Energy filtering
test('filterTasksByEnergy shows only appropriate tasks', () => {
  setDailyEnergy('low')
  const filtered = filterTasksByEnergy(allTasks)
  expect(filtered.every(t => t.energyRequired === 'low')).toBe(true)
})
```

**Integration Tests**:
```javascript
// Example: Complete task flow
test('completing task moves it to completed list', async () => {
  const task = createTask()
  await completeTask(task.id, '1.5')

  expect(tasks.find(t => t.id === task.id)).toBeUndefined()
  expect(completedTasks.find(t => t.id === task.id)).toBeDefined()
  expect(completedTasks.find(t => t.id === task.id).actualTime).toBe('1.5')
})
```

**E2E Tests** (Playwright):
```javascript
// Example: User flow
test('user can add task and complete it', async ({ page }) => {
  await page.goto('http://localhost:3000')

  // Add task
  await page.click('text=+ Low Energy')
  await page.fill('input', 'Test task')
  await page.click('text=30 min')

  // Verify task appears
  await expect(page.locator('text=Test task')).toBeVisible()

  // Complete task
  await page.click('text=Complete')
  await page.click('text=30 min')

  // Verify task in completed
  // (would need to add completed task view to UI)
})
```

---

## Performance Considerations

### Current Performance
- **Load Time**: Fast (no build step, CDN-loaded React)
- **Rendering**: Efficient React hooks
- **Data Size**: Limited by localStorage (5-10MB typically)
- **Network**: Minimal (only AI API calls)

### Potential Bottlenecks
1. **Large Task Lists**: Rendering 500+ tasks could slow down
   - **Solution**: Implement virtualization (react-window)

2. **localStorage Size**: Could hit quota with extensive message history
   - **Solution**: Implement message pruning (keep last 100 messages)

3. **AI Response Time**: Depends on Claude API latency
   - **Current**: Usually 1-3 seconds
   - **Solution**: Add loading indicators (already implemented)

### Optimization Opportunities
- [ ] Lazy load completed tasks (don't load until billing view opened)
- [ ] Debounce calendar input parsing
- [ ] Memoize task filtering calculations
- [ ] Implement virtualized task list for 100+ tasks
- [ ] Add service worker for offline support

---

## Deployment

### Current Deployment (Replit)
**Configuration**: `.replit` file

**Environment**:
- Port: 3000 (auto-configured)
- Public URL: Generated by Replit
- HTTPS: Automatic

**Deployment Steps**:
1. Push to GitHub
2. Import to Replit
3. Click "Run"
4. Share public URL

### Alternative Deployments

#### Vercel
```bash
npm install -g vercel
vercel
```

**Configuration**: `vercel.json`
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server.js" },
    { "src": "/(.*)", "dest": "public/$1" }
  ]
}
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Configuration**: Auto-detects Node.js app

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create calmcommander

# Deploy
git push heroku main
```

**Configuration**: `Procfile`
```
web: node server.js
```

### Environment Variables
**Required** (for production):
- `PORT`: Server port (auto-set by most hosts)
- `NODE_ENV`: Set to `production`

**Optional** (for Supabase):
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase admin key (server-side only)

---

## Future Enhancements

### Priority 1 (User Requested)
1. **Supabase Integration**: Multi-device sync, data backup
2. **Beta User System**: Controlled access with invite codes
3. **Data Export**: Download tasks as CSV/JSON
4. **Completed Tasks View**: See history beyond billing report

### Priority 2 (Nice to Have)
1. **Task Templates**: Save common task structures
2. **Recurring Tasks**: Daily/weekly task auto-creation
3. **Tags System**: Flexible categorization beyond client
4. **Search**: Find tasks by keyword
5. **Filters**: Multiple filter options (energy + client + tags)

### Priority 3 (Advanced)
1. **Voice Input**: Speech-to-text for task entry
2. **Notifications**: Gentle reminders (opt-in only)
3. **Analytics**: Personal insights (time patterns, energy trends)
4. **API**: Public API for integrations
5. **Plugins**: Extend with custom functionality

### AI Improvements
1. **Memory**: Long-term patterns and preferences
2. **Proactive Suggestions**: "Based on Tuesday patterns, consider..."
3. **Custom Prompts**: User can tweak AI personality
4. **Multi-language**: Support beyond English

---

## Contributing

### Code Style
- **JavaScript**: ES6+ features, arrow functions preferred
- **React**: Functional components with hooks (no classes)
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Comments**: Explain "why", not "what"

### Neurodivergent-Friendly Principles
When adding features, always consider:
1. **Reduce Cognitive Load**: One thing at a time
2. **Clear Visual Hierarchy**: Headers, spacing, colors
3. **Sensory Awareness**: Avoid sudden animations or sounds
4. **Flexibility**: Multiple ways to accomplish tasks
5. **Forgiveness**: Easy undo, non-destructive actions
6. **Calm Aesthetics**: Soft colors, generous whitespace

### Pull Request Template
```markdown
## What does this PR do?
[Brief description]

## Why is this needed?
[User need or problem solved]

## How was this tested?
- [ ] Manual testing
- [ ] Automated tests added
- [ ] Tested on mobile

## Checklist
- [ ] Follows neurodivergent-friendly design principles
- [ ] No breaking changes to existing features
- [ ] Documentation updated
- [ ] Accessible (keyboard navigation, screen reader friendly)
```

---

## FAQ

### For Users

**Q: Is my data private?**
A: Yes. Everything stays in your browser's localStorage. Your API key and conversations never touch our server - they go directly to Claude's API.

**Q: Can I use this on multiple devices?**
A: Not currently. Each browser has its own data. Supabase sync coming soon for beta users.

**Q: What if I clear my browser data?**
A: You'll lose all tasks and conversation history. Export/backup features coming soon.

**Q: How much does this cost?**
A: You need your own Anthropic API key. Typical usage: $3-15/month depending on how much you chat with the AI.

**Q: Can others see my tasks?**
A: No. Everything is private to your browser. No one else can access your data.

### For Developers

**Q: Why localStorage instead of a database?**
A: Privacy-first approach + simplicity for v1. Supabase integration planned for v2.

**Q: Why React via CDN instead of a build system?**
A: Lower barrier to entry, easier deployment, faster iteration. May add build system later if needed.

**Q: Can I self-host this?**
A: Yes! Clone the repo, run `npm install && npm start`. Requires Node.js 16+.

**Q: How do I contribute?**
A: Fork the repo, make changes, submit PR. See Contributing section above.

**Q: Is there a public API?**
A: Not yet. Planned for future versions.

---

## Changelog

### v1.0.0 (Initial Release)
- Two AI modes: Coach and Crisis
- Master task list with categories
- Energy-based task filtering
- Calendar integration
- Time estimation system
- Client and billable tagging
- Monthly billing reports
- Task breakdown assistant
- Bulk upload
- Parent-child task relationships
- Reusable UI components

### Future Versions
- v1.1.0: Supabase integration (planned)
- v1.2.0: Beta user authentication (planned)
- v2.0.0: Advanced features (TBD)

---

## Support & Contact

**Issues**: Open a GitHub issue
**Discussions**: GitHub Discussions
**Email**: [Add support email]
**Community**: [Add Discord/Slack if applicable]

---

## License

MIT License - Use freely, modify as needed, share with others.

Built with care for the AuDHD community by Caroline.

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production-ready (localStorage version)
**Next Milestone**: Supabase migration for beta users
