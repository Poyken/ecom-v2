---
description: Procedure for analyzing and resolving security vulnerabilities or compliance issues.
---

# Workflow: Security & Compliance Audit

## Stage 1: Vulnerability Scanning (Source: docs/13-Security-Architecture.md)

1.  **Static Analysis**: Run `npm audit` and `snyk` to check for compromised dependencies.
2.  **Container Audit**: Scan Docker images for OS-level vulnerabilities.
3.  **Database Check**: Verify that RLS is correctly enabled for ALL tenant-related tables.

## Stage 2: Compliance Review (Source: docs/12-Risk-Management-Compliance.md)

1.  **PII Privacy**: Verification that no Personally Identifiable Information is logged in plaintext.
2.  **GDPR Compliance**: Verify that the "Request Data Export" and "Right to be Forgotten" APIs are functional and strictly governed by tenant context.
3.  **PCI DSS**: Confirm that no credit card data is touching the system's memory/storage (only tokens from providers).

## Stage 3: Remediation & Report

1.  **Patching**: Apply security patches to the `Main` branch.
2.  **Verification**: Re-run the security test suite (docs/09-Testing-Strategy.md).
3.  **Documentation**: Update `docs/09-Risk-Management.md` with any new risks identified.

## Stage 4: Executive Sign-off

1.  Notify the CISO/Tech Lead of the audit results.
2.  Update `changelog.md` with security enhancement records.
