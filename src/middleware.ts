import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type Logger = <
  T extends unknown,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T extends unknown>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>;

// Analytics logging middleware
export const analyticsLogger: LoggerImpl = (f, name) => (set, get, store) => {
  type T = ReturnType<typeof f>;
  const loggedSet: typeof set = (...a) => {
    const before = get();
    set(...a);
    const after = get();
    
    // Log state changes for analytics
    const changes = Object.keys(after as Record<string, unknown>).reduce((acc, key) => {
      if (before[key as keyof T] !== after[key as keyof T]) {
        acc[key] = {
          from: before[key as keyof T],
          to: after[key as keyof T],
        };
      }
      return acc;
    }, {} as Record<string, { from: unknown; to: unknown }>);

    console.log(`[${name}] State changes:`, changes);
    
    // Send to analytics service
    try {
      // Replace with your analytics service
      // analytics.track('state_change', {
      //   store: name,
      //   changes,
      //   timestamp: new Date().toISOString(),
      // });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  return f(loggedSet, get, store);
};

// Session conflict middleware
export const sessionManager = <T>(
  f: StateCreator<T, [], []>
): StateCreator<T, [], []> => (set, get, store) => {
  const sessionId = Math.random().toString(36).substring(7);
  let lastUpdate = Date.now();

  // Check for concurrent sessions every 5 seconds
  setInterval(() => {
    const currentSession = localStorage.getItem('activeSession');
    if (currentSession && currentSession !== sessionId) {
      const lastSessionUpdate = parseInt(localStorage.getItem('lastUpdate') || '0');
      if (Date.now() - lastSessionUpdate < 10000) { // 10 seconds threshold
        console.warn('Concurrent session detected!');
        // Optionally, show a warning to the user or handle the conflict
      }
    }
  }, 5000);

  // Update session info
  const updateSession = () => {
    localStorage.setItem('activeSession', sessionId);
    localStorage.setItem('lastUpdate', Date.now().toString());
  };

  // Wrap the set function to update session info
  const wrappedSet: typeof set = (...args) => {
    updateSession();
    set(...args);
  };

  // Initialize session
  updateSession();

  return f(wrappedSet, get, store);
};
// State version migration middleware
export const migrationManager = <T extends { version?: number }>(
  f: StateCreator<T, [], []>
): StateCreator<T, [], []> => (set, get, store) => {
  const CURRENT_VERSION = 1;
  const migrateState = (state: Partial<T>): T => {
    const version = state?.version || 0;

    if (version < CURRENT_VERSION) {
      // Add migration logic here for each version
      switch (version) {
        case 0:
          // Migrate from version 0 to 1
          return {
            ...state,
            version: 1,
            // Add any necessary state transformations
          } as T;
        // Add more cases for future versions
      }
    }

    return state as T;
  };

  // Initialize store with migrated state
  const state = f(set, get, store);
  const migratedState = migrateState(state);

  return {
    ...migratedState,
    version: CURRENT_VERSION,
  };
}; 