# WikiManager
================

## Overview
------------

The `wiki-manager.ts` file is a crucial component of our wiki management system. It provides a comprehensive framework for managing wikis, including adding agents and enhancing wiki features.

## Architecture & Patterns
-------------------------

### Singleton Pattern

Our `WikiManager` class employs the Singleton pattern to ensure that only one instance exists throughout the system. This allows for easier access to the manager instance without creating multiple instances.

```typescript
class WikiManager {
  private static instance: WikiManager;

  private constructor() {}

  public static getInstance(): WikiManager {
    if (!WikiManager.instance) {
      WikiManager.instance = new WikiManager();
    }
    return WikiManager.instance;
  }

  // ...
}
```

### Factory Pattern

The `WikiManager` class uses the Factory pattern to create instances of different wiki managers based on specific configurations.

```typescript
class WikiManagerFactory {
  public static createWikiManager(config: any): WikiManager {
    switch (config.type) {
      case 'agent':
        return new AgentWikiManager();
      case 'other':
        return new OtherWikiManager();
      default:
        throw new Error(`Unsupported wiki manager type: ${config.type}`);
    }
  }

  // ...
}
```

### Observer Pattern

The `wiki-manager.ts` file interacts with the main application through an observer pattern. This allows for loose coupling between the manager and other components.

```typescript
interface Observer {
  update(wiki: any);
}

class WikiManager implements Observer {
  private observers: Observer[];

  public constructor() {
    this.observers = [];
  }

  public attach(observer: Observer) {
    this.observers.push(observer);
  }

  public detach(observer: Observer) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  public notify(wiki: any) {
    for (const observer of this.observers) {
      observer.update(wiki);
    }
  }

  // ...
}
```

## Key Components
-------------------

### WikiManager Class

The `WikiManager` class is responsible for managing wikis, including adding agents and enhancing wiki features.

*   **getInstance()**: Returns the single instance of the manager.
*   **createWikiManager(config: any)**: Creates a new instance of the manager based on the provided configuration.
*   **attach(observer: Observer)**: Attaches an observer to receive updates about the wiki.
*   **detach(observer: Observer)**: Detaches an observer from receiving updates.
*   **notify(wiki: any)**: Notifies all attached observers about a new wiki.

### AgentWikiManager Class

The `AgentWikiManager` class is responsible for managing agents, which are entities that interact with the wiki.

*   **getInstance()**: Returns the single instance of the manager.
*   **createAgent(config: any)**: Creates a new agent based on the provided configuration.
*   **attach(agent: Agent)**: Attaches an agent to receive updates about the wiki.
*   **detach(agent: Agent)**: Detaches an agent from receiving updates.

### OtherWikiManager Class

The `OtherWikiManager` class is responsible for managing other types of wikis, which are not agents.

*   **getInstance()**: Returns the single instance of the manager.
*   **createOther(config: any)**: Creates a new instance of the manager based on the provided configuration.
*   **attach(other: Other)**: Attaches an `other` component to receive updates about the wiki.
*   **detach(other: Other)**: Detaches an `other` component from receiving updates.

## Dependencies
--------------

### fs

The `fs` module is used for file system operations, such as reading and writing files.

```typescript
import * as fs from 'fs';
```

### path

The `path` module is used for working with file paths and directories.

```typescript
import * as path from 'path';
```

### ../config/config

The `../config/config` module provides configuration settings for the application.