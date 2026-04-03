# 🚀 Invoice Extraction AI

An AI-powered application that extracts structured data from invoice documents (JPG, PNG, PDF), stores results in a database, and provides analytics insights.

---

## 📌 Features

* 📤 Upload invoice files (JPG, PNG, PDF)
* 🔍 OCR-based text extraction
* 🤖 AI-powered parsing (LLM)
* 🗄️ Supabase integration (DB + Storage)
* 🧠 Format detection & reuse (template learning)
* 🔁 Duplicate invoice detection
* 📊 Analytics dashboard (API-based)

---

## 🧠 System Architecture

```
Frontend (React)
        ↓
Backend (Node.js - Express)
        ↓
File Upload (Multer)
        ↓
PDF → Image Conversion (pdf-poppler)
        ↓
OCR (Tesseract.js)
        ↓
LLM Parsing (Gemini / OpenAI)
        ↓
Validation Layer
        ↓
Supabase (Storage + Database)
        ↓
Analytics API
```

---

## 🛠️ Tech Stack

### Backend

* Node.js (CommonJS)
* Express.js
* Multer (file upload)

### AI / OCR

* Tesseract.js (OCR)
* Gemini API (LLM) *(OpenAI supported)*

### Database & Storage

* Supabase (PostgreSQL + Storage)

### Utilities

* pdf-poppler (PDF → Image conversion)
* uuid, fs-extra

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```env
PORT=8000

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

GEMINI_API_KEY=your_gemini_key
```

---

## 🧱 Supabase Setup

### 1. Create Storage Bucket

* Name: `invoices`
* Set as **public**

---

### 2. Run SQL (Tables)

```sql
create table files (
  id uuid primary key default uuid_generate_v4(),
  file_name text,
  file_url text,
  created_at timestamp default now()
);

create table invoices (
  id uuid primary key default uuid_generate_v4(),
  file_id uuid,
  vendor_name text,
  invoice_number text,
  invoice_date text,
  total_amount numeric,
  currency text,
  created_at timestamp default now()
);

create table templates (
  id uuid primary key default uuid_generate_v4(),
  vendor_name text,
  template jsonb,
  created_at timestamp default now()
);
```

---

### 3. Disable / Configure RLS

```sql
create policy "Allow public uploads"
on storage.objects
for insert
to public
with check (true);

create policy "Allow public read"
on storage.objects
for select
to public
using (true);
```

---

## 🚀 Running the Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:8000
```

---

## 📤 API Endpoints

### Upload Invoice

```
POST /upload
```

Form-data:

```
file: <invoice file>
```

---

### Analytics

```
GET /analytics
```

Returns:

* Total invoices
* Vendor spend
* Monthly trends

---

## 🔄 Workflow

```
Upload File
   ↓
Store in Supabase Storage
   ↓
PDF → Image (if needed)
   ↓
OCR → Extract text
   ↓
LLM → Structured JSON
   ↓
Template detection
   ↓
Duplicate check
   ↓
Save to database
   ↓
Analytics
```

---

## 🧠 Key Design Decisions

* Used **LLM for parsing** to handle unstructured invoice formats
* Used **template reuse** for faster future processing
* Used **Supabase** for quick backend setup (DB + Storage)
* Implemented **modular services architecture**

---

## ⚠️ Assumptions & Limitations

* PDF processing currently supports **first page only**
* OCR accuracy depends on image quality
* Currency detection may not always be accurate
* No authentication implemented (can be added)

---

## 🔮 Future Improvements

* Multi-page PDF support
* Better format detection using embeddings
* Confidence scoring system
* Vendor normalization
* Batch invoice processing
* UI dashboard with charts
* Authentication & user management

---

## 🎯 What Makes This Strong

* End-to-end AI pipeline
* Handles multiple file formats
* Real-world backend architecture
* Scalable design
* Clean error handling

---

## 🎥 Demo

(Add your demo video link here)

---

## 🌐 Live Demo

(Add deployed link here)

---

## 📂 Repository

(Add GitHub link here)

---

## 👨‍💻 Author

Ankit Gupta
Full Stack Developer | AI Enthusiast

---
