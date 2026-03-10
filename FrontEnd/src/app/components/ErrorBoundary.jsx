import React from "react"

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error("Erreur non capturee:", error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white border border-borderSoft rounded-lg p-6 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-ink mb-2">Un probleme est survenu</h1>
            <p className="text-sm text-inkSoft mb-6">
              Une erreur inattendue a ete detectee. Vous pouvez recharger la page.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2 rounded bg-accent text-white hover:bg-accentHover transition"
            >
              Recharger
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
