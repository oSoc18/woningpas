module.exports.api = {
	"login": ["account"],
	"download": ["key", "url"],
	"validate": ["key", "url", "houseId", "owner"],
	"getHouses": ["key"],
	"addHouse": ["key", "street", "zipCode", "city", "country"],
	"getDocuments": ["key", "houseId"],
	"addDocument": ["key", "houseId", "content"],
	"getHouse" : ["key", "houseId"],
	"getDocument" : ["key", "houseId","documentId", "owner"],
	"transferOwnership" : ["key", "from", "to", "houseId"],
	"reset": ["key"]
}
