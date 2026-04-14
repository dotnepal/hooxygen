**Date:** April 14, 2026 (Last synced after production launch + callable phone links feature)

**Project:** Informational Website for Gas Refilling Factory

**Purpose:** Build brand trust, showcase services, and generate sales leads

**Decisions:**
- Color palette: Blue & White
- Framework: React + Vite (SSG)
- Deployment: Cloudflare pages
- Website Language: EN/NP toggle
- Accessibility: WCAG 4.5:1 contrast + ARIA labels
- Images: placeholder.com
- Pages: Home, About, Products, Contact, FAQ (accordion style)

---
## Footer Section
- It has 3 sections (left, middle, right)

### Left
    - Contact details (phone, address; email hidden)
### Middle
    - Quick Links (Services, Contact, Products)
### Right
    - Google map embedded on the right side

---
## 1. Website Overview

### 1.1 Purpose & Goals

- **Primary Purpose:** Informational website
- **Key Objectives:**
    - Build brand trust with customers
    - Showcase services and capabilities
    - Generate leads for sales inquiries

### 1.2 Target Audience

- Hospitals and medical facilities
- Clinics and homecare providers
- Industrial users
- Laboratories
- All customer types (no segmentation needed)

### 1.3 Tone & Brand Voice

- Professional
- Friendly and approachable
- Trustworthy and reliable
- Safety-conscious

---

## 2. Products & Services

### 2.1 Gas Types Offered

1. **Oxygen Gas** (Primary - Medical use)
2. **Nitrogen Gas**
3. **Hydrogen Gas**
4. **Carbon Dioxide (CO₂)**
5. **Argon (Ar)**

### 2.2 Product Organization

- **Structure:** Gas Type → Cylinder Sizes
- **Cylinder Capacity Range:** Small to highest capacities (medical purpose)
- **Sizes:** Standard sizes only (no custom orders)

### 2.3 Product Display Information (Per Cylinder)

For each cylinder size, display:

- **Capacity:** In liters
- **Description:** Brief description of the cylinder/use case
- **Availability Indicators:**
    - Available for Rent (✓ or ✗)
    - Available for Sale (✓ or ✗)
- **Pricing:** “Contact for pricing” (no actual prices displayed)

### 2.4 Services Offered

1. **Gas Cylinders** - Available for rent and sale
2. **Cylinder Refilling** - Refill existing cylinders
3. **Bulk Orders** - Large volume orders
4. **Delivery Options:**
- Same-day delivery (local region)
- Few days delivery (regional and national areas)
1. **Pickup:** Customer pickup available at facility

---

## 3. Website Structure & Pages

### 3.1 Main Navigation Menu (Standard)

1. **Home** - Landing page with overview
2. **Services** - Service offerings (Rent, Sale, Refilling, Bulk, Delivery, Pickup)
3. **Products** - Gas types and cylinder details
4. **About Us** - Company information, mission, and service areas
5. **Contact** - Contact form and inquiry

> **Note:** FAQ page exists at `/faq` but is hidden from main navigation and footer links. Accessible via direct URL.

### 3.2 Page Descriptions

### Home Page

- Hero section with company tagline/value proposition
- Brief introduction to services
- Call-to-action buttons (Contact Us, Explore Products)
- Highlights of key services
- Trust-building elements (facility/team photos)

### About Us Page

- Company history and mission
- Facility photos/images
- Service areas coverage (local, regional, national)

### Services Page

- Service cards for 6 offerings: Rent, Sale, Refilling, Bulk Orders, Delivery, Pickup
- CTA section with "Contact Us" and "Call Now" buttons
- Why Choose Us section (safety, certified, delivery, support)

### Products Page

- **Gas Types Section:**
    - Organized tabs for each gas type (Oxygen, Nitrogen, Hydrogen, CO₂, Argon)
    - For each gas type:
        - Description of the gas and its uses
        - List of available cylinder sizes
        - Cylinder details table (Capacity, Rent availability, Sale availability, Pricing CTA)
- **Services Section:**
    - Cylinder refilling services
    - Bulk order capabilities
    - Delivery and pickup options
    - Service area coverage

### Contact Page

- **Contact Form with fields:**
    - Name (required)
    - Email (required)
    - Phone (required)
    - Company Name (required)
    - Gas Type of Interest (dropdown: Oxygen, Nitrogen, Hydrogen, Other)
    - Requirement Type (dropdown: Rent, Sale, Both)
    - Message/Additional Details (optional)
- **Contact Information Display:**
    - Phone number (clickable tel: link for mobile)
    - Physical address
    - Google map embedded
    - *(Email address hidden until correct address is confirmed)*
- **Form Submission:** All inquiries go to single email inbox

### FAQ Page

- **Common Questions to Address:**
    - Gas safety and handling
    - Ordering process and how to place an order
    - Delivery timeframes and coverage areas
    - Rental vs. purchase options
    - Refilling services and frequency
    - Payment and billing
    - Emergency support availability
    - Product specifications and certifications (to be detailed later)

---

## 4. Contact & Lead Generation

### 4.1 Lead Capture

- **Contact Form Fields:**
    - Name
    - Email
    - Phone
    - Company Name
    - Gas Type of Interest
    - Rent/Sale Preference
    - Message (optional)

### 4.2 Contact Methods

- Contact form (primary lead capture)
- Phone number display
- Email address display
- Single inbox for all inquiries

---

## 5. Visual Content

### 5.1 Imagery

- **Facility Photos:** Production and storage areas
- **Product Photos:** Cylinder samples (different sizes)
- **Safety/Professional Images:** As needed for credibility

### 5.2 Content Not Included (For Now)

- Technical specification PDFs
- Detailed purity level information
- Company statistics/metrics
- Blog or news section

---

## 6. Future Considerations (To Brainstorm Later)

- Purity level information for each gas type
- Industry certifications and compliance details (ISO, medical certifications, safety standards)
- Technical specifications and downloadable documents
- Customer testimonials or case studies
- Advanced features (inventory tracking, real-time stock, customer accounts)

---

## 7. Design & Development Notes

### 7.1 Design Approach

- Clean, professional layout
- Mobile-responsive design
- Trust-building visual hierarchy
- Easy navigation
- Clear call-to-action elements

### 7.2 Technology Stack (Confirmed)

- **Runtime:** React 19 + TypeScript
- **Build:** Vite 5 + SSG prerender (static site generation)
- **Styling:** Tailwind CSS v4 (CSS-native `@theme` config, not `tailwind.config.ts`)
- **Fonts:** Sora 400/600/700 (display) + DM Sans 400/500/700 (body) — Google Fonts
- **Routing:** react-router-dom v6
- **i18n:** react-i18next + i18next + i18next-browser-languagedetector (EN/NP toggle, bundled translations)
- **Forms:** react-hook-form (client-side validation)
- **Animations:** Motion library (React) for hero staggered reveals; CSS @keyframes + Intersection Observer for scroll effects
- **Hosting:** Cloudflare Pages
- **Form submission:** Cloudflare Pages Functions (`/api/contact`) with Web3Forms API integration
- **Domain & SSL:** Cloudflare

### 7.3 Accessibility & SEO

- Mobile-friendly design first
- Fast loading times
- Clear metadata and SEO optimization
- Accessible color contrast and font sizing
- Proper heading hierarchy

---

## 8. Development Phases

**Phase 1:** Design mockups and approval — ✓ COMPLETE (2026-03-27)
**Phase 2:** Frontend development — ✓ COMPLETE (2026-03-28) — All 6 pages (Home, About, Products, Services, Contact, FAQ) + CI/CD pipeline
**Phase 3:** SEO optimization — ✓ COMPLETE (2026-04-14) — OG tags, hreflang, sitemap generation, CI/CD validation, keyword expansion
**Phase 4:** Backend integration (contact form, email notifications) — IN PROGRESS
**Phase 5:** Testing and QA
**Phase 6:** Production launch
**Phase 7:** Post-launch optimizations and monitoring

---

## 9. Wireframes

ASCII wireframes and full feature breakdown are in `tasks/1-FEATURES.md`.

**Pages covered:** Global Layout, Home, About, Products/Services, Contact, FAQ

---

## 10. Project Status & Sign-off

**Current Status:** Phase 2-3 Complete ✓, Phase 4 In Progress

**Completed Phases:**
- Phase 1 (Design) — All mockups approved
- Phase 2 (Frontend) — All 6 pages built with responsive design, i18n, animations, accessibility
- Phase 3 (SEO) — Full SEO optimization with OG tags, hreflang, dynamic sitemap generation, CI/CD validation

**Feature tracking:** See `tasks/1-FEATURES.md` (F-001 through F-016 complete) and `CHANGELOG.md` for full implementation history

---

*This specification document outlines the complete plan for the gas factory website. Any updates or changes should be documented and approved before implementation.*
