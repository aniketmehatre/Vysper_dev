# Architecture & Design Documentation

This document describes the design architecture of the **AI Productivity Copilot** application.

## High-Level System Architecture

The project is structured under a **Clean Architecture** and **Feature-First** layout, separated into three primary execution and communication layers:

```
                  +----------------------------------+
                  |    Angular 20 Standalone Client  |
                  |          (/client)               |
                  +-----------------+----------------+
                                    |
                                    | [window.electronAPI] Context Bridge
                                    v
                  +----------------------------------+
                  |         Electron Host            |
                  |          (/electron)             |
                  +-----------------+----------------+
                                    |
                                    | Node.js Native API Integrations
                                    v
                  +----------------------------------+
                  | Local LLM / SQLite / OCR / Audio |
                  +----------------------------------+
```

---

## Directory Responsibilities

### 1. `/client` (Frontend Application)
An Angular 20 Standalone application. It handles all visual presentations, UI interactions, and routes.
* **Core Layer (`/client/src/app/core`)**: Contains singleton services, state wrappers, and wrappers around Electron's IPC bridge.
* **Shared Layer (`/client/src/app/shared`)**: Houses reusable UI controls (buttons, cards, menus) that do not depend on business logic.
* **Features Layer (`/client/src/app/features`)**: Contains feature-specific views and behaviors. Each feature (e.g., `chat`, `ocr`, `speech`) is encapsulated with its own components and helper functions.

### 2. `/electron` (Desktop Container)
Coordinates operating-system-level bindings, window management, app lifecycles, and native Node.js APIs (e.g. SQLite database files, file systems).
* **Main Process (`/electron/src/main.ts`)**: Initializes the main browser window, registers global listeners, and binds native features (such as DB triggers).
* **Preload Process (`/electron/src/preload.ts`)**: Defines the secure `contextBridge` API, exposing typed channels to the frontend client without exposing direct Node processes.

### 3. `/shared` (Global Models and Schema Contracts)
Contains pure TypeScript contracts, models, and schemas that are reused across the client and Electron packages. This ensures changes in data structure immediately cascade to both systems at compile-time.

---

## Key Development Guidelines

1. **Strict Context Isolation**: Do not enable `nodeIntegration` in the frontend client. Expose all necessary APIs through strictly defined channels in `preload.ts` and handle them in `main.ts`.
2. **Signals & inject()**: Leverage Angular 20 Signals for component reactivity and use `inject()` rather than constructor dependency injection for services.
3. **No Duplicate Types**: Place any structures that must travel across the IPC boundary in `/shared/models` rather than defining different versions in the client and server.
