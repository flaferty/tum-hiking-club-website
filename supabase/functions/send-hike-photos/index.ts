import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Profile {
  email: string | null;
}

interface Participant {
  profiles: Profile | null;
}

serve(async (req: Request) => {
  // 1. Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Function started...");

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    // 2. Initialize Client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, { 
      global: { headers: { Authorization: req.headers.get('Authorization')! } } 
    })

    // 3. Get User
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("Auth Error:", userError);
      throw new Error('Not authenticated: User not found')
    }
    
    console.log(`User found: ${user.id}`);

    // 4. Check Admin Role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (roleError) console.error("DB Error checking role:", roleError);
    console.log("Role Data found:", JSON.stringify(roleData));

    if (!roleData) {
      console.error(`User ${user.id} does not have admin role visible!`);
      throw new Error('Not authorized: Admins only')
    }

    // 5. Get Hike Data
    const { hikeId, photoLink, message } = await req.json();
    console.log(`Processing hike: ${hikeId}`);

    const { data: hike, error: hikeError } = await supabase
      .from('hikes')
      .select('name')
      .eq('id', hikeId)
      .single()
    
    if (hikeError || !hike) throw new Error('Hike not found')

    // 6. Get Participants (Using Service Role to bypass RLS)
    const { data: participants, error: partError } = await supabaseAdmin
      .from('hike_enrollments')
      .select('profiles(email)')
      .eq('hike_id', hikeId)

    if (partError) throw new Error(partError.message)

    const emails = (participants || [])
      .map((p: Participant) => p.profiles?.email)
      .filter((email: string | null): email is string => !!email)

    console.log(`Found ${emails.length} participants`);

    if (emails.length === 0) {
      return new Response(JSON.stringify({ message: 'No participants found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 7. Send Email
    const emailData = await resend.emails.send({
      from: 'TUM HN Hiking Club<noreply@tumhikingclub.com>',
      to: ['oleksandra.sobchyshak@tum.de'],
      bcc: emails,
      subject: `Photos: ${hike.name}`,
      html: `
        <h1>Thanks for joining us!</h1>
        <p>We hope you enjoyed the hike to <strong>${hike.name}</strong>.</p>
        <p>You can find the photos here: <a href="${photoLink}">View Photos</a></p>
        <p>${message || ''}</p>
        <p>See you on the next trail!</p>
        <p>TUM HN Hiking Team</p>
      `
    })

    return new Response(JSON.stringify(emailData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Function Failed:", errorMessage);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})