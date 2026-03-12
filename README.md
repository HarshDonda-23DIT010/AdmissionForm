# DEPSTAR Student Inquiry Form

A student inquiry form application for **Devang Patel Institute of Advance Technology and Research (DEPSTAR)**, CHARUSAT.

## Features

### 📝 Inquiry Form
- Student personal details (Name, Mobile, Email, Parent Mobile)
- Location details (City/Village, District)
- Academic details (Board, 12th PCM PR, GUJCET PR)
- Branch Preference (CE, CSE, IT, Other)
- Admission Interest Type (ACPC, Management Quota, NRI)
- CHARUSAT MQ/NRI Form status
- Optional remarks
- Auto-filled date and time of visit

### 📊 Dashboard
- Total inquiries count (till date)
- Today's inquiry count
- Weekly inquiry statistics
- Day-wise bar chart visualization (last 7 days)
- Excel export functionality with date range filter

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Data Storage:** Local Storage (JSON-based)
- **Excel Export:** XLSX + FileSaver

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd client
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open your browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Deployment to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Deploy
```bash
vercel
```

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

## Project Structure

```
client/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.jsx
│   │   ├── Footer/
│   │   │   └── Footer.jsx
│   │   ├── Form/
│   │   │   └── InquiryForm.jsx
│   │   └── Dashboard/
│   │       └── Dashboard.jsx
│   ├── utils/
│   │   ├── storage.js
│   │   └── exportExcel.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── README.md
```

## Data Storage

This application uses **localStorage** for data persistence. Data is stored in JSON format and persists across browser sessions.

> **Note:** For production use with multiple users, consider integrating with a backend database service.

## Export Data

The dashboard provides Excel export functionality:
- **Export Range:** Download inquiries within a selected date range
- **Export All:** Download all inquiry records

## License

© 2024 DEPSTAR - Devang Patel Institute of Advance Technology and Research. All Rights Reserved.

## Contact

- **Website:** [depstar.charusat.ac.in](https://depstar.charusat.ac.in)
- **Email:** depstar@charusat.ac.in
- **Address:** CHARUSAT Campus, Changa - 388421, Gujarat
