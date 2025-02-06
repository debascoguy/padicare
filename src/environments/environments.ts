export const environment = {
  production: false,
  serverUrl: "http://localhost:8081/api/v1",
  renewTokenUrl: "/auth/renew-token",
  fileServerUrl: "http://localhost:8090",
  socketServerUrlEndPoint: "http://localhost:8082",
  clientSideSiteKey_invisible_captcha: '6LdxtT0gAAAAADDB04GF30J3iQTZ4NKViT8MQNxT',
  privateSiteKey_invisible_captcha: '6LdxtT0gAAAAAMla1cjmYkkuiDB3gr_mOvIxkiLd',
  get baseURL(): string {
    const parsedUrl = new URL(window.location.href);
    let baseUrl = parsedUrl.origin;
    return baseUrl;
  },
  logger: {
    console: true,
    localStorage: false,
    webApi: false
  },
};
