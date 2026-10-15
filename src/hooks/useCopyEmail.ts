import { useCallback } from 'react'
import { site } from '../content/site'
import { useToast } from '../components/ui/Toast'

function legacyCopy(text: string) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand('copy')
  area.remove()
  return ok
}

export function useCopyEmail() {
  const toast = useToast()
  return useCallback(async () => {
    let ok: boolean
    try {
      await navigator.clipboard.writeText(site.email)
      ok = true
    } catch {
      ok = legacyCopy(site.email)
    }
    toast(ok ? 'Email copied to clipboard' : `Email: ${site.email}`)
  }, [toast])
}
