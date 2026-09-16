import { useEffect, useState } from 'react'

/** Loads an image URL so it can be drawn on a canvas. Null until it has loaded, or if it fails. */
export function useHtmlImage(src: string) {
  const [loaded, setLoaded] = useState<{ src: string; image: HTMLImageElement } | null>(null)

  useEffect(() => {
    const image = new window.Image()
    image.onload = () => {
      setLoaded({ src, image })
    }
    image.src = src
    return () => {
      image.onload = null
    }
  }, [src])

  return loaded?.src === src ? loaded.image : null
}
