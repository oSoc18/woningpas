
module.exports.api = {
  "login": ["account"],
  "upload": ["key", "content", "houseID"],
  "download": ["key", "url"],
  "validate": ["key", "url", "houseID"],
  "validated": ["key", "url","houseID"],
  "getHouses":["key"],
}
