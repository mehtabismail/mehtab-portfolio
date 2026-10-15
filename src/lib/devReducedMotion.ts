/**
 * Dev-only switch for testing the reduced-motion experience without changing
 * OS settings: open any page with `?reduce-motion` in the URL. Stripped from
 * production builds.
 */
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('reduce-motion')) {
  const original = window.matchMedia.bind(window)
  window.matchMedia = (query: string) => {
    const result = original(query)
    if (!query.includes('prefers-reduced-motion')) return result
    const matches = !query.includes('no-preference')
    // MediaQueryList exposes read-only getters, so shadow them on a derived object.
    // Methods must stay bound to the real list or they throw "Illegal invocation".
    return Object.create(result, {
      matches: { value: matches },
      media: { value: query },
      addEventListener: { value: result.addEventListener.bind(result) },
      removeEventListener: { value: result.removeEventListener.bind(result) },
      addListener: { value: result.addListener.bind(result) },
      removeListener: { value: result.removeListener.bind(result) },
    }) as MediaQueryList
  }
  document.documentElement.dataset.forceReducedMotion = ''
}
