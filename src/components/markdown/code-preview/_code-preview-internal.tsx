import { demos } from "@/data/globals";
import { type AvailableDemo } from "@/data/types";
import { Suspense, type PropsWithChildren } from "react";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";

type Prop = PropsWithChildren & {
  demo: AvailableDemo;
};

export function CodePreviewInternal({ demo, children }: Prop) {
  const Component = demos[demo];

  return (
    <Tabs defaultValue="preview" className="not-content">
      <TabsList className="w-full">
        <TabsTrigger value="preview" className="flex grow-0">
          Preview
        </TabsTrigger>

        <TabsTrigger value="code" className="flex grow-0">
          Code
        </TabsTrigger>
      </TabsList>

      <Card className="no-scrollbar h-112.5 overflow-y-auto rounded-lg bg-transparent p-0">
        <CardContent className="h-full p-0">
          <TabsContent
            value="preview"
            className="flex h-full items-center justify-center p-4"
          >
            <Suspense
              fallback={<Loader2Icon className="size-16 animate-spin" />}
            >
              <Component />
            </Suspense>
          </TabsContent>

          <TabsContent value="code" className="h-full">
            {children}
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
