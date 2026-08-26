# Task 1 Report: HSC Mathematics course/prerequisite model

Status: DONE

## Files changed

- `src/features/hsc-maths-pathway/hsc-maths-pathway-model.ts`
- `src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts`
- This report file.

No React components or `Mathematics.tsx` were edited.

## TDD evidence

### RED

Command:

```powershell
node --test --experimental-strip-types src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts
```

Observed failure: exit code 1 with `ERR_MODULE_NOT_FOUND` for `hsc-maths-pathway-model.ts`, imported by the new test. This confirmed the tests failed because the production model did not yet exist.

### GREEN

Commands:

```powershell
node --test --experimental-strip-types src/features/hsc-maths-pathway/hsc-maths-pathway.test.ts
npm.cmd run typecheck
```

Complete pass summary: 3 model tests passed, 0 failed, 0 skipped; TypeScript application typecheck completed with exit code 0.

## Commit

Model and test commit: `8ed3334` (`feat: model HSC maths course pathways`)

## Self-review notes

- The public `HscStreamId`, `HscStream`, `HSC_STREAMS`, `getHscStream`, and `getActivePath` interfaces match the brief.
- Active paths preserve prerequisite ordering: Standard is independent; Extension 1 includes Advanced; Extension 2 includes Advanced and Extension 1.
- `getActivePath` returns a copy, avoiding mutation of the internal route definitions.
- Extension 2 is marked Year 12 only and carries the exact prerequisite labels required by the brief.
- `git diff --cached --check` passed before commit.

## Concerns

None for Task 1. The report is intentionally a separate documentation commit so the model commit SHA remains directly identifiable.
