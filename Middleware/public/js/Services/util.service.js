const jsonToQueryString = (json) => {
    return Object.keys(json)
      .map(function(key) {
        // Check if the value is an array
        if (Array.isArray(json[key])) {
          return json[key].map(function(item) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(item);
          }).join('&');
        }
        // Check if the value is an object
        else if (typeof json[key] === 'object') {
          return jsonToQueryString(json[key]);
        }
        // Default case
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
      })
      .join('&');
  }
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function getToken() {
  let token = sessionStorage.getItem("loggedUser");
  if (token == undefined || token == null || token === "") {
    window.location.href="login.html";
  }
  return token;
}
export {
    jsonToQueryString,
    parseJwt,
    getToken
}