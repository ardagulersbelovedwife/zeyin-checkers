-- Games History Table
CREATE TABLE IF NOT EXISTS games_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('2', '4', '6')),
    result TEXT NOT NULL CHECK (result IN ('win', 'loss')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- RLS Policies
ALTER TABLE games_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own game history"
ON games_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game history"
ON games_history FOR INSERT
WITH CHECK (auth.uid() = user_id);
