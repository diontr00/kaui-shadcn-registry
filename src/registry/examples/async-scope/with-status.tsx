import {
  AsyncScope,
  AsyncContent,
  AsyncTrigger,
  useAsyncScope,
} from "@/registry/base/async-scope/components/async-scope";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type AccountData = { syncedAt: string };

const syncAccount = async (): Promise<AccountData> => {
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

export function WithStatusAsyncScope() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <AsyncScope
        action={syncAccount}
        onSuccess={() => toast.success("Account synced")}
        onError={() => toast.error("Sync failed")}
      >
        <div className="flex items-center justify-between">
          <AsyncTrigger variant="outline" size="sm">
            Sync Account
          </AsyncTrigger>
          <SyncStatus />
        </div>
        <AsyncContent>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm text-muted-foreground">Profile</p>
              <p className="text-sm text-muted-foreground">Billing</p>
              <p className="text-sm text-muted-foreground">Security</p>
            </CardContent>
          </Card>
        </AsyncContent>
      </AsyncScope>
    </div>
  );
}
