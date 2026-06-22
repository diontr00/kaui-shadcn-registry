"use client";

import { ZxcvbnFactory, type OptionsType } from "@zxcvbn-ts/core";
import { CircleCheckIcon, CircleIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import {
  type ChangeEvent,
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

const PasswordInputContext = createContext<{ password: string } | null>(null);

export function PasswordInput({
  children,
  onChange,
  value,
  defaultValue,
  ...props
}: Omit<ComponentProps<typeof Input>, "type"> & {
  children?: ReactNode;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(defaultValue ?? "");

  const Icon = showPassword ? EyeOffIcon : EyeIcon;
  const currentValue = value ?? password;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    onChange?.(e);
  };

  return (
    <PasswordInputContext value={{ password: currentValue.toString() }}>
      <div className="space-y-3">
        <InputGroup>
          <InputGroupInput
            {...props}
            value={value}
            defaultValue={defaultValue}
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={() => setShowPassword((p) => !p)}
            >
              <Icon className="size-4.5" />
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {children}
      </div>
    </PasswordInputContext>
  );
}

export function PasswordInputStrengthChecker({
  options,
  userInputs,
  threshold = 3,
  showFeedback = true,
  onScoreChange,
}: {
  options?: OptionsType;
  userInputs?: (string | number)[];
  threshold?: 0 | 1 | 2 | 3 | 4;
  showFeedback?: boolean;
  onScoreChange?: (score: 0 | 1 | 2 | 3 | 4) => void;
}) {
  const [zxcvbn, setZxcvbn] = useState<InstanceType<
    typeof ZxcvbnFactory
  > | null>(null);
  const [errorLoadingOptions, setErrorLoadingOptions] = useState(false);
  const optionsRef = useRef(options);
  const onScoreChangeRef = useRef(onScoreChange);
  onScoreChangeRef.current = onScoreChange;

  const { password } = usePasswordInput();
  const deferredPassword = useDeferredValue(password);

  const strengthResult = useMemo(() => {
    if (!zxcvbn || deferredPassword.length === 0) {
      return {
        score: 0 as const,
        feedback: {
          warning: undefined as string | undefined,
          suggestions: [] as string[],
        },
      };
    }
    return zxcvbn.check(deferredPassword, userInputs);
  }, [zxcvbn, deferredPassword, userInputs]);

  useEffect(() => {
    const opts = optionsRef.current;
    if (opts) {
      if (opts.translations) {
        setZxcvbn(new ZxcvbnFactory(opts));
      } else {
        import("@zxcvbn-ts/language-en")
          .then((english) => {
            setZxcvbn(
              new ZxcvbnFactory({
                translations: english.translations,
                ...opts,
              }),
            );
          })
          .catch(() => setErrorLoadingOptions(true));
      }
      return;
    }
    Promise.all([
      import("@zxcvbn-ts/language-common"),
      import("@zxcvbn-ts/language-en"),
    ])
      .then(([common, english]) => {
        setZxcvbn(
          new ZxcvbnFactory({
            translations: english.translations,
            graphs: common.adjacencyGraphs,
            dictionary: {
              ...common.dictionary,
              ...english.dictionary,
            },
          }),
        );
      })
      .catch(() => setErrorLoadingOptions(true));
  }, []);

  useEffect(() => {
    onScoreChangeRef.current?.(strengthResult.score);
  }, [strengthResult.score]);

  function getLabel() {
    if (deferredPassword.length === 0) return "Password strength";
    if (!zxcvbn) return "Checking...";
    switch (strengthResult.score) {
      case 0:
      case 1:
        return "Very weak";
      case 2:
        return "Weak";
      case 3:
        return "Strong";
      case 4:
        return "Very strong";
      default:
        return "Unknown";
    }
  }

  const label = getLabel();
  const color =
    strengthResult.score >= threshold ? "bg-primary" : "bg-destructive";
  const { warning, suggestions } = strengthResult.feedback;
  const hasFeedback =
    showFeedback &&
    deferredPassword.length > 0 &&
    (warning != null || suggestions.length > 0);

  if (errorLoadingOptions) return null;

  return (
    <div className="space-y-1.5">
      <div
        role="progressbar"
        aria-label="Password strength"
        aria-valuenow={strengthResult.score}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuetext={label}
        className="flex gap-1"
      >
        {([0, 1, 2, 3] as const).map((level) => (
          <div
            key={`strength-bar-${level}`}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              strengthResult.score > level ? color : "bg-secondary",
            )}
          />
        ))}
      </div>
      <div className="flex justify-end text-sm text-muted-foreground">
        {label}
      </div>
      {hasFeedback && (
        <div className="space-y-0.5 text-sm text-muted-foreground">
          {warning && <p>{warning}</p>}
          {suggestions.map((s, i) => (
            <p key={i}>{s}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export type PasswordRule = {
  label: string;
  test: (password: string) => boolean;
};

export function PasswordInputRules({ rules }: { rules: PasswordRule[] }) {
  const { password } = usePasswordInput();
  const idle = password.length === 0;

  return (
    <ul className="space-y-1">
      {rules.map((rule, index) => {
        const passed = !idle && rule.test(password);
        return (
          <li
            key={index}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              passed ? "text-primary" : "text-muted-foreground",
            )}
          >
            {passed ? (
              <CircleCheckIcon className="size-3.5 shrink-0" />
            ) : (
              <CircleIcon className="size-3.5 shrink-0" />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

const usePasswordInput = () => {
  const context = useContext(PasswordInputContext);
  if (context == null) {
    throw new Error(
      "usePasswordInput must be used within a PasswordInputContext",
    );
  }
  return context;
};
