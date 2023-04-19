//Get ALL Datasource
allDatasource = function(siteurl,apikey,location,callback){
	var axios = require('axios');
	var https = require("https"); 
	var data = '';

	var config = {
	  method: 'get',
	  url: siteurl +'/api/datasources',
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
//Create New DataSource
createDataSource=function(siteurl,apikey,location,callback){
	const fs = require('fs');
	let data = fs.readFileSync(location);
	var axios = require('axios');
	var https = require("https"); 
	var config = {
	  method: 'post',
	  url: siteurl +'/api/datasources',
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
//Update Datasource Based on ID
updateDataSource=function(siteurl,apikey,location,id,callback){
	const fs = require('fs');
	let data = fs.readFileSync(location);
	var axios = require('axios');
	var https = require("https"); 
	var config = {
	  method: 'put',
	  url: siteurl +'/api/datasources/'+id,
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

//Delete DataSource Based On ID
deleteDataSource=function(siteurl,apikey,id,callback){
	var axios = require('axios');
	var https = require("https"); 
	var config = {
	  method: 'delete',
	  url: siteurl +'/api/datasources/'+id,
	  headers: { 
	    'Content-Type': 'application/json', 
	    'Authorization': 'Bearer '+ apikey,
	  },
	  httpsAgent: new https.Agent({
        rejectUnauthorized: false,
  	  })
	};

	axios(config)
	.then(function (response) {
	  callback(response.status);
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
    	var location = arg5+"/datasource_"+destdir;
    	fs.mkdir(arg5+"/datasource_"+destdir, (err) => {
		    if (err) {
		        return console.error(err);
		    }
		    console.log('Datasource Directory created successfully!');
		});
		allDatasource(siteurl,apikey,location, function(response) {
			fs.writeFile(location+"/datasource.json", JSON.stringify(response, null, 4), (err) => {
			    if (err) {
			        console.error(err);
			        return;
			    };
			    console.log("File has been created");
			});
			filepath = location+"/datasource.json";
			uploadFile(filepath,'datasource');
		});
    }
    else if(jobtype == 'create'){
    	console.log(" Path is " + arg5);  
    	var location = arg5;
		createDataSource(siteurl,apikey,location, function(response) {
			console.log(JSON.stringify(response,null,4));
			console.log("Datasource Created");
		});
    }
    else if(jobtype == 'update'){
    	var arg6 = process.argv[6]; 
    	if(arg6 == "" || arg6 == null){
			arg6 = ".";
		}
    	console.log(" path is " + arg6); 
    	console.log(" Datasource ID is " + arg5); 
    	var location = arg6;
		updateDataSource(siteurl,apikey,location,id, function(response) {
			console.log(JSON.stringify(response,null,4));
			console.log("Datasource Updated");
		});
    }
    else if(jobtype == 'delete'){
    	console.log(" Existing Data ID is " + arg5);
    	var id = arg5;  
		deleteDataSource(siteurl,apikey,id, function(response) {
			if(response == 200){
				console.log(JSON.stringify(response,null,4));
				console.log("Datasource Deleted");
			}else{
				console.log("Datasource Not Deleted");
			}			
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