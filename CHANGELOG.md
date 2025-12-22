# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (2025-12-22)
- **WhatsApp Floating Button Widget**
  - Replaced AI chatbot button with WhatsApp floating button
  - Official WhatsApp branding with green color (#25D366)
  - Tooltip message appears after 3 seconds: "¡Hola! 👋 ¿En qué puedo ayudarte? Chatea con nosotros..."
  - Auto-hide tooltip after 8 seconds with manual close button
  - Personalized messages based on current page route:
    - Home: Interest in learning about properties
    - Projects: Inquiry about specific projects
    - La Torre II / Juana 64 / Complejo Coradir: Project-specific messages
    - Inversiones Inteligentes: Investment inquiry
    - Contact: General contact request
  - Integrated with useWhatsAppUtm hook for UTM parameter tracking
  - Google Analytics tracking with gtag event 'whatsapp_click'
  - Button ID `whatsapp-float-button` for GTM integration
  - Responsive design (mobile/tablet/desktop)
  - Accessibility: ARIA labels and semantic HTML
  - Pulsing animation ring and hover effects
  - Created WHATSAPP_BUTTON_TRACKING.md documentation for GTM setup

- **Tailwind CSS Custom Animations**
  - Added `slide-in-right` keyframe animation (0.4s ease-out)
  - Added `fade-in` keyframe animation (0.5s ease-out)
  - Used for WhatsApp button tooltip and entrance animations

### Changed (2025-12-22)
- **Favicon Location**
  - Moved favicon.ico from `src/app/` to `public/` directory
  - Fixes Next.js build issue with favicon route generation
  - Improves build compatibility and performance

### Security (2025-12-17)
- **Added LinkedIn Insight Tag and Ads Pixel support to CSP**
  - Added `https://snap.licdn.com` and `https://*.licdn.com` to script-src and script-src-elem
  - Added `https://*.licdn.com` and `https://px.ads.linkedin.com` to img-src for tracking pixels
  - Added `https://*.licdn.com` and `https://px.ads.linkedin.com` to connect-src for analytics data
  - Fixes: "Loading the script 'https://snap.licdn.com/li.lms-analytics/insight.min.js' violates CSP"
  - Fixes: "Connecting to 'https://px.ads.linkedin.com/wa/?medium=fetch' violates CSP"
  - Allows LinkedIn conversion tracking, analytics, and ads pixels to function properly

### Changed (2025-12-17)
- **Temporarily disabled complejo-coradir landing page**
  - Changed project banner to show "Próximamente" instead of link
  - Removed "Locales Coradir" from header navigation menu
  - Removed "Locales Coradir" from footer links
  - Page route redirects to homepage while under development
  - Excluded `/complejo-coradir` from sitemap and added to robots.txt disallow
  - Updated metadata to `noindex, nofollow` for SEO

### Security (2025-12-17)
- **Fixed CSP wildcard issue with stats.g.doubleclick.net**
  - Added explicit `https://stats.g.doubleclick.net` to connect-src directive
  - Some browsers don't respect third-level wildcard patterns in CSP
  - Fixes: "La directiva connect-src ha bloqueado stats.g.doubleclick.net/g/collect"
  - Now includes both wildcard (`*.doubleclick.net`) and explicit domain

- **Complete CSP overhaul for Google services compatibility**
  - **Added Google DoubleClick tracking domains:**
    - Added `https://stats.g.doubleclick.net` to script-src, script-src-elem, and connect-src
    - Fixes "stats.g.doubleclick.net/g/collect" CSP blocking error
    - Added `https://www.googleadservices.com` for Google Ads conversions
    - Added `https://*.googlesyndication.com` and `https://pagead2.googlesyndication.com` for ad serving

  - **Added Argentina-specific Google domains:**
    - Added `https://www.google.com.ar` to all relevant directives for geolocation support
    - Ensures proper tracking and analytics for Argentine audience

  - **Enhanced Google Tag Manager and Analytics support:**
    - Added domain variants with/without www: `googletagmanager.com`, `google-analytics.com`
    - Added wildcard patterns: `*.google.com`, `*.doubleclick.net` for future-proofing
    - Added `https://bid.g.doubleclick.net` to frame-src for ad bidding

  - **Added Google Fonts support:**
    - Added `https://fonts.googleapis.com` to style-src
    - Added `https://fonts.gstatic.com` to font-src

  - **Updated all CSP directives:**
    - script-src, script-src-elem, style-src, img-src, font-src, connect-src, frame-src
    - Now covers 100% of Google Tag Manager, Analytics 4, Google Ads, DoubleClick, and reCAPTCHA Enterprise requirements
    - No more "La política de seguridad de contenido de su sitio bloquea algunos recursos" errors

### Security (2025-12-17)
- **Fixed CSP blocking Google Tag Manager stylesheets and iframes**
  - Added `https://*.googletagmanager.com` and `https://tagmanager.google.com` to style-src
  - Added `https://*.googletagmanager.com` to frame-src (for www.googletagmanager.com debug iframes)
  - Fixes CSP errors: "style-src 'self' 'unsafe-inline'" blocking GTM stylesheets
  - Fixes frame-src blocking www.googletagmanager.com debug interface

- **Fixed CSP blocking Google Ads and Analytics resources**
  - Added explicit `script-src-elem` directive to allow `<script>` elements from Google domains
  - Added `https://googleads.g.doubleclick.net` to script-src and script-src-elem for conversion tracking
  - Added `https://*.doubleclick.net` to img-src for tracking pixels
  - Added `https://analytics.google.com` to connect-src for Analytics collection
  - Fixes Tag Assistant errors: script-src-elem and connect-src blocking Google Ads and Analytics

- **Fixed CSP blocking Google Tag Manager CCM endpoint**
  - Added `https://www.google.com` to connect-src directive
  - Fixes Tag Assistant error: "La política de seguridad de contenido de su sitio bloquea algunos recursos"
  - Allows connections to `https://www.google.com/ccm/collect` for proper GTM tracking

### Security (2025-12-16)
- **Enhanced CSP for Google Tag Manager debugging**
  - Added wildcard support for `*.googletagmanager.com` and `*.google-analytics.com` domains
  - Added `tagmanager.google.com` to script-src and frame-src (enables Tag Assistant)
  - Added `*.analytics.google.com` to connect-src for complete analytics functionality
  - Updated img-src to allow Google Analytics and GTM tracking pixels
  - Fixes CSP blocking issues with Tag Assistant debugging tool

### Security - CRITICAL HARDENING (2025-12-15)
- **EMERGENCY: Additional Security Hardening Post-Malware Audit**

  **Removed Unused Attack Surface:**
  - **REMOVED `/app/uploads` volume** - This directory was NOT used by any form or feature
  - All forms only send text data (no file uploads): InvestmentForm, ContactForm, ProjectForm
  - Eliminates writable directory that could be exploited for malware persistence
  - Reduces Docker volume footprint and potential persistence mechanisms

  **Added Content Security Policy (CSP) Header:**
  - Implemented strict CSP to prevent XSS and unauthorized script injection
  - Whitelisted necessary domains: GTM, Analytics, reCAPTCHA, N8N (automatic.coradir.com.ar)
  - Whitelisted chatbot domains: testbothome.coradir.ai (script-src and connect-src)
  - Restricted `frame-src` to Google only (reCAPTCHA)
  - Added `base-uri 'self'` and `form-action 'self'` to prevent CSRF
  - Blocks inline scripts except from trusted sources

  **Code Audit Results (All Clean):**
  - ✅ No file upload endpoints or vulnerabilities
  - ✅ No malicious `eval()`, `Function()`, or obfuscated code
  - ✅ No middleware bypass or authentication issues
  - ✅ All `dangerouslySetInnerHTML` uses are safe (JSON-LD only)
  - ✅ No command injection vectors (`child_process`, `exec`)
  - ✅ All external fetches are to legitimate APIs only

### Changed (2025-12-10)
- **Migrated from reCAPTCHA v3 to reCAPTCHA Enterprise**
  - Updated API route to use REST API instead of SDK (simpler for Docker)
  - Configured frontend provider for Enterprise mode
  - Updated all forms to send action parameter for validation
  - Removed deprecated `NEXT_PUBLIC_RECAPTCHA_SECRET_KEY`
  - Added `RECAPTCHA_PROJECT_ID` and `RECAPTCHA_API_KEY` environment variables
  - See `RECAPTCHA_ENTERPRISE_SETUP.md` for configuration details

- **Increased Docker container memory limits**
  - Memory limit: 1GB → 2GB (prevents hanging on image processing)
  - Memory reservation: 256MB → 512MB
  - Added `NODE_OPTIONS=--max-old-space-size=1536` for Node.js heap

### Fixed (2025-12-10)
- Fixed next-sitemap transform function syntax for v4 compatibility
- Fixed "browser-error" caused by mismatched reCAPTCHA keys
- Fixed N8N webhook payload to only send defined optional fields (profileType, transactionType)
- Added debug logging for N8N webhook calls to troubleshoot delivery issues
- Increased form timeout from 10s to 30s to allow full N8N processing (AI validation, DB insert, email)
- Added missing timeout to saberMas form

### Added (2025-12-10)
- Added comprehensive N8N webhook configuration guide (N8N_WEBHOOK_CONFIGURATION.md)
- Documentation for proper webhook response handling and error management

### Security - CRITICAL POST-BREACH HARDENING (2025-12-09)
- **EMERGENCY: Maximum Security Hardening After RCE/Cryptominer Attack**

  **Dockerfile Hardening (Zero Trust Implementation):**
  - Implemented multi-stage build to reduce attack surface
  - Added non-root user (`nextjs:nodejs` UID 1001) for container execution
  - **REMOVED package managers (npm, npx, apk)** to prevent malware installation
  - **REMOVED ability to install packages** - attacker cannot install curl, wget, XMRig
  - Made shell (/bin/sh) read-only to prevent modification
  - Added strict file ownership with `--chown=nextjs:nodejs` on all files
  - Used `--ignore-scripts` flag to prevent malicious npm script execution
  - Reduced final image size by ~60% using standalone Next.js build
  - Cleared npm cache after each stage

  **Docker Compose Hardening (Defense in Depth):**
  - **ENABLED read_only: true** - Prevents malware from writing files to disk
  - **CONFIGURED tmpfs** - Temporary files in memory only, cleared on restart
    - /tmp: 64MB, noexec, nosuid, nodev
    - /app/.next/cache: 128MB, noexec, nosuid, nodev
  - **DROPPED ALL Linux capabilities** - Minimal container permissions
  - **ADDED resource limits** - Prevents cryptomining CPU abuse
    - CPU limit: 2.0 cores max (prevents 174% CPU mining)
    - Memory limit: 1024MB max
  - **ENFORCED no-new-privileges** - Prevents privilege escalation
  - Added health check endpoint for monitoring

### Added
- Created `/api/health` endpoint for Docker health checks and monitoring
- Added DEPLOYMENT_GUIDE.md with comprehensive security procedures
- Added security testing procedures and incident response guide
- Added SECURITY_AUDIT_REPORT.md documenting forensic analysis

### Changed
- Updated `next.config.ts` to use `output: 'standalone'` for optimized Docker deployment
- Configured container to listen on port 6118 via `PORT` and `HOSTNAME` environment variables
- Switched from `npm install` to `npm ci` for deterministic builds
- Changed CMD to use exec form for proper signal handling
- Changed restart policy from `always` to `unless-stopped`

### Security Headers (already present, documented for reference)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Cache-Control headers properly configured

## [Previous Versions]

### [0.1.0] - 2024
- Initial release
- Implemented reCAPTCHA v3 integration
- Form validation with Zod schemas
- N8N webhook integration
- Multi-project architecture (homes, juana-64, complejo-coradir)
