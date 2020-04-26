import React from "react";

import ErrorPrompt from "./error.component";

class ErrorBoundary extends React.Component {
  constructor() {
    super();

    this.state = {
      hasErrored: false,
    };
  }

  static getDerivedStateFromError(err) {
    console.log("hit");
    return { message: err.message, hasErrored: true };
  }

  componentDidCatch(err, info) {
    console.log("An error has occurred: ", err, info);
    this.setState({
      ...this.state,
      message: err.message,
      info,
      hasErrored: true,
    });
  }

  render() {
    return this.state.hasErrored ? (
      <ErrorPrompt
        image="construction"
        message={
          "An unexpected error has occurred. Please refresh the application to try again."
        }
      />
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
