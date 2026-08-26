// Cloudflare Pages Function — Pages(HTTPS)와 EC2 백엔드(HTTP) 사이의 프록시.
// HTTPS 페이지에서 HTTP로 직접 요청하면 브라우저가 mixed content로 차단하고,
// 오리진이 갈라져 있으면 httpOnly refresh 쿠키도 전달되지 않는다.
// `_redirects`로는 외부 서버로의 프록시가 불가능해 Function으로 처리한다.
// BACKEND_ORIGIN은 Cloudflare Pages 프로젝트의 환경변수로 등록한다 (예: http://<EC2_IP>:8080).
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const target = new URL(`${url.pathname}${url.search}`, env.BACKEND_ORIGIN);

  return fetch(new Request(target, request));
}
