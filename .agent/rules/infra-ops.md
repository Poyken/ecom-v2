# Rule: Infrastructure, Monitoring & Business Continuity

## 1. Environment Guardrails (Source: docs/08-Environment-Deployment.md)

- **Isolation**: Production secrets must never be accessible in Dev/Staging environments.
- **Version Control**: Every deployment must be tagged with a git commit hash and visible in the App's "About" or "Health" endpoint.

## 2. Monitoring & Alerting (Source: docs/15-Monitoring-Alerting.md)

- **Key Metrics**: Monitor 4 Golden Signals: Latency, Traffic, Errors, and Saturation.
- **Thresholds**:
  - Alert (P1) if API Error Rate > 1% over 5 mins.
  - Alert (P0) if System Uptime < 99.9%.
  - Alert (P2) if P95 Latency > 2s.

## 3. Disaster Recovery (Source: docs/16-Disaster-Recovery.md)

- **RTO/RPO Compliance**:
  - **RTO (4 hours)**: All recovery scripts must be automated and tested quarterly.
  - **RPO (15 mins)**: Database backups (WAL/Point-in-time) must occur every 15 minutes.
- **Backups**: Encrypt all backup files at rest using AES-256 before uploading to S3 Cold Storage.

## 4. Operational Maintenance (Source: docs/10-Operations-Maintenance.md)

- **Maintenance Windows**: Scheduled maintenance must occur during low-traffic periods (2 AM - 4 AM UTC+7).
- **Communication**: Use the Public Status Page (Sentry/Cachet) to notify tenants of planned downtime.
