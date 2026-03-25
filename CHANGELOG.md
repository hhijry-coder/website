# Project Changelog — Hassan Consulting Website

## Session Summary (2026-03-18)

### Project Overview
Bilingual (English + Arabic RTL) consulting website for **House of Expertise / بيت الخبرة** — Advanced Systems Center for Consulting and Training, Tabuk University. Built from a `.pen` design file, deployed as static HTML/CSS/JS.

---

### 1. Fixed Broken Images on Deployment

**Problem:** Image paths in HTML used `../` references and filenames with spaces/Arabic characters, which broke when deploying from `src/` as the web root.

**Solution:**
- Copied images into `src/assets/images/` with clean filenames
- Updated all HTML `<img>` references across 6 pages

**Final image mapping (from `.pen` design nodes):**

| File | Source | Used In |
|---|---|---|
| `assets/images/logo.png` | `Gemini_Generated_Image_*.png` | EN navbar logo (index, leadership, contact) |
| `assets/images/logo-ar.jpeg` | `الشعار.jpg.jpeg` | AR navbar logo (index-ar, leadership-ar, contact-ar) |
| `assets/images/profile.jpeg` | `WhatsApp Image*.jpeg` | Dr. Hassan's profile photo (leadership, leadership-ar) |

Section background images use Unsplash URLs directly (no local files needed).

---

### 2. Removed Hero Stats from Landing Pages

Removed the stats section (15+ Years, 50+ Projects, Top 1%) from:
- `src/index.html`
- `src/index-ar.html`

---

### 3. Updated Contact Information

Updated on both `src/contact.html` and `src/contact-ar.html`:

| Field | Old Value | New Value |
|---|---|---|
| Email | `info@consulting.com` | `contact@khibra.org` |
| WhatsApp | `+966 50 000 0000` | `0507638798` (link: `wa.me/966507638798`) |
| Location (EN) | `Riyadh, Saudi Arabia` | `47512 Tabuk, Saudi Arabia` |
| Location (AR) | `الرياض، المملكة العربية السعودية` | `47512 تبوك، المملكة العربية السعودية` |

---

### 4. Added Google Maps Embed

Replaced blank map placeholder with interactive Google Maps iframe for Tabuk University on both contact pages.

**CSS change:** Replaced `.map-placeholder` with `.map-container` + `.map-container iframe` in `src/styles.css`.

---

### Files Modified

| File | Changes |
|---|---|
| `src/index.html` | Fixed logo path, removed hero stats |
| `src/index-ar.html` | Fixed logo path, removed hero stats |
| `src/leadership.html` | Fixed logo + profile image paths |
| `src/leadership-ar.html` | Fixed logo + profile image paths |
| `src/contact.html` | Fixed logo path, updated email/phone/location, added Google Map |
| `src/contact-ar.html` | Fixed logo path, updated email/phone/location, added Google Map |
| `src/styles.css` | Replaced `.map-placeholder` with `.map-container` styling |
| `src/script.js` | No changes (handles contact form animation) |

### Files Created
| File | Description |
|---|---|
| `src/assets/images/logo.png` | EN brand logo (copied from root) |
| `src/assets/images/logo-ar.jpeg` | AR brand logo (copied from root) |
| `src/assets/images/profile.jpeg` | Dr. Hassan's profile photo (copied from root) |

---

### Deployment
- Served via Python `http.server` on `http://localhost:8000` from the `src/` directory
- All 6 pages, 3 images, CSS, and JS verified returning HTTP 200
