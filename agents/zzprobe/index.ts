export async function onRequest(context: any): Promise<Response> {
  const out: any = {};
  if (!context.sandbox) return new Response(JSON.stringify({ no: 1 }), { headers: { "Content-Type": "application/json" } });
  const sb: any = context.sandbox;
  // 触发初始化
  try { await sb.commands.run("true", { timeout: 20 }); } catch (e: any) { out.initErr = String(e).slice(0, 300); }
  try { out.envdToken = String(sb.envdAccessToken || "").slice(0, 60); } catch (e: any) { out.tokErr = String(e).slice(0, 200); }
  try { out.host = typeof sb.getHost === "function" ? sb.getHost() : null; } catch (e: any) { out.hostErr = String(e).slice(0, 200); }
  try { out.info = typeof sb.getInfo === "function" ? sb.getInfo() : null; } catch (e: any) { out.infoErr = String(e).slice(0, 300); }
  // sandbox 内网络:旧实例直通域可达性(自己账号 10-05 的实例)+ envd 自身端口
  try {
    out.net = await sb.commands.run(
      "for u in 'http://8080-moyfnmsmcyeaqnuyf4iwtgtlrtxy2jvg34jbro2s.ap-singapore.tencentags.com/' 'http://169.254.68.5:80/' 'http://localhost:9983/'; do echo \"== $u\"; python3 -c \"import urllib.request,sys;\\ntry:\\n r=urllib.request.urlopen(sys.argv[1],timeout=4); print(r.status, r.read(200))\\nexcept Exception as e: print('ERR', str(e)[:100])\" \\"$u\\"; done",
      { timeout: 40 }
    );
  } catch (e: any) { out.netErr = String(e).slice(0, 300); }
  return new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json" } });
}
