'use client'
import { useState, useEffect, useCallback } from 'react'

export interface GeoState {
  zone: string | null
  lat: number | null
  lng: number | null
  status: 'idle' | 'loading' | 'granted' | 'denied' | 'manual'
}

export function useGeolocation() {
  const [geo, setGeo] = useState<GeoState>({
    zone: null, lat: null, lng: null, status: 'idle'
  })

  const requestGPS = useCallback(() => {
    if (typeof window === 'undefined') return
    if (!navigator.geolocation) {
      setGeo(g => ({ ...g, status: 'denied' }))
      return
    }
    setGeo(g => ({ ...g, status: 'loading' }))
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es`,
            { headers: { 'Accept-Language': 'es' } }
          )
          const data = await res.json()
          const suburb = data.address?.suburb || data.address?.neighbourhood || ''
          const city = data.address?.city || data.address?.town || data.address?.village || 'Tu zona'
          const zone = suburb ? `${suburb}, ${city}` : city
          setGeo({ zone, lat: latitude, lng: longitude, status: 'granted' })
        } catch {
          setGeo({ zone: 'Tucumán', lat: latitude, lng: longitude, status: 'granted' })
        }
      },
      () => {
        setGeo(g => ({ ...g, status: 'denied' }))
      },
      { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false }
    )
  }, [])

  const setManualZone = useCallback((zone: string) => {
    setGeo(g => ({ ...g, zone, status: 'manual' }))
  }, [])

  useEffect(() => {
    // Pequeño delay para asegurar que el componente montó en el cliente
    const t = setTimeout(() => requestGPS(), 500)
    return () => clearTimeout(t)
  }, [requestGPS])

  return { geo, requestGPS, setManualZone }
}
