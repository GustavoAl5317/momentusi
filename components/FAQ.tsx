'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {items.map((faq, index) => (
        <div
          key={index}
          className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-500/30 hover:border-pink-500/50 transition-all overflow-hidden"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-700/50 transition-colors"
          >
            <h3 className="text-xl font-bold text-white flex items-center gap-3 flex-1">
              <span className="text-pink-400 text-2xl">❓</span>
              <span>{faq.question}</span>
            </h3>
            <div className={`flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
              <svg
                className="w-6 h-6 text-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-6 pt-0">
              <p className="text-gray-300 leading-relaxed pl-8">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

