pragma solidity ^0.4.23;

contract WoningPas {

struct Upload{
	string fileName;
	bool isVerified;
}


mapping(string => Upload) uploads;


function getFileName(string _hash) public view returns (string){
	return uploads[_hash].fileName;
}

function isVerified(string _hash) public view returns (bool){
	return uploads[_hash].isVerified;
}

function addUpload(string _hash, string _file) public{
 	uploads[_hash] = Upload(_file, false);
}

 function setVerification(string _hash) public {
	Upload storage up = uploads[_hash];
	up.isVerified = true;
}
}


