-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create patients table
create table patients (
  id uuid default uuid_generate_v4() primary key,
  passport_id text unique not null,
  full_name text not null,
  birth_date date not null,
  gender text check (gender in ('male', 'female', 'other')) not null,
  recorded_at timestamptz default now()
);

-- Create doctors table
-- Note: This table links to auth.users to manage roles
create table doctors (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  role text check (role in ('doctor', 'admin')) not null default 'doctor'
);

-- Create diagnoses table
create table diagnoses (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  diagnosis_name text not null,
  description text,
  created_at timestamptz default now(),
  doctor_id uuid references doctors(id) not null
);

-- Create immunizations table
create table immunizations (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  disease_name text not null,
  vaccinated boolean default true,
  date date not null
);

-- Enable Row Level Security
alter table patients enable row level security;
alter table doctors enable row level security;
alter table diagnoses enable row level security;
alter table immunizations enable row level security;

-- RLS Policies

-- Doctors: Can view their own profile
create policy "Doctors can view own profile"
  on doctors for select
  using (auth.uid() = id);

-- Patients: Doctors and Admins can view all patients (for search)
create policy "Doctors and Admins can view patients"
  on patients for select
  using (exists (select 1 from doctors where id = auth.uid()));

-- Diagnoses: Doctors and Admins can view diagnoses
create policy "Doctors and Admins can view diagnoses"
  on diagnoses for select
  using (exists (select 1 from doctors where id = auth.uid()));

-- Diagnoses: Doctors can insert diagnoses
create policy "Doctors can insert diagnoses"
  on diagnoses for insert
  with check (exists (select 1 from doctors where id = auth.uid()));

-- Immunizations: Doctors and Admins can view immunizations
create policy "Doctors and Admins can view immunizations"
  on immunizations for select
  using (exists (select 1 from doctors where id = auth.uid()));

-- Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table diagnoses;

-- Audit Log Function (Simple version)
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.doctors (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'doctor');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create doctor record on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
