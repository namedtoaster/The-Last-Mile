# Domains and the web pages the stores need

How to get the pages the stores ask for onto a domain you own, and an email address
on it. Read with step 0 of the ship skill. Registrar and host screens move, so give
steps only from the linked pages, re-read now (the fact-check skill reads the saved
copies when a page is blocked).

## Do you need a domain?

Not for the stores. They need public pages (privacy policy, support, and account
deletion when the app has accounts), and a free address such as a GitHub Pages or
Vercel subdomain meets that. Buy a domain when the app needs any of these:

- an email address on it (support@, hello@)
- links that open the app (universal links and App Links need a site you control)
- an address that should never move, since the privacy link is built into the app

Buy it before the first store build, so the address inside the app is final.

## The one DNS rule that trips everyone

The bare domain (example.com, written `@`) cannot use a CNAME record, because it
already holds other records. Hosts handle this three ways:

- **A record** to an IP address the host publishes (GitHub Pages, Netlify fallback).
- **ALIAS, ANAME or a flattened CNAME**, which behaves like a CNAME at the bare
  domain. Not every DNS provider offers one.
- **Use www as the main address** and redirect the bare domain to it.

`www` and other subdomains usually use a plain CNAME to the host's target.

## Registrars

| Registrar | Where DNS records are added | Bare domain to a hostname | Free email forwarding |
| --- | --- | --- | --- |
| Porkbun | Domain Management, the domain's DNS, Add Record. Leave Host blank for the bare domain | ALIAS record (Porkbun calls it "ALIAS - CNAME flattening") | Yes: up to 20 addresses per domain, no catch-all. Needs the domain's MX records pointing to Porkbun, so not alongside another mail host |
| Namecheap | Domain List, Manage, Advanced DNS, Host Records, Add New Record. Host Records exist only on Namecheap BasicDNS, FreeDNS or PremiumDNS | ALIAS record | Check the current page |
| Cloudflare | DNS records for the zone | CNAME at `@`, flattened automatically | Email Routing (needs Cloudflare DNS) |
| GoDaddy | Domain Portfolio, the domain, DNS, Add New Record | Railway lists GoDaddy as unable to: move DNS to Cloudflare, or use www | Check the current page |
| Squarespace Domains | Domains, the domain, DNS, DNS Settings, Custom Records | ALIAS records, with DNSSEC switched off first. Squarespace has a DNS preset for Netlify, Railway and Vercel, but Railway lists Squarespace as unsupported: try the preset, test with `dig`, or move DNS to Cloudflare | Check the current page |

Sources and status:

- Porkbun: [How to add DNS records](https://kb.porkbun.com/article/231-how-to-add-dns-records-on-porkbun), [Connecting a root domain when the host gives no IP](https://kb.porkbun.com/article/85-how-to-connect-your-root-domain-when-your-web-host-wont-provide-an-ip-address), [Email forwarding](https://kb.porkbun.com/article/10-how-to-set-up-email-forwarding-service). **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).
- Namecheap: [Host records](https://www.namecheap.com/support/knowledgebase/article.aspx/434/2237/how-do-i-set-up-host-records-for-a-domain/), [ALIAS record](https://www.namecheap.com/support/knowledgebase/article.aspx/10128/2237/how-to-create-an-alias-record/). **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-18).
- Cloudflare: [Zone apex record](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-zone-apex/), [Email Routing](https://developers.cloudflare.com/email-service/get-started/route-emails/). **Status:** Checked 2026-10-12 (saved copy of the official page).
- GoDaddy: [Add a CNAME record](https://www.godaddy.com/en/help/add-a-cname-record-19236). **Status:** Checked 2026-10-12 (saved copy of the official page).
- Squarespace: [DNS records for web hosting](https://support.squarespace.com/hc/en-us/articles/31119879125645-DNS-records-for-web-hosting). **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).

## Hosts

| Host | What it asks for |
| --- | --- |
| Railway | A CNAME to the target Railway shows, plus a TXT record to verify; without the TXT the domain answers 404. The bare domain needs a provider with CNAME flattening or ALIAS (Railway names Cloudflare, Namecheap, DNSimple and bunny.net; not GoDaddy, Route 53, Azure, Hostinger, NameSilo, Hurricane Electric or Squarespace). Behind the Cloudflare proxy, set Cloudflare SSL/TLS to Full, not Full (Strict). |
| Vercel | The values shown in the project's domain settings. |
| Netlify | ALIAS, ANAME or flattened CNAME at the bare domain, or an A record to its published IP. |
| GitHub Pages | Add the custom domain in the repository's Pages settings first, then the DNS records: A records to GitHub's published IPs for the bare domain, CNAME for www to `<user>.github.io`. GitHub recommends verifying the domain first. |

Sources and status:

- Railway: [Working with domains](https://docs.railway.com/networking/domains/working-with-domains). **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).
- Vercel: [Set up a custom domain](https://vercel.com/docs/domains/set-up-custom-domain). **Status:** Checked 2026-10-12 (saved copy of the official page).
- Netlify: [Configure external DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/). **Status:** Checked 2026-10-12 (saved copy of the official page).
- GitHub Pages: [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). **Status:** Checked 2026-10-19 (saved copy fetched 2026-10-12).

## After adding records

- DNS can take minutes to a few days to reach everyone. Check with
  `dig +short example.com` and `dig +short www.example.com`.
- A CNAME cannot share its name with any other record. A, MX and TXT records can sit on the same name together.
- Open every page the stores will link to in a private window before submitting.
- Test email forwarding from an address other than the one it forwards to, or some
  providers drop it as a loop.

## When the site lives elsewhere

Often the pages are served by a server that belongs to another project (a studio
site, another app), through a rewrite on the domain's host name. That works for the
store pages, but record it, and check what it can serve. (Added 2026-10-18.)

- **Write it in the rules file:** which repo and service serve the domain, and that
  editing the pages means editing that repo. Otherwise a later session searches this
  repo for hosting that is not there, or edits a draft copy that is not live.
- **A static only rewrite cannot answer app links.** If every path on the domain
  becomes a file lookup, no API route, server rendered invite page or generated
  `/.well-known/apple-app-site-association` can answer there. Before pointing
  universal links, App Links, invite links or an API at the domain, request
  `https://example.com/.well-known/apple-app-site-association` and one real invite
  path. A 404 means the setup cannot serve them yet.
- **The fix is a choice, not a default:** give the app its own service for the
  domain (or a subdomain), or add a carve out for those paths in the other server's
  rewrite. Record that the choice is open until the first such link is needed.
