-- College cafeteria schema (unowned shared rows — no user_id)

create table if not exists categories (
  id         serial primary key,
  slug       text not null unique,
  name       text not null,
  sort_order int not null default 0
);

create table if not exists dishes (
  id             serial primary key,
  category_id    int not null references categories(id),
  name           text not null,
  description    text not null default '',
  price          int not null,
  cost           int not null,
  weight_g       int not null default 0,
  calories       int not null default 0,
  protein        int not null default 0,
  fat            int not null default 0,
  carbs          int not null default 0,
  tags           text not null default '',
  image_key      text not null default '',
  is_available   boolean not null default true,
  on_board       boolean not null default false,
  featured       boolean not null default false,
  portion_limit  int,
  portions_sold  int not null default 0,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists weekday_plan (
  weekday  int not null check (weekday between 1 and 6),
  dish_id  int not null references dishes(id) on delete cascade,
  primary key (weekday, dish_id)
);

create table if not exists wishes (
  id         serial primary key,
  alias      text not null,
  body       text not null,
  votes      int not null default 0,
  status     text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id          serial primary key,
  pickup_code text not null unique,
  guest_label text not null,
  group_code  text not null,
  status      text not null default 'paid',
  total       int not null,
  discount    int not null default 0,
  pickup_slot text not null,
  note        text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists order_items (
  id         serial primary key,
  order_id   int not null references orders(id) on delete cascade,
  dish_id    int,
  dish_name  text not null,
  qty        int not null,
  unit_price int not null
);

create table if not exists sales_lines (
  id         serial primary key,
  sale_date  date not null,
  dish_id    int,
  dish_name  text not null,
  qty        int not null,
  unit_price int not null,
  unit_cost  int not null default 0,
  source     text not null default 'import'
);

create table if not exists announcements (
  id           serial primary key,
  title        text not null,
  body         text not null,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists site_settings (
  key   text primary key,
  value text not null
);

create index if not exists dishes_on_board_idx on dishes (on_board);
create index if not exists dishes_category_idx on dishes (category_id);
create index if not exists sales_lines_date_idx on sales_lines (sale_date);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_code_idx on orders (pickup_code);
