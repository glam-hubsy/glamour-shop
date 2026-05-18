-- Add city column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;

-- Create otp_codes table (run only if not exists)
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
