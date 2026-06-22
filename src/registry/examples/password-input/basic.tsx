import {
  PasswordInput,
  PasswordInputStrengthChecker,
} from "@/registry/base/password-input/components/password-input";

export function BasicPasswordInput() {
  return (
    <div className="w-full max-w-sm">
      <PasswordInput placeholder="Enter password">
        <PasswordInputStrengthChecker />
      </PasswordInput>
    </div>
  );
}
