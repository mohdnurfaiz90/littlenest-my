-- Enam produk milik sendiri untuk ujian penuh LittleNest MY.
-- Stok awal ditetapkan kepada 1 unit setiap produk.
insert into public.littlenest_products
  (code, name, category, price, stock, image_url, active, position, source_type, external_url, metadata_status)
values
  ('LN-BJ-010', 'Sleepsuit Bayi Bunga Little Sister', 'Baju', 8, 1, 'assets/products/own-baju-010-little-sister.png', true, 10, 'own', null, 'manual'),
  ('LN-BJ-011', 'Sleepsuit Bayi Motif Buah Pear', 'Baju', 8, 1, 'assets/products/own-baju-011-pear.png', true, 11, 'own', null, 'manual'),
  ('LN-BJ-012', 'Romper Bayi Motif Arnab', 'Baju', 4, 1, 'assets/products/own-baju-012-arnab.png', true, 12, 'own', null, 'manual'),
  ('LN-BJ-013', 'Romper Bayi Motif Safari', 'Baju', 5, 1, 'assets/products/own-baju-013-safari.png', true, 13, 'own', null, 'manual'),
  ('LN-BJ-014', 'Sleepsuit Zip Bayi Motif Awan', 'Baju', 6, 1, 'assets/products/own-baju-014-awan.png', true, 14, 'own', null, 'manual'),
  ('LN-BJ-015', 'Sleepsuit Zip Bayi Motif Kenderaan Binaan', 'Baju', 6, 1, 'assets/products/own-baju-015-kenderaan.png', true, 15, 'own', null, 'manual')
on conflict (code) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  stock = excluded.stock,
  image_url = excluded.image_url,
  active = excluded.active,
  position = excluded.position,
  source_type = excluded.source_type,
  external_url = excluded.external_url,
  metadata_status = excluded.metadata_status,
  updated_at = now();
