"use client";

import { useMemo, useState } from "react";
import * as english from "@zxcvbn-ts/language-en";
import type { OptionsType } from "@zxcvbn-ts/core";
import { Input } from "@/components/ui/input";
import {
  PasswordInput,
  PasswordInputStrengthChecker,
} from "@/registry/base/password-input/components/password-input";

const BANNED_TERMS = ["acmecorp", "welcome", "letmein", "admin", "kaui"];

const OPTIONS: OptionsType = {
  translations: {
    ...english.translations,
    warnings: {
      ...english.translations.warnings,
      userInputs: "Avoid using your name or email in your password.",
      common: "This password is too common.",
    },
    suggestions: {
      ...english.translations.suggestions,
      anotherWord: "Add an uncommon word to make it harder to guess.",
    },
  },
  dictionary: { banned: BANNED_TERMS },
  useLevenshteinDistance: true,
  levenshteinThreshold: 2,
};

export function PasswordInputWithCustomOptions() {
  const [username, setUsername] = useState("");

  const userInputs = useMemo(() => (username ? [username] : []), [username]);

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Username</label>
        <Input
          placeholder="e.g. johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <PasswordInput placeholder="Create password">
          <PasswordInputStrengthChecker
            options={OPTIONS}
            userInputs={userInputs}
          />
        </PasswordInput>
      </div>
      <p className="text-xs text-muted-foreground">
        Try: your username, <code>acm3corp</code>, <code>@cm3c0rp</code>,{" "}
        <code>acmecorpz</code>
      </p>
    </div>
  );
}
