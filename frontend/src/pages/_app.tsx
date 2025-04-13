import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <TooltipProvider>
          <Toaster />
          <AppSidebar />
          <main className="w-full h-screen flex flex-col bg-neutral-200">
            <SidebarTrigger className="text-neutral-500" />
            <Component {...pageProps} />
          </main>
        </TooltipProvider>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
