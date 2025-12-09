# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- **CRITICAL: Hardened Dockerfile to prevent RCE attacks**
  - Implemented multi-stage build to reduce attack surface
  - Added non-root user (`nextjs:nodejs` UID 1001) for container execution
  - Prevented privilege escalation by removing write access to system directories
  - Container now cannot install packages (curl, bash, etc.) preventing cryptominer injection
  - Reduced final image size by ~60% using standalone Next.js build
  - Added proper file ownership with `--chown` flags
  - Used `--ignore-scripts` flag in npm install to prevent malicious script execution

### Changed
- Updated `next.config.ts` to use `output: 'standalone'` for optimized Docker deployment
- Configured container to listen on port 6118 via `PORT` and `HOSTNAME` environment variables
- Switched from `npm install` to `npm ci` for deterministic builds
- Changed CMD to use exec form for proper signal handling

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
