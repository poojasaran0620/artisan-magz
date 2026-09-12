-- Admin RLS policies for Artisan Magz order management
-- Allows poojasaran0620@gmail.com, vijayrathod8422@gmail.com, and artisanmagz@gmail.com
-- to SELECT and UPDATE all orders, and SELECT all profiles.

-- Admin can SELECT all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    auth.jwt() ->> 'email' IN (
      'poojasaran0620@gmail.com',
      'vijayrathod8422@gmail.com',
      'artisanmagz@gmail.com'
    )
  );

-- Admin can UPDATE all orders (status changes)
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN (
      'poojasaran0620@gmail.com',
      'vijayrathod8422@gmail.com',
      'artisanmagz@gmail.com'
    )
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'poojasaran0620@gmail.com',
      'vijayrathod8422@gmail.com',
      'artisanmagz@gmail.com'
    )
  );

-- Admin can also read all profiles (for customer info)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.jwt() ->> 'email' IN (
      'poojasaran0620@gmail.com',
      'vijayrathod8422@gmail.com',
      'artisanmagz@gmail.com'
    )
  );
