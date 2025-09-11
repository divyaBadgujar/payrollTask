import React, { ErrorInfo, ReactNode } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Button from "@mui/material/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  toggleDetails = (): void => {
    this.setState((prevState) => ({ showDetails: !prevState.showDetails }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <ErrorOutlineIcon style={styles.icon} />
            <h2 style={styles.title}>Oops! Something went wrong.</h2>
            <p style={styles.message}>
              An unexpected error occurred. Please try refreshing the page.
            </p>

            <div style={styles.buttonGroup}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
              <Button variant="text" onClick={this.toggleDetails}>
                {this.state.showDetails ? "Hide Details" : "Show Details"}
              </Button>
            </div>

            {this.state.showDetails && this.state.error && (
              <pre style={styles.details}>{this.state.error.toString()}</pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
    backgroundColor: "#f9f9f9",
    padding: "2rem",
  },
  card: {
    textAlign: "center",
    background: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    width: "100%",
  },
  icon: {
    fontSize: "3rem",
    color: "#e53935",
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "1.5rem",
    margin: "0.5rem 0",
  },
  message: {
    color: "#555",
    marginBottom: "1.5rem",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  details: {
    marginTop: "1rem",
    padding: "1rem",
    background: "#f1f1f1",
    color: "#d32f2f",
    fontSize: "0.85rem",
    borderRadius: "4px",
    textAlign: "left",
    maxHeight: "200px",
    overflowY: "auto",
  },
};

export default ErrorBoundary;
