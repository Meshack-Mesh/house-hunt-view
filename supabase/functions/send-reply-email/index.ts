
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured, simulating email send");
      console.log('Email would be sent to:', to);
      console.log('Subject:', subject);
      console.log('Message:', message);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully (simulated - configure RESEND_API_KEY for real emails)' 
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Send actual email using Resend
    const emailResponse = await resend.emails.send({
      from: "HouseHunt Kenya <onboarding@resend.dev>", // Use your verified domain
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">HouseHunt Kenya Support</h2>
          
          <p>Dear ${customerName},</p>
          
          <p>Thank you for contacting us. Here's our reply to your inquiry:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your Original Message:</h3>
            <p style="font-style: italic; color: #6b7280;">"${originalMessage}"</p>
          </div>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1d4ed8;">Our Reply:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>If you have any further questions, please don't hesitate to contact us.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="color: #6b7280; font-size: 14px;">
            <p><strong>HouseHunt Kenya</strong></p>
            <p>📞 +254 703 781 416</p>
            <p>📧 meshackmwima@gmail.com</p>
            <p>🌍 Serving Nairobi County & Surrounding Areas</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    if (emailResponse.error) {
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        id: emailResponse.data?.id 
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
      JSON.stringify({ 
        error: error.message,
        details: "Please check that RESEND_API_KEY is properly configured"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
