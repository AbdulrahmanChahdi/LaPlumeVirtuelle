/**
 * Utility functions for smart navigation after authentication
 */

/**
 * Save the intended destination before redirecting to login
 * @param {string} destination The path where user wanted to go
 */
export function saveIntendedDestination(destination) {
  try {
    localStorage.setItem("intendedDestination", destination)
  } catch (e) {
    console.error("Failed to save intended destination:", e)
  }
}

/**
 * Get the intended destination and clear it from storage
 * @returns {string|null} The saved destination or null
 */
export function getAndClearIntendedDestination() {
  try {
    const destination = localStorage.getItem("intendedDestination")
    localStorage.removeItem("intendedDestination")
    return destination
  } catch (e) {
    console.error("Failed to get intended destination:", e)
    return null
  }
}

/**
 * Determine the redirect destination with fallbacks
 * Priority: onboarding > query redirect > intended destination > default
 * @param {string|null} queryRedirect Redirect from query params
 * @param {string} defaultDestination Default fallback destination
 * @param {Object|null} user User object to check onboarding status
 * @returns {string} The final destination
 */
export function getRedirectDestination(queryRedirect, defaultDestination = "/dashboard", user = null) {
  // Admin users always land in dedicated admin workspace
  if (user?.role === "ADMIN") {
    return "/admin"
  }

  // HIGHEST PRIORITY: Check if user needs onboarding
  if (user) {
    const onboardingDone = localStorage.getItem("onboardingDone") === "true"
    const hasPreferences = user.preferences && user.preferences.length > 0
    
    // If user hasn't completed onboarding, redirect there
    if (!onboardingDone && !hasPreferences) {
      return "/onboarding/preferences"
    }
  }

  // Try query param (explicit redirect)
  if (queryRedirect) {
    return queryRedirect
  }

  // Try stored intended destination
  const intended = getAndClearIntendedDestination()
  if (intended) {
    return intended
  }

  // Fallback to default
  return defaultDestination
}
