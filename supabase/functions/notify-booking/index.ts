import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ADMIN_EMAIL = "111@163.com";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, booking_date, time_slots } = await req.json();

    // Log the booking notification
    console.log(`🎾 NEW BOOKING NOTIFICATION`);
    console.log(`User: ${username}, Date: ${booking_date}, Slots: ${time_slots.join(", ")}`);

    // Send email using Resend (free tier)
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (RESEND_API_KEY) {
      const slotsText = time_slots.join("、");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Tennis Booking <onboarding@resend.dev>",
          to: [ADMIN_EMAIL],
          subject: `🎾 新预订通知 - ${username} 预订了 ${booking_date}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>🎾 新预订通知</h2>
              <p><strong>用户：</strong>${username}</p>
              <p><strong>日期：</strong>${booking_date}</p>
              <p><strong>时段：</strong>${slotsText}</p>
              <p style="color: #888; font-size: 12px;">此邮件由网球场预订系统自动发送</p>
            </div>
          `,
        }),
      });
      const emailResult = await res.json();
      console.log("Email result:", JSON.stringify(emailResult));
    } else {
      console.log("RESEND_API_KEY not set, skipping email notification");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Notification error:", error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
