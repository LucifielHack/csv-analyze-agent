export async function onRequest(context: any): Promise<Response> {
  const out: any = { hasSandbox: !!context.sandbox };
  if (context.sandbox) {
    const sb: any = context.sandbox;
    out.sandboxKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(sb) || {}).concat(Object.keys(sb));
    try { out.info = typeof sb.getInfo === "function" ? sb.getInfo() : null; } catch (e: any) { out.infoErr = String(e).slice(0, 300); }
    // 原始属性探测(token/host/endpoint 常见字段)
    const raw: any = {};
    for (const k of ["token", "sandboxToken", "instanceId", "host", "domain", "endpoint", "url", "id", "expiresAt", "config"]) {
      try { if ((sb as any)[k] !== undefined) raw[k] = String((sb as any)[k]).slice(0, 300); } catch {}
    }
    out.rawProps = raw;
    // 执行一发拿实例信息(错误信息里带 instanceId/expiresAt 形态)
    try { out.run = await sb.commands.run("id; hostname", { timeout: 20 }); } catch (e: any) { out.runErr = String(e).slice(0, 400); }
  }
  return new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json" } });
}
