export const environment = {
  production: true,
  pageTitle: "Padicare",
  serverUrl: "http://localhost:8081/api/v1",
  renewTokenUrl: "/auth/renew-token",
  fileServerUrl: "http://localhost:8090",
  socketServerUrlEndPoint: "http://localhost:8082",
  clientSideSiteKey_invisible_captcha: '6LdxtT0gAAAAADDB04GF30J3iQTZ4NKViT8MQNxT',
  privateSiteKey_invisible_captcha: '6LdxtT0gAAAAAMla1cjmYkkuiDB3gr_mOvIxkiLd',
  googleMapApiKey: 'AIzaSyCpYeT3cBLvGBUVuYhrXOBAY8_ZW7IKzGY',
  googleMapApiUrl: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCpYeT3cBLvGBUVuYhrXOBAY8_ZW7IKzGY&libraries=places',
  googleMapApiUrlForAutocomplete: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCpYeT3cBLvGBUVuYhrXOBAY8_ZW7IKzGY&libraries=places',
  googleMapApiUrlForDirections: 'https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyCpYeT3cBLvGBUVuYhrXOBAY8_ZW7IKzGY&libraries=places',
  get baseURL(): string {
    const parsedUrl = new URL(window.location.href);
    let baseUrl = parsedUrl.origin;
    return baseUrl;
  },
  logger: {
    console: true,
    localStorage: false,
    webApi: true
  },
};
