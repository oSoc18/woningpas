pragma solidity ^0.4.23;

contract WoningPasV2 {

	struct Owner{
		address addr;			
		//between id of the house and the house
		mapping(string => House) houses; 
		
	}

	struct House{
		string id;
		string streetName;
		uint zipCode;
		string city;
		string country;
		//Array or mapping ?
		//id of the doc and Document
		mapping(string => Document) documents;
	}

	struct Document{
		string fileId;
		bool isVerified;
		string hash;
	}


	mapping(address => Owner) owners;
	


	function addOwner() public{
		owners[msg.sender] = Owner(msg.sender);
	}

	function addHouse(string _streetName, uint _zipCode, string _city, string _country, string _idHouse) public{
		House memory house = House(_idHouse, _streetName, _zipCode, _city, _country);
		owners[msg.sender].houses[_idHouse] = house;	
	}

	function addDocument(string _fileId, bool _isVerified, string _hash, string _idHouse) public{
		Document memory docToAdd = Document(_fileId, _isVerified, _hash);
		owners[msg.sender].houses[_idHouse].documents[_fileId] = docToAdd;
	}

	
	function getFileHash(string _fileId, string _houseId) public view returns (string){
		return owners[msg.sender].houses[_houseId].documents[_fileId].hash;
	}


	function isVerified(string _fileId, string _houseId) public view returns (bool){
		return owners[msg.sender].houses[_houseId].documents[_fileId].isVerified;
	}


	 function setVerification(string _fileId, string _houseId) public {
		Document storage doc =  owners[msg.sender].houses[_houseId].documents[_fileId];
		doc.isVerified = true;
	}

	function getHouse(string _houseId) public view returns(string, uint, string, string){
		House storage house = owners[msg.sender].houses[_houseId];
		return (house.streetName, house.zipCode, house.city, house.country);
	}

	function getDocument(string _docId, string _houseId) public view returns(bool, string){
		Document storage doc = owners[msg.sender].houses[_houseId].documents[_docId];
		return (doc.isVerified, doc.hash);
	}
}
