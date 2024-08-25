(function (window) {
    window["env"] = window["env"] || {};
    window["env"].APP_SECRET = "${APP_SECRET}";
    window["env"].APP_SALT = "${APP_SALT}";
    window["env"].API_KEY = "${API_KEY}";

    window["env"].API_URL = "${API_URL}";
    window["env"].whitelistedDomains = "${whitelistedDomains}";

    window["env"].HUBCALL_API_URL = "${HUBCALL_API_URL}";

})(this)