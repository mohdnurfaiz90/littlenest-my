-- Tiga produk ujian yang dibekalkan oleh pemilik LittleNest MY.
-- Harga dibiarkan NULL kerana pautan TikTok ini tidak mendedahkan harga semasa.
insert into public.littlenest_products
  (code, name, category, price, stock, image_url, active, position, source_type, external_url, metadata_status, last_checked_at)
values
  ('LN-KP-007', 'Penbose 50PCS Baby Pull-ups Pants & Disposable Diaper Tape', 'Keperluan', null, null,
   'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/5365a32d9eb94ee6bd544f9ef5d816f3~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543',
   true, 7, 'tiktok', 'https://vt.tiktok.com/ZS9khRacqHgcy-Te6oi/', 'fetched', now()),
  ('LN-KP-008', 'Selimut Kanak Cartoon Soft Comforter Aircond Quilt 110x150cm', 'Keperluan', null, null,
   'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/3d86af44804a4602be4fd8326bedba22~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543',
   true, 8, 'tiktok', 'https://vt.tiktok.com/ZS9khRQEY5Vk1-FBx9g/', 'fetched', now()),
  ('LN-BJ-009', 'JC BABY Bayi Perempuan Romper Baru Lahir', 'Baju', null, null,
   'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/6cc451b5f7e74ae9abe4c1d93653f796~tplv-aphluv4xwc-resize-webp:260:260.webp?dr=15582&t=555f072d&ps=933b5bde&shp=7745054a&shcp=9b759fb9&idc=my&from=2001012042',
   true, 9, 'tiktok', 'https://vt.tiktok.com/ZS9khR4LeRvB9-KVDHT/', 'fetched', now())
on conflict (code) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  stock = excluded.stock,
  image_url = excluded.image_url,
  active = excluded.active,
  source_type = excluded.source_type,
  external_url = excluded.external_url,
  metadata_status = excluded.metadata_status,
  last_checked_at = excluded.last_checked_at,
  updated_at = now();
