import { supabase } from '../../lib/supabaseClient'

export const usersCrud = {
  list: () => supabase.from('users').select('*'),
  getById: (id: string) => supabase.from('users').select('*').eq('id', id).single(),
  create: (payload: Record<string, unknown>) => supabase.from('users').insert(payload).select('*').single(),
  update: (id: string, payload: Record<string, unknown>) =>
    supabase.from('users').update(payload).eq('id', id).select('*').single(),
  remove: (id: string) => supabase.from('users').delete().eq('id', id),
}

export const familyMembersCrud = {
  listByUser: (userId: string) => supabase.from('family_members').select('*').eq('user_id', userId),
  create: (payload: Record<string, unknown>) => supabase.from('family_members').insert(payload).select('*').single(),
  update: (id: string, payload: Record<string, unknown>) =>
    supabase.from('family_members').update(payload).eq('id', id).select('*').single(),
  remove: (id: string) => supabase.from('family_members').delete().eq('id', id),
}

export const categoriesCrud = {
  listByUser: (userId: string) => supabase.from('categories').select('*').eq('user_id', userId),
  create: (payload: Record<string, unknown>) => supabase.from('categories').insert(payload).select('*').single(),
  update: (id: string, payload: Record<string, unknown>) =>
    supabase.from('categories').update(payload).eq('id', id).select('*').single(),
  remove: (id: string) => supabase.from('categories').delete().eq('id', id),
}

export const accountsCrud = {
  listByUser: (userId: string) => supabase.from('accounts').select('*').eq('user_id', userId),
  create: (payload: Record<string, unknown>) => supabase.from('accounts').insert(payload).select('*').single(),
  update: (id: string, payload: Record<string, unknown>) =>
    supabase.from('accounts').update(payload).eq('id', id).select('*').single(),
  remove: (id: string) => supabase.from('accounts').delete().eq('id', id),
}

export const transactionsCrud = {
  listByUser: (userId: string) => supabase.from('transactions').select('*').eq('user_id', userId),
  create: (payload: Record<string, unknown>) => supabase.from('transactions').insert(payload).select('*').single(),
  update: (id: string, payload: Record<string, unknown>) =>
    supabase.from('transactions').update(payload).eq('id', id).select('*').single(),
  remove: (id: string) => supabase.from('transactions').delete().eq('id', id),
}

export const recurringCrud = {
  listByUser: (userId: string) =>
    supabase.from('recurring_transactions').select('*').eq('user_id', userId),
  create: (payload: Record<string, unknown>) =>
    supabase.from('recurring_transactions').insert(payload).select('*').single(),
  update: (id: string, payload: Record<string, unknown>) =>
    supabase.from('recurring_transactions').update(payload).eq('id', id).select('*').single(),
  remove: (id: string) => supabase.from('recurring_transactions').delete().eq('id', id),
}
