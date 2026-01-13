import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  hikeId: string;
  photoLink: string;
  message?: string;
}

interface Profile {
  email: string;
}

interface ParticipantRow {
  profiles: Profile | null;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey, { 
      global: { headers: { Authorization: req.headers.get('Authorization')! } } 
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (!roleData) throw new Error('Not authorized: Admins only')

    const { hikeId, photoLink, message } = await req.json() as RequestBody;
    if (!hikeId || !photoLink) throw new Error('Missing hikeId or photoLink')

    const { data: hike, error: hikeError } = await supabase
      .from('hikes')
      .select('name')
      .eq('id', hikeId)
      .single()
    
    if (hikeError || !hike) throw new Error('Hike not found')

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    
    const { data: participants, error: partError } = await supabaseAdmin
      .from('hike_enrollments')
      .select('profiles(email)')
      .eq('hike_id', hikeId)
      .returns<ParticipantRow[]>()

    if (partError) throw new Error(partError.message)

    const emails = (participants || [])
      .map((p) => p.profiles?.email)
      .filter((email): email is string => !!email)

    if (emails.length === 0) {
      return new Response(JSON.stringify({ message: 'No participants found with emails' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const emailData = await resend.emails.send({
      from: 'TUM Hiking <onboarding@resend.dev>',
      to: ['admin@tum.de'],
      bcc: emails,
      subject: `Photos: ${hike.name}`,
      html: `
        <h1>Thanks for joining us!</h1>
        <p>We hope you enjoyed the hike to <strong>${hike.name}</strong>.</p>
        <p>You can find the photos from the trip here:</p>
        <p><a href="${photoLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Photos</a></p>
        <br/>
        <p>${message || ''}</p>
        <br/>
        <p>See you on the next trail!</p>
        <p>TUM Hiking Team</p>
      `
    })

    return new Response(JSON.stringify(emailData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})