// scripts/sync-members.js
import { createClient } from '@supabase/supabase-js';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sheetId = process.env.SHEET_ID;
const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_JSON 
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) 
  : null;

if (!supabaseUrl || !supabaseKey || !sheetId || !serviceAccount) {
  console.error('Missing environment variables. Check GitHub Secrets.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncMembers() {
  console.log('Authenticating with Google...');

  try {
    const serviceAccountAuth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    console.log(`Found ${rows.length} rows in Google Sheet.`);

    const cleanNumbers = rows
      .map(row => {
        const raw = row._rawData[0] || ''; 
        return raw.replace(/[^0-9+]/g, '').trim();
      })
      .filter(n => n.length > 7);

    console.log(`Extracted ${cleanNumbers.length} valid numbers.`);

    if (cleanNumbers.length === 0) {
      console.log('No numbers found to sync.');
      return;
    }

    const { data, error } = await supabase.rpc('bulk_assign_members', {
      phone_numbers: cleanNumbers
    });

    if (error) throw error;

    const assigned = data.filter(r => r.status.includes('Assigned')).length;
    const skipped = data.filter(r => r.status.includes('Is Admin')).length;
    
    console.log('Sync Complete!');
    console.log(`   - New Members: ${assigned}`);
    console.log(`   - Admins Skipped: ${skipped}`);

  } catch (err) {
    console.error('Sync Failed:', err);
    process.exit(1);
  }
}

syncMembers();