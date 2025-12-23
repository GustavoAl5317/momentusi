'use client'

import { useState, useEffect } from 'react'
import { Moment, PlanType } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { normalizeMusicUrl } from '@/lib/musicUrlHelper'

// Helper para parsear data sem problemas de timezone
// Converte string "YYYY-MM-DD" para Date no timezone local
const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month é 0-indexed no Date
}

interface MomentListProps {
  moments: Moment[]
  onUpdate: React.Dispatch<React.SetStateAction<Moment[]>>
  onDelete: React.Dispatch<React.SetStateAction<Moment[]>>
  plan: PlanType
}

export default function MomentList({
  moments,
  onUpdate,
  onDelete,
  plan,
}: MomentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este momento?')) {
      onDelete((prev) => prev.filter((m) => m.id !== id))
    }
  }

  const handleEdit = (moment: Moment) => {
    setEditingId(moment.id)
  }

  const handleSaveEdit = (updatedMoment: Moment) => {
    onUpdate((prev) =>
      prev
        .map((m) => (m.id === updatedMoment.id ? updatedMoment : m))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    )
    setEditingId(null)
  }

  if (moments.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-pink-50 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300">
        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📅</div>
        <p className="text-sm sm:text-base text-gray-600 font-medium">Nenhum momento adicionado ainda.</p>
        <p className="text-xs sm:text-sm mt-2 text-gray-500 px-4">
          Clique em "Adicionar Momento" para começar sua linha do tempo.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {moments.map((moment) => (
        <div
          key={moment.id}
          className="bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all hover:scale-[1.01] sm:hover:scale-[1.02]"
        >
          {editingId === moment.id ? (
            <MomentEditForm
              moment={moment}
              onSave={handleSaveEdit}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-2">
                <div className="flex-1">
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">
                    {format(parseLocalDate(moment.date), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                    {moment.title}
                  </h3>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => handleEdit(moment)}
                    className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                  >
                    ✏️ <span className="hidden sm:inline">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(moment.id)}
                    className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    🗑️ <span className="hidden sm:inline">Excluir</span>
                  </button>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 mb-3 break-words whitespace-pre-wrap">{moment.description}</p>
              {(() => {
                const images = moment.image_urls || (moment.image_url ? [moment.image_url] : [])
                if (images.length === 0) return null
                
                if (images.length === 1) {
                  return (
                    <img
                      src={images[0]}
                      alt={moment.title}
                      className="w-full max-w-md rounded-lg mb-3"
                    />
                  )
                }
                
                return (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {images.slice(0, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${moment.title} - Foto ${idx + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )
              })()}
              {moment.music_url && (
                <div className="text-xs sm:text-sm text-gray-600 break-all">
                  🎵 Música: <a href={moment.music_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">{moment.music_url}</a>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

function MomentEditForm({
  moment,
  onSave,
  onCancel,
}: {
  moment: Moment
  onSave: (moment: Moment) => void
  onCancel: () => void
}) {
  const [date, setDate] = useState(moment.date)
  const [title, setTitle] = useState(moment.title)
  const [description, setDescription] = useState(moment.description)
  const [musicUrl, setMusicUrl] = useState(moment.music_url || '')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Carregar imagens existentes como previews
  useEffect(() => {
    const existingImages = moment.image_urls || (moment.image_url ? [moment.image_url] : [])
    setImagePreviews(existingImages)
  }, [moment])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3) // Limitar a 3 imagens
      setImages(files)
      
      // Criar previews
      const previews = files.map(file => URL.createObjectURL(file))
      setImagePreviews(previews)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      const imageUrls: string[] = []

      // Upload das novas imagens se houver
      if (images.length > 0) {
        for (const image of images) {
          const formData = new FormData()
          formData.append('image', image)

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json()
            imageUrls.push(uploadData.url)
          }
        }
      } else {
        // Se não há novas imagens, manter as existentes
        imageUrls.push(...(moment.image_urls || (moment.image_url ? [moment.image_url] : [])))
      }

      // Normalizar URL de música
      const normalizedMusicUrl = musicUrl ? normalizeMusicUrl(musicUrl) : undefined

      onSave({
        ...moment,
        date,
        title,
        description,
        music_url: normalizedMusicUrl,
        image_url: imageUrls[0] || undefined, // Compatibilidade
        image_urls: imageUrls.length > 0 ? imageUrls : undefined,
      })
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar momento')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 bg-white text-gray-900 text-sm sm:text-base border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 bg-white text-gray-900 text-sm sm:text-base border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2 bg-white text-gray-900 text-sm sm:text-base border border-gray-300 rounded-lg resize-none"
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Música (Spotify ou YouTube)
        </label>
        <div className="space-y-2">
          <input
            type="text"
            value={musicUrl}
            onChange={(e) => setMusicUrl(e.target.value)}
            placeholder="Cole a URL ou apenas o ID (ex: dQw4w9WgXcQ)"
            className="w-full px-3 py-2 bg-white text-gray-900 text-sm sm:text-base border border-gray-300 rounded-lg"
          />
          <div className="flex gap-2">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>▶️</span>
              <span>Buscar no YouTube</span>
            </a>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>🎵</span>
              <span>Buscar no Spotify</span>
            </a>
          </div>
          <p className="text-xs text-gray-500">
            💡 Dica: Você pode colar apenas o ID do vídeo/música (ex: dQw4w9WgXcQ) ou a URL completa
          </p>
        </div>
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Imagens (opcional - até 3)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={images.length >= 3}
          className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {imagePreviews.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-xs sm:text-sm text-gray-600">
              {imagePreviews.length} {imagePreviews.length === 1 ? 'imagem' : 'imagens'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 sm:h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
        <button
          type="submit"
          disabled={isUploading}
          className="w-full sm:w-auto bg-pink-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {isUploading ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

