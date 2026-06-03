import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import type React from "react";

interface AsyncButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "onClick"> {
  onClick: () => Promise<void>;
}

export function AsyncButton({
  onClick,
  children,
  disabled,
  ...props
}: AsyncButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={disabled || loading} {...props}>
      {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
      {children}
    </Button>
  );
}
