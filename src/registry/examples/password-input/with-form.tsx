import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PasswordInput,
  PasswordInputStrengthChecker,
} from "@/registry/base/password-input/components/password-input";

const THRESHOLD = 3;

export function PasswordInputWithForm() {
  const [score, setScore] = useState<0 | 1 | 2 | 3 | 4>(0);

  return (
    <form
      className="w-full max-w-sm space-y-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <PasswordInput placeholder="Create password">
        <PasswordInputStrengthChecker
          threshold={THRESHOLD}
          onScoreChange={setScore}
        />
      </PasswordInput>
      <Button type="submit" className="w-full" disabled={score < THRESHOLD}>
        Create account
      </Button>
    </form>
  );
}
