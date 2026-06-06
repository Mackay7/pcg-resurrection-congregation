-- ==========================================================
-- PCG, Resurrection Congregation — Supabase RLS Policies
-- Run this in Supabase SQL Editor: supabase.com → SQL Editor
-- ==========================================================

-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE small_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE giving_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_members ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM members WHERE id = auth.uid()::text LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function: is current user staff or admin?
CREATE OR REPLACE FUNCTION is_staff_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM members
    WHERE id = auth.uid()::text
    AND role IN ('STAFF', 'ADMIN')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ==========================================================
-- MEMBERS table
-- ==========================================================
-- Members: read own row; staff/admin read all
CREATE POLICY "members_select_own_or_staff" ON members
  FOR SELECT USING (
    id = auth.uid()::text OR is_staff_or_admin()
  );

-- Staff/admin: insert members
CREATE POLICY "members_insert_staff" ON members
  FOR INSERT WITH CHECK (is_staff_or_admin());

-- Members: update own row only; staff/admin update all
CREATE POLICY "members_update_own_or_staff" ON members
  FOR UPDATE USING (
    id = auth.uid()::text OR is_staff_or_admin()
  );

-- Admin only: delete members
CREATE POLICY "members_delete_admin" ON members
  FOR DELETE USING (get_my_role() = 'ADMIN');

-- ==========================================================
-- DONATIONS table
-- ==========================================================
-- Members see own donations; staff/admin see all
CREATE POLICY "donations_select" ON donations
  FOR SELECT USING (
    member_id = auth.uid()::text OR is_staff_or_admin()
  );

-- Staff/admin only: record donations
CREATE POLICY "donations_insert_staff" ON donations
  FOR INSERT WITH CHECK (is_staff_or_admin());

CREATE POLICY "donations_update_staff" ON donations
  FOR UPDATE USING (is_staff_or_admin());

-- ==========================================================
-- ATTENDANCES table
-- ==========================================================
-- Members see own; staff/admin see all
CREATE POLICY "attendances_select" ON attendances
  FOR SELECT USING (
    member_id = auth.uid()::text OR is_staff_or_admin()
  );

-- Staff/admin: record attendance
CREATE POLICY "attendances_insert_staff" ON attendances
  FOR INSERT WITH CHECK (is_staff_or_admin());

-- ==========================================================
-- MESSAGES & RECIPIENTS — staff/admin only
-- ==========================================================
CREATE POLICY "messages_staff_only" ON messages
  FOR ALL USING (is_staff_or_admin());

-- Members see messages addressed to them
CREATE POLICY "message_recipients_select" ON message_recipients
  FOR SELECT USING (
    member_id = auth.uid()::text OR is_staff_or_admin()
  );

-- ==========================================================
-- EVENTS & INSTANCES — all authenticated users can read
-- ==========================================================
CREATE POLICY "events_read_all" ON events
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "events_write_staff" ON events
  FOR ALL USING (is_staff_or_admin());

CREATE POLICY "event_instances_read_all" ON event_instances
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "event_instances_write_staff" ON event_instances
  FOR ALL USING (is_staff_or_admin());

-- ==========================================================
-- GIVING FUNDS — public read, staff write
-- ==========================================================
CREATE POLICY "giving_funds_read_all" ON giving_funds
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "giving_funds_write_staff" ON giving_funds
  FOR ALL USING (is_staff_or_admin());

-- ==========================================================
-- GROUPS — all authenticated users can read
-- ==========================================================
CREATE POLICY "groups_read_all" ON small_groups
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "groups_write_staff" ON small_groups
  FOR ALL USING (is_staff_or_admin());

CREATE POLICY "group_members_read_all" ON group_members
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "group_members_write_staff" ON group_members
  FOR ALL USING (is_staff_or_admin());

-- ==========================================================
-- HOUSEHOLDS — members see own, staff see all
-- ==========================================================
CREATE POLICY "households_select" ON households
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE household_id = households.id
      AND id = auth.uid()::text
    ) OR is_staff_or_admin()
  );

CREATE POLICY "households_write_staff" ON households
  FOR ALL USING (is_staff_or_admin());

-- ==========================================================
-- COMMUNICATION LISTS — staff/admin only
-- ==========================================================
CREATE POLICY "comm_lists_staff" ON communication_lists
  FOR ALL USING (is_staff_or_admin());

CREATE POLICY "list_members_staff" ON list_members
  FOR ALL USING (is_staff_or_admin());

-- ==========================================================
-- VERIFY: test policies in Supabase SQL Editor
-- ==========================================================
-- SELECT * FROM members;  -- run as member role: should return only own row
-- SELECT * FROM donations; -- run as member role: should return only own donations
