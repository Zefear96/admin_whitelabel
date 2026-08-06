# Service Desk Client Search

## Goal

Replace ABS-only lookup on `ServiceDeskClientsPage` with multi-field client search via `searchClients` / `useSearchClients`. Do **not** use `getClientByAbs` / `useClientProfile` on this page.

## UI

- `Select` next to `Search` chooses one field: `absNumber` | `inn` | `phoneNumber` | `firstName` | `lastName`.
- Search `placeholder` describes the selected field (e.g. «Поиск по АБС», «Поиск по ИНН»).
- Submit on Enter / search button with a non-empty value.
- Empty / cleared search shows default `ClientList` (list endpoint).

## Results (hybrid)

| Count | Display |
|-------|---------|
| 0 | Notify «клиент не найден»; no card/table from search |
| 1 | Existing clickable `Card` + `Descriptions` → details by `absClientId` |
| 2+ | `Table` with same columns as `ClientList` → row click to details |

## Hook / API

- `useSearchClients(params: SearchClientsParams)` — object args, `queryKey` includes search fields + page/size/sort.
- Return type: `CustomerListType`.
- `enabled` when at least one of: absNumber, inn, phoneNumber, firstName, lastName is non-empty.
- Page builds params as `{ [selectedField]: value }` only (others omitted; API still sends `"null"` defaults as today).

## Out of scope

- Removing `getClientByAbs` from the API module (may remain for other callers).
- Changing backend contract.
- Pagination UX for search results beyond defaults (page 0, size 20) unless already trivial to wire.
