"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as common from "@zxcvbn-ts/language-common";
import * as english from "@zxcvbn-ts/language-en";
import * as german from "@zxcvbn-ts/language-de";
import type { OptionsType } from "@zxcvbn-ts/core";
import { CheckCircle2Icon, Loader2Icon, ShieldAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PasswordInput,
  PasswordInputRules,
  PasswordInputStrengthChecker,
} from "@/registry/base/password-input/components/password-input";

// ---- zxcvbn options (defined at module level — never recreated) ----

const OPTIONS: OptionsType = {
  translations: english.translations,
  graphs: common.adjacencyGraphs,
  dictionary: {
    ...common.dictionary,
    ...english.dictionary,
    ...german.dictionary,
    banned: ["acmecorp", "welcome", "letmein", "admin"],
  },
  useLevenshteinDistance: true,
  levenshteinThreshold: 2,
};

// ---- rules ----

const RULES = [
  { label: "At least 10 characters", test: (p: string) => p.length >= 10 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  {
    label: "One special character",
    test: (p: string) => /[^a-zA-Z0-9]/.test(p),
  },
];

const THRESHOLD = 3;

// ---- mock breach check ----
// In production: SHA-1 hash the password, send the first 5 chars to
// api.pwnedpasswords.com/range/{prefix}, check if the suffix appears in the response.

const BREACHED = new Set([
  "password",
  "password123",
  "password1",
  "123456",
  "12345678",
  "letmein",
  "qwerty",
  "abc123",
  "monkey",
  "dragon",
  "welcome",
  "admin",
  "iloveyou",
  "sunshine",
  "princess",
  "master",
]);

async function mockBreachCheck(password: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 700));
  return BREACHED.has(password.toLowerCase());
}

// ---- component ----

type BreachState = "idle" | "checking" | "safe" | "breached";

export function AdvancedPasswordInput() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [score, setScore] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [breach, setBreach] = useState<BreachState>("idle");

  const userInputs = useMemo(
    () => [username, email].filter(Boolean),
    [username, email],
  );

  const breachTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (breachTimer.current) clearTimeout(breachTimer.current);

    if (password.length < 6) {
      setBreach("idle");
      return;
    }

    setBreach("checking");
    breachTimer.current = setTimeout(() => {
      mockBreachCheck(password).then((hit) =>
        setBreach(hit ? "breached" : "safe"),
      );
    }, 700);

    return () => {
      if (breachTimer.current) clearTimeout(breachTimer.current);
    };
  }, [password]);

  const allRulesPassed = RULES.every((r) => r.test(password));
  const canSubmit = score >= THRESHOLD && breach === "safe" && allRulesPassed;

  return (
    <form
      className="w-full max-w-sm space-y-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Username</label>
        <Input
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create password"
        >
          <PasswordInputStrengthChecker
            options={OPTIONS}
            userInputs={userInputs}
            threshold={THRESHOLD}
            onScoreChange={setScore}
          />
          <BreachIndicator state={breach} />
          <PasswordInputRules rules={RULES} />
        </PasswordInput>
      </div>
      <Button type="submit" disabled={!canSubmit} className="w-full">
        Create account
      </Button>
    </form>
  );
}

function BreachIndicator({ state }: { state: BreachState }) {
  if (state === "idle") return null;

  return (
    <div
      className={cn("flex items-center gap-2 text-sm transition-colors", {
        "text-muted-foreground": state === "checking",
        "text-primary": state === "safe",
        "text-destructive": state === "breached",
      })}
    >
      {state === "checking" && (
        <Loader2Icon className="size-3.5 shrink-0 animate-spin" />
      )}
      {state === "safe" && <CheckCircle2Icon className="size-3.5 shrink-0" />}
      {state === "breached" && (
        <ShieldAlertIcon className="size-3.5 shrink-0" />
      )}
      {state === "checking" && "Checking breach databases…"}
      {state === "safe" && "Not found in known breaches"}
      {state === "breached" &&
        "Found in known data breaches , please choose a different password"}
    </div>
  );
}
