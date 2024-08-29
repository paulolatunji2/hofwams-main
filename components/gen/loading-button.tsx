import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const LoadingButton = ({
  isLoading,
  children,
  ...props
}: {
  isLoading: boolean;
  children: React.ReactNode;
  [x: string]: any;
}) => (
  <Button {...props} disabled={isLoading}>
    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    {isLoading ? "Loading..." : children}
  </Button>
);
