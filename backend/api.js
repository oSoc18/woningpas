module.exports.api = {
	"login": ["account"],
	"download": ["key", "url"],
	"validate": ["key", "url", "houseID"],
	"validated": ["key", "url", "houseID"],
	"getHouses": ["key"],
	"addHouse": ["key", "street", "zipCode", "city", "country"],
	"getDocuments": ["key", "houseId"],
	"addDocument": ["key", "houseId", "content"]
}