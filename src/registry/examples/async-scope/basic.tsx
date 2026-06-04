import {
  AsyncScope,
  AsyncContent,
  AsyncTrigger,
} from "@/registry/base/async-scope/components/async-scope";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const refreshData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
};

export function BasicAsyncScope() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <AsyncScope
        action={refreshData}
        onSuccess={() => toast.success("Data refreshed")}
        onError={() => toast.error("Failed to refresh")}
      >
        <AsyncTrigger variant="outline" className="w-fit">
          Refresh Data
        </AsyncTrigger>
        <Card>
          <AsyncContent>
            <CardHeader>
              <CardTitle>Dashboard Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm text-muted-foreground">Revenue: $12,345</p>
              <p className="text-sm text-muted-foreground">Orders: 42</p>
              <p className="text-sm text-muted-foreground">Users: 1,234</p>
            </CardContent>
          </AsyncContent>
        </Card>
      </AsyncScope>
    </div>
  );
}
