# README #

This README would normally document whatever steps are necessary to get your application up and running.

In this application we have consider following API
1. Dashboard
2. Datasource
3. Alert Notification
4. Users
5. Teams

Each and every API we have created seprate files and different Operation.

### Dashboard ###
 
1. backup -> Get All Dashboards information and create each dashboard file at particular location.
EX: node dashboardAPI.js <site_url> <api_key> backup <backup_path>

2. create -> Create New Dashboard inside particular folder location using particular json file.[Sample File : SampleFile/createNewDashboard.json]
EX: node dashboardAPI.js <site_url> <api_key> create <file_path>

3. restore -> when you giving some existing dashboard data then application will check and remove existing datasource and create as new dashboard.
EX: node dashboardAPI.js <site_url> <api_key> restore <file_path>

### Datasources ###

 
1. backup -> Get All Datasource information and create file at particular location.
EX: node datasourceAPI.js <site_url> <api_key> backup <backup_path>

2. create -> Create New Datasource using particular json file.[Sample File : SampleFile/newdatasouceSample.json]
EX: node dashboardAPI.js <site_url> <api_key> create <file_path>

3. update -> Based on datasource ID you can update data will pass using particular json file.[Sample File : SampleFile/updateExistingDatasource.json]
EX: node dashboardAPI.js <site_url> <api_key> update <datasource_id> <file_path> 

4. delete -> Based on datasource ID you can delete
EX: node dashboardAPI.js <site_url> <api_key> delete <datasource_id>

### Alert Notification ###

1. backup -> Get All Alert Notification and create file at particular location.
EX: node alertsAPI.js <site_url> <api_key> backup <backup_path>

2. create -> Create New Alert Notification using particular json file.[Sample File : SampleFile/newAlertNotification.json]
EX: node alertsAPI.js <site_url> <api_key> create <file_path>

3. update -> Based on Alert Notification ID you can update data will pass using particular json file.[Sample File : SampleFile/updateAlertNotification.json]
EX: node alertsAPI.js <site_url> <api_key> update <alertnotification_id> <file_path> 

4. delete -> Based on Alert Notification ID you can delete
EX: node alertsAPI.js <site_url> <api_key> delete <alertnotification_id>

### Users ###

1. backup -> Get All Users and create file at particular location.
EX: node usersAPI.js <site_url> <api_key> backup <backup_path>

### Teams ###

1. backup -> Get All Teams and create file at particular location.
EX: node teamsAPI.js <site_url> <api_key> backup <backup_path>