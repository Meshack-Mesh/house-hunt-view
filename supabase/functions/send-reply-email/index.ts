
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  originalMessage: string;
  customerName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, originalMessage, customerName }: EmailRequest = await req.json();

    // Using EmailJS free service - you can replace this with any email service
    const emailData = {
      service_id: 'default_service',
      template_id: 'template_reply',
      user_id: 'your_user_id',
      template_params: {
        to_email: to,
        to_name: customerName,
        subject: subject,
        message: message,
        original_message: originalMessage,
        from_name: 'HouseHunt Kenya Support',
        from_email: 'meshackmwima@gmail.com'
      }
    };

    // For now, we'll simulate sending an email
    // In production, you would integrate with a real email service like:
    // - Resend (recommended for Supabase)
    // - SendGrid
    // - Mailgun
    // - AWS SES
    
    console.log('Email would be sent to:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demonstration, we'll return success
    // In production, replace this with actual email service integration
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully (simulated)' 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-reply-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
