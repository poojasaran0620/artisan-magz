-- Add payment fields to orders table for Razorpay integration
-- payment_id: stores Razorpay payment ID (e.g. pay_XXXXX) or simulation ID
-- payment_method: 'razorpay' | 'cod' | 'whatsapp' etc.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_id text,
  ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'cod';
