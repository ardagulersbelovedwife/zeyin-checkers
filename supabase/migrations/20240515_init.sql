-- Drop existing tables to ensure a clean slate for the new schema
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    city TEXT,
    rating INTEGER DEFAULT 1200,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Games Table
CREATE TABLE IF NOT EXISTS games (
    game_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player1_id UUID,
    player2_id UUID,
    status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed', 'abandoned')),
    board_state JSONB NOT NULL DEFAULT '[]'::JSONB,
    turn INTEGER NOT NULL DEFAULT 1,
    must_jump_pos JSONB,
    winner_id UUID REFERENCES profiles(id),
    move_history JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Realtime needs replication for channels
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'games'
  ) THEN 
    ALTER PUBLICATION supabase_realtime ADD TABLE games; 
  END IF; 
END $$;

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profiles (for leaderboards)
CREATE POLICY "Public profiles are viewable by everyone."
ON profiles FOR SELECT USING (true);

-- Users can insert/update their own profiles
CREATE POLICY "Users can insert their own profile."
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile."
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Games are readable by everyone
CREATE POLICY "Games are viewable by everyone."
ON games FOR SELECT USING (true);

-- Anyone can create games
CREATE POLICY "Anyone can create games."
ON games FOR INSERT WITH CHECK (true);

-- Anyone can update games
CREATE POLICY "Anyone can update games."
ON games FOR UPDATE USING (true);
