'use client'

interface ThemeOptionProps {
  value: string
  name: string
  icon: string
  colors: string[]
  selected: boolean
  onClick: () => void
}

export default function ThemeOption({
  value,
  name,
  icon,
  colors,
  selected,
  onClick,
}: ThemeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
        selected
          ? 'border-pink-500 shadow-2xl scale-105 bg-gradient-to-br from-pink-50 to-purple-50 ring-4 ring-pink-200'
          : 'border-gray-200 hover:border-gray-300 bg-white hover:scale-105 hover:shadow-lg'
      }`}
    >
      {/* Efeito de brilho animado quando selecionado */}
      {selected && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm shadow-lg animate-pulse">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </>
      )}

      {/* Ícone com efeito 3D e animação */}
      <div className={`relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${colors[0]} ${colors[1]} flex items-center justify-center text-2xl sm:text-3xl shadow-xl transform transition-all duration-300 ${
        selected ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:rotate-3'
      }`}>
        {/* Efeito de brilho no ícone */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
        <div className="relative z-10 transform transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        {/* Partículas flutuantes quando selecionado */}
        {selected && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping animation-delay-2000"></div>
          </>
        )}
      </div>

      {/* Nome do tema com gradiente animado */}
      <div className={`font-bold text-sm sm:text-base transition-all duration-300 ${
        selected 
          ? 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient' 
          : 'text-gray-900 group-hover:text-gray-700'
      }`}>
        {name}
      </div>

      {/* Efeito de borda animada quando hover */}
      {!selected && (
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-pink-200 transition-all duration-300"></div>
      )}
    </button>
  )
}

