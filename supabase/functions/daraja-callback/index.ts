
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const callbackData = await req.json();
    console.log('Received Daraja callback:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    const { stkCallback } = Body;

    // Extract payment details
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const merchantRequestID = stkCallback.MerchantRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    let paymentData = {
      checkout_request_id: checkoutRequestID,
      merchant_request_id: merchantRequestID,
      result_code: resultCode,
      result_desc: resultDesc,
      amount: null,
      mpesa_receipt_number: null,
      phone_number: null,
      transaction_date: null,
    };

    // If payment was successful, extract additional details
    if (resultCode === 0 && stkCallback.CallbackMetadata) {
      const metadata = stkCallback.CallbackMetadata.Item;
      
      for (const item of metadata) {
        switch (item.Name) {
          case 'Amount':
            paymentData.amount = item.Value;
            break;
          case 'MpesaReceiptNumber':
            paymentData.mpesa_receipt_number = item.Value;
            break;
          case 'PhoneNumber':
            paymentData.phone_number = item.Value;
            break;
          case 'TransactionDate':
            paymentData.transaction_date = item.Value;
            break;
        }
      }
    }

    // Store payment details in database
    const { error } = await supabase
      .from('payments')
      .insert([{
        checkout_request_id: paymentData.checkout_request_id,
        merchant_request_id: paymentData.merchant_request_id,
        result_code: paymentData.result_code,
        result_desc: paymentData.result_desc,
        amount: paymentData.amount,
        mpesa_receipt_number: paymentData.mpesa_receipt_number,
        phone_number: paymentData.phone_number,
        transaction_date: paymentData.transaction_date,
        status: resultCode === 0 ? 'completed' : 'failed',
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error storing payment data:', error);
    }

    console.log('Payment callback processed successfully');

    // Respond to Safaricom
    return new Response(JSON.stringify({
      ResultCode: 0,
      ResultDesc: "Accepted"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in daraja-callback function:', error);
    
    // Still respond with success to Safaricom to avoid retries
    return new Response(JSON.stringify({
      ResultCode: 0,
      ResultDesc: "Accepted"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
