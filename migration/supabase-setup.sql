create table if not exists public.littlenest_products (
  id bigint generated always as identity primary key,
  code text not null unique,
  name text not null,
  category text not null check (category in ('Baju','Mainan','Bahan Pelajaran','Makanan','Keperluan')),
  price numeric(10,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  active boolean not null default true,
  position integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists littlenest_products_public_idx on public.littlenest_products (active, category, position);
alter table public.littlenest_products enable row level security;

drop policy if exists "LittleNest public read" on public.littlenest_products;
create policy "LittleNest public read" on public.littlenest_products for select to anon, authenticated using (active = true or (select auth.uid()) is not null);
drop policy if exists "LittleNest manager insert" on public.littlenest_products;
create policy "LittleNest manager insert" on public.littlenest_products for insert to authenticated with check ((select auth.uid()) is not null);
drop policy if exists "LittleNest manager update" on public.littlenest_products;
create policy "LittleNest manager update" on public.littlenest_products for update to authenticated using ((select auth.uid()) is not null) with check ((select auth.uid()) is not null);
drop policy if exists "LittleNest manager delete" on public.littlenest_products;
create policy "LittleNest manager delete" on public.littlenest_products for delete to authenticated using ((select auth.uid()) is not null);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('littlenest-images','littlenest-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "LittleNest image public read" on storage.objects;
create policy "LittleNest image public read" on storage.objects for select to public using (bucket_id='littlenest-images');
drop policy if exists "LittleNest image manager upload" on storage.objects;
create policy "LittleNest image manager upload" on storage.objects for insert to authenticated with check (bucket_id='littlenest-images' and (select auth.uid()) is not null);
drop policy if exists "LittleNest image manager update" on storage.objects;
create policy "LittleNest image manager update" on storage.objects for update to authenticated using (bucket_id='littlenest-images' and (select auth.uid()) is not null);
drop policy if exists "LittleNest image manager delete" on storage.objects;
create policy "LittleNest image manager delete" on storage.objects for delete to authenticated using (bucket_id='littlenest-images' and (select auth.uid()) is not null);
