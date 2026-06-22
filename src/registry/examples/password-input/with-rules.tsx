import {
  PasswordInput,
  PasswordInputRules,
  PasswordInputStrengthChecker,
} from "@/registry/base/password-input/components/password-input";

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  {
    label: "One special character",
    test: (p: string) => /[^a-zA-Z0-9]/.test(p),
  },
];

export function PasswordInputWithRules() {
  return (
    <div className="w-full max-w-sm">
      <PasswordInput placeholder="Enter password">
        <PasswordInputStrengthChecker />
        <PasswordInputRules rules={rules} />
      </PasswordInput>
    </div>
  );
}
