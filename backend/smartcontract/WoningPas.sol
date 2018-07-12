pragma solidity ^0.4.23;

contract WoningPas {

	struct Upload{
		string fileName;
		bool isVerified;
		string hash;
	}


	mapping(string => Upload) uploads;


	function getFileName(string _id) public view returns (string){
		return uploads[_id].fileName;
	}

	function getHash(string _id) public view returns (string){
		return uploads[_id].hash;
	}

	function isVerified(string _id) public view returns (bool){
		return uploads[_id].isVerified;
	}

	function addUpload(string _id, string _file, string _hash) public{
	 	uploads[_id] = Upload(_file, false, _hash);
	}

	 function setVerification(string _id) public {
		Upload storage up = uploads[_id];
		up.isVerified = true;
	}




}


