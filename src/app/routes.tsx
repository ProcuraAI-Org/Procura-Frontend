import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateTask from "./pages/CreateTask";
import AgentExecution from "./pages/AgentExecution";
import Wallet from "./pages/Wallet";
import Policies from "./pages/Policies";
import Receipts from "./pages/Receipts";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import ActiveJobs from "./pages/ActiveJobs";
import ComingSoon from "./pages/ComingSoon";
import Faucet from "./pages/Faucet";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/auth",
    Component: Auth,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/create-task",
    Component: CreateTask,
  },
  {
    path: "/execution/:id",
    Component: AgentExecution,
  },
  {
    path: "/wallet",
    Component: Wallet,
  },
  {
    path: "/active-jobs",
    Component: ActiveJobs,
  },
  {
    path: "/policies",
    Component: Policies,
  },
  {
    path: "/receipts",
    Component: Receipts,
  },
  {
    path: "/logs",
    Component: Logs,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/faucet",
    Component: Faucet,
  },
  {
    path: "*",
    Component: ComingSoon,
  },
]);