//Get ALL Users
allUsers = function(siteurl,apikey,location,callback){
	var axios = require('axios');
	var https = require("https"); 
	var data = '';

	var config = {
	  method: 'get',
	  url: siteurl +'/api/users',
	  headers: { 
	    'Content-Type': 'application/json', 
	    'Authorization': 'Bearer '+ apikey,
	  },
	  httpsAgent: new https.Agent({
        rejectUnauthorized: false,
  	  }),
	  data : data
	};
	axios(config)
	.then(function (response) {
		callback(response.data);
	})
	.catch(function (error) {
	  console.log(error);
	});
}
//Initialy Check 
function grafanaAPI() { 
	const fs = require('fs'); 
    var siteurl = process.argv[2]; 
    var apikey = process.argv[3];
    var jobtype = process.argv[4];
     var arg5 = process.argv[5];
    if(arg5 == "" || arg5 == null){
		arg5 = ".";
	}
    console.log(" site URL is " + siteurl);  
    console.log(" apikey is " + apikey);  
    console.log(" jobtype is " + jobtype);  
    var today = new Date();
    var destdir = (today.getFullYear()+""+(today.getMonth() + 1)+""+today.getDate())+""+today.getTime();
    
    if(jobtype == 'backup'){
    	console.log(" path is " + arg5);  
    	var location = arg5+"/users_"+destdir;
    	fs.mkdir(arg5+"/users_"+destdir, (err) => {
		    if (err) {
		        return console.error(err);
		    }
		    console.log('Users Directory created successfully!');
		});
		allUsers(siteurl,apikey,location, function(response) {
			fs.writeFile(location+"/users.json", JSON.stringify(response, null, 4), (err) => {
			    if (err) {
			        console.error(err);
			        return;
			    };
			    console.log("File has been created");
			});
			filepath = location+"/users.json";
			uploadFile(filepath,'users');
		});
    }
}  
grafanaAPI(); 
/**
 * Add File on google cloud storage
 */
// The ID of your GCS bucket
const bucketName = 'gs://grafana-dashboard-backups/';

const {Storage} = require('@google-cloud/storage');
// Creates a client
const storage = new Storage();
var today = new Date();
var destdir = (today.getFullYear()+"-"+(today.getMonth() + 1)+"-"+today.getDate())+"-"+today.getTime();

async function uploadFile(filePath,filename) {
  await storage.bucket(bucketName).upload(filePath, {
      destination: destdir+"/"+filename,
  });
  console.log(`${filePath} uploaded to ${bucketName}`);
}