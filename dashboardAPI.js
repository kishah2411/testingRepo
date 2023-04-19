//Get Dashboard based on UID with Deatiled Information
getDashbord=function(siteurl,apikey,uid,location, callback){
	const fs = require('fs');
	var axios = require('axios');
	var https = require("https"); 
	var data = '';
	var config = {
	  method: 'get',
	  url: siteurl +'/api/dashboards/uid/'+uid,
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
	 	fs.writeFile(location+"/"+uid+".json", JSON.stringify(response.data, null, 4), (err) => {
		    if (err) {
		        console.error(err);
		        return;
		    };
		    console.log("File has been created");
		});
		filepath = location+"/"+uid+".json";
		filename = uid;
		uploadFile(filepath,filename);
	})
	.catch(function (error) {
	  console.log(error);
	});
} 
//Get All Folder and Dashboard UID with minimum Details
getAllFolderDashbord=function(siteurl,apikey,location, callback){
	var uidlist = {};
	var axios = require('axios');
	var https = require("https"); 
	var data = '';
	var config = {
	  method: 'get',
	  url: siteurl +'/api/search/',
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
		if(response.data){
			for(var myKey in response.data){
				if(typeof response.data[myKey] == "object"){
					if(response.data[myKey]['type'] == 'dash-db'){
						uidlist[myKey] = response.data[myKey]['uid'];
					}
				}
			}
		}	  
		console.log(uidlist);
		callback(uidlist);
	})
	.catch(function (error) {
	  console.log(error);
	});
}
//Create New Dashboard
createDashbord=function(siteurl,apikey,location,callback){
	const fs = require('fs');
	let data = fs.readFileSync(location);
	var axios = require('axios');
	var https = require("https"); 
	var config = {
	  method: 'post',
	  url: siteurl +'/api/dashboards/db',
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
//Get Existing Dashboard or not Based on UID
checkDashbord=function(siteurl,apikey,uid,callback){
	var axios = require('axios');
	var https = require("https"); 
	var data = '';

	var config = {
	  method: 'get',
	  url: siteurl +'/api/dashboards/uid/'+uid,
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
		callback(response.status);
	})
	.catch(function (error) {
	  console.log(error);
	});
}
//Delete Dashboard using UID
deleteDashbord=function(siteurl,apikey,uid,callback){
    var axios = require('axios');
    var https = require("https"); 
	var data = '';

	var config = {
	  method: 'delete',
	  url: siteurl +'/api/dashboards/uid/'+uid,
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
	  callback(response.status);
	})
	.catch(function (error) {
	  console.log(error);
	});
}
//Update Existing Restore Dashboard
restoreDashbord=function(siteurl,apikey,data,callback){
	const fs = require('fs');
	var axios = require('axios');
	var https = require("https"); 
	var config = {
	  method: 'post',
	    url: siteurl +'/api/dashboards/db',
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
    var path = process.argv[5];
    console.log(" site URL is " + siteurl);  
    console.log(" apikey is " + apikey);  
    console.log(" jobtype is " + jobtype);  
    console.log(" path is " + path);  
    if(path == "" || path == null){
		path = ".";
	}
    var today = new Date();
    var destdir = (today.getFullYear()+""+(today.getMonth() + 1)+""+today.getDate())+""+today.getTime();
    
    if(jobtype == 'backup') {
    	var location = path+"/dashboard_"+destdir;
    	fs.mkdir(path+"/dashboard_"+destdir, (err) => {
		    if (err) {
		        return console.error(err);
		    }
		    console.log('Directory created successfully!');
		});
		getAllFolderDashbord(siteurl,apikey,location, function(response) {
			for(var myKey in response){
				console.log("Single UID: " +response[myKey]);
				getDashbord(siteurl,apikey,response[myKey],location, function(results) {
					console.log("result");
				});
			}
		});		
    }else if(jobtype == 'create'){
    	var location = path;
		createDashbord(siteurl,apikey,location, function(response) {
			console.log(JSON.stringify(response,null,4));
			console.log("Dashboard Created");
		});
    }else if(jobtype == 'restore'){
    	const fs = require('fs'); 
    	var location = path;
		let dataDash = fs.readFileSync(location);
		var dashData = JSON.parse(dataDash);
		var exDashUID = dashData.dashboard.uid;
		var exDashFolderID = dashData.meta.folderId;
		checkDashbord(siteurl,apikey,exDashUID, function(response) {
			if(response == 200){
				deleteDashbord(siteurl,apikey,exDashUID, function(result) {
					if(result == 200){
						var newDashData = dashData;
						newDashData.dashboard.uid = null;
						newDashData.dashboard.id = null;
						newDashData['folderId'] = dashData.meta.folderId;
						newData = JSON.stringify(newDashData);
						restoreDashbord(siteurl,apikey,newData,function(results) {
							console.log(JSON.stringify(results,null,4));
			 				console.log("Dashboard restored");
						});
					}
				});
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