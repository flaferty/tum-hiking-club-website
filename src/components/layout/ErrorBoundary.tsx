import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw, TriangleAlert } from "lucide-react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: unknown;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught error", error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-xl border border-border bg-card p-6">
        <div className="max-w-md">
          <Alert>
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              A part of this page failed to load. You can try again.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button onClick={this.reset} className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
