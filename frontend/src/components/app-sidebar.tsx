import ParseButton from "@/components/parse-button";
import ResetButton from "@/components/reset-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

export default function AppSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-neutral-300">
      <SidebarHeader className="bg-neutral-100">
        <div className="flex items-center justify-center py-4">
          {state === "expanded" ? (
            <Image
              src="/orbital-wordmark.svg"
              width={150}
              height={50}
              alt="Orbital Wordmark"
            />
          ) : (
            <Image
              src="/orbital-icon.svg"
              width={24}
              height={24}
              alt="Orbital Icon"
            />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-neutral-100 border-y-neutral-300 border-y">
        <SidebarGroup className="gap-2">
          <ParseButton expanded={state === "expanded"} />
          <ResetButton expanded={state === "expanded"} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-center py-2 text-neutral-500 text-sm">
          {state === "expanded" ? "Made by Éanna Morley" : "ÉM"}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
