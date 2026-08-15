create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  customer_id uuid references public.profiles(id) on delete cascade,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  product_id uuid references public.marketplace_products(id) on delete set null,
  assigned_staff_user uuid references public.profiles(id) on delete set null,
  category text not null,
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'new' check (status in ('new','open','waiting_on_customer','waiting_on_seller','waiting_on_support','escalated','resolved','closed')),
  subject text not null,
  description text not null,
  evidence_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_type text not null check (sender_type in ('customer','support_staff','seller','admin','internal_note')),
  sender_id uuid not null,
  sender_name text not null,
  content text not null,
  internal_only boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  conversation_type text not null default 'support' check (conversation_type in ('support','seller','order')),
  title text not null,
  order_id uuid references public.orders(id) on delete set null,
  product_id uuid references public.marketplace_products(id) on delete set null,
  seller_id uuid references public.seller_profiles(id) on delete set null,
  status text not null default 'active' check (status in ('active','archived','moderated')),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  participant_id uuid not null,
  participant_role text not null default 'customer' check (participant_role in ('customer','seller','support','admin')),
  joined_at timestamptz not null default now(),
  unique (conversation_id, participant_id)
);

create table if not exists public.message_reports (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  message_id uuid,
  reported_by uuid references public.profiles(id) on delete set null,
  reason text not null,
  review_status text not null default 'pending' check (review_status in ('pending','reviewing','cleared','restricted')),
  created_at timestamptz not null default now()
);

create table if not exists public.staff_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner','admin','support_manager','support_agent','seller_support','authenticity_reviewer','finance_support','moderation_staff')),
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, role)
);

create table if not exists public.staff_permissions (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  permission text not null,
  granted boolean not null default true,
  created_at timestamptz not null default now(),
  unique (role, permission)
);

create table if not exists public.ticket_assignments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  assigned_by uuid references public.profiles(id) on delete set null,
  assignment_type text not null default 'manual' check (assignment_type in ('manual','unassigned_queue','round_robin','skill_based')),
  skill text,
  created_at timestamptz not null default now()
);

create table if not exists public.ticket_escalations (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  reason text not null,
  destination text not null,
  escalated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.help_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  summary text not null,
  body text not null,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.support_tickets(id) on delete cascade,
  message_id uuid references public.support_messages(id) on delete cascade,
  storage_path text not null,
  mime_type text,
  visibility text not null default 'private' check (visibility in ('private','staff_only','customer_visible')),
  created_at timestamptz not null default now()
);

create table if not exists public.support_ratings (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  feedback text,
  created_at timestamptz not null default now()
);

create table if not exists public.support_audit_logs (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.support_tickets(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.support_sla_tracking (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  first_response_target_hours integer not null,
  resolution_target_hours integer,
  sla_status text not null default 'on_track' check (sla_status in ('on_track','approaching_deadline','overdue')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.message_reports enable row level security;
alter table public.staff_roles enable row level security;
alter table public.staff_permissions enable row level security;
alter table public.ticket_assignments enable row level security;
alter table public.ticket_escalations enable row level security;
alter table public.help_articles enable row level security;
alter table public.support_attachments enable row level security;
alter table public.support_ratings enable row level security;
alter table public.support_audit_logs enable row level security;
alter table public.support_sla_tracking enable row level security;

create policy if not exists "Customers can manage their own tickets" on public.support_tickets for all using (auth.uid() = customer_id) with check (auth.uid() = customer_id);
create policy if not exists "Customers can view their own messages" on public.support_messages for select using (auth.uid() = (select customer_id from public.support_tickets where id = ticket_id));
create policy if not exists "Sellers can access tickets for their store" on public.support_tickets for select using (seller_id is not null and seller_id = (select id from public.seller_profiles where profile_id = auth.uid()));
create policy if not exists "Public help article access" on public.help_articles for select using (published = true);
create policy if not exists "Support staff can read assigned support content" on public.support_tickets for select using (
  exists (
    select 1 from public.staff_roles sr
    where sr.profile_id = auth.uid() and sr.status = 'active'
      and sr.role in ('support_agent','support_manager','admin','owner','seller_support','finance_support','authenticity_reviewer','moderation_staff')
  )
);
create policy if not exists "Owner/admin manage staff roles" on public.staff_roles for all using (
  exists (
    select 1 from public.staff_roles sr
    where sr.profile_id = auth.uid() and sr.role in ('owner','admin') and sr.status = 'active'
  )
) with check (
  exists (
    select 1 from public.staff_roles sr
    where sr.profile_id = auth.uid() and sr.role in ('owner','admin') and sr.status = 'active'
  )
);
