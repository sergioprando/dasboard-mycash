# Supabase Integration (mycash+)

## Status

- Project connected: `Workshop Figma ao MCP`
- Migration applied: `mycash_v2_core_schema_rls_storage`
- Auth integrated in app (email/password)
- Finance context connected to Supabase tables (no mock seed)
- Storage helpers created for `avatars`, `receipts`, `media`, `attachments`

## Required Environment Variables

Copy `.env.example` to `.env` and fill:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Implemented Tables and Policies

- `users`
- `family_members`
- `categories`
- `accounts`
- `transactions`
- `recurring_transactions`
- `goals`

RLS is enabled in all business tables with broad authenticated access (`USING true`, `WITH CHECK true`) as requested.

## Implemented SQL Functions

- `public.set_updated_at()`
- `public.handle_new_auth_user()`
- `public.generate_recurring_transactions(p_user_id, p_date)`
- `public.export_user_data(p_user_id)`

## Implemented Edge Functions

- `generate-recurring` (POST): executes recurring generation for authenticated user
- `export-finance-data` (GET): exports full user data payload

## Frontend Integration Notes

- New auth provider/context + `LoginPage`
- Route guard (`RequireAuth`) for private pages
- Mobile logout wired to Supabase sign-out
- `FinanceContext` now loads and persists data using Supabase

## Next Recommended Step

Use seeded categories/accounts for new users and add optional stricter per-user RLS (`auth.uid() = user_id`) when collaboration mode is not required.
