var dbURI;
if(process.env.NODE_ENV==='production'){
	dbURI = 'mongodb://GAURAV:GAURAV@ds237120.mlab.com:37120/vidjot-pro';
}else{
	dbURI = 'mongodb://localhost:27017/vidjot-dev';
}
module.exports = dbURI;