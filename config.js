window.BASE_URL = "https://nullpointerluka.github.io/Movix/";

window.asset = function(path) {
  return window.BASE_URL + path.replace(/^\/+/, "");
};
