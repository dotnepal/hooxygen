# Cloudflare Page functions

Contact endpoint: /api/contact

Documentation available at https://developers.cloudflare.com/pages/functions/ 

## Update Wrangler.toml

[[services]]
binding = "CONTACT_MAILER"
service = "contact-mailer"

---
The above config should add a new bindings under project (ho-gas-factory) in bindings sections.

## Verify that bindings is correct

visit Cloudflare dashboard > Worker & Pages > project (ho-gas-factory)

Under bindings section in variable name
---
Binding Name: CONTACT_MAILER
service-name: contact-mailer
