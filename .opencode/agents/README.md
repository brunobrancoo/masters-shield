# Master's Shield - Agent Setup

This directory contains the agent system for coordinating the D&D character form refactoring project.

## Agent Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   ORCHESTRATOR AGENT                        │
│  - Defines project objectives                               │
│  - Coordinates between agents                                │
│  - Tracks implementation phases                             │
│  - Manages dependencies                                    │
└────────────┬──────────────────────────┬────────────────────┘
             │                          │
             │                          │
             ▼                          ▼
┌────────────────────┐      ┌──────────────────────┐
│   CODING AGENT    │      │   TESTING AGENT      │
│  - Implements code │      │  - Validates changes  │
│  - Follows plan   │◀────▶│  - Tests features    │
│  - Refactors     │      │  - Reports issues    │
│  - Types safety  │      │  - Ensures quality  │
└────────────────────┘      └──────────────────────┘
```

## Agent Files

### 1. `orchestrator.md`
**Role**: Project coordinator and task manager

**Responsibilities**:
- Define project objectives and scope
- Break down work into phases
- Manage dependencies between phases
- Coordinate Coding and Testing agents
- Track progress against checklist
- Ensure all requirements are met

**When to use**:
- Before starting any implementation
- When planning work for a new phase
- When resolving blockers or dependencies
- When reviewing overall project status

### 2. `coding-agent.md`
**Role**: Implementation specialist

**Responsibilities**:
- Execute code changes per orchestrator plan
- Follow existing code conventions
- Ensure type safety
- Implement all phases sequentially
- Fix issues reported by Testing Agent
- Maintain code quality standards

**When to use**:
- During any code implementation work
- When creating new components
- When refactoring existing code
- When fixing bugs from testing

### 3. `testing-agent.md`
**Role**: Quality assurance specialist

**Responsibilities**:
- Test all implemented features
- Verify calculations are correct
- Test across all 12 D&D classes
- Validate UI/UX standards
- Report bugs and issues
- Provide feedback to Coding Agent

**When to use**:
- After each phase is completed by Coding Agent
- Before proceeding to next phase
- During bug fixing and refinement
- Before final project sign-off

## Workflow

### 1. Planning Phase
```
Orchestrator: Review project requirements
Orchestrator: Create implementation phases
Orchestrator: Define dependencies
```

### 2. Development Cycle (per phase)
```
┌─────────────────────────────────────────────────────┐
│  Coding Agent: Read orchestrator.md for phase     │
│  Coding Agent: Implement changes                 │
│  Coding Agent: Notify Testing Agent: "Phase X complete" │
│                                               │
│  Testing Agent: Read orchestrator.md for tests    │
│  Testing Agent: Execute test suite               │
│  Testing Agent: Report results                  │
│                                               │
│  IF FAILURES:                                 │
│    └─ Testing Agent → Coding Agent: Issues     │
│       └─ Coding Agent: Fix issues            │
│          └─ Testing Agent: Re-test           │
│                                               │
│  IF ALL PASS:                                 │
│    └─ Testing Agent → Orchestrator: Sign-off   │
│       └─ Orchestrator: Approve next phase   │
└─────────────────────────────────────────────────────┘
```

### 3. Completion
```
Testing Agent: Final cross-feature testing
Testing Agent: Full integration test
Testing Agent: Final report to Orchestrator
Orchestrator: Review all test results
Orchestrator: Final project sign-off
```

## Phase Overview

### Phase 1: Core Fixes (Foundation)
- Rename `attackBaseBonus` to `profBonus`
- Fix HP roll calculation
- Auto-calculate AC
- Auto-calculate initiative
- Update Combat Stats label

**Estimated effort**: 2-3 hours

### Phase 2: Display Enhancements
- Add prof_bonus to Skills section
- Update Combat Stats display

**Estimated effort**: 30 minutes

### Phase 3: Dynamic Class Resources
- Create comprehensive class resources component
- Implement all 12 class-specific features
- Point pool components (Ki, Sorcery Points, Rages, etc.)
- Display components (Martial Arts, Sneak Attack, etc.)

**Estimated effort**: 4-6 hours

### Phase 4: Druid Wild Shape
- Add Wild Shape form selector
- Integrate with class resources

**Estimated effort**: 1-2 hours

**Total estimated effort**: 8-12 hours

## Class-Specific Features Coverage

| Class | Primary Resources | Secondary Features |
|--------|-------------------|-------------------|
| Barbarian | Rages, Rage Damage | Brutal Critical, Unarmored Movement |
| Bard | Inspiration Die | Song of Rest, Magical Secrets |
| Cleric | Channel Divinity | Destroy Undead CR |
| Druid | Wild Shape | Form Selection |
| Fighter | Action Surges | Extra Attacks, Indomitable |
| Monk | Ki Points | Martial Arts, Unarmored Movement |
| Paladin | Channel Divinity | Aura Range, Destroy Undead CR |
| Ranger | Favored Terrain | Favored Enemies, Extra Attacks |
| Rogue | - | Sneak Attack |
| Sorcerer | Sorcery Points | Metamagic, Flexible Casting |
| Warlock | - | Invocations, Mystic Arcanum |
| Wizard | - | Arcane Recovery |

## Getting Started

### For Orchestrator
1. Read `orchestrator.md`
2. Review current phase status
3. Assign next phase to Coding Agent
4. Wait for Testing Agent sign-off
5. Approve next phase

### For Coding Agent
1. Read `orchestrator.md` for current phase requirements
2. Read `coding-agent.md` for implementation details
3. Implement changes following code conventions
4. Run TypeScript compiler to check for errors
5. Notify Testing Agent when phase complete

### For Testing Agent
1. Read `orchestrator.md` for test requirements
2. Read `testing-agent.md` for test procedures
3. Execute test suite
4. Document results (pass/fail for each test)
5. Report to Coding Agent for any failures
6. Report to Orchestrator for sign-off on success

## Communication

Between agents, use the following format:

### Status Update
```
AGENT: [Phase] Status Update
- Progress: X%
- Blockers: None / [Description]
- Next step: [Description]
```

### Bug Report
```
AGENT: Bug Report
- Severity: Blocker / Major / Minor
- Phase: [X]
- Description: [What's broken]
- Steps to reproduce: [1, 2, 3...]
- Expected: [What should happen]
- Actual: [What actually happens]
```

### Sign-off Request
```
AGENT: [Phase] Sign-off Request
- Tests passed: X / Y
- Issues found: None / [Summary]
- Recommendation: Approve / Rework needed
```

## Reference Documents

- `.opencode/plans/query.gql` - GraphQL query structure
- `.opencode/plans/query-response.json` - Sample API responses
- `lib/interfaces/interfaces.ts` - TypeScript interfaces
- `lib/schemas.ts` - Zod validation schemas
- `lib/skills.ts` - D&D 5e calculation utilities

## Agent Commands

### Quick Reference

```bash
# Build and check for errors
npm run build

# Start dev server
npm run dev

# Generate GraphQL types
npm run codegen
```

## Success Metrics

- All 4 phases completed
- All test cases pass
- No type errors
- No runtime console errors
- All 12 classes supported
- Build completes successfully
- User can create characters for any class

---

**Created**: 2025-02-12
**Project**: Master's Shield D&D Character Form Refactoring
**Status**: Ready to begin Phase 1
