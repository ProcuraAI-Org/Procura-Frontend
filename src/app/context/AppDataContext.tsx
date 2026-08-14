import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getDashboardOverview,
  getDashboardPayments,
  getDashboardEvents,
  type DashboardOverviewResponse,
  type DashboardPayment,
  type DashboardEvent,
} from "../api/client";

interface AppDataState {
  dashboard: DashboardOverviewResponse | null;
  /** null = not loaded yet; [] = loaded and empty */
  payments: DashboardPayment[] | null;
  /** null = not loaded yet; [] = loaded and empty */
  events: DashboardEvent[] | null;
  loadingDashboard: boolean;
  loadingPayments: boolean;
  loadingEvents: boolean;
}

interface AppDataContextValue extends AppDataState {
  preloadAll: () => Promise<void>;
  setDashboard: (d: DashboardOverviewResponse | null) => void;
  setPayments: (p: DashboardPayment[] | null) => void;
  setEvents: (e: DashboardEvent[] | null) => void;
  getOrLoadDashboard: () => Promise<DashboardOverviewResponse | null>;
  getOrLoadPayments: () => Promise<DashboardPayment[]>;
  getOrLoadEvents: () => Promise<DashboardEvent[]>;
}

const defaultState: AppDataState = {
  dashboard: null,
  payments: null,
  events: null,
  loadingDashboard: false,
  loadingPayments: false,
  loadingEvents: false,
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppDataState>(defaultState);

  const preloadAll = useCallback(async () => {
    setState((s) => ({
      ...s,
      loadingDashboard: true,
      loadingPayments: true,
      loadingEvents: true,
    }));
    try {
      const [dashboard, payments, events] = await Promise.all([
        getDashboardOverview().catch(() => null),
        getDashboardPayments().catch((): DashboardPayment[] => []),
        getDashboardEvents().catch((): DashboardEvent[] => []),
      ]);
      setState((s) => ({
        ...s,
        dashboard: dashboard ?? s.dashboard,
        payments: payments ?? s.payments,
        events: events ?? s.events,
        loadingDashboard: false,
        loadingPayments: false,
        loadingEvents: false,
      }));
    } catch {
      setState((s) => ({
        ...s,
        loadingDashboard: false,
        loadingPayments: false,
        loadingEvents: false,
      }));
    }
  }, []);

  const setDashboard = useCallback((d: DashboardOverviewResponse | null) => {
    setState((s) => ({ ...s, dashboard: d }));
  }, []);

  const setPayments = useCallback((p: DashboardPayment[] | null) => {
    setState((s) => ({ ...s, payments: p }));
  }, []);

  const setEvents = useCallback((e: DashboardEvent[] | null) => {
    setState((s) => ({ ...s, events: e }));
  }, []);

  const getOrLoadDashboard = useCallback(async () => {
    if (state.dashboard != null) return state.dashboard;
    setState((s) => ({ ...s, loadingDashboard: true }));
    try {
      const d = await getDashboardOverview();
      setState((s) => ({ ...s, dashboard: d, loadingDashboard: false }));
      return d;
    } catch {
      setState((s) => ({ ...s, loadingDashboard: false }));
      return null;
    }
  }, [state.dashboard]);

  const getOrLoadPayments = useCallback(async () => {
    if (state.payments !== null) return state.payments;
    setState((s) => ({ ...s, loadingPayments: true }));
    try {
      const p = await getDashboardPayments();
      setState((s) => ({ ...s, payments: p, loadingPayments: false }));
      return p;
    } catch {
      setState((s) => ({ ...s, loadingPayments: false }));
      return [];
    }
  }, [state.payments]);

  const getOrLoadEvents = useCallback(async () => {
    if (state.events !== null) return state.events;
    setState((s) => ({ ...s, loadingEvents: true }));
    try {
      const e = await getDashboardEvents();
      setState((s) => ({ ...s, events: e, loadingEvents: false }));
      return e;
    } catch {
      setState((s) => ({ ...s, loadingEvents: false }));
      return [];
    }
  }, [state.events]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      ...state,
      preloadAll,
      setDashboard,
      setPayments,
      setEvents,
      getOrLoadDashboard,
      getOrLoadPayments,
      getOrLoadEvents,
    }),
    [
      state,
      preloadAll,
      setDashboard,
      setPayments,
      setEvents,
      getOrLoadDashboard,
      getOrLoadPayments,
      getOrLoadEvents,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
