-- Add Torch Hike enrollment for admin user as completed
INSERT INTO hike_enrollments (hike_id, user_id, status) 
VALUES ('c57d76d5-09ce-4fc9-8050-53ac6a193e26', '08aaf6c6-17f8-49f5-9182-34e80378e987', 'enrolled')
ON CONFLICT DO NOTHING;