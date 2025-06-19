-- Supabase Database Schema for Construction Daily Log Application

-- Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text,
  client text,
  start_date date,
  end_date date,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Subcontractors Table
create table public.subcontractors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Crews Table
create table public.crews (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Crew Members Table
create table public.crew_members (
  id uuid default gen_random_uuid() primary key,
  crew_id uuid references public.crews(id) on delete cascade not null,
  name text not null,
  role text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Daily Logs Table
create table public.daily_logs (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  project_id uuid references public.projects(id) not null,
  superintendent_name text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Log Sections Table
create table public.log_sections (
  id uuid default gen_random_uuid() primary key,
  log_id uuid references public.daily_logs(id) on delete cascade not null,
  section_type text not null, -- 'work_performed', 'delays', 'trades_onsite', 'meetings', 'out_of_scope', 'action_items', 'next_day_plan', 'notes'
  content text not null,
  order_num integer not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Log Subcontractors Junction Table
create table public.log_subcontractors (
  id uuid default gen_random_uuid() primary key,
  log_id uuid references public.daily_logs(id) on delete cascade not null,
  subcontractor_id uuid references public.subcontractors(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  unique(log_id, subcontractor_id)
);

-- Log Crews Junction Table
create table public.log_crews (
  id uuid default gen_random_uuid() primary key,
  log_id uuid references public.daily_logs(id) on delete cascade not null,
  crew_id uuid references public.crews(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  unique(log_id, crew_id)
);

-- Row Level Security Policies
-- Enable Row Level Security
alter table public.projects enable row level security;
alter table public.subcontractors enable row level security;
alter table public.crews enable row level security;
alter table public.crew_members enable row level security;
alter table public.daily_logs enable row level security;
alter table public.log_sections enable row level security;
alter table public.log_subcontractors enable row level security;
alter table public.log_crews enable row level security;

-- Create policies (simplified for now)
create policy "Public read access" on public.projects for select using (true);
create policy "Public read access" on public.subcontractors for select using (true);
create policy "Public read access" on public.crews for select using (true);
create policy "Public read access" on public.crew_members for select using (true);
create policy "Public read access" on public.daily_logs for select using (true);
create policy "Public read access" on public.log_sections for select using (true);
create policy "Public read access" on public.log_subcontractors for select using (true);
create policy "Public read access" on public.log_crews for select using (true);

-- Note: In a production environment, you would want to restrict access based on authenticated users
-- and potentially organizational boundaries rather than making everything publicly readable.
