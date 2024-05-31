// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from "npm:@supabase/supabase-js";
import { Database, Tables } from "../supabase.ts";

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string,
);

interface Payload {
  type: "INSERT";
  table: "book";
  record: Tables<"profiles">;
  schema: "public";
  old_record: null;
}

Deno.serve(async (req) => {
  console.log("Started function");
  const payload: Payload = await req.json();
  console.log("Payload received", JSON.stringify(payload, null, 2));
  const fetchRs = await fetch(
    `${Deno.env.get("ROBOHASH_URL")}/${encodeURIComponent(payload.record.id)}`,
  );
  console.log(
    "Fetch book data completed with status %s %s",
    fetchRs.status,
    fetchRs.statusText,
  );

  const blob = await fetchRs.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const path = payload.record.id + "/avatar";
  const { data, error } = await supabase.storage.from("profiles").upload(
    path,
    arrayBuffer,
    {
      contentType: blob.type,
      upsert: true,
    },
  );

  if (error) {
    return new Response(
      JSON.stringify({
        error,
        message: "File upload failed",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
  if (!data) {
    return new Response(
      JSON.stringify({
        error: new Error("File lost: Could not get uploaded data"),
        message: "File upload failed",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }

  const { data: { publicUrl } } = supabase.storage.from("profiles")
    .getPublicUrl(path);

  const profileUrl = new URL(publicUrl);
  profileUrl.hostname = "127.0.0.1";
  profileUrl.port = "54321";
  const { error: updateError } = await supabase.from("profiles").update({
    profile_image_url: profileUrl.href,
  }).eq("id", payload.record.id);

  if (updateError) {
    return new Response(
      JSON.stringify({
        error: updateError,
        message: "File upload failed",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }

  return new Response(
    JSON.stringify({
      error: null,
      message: "File uploaded",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-profile-image' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
