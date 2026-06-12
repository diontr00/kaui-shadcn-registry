"use client";

import { useState } from "react";
import {
  Rocket,
  RefreshCw,
  RotateCcw,
  UserMinus,
  GitBranch,
} from "lucide-react";
import { toast } from "sonner";

import { AsyncButton } from "@/registry/base/async-button/components/async-button";
import {
  AsyncScope,
  AsyncContent,
  AsyncTrigger,
} from "@/registry/base/async-scope/components/async-scope";
import { ConfirmAction } from "@/registry/base/confirm-action/components/confirm-action";
import { Combobox } from "@/registry/base/combobox/components/combobox";
import { MultiSelect } from "@/registry/base/multi-select/components/multi-select";
import { Button } from "@/components/ui/button";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Data ────────────────────────────────────────────────────────────────────

const members: SelectionOption<string>[] = [
  { value: "alice", label: "Alice Johnson" },
  { value: "bob", label: "Bob Smith" },
  { value: "carol", label: "Carol Williams" },
  { value: "dave", label: "Dave Brown" },
];

const labelOptions: SelectionOption<string>[] = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "design", label: "Design" },
  { value: "perf", label: "Performance" },
  { value: "docs", label: "Docs" },
];

// ─── Card: Combobox ───────────────────────────────────────────────────────────

function ComboboxCard() {
  const [assignee, setAssignee] = useState<SelectionOption<string> | null>(
    members[0] ?? null,
  );

  return (
    <Card name="Combobox" desc="Single-select with inline search">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Assignee
        </span>
        <Combobox
          items={members}
          selected={assignee}
          onSelectedChange={setAssignee}
          placeholder="Search members..."
          closeAfterSelect
        />
        {assignee && (
          <p className="text-xs text-muted-foreground">
            Assigned to{" "}
            <span className="font-medium text-foreground">
              {assignee.label}
            </span>
          </p>
        )}
      </div>
    </Card>
  );
}

// ─── Card: MultiSelect ────────────────────────────────────────────────────────

function MultiSelectCard() {
  const [labels, setLabels] = useState<string[]>(["bug", "feature"]);
  const labelMap = new Map(labelOptions.map((l) => [l.value, l]));

  return (
    <Card name="MultiSelect" desc="Multi-pick with search and clear">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Labels
        </span>
        <MultiSelect
          items={labelOptions}
          value={labels}
          onValueChange={setLabels}
          placeholder="Add labels..."
        />
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {labels.map((v) => (
              <span
                key={v}
                className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {labelMap.get(v)?.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Card: AsyncButton ───────────────────────────────────────────────────────

function AsyncButtonCard() {
  return (
    <Card name="AsyncButton" desc="Loading, success, and error built-in">
      <div className="flex flex-col gap-2">
        <AsyncButton
          action={() => sleep(1200)}
          loadingText="Deploying..."
          className="w-full justify-start gap-2"
          onSuccess={() => toast.success("Deployed successfully")}
        >
          <Rocket className="size-4" />
          Deploy to Production
        </AsyncButton>
        <AsyncButton
          action={() => sleep(900)}
          loadingText="Syncing..."
          variant="outline"
          className="w-full justify-start gap-2"
          onSuccess={() => toast.success("Branch synced")}
        >
          <GitBranch className="size-4" />
          Sync Branch
        </AsyncButton>
        <AsyncButton
          action={() => sleep(700)}
          loadingText="Saving..."
          variant="secondary"
          className="w-full justify-start gap-2"
          onSuccess={() => toast.success("Draft saved")}
        >
          Save Draft
        </AsyncButton>
      </div>
    </Card>
  );
}

// ─── Card: AsyncScope ────────────────────────────────────────────────────────

function AsyncScopeCard() {
  return (
    <Card name="AsyncScope" desc="Scope async state across any component tree">
      <AsyncScope
        action={() => sleep(1100)}
        onSuccess={() => toast.success("Stats refreshed")}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Project Stats
          </span>
          <AsyncTrigger variant="ghost" size="icon" className="size-6">
            <RefreshCw className="size-3" />
          </AsyncTrigger>
        </div>
        <AsyncContent>
          <div className="space-y-2">
            {(
              [
                ["Open Issues", "24"],
                ["Pull Requests", "7"],
                ["Contributors", "12"],
                ["Coverage", "94%"],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium tabular-nums">{value}</span>
              </div>
            ))}
          </div>
        </AsyncContent>
      </AsyncScope>
    </Card>
  );
}

// ─── Card: ConfirmAction (spans 2 rows) ──────────────────────────────────────

function ConfirmActionCard() {
  return (
    <Card name="ConfirmAction" desc="Wrap any trigger to require confirmation">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-foreground">Remove member</p>
          <p className="text-xs text-muted-foreground">
            Revokes access and unassigns all open tasks from this member.
          </p>
          <ConfirmAction
            title="Remove this member?"
            description="This will revoke their access and unassign all open tasks."
            confirmText="Remove"
            confirmVariant="destructive"
            action={() => sleep(800)}
            onSuccess={() => toast.success("Member removed.")}
          >
            <Button variant="outline" size="sm" className="mt-1 w-fit gap-2">
              <UserMinus className="size-3.5" />
              Remove Member
            </Button>
          </ConfirmAction>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-foreground">Reset settings</p>
          <p className="text-xs text-muted-foreground">
            Restore all project settings to their factory defaults.
          </p>
          <ConfirmAction
            title="Reset all settings?"
            description="All settings will be restored to defaults. Custom configuration will be lost."
            confirmText="Reset"
            action={() => sleep(800)}
            onSuccess={() => toast.success("Settings reset.")}
          >
            <Button variant="outline" size="sm" className="mt-1 w-fit gap-2">
              <RotateCcw className="size-3.5" />
              Reset Settings
            </Button>
          </ConfirmAction>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-destructive">Danger zone</p>
          <p className="text-xs text-muted-foreground">
            Permanently delete this project and all its data.
          </p>
          <ConfirmAction
            title="Delete project?"
            description="This will permanently delete the project, all issues, and all history. This cannot be undone."
            confirmText="Delete project"
            confirmVariant="destructive"
            action={() => sleep(1000)}
            onSuccess={() => toast.error("Project deleted.")}
          >
            <Button
              variant="destructive"
              size="sm"
              className="mt-1 w-fit gap-2"
            >
              Delete Project
            </Button>
          </ConfirmAction>
        </div>
      </div>
    </Card>
  );
}

// ─── Shared Card wrapper ──────────────────────────────────────────────────────

function Card({
  name,
  desc,
  children,
  className,
}: {
  name: string;
  desc: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm ${className ?? ""}`}
    >
      <div className="border-b border-border pb-3">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function LandingShowcase() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Left: 2×2 grid of four components */}
      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
        <ComboboxCard />
        <AsyncButtonCard />
        <MultiSelectCard />
        <AsyncScopeCard />
      </div>

      {/* Right: ConfirmAction spanning full height */}
      <div className="flex lg:w-72 xl:w-80">
        <ConfirmActionCard />
      </div>
    </div>
  );
}
