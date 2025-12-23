'use client'

import { useState } from 'react'
import { Moment } from '@/types'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { normalizeMusicUrl } from '@/lib/musicUrlHelper'

interface MomentFormProps {
  onAdd: React.Dispatch<React.SetStateAction<Moment[]>>
}

export default function MomentForm({ onAdd }: MomentFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [musicUrl, setMusicUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)

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

    if (!title.trim() || !description.trim()) {
      alert('Preencha título e descrição do momento.')
      return
    }

    setIsUploading(true)

    try {
      const imageUrls: string[] = []

      // Upload das imagens se houver
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
      }

      const newMoment: Moment = {
        id: crypto.randomUUID(),
        timeline_id: '',
        date,
        title,
        description,
        image_url: imageUrls[0] || undefined, // Mantido para compatibilidade
        image_urls: imageUrls.length > 0 ? imageUrls : undefined,
        music_url: musicUrl ? normalizeMusicUrl(musicUrl) : undefined,
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      onAdd((prev) => [...prev, newMoment].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ))

      // Reset form
      setDate(format(new Date(), 'yyyy-MM-dd'))
      setTitle('')
      setDescription('')
      setImages([])
      setImagePreviews([])
      // Limpar URLs de preview
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview))
      setMusicUrl('')
      setIsOpen(false)
    } catch (error) {
      console.error('Erro ao adicionar momento:', error)
      alert('Erro ao adicionar momento.')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 flex items-center justify-center gap-2"
      >
        <span className="text-lg sm:text-xl">+</span>
        <span>Adicionar Momento</span>
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-pink-200 shadow-lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Data *
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 bg-white text-gray-900 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Nosso primeiro encontro"
            required
            className="w-full px-3 py-2 bg-white text-gray-900 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Por que esse momento é especial?"
          required
          rows={3}
          className="w-full px-3 py-2 bg-white text-gray-900 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 resize-none"
        />
      </div>

      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Imagens (opcional - até 3)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={images.length >= 3}
          className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {images.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-xs sm:text-sm text-gray-600">
              {images.length} de 3 imagens selecionadas
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
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {(images[index].size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Música (Spotify ou YouTube)
        </label>
        <div className="space-y-2">
          <input
            type="text"
            value={musicUrl}
            onChange={(e) => setMusicUrl(e.target.value)}
            placeholder="Cole a URL ou apenas o ID (ex: dQw4w9WgXcQ)"
            className="w-full px-3 py-2 bg-white text-gray-900 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
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

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          type="submit"
          disabled={isUploading}
          className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isUploading ? 'Adicionando...' : '✨ Adicionar'}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-full hover:bg-gray-100 transition-all text-sm sm:text-base font-semibold"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

