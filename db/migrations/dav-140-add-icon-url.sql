-- DAV-140: curated site icon for catalog cards (nullable for existing rows)
ALTER TABLE resources ADD COLUMN icon_url TEXT;
