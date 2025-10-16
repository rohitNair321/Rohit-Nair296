Upload instructions

1) Create a Supabase project at https://app.supabase.com and enable Storage.
2) Create a public bucket named `public` (or choose another name and update the script accordingly).
3) Get your SUPABASE_URL and a Service Role Key (Settings → API → Service Role Key). Keep the service role key secret.
4) From this repo root run (PowerShell):

$env:SUPABASE_URL = 'https://your-project.supabase.co'; $env:SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key'; node .\supabase-functions\upload-resume.js

5) The script uploads `portfolio-site/src/assets/Rohit.Nair.pdf` to `public/resumes/Rohit.Nair.pdf` and prints the public URL.
6) Update the `resume_url` field in the `profiles` row in Supabase SQL editor to the public URL (or run the SQL migration after editing the path).

Notes
- The Node upload script uses the service role key and should only run locally or in a secure CI environment.
- If you prefer a manual upload, use the Supabase Console Storage UI and then update the database accordingly.