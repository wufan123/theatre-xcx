var getSearchParams = function (url) {
  url = url.substring(url.indexOf('?')+1)
  var paramPart = url.split('&');
  return paramPart.reduce(function (res, item) {
    let parts = item.split('=');
    res[parts[0]] = parts[1];
    return res;
  }, {});
}

module.exports = {
  getSearchParams: getSearchParams
}