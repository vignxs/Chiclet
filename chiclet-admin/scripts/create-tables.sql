-- Create tables for the admin dashboard
create table public.cart_items (
  id serial not null,
  user_id uuid not null,
  product_id integer null,
  name text null,
  quantity integer not null default 1,
  price numeric(10, 2) not null,
  image text null,
  constraint cart_items_pkey primary key (id),
  constraint cart_items_product_id_fkey foreign KEY (product_id) references products (id)
) TABLESPACE pg_default;

create table public.notifications (
  id serial not null,
  user_id uuid not null,
  title text not null,
  message text null,
  is_read boolean null default false,
  created_at timestamp without time zone null default now(),
  constraint notifications_pkey primary key (id)
) TABLESPACE pg_default;

create table public.order_items (
  id serial not null,
  order_id character varying(20) null,
  product_id integer null,
  name character varying(255) not null,
  price numeric(10, 2) not null,
  quantity integer not null,
  image text null,
  constraint order_items_pkey primary key (id),
  constraint order_items_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE,
  constraint order_items_product_id_fkey foreign KEY (product_id) references products (id)
) TABLESPACE pg_default;

create table public.order_timeline (
  id serial not null,
  order_id character varying(20) null,
  status character varying(20) not null,
  timestamp timestamp without time zone not null default now(),
  constraint order_timeline_pkey primary key (id),
  constraint order_timeline_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE,
  constraint order_timeline_status_check check (
    (
      (status)::text = any (
        (
          array[
            "'placed'"::character varying,
            "'processed'"::character varying,
            "'shipped'"::character varying,
            "'delivered'"::character varying,
            "'cancelled'"::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create table public.orders (
  id character varying(20) not null,
  user_id uuid not null,
  address_id integer null,
  total numeric(10, 2) not null,
  status character varying(20) not null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  tracking_number character varying(255) null,
  payment_status character varying(20) null,
  razorpay_payment_id character varying(100) null,
  constraint orders_pkey primary key (id),
  constraint orders_address_id_fkey foreign KEY (address_id) references user_addresses (id) on delete set null
) TABLESPACE pg_default;

create table public.payments (
  id serial not null,
  razorpay_payment_id character varying(100) not null,
  amount numeric(10, 2) not null,
  currency character varying(10) not null default "'INR'"::character varying,
  payment_status character varying(20) not null,
  paid_at timestamp without time zone null,
  constraint payments_pkey primary key (id),
  constraint payments_razorpay_payment_id_key unique (razorpay_payment_id)
) TABLESPACE pg_default;

create table public.products (
  id serial not null,
  name text not null,
  price numeric(10, 2) not null,
  tag text null,
  category text null,
  description text null,
  rating numeric(2, 1) null,
  image text null,
  constraint products_pkey primary key (id)
) TABLESPACE pg_default;

create table public.user_addresses (
  id serial not null,
  user_id uuid not null,
  name character varying(255) not null,
  street character varying(255) not null,
  city character varying(255) not null,
  state character varying(100) not null,
  zip character varying(20) not null,
  country character varying(100) not null,
  created_at timestamp without time zone null default now(),
  constraint user_addresses_pkey primary key (id)
) TABLESPACE pg_default;
