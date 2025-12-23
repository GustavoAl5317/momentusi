/**
 * Normaliza URLs de música do YouTube e Spotify
 * Aceita URLs completas, IDs ou links curtos
 */
export function normalizeMusicUrl(input: string): string {
  if (!input || !input.trim()) return ''
  
  const trimmed = input.trim()
  
  // Se já é uma URL válida, retornar como está
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  
  // YouTube: aceitar apenas o ID ou link curto
  // Exemplos aceitos:
  // - dQw4w9WgXcQ
  // - youtu.be/dQw4w9WgXcQ
  // - youtube.com/watch?v=dQw4w9WgXcQ
  
  // Verificar se é link curto do YouTube
  if (trimmed.includes('youtu.be/')) {
    const videoId = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0]
    if (videoId) {
      return `https://www.youtube.com/watch?v=${videoId}`
    }
  }
  
  // Verificar se contém youtube.com
  if (trimmed.includes('youtube.com')) {
    const match = trimmed.match(/[?&]v=([^&]+)/)
    if (match && match[1]) {
      return `https://www.youtube.com/watch?v=${match[1]}`
    }
  }
  
  // Se parece ser apenas um ID do YouTube (11 caracteres alfanuméricos)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/watch?v=${trimmed}`
  }
  
  // Spotify: aceitar apenas o ID da track/playlist/album
  // Exemplos aceitos:
  // - 4iV5W9uYEdYUVa79Axb7Rh (track ID)
  // - spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
  
  // Verificar se contém spotify.com
  if (trimmed.includes('spotify.com')) {
    const trackMatch = trimmed.match(/track\/([a-zA-Z0-9]+)/)
    const playlistMatch = trimmed.match(/playlist\/([a-zA-Z0-9]+)/)
    const albumMatch = trimmed.match(/album\/([a-zA-Z0-9]+)/)
    
    if (trackMatch && trackMatch[1]) {
      return `https://open.spotify.com/track/${trackMatch[1]}`
    }
    if (playlistMatch && playlistMatch[1]) {
      return `https://open.spotify.com/playlist/${playlistMatch[1]}`
    }
    if (albumMatch && albumMatch[1]) {
      return `https://open.spotify.com/album/${albumMatch[1]}`
    }
  }
  
  // Se parece ser apenas um ID do Spotify (22 caracteres alfanuméricos)
  if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
    return `https://open.spotify.com/track/${trimmed}`
  }
  
  // Se não conseguir identificar, retornar como está (pode ser uma URL incompleta)
  return trimmed
}

/**
 * Valida se a URL é do YouTube ou Spotify
 */
export function isValidMusicUrl(url: string): boolean {
  if (!url) return false
  
  return (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('spotify.com')
  )
}

