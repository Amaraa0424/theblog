import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./button";

interface ErrorProps {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Error({ title = "Something went wrong!", message, action }: ErrorProps) {
  return (
    <div className="min-h-[400px] w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background/50 backdrop-blur-sm border border-border rounded-3xl p-8 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="rounded-full bg-red-500/10 p-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
            <p className="text-muted-foreground">{message}</p>
          </div>
          {action && (
            <Button
              onClick={action.onClick}
              variant="secondary"
              size="lg"
              className="gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 