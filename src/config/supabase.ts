import { createClient } from "@supabase/supabase-js";

// ✅ ใส่ค่า Supabase URL และ Anon Key ของคุณ
const SUPABASE_URL = Bun.env.SUPABASE_URL ?? (() => { throw new Error("SUPABASE_URL is not defined in environment variables"); })();
const SUPABASE_ANON_KEY = Bun.env.SUPABASE_ANON_KEY ?? (() => { throw new Error("SUPABASE_ANON_KEY is not defined in environment variables"); })(); // แก้ไขให้เป็น API Key ของคุณ

// ✅ สร้าง Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);