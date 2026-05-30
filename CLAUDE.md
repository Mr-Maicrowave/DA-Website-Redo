# Claude Code Enhanced Governance Framework
*Version 4.0 - Intelligent, Adaptive, Self-Optimizing*

## 🎯 Core Philosophy
**Adaptive Intelligence**: This framework learns from your patterns, adapts to your project needs, and optimizes workflows automatically. It's designed to enhance productivity without adding overhead.

## 🚀 Quick Start (Auto-Executing)

### Instant Project Analysis
```javascript
// Runs automatically when Claude loads
const projectProfile = await createProjectProfile({
  codebase: await analyzeCodebase(),
  tools: await detectAvailableTools(),
  team: await inferTeamContext(),
  goals: await extractProjectGoals(),
  constraints: await identifyConstraints()
});

console.log(`🎯 Project Type: ${projectProfile.type}`);
console.log(`🔧 Optimal Workflow: ${projectProfile.recommendedWorkflow}`);
console.log(`⚡ Productivity Score: ${projectProfile.productivityPotential}/100`);
```

## 🧠 Intelligent Workflow Engine

### Adaptive Workflow Selection
```javascript
const workflowEngine = {
  // Micro workflows (< 30min tasks)
  micro: {
    pattern: 'think → code → verify',
    tools: ['sequential-thinking', 'lint'],
    quality: 'fast-feedback',
    commit: 'atomic'
  },

  // Standard workflows (30min - 4hr tasks)
  standard: {
    pattern: 'plan → implement → test → review',
    tools: ['memory', 'git', 'lint', 'test'],
    quality: 'comprehensive',
    commit: 'feature-complete'
  },

  // Complex workflows (4hr+ tasks)
  complex: {
    pattern: 'research → architect → implement → validate → document',
    tools: ['context7', 'mermaid', 'git', 'memory', 'lint', 'test'],
    quality: 'production-ready',
    commit: 'milestone-based'
  },

  // Emergency workflows (hotfixes)
  emergency: {
    pattern: 'identify → fix → verify → deploy',
    tools: ['git', 'lint', 'test'],
    quality: 'surgical-precision',
    commit: 'immediate'
  }
};

// Auto-select based on context
const selectedWorkflow = workflowEngine[determineWorkflowType()];
```

## 🎨 Modern Development Patterns

### 1. Rapid Prototyping Mode
```bash
# For quick experiments and proof-of-concepts
enable_rapid_mode() {
  echo "⚡ Rapid prototyping mode activated"

  # Minimal quality gates
  set_lint_mode "lenient"
  set_test_coverage "optional"
  set_commit_checks "basic"

  # Enhanced feedback
  enable_live_reload
  enable_hot_reloading
  enable_instant_preview

  echo "🚀 Ready for rapid iteration"
}
```

### 2. Production Hardening Mode
```bash
# For production-ready code
enable_production_mode() {
  echo "🛡️ Production hardening mode activated"

  # Strict quality gates
  set_lint_mode "strict"
  set_test_coverage "minimum_80_percent"
  set_security_scan "enabled"
  set_performance_check "enabled"

  # Enhanced documentation
  require_api_docs
  require_deployment_notes
  require_rollback_plan

  echo "🎯 Production standards enforced"
}
```

### 3. Collaborative Mode
```bash
# For team development
enable_collaborative_mode() {
  echo "👥 Collaborative mode activated"

  # Team synchronization
  enable_real_time_sharing
  enable_code_review_automation
  enable_conflict_detection

  # Communication tools
  setup_progress_broadcasting
  setup_blocker_alerts
  setup_review_requests

  echo "🤝 Team collaboration optimized"
}
```

## ⚡ Smart Quality Gates

### Intelligent Code Review
```javascript
const smartCodeReview = async (changes) => {
  const analysis = await Promise.all([
    analyzeCodeQuality(changes),
    assessSecurityRisks(changes),
    evaluatePerformanceImpact(changes),
    checkTestCoverage(changes),
    validateDocumentation(changes)
  ]);

  const review = {
    overall: calculateOverallScore(analysis),
    criticalIssues: analysis.filter(issue => issue.severity === 'critical'),
    suggestions: generateImprovementSuggestions(analysis),
    autoFixes: identifyAutoFixableIssues(analysis)
  };

  if (review.overall >= 85 && review.criticalIssues.length === 0) {
    console.log("✅ Code review passed - ready for commit");
    return { approved: true, review };
  } else {
    console.log("⚠️ Code review requires attention");
    return { approved: false, review };
  }
};
```

### Adaptive Testing Strategy
```javascript
const testingStrategy = {
  // Smart test selection based on changes
  selectTests: (changedFiles) => {
    const impactedAreas = analyzeCodeImpact(changedFiles);
    const testSuite = {
      unit: impactedAreas.functions.map(f => f.tests),
      integration: impactedAreas.modules.map(m => m.integrationTests),
      e2e: impactedAreas.features.map(f => f.e2eTests)
    };

    return optimizeTestExecution(testSuite);
  },

  // Parallel test execution
  runTests: async (testSuite) => {
    const results = await Promise.all([
      runUnitTests(testSuite.unit),
      runIntegrationTests(testSuite.integration),
      runE2ETests(testSuite.e2e)
    ]);

    return aggregateTestResults(results);
  },

  // Auto-generate missing tests
  generateMissingTests: (codeAnalysis) => {
    const coverage = analyzeCoverage();
    const gaps = identifyTestingGaps(coverage, codeAnalysis);
    return generateTestTemplates(gaps);
  }
};
```

## 🔄 Intelligent Git Workflow

### Smart Commit Assistant
```bash
smart_commit() {
  echo "🤖 Analyzing changes for optimal commit strategy..."

  # Analyze changes
  local changed_files=$(git diff --name-only --staged)
  local change_type=$(analyze_change_type "$changed_files")
  local impact_scope=$(assess_impact_scope "$changed_files")

  case $change_type in
    "feature")
      suggest_commit_message "feat: $(generate_feature_description)"
      ;;
    "fix")
      suggest_commit_message "fix: $(identify_bug_fixed)"
      ;;
    "refactor")
      suggest_commit_message "refactor: $(describe_refactoring)"
      ;;
    "docs")
      suggest_commit_message "docs: $(summarize_doc_changes)"
      ;;
    *)
      suggest_commit_message "chore: $(describe_general_changes)"
      ;;
  esac

  # Quality pre-checks
  run_pre_commit_quality_gates

  # Get user confirmation
  if user_approves_commit; then
    execute_commit_with_tracking
  else
    echo "📝 Commit cancelled - make adjustments and try again"
  fi
}
```

### Intelligent Branch Management
```javascript
const branchManager = {
  suggestBranchName: (workType, description) => {
    const prefix = {
      feature: 'feat/',
      bugfix: 'fix/',
      hotfix: 'hotfix/',
      experiment: 'exp/',
      refactor: 'refactor/'
    }[workType];

    const sanitized = description
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `${prefix}${sanitized}`;
  },

  autoCleanup: () => {
    // Clean up merged branches
    const mergedBranches = getMergedBranches();
    const safeBranches = ['main', 'develop', 'staging'];

    mergedBranches
      .filter(branch => !safeBranches.includes(branch))
      .forEach(branch => {
        if (confirmBranchDeletion(branch)) {
          deleteBranch(branch);
        }
      });
  },

  suggestRebase: () => {
    const currentBranch = getCurrentBranch();
    const baseBranch = getBaseBranch(currentBranch);
    const commitsBehind = getCommitsBehind(currentBranch, baseBranch);

    if (commitsBehind > 5) {
      console.log(`💡 Consider rebasing ${currentBranch} on ${baseBranch} (${commitsBehind} commits behind)`);
    }
  }
};
```

## 🏗️ Architecture Intelligence

### Auto-Architecture Detection
```javascript
const architectureAnalyzer = {
  detectPattern: async () => {
    const structure = await analyzeProjectStructure();
    const patterns = {
      mvc: checkMVCPattern(structure),
      microservices: checkMicroservicesPattern(structure),
      layered: checkLayeredPattern(structure),
      eventDriven: checkEventDrivenPattern(structure),
      serverless: checkServerlessPattern(structure)
    };

    return Object.entries(patterns)
      .filter(([_, confidence]) => confidence > 0.7)
      .map(([pattern, confidence]) => ({ pattern, confidence }));
  },

  generateDiagram: async (architecture) => {
    if (mcpAvailable('mermaid')) {
      return await mermaid.generate({
        type: 'graph',
        content: architectureToMermaid(architecture)
      });
    } else {
      return generateTextDiagram(architecture);
    }
  },

  suggestImprovements: (currentArchitecture) => {
    const antipatterns = detectAntiPatterns(currentArchitecture);
    const scalabilityIssues = assessScalability(currentArchitecture);
    const maintainabilityScore = calculateMaintainability(currentArchitecture);

    return {
      antipatterns,
      scalabilityIssues,
      maintainabilityScore,
      recommendations: generateArchitecturalRecommendations({
        antipatterns,
        scalabilityIssues,
        maintainabilityScore
      })
    };
  }
};
```

## 📊 Real-Time Productivity Analytics

### Performance Dashboard
```javascript
const productivityDashboard = {
  trackMetrics: () => {
    return {
      codeVelocity: measureCodeVelocity(),
      qualityTrend: trackQualityTrend(),
      testCoverage: getCurrentCoverage(),
      technicalDebt: assessTechnicalDebt(),
      teamVelocity: calculateTeamVelocity(),
      deploymentFrequency: getDeploymentFrequency(),
      meanTimeToRestore: getMTTR(),
      changeFailureRate: getChangeFailureRate()
    };
  },

  generateInsights: (metrics) => {
    const insights = [];

    if (metrics.codeVelocity.trend === 'declining') {
      insights.push({
        type: 'warning',
        message: 'Code velocity declining - consider refactoring or removing blockers',
        actions: ['analyze-blockers', 'refactor-suggestion', 'team-review']
      });
    }

    if (metrics.testCoverage < 80) {
      insights.push({
        type: 'improvement',
        message: `Test coverage at ${metrics.testCoverage}% - recommend increasing to 80%+`,
        actions: ['generate-tests', 'coverage-report', 'test-strategy']
      });
    }

    return insights;
  },

  optimizeWorkflow: (metrics, patterns) => {
    const optimizations = [];

    // Auto-optimize based on patterns
    if (patterns.frequentLintFixes) {
      optimizations.push('enable-lint-on-save');
    }

    if (patterns.manualTestRuns) {
      optimizations.push('setup-test-automation');
    }

    if (patterns.longCommitCycles) {
      optimizations.push('suggest-smaller-commits');
    }

    return optimizations;
  }
};
```

## 🔒 Security & Reliability

### Automated Security Scanning
```bash
security_scan() {
  echo "🔒 Running security analysis..."

  # Dependency vulnerabilities
  if command_exists npm; then
    npm audit --audit-level=moderate
  elif command_exists cargo; then
    cargo audit
  fi

  # Secret detection
  scan_for_secrets() {
    local secrets_found=false

    # Common secret patterns
    if grep -r "api[_-]key\s*=\s*['\"][^'\"]*['\"]" . --exclude-dir=node_modules; then
      secrets_found=true
    fi

    if grep -r "password\s*=\s*['\"][^'\"]*['\"]" . --exclude-dir=node_modules; then
      secrets_found=true
    fi

    if $secrets_found; then
      echo "⚠️ Potential secrets detected - review before committing"
      return 1
    fi
  }

  # Code quality security
  check_input_validation
  check_output_encoding
  check_authentication_flows
  check_authorization_logic

  echo "✅ Security scan completed"
}
```

### Reliability Monitoring
```javascript
const reliabilityMonitor = {
  trackErrorRates: () => {
    // Monitor application errors
    const errorMetrics = {
      buildFailures: countBuildFailures(),
      testFailures: countTestFailures(),
      deploymentFailures: countDeploymentFailures(),
      runtimeErrors: countRuntimeErrors()
    };

    return errorMetrics;
  },

  predictFailures: (historicalData) => {
    // ML-based failure prediction
    const patterns = analyzeFailurePatterns(historicalData);
    const riskFactors = identifyRiskFactors(patterns);

    return {
      riskLevel: calculateRiskLevel(riskFactors),
      recommendations: generateReliabilityRecommendations(riskFactors),
      preventiveActions: suggestPreventiveActions(riskFactors)
    };
  },

  autoHealing: {
    dependencies: () => {
      // Auto-fix common dependency issues
      if (detectOutdatedDependencies()) {
        suggestDependencyUpdates();
      }
    },

    configuration: () => {
      // Auto-correct configuration drift
      const configIssues = detectConfigurationIssues();
      if (configIssues.length > 0) {
        applyConfigurationFixes(configIssues);
      }
    },

    performance: () => {
      // Auto-optimize performance issues
      const perfIssues = detectPerformanceBottlenecks();
      if (perfIssues.length > 0) {
        suggestPerformanceOptimizations(perfIssues);
      }
    }
  }
};
```

## 🚀 Advanced Deployment Intelligence

### Smart Deployment Strategy
```javascript
const deploymentIntelligence = {
  selectStrategy: (projectContext) => {
    const strategies = {
      blueGreen: {
        suitable: projectContext.hasDatabase && projectContext.requiresZeroDowntime,
        complexity: 'medium',
        risk: 'low'
      },
      canary: {
        suitable: projectContext.hasHighTraffic && projectContext.requiresGradualRollout,
        complexity: 'high',
        risk: 'very-low'
      },
      rollingUpdate: {
        suitable: projectContext.isStateless && projectContext.canTolerateShortDowntime,
        complexity: 'low',
        risk: 'medium'
      },
      recreate: {
        suitable: projectContext.isDevelopment || projectContext.isStateful,
        complexity: 'very-low',
        risk: 'high'
      }
    };

    const recommended = Object.entries(strategies)
      .filter(([_, config]) => config.suitable)
      .sort((a, b) => a[1].risk.localeCompare(b[1].risk))[0];

    return recommended ? recommended[0] : 'recreate';
  },

  preDeploymentChecks: async () => {
    const checks = await Promise.all([
      checkDatabaseMigrations(),
      verifyEnvironmentVariables(),
      validateServiceDependencies(),
      confirmBackupStrategy(),
      testRollbackProcedure()
    ]);

    const failures = checks.filter(check => !check.passed);

    if (failures.length > 0) {
      console.log("❌ Pre-deployment checks failed:");
      failures.forEach(failure => console.log(`  - ${failure.message}`));
      return false;
    }

    console.log("✅ All pre-deployment checks passed");
    return true;
  },

  postDeploymentValidation: async () => {
    const validations = await Promise.all([
      validateHealthEndpoints(),
      checkApplicationMetrics(),
      verifyDatabaseConnectivity(),
      testCriticalUserJourneys(),
      monitorErrorRates()
    ]);

    return {
      healthy: validations.every(v => v.passed),
      issues: validations.filter(v => !v.passed),
      recommendations: generatePostDeploymentRecommendations(validations)
    };
  }
};
```

## 📱 Developer Experience Enhancements

### Contextual Help System
```javascript
const helpSystem = {
  analyzeIntent: (userInput) => {
    const intents = {
      debugging: /debug|error|bug|issue|problem|fix/i,
      testing: /test|spec|coverage|mock/i,
      deployment: /deploy|release|publish|build/i,
      optimization: /optimize|performance|speed|slow/i,
      documentation: /docs|document|readme|comment/i
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(userInput)) {
        return intent;
      }
    }

    return 'general';
  },

  provideContextualHelp: (intent, projectContext) => {
    const helpContent = {
      debugging: generateDebuggingGuide(projectContext),
      testing: generateTestingGuide(projectContext),
      deployment: generateDeploymentGuide(projectContext),
      optimization: generateOptimizationGuide(projectContext),
      documentation: generateDocumentationGuide(projectContext),
      general: generateGeneralHelp(projectContext)
    };

    return helpContent[intent];
  },

  learnFromInteractions: (interaction) => {
    // ML-powered help improvement
    const feedback = {
      query: interaction.query,
      response: interaction.response,
      userSatisfaction: interaction.rating,
      context: interaction.projectContext
    };

    storeInteractionFeedback(feedback);
    updateHelpModelWithFeedback(feedback);
  }
};
```

### Intelligent Code Completion
```javascript
const codeIntelligence = {
  suggestImplementation: (context) => {
    const suggestions = {
      patterns: detectApplicablePatterns(context),
      libraries: suggestRelevantLibraries(context),
      snippets: generateCodeSnippets(context),
      refactoring: identifyRefactoringOpportunities(context)
    };

    return suggestions;
  },

  predictNextAction: (recentActions, projectState) => {
    // Predict what the developer is likely to do next
    const predictions = analyzeActionPatterns(recentActions);
    const contextualPredictions = adjustPredictionsForContext(predictions, projectState);

    return {
      nextAction: contextualPredictions[0],
      confidence: contextualPredictions[0].confidence,
      alternatives: contextualPredictions.slice(1, 4)
    };
  },

  autoComplete: (codeContext) => {
    // Intelligent code completion based on project patterns
    const projectPatterns = extractProjectPatterns();
    const contextualSuggestions = generateContextualSuggestions(codeContext, projectPatterns);

    return contextualSuggestions;
  }
};
```

## 🎯 Success Metrics & KPIs

### Automated Success Tracking
```javascript
const successMetrics = {
  development: {
    codeQuality: () => measureCodeQuality(),
    testCoverage: () => getCurrentTestCoverage(),
    bugDensity: () => calculateBugDensity(),
    codeReviewEfficiency: () => measureReviewEfficiency(),
    developmentVelocity: () => calculateDevelopmentVelocity()
  },

  operations: {
    deploymentFrequency: () => measureDeploymentFrequency(),
    leadTime: () => calculateLeadTime(),
    mttr: () => calculateMTTR(),
    changeFailureRate: () => measureChangeFailureRate(),
    serviceReliability: () => assessServiceReliability()
  },

  business: {
    featureAdoption: () => trackFeatureAdoption(),
    userSatisfaction: () => measureUserSatisfaction(),
    performanceImpact: () => assessPerformanceImpact(),
    costEfficiency: () => calculateCostEfficiency(),
    timeToMarket: () => measureTimeToMarket()
  },

  generateReport: () => {
    const metrics = {
      development: Object.fromEntries(
        Object.entries(successMetrics.development).map(([key, fn]) => [key, fn()])
      ),
      operations: Object.fromEntries(
        Object.entries(successMetrics.operations).map(([key, fn]) => [key, fn()])
      ),
      business: Object.fromEntries(
        Object.entries(successMetrics.business).map(([key, fn]) => [key, fn()])
      )
    };

    return {
      metrics,
      trends: analyzeTrends(metrics),
      recommendations: generateImprovementRecommendations(metrics),
      achievements: identifyAchievements(metrics)
    };
  }
};
```

## 🔄 Continuous Learning Engine

### AI-Powered Process Improvement
```javascript
const learningEngine = {
  analyzePatterns: () => {
    const patterns = {
      successful: identifySuccessfulPatterns(),
      problematic: identifyProblematicPatterns(),
      emerging: detectEmergingPatterns()
    };

    return patterns;
  },

  generateOptimizations: (patterns, metrics) => {
    const optimizations = [];

    // Process optimizations
    if (patterns.problematic.includes('long-review-cycles')) {
      optimizations.push({
        type: 'process',
        suggestion: 'Implement automated code review checks',
        impact: 'medium',
        effort: 'low'
      });
    }

    // Tool optimizations
    if (metrics.testCoverage.trend === 'declining') {
      optimizations.push({
        type: 'tooling',
        suggestion: 'Set up automated test generation',
        impact: 'high',
        effort: 'medium'
      });
    }

    return optimizations;
  },

  adaptWorkflows: (learnings) => {
    // Automatically adapt workflows based on learnings
    const adaptations = generateWorkflowAdaptations(learnings);

    adaptations.forEach(adaptation => {
      if (adaptation.confidence > 0.8) {
        console.log(`🤖 Auto-applying optimization: ${adaptation.description}`);
        applyWorkflowOptimization(adaptation);
      } else {
        console.log(`💡 Suggesting optimization: ${adaptation.description}`);
        suggestWorkflowOptimization(adaptation);
      }
    });
  }
};
```

---

## 🚀 Quick Reference Commands

### Intelligent Commands (Context-Aware)
```bash
# Smart analysis and optimization
claude analyze          # Comprehensive project analysis with recommendations
claude optimize         # Auto-optimize workflows and configurations
claude health           # Complete health check with issue resolution
claude insights         # AI-powered insights and productivity suggestions

# Intelligent development
claude code [feature]    # Smart feature development with best practices
claude review           # Comprehensive code review with auto-fixes
claude test [scope]     # Intelligent test selection and execution
claude deploy [env]     # Smart deployment with safety checks

# Learning and adaptation
claude learn            # Analyze patterns and suggest improvements
claude adapt            # Apply AI-recommended optimizations
claude benchmark       # Compare performance against industry standards
claude predict          # Predict potential issues and suggest preventions

# Collaboration and communication
claude sync             # Smart team synchronization and conflict resolution
claude share            # Intelligent progress sharing and documentation
claude handoff          # Prepare comprehensive handoff documentation
claude onboard          # Smart onboarding for new team members
```

### Context-Sensitive Help
```bash
# Help adapts to your current situation
claude help             # Context-aware help based on current activity
claude guide [topic]    # Intelligent tutorials based on your project
claude examples         # Smart examples relevant to your tech stack
claude patterns         # Best practices for your specific architecture
```

---

## 🎯 Framework Completion Criteria

**Enhanced Success Definition:** A task is complete when it:
- ✅ Meets all functional requirements with measurable quality metrics
- ✅ Achieves >90% automated test coverage with intelligent test selection
- ✅ Passes AI-powered security and performance analysis
- ✅ Includes self-documenting code with auto-generated documentation
- ✅ Integrates seamlessly with existing architecture patterns
- ✅ Provides monitoring and observability out-of-the-box
- ✅ Includes automated rollback and recovery mechanisms
- ✅ Demonstrates measurable improvement in key productivity metrics

---

*🤖 This framework evolves with each project, learning from successes and failures to continuously improve development efficiency and code quality. It represents the cutting edge of AI-assisted software development.*

**Global Installation:** `~/.claude/templates/claude.md`
**Auto-loads with:** Enhanced Claude Init System
**Updates automatically:** Every 30 days or on manual trigger
**Customizable:** Per-project overrides supported in local `CLAUDE.md`

---

## Previous Project Configuration
*Preserved from existing CLAUDE.md*

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React-based tutoring website for DA Tuition, an Australian K-12 educational service. Built with React 18, TypeScript, Vite, and shadcn/ui component library.

## Development Commands

```bash
# Start development server (port 8080)
npm run dev

# Build for production  
npm run build

# Build for development mode (quick syntax/compilation check)
npm run build:dev

# Run linting (syntax check)
npm run lint

# Preview production build
npm run preview

# Optimize newsletter images (when needed)
npm run optimize:newsletters
```

## Quick Testing Commands

When implementing changes, run these commands to verify syntax and compilation:

```bash
# Quick syntax check (runs immediately)
npm run lint

# Build test (checks if everything compiles)
npm run build:dev

# Start dev server at http://localhost:8080
npm run dev
```

## Tech Stack & Architecture

**Frontend:** React 18.3.1 + TypeScript + Vite with SWC
**Styling:** Tailwind CSS with shadcn/ui component library
**Routing:** React Router DOM v6 with BrowserRouter
**State Management:** TanStack Query (React Query)
**Forms:** React Hook Form + Zod validation
**UI Components:** Radix UI primitives, shadcn/ui, Lucide icons
**Markdown:** react-markdown with rehype-raw and remark-gfm
**Additional:** date-fns, embla-carousel, recharts, sonner (toast notifications)

## Code Structure

```
/src
├── components/          # Page-specific components (Hero, Navigation, Footer, etc.)
├── components/ui/       # shadcn/ui reusable components (40+ components)
├── components/articles/ # Article-specific components (SectionedMarkdown, etc.)
├── components/reviews/  # Review system components (DualRowCarousel, ReviewModal)
├── components/teachers/ # Teacher profile components and filtering
├── data/               # Static data files (reviews.json, teachers.ts)
├── hooks/              # Custom React hooks (use-mobile, use-toast)
├── lib/                # Utility functions (utils.ts)
├── lib/markdown/       # Markdown processing utilities (sectionize.ts)
├── pages/              # Route components (14 pages including demos)
├── App.tsx            # Route configuration and providers
└── main.tsx           # App entry point
```

## Routes

### Main Pages
- `/` - Home page with section transitions
- `/articles` - Blog article listing with search
- `/articles/:slug` - Individual article view
- `/reviews` - Google reviews showcase
- `/interview` - Interview booking with principal
- `/appreciation-advice` - Testimonials and appreciation
- `/faq` - Frequently asked questions
- `/our-approach` - Teaching methodology
- `/our-teachers` - Teacher profiles page
- `/success-stories` - Student success stories
- `/why-choose-da` - Value proposition page

### Educational Programs
- `/subjects` - Subject overview page
- `/subjects/english` - English tutoring
- `/subjects/mathematics` - Mathematics tutoring
- `/subjects/science` - Science tutoring
- `/subjects/business-studies` - Business Studies tutoring
- `/subjects/legal-studies` - Legal Studies tutoring
- `/programs/primary-school` - Primary school programs
- `/programs/high-school` - High school programs
- `/programs/hsc` - HSC preparation
- `/hsc-excellence` - HSC excellence program
- `/learning-formats` - Learning format options

### Locations
- `/locations/canley-heights` - Canley Heights center

### Prototypes & Demos
- `/find-teacher` - Teacher search interface
- `/teachers-enhanced` - Enhanced teacher profiles
- `/plain` - Plain version of home page
- `/color-comparison`, `/color-transitions`, `/natural-transitions`
- `/simple-colors`, `/fresh-transitions`
- `/prototype/teacher-cards` - Teacher card comparison

### System Routes
- `*` - 404 NotFound page (catch-all)

## Component System

The project uses shadcn/ui for the component library. Components are pre-configured in `components/ui/` with consistent theming through CSS variables defined in `src/index.css`.

### Design System
- **Color Palette:** Blue/Orange/Green brand colors, pastel card themes per subject
- **Animations:** fade-in, slide-up, float, flip-card
- **Typography:** Tailwind Typography plugin enabled
- **Styles:** Additional styles in `src/styles/` (da-colors.css, pastel.css)

### Custom CSS Classes (src/index.css)
- `.btn-primary` - Gradient blue button with hover effects
- `.btn-secondary` - Outlined blue button
- `.card-hover` - Card hover animation (lift and shadow)
- `.gradient-text` - Blue gradient text effect
- `.flip-card-*` - 3D flip card animations for teacher profiles

## Development Workflow

### Path Aliases
- Use `@/` for src imports (configured in vite.config.ts and tsconfig.json)
- Example: `import { Button } from "@/components/ui/button"`

### TypeScript Configuration
- Relaxed strictness settings (no implicit any allowed, no unused checks)
- Project references enabled for app and node configs
- Skip library type checking enabled

### Working with Claude Code

1. **Before Making Changes:**
   - Read existing files to understand patterns
   - Check nearby components for conventions
   - Verify libraries are already installed in package.json

2. **During Implementation:**
   - Follow existing code patterns exactly
   - Use existing components from `components/ui/`
   - Test with `npm run lint` after changes
   - Use `npm run build:dev` to verify compilation

3. **Component Creation:**
   - Look at existing components for structure
   - Follow naming conventions (PascalCase for components)
   - Use TypeScript interfaces for props
   - Import UI components from `@/components/ui/`

## JSX/TSX Error Prevention

### Critical Rules:

1. **Multi-line JSX Return Structure:**
   ```tsx
   // ✅ CORRECT
   return (
     <div>
       <Component />
     </div>
   );
   ```

2. **After Removing Elements:**
   - Run `npm run lint` immediately
   - Verify all brackets match: `{` with `}`, `(` with `)`
   - Check all tags have closing tags

3. **Map Functions:**
   ```tsx
   {items.map((item) => (
     <div key={item.id}>
       {item.content}
     </div>
   ))}
   ```

## Key Configurations

- **Vite:** Development server on port 8080, SWC for fast compilation
- **ESLint:** Flat config, React hooks plugin, unused vars disabled
- **Tailwind:** Extended theme with brand colors and custom animations
- **App Structure:** QueryClientProvider → TooltipProvider → BrowserRouter → Routes

## Page Components

### New Pages Added (2025)
The website has been expanded with numerous dedicated pages for improved SEO and user navigation:

- **FAQ Page:** Comprehensive Q&A covering enrollment, scheduling, pricing, and teaching approach
- **Our Approach:** Detailed explanation of teaching methodology and philosophy
- **Our Teachers:** Full teacher profiles with qualifications and experience
- **Success Stories:** Student achievements and testimonials
- **Why Choose DA:** Value proposition and differentiators
- **Subject Pages:** Dedicated pages for English, Mathematics, Science, Business Studies, Legal Studies
- **Program Pages:** Specific pages for Primary School, High School, HSC
- **HSC Excellence:** Specialized HSC preparation program details
- **Learning Formats:** Different learning options (group, individual, online)

## Recent Updates (August 2025)

### Markdown Processing System
- **SectionedMarkdown Component:** Splits markdown by H2/H3 headings with paragraph chunking
- **Category-based layouts:** Different card/flow layouts per article category
- **Chunking thresholds:** Configurable per category (paragraphs and characters)
- **Within-section splitting:** Long sections split by paragraphs while preserving heading

### Google Reviews Integration
- 393 real testimonials in `/src/data/reviews.json`
- Dual-row carousel with opposing scroll directions
- Components: ReviewCarouselCard, DualRowCarousel, ReviewModal
- All reviews are 5-star rated from actual families

### Award Recognition Component
- Showcases Outstanding Education Service award (Fairfield City Local Business Awards 2025)
- Embedded video player with ceremony footage
- Grid layout with perfect bottom alignment for award tiles

### Blog System
- 8 comprehensive educational articles (2,500+ words each)
- Articles stored in `/public/articles/` as markdown files
- Article metadata in `/public/articles/articles-index.json`
- Full-featured article viewer with markdown rendering and sharing
- SectionedMarkdown component for optimized article display

### Appreciation & Advice Page
- New route `/appreciation-advice` with AppreciationAdvice component
- AppreciationShowcase component for testimonials display
- Integrated with existing review and appreciation system

## Section Transition System

The website uses a smooth color transition system between sections. Each section has its own gradient background that seamlessly blends into the next.

### How It Works
1. **Components have transparent backgrounds** - All section components (GoogleReviewsCarousel, HowWereDifferent, etc.) have no background colors
2. **Index.tsx defines section gradients** - Each section is wrapped in a div with a specific gradient background
3. **Gradients connect at boundaries** - The end color of one section matches the start color of the next

### Color Flow
- Hero: Light gray → Soft blue
- Reviews: Blue → Teal
- Appreciation: Teal (continuous)
- How We're Different: Teal → Light green
- Awards: Light green → Golden
- Teachers: Golden → Green
- Programs: Green → Yellow
- Contact: Yellow → Warm tones
- Footer: Warm fade out

### Adding New Sections
1. Create component without background colors
2. Wrap in Index.tsx with gradient div:
```tsx
<div 
  className="gradient-transition"
  style={{ 
    background: 'linear-gradient(180deg, START_COLOR 0%, END_COLOR 100%)'
  }}
>
  <div className="transparent-section">
    <YourComponent />
  </div>
</div>
```
3. Match START_COLOR to previous section's END_COLOR

### Key Files
- `src/pages/Index.tsx` - Section gradient definitions
- `src/index.css` - Transition helper classes
- `src/components/SmoothTransitions.tsx` - Reusable transition component

## Design Review Workflow

### Quick Visual Check
When making UI changes, follow these steps:

1. **Identify Changes**: List all modified components and pages
2. **Navigate**: Visit each affected page in development
3. **Verify Design**: Check against `/context/design-principles.md`
4. **Validate Features**: Ensure functionality works as expected
5. **Check Criteria**: Verify acceptance criteria are met
6. **Screenshot**: Capture desktop viewport for reference
7. **Console Check**: Ensure no browser errors

### Comprehensive Design Review
For significant UI features or visual PRs, trigger the design review agent:

```
@agent-design-review
```

This will perform a 7-phase comprehensive review:
- Phase 0: Preparation and setup
- Phase 1: User flow testing
- Phase 2: Responsiveness validation
- Phase 3: Visual consistency
- Phase 4: Accessibility compliance
- Phase 5: Edge case handling
- Phase 6: Code quality
- Phase 7: Content and errors

### Design Standards
- **Principles**: `/context/design-principles.md`
- **Style Guide**: `/context/style-guide.md`
- **Agent Instructions**: `/context/design-review-agent.md`

### Visual Testing Commands
```bash
# Run visual tests (when Playwright is configured)
npm run test:visual

# Check accessibility
npm run test:a11y

# Validate responsive design
npm run test:responsive
```

## Quality Assurance Checklist

Before committing UI changes:
- [ ] Colors meet WCAG contrast requirements
- [ ] All interactive elements have hover/focus states
- [ ] Mobile experience is optimized
- [ ] Animations are smooth (300ms transitions)
- [ ] No console errors
- [ ] Components follow design system
- [ ] Accessibility standards met
- [ ] Cross-browser tested

## Testing

Currently, there are no automated tests in the codebase. Testing is done manually through:
- Linting with `npm run lint`
- Type checking via TypeScript compilation
- Build verification with `npm run build:dev`
- Manual UI testing in development server

## Business Context

Australian tutoring service focusing on K-12 education with emphasis on "Beyond Academic Excellence" - building confidence and supporting the whole child. Target audience is parents seeking premium, personalized tutoring services.

### Business Information
- **Address:** Level 1/229 Canley Vale Rd, Canley Heights NSW 2166
- **Phone:** 0401 940 207
- **Hours:** Tue-Fri 5pm-9pm, Sat 9am-6pm, Sun 10am-7pm
- **Note:** "Book Consultation" (not "free consultation")
- **Service Model:** Small group tutoring (3-5 students) with personalized attention
- **Experience:** 20+ years, 650+ students helped since 2005
