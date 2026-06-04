import {
  AsyncScope,
  AsyncContent,
  AsyncTrigger,
  useAsyncScope,
} from "@/registry/base/async-scope/components/async-scope";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";

type AccountData = { syncedAt: string };

const syncDashboard = async (): Promise<AccountData> => {
  await new Promise((r) => setTimeout(r, 2000));
  return { syncedAt: new Date().toISOString() };
};

function SyncStatus() {
  const { isIdle, isLoading, isSuccess, isError, data } =
    useAsyncScope<AccountData>();

  if (isIdle) return null;

  if (isLoading)
    return (
      <span className="animate-pulse text-xs text-muted-foreground">
        Syncing…
      </span>
    );

  if (isError)
    return <span className="text-xs text-destructive">Sync failed</span>;

  if (isSuccess)
    return (
      <span className="text-xs text-emerald-500">
        Synced at {new Date(data.syncedAt).toLocaleTimeString()}
      </span>
    );

  return null;
}

const stats = [
  { label: "Revenue", value: "$12,345" },
  { label: "Orders", value: "1,234" },
  { label: "Users", value: "5,678" },
  { label: "Uptime", value: "99.9%" },
];

export function MultiContentAsyncScope() {
  return (
    <AsyncScope
      action={syncDashboard}
      onSuccess={() => toast.success("Dashboard synced")}
      onError={() => toast.error("Sync failed")}
    >
      <div className="flex w-full max-w-xs flex-col gap-4">
        <AsyncTrigger variant="outline" className="w-fit gap-2">
          <RefreshCwIcon className="size-4" />
          Sync Dashboard
        </AsyncTrigger>
        <SyncStatus />

        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value }) => (
            <Card key={label}>
              <AsyncContent>
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{value}</p>
                </CardContent>
              </AsyncContent>
            </Card>
          ))}
        </div>
      </div>
    </AsyncScope>
  );
}
