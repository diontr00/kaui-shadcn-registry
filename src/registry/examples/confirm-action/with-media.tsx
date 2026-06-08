import { Button } from "@/components/ui/button";
import { ConfirmAction } from "@/registry/base/confirm-action/components/confirm-action";
import { KeyRoundIcon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function WithMediaConfirmAction() {
  const [revoked, setRevoked] = useState(false);

  const revokeKey = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    setRevoked(true);
  };

  return (
    <div className="flex w-80 flex-col gap-3 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Production API Key</p>
          <p className="font-mono text-xs text-muted-foreground">
            sk_live_••••••••3f9a
          </p>
          <div className="flex items-center gap-1.5">
            {revoked ? (
              <span className="text-xs text-destructive">Revoked</span>
            ) : (
              <>
                <ShieldCheckIcon className="size-3 text-emerald-500" />
                <span className="text-xs text-muted-foreground">
                  Last used 2 hours ago
                </span>
              </>
            )}
          </div>
        </div>

        {revoked ? (
          <Button variant="outline" size="sm" onClick={() => setRevoked(false)}>
            Restore
          </Button>
        ) : (
          <ConfirmAction
            title="Revoke API key?"
            description="Any service using this key will immediately lose access. This cannot be undone."
            confirmText="Revoke key"
            confirmVariant="destructive"
            media={<KeyRoundIcon />}
            action={revokeKey}
            onSuccess={() => toast.success("API key revoked")}
          >
            <Button variant="outline" size="sm">
              Revoke
            </Button>
          </ConfirmAction>
        )}
      </div>
    </div>
  );
}
