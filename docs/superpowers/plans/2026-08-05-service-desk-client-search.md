# Service Desk Client Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Multi-field client search on ServiceDeskClientsPage with Select + Search, hybrid Card/Table results, no getClientByAbs.

**Architecture:** Page owns search field/value state; `useSearchClients` calls `searchClients`. Idle → ClientList; 1 hit → Card; 2+ → Table.

**Tech Stack:** React, Ant Design, TanStack Query

## Global Constraints

- Do not use `getClientByAbs` / `useClientProfile` on this page.
- Search params: absNumber, inn, phoneNumber, firstName, lastName.
- Match existing Ant Design / ClientList patterns.

---

### Task 1: Fix `useSearchClients`

**Files:**
- Modify: `src/hooks/client/useSearchClients.ts`

- [x] Accept `SearchClientsParams` object
- [x] Return type `CustomerListType`
- [x] `queryKey` includes search fields + page/size/sort
- [x] `enabled` only when a search field is non-empty (not page/size/sort alone)

### Task 2: Wire `ServiceDeskClientsPage`

**Files:**
- Modify: `src/pages/service-desk/clients/ServiceDeskClientsPage.tsx`

- [x] Select + Search (Space.Compact or Space)
- [x] Placeholders per field
- [x] Hybrid results + ClientList when idle
- [x] Notify on empty results / errors
- [x] Remove useClientProfile usage
