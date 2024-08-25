export const environment = {
  // APP_SECRET: window["env"].APP_SECRET,
  // APP_SALT: window["env"].APP_SALT,
  // API_KEY: window["env"].API_KEY,
  //API_URL: window["env"].API_URL,
  //whitelistedDomains: [String(window["env"].whitelistedDomains)],
  // HUBCALL_API_URL: window["env"].HUBCALL_API_URL,

  APP_SECRET: 'SmartFactorySF',
  APP_SALT: '023442-SFSAND-345TH5',
  API_KEY: '0167323HTE-893P2OSDJ-6SDJKA2421B-FD6DFAF33-3DDAST37262S7',
  API_URL: 'https://smartfactory-dev.centralindia.cloudapp.azure.com/sandbox/',
  whitelistedDomains: [
    'https://smartfactory-dev.centralindia.cloudapp.azure.com/',
    'https://smartfactory-dev.centralindia.cloudapp.azure.com/sandbox/',
  ],
  HUBCALL_API_URL:
    'https://smartfacdemo.eastus.cloudapp.azure.com/hubapi/hubcall/',

  logout_timer: 3600000,
  logging_url: 'http://localhost:9880/smartfactory.logger.sandbox',
  home_url: '/home',
  help_url: '/help',
  contact_url: '/contactus',
  mil_graph_color: '#120F49',
  production: true,
};
console.log('$$$ check production:', environment.production);
console.log('$$$ check configmap API_URL:', environment.API_URL);
console.log('$$$ check secret APP_SECRET:', environment.APP_SECRET);
