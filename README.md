# @aiready/context-analyzer

> AIReady Spoke: Analyzes import chains, fragmented code, and context window costs for AI tools.

[![npm version](https://img.shields.io/npm/v/@aiready/context-analyzer.svg)](https://npmjs.com/package/@aiready/context-analyzer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

AI model context windows are precious and expensive. The **Context Analyzer** identifies import chains, redundant dependencies, and complex data structures that bloat your context window and degrade AI reasoning performance.

## 🏛️ Architecture

```
                    🎯 USER
                      │
                      ▼
            🎛️  CLI (orchestrator)
                      │
    ┌─────────────────┴─────────────────┐
    │                                   │
    ▼                                   ▼
┌────────┐                        ┌────────┐
│🎨 VIS- │                        │ ANALY- │
│UALIZER │                        │  SIS   │
│✅ Ready│                        │ SPOKES │
└────────┘                        └───┬────┘
    │                                 │
    │           ┌─────────────────────┼─────────────────────┐
    │           ▼                     ▼                     ▼
    │     ┌────────┐           ┌────────┐           ┌────────┐
    │     │📊 PAT- │           │📦 CON- │           │🔧 CON- │
    │     │TERN    │           │TEXT    │           │SISTENCY│
    │     │DETECT  │           │ANALYZER│           │        │
    │     │        │           │        │           │        │
    │     │✅ Ready│           │✅ Ready│           │✅ Ready│
    │     └────────┘           └────────┘           └────────┘
    │                                 │                     │
    │                                 └─ YOU ARE HERE ──────┘
    │                                                       │
    └───────────────────────────────────────────────────────┘
                            │
                            ▼
                  🏢 HUB (@aiready/core)
```

## Features

- **Import Chain Analysis**: Detects deep dependency trees that force unnecessary files into AI context.
- **Fragmentation detection**: Identifies modules that are split across too many small, non-semantic files.
- **Context Budgeting**: Projects the dollar cost of loading specific modules into frontier models (GPT-4, Claude 3.5).

## Installation

```bash
pnpm add @aiready/context-analyzer
```

## Usage

```bash
aiready scan . --tools context-analyzer
```

## License

MIT
