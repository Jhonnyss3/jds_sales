'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreateStoreForm } from './CreateStoreForm'

interface Loja {
  id: string
  name: string
  created_at: string
  updated_at: string
}

interface LojasListProps {
  lojas: Loja[]
}

export function LojasList({ lojas: initialLojas }: LojasListProps) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-roboto mb-2" style={{ color: '#333745' }}>
            Lojas
          </h1>
          <p className="font-roboto" style={{ color: '#333745', opacity: 0.7 }}>
            Gerencie todas as lojas do sistema
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-lg font-semibold font-roboto transition-colors"
          style={{ backgroundColor: '#D3BCCC', color: '#333745' }}
        >
          Nova Loja
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border" style={{ borderColor: '#E8D7F1' }}>
        {initialLojas && initialLojas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
                <tr className="border-b" style={{ borderColor: '#E8D7F1' }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-roboto" style={{ color: '#333745' }}>
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-roboto" style={{ color: '#333745' }}>
                    Criada em
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold font-roboto" style={{ color: '#333745' }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
              {initialLojas.map((loja) => (
                  <tr key={loja.id} className="border-b" style={{ borderColor: '#E8D7F1' }}>
                    <td className="px-6 py-4">
                      <div className="font-medium font-roboto" style={{ color: '#333745' }}>
                        {loja.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-roboto" style={{ color: '#333745', opacity: 0.7 }}>
                        {new Date(loja.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium font-roboto transition-colors"
                          style={{ backgroundColor: '#E8D7F1', color: '#333745' }}
                        >
                          Editar
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium font-roboto transition-colors"
                          style={{ backgroundColor: '#ef4444', color: '#FFFFFF' }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="font-roboto" style={{ color: '#333745', opacity: 0.7 }}>
              Nenhuma loja cadastrada
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <CreateStoreForm
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}