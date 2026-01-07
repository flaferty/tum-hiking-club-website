const { createClient } = require('@supabase/supabase-js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

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
    // 1. Authenticate with Google Service Account
    const serviceAccountAuth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();

    // 2. Read the first sheet
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    console.log(`Found ${rows.length} rows in the Google Sheet.`);

    // 3. Extract & Clean Phone Numbers
    const cleanNumbers = rows
      .map(row => {
        const raw = row._rawData[0] || ''; 
        // Remove everything except digits and + sign
        return raw.replace(/[^0-9+]/g, '').trim();
      })
      .filter(n => n.length > 7); // Filter out empty or too short numbers

    console.log(`Extracted ${cleanNumbers.length} valid phone numbers.`);

    if (cleanNumbers.length === 0) {
      console.log('No numbers found to sync.');
      return;
    }

    // 4. Send to Supabase Database Function
    const { data, error } = await supabase.rpc('bulk_assign_members', {
      phone_numbers: cleanNumbers
    });

    if (error) throw error;

    // 5. Log Results
    const assigned = data.filter(r => r.status.includes('Assigned')).length;
    const skipped = data.filter(r => r.status.includes('Is Admin')).length;
    
    console.log('Sync Complete!');
    console.log(`   - New Members Assigned: ${assigned}`);
    console.log(`   - Admins Skipped:       ${skipped}`);
    console.log(`   - Total Processed:      ${data.length}`);

  } catch (err) {
    console.error('Sync Failed:', err);
    process.exit(1);
  }
}

syncMembers();