import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { type PropsWithChildren, type ReactNode } from "react";

type Prop = PropsWithChildren & {
  cliSteps: ReactNode;
};

export function InstallationTabsInternal({ children, cliSteps }: Prop) {
  const [selectedTab, setSelectedTab] = useLocalStorage(
    "installation-method",
    "cli",
  );
  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="not-content"
    >
      <TabsList>
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="cli">{cliSteps}</TabsContent>
      <TabsContent value="manual">{children}</TabsContent>
    </Tabs>
  );
}
