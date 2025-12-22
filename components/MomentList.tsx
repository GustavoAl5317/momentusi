'use client'

import { useState } from 'react'
import { Moment, PlanType } from '@/types'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

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
                    {format(new Date(moment.date), "dd 'de' MMMM 'de' yyyy", {
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
              {moment.image_url && (
                <img
                  src={moment.image_url}
                  alt={moment.title}
                  className="w-full max-w-md rounded-lg mb-3"
                />
              )}
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...moment,
      date,
      title,
      description,
      music_url: musicUrl || undefined,
    })
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
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg"
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
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg"
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
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg resize-none"
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Link de Música
        </label>
        <input
          type="url"
          value={musicUrl}
          onChange={(e) => setMusicUrl(e.target.value)}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
        <button
          type="submit"
          className="w-full sm:w-auto bg-pink-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base hover:bg-pink-700 transition-colors"
        >
          Salvar
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

