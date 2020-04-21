import React from "react";

import ErrorPrompt from "./error.component";

class ErrorBoundary extends React.Component {
  constructor() {
    super();

    this.state = {
      hasErrored: false,
    };
  }

  static getDerivedStateFromError() {
    return { ...state, hasErrored: true };
  }

  componentDidCatch(err) {
    console.log("An error has occurred: ", err);
  }

  render() {
    return this.state.hasErrored ? <ErrorPrompt /> : this.props.children;
  }
}

export default ErrorBoundary;
