# /login
	type=owner/admin/inspector
	
	Send back JSON file
	{key: key token}
	
# /upload
	JSON request
	{name: name of the file,
	key: key token (need to be an "owner" key),
	data: file in base64}
	
# /download
	name= name of the file downloaded
	key= key token
	
	Send back JSON
	{name : name of file,
	content: file in base64}
	
# /validate
	JSON request
	{key : key token (need to be an inspector),
	name : name of the file verified}
