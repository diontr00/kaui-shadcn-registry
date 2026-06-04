import {
  AsyncScope,
  AsyncContent,
  AsyncTrigger,
  useAsyncScope,
} from "@/registry/base/async-scope/components/async-scope";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";

type Stats = { revenue: string; users: number; growth: string };

const fetchStats = async (): Promise<Stats> => {
  await new Promise((r) => setTimeout(r, 1500));
  if (Math.random() > 0.5) throw new Error("Network timeout");
  return { revenue: "$48,293", users: 2847, growth: "+12%" };
};

function StatsCard() {
  const { isError, isSuccess, data, execute, reset } = useAsyncScope<Stats>();

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center gap-3 py-8">
          <AlertCircleIcon className="size-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Failed to load stats</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reset();
              execute();
            }}
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <AsyncContent>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            Overview
            {isSuccess && (
              <span className="text-xs font-normal text-emerald-500">
                {data.growth} this month
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-2xl font-bold">
            {isSuccess ? data.revenue : "$—"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isSuccess ? `${data.users.toLocaleString()} users` : "No data yet"}
          </p>
        </CardContent>
      </Card>
    </AsyncContent>
  );
}

export function ErrorRetryAsyncScope() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <AsyncScope
        action={fetchStats}
        onSuccess={() => toast.success("Stats loaded")}
        onError={() => toast.error("Load failed — try again")}
      >
        <AsyncTrigger variant="outline" className="w-fit">
          Load Stats
        </AsyncTrigger>
        <StatsCard />
      </AsyncScope>
    </div>
  );
}
