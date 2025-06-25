const process = {env: []} as any;

export const environment = {
  production: false,
  pageTitle: process?.env?.["APP_NAME"] || "Padicare",
  timeZone: process?.env?.["APP_TIMEZONE"] || "UTC",
  locale: process?.env?.["APP_LOCALE"] || "en-US",
  serverUrl: process?.env?.["SERVER_URL"] || "http://localhost:8081/api/v1",
  fileServerUrl: process?.env?.["FILE_SERVER_URL"] || "http://localhost:8090",
  socketServerUrlEndPoint: process?.env?.["SOCKET_SERVER_URL"] || "http://localhost:8082",
  renewTokenUrl: "/access/auth/renew-token",
  recaptcha:{
    invisibleCaptchaClientSideKey: process?.env?.["CLIENT_SIDE_KEY_INVISIBLE_CAPTCHA"] || "6LdxtT0gAAAAADDB04GF30J3iQTZ4NKViT8MQNxT",
    invisibleCaptchaPrivateKey: process?.env?.["CLIENT_SIDE_KEY_INVISIBLE_CAPTCHA"] || "6LdxtT0gAAAAAMla1cjmYkkuiDB3gr_mOvIxkiLd",
  },
  googleMapApiKey: process?.env?.["GOOGLE_MAP_API_KEY"] || "AIzaSyCpYeT3cBLvGBUVuYhrXOBAY8_ZW7IKzGY",
  get baseURL(): string {
    const parsedUrl = new URL(window.location.href);
    let baseUrl = parsedUrl.origin;
    return baseUrl;
  },
  logger: {
    console: process?.env?.["LOGGER_CONSOLE"] === "true" || true,
    localStorage: process?.env?.["LOGGER_LOCAL_STORAGE"] === "true" || false,
    webApi: process?.env?.["LOGGER_WEB_API"] === "true" || false,
  },
};
