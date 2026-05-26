# Phase 1 Implementation Plan — UAP-VID

**Deadline:** early June 2026 (1–2 weeks of slack tolerated, no more)
**Scope:** Phase 1 only (4 deliverables). Phase 2 (dynamic teams, parallel convocatorias) is out of scope but flagged where Phase 1 decisions affect it.

Stack reminder: Next.js 16 + React 18 + Prisma 6 (MongoDB) + NextAuth (Azure AD + creds) + Tiptap 2 + Mantine form + Zod. Server actions called directly from client components via `'use server'` modules in `src/repositories/*`. No LLM SDK installed, no object storage. Deployment is a standalone Docker image via `uap-research-compose.yml`.

Phase 2 lives in the same schema; every Phase 1 change should be Postgres-friendly (no nested embedded docs that wouldn't translate).

**Naming convention:** all code identifiers (Prisma fields, enum values, TypeScript types, functions, variables) are in **English**. Only UI copy is in Spanish. Acronyms that are proper nouns (`FACEA`, `FCS`, `FHECIS`, `FT`, `PIB`, `PIC`, `PRI`, `PTP`) stay as-is.

---

## Deliverable 1 — Protocol types + subtypes + Teacher Thesis structure

This is the largest deliverable in Phase 1 and ships as a single PR (see PR sequence below). It covers:

1. The `protocolType` / `protocolSubtype` fields and section-mapper refactor.
2. The full structure of the `TEACHER_THESIS` type as defined by VID.

### Codebase findings

- Protocol model: `prisma/schema.prisma:85-102`. Sections embedded as a `ProtocolSections` composite type starting at `prisma/schema.prisma:323`.
- The "modality" string at `prisma/schema.prisma:376` (`ProtocolSectionsDuration.modality`) **is already the de-facto subtype** today. Values are hardcoded in the form at `src/modules/protocol/form-sections/duration-form.tsx:57-61`:
  - `Proyecto regular de investigación (PRI)`
  - `Proyecto de investigación desde las cátedras (PIC)`
  - `Proyecto Tesis Posgrado (PTP)`
- `modality` is read in many places, e.g. duration-based validation `src/modules/protocol/form-sections/duration-form.tsx:64-68`, conditional course requirement `src/utils/zod/protocol.ts:262-273`, search by modality `src/repositories/protocol.ts:798-810`, table selects `src/repositories/protocol.ts:768`, budget reports `src/repositories/protocol.ts:68-73`.
- Form section mapper that decides what sections show: `src/modules/protocol/protocol-form-template.tsx:37-45` (note: `methodology` is in the schema/defaults at `:77-88` but is NOT wired into either the section buttons `:376-412` or `sectionMapper`. The `MethodologyForm` is exported `src/modules/protocol/form-sections/index.ts:7` but never rendered. Don't fix it under this deliverable — flag separately so VID confirms.).
- View template: `src/modules/protocol/protocol-view-template.tsx`. Conditional view per type belongs here.
- Section route: `src/app/(authenticated)/protocols/[id]/[section]/page.tsx` (sections are URL-indexed 0–6).

### Schema changes — type / subtype

Add two top-level fields on the `Protocol` model (`prisma/schema.prisma:85`):

- `protocolType String @default("STANDARD")` — closed enum-like. Use `String` (not Prisma `enum`) so the Mongo backfill is trivial and Phase 2 Postgres doesn't lock us in too early; validate via Zod on the boundary. Phase 1 values: `STANDARD`, `TEACHER_THESIS`.
- `protocolSubtype String?` — nullable. Initial seeded list: `PIB`, `PIC`, `PRI`, `PTP` (TBD with VID — see open questions).

**Don't** create separate Prisma models for type/subtype catalogs yet. A code-side constant map suffices and Phase 2 may want to promote to a real model anyway. Putting them in code keeps the migration single-shot.

Define a constants file at `src/utils/protocol-types.ts` with two records: `PROTOCOL_TYPES` and `PROTOCOL_SUBTYPES` (each with `code`, `label`, optional `description`). The dictionaries pattern is established at `src/utils/dictionaries/*`. Mirror that. The Spanish labels for the `code` values:
- `STANDARD` → "Estándar"
- `TEACHER_THESIS` → "Tesis docente"

### Schema changes — Teacher Thesis structure

The `TEACHER_THESIS` type has 8 sections, several of which differ structurally from the standard form. To keep the standard sections untouched, add a single optional nested composite to `ProtocolSections`:

```
type ProtocolSections {
  // ... existing fields untouched
  teacherThesis ProtocolSectionsTeacherThesis?
}
```

All Teacher Thesis fields live under `sections.teacherThesis.*`. New composite types follow the existing `ProtocolSections*` prefix convention.

```prisma
type ProtocolSectionsTeacherThesis {
  identification ProtocolSectionsTeacherThesisIdentification
  duration       ProtocolSectionsTeacherThesisDuration
  description    ProtocolSectionsTeacherThesisDescription
  introduction   ProtocolSectionsTeacherThesisIntroduction
  method         ProtocolSectionsTeacherThesisMethod
  publication    ProtocolSectionsTeacherThesisPublication
  directorsCv    ProtocolSectionsTeacherThesisDirectorCv[]
  // bibliography reuses the shared `sections.bibliography.content` from Deliverable 4
}

type ProtocolSectionsTeacherThesisIdentification {
  year                Int?
  title               String
  postgraduateProgram String   // enum: MASTERS | DOCTORATE
  thesisType          String
  sponsoringFaculty   String   // enum: FACEA | FCS | FHECIS | FT
  thesisCandidate     ProtocolSectionsTeacherThesisTeamMember
  director            ProtocolSectionsTeacherThesisTeamMember
  additionalMembers   ProtocolSectionsTeacherThesisTeamMember[]
  eligibleEvaluators  String[]
}

type ProtocolSectionsTeacherThesisTeamMember {
  name        String
  role        String   // free text for additionalMembers; "Tesista" / "Director" implied for the dedicated fields
  weeklyHours Int
}

type ProtocolSectionsTeacherThesisDuration {
  durationMonths String   // enum: TWELVE | TWENTY_FOUR
  schedule       ProtocolSectionsTeacherThesisScheduleEntry[]
}

type ProtocolSectionsTeacherThesisScheduleEntry {
  semester   Int
  activities String[]
}

type ProtocolSectionsTeacherThesisDescription {
  generalDiscipline       String
  specificArea            String
  researchLine            String
  technicalAbstract       String   // 150–250 words (Zod refinement)
  keywords                String[] // 4–6 entries (Zod refinement)
  applicationField        String   // enum (see below)
  socioeconomicObjective  String   // enum (see below)
  researchType            String   // enum: BASIC | APPLIED | EXPERIMENTAL
}

type ProtocolSectionsTeacherThesisIntroduction {
  stateOfTheArt      String   // Tiptap HTML
  justification      String   // Tiptap HTML
  problemDefinition  String   // Tiptap HTML
  objectives         String   // Tiptap HTML
}

type ProtocolSectionsTeacherThesisMethod {
  // empirical (BASIC/APPLIED/EXPERIMENTAL with quantitative/qualitative/mixed approach)
  design                       String?
  participants                 String?
  location                     String?
  dataCollectionInstruments    String?
  dataCollectionProcedures     String?
  dataAnalysis                 String?
  ethicalConsiderations        String?
  ethicsCommitteeStatus        String?
  // theoretical alternative
  theoreticalMethodology       String?
}

type ProtocolSectionsTeacherThesisPublication {
  publicationType String   // enum: ARTICLE | BOOK
  publicationPlan String   // Tiptap HTML
}

type ProtocolSectionsTeacherThesisDirectorCv {
  name       String
  education  ProtocolSectionsTeacherThesisEducationEntry[]
  indicators ProtocolSectionsTeacherThesisIndicators
}

type ProtocolSectionsTeacherThesisEducationEntry {
  degree      String
  institution String
  date        String
}

type ProtocolSectionsTeacherThesisIndicators {
  publications              String
  rdProjects                String   // I+D+i
  workSupervision           String
  scientificManagement      String
  internationalCommittees   String
  editorialCommittees       String
  awards                    String
}
```

**Enum value lists** (kept in `src/utils/protocol-types.ts`, mirrored as Zod enums in `src/utils/zod/teacher-thesis.ts`):

- `POSTGRADUATE_PROGRAMS`: `MASTERS` ("Maestría"), `DOCTORATE` ("Doctorado")
- `SPONSORING_FACULTIES`: `FACEA`, `FCS`, `FHECIS`, `FT` (labels are the full faculty names)
- `DURATION_MONTHS`: `TWELVE` ("12 meses"), `TWENTY_FOUR` ("24 meses")
- `APPLICATION_FIELDS`: `EXACT_NATURAL_SCIENCES`, `ENGINEERING_TECHNOLOGY`, `MEDICAL_SCIENCES`, `AGRICULTURAL_VETERINARY`, `SOCIAL_SCIENCES`, `HUMANITIES_ARTS`
- `SOCIOECONOMIC_OBJECTIVES` (13 values): `EARTH_EXPLORATION`, `ENVIRONMENT`, `SPACE_EXPLORATION`, `TRANSPORT_TELECOM_INFRASTRUCTURE`, `ENERGY`, `INDUSTRIAL_PRODUCTION`, `HEALTH`, `AGRICULTURE`, `EDUCATION`, `CULTURE_RECREATION_MEDIA`, `POLITICAL_SOCIAL_SYSTEMS`, `GENERAL_KNOWLEDGE`, `DEFENSE`
- `RESEARCH_TYPES`: `BASIC`, `APPLIED`, `EXPERIMENTAL`
- `PUBLICATION_TYPES`: `ARTICLE` ("Artículo"), `BOOK` ("Libro")

**Backfill (~260 rows):**

- Create `src/migrations/protocol-type-backfill.ts` following the pattern of `src/migrations/1-team-assignment.ts:25-69` (Prisma client, findMany, $transaction with long timeout).
- For every protocol set `protocolType = "STANDARD"`. For `protocolSubtype`, derive from `sections.duration.modality` with a string map (`'... (PIC)' → 'PIC'`, etc.); leave `null` if no match.
- Add a one-shot script entry in `package.json` (or run with `tsx src/migrations/protocol-type-backfill.ts` like the others).
- This is a data-only migration. Mongo schema-less means the Prisma `db push` after adding the fields is enough; no separate schema migration step is required for Mongo. The default `@default("STANDARD")` applies to inserts, not reads — that's why you also need the backfill for the ~260 historical rows; if you skip the backfill, reads of `protocolType` on legacy docs will return `null`, not the default.

**Phase 2 callout:** Putting `protocolType` at the top of `Protocol` (not inside sections) is what Phase 2 will need to filter, route to different forms, and apply type-specific evaluation rules. Don't ship Phase 1 with the type buried inside `sections`.

### Backend/API changes

- `src/repositories/protocol.ts` `createProtocol` (`:658`): accept `protocolType` and `protocolSubtype` from the input; default to `'STANDARD'` and `null` if not present. Don't auto-derive subtype from modality in Phase 1 (keep them independent so we can drop `modality` later without surprises). When `protocolType === 'TEACHER_THESIS'`, write the `sections.teacherThesis` payload; leave standard-only fields untouched.
- `updateProtocolById` (`:344`): no special handling needed beyond passthrough plus persisting `sections.teacherThesis`.
- `getProtocolsByRole` (`:703-1043`): add `protocolType` to the `select` (`:723-771`). For Phase 1, no filtering UI needed but expose the field so the table can show it.
- New helpers in `src/utils/teacher-thesis.ts`: `countWords(html)` (strips tags, counts words — used by the 150–250 abstract validation), `isTheoreticalMethod(method)` (checks whether the theoretical branch was filled).

### Frontend changes

- New input on `IdentificationForm` (`src/modules/protocol/form-sections/identification-form.tsx`) — a `FormListbox` for `protocolType` (both `STANDARD` and `TEACHER_THESIS` selectable) and a `FormListbox` for `protocolSubtype` (PIB/PIC/PRI/PTP). Put these at the top of the section, above `title`. Use the `FormListbox` pattern from `src/shared/form/form-listbox.tsx` already used at `duration-form.tsx:23-31`. **Changing `protocolType` mid-creation resets the section tree** (the form template re-renders with `getSectionsForType(newType)`); guard with a confirmation modal once the user has filled anything beyond identification.
- Update `getDefaultSections` and the `useForm` `initialValues` at `src/modules/protocol/protocol-form-template.tsx:76-116` and `src/utils/createContext.ts:10-88` to include `protocolType: 'STANDARD'`, `protocolSubtype: null`. Add a helper `getDefaultTeacherThesisSections()` for the alternate branch.
- Show `protocolType` and `protocolSubtype` badges in `ProtocolMetadata` (`src/modules/protocol/elements/protocol-metadata.tsx:54-79`) next to the state badge.
- Optionally expose a column/filter in `src/modules/protocol/elements/view/protocol-table.tsx` (not strictly required for Phase 1 — Phase 2 will).

**Conditional sections by type:** The form section mapper at `src/modules/protocol/protocol-form-template.tsx:37-45` currently is a flat index→component map. Refactor it to a function `getSectionsForType(protocolType)` that returns an ordered array of `{ key, label, component, schemaPath }`. The section button row (`:376-412`) iterates that array; the URL index stays 0-based but is derived from the array. The `schemaPath` field tells the section component which slice of `sections` it owns — `'introduction'` for standard introduction, `'teacherThesis.introduction'` for the teacher-thesis variant.

**Teacher Thesis form components** (under `src/modules/protocol/form-sections/teacher-thesis/`), one file per section:

1. `identification-form.tsx` — year, title, postgraduate program (Listbox), thesis type (text), sponsoring faculty (Listbox), thesis candidate (name + hours), director (name + hours), additional members (repeatable rows with role/name/hours), eligible evaluators (repeatable text list).
2. `duration-form.tsx` — duration months (Listbox: TWELVE/TWENTY_FOUR), schedule grid (repeatable `{ semester, activities[] }`, 2–10 entries).
3. `description-form.tsx` — general discipline, specific area, research line (each with "ver Anexo A" hint), technical abstract (textarea with live word counter), keywords (chip input, 4–6), application field (Listbox), socioeconomic objective (Listbox), research type (Listbox).
4. `introduction-form.tsx` — 4 Tiptap fields (state of the art, justification, problem definition, objectives) plus a hint about the 25% length recommendation.
5. `method-form.tsx` — conditional rendering: 8 fields for empirical, single textarea for theoretical, with a toggle.
6. `publication-form.tsx` — publication type (Listbox), publication plan (Tiptap).
7. **Bibliography** — reuses `BibliographyForm` from Deliverable 4 (the shared `sections.bibliography.content` field).
8. `directors-cv-form.tsx` — repeatable director cards, each with education entries and 7 indicator text fields.

**Teacher Thesis view components** (under `src/modules/protocol/view-sections/teacher-thesis/`) mirror the form components 1:1, rendering each section read-only.

`protocol-view-template.tsx` branches: if `protocolType === 'TEACHER_THESIS'`, render the teacher-thesis view stack; otherwise render the standard view stack.

### Validation / business rules

- Add `ProtocolTypeSchema`, `ProtocolSubtypeSchema`, and all teacher-thesis sub-schemas in `src/utils/zod/teacher-thesis.ts`. Extend the main `ProtocolSchema` at `src/utils/zod/protocol.ts:280-287` to include `protocolType`, `protocolSubtype`, and an optional `sections.teacherThesis` block. Use a `superRefine` to enforce: when `protocolType === 'TEACHER_THESIS'`, `sections.teacherThesis` must be present and pass `TeacherThesisSchema`.
- Refinements:
  - `technicalAbstract` → 150–250 words.
  - `keywords` → 4–6 entries.
  - `schedule` → 2–10 semester entries; semesters numbered 1..N without gaps.
  - `method` → either all empirical fields filled OR `theoreticalMethodology` filled (one branch required).
  - `additionalMembers` → optional, but if present each row needs name + role + hours.
- Keep the existing `value.duration.modality === 'Proyecto de investigación desde las cátedras (PIC)'` refinement at `src/utils/zod/protocol.ts:262-273` for now — DON'T migrate it to use `protocolSubtype` in this PR. Removing the modality check would break legacy protocols whose modality is set but subtype isn't (after backfill some will have both, some only one). Plan to consolidate after backfill is verified.
- Server-side: `createProtocol` / `updateProtocolById` already parse via `IdentificationTeamSchema` and `ProtocolSchema.safeParse` (callsites at `src/modules/protocol/elements/actions-dropdown.tsx:259` and `src/app/(authenticated)/protocols/[id]/@actions/page.tsx:72`). The schema extension automatically applies validation there.
- Auth: who can change type/subtype? Researcher (creator) during DRAFT; secretary/admin always. Reuse `canExecute(Action.EDIT, ...)` from `src/utils/scopes.ts:136`.

### Open questions / assumptions

- **Teacher Thesis does NOT have a budget section.** The structure VID sent doesn't mention budget; this PR assumes a teacher-thesis protocol skips budget entirely (the evaluation flow needs the equivalent fallback). **Confirm with VID before merging.**
- "Anexo A" (referenced for general discipline / specific area / research line) is treated as free text with a UI hint. Converting to a lookup is a follow-up if VID provides the anexo.
- Teacher Thesis team uses free-text roles + weekly hours — no FCA/FMR categories, no link to budget. Assumption: this is intentional given there's no budget section. Confirm.
- VID has to confirm the exact subtype list. The codebase only knows PRI/PIC/PTP today; the proposal text mentions PIB. Assume `[PIB, PIC, PRI, PTP]` and leave a `TODO(VID)` in `src/utils/protocol-types.ts`.
- Confirm: does subtype change *during* a protocol's lifecycle, or only at creation? Default plan: editable while in DRAFT only, locked thereafter.
- The proposal also lists `Tesis de grado` and `PIC's` as types (`proposal.md:105-111`), but the user explicitly scoped Phase 1 to `STANDARD` and `TEACHER_THESIS` only. The `PIC` mentioned in the proposal as a type conflicts with `PIC` as a subtype — confirm with VID this isn't a conceptual collision. Working assumption: `type ∈ {STANDARD, TEACHER_THESIS} × subtype ∈ {PIB, PIC, PRI, PTP}`.
- The `methodology` section is in the schema but unwired in the form template. Out of scope for this PR; raise with VID separately.

### Risk

Highest of Phase 1 by far. Touches schema (≈12 new composite types), 7 new form components, 7 new view components, the section mapper refactor, defaults in two places, backfill, and the view template branch. Internal mitigation: split into commits per section so the review is manageable (`feat: type/subtype scaffolding`, then one commit per teacher-thesis section, then `feat: view template branch`, then `chore: backfill script`). Smoke-test (a) creating a STANDARD protocol — must be byte-identical to today, (b) creating a TEACHER_THESIS protocol end-to-end, (c) `temp-protocol` localStorage recovery for both types.

---

## Deliverable 2 — AI-suggestion checklist for secretaries (OpenAI)

### Codebase findings

- Secretary's "send to evaluation" step = `Action.ASSIGN_TO_METHODOLOGIST`, allowed only when `ProtocolState.PUBLISHED` (`src/utils/scopes.ts:83-86`). The actual UI is the `EvaluatorsDialog` (`src/modules/protocol/elements/open-evaluators-dialog.tsx`) rendered from `src/app/(authenticated)/protocols/[id]/@evaluators/page.tsx`, with the per-type select at `src/modules/review/elements/review-assign-select.tsx`.
- Important: the proposal says secretaries today "review manually" and the new checklist gates the forward-to-evaluation. That maps to inserting a check **before** the secretary can pick a methodologist in the `EvaluatorsDialog` for `state=PUBLISHED`.
- Existing pattern for per-protocol structured data with state + comment: `ProtocolFlag` composite type (`prisma/schema.prisma:104-109`) and the `FlagsDialog` (`src/modules/protocol/elements/flags/flags-dialog.tsx`). Each flag has `flagName`, `state` (bool), `comment` (string). The upsert helpers are at `src/repositories/protocol.ts:570-649` (`upsertProtocolFlag` / `upsertProtocolFlags`). **This pattern is almost exactly what the checklist needs** — reuse it.

### Schema changes

Two layers.

**Layer A — checklist items (configurable list):**

```prisma
model SecretaryChecklistItem {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  code        String   @unique     // stable key, e.g. "TITLE_LENGTH"
  label       String                // human label shown to secretary
  description String?               // explainer / what to verify
  order       Int                   // display order
  active      Boolean  @default(true)
  // Phase 2-friendly: scope which protocolType this item applies to
  appliesTo   String[] @default([]) // empty = all types; otherwise e.g. ["STANDARD"], ["TEACHER_THESIS"]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Empty container until VID delivers items. **Do not** seed any items; UI shows "VID aún no proveyó los ítems" when the table is empty (so the gate doesn't hard-block secretaries).

**Layer B — per-protocol completion + AI suggestions:**

```prisma
type ProtocolSecretaryCheck {
  itemCode  String
  state     Boolean   @default(false)
  comment   String?
  checkedAt DateTime?
  checkedBy String?   @db.ObjectId  // userId
}

type ProtocolAiSuggestion {
  itemCode    String?
  severity    String            // "INFO" | "WARNING" | "BLOCKING_HINT" (advisory only)
  title       String
  detail      String
  generatedAt DateTime  @default(now())
  protocolHash String?          // sha256 of serialized sections — skip regeneration if unchanged
  model       String?           // e.g. "gpt-4o-mini"
}

// add to Protocol model
secretaryChecks ProtocolSecretaryCheck[]
aiSuggestions   ProtocolAiSuggestion[]
```

Composite-type lists in Mongo are fine for ≤ a few dozen entries per protocol. These map 1:1 to relational tables in Phase 2.

No backfill: existing protocols simply have empty `secretaryChecks` and `aiSuggestions`.

### Backend/API changes

New repository `src/repositories/secretary-checklist.ts`. Server actions:

- `getChecklistItems(protocolType?: string)` — fetches active items, filtered by `appliesTo` when provided.
- `upsertProtocolSecretaryChecks(protocolId, checks[])` — mirror of `upsertProtocolFlags` at `src/repositories/protocol.ts:609`. Sets `checkedAt`/`checkedBy` from server-side `getServerSession`.
- `generateAiSuggestions(protocolId)` — calls the LLM.
- `getAiSuggestions(protocolId)` — read.

Admin CRUD for items isn't needed for Phase 1 — seed via script in `scripts/seed-checklist-items.ts` once VID delivers the list.

**LLM choice — OpenAI** (client already uses OpenAI, so this is the natural fit):

- Install `openai` SDK.
- Single module at `src/utils/llm/openai.ts` exporting `generateChecklistSuggestions(protocolJson, items)` that returns a typed array.
- Model: **`gpt-4o-mini`** for cost/latency (back-office, no streaming needed). ~$0.001 per call at typical protocol size.
- Use **`response_format: { type: 'json_schema', json_schema: {...} }`** for structured output — much more reliable than parsing free-form JSON.
- Schema for the response: `{ suggestions: { itemCode: string | null, severity: "INFO" | "WARNING" | "BLOCKING_HINT", title: string, detail: string }[] }`.
- Re-validate the parsed response with Zod (belt-and-suspenders).

Prompt structure:
- System: explain the secretary's role, list each checklist item `code + label + description`, instruct the model to flag completeness/inconsistency/format issues per item.
- User: the protocol's serialized `sections`. Include `identification.title`, `description.*`, `introduction.*`, `bibliography.content`, `methodology.*`, `duration.modality`. For `TEACHER_THESIS`, include the `sections.teacherThesis.*` payload. Omit budget noise (`budget.expenses.amountIndex` etc.).
- Cache via `protocolHash` (sha256 of the serialized sections): if `aiSuggestions[0].protocolHash === currentHash`, skip regeneration.

Trigger: a "Generar sugerencias IA" button inside the checklist UI. Optionally auto-trigger once when the secretary first opens the dialog for a protocol that has no suggestions yet.

`OPENAI_API_KEY` env var added to `.env` and the Docker env file referenced at `uap-research-compose.yml:11`.

**Integration with the "send to evaluation" gate:**

Hook is in the `@evaluators` route page (`src/app/(authenticated)/protocols/[id]/@evaluators/page.tsx`). Two modes available:
- (a) all required checklist items checked, OR
- (b) admin override pattern from `actions-dropdown.tsx:114-142` reused for secretary override with a confirmation dialog.

**Ship Phase 1 as advisory only**: checklist + AI suggestions live in a new dialog, but the methodologist-assign action stays enabled. The hard gate ships in a follow-up after a week of usage. This also dodges the "client hasn't sent items" risk — without items the gate would block everything.

### Frontend changes

- New component `src/modules/protocol/elements/secretary-checklist-dialog.tsx`, modeled on `flags-dialog.tsx`. For each `SecretaryChecklistItem` render a `FormSwitch` + `FormTextarea` pair plus a panel of AI suggestions with severity color codes (reuse Badge colors).
- Open the dialog from a new BadgeButton in the protocol header next to flags. Gate visibility on `session.user.role === 'SECRETARY' || 'ADMIN'`.
- Add `<SecretaryChecklistDialog>` to `src/app/(authenticated)/protocols/[id]/layout.tsx` near `FlagsDialog` (`:77`), with `OpenSecretaryChecklistDialogButton` plumbed through the context menu (`:99`) following the `OpenFlagsDialog` pattern.

### Validation / business rules

- Zod schemas in `src/utils/zod/secretary-checklist.ts`.
- Server-side authorization: only `SECRETARY` and `ADMIN` may call `upsertProtocolSecretaryChecks` and `generateAiSuggestions`. Use `getServerSession` + role check inline; the repo currently does role gating only in route pages, but the actions are reachable from any client, so add a guard inside the server action.
- AI cost guard: rate-limit `generateAiSuggestions` to once per minute per protocol via an in-memory map or by checking the latest `aiSuggestions[0].generatedAt`.

### Open questions / assumptions

- **Critical:** VID has not sent the checklist items. Ship the UI + storage + LLM scaffolding with an empty items list; the dialog shows "VID aún no proveyó los ítems".
- Confirm the OpenAI account/project to use and where `OPENAI_API_KEY` lives in production.
- Confirm a monthly spending ceiling. `gpt-4o-mini` is cheap; the cache hash + rate limit keep usage bounded.
- Does the AI suggestion need to be persisted? Plan says yes (audit + cache). Confirm — alternative is on-demand only.
- Should the AI also see the researcher's CV (Deliverable 3)? Not in Phase 1 — adds PDF parsing complexity.

### Risk

Highest functional risk in Phase 1 — first LLM integration in the repo, items list still pending. Advisory shipping reduces it significantly. OpenAI's SDK is stable and well-typed; structured outputs via `response_format` remove the JSON-parsing fragility that older Chat Completions had. Secondary risk: API outage breaks the dialog — handle with explicit try/catch, persist a single `INFO` suggestion saying "no se pudo generar", never let the API call block the gate.

---

## Deliverable 3 — CV upload (PDF) for users

### Codebase findings

- `User` model `prisma/schema.prisma:111-129` — has `image String?` (URL) but no file fields.
- Profile page `src/app/(authenticated)/profile/page.tsx` — shows user data, no upload yet. Image is shown only if `user.image` URL exists (`:36-44`).
- User repo `src/repositories/user.ts:190-207` — has generic `updateUserById`.
- No upload code anywhere (`Grep` for `multer|formData|S3|blob|upload`: only hits in pnpm-lock and `download-tabular-data.tsx`, which is a CSV export, not relevant).
- Identification view shows team members at `src/modules/protocol/view-sections/identification-view.tsx:40-67` — that's where the CV link should appear for each team member (next to name).
- Auth: NextAuth session-based. Authenticated routes live under `(authenticated)/` and the layout enforces session (`src/app/(authenticated)/layout.tsx`).

### Schema changes

Add to `User` (`prisma/schema.prisma:111`):

```prisma
cvFileKey      String?      // storage key (path/UUID), not URL
cvUploadedAt   DateTime?
cvFileName     String?      // original filename for download UX
cvFileSize     Int?         // bytes, for display
```

No backfill needed — all `null` for existing users.

**Phase 2 callout:** When the Mongo→Postgres migration happens, these fields move 1:1. Don't go fancy with an `Attachment` model in Phase 1 unless you anticipate needing it for other file types soon (you don't — proposal is CV-only).

### Backend/API changes

**Storage decision:**

Nothing exists. Options ranked for this codebase:

1. **Local filesystem under a mounted volume** (e.g. `/app/uploads`) — simplest, no new dep, but requires a Docker volume mount and the standalone Next build to serve those files via an API route. Backups are someone else's problem.
2. **S3-compatible (MinIO self-hosted, or AWS S3)** — robust, durable, but introduces a new infra component and ~3 env vars.
3. **Vercel Blob / Cloudinary** — out-of-band SaaS, fast to integrate but adds vendor cost and a network hop, and this app isn't on Vercel.

Recommend **option 1** for Phase 1 given the deadline and the fact that the app is already self-hosted via Docker Compose: add a bind-mount `./uploads:/app/uploads` to `uap-research-compose.yml`, configure `UPLOAD_DIR` env var, and store at `${UPLOAD_DIR}/cv/${userId}/${uuid}.pdf`. Then:

- New API route `src/app/api/files/cv/[userId]/route.ts` with `GET` (stream PDF; auth check via `getServerSession`) and `POST` (multipart upload; replaces existing). Use Next 16's native `FormData` parsing in route handlers — no multer.
- Server actions `uploadCv(formData)` and `getCvMetadata(userId)` in a new `src/repositories/cv.ts`. Persistence updates `User.cvFileKey` etc.

PDF validation: check first 4 bytes are `%PDF`; reject larger than 10 MB (`Content-Length` + actual read guard).

**Phase 2 callout:** If MongoDB→Postgres + rehosting happens, local FS uploads need to ride along. Document in the README. If there's any chance the app will run on a serverless/ephemeral host later, do option 2 now.

### Frontend changes

- Add a "CV (PDF)" section to `src/app/(authenticated)/profile/page.tsx` showing current CV metadata (filename, size, upload date, "Reemplazar" / "Descargar" buttons) and an upload `<input type="file" accept="application/pdf">` (use existing `Button` patterns).
- New component `src/modules/profile/cv-upload-form.tsx` — client component, posts FormData to `/api/files/cv/${userId}`, shows toast via `notifications.show` (pattern: `src/modules/protocol/elements/actions-dropdown.tsx:221-225`).
- In team view: `src/modules/protocol/view-sections/identification-view.tsx:54-67`, when a team member has `teamMemberId → userId → cvFileKey`, render a small "Ver CV" link next to the name pointing to `/api/files/cv/${userId}` (browser handles PDF inline). Requires `getTeamMembersByIds` to also pull the user's CV fields — check `src/repositories/team-member.ts` and add the join.
- Same link appears in the Teacher Thesis identification view next to the thesis candidate / director / additional members.
- For admin/secretary users browsing the user list: optionally show CV link in `src/modules/user/user-details-dialog.tsx` body. Low priority for Phase 1.

UI copy: "Cargá un CV en formato PDF resumiendo tu experiencia relevante para la actividad investigadora. Visible para usuarios del sistema." Matches client's "free format, no template, summary relevant to activity, public within system".

### Validation / business rules

- Zod schema for upload metadata in `src/utils/zod/cv.ts` (server side validates Content-Type, MIME, file extension, size). Reject non-PDF with clear error.
- Authorization on `POST`: user can only upload their own CV (`session.user.id === userId`), OR `ADMIN`.
- Authorization on `GET`: any authenticated user (any role) — matches client's "public within the system" requirement.
- File overwrite: replace previous file on disk when a new upload comes in (and update `cvFileName`/`cvUploadedAt`). No versioning in Phase 1.

### Open questions / assumptions

- Assumption: 10 MB max. Confirm with Nico — academic CVs typically <2 MB but be lenient.
- Assumption: storage is local-FS. If production doesn't have a persistent volume, reconsider (decision before coding).
- Should secretaries/admins see CVs of ALL users in the user list, not just team members of a protocol? Current plan: yes via the user details dialog. Confirm.
- "Public within the system" — does that include the researcher themselves seeing their CV is downloadable by others? UI copy makes this explicit.

### Risk

Storage infra decision is the only material risk. Local FS keeps the deadline safe but creates a long-term operations issue (backup/rotation). Build the abstraction so the storage backend is swappable: `src/utils/storage/index.ts` with `putFile`, `getFile`, `deleteFile`, currently FS-backed; can swap to S3 later. PDF inline rendering across browsers is generally fine; if CSP forbids it, fall back to `Content-Disposition: attachment`.

---

## Deliverable 4 — Bibliography → single rich-text field

### Codebase findings

- Today's schema: `ProtocolSectionsBibliography.chart` is an array of `{ author, title, year, url }` (`prisma/schema.prisma:334-343`).
- Form: `src/modules/protocol/form-sections/bibliography-form.tsx` — grid of 4 inputs per row + add/remove buttons.
- View: `src/modules/protocol/view-sections/bibliography-view.tsx` — renders chart as a table.
- Validation: `src/utils/zod/protocol.ts:14-31`.
- Persistence quirk: `createProtocol`/`updateProtocolById` does `ref.year = parseInt(ref.year as any)` on each chart entry (`src/repositories/protocol.ts:386` and `:678-680`). Breaks if `chart` is removed but kept as a fallback for legacy.
- Tiptap is already in deps with a wrapper at `src/shared/form/form-tiptap-textarea.tsx` and editor at `src/modules/elements/tiptap.tsx`. Used in `description-form.tsx`, `introduction-form.tsx`, `methodology-form.tsx`. **You already have a rich-text editor — just use it.**
- Tiptap StarterKit does NOT include the Link extension. Add `@tiptap/extension-link` (one new dep), configured with `autolink: true, openOnClick: false, linkOnPaste: true` to satisfy "auto-format URLs as clickable links". Update the existing Tiptap component if you want all rich-text fields to gain link support, or scope to a new wrapper.

### Schema changes

Add a new field, keep the old one for migration safety:

```prisma
type ProtocolSectionsBibliography {
  chart    ProtocolSectionsBibliographyChart[]   // KEEP for legacy reads
  content  String?                               // NEW: HTML from Tiptap
}
```

This same `content` field is reused by Teacher Thesis (Deliverable 1) — both types share the bibliography slot.

**Backfill (~260 rows):**

Migration `src/migrations/bibliography-concat.ts` (pattern: `src/migrations/1-team-assignment.ts`):

- For each protocol, build an HTML string from `chart`:
  - Wrap each entry as a `<p>`: `Author (Year). Title. <a href="url">url</a>` — URL is hyperlinked if non-empty, otherwise omitted. Year omitted if zero/null.
- Set `content`. Do NOT clear `chart` — keep as a one-shot data archive in case the UI needs to revert.
- Long timeout transaction.

### Backend/API changes

- `src/repositories/protocol.ts:385-388` and `:678-680`: guard the `chart.forEach(... parseInt(ref.year))` so it doesn't blow up when `chart` becomes empty/undefined for new protocols. Simplest: `(data.sections.bibliography.chart ?? []).forEach(...)`.
- New protocols write only `content`; `chart` stays empty.

### Frontend changes

- Replace the entire body of `src/modules/protocol/form-sections/bibliography-form.tsx` with a single `FormTitapTextarea` bound to `sections.bibliography.content`. Keep `Fieldset` + `Legend>Bibliografía`. Drop the table grid and the "Añadir publicación" button entirely.
- Update `src/modules/protocol/view-sections/bibliography-view.tsx` to render `data.content` as HTML (use the `prose` Tailwind class — already applied inside Tiptap output at `src/modules/elements/tiptap.tsx:66`). If `content` is missing (shouldn't be after backfill) fall back to the existing chart rendering.
- Update default values: `src/modules/protocol/protocol-form-template.tsx:94-96` and `src/utils/createContext.ts:85-87` — `bibliography: { chart: [], content: '' }`.

### Validation / business rules

- `src/utils/zod/protocol.ts:14-31` — replace with:
  - `chart` becomes optional (legacy compat).
  - `content` becomes required: `z.string().min(1, { message: 'La bibliografía no puede estar vacía' })`.
- The form section's "isValid" indicator at `src/modules/protocol/protocol-form-template.tsx:295-299` picks this up automatically via `zodResolver(ProtocolSchema)`.

### Open questions / assumptions

- "Auto-format URLs as clickable links" — confirmed achievable via Tiptap's Link extension with `autolink: true`. Decision: should pasted AND typed URLs both become clickable? Both work; default yes to both.
- Backfill format — confirm the "Author (Year). Title. URL" format is acceptable, or whether to use a bulleted list.
- Existing protocols in non-DRAFT states will have a new validation requirement (`content` required). Backfill ensures none are empty; if a protocol is reopened for edit and the backfill missed it, the secretary/admin would be blocked. Mitigation: backfill runs before deploy + defensive fallback in the form that hydrates `content` from `chart` on load if `content` is empty.

### Risk

Lowest-risk deliverable. The only real risk is forgetting to add the Link extension config and shipping "rich-text bibliography" that doesn't make URLs clickable, which is the headline ask. Make link autolinking the first thing to verify in QA. Secondary: existing draft protocols may have bibliography UI in localStorage (the `temp-protocol` cache at `protocol-form-template.tsx:178-193`); the format change makes those entries incompatible. The existing `clearInvalidLocalStorage` (`:51-74`) only checks team hours — extend it to also clear if `bibliography.chart` exists but `bibliography.content` doesn't.

---

## Suggested PR sequence

Four PRs. Two are independent and can ship in parallel; the third depends on the first.

| # | PR | Depends on | Notes |
|---|----|-----------|-------|
| 1 | **Bibliography → Tiptap** | — | Smallest, ship first to build deploy confidence. Includes Tiptap Link extension, schema field, backfill migration run once on staging then prod. |
| 2 | **CV upload (PDF)** | — | Independent of protocol stuff. Includes storage abstraction + local-FS backend + profile UI + team-view link + Docker volume update. |
| 3 | **Protocol type + subtype + Teacher Thesis structure** | PR 1 (Teacher Thesis bibliography reuses `content`) | The big one: schema fields, all teacher-thesis composite types and form/view components, backfill, section-mapper refactor. Splits into commits per section internally. |
| 4 | **Secretary checklist + AI suggestions (OpenAI)** | PR 3 (uses `protocolType` to filter `appliesTo`) | Ships as advisory (non-blocking). Includes new model + composite types, repository, OpenAI module, dialog. Items table starts empty. A follow-up patch flips the gate on once VID has populated items. |

**Feature flags:** Not needed. PR 4's blocking-gate switch can be deferred via a code flag (`secretaryChecksRequired`) flipped in a follow-up, no env var necessary.

## Order of work

Given June deadline + missing client inputs:

1. **Week 1** — PRs 1 and 2 in parallel (no client input needed, low risk, build deploy muscle).
2. **Weeks 2–3** — PR 3 (largest PR; split into commits per teacher-thesis section, review incrementally). Backfill touches ~260 protocols — do it early so data issues surface with time to fix.
3. **Week 4** — PR 4 scaffolding. Even without checklist items, the AI can give general "completeness" suggestions, so it's not blocked on VID.
4. **Week 5** — Buffer for VID inputs on checklist items + any teacher-thesis structure tweaks. Bug fix, QA, deploy.

If VID is still silent on checklist items by mid-May, ship PR 4 advisory-only; the gate-flip follow-up can wait. PR 3 is unblocked the moment VID confirms the no-budget assumption for Teacher Thesis.

## Cross-cutting decisions affecting Phase 2

- **`protocolType` on the Protocol model (not inside sections)** is the discriminator Phase 2 needs to filter protocols by type, show different forms, apply different evaluation rules. Top-level means no migration in Phase 2.
- **Section mapper as a function of `protocolType`** (`getSectionsForType`) is the structural seam for Phase 2's multi-type forms. Without this refactor in Phase 1, the form-template stays a hardcoded mapper and Phase 2 has to do it under more pressure.
- **`SecretaryChecklistItem.appliesTo: String[]`** preempts the case where checklists differ per protocol type.
- **`Convocatory` (current single-active model `prisma/schema.prisma:59-67`) is untouched in Phase 1**, but be careful: any UI saying "convocatoria vigente" (search for `getCurrentConvocatory` in `src/repositories/convocatory.ts` and callsites at `src/repositories/protocol.ts:682` and `:374`) should not have its assumptions hardened further by Phase 1 PRs. When assigning a convocatory in `createProtocol` / `updateProtocolById`, don't add new dependencies on "the single current convocatory" — leave it as-is so Phase 2's parallel-convocatories work has one fewer place to refactor.
- **Storage abstraction for CV uploads** (Phase 1) gives Phase 2 a free path to swap to S3/MinIO if a Mongo→Postgres + new host migration happens together.
- **All new fields use Mongo-friendly defaults and avoid embedded-doc patterns that don't translate to Postgres** (composite types like `ProtocolSecretaryCheck` and the entire `ProtocolSectionsTeacherThesis` tree map to relational child tables 1:1). Don't add `@@unique` inside composite types or other Mongo-specific Prisma features.

---

## Open items needing decision before coding

- **LLM vendor confirmed:** OpenAI (`gpt-4o-mini`). Need to confirm which OpenAI account/project + where `OPENAI_API_KEY` lives in prod.
- **Teacher Thesis budget:** does the type have a budget section at all? The VID structure doesn't mention one. Assumption: **no budget for Teacher Thesis**. Confirm before merging PR 3.
- **Teacher Thesis team model:** free-text roles + weekly hours, no FCA/FMR categories, no budget linkage. Confirm.
- **"Anexo A"** referenced in Teacher Thesis description: stays as free text with hint until VID provides the anexo for catalog conversion.
- **CV storage backend** — assumed local FS under a Docker volume. If prod doesn't have a persistent volume, switch to MinIO/S3 now.
- **CV size cap** — assumed 10 MB. Confirm.
- **Subtype list** — assumed `[PIB, PIC, PRI, PTP]` but codebase only knows `PIC/PRI/PTP`. VID to confirm.
- **Conflict to clarify with VID**: `proposal.md:105-111` lists `PIC` as a *type*, but Viviana's docx comment treats it as a *subtype*. Working read: the proposal's PIC reference is a hangover from when `modality` was the only categorization, real intent is `type ∈ {STANDARD, TEACHER_THESIS} × subtype ∈ {PIB, PIC, PRI, PTP}`. Confirm.
- **`methodology` section quirk** — exists in Prisma schema and `MethodologyForm` is exported, but never rendered. Out of Phase 1 scope; raise with VID before the type refactor.

## Critical files for implementation

- `prisma/schema.prisma` (all four deliverables touch this; the bulk is PR 3's teacher-thesis composite types)
- `src/modules/protocol/protocol-form-template.tsx` (section mapper refactor → `getSectionsForType`)
- `src/modules/protocol/protocol-view-template.tsx` (type-conditional view branch)
- `src/repositories/protocol.ts` (create/update protocol + bibliography chart guard + protocolType passthrough + teacherThesis payload write)
- `src/utils/zod/protocol.ts` and new `src/utils/zod/teacher-thesis.ts` (type/subtype, bibliography.content, all teacher-thesis schemas)
- `src/utils/protocol-types.ts` (new: type / subtype / enum dictionaries)
- `src/app/(authenticated)/protocols/[id]/@evaluators/page.tsx` (integration point for secretary checklist gate, advisory-only in Phase 1)
- `src/utils/llm/openai.ts` (new: OpenAI client + structured-output checklist suggestions)
