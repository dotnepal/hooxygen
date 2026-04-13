**Date:** March 27, 2026

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
    - FAQ
    - Contact details
### Middle
    - privacy
    - terms
    - sitemap
### Right
    - Google map on the right side

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

### 2.2 Product Organization

- **Structure:** Gas Type → Cylinder Sizes
- **Cylinder Capacity Range:** Small to highest capacities (medical purpose)
- **Sizes:** Standard sizes only (no custom orders)

### 2.3 Product Display Information (Per Cylinder)

For each cylinder size, display:

- **Capacity:** In liters
- **Weight:** Filled cylinder weight only
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
2. **About Us** - Company information, mission, and team
3. **Products/Services** - Gas types and ordering options
4. **Contact** - Contact form and inquiry
5. **FAQ** - Frequently asked questions, accordion style

### 3.2 Page Descriptions

### Home Page

- Hero section with company tagline/value proposition
- Brief introduction to services
- Call-to-action buttons (Contact Us, Explore Products)
- Highlights of key services
- Trust-building elements (facility/team photos)

### About Us Page

- Company history and mission
- Team member bios with photos
- Facility photos/images
- Service areas coverage (local, regional, national)
- Why choose us section

### Products/Services Page

- **Gas Types Section:**
    - Organized tabs or sections for each gas type (Oxygen, Nitrogen, Hydrogen)
    - For each gas type:
        - Description of the gas and its uses
        - List of available cylinder sizes
        - Cylinder details table (Capacity, Weight, Rent availability, Sale availability)
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
    - Phone number
    - Email address
    - Physical address (if applicable)
    - Google map
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
- **Team Photos:** Staff and leadership
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

- **Runtime:** React 18 + TypeScript
- **Build:** Vite + `vite-plugin-ssg` (static site generation)
- **Styling:** Tailwind CSS with custom brand tokens
- **Fonts:** Sora (display) + DM Sans (body)
- **Routing:** react-router-dom v6
- **i18n:** react-i18next + i18next
- **Forms:** react-hook-form
- **Hosting:** Cloudflare Pages
- **Form submission:** Cloudflare Pages Functions (Web3Forms as fallback)
- **Domain & SSL:** Cloudflare

### 7.3 Accessibility & SEO

- Mobile-friendly design first
- Fast loading times
- Clear metadata and SEO optimization
- Accessible color contrast and font sizing
- Proper heading hierarchy

---

## 8. Development Phases

**Phase 1:** Design mockups and approval ✓ Complete
**Phase 2:** Frontend development (React + Vite + Tailwind) ← Current
**Phase 3:** Backend integration (contact form, email notifications)
**Phase 4:** Testing and QA
**Phase 5:** Deployment and launch
**Phase 6:** Post-launch optimizations and updates

---

## 9. Wireframes

ASCII wireframes and full feature breakdown are in `tasks/1-FEATURES.md`.

**Pages covered:** Global Layout, Home, About, Products/Services, Contact, FAQ

---

## 10. Approval & Sign-off

**Project Status:** Phase 1 Complete ✓ — Ready for Phase 2 (Frontend Implementation)

**Feature tasks:** See `tasks/1-FEATURES.md` (F-001 through F-014)

---

*This specification document outlines the complete plan for the gas factory website. Any updates or changes should be documented and approved before implementation.*
