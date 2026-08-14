import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SidebarProvider } from "./context/SidebarContext";
import { AppDataProvider } from "./context/AppDataContext";

export default function App() {
  return (
    <SidebarProvider>
      <AppDataProvider>
        <RouterProvider router={router} />
      </AppDataProvider>
    </SidebarProvider>
  );
}