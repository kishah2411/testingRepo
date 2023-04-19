//Get ALL Alert Notification 
allAlertNotification = function(siteurl,apikey,location,callback){
	var axios = require('axios');
	var https = require("https"); 
	var data = '';

	var config = {
	  method: 'get',
	  url: siteurl +'/api/alert-notifications',
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
//Get Alert Notification By UID
uidBaseAlertNotification = function(siteurl,apikey,location,uid,callback){
	var axios = require('axios');
	var https = require("https"); 
	var data = '';

	var config = {
	  method: 'get',
	  url: siteurl +'/api/alert-notifications/uid/'+uid,
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
//Create New Alert Notification
createAlertNotification=function(siteurl,apikey,location,callback){
	const fs = require('fs');
	let data = fs.readFileSync(location);
	var axios = require('axios');
	var https = require("https"); 
	var config = {
	  method: 'post',
	  url: siteurl +'/api/alert-notifications',
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
//Update Alert Notification Based on ID
updateAlertNotification=function(siteurl,apikey,location,id,callback){
	const fs = require('fs');
	let data = fs.readFileSync(location);
	var axios = require('axios');
	var https = require("https"); 
	var config = {
	  method: 'put',
	  url: siteurl +'/api/alert-notifications/'+id,
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

//Delete Alert Notification Based On ID
deleteAlertNotification=function(siteurl,apikey,id,callback){
	var axios = require('axios');
	var https = require("https"); 
	var config = {
	  method: 'delete',
	  url: siteurl +'/api/alert-notifications/'+id,
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
	var dashboardData = {};
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
    	var location = arg5+"/alertnotification_"+destdir;
    	fs.mkdir(arg5+"/alertnotification_"+destdir, (err) => {
		    if (err) {
		        return console.error(err);
		    }
		    console.log('Alert Notification Directory created successfully!');
		});
		allAlertNotification(siteurl,apikey,location, function(response) {
			fs.writeFile(location+"/alertnotification.json", JSON.stringify(response, null, 4), (err) => {
			    if (err) {
			        console.error(err);
			        return;
			    };
			    console.log("File has been created");
			});
			filepath = location+"/alertnotification.json";
			uploadFile(filepath,'alertnotification');
		});
    }
    else if(jobtype == 'create'){
    	console.log(" path is " + arg5);  
    	var location = arg5;
		createAlertNotification(siteurl,apikey,location, function(response) {
			console.log(JSON.stringify(response,null,4));
			console.log("Alert Notification Created");
		});
    }
    else if(jobtype == 'update'){
    	var arg6 = process.argv[6]; 
    	if(arg6 == "" || arg6 == null){
			arg6 = ".";
		}
    	console.log(" path is " + arg6); 
    	console.log(" Alert Notification ID is " + arg5); 
    	var location = arg6; 
		updateAlertNotification(siteurl,apikey,location,id, function(response) {
			console.log(JSON.stringify(response,null,4));
			console.log("Alert Notification Updated");
		});
    }
    else if(jobtype == 'delete'){
    	console.log(" Existing Alert Notification ID is " + arg5);
    	var id = arg5;  
		deleteAlertNotification(siteurl,apikey,id, function(response) {
			if(response == 200){
				console.log(JSON.stringify(response,null,4));
				console.log("Alert Notification Deleted");
			}else{
				console.log("Alert Notification Not Deleted");
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