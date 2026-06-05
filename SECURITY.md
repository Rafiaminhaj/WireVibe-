# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Actively supported |

## 🔒 Security Model

WireVibe follows a **zero-trust, client-side-only** architecture:

- **No Server:** WireVibe runs entirely in the browser. There is no backend server.
- **No Data Collection:** We do not collect, store, or transmit any user data.
- **BYOK (Bring Your Own Key):** API keys are stored exclusively in `localStorage` and never leave the user's browser.
- **No Cookies:** WireVibe does not use cookies or tracking scripts.

## 🛡️ API Key Safety

When users configure a Gemini API key:
1. The key is stored in `localStorage` (browser-only storage)
2. API calls go directly from the user's browser to Google's servers
3. WireVibe has **zero server-side infrastructure** — keys cannot be intercepted
4. Users can clear their key at any time via Settings → Save (empty field)

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Email:** rafiaminhaj423@gmail.com
2. **Subject:** `[SECURITY] WireVibe Vulnerability Report`
3. **Include:** Steps to reproduce, potential impact, and suggested fix

We will respond within **48 hours** and work to patch the issue promptly.

> ⚠️ Please do **not** open public GitHub issues for security vulnerabilities.
