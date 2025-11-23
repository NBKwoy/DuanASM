/**
 * File cấu hình Supabase
 * Kết nối với database Supabase
 */

import { createClient } from '@supabase/supabase-js'

// Lấy URL và Key từ biến môi trường
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Kiểm tra nếu chưa có config thì dùng localStorage (fallback)
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase chưa được cấu hình. Đang dùng localStorage...')
    console.warn('💡 Tạo file .env với VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY')
}

// Tạo Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Kiểm tra xem có dùng Supabase không
export const useSupabase = () => {
    return supabase !== null
}

