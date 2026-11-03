# NSGY-Assistant

**An offline-first neurosurgical clinical reference and decision-support application.**

NSGY-Assistant is a lightweight, browser-based application designed to provide rapid access to neurosurgical workflows, clinical calculators, management recommendations, and structured communication tools.

The application is built using HTML, CSS, and vanilla JavaScript. It operates without a dedicated backend, database, or external JavaScript framework.

## Features

### Clinical Workflows
- Guided neurosurgical assessment workflows
- Condition-specific clinical information
- Interactive navigation through clinical scenarios

### Clinical Calculators
The application includes calculators and assessment tools for:

- Glasgow Coma Scale (GCS)
- ABC/2 hematoma volume estimation
- Intracerebral Hemorrhage (ICH) Score
- Hunt and Hess grading
- Modified Fisher grading
- Thoracolumbar Injury Classification and Severity Score (TLICS)
- ASIA neurological assessment

### Clinical Reference
- Neurosurgical reference material
- Clinical management recommendations
- Searchable content
- Favorites and recently accessed items

### Communication Tools
- Structured clinical communication templates
- Clinical information fields
- Integration of selected calculator results into communication drafts

### Offline Support
The application includes a web app manifest and service worker to support installation and offline access to cached resources.

Offline functionality depends on the required application resources having been successfully cached.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive interface |
| JavaScript | Application logic and interactions |
| Service Worker | Offline resource caching |
| Web App Manifest | Progressive web app metadata |
| Browser Storage | Local preferences and application state |

The current application does not require Node.js, npm, a database server, or a JavaScript build process.

## Getting Started

### Prerequisites

- Git
- A modern web browser
- Python 3 (recommended for running a local development server)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/danialb1375/NSGY-Assistant.git
```

**2. Navigate to the project directory**

```bash
cd NSGY-Assistant
```

**3. Start a local development server**

```bash
python3 -m http.server 8000
```

**4. Open the application**

Navigate to:

`http://localhost:8000`

The application should load in your browser.

To stop the development server, press `Ctrl+C` in the terminal.

### Development Notes

Because the application uses vanilla JavaScript, most changes can be made directly to the source files without compiling or rebuilding the project.

After editing a file, refresh the browser to inspect the changes.

**Service worker note:** Cached resources may prevent updated files from appearing immediately. During development, use your browser's developer tools to inspect or unregister the service worker and clear cached application resources when necessary.

## Project Structure

```text
NSGY-Assistant/
│
├── index.html
├── app.js
│
├── data.js
├── wizard-data.js
├── recommendations-data.js
├── communication-data.js
│
├── styles.css
├── clinical-fields.css
├── communication-preview.css
├── reference-cleanup.css
├── fixed-scale.css
│
├── calculators/
│   ├── core.js
│   ├── gcs.js
│   ├── abc2.js
│   ├── ich.js
│   ├── hunt-hess.js
│   ├── modified-fisher.js
│   ├── tlics.js
│   └── asia

