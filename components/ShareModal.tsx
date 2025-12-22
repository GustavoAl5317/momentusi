'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
// Ícones simples usando emojis e SVG inline
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
)
const IconShare = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
)
const IconCopy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
)
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)
const IconDownload = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
)

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  timeline: {
    title: string
    subtitle?: string
    slug: string
  }
  timelineUrl: string
  theme?: string
}

export default function ShareModal({
  isOpen,
  onClose,
  timeline,
  timelineUrl,
  theme = 'default',
}: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'share' | 'email' | 'qrcode'>('share')
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrDownloaded, setQrDownloaded] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(timelineUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const handleShare = async (platform: string) => {
    const text = `${timeline.title}${timeline.subtitle ? ` - ${timeline.subtitle}` : ''}`
    const encodedUrl = encodeURIComponent(timelineUrl)
    const encodedText = encodeURIComponent(text)

    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    }

    const url = shareUrls[platform]
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  const handleSendEmail = async () => {
    if (!email || !email.includes('@')) {
      alert('Por favor, insira um email válido')
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/share/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          timelineTitle: timeline.title,
          timelineSubtitle: timeline.subtitle,
          timelineUrl,
        }),
      })

      if (response.ok) {
        setEmailSent(true)
        setEmail('')
        setTimeout(() => {
          setEmailSent(false)
        }, 3000)
      } else {
        const error = await response.json()
        alert(`Erro ao enviar email: ${error.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      alert('Erro ao enviar email. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  const handleDownloadQR = () => {
    const svgElement = document.querySelector('#qr-code-container svg')
    if (!svgElement) {
      alert('QR Code não encontrado')
      return
    }

    try {
      // Converter SVG para canvas e depois para imagem
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      // Aumentar tamanho para melhor qualidade
      canvas.width = 400
      canvas.height = 400

      img.onload = () => {
        if (ctx) {
          // Fundo branco
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Desenhar QR code
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          // Converter para blob e download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `qr-code-${timeline.slug}.png`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
              setQrDownloaded(true)
              setTimeout(() => setQrDownloaded(false), 2000)
            }
          }, 'image/png')
        }
      }

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      img.src = url
    } catch (error) {
      console.error('Erro ao baixar QR code:', error)
      alert('Erro ao baixar QR code. Tente novamente.')
    }
  }

  const themeColors = {
    default: {
      primary: 'from-pink-500 to-purple-500',
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-600',
    },
    romantic: {
      primary: 'from-rose-500 to-pink-500',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-600',
    },
    elegant: {
      primary: 'from-slate-500 to-gray-500',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-600',
    },
    vintage: {
      primary: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-600',
    },
    modern: {
      primary: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
    },
  }

  const currentTheme = themeColors[theme as keyof typeof themeColors] || themeColors.default

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden ${currentTheme.border} border-2`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentTheme.primary} p-6 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <IconX />
          </button>
          <h2 className="text-2xl font-bold">Compartilhar Timeline</h2>
          <p className="text-white/90 text-sm mt-1">{timeline.title}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'share'
                ? `${currentTheme.text} border-b-2 ${currentTheme.text.replace('text-', 'border-')}`
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <IconShare />
            Redes Sociais
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'email'
                ? `${currentTheme.text} border-b-2 ${currentTheme.text.replace('text-', 'border-')}`
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <IconMail />
            Email
          </button>
          <button
            onClick={() => setActiveTab('qrcode')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
              activeTab === 'qrcode'
                ? `${currentTheme.text} border-b-2 ${currentTheme.text.replace('text-', 'border-')}`
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            QR Code
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Share Tab */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={timelineUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      copied
                        ? 'bg-green-500 text-white'
                        : `bg-gradient-to-r ${currentTheme.primary} text-white hover:opacity-90`
                    }`}
                  >
                    {copied ? <IconCheck /> : <IconCopy />}
                  </button>
                </div>
                {copied && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <IconCheck /> Link copiado!
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center justify-center gap-2 p-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <span className="text-xl">💬</span>
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <span className="text-xl">📘</span>
                  Facebook
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center justify-center gap-2 p-4 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors"
                >
                  <span className="text-xl">🐦</span>
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center justify-center gap-2 p-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  <span className="text-xl">💼</span>
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare('telegram')}
                  className="flex items-center justify-center gap-2 p-4 bg-blue-400 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors col-span-2"
                >
                  <span className="text-xl">✈️</span>
                  Telegram
                </button>
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              {emailSent ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="font-bold text-green-800 mb-1">Email enviado!</h3>
                  <p className="text-green-600 text-sm">
                    O link da timeline foi enviado com sucesso.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email do destinatário
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSendEmail}
                    disabled={sending || !email}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                      sending || !email
                        ? 'bg-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`
                    }`}
                  >
                    {sending ? 'Enviando...' : 'Enviar por Email'}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    O destinatário receberá um email com o link da timeline
                  </p>
                </>
              )}
            </div>
          )}

          {/* QR Code Tab */}
          {activeTab === 'qrcode' && (
            <div className="space-y-4">
              <div className="text-center">
                <div
                  id="qr-code-container"
                  className={`inline-block p-6 ${currentTheme.bg} rounded-2xl border-2 ${currentTheme.border} shadow-lg`}
                >
                  <QRCodeSVG
                    value={timelineUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                    fgColor={currentTheme.text.replace('text-', '#')}
                    bgColor="transparent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">
                  Escaneie o QR code para acessar a timeline
                </p>
                <button
                  onClick={handleDownloadQR}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r ${currentTheme.primary} hover:opacity-90 flex items-center justify-center gap-2`}
                >
                  {qrDownloaded ? (
                    <>
                      <IconCheck />
                      Baixado!
                    </>
                  ) : (
                    <>
                      <IconDownload />
                      Baixar QR Code
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Perfeito para compartilhar em stories do Instagram!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

