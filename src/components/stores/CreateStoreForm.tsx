'use client'

import { useState, FormEvent } from 'react'
import { createStore } from '@/app/super-admin/lojas/actions'

interface CreateStoreFormProps {
  onClose: () => void
  onSuccess: () => void
}

export function CreateStoreForm({ onClose, onSuccess }: CreateStoreFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData()
    formData.append('name', name)
    if (description.trim()) {
      formData.append('description', description)
    }

    const result = await createStore(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    if (result.success) {
      onSuccess()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-roboto" style={{ color: '#333745' }}>
            Nova Loja
          </h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold font-roboto"
            style={{ color: '#333745', opacity: 0.7 }}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg font-roboto" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 font-roboto" style={{ color: '#333745' }}>
              Nome da Loja *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all font-roboto"
              style={{
                backgroundColor: '#E8D7F1',
                borderColor: '#E8D7F1',
                color: '#333745',
              }}
              placeholder="Digite o nome da loja"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 font-roboto" style={{ color: '#333745' }}>
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all font-roboto resize-none"
              style={{
                backgroundColor: '#E8D7F1',
                borderColor: '#E8D7F1',
                color: '#333745',
              }}
              placeholder="Digite uma descrição (opcional)"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg font-semibold font-roboto transition-colors"
              style={{ backgroundColor: '#E8D7F1', color: '#333745' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg font-semibold font-roboto transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#D3BCCC', color: '#333745' }}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}