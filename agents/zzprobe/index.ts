export async function onRequest(context: any): Promise<Response> {
  const out: any = { hasSandbox: !!context.sandbox, ctxKeys: Object.keys(context || {}) };
  if (context.sandbox) {
    try { out.info = context.sandbox.getInfo ? context.sandbox.getInfo() : "no-getInfo"; } catch (e: any) { out.infoErr = String(e).slice(0, 250); }
    try { out.run = await context.sandbox.commands.run("id; uname -a; hostname; cat /proc/self/cgroup | head -3", { timeout: 20 }); } catch (e: any) { out.runErr = String(e).slice(0, 350); }
    try { out.tools = Object.keys(context.tools || {}); } catch (e: any) {}
  }
  return new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json" } });
}
