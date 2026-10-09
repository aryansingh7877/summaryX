# SummaryX — Local-First WhatsApp Chat Triage & Action-Graph

> A 100% on-device, zero-cloud AI micro-app to solve the "Unread Chat Problem" for WhatsApp group chats. Features an interactive **Temporal Scrubber Analog Clock**, 3-column priority triage, automated action checklist, and an ultra-modern **macOS Sonoma / Arc-style floating aesthetic**.

![SummaryX Interface Preview](./assets/screenshots/dashboard_macos_arc.jpg)

---

## 🌟 Key Features

- **🔒 100% On-Device & Zero Cloud Uploads:** Regex sanitization, entity extraction, and classification run entirely inside browser memory. Zero network packets sent to cloud servers.
- **⚡ Dynamic Real-Time Ingestion:** Drag and drop WhatsApp exported `_chat.txt` files or paste live conversation streams. Starts clean in an empty state with zero hardcoded messages.
- **🕰️ Interactive Temporal Scrubber (`<TimeScrubberClock />`):** Functional analog clock widget supporting tactile dial-dragging and presets (*"All Day"*, *"Last 1h"*, *"Last 3h"*, *"Last 6h"*). Dynamically re-triages in-memory messages in $<2\text{ms}$.
- **📋 3-Column Actionable Triage:**
  - **Urgent Actions (P0/P1):** Blockers, upcoming deadlines, direct mentions, pending approvals.
  - **Key Decisions & FYI (P2):** Finalized updates, links, important announcements.
  - **Resolved / Noise Filtered:** Banter and casual acknowledgments automatically suppressed into an on-device counter.
- **✅ Auto-Extracted Task Sidebar:** Extracted action items with assignees, deadlines, and spring-animated checkboxes.
- **🔍 Surrounding Context Slice Drawer:** Inspect the exact original chat lines around any event.
- **🎨 macOS Sonoma & Arc-Style UI:** Multi-colored dynamic aurora mesh gradient background, elevated floating porcelain window, and frosted translucent edge pills.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **UI & State:** React 18, [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/aryansingh7877/summaryX.git
cd summaryX
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 📄 Documentation & Hackathon Logs

- **AI Prompt History & Vibe Coding Log:** [**`prompt.md`**](./prompt.md)
- **Technical Architecture Specification & Benchmarks:** [**`ARCHITECTURE.md`**](./ARCHITECTURE.md)

---

## 📜 License

MIT License. Built for the Vibe Coding Hackathon.
