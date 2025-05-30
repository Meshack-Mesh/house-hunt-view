
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface STKPushRequest {
  phone: string;
  amount: number;
  account_reference: string;
  transaction_desc: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { phone, amount, account_reference, transaction_desc }: STKPushRequest = await req.json();

    console.log('Processing Daraja payment request:', { phone, amount, account_reference, transaction_desc });

    // Get Safaricom credentials from environment
    const consumer_key = Deno.env.get('SAFARICOM_CONSUMER_KEY');
    const consumer_secret = Deno.env.get('SAFARICOM_CONSUMER_SECRET');
    const business_short_code = Deno.env.get('SAFARICOM_BUSINESS_SHORT_CODE');
    const passkey = Deno.env.get('SAFARICOM_PASSKEY');
    const callback_url = Deno.env.get('SAFARICOM_CALLBACK_URL');

    if (!consumer_key || !consumer_secret || !business_short_code || !passkey || !callback_url) {
      throw new Error('Missing Safaricom credentials');
    }

    // Step 1: Get OAuth token
    const auth = btoa(`${consumer_key}:${consumer_secret}`);
    const tokenResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get OAuth token from Safaricom');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log('Got access token from Safaricom');

    // Step 2: Generate password and timestamp
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = btoa(`${business_short_code}${passkey}${timestamp}`);

    // Step 3: Format phone number (ensure it starts with 254)
    let formattedPhone = phone.replace(/\D/g, ''); // Remove non-digits
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    console.log('Formatted phone number:', formattedPhone);

    // Step 4: Send STK Push request
    const stkPushPayload = {
      BusinessShortCode: business_short_code,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: business_short_code,
      PhoneNumber: formattedPhone,
      CallBackURL: callback_url,
      AccountReference: account_reference,
      TransactionDesc: transaction_desc
    };

    console.log('Sending STK Push request to Safaricom:', stkPushPayload);

    const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushPayload),
    });

    const stkData = await stkResponse.json();
    console.log('STK Push response:', stkData);

    if (stkData.ResponseCode === '0') {
      // STK Push initiated successfully
      return new Response(JSON.stringify({
        success: true,
        message: 'STK Push sent successfully',
        checkout_request_id: stkData.CheckoutRequestID,
        merchant_request_id: stkData.MerchantRequestID,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error(`STK Push failed: ${stkData.ResponseDescription || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('Error in daraja-payment function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
