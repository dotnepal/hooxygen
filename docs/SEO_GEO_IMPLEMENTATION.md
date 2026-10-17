# SEO & GEO Implementation Specification for *HO Oxygen*

*Document status:*
Status: DRAFT
Last updated at: 2026-10-17

*Agents:*
- main agent - Sonnet, effort: high
- subagent - Sonnet, effort: medium

**Target website:** https://www.hooxygen.com.np/

**Primary objective:** Improve organic search visibility and make HO Oxygen easy for search engines and AI agents to identify, understand, retrieve, and recommend as a legitimate oxygen and industrial-gas supplier in Nepal.

---

# 1. Objectives

The implementation must make the following facts explicit, consistent, crawlable, and machine-readable:

- Company: **HO Oxygen Industries Pvt. Ltd.**
- Country: **Nepal**
- Primary location: **Parashpur, Nepalgunj, Banke, Nepal**
- Core offering: Medical and industrial gases
- Key offering: Oxygen gas and oxygen cylinders
- Services: Cylinder rental, sale, refilling, bulk orders, delivery
- Other gases currently represented on the site: Argon, carbon dioxide, hydrogen, nitrogen
- Customers/industries: Hospitals, clinics, homecare providers, industrial users, laboratories, manufacturing, food processing, etc., where factually applicable

> **Important:** Do not invent company facts, certifications, capacities, service areas, prices, customers, or product specifications. Where information is unavailable, create a clearly marked placeholder for the site owner rather than fabricating content.

---

# 2. Phase 0 — Baseline Audit

Before making changes:

1. Crawl the entire website.
2. Produce an inventory of:
   - URLs
   - Page titles
   - Meta descriptions
   - H1/H2 headings
   - Canonical URLs
   - Indexability
   - Images and alt text
   - Internal links
   - Structured data
   - HTTP status codes

3. Identify:
   - Duplicate titles
   - Duplicate meta descriptions
   - Missing H1s
   - Missing canonical tags
   - Broken links
   - Orphan pages
   - Redirect chains
   - Non-indexable important pages
   - Duplicate URLs

4. Preserve existing functionality and design unless a change is required for SEO, accessibility, performance, or content clarity.

### Acceptance Criteria

- A baseline audit report exists before structural SEO changes are applied.
- No existing important functionality is broken.

---

# 3. Phase 1 — Technical SEO

## 3.1 Canonicals

Every indexable page must contain a self-referencing canonical URL.

Rules:

- Use HTTPS.
- Use the preferred canonical URL format consistently.
- Avoid query parameters in canonical URLs unless intentionally required.

---

## 3.2 Sitemap

Create/update:

`/sitemap.xml`

Include all canonical, indexable, valuable pages.

Do not include:

- Redirects
- 404 pages
- Noindex pages
- Duplicate URLs
- Utility pages with no search value

---

## 3.3 Robots.txt

Create/update:

`/robots.txt`

Requirements:

- Do not block normal search-engine crawlers from important pages.
- Reference the sitemap.
- Do not use robots.txt as a substitute for `noindex`.

Example:

```text
User-agent: *
Allow: /

Sitemap: https://www.hooxygen.com.np/sitemap.xml
```

## 3.4 Indexability

Important pages must:

- Return HTTP 200
- Be indexable
- Have a canonical
- Be reachable through internal links
- Contain meaningful HTML content

## 3.5 Internal Linking

Create a logical hierarchy:

```
Home
├── Products
│   ├── Medical Oxygen
│   ├── Industrial Oxygen
│   ├── Oxygen Cylinders
│   └── Other Industrial Gases
│
├── Services
│   ├── Oxygen Cylinder Rental
│   ├── Oxygen Cylinder Sale
│   ├── Oxygen Cylinder Refilling
│   ├── Bulk Gas Orders
│   └── Gas Delivery
│
├── About
├── FAQ
└── Contact
```

Use descriptive anchor text such as:

- Medical Oxygen
- Industrial Oxygen
- Oxygen Cylinders
- Oxygen Cylinder Refilling
- Oxygen Cylinder Rental
- Oxygen Supplier in Nepalgunj

Avoid generic anchors such as:
- Click Here
- Read More
- Learn More

where a descriptive anchor is practical.

## 4. Phase 2 — Company Entity & Homepage

The homepage should make the company identity and location substantially clearer.

### 4.1 Homepage Title
Recommended:

```
Oxygen Cylinder & Industrial Gas Supplier in Nepal | HO Oxygen Industries Pvt. Ltd.
```
Keep the title concise while retaining important entities.

### 4.2 Homepage H1
Recommended:

```
HO Oxygen Industries Pvt. Ltd. — Oxygen & Industrial Gas Supplier in Nepal
```

### 4.3 Homepage Introductory Copy

Add a concise paragraph immediately below the H1:

   HO Oxygen Industries Pvt. Ltd. is a medical and industrial gas supplier based in Nepalgunj, Banke, Nepal. We supply oxygen and other industrial gases and provide cylinder rental, sales, refilling, bulk orders, and delivery services, subject to availability and service area.

Adjust the wording to match verified company facts.

### 4.4 Homepage Sections

Add clear sections for:

1. About HO Oxygen
2. Medical Oxygen
3. Industrial Oxygen
4. Oxygen Cylinders
5. Other Industrial Gases
6. Cylinder Services
7. Industries Served
8. Service Areas
9. Frequently Asked Questions
10. Contact / Order

### 4.5 Important Company Information

Clearly expose in HTML text:

- Legal/company name
- Physical address
- Phone
- Email
- Operating hours
- Website
- Service area
- Company history
- Certifications/licenses, if applicable

## 5. Phase 3 — Page Architecture
Create dedicated pages for high-value search intent.

Recommended URL structure:

```
/
├── about
├── contact
├── products
│   ├── oxygen
│   ├── medical-oxygen
│   ├── industrial-oxygen
│   ├── oxygen-cylinders
│   ├── argon
│   ├── carbon-dioxide
│   ├── hydrogen
│   └── nitrogen
│
├── services
│   ├── oxygen-cylinder-rental
│   ├── oxygen-cylinder-sale
│   ├── oxygen-cylinder-refilling
│   ├── bulk-gas-orders
│   └── gas-delivery
│
├── oxygen-supplier-nepal
├── oxygen-supplier-nepalgunj
└── faq
```
Only create pages for products/services that HO Oxygen actually provides.

Do not create thin pages merely to target keywords.

## 6. Phase 4 — Oxygen Cylinder SEO
Create a comprehensive page:

`/products/oxygen-cylinders`

Target search intent around:
- Oxygen cylinder Nepal
- Oxygen cylinder supplier Nepal
- Oxygen cylinder supplier Nepalgunj
- Medical oxygen cylinder Nepal
- Industrial oxygen cylinder Nepal
- Oxygen cylinder sale Nepal
- Oxygen cylinder rental Nepal
- Oxygen cylinder refilling Nepal
The page should clearly explain, where applicable:
- Cylinder availability
- Cylinder sizes/capacities
- Medical vs industrial use
- Sale
- Rental
- Refilling
- Bulk orders
- Delivery
- Ordering process
- Safety information
- Service area
- Contact details

Do not publish prices/specifications unless verified by the business.

## 7. Phase 5 — Medical & Industrial Oxygen

Create separate pages.

```
/products/medical-oxygen
```

Explain:

- Intended users
- Product/service availability
- Cylinder options
- Ordering/refilling
- Delivery
- Applicable quality/certification information

```
/products/industrial-oxygen
```

Explain:

- Industrial applications
- Available cylinder/bulk options
- Ordering
- Refilling
- Delivery
- Applicable specifications

**Important:** Do not make medical or purity claims without verified documentation.

## 8. Phase 6 - Services

Create individual service pages where genuinely offered.

**Oxygen Cylinder Rental**

Explain:

- Who can rent
- Rental process
- Cylinder return
- Applicable terms
- Delivery/pickup

**Oxygen Cylinder Sale**

Explain:

Available cylinder options
- Ordering
- Availability
- Delivery/pickup
- Oxygen Cylinder Refilling

Explain:

Refill process
Accepted cylinder types
Turnaround time, if verified
Pickup/delivery
Bulk Gas Orders

Explain:

Bulk ordering
Industries served
Inquiry process
Gas Delivery

Explain:

Delivery locations
Delivery process
Minimum order requirements, if applicable
