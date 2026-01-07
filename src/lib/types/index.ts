/**
 * Tipos e interfaces do projeto
 * 
 * Este arquivo exporta todos os tipos utilizados no projeto,
 * incluindo tipos do banco de dados e tipos auxiliares.
 */

import type { Database } from './database.types'

// Tipos do banco de dados
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// Tipos específicos das tabelas
export type Store = Tables<'stores'>
export type User = Tables<'users'>
export type Product = Tables<'products'>
export type Category = Tables<'categories'>
export type Customer = Tables<'customers'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>

// Tipos para inserção
export type StoreInsert = Database['public']['Tables']['stores']['Insert']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

// Tipos para atualização
export type StoreUpdate = Database['public']['Tables']['stores']['Update']
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update']

// Tipos auxiliares
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Tipos para respostas da API
export type ApiResponse<T> = {
  data: T | null
  error: string | null
}

// Tipos para paginação
export type PaginationParams = {
  page?: number
  limit?: number
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Tipos para filtros
export type ProductFilters = {
  store_id?: string
  category_id?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  search?: string
}

export type StoreFilters = {
  owner_id?: string
  search?: string
}

export type OrderFilters = {
  store_id?: string
  customer_id?: string
  status?: string
  start_date?: string
  end_date?: string
}

export type CustomerFilters = {
  store_id?: string
  search?: string
  email?: string
}

// Re-export do Database type completo
export type { Database }
