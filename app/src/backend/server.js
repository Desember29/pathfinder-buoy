// Module dependencies
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const server = express();

// Serve static assets
server.use(express.static(path.resolve(__dirname, '../..', 'build')));

server.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../..', 'build', 'index.html'));
});



//Connection to the MySQL database. For deployment uncomment socketPath and comment host.
const connection = mysql.createConnection({
    //host: '35.198.131.225',
    socketPath: '/cloudsql/pathfinder-buoy:europe-west3:measurements',
    user: 'root',
    password: 'pathfinder',
    database: 'pathfinder'
});

//Function just to attempt connection to MySQL database. Not necessary to have but useful for debugging.
connection.connect(function(error) {
    if (error)  {
        console.log(error);
        console.log("Failed to connect to MySQL database!");
    }
    else {
        console.log('You are now connected to the MySQL database...');
    }
});



//Configuration for Google Cloud pub/sub connection.
const config = {
	gcpProjectId: 'pathfinder-buoy',
	gcpServiceAccountKeyFilePath: './src/backend/PathfinderBuoy-0348063bfbee.json'
};

//Instantiation of Google Cloud
const gcloud = require('google-cloud')({
    projectId: config.gcpProjectId,
	keyFilename: config.gcpServiceAccountKeyFilePath,
});

//Instantiate a pubsub client
const pubsub = gcloud.pubsub();

//Instantiate a measurements subscription.
const pointMeasurementsSubscription = pubsub.subscription('pointMeasurements');

//Function to insert a single measurement into database.
function insertPointMeasurement(date, measurement) {
    let formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    let data = [formattedDate, measurement.Lat, measurement.Lon, measurement.T, measurement.TU, measurement.B];
    connection.query('INSERT INTO point_measurements (date, lat, lng, temperature, turbidity, battery) VALUES (?,?,?,?,?,?)', data, function(error, result) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Inserted point measurement: " + data);
        }
    });
}

//Start listening for new events from subscription and pass data to insertion function.
pointMeasurementsSubscription.on('message', function(message) {
	console.log(message);
    insertPointMeasurement(message.attributes.published_at, JSON.parse(Buffer.from(message.data, 'base64').toString()));
    message.ack();
});

//Function to retrieve measurements from the point_measurements table.
function getPointMeasurements(callback) {
    connection.query('SELECT * FROM point_measurements', function(error, results) {
        if (error) {
            console.log("'SELECT * FROM point_measurements' failed!");
            callback(error, null);
        }
        else {
            callback(null, results);
        }
    });
}


//Instantiate a waveMeasurements subscription.
const waveMeasurementsSubscription = pubsub.subscription('waveMeasurements');

//Function to insert a wave measurement into database.
function insertWaveMeasurement(date, measurement) {
    let formattedTime = new Date(date).getTime();
    let data = [formattedTime, measurement.ax, measurement.ay, measurement.az, measurement.gx, measurement.gy];
    connection.query('INSERT INTO wave_measurements (time, x_acc, y_acc, z_acc, x_gyro, y_gyro) VALUES (?,?,?,?,?,?)', data, function(error, result) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Inserted wave measurement: " + data);
        }
    });
}

//Start listening for new events from subscription and pass data to insertion function.
waveMeasurementsSubscription.on('message', function(message) {
	console.log(message);
    insertWaveMeasurement(message.attributes.published_at, JSON.parse(Buffer.from(message.data, 'base64').toString()));
    message.ack();
});

//Function to retrieve measurements from the wave_measurements table.
function getWaveMeasurements(callback) {
    connection.query('SELECT time AS Time, x_acc AS `x-acc`, y_acc AS `y-acc`, z_acc AS `z-acc`, x_gyro AS `x-gyro`, y_gyro as `y-gyro` FROM wave_measurements', function(error, results) {
        if (error) {
            console.log("'SELECT time AS Time, x_acc AS `x-acc`, y_acc AS `y-acc`, z_acc AS `z-acc`, x_gyro AS `x-gyro`, y_gyro as `y-gyro` FROM wave_measurements' failed!");
            callback(error, null);
        }
        else {
            callback(null, results);
        }
    });
}



//Handle all requests using the /measurements url for retrieving the point_measurements data.
server.get('/pointMeasurements', function(req, res) {
    getPointMeasurements((error, results) => {
        if (error) {
            console.log(error);
        }
        res.send(results);
    });
});

//Handle all requests using the /waveMeasurements url for retrieving the wave_measurements data.
server.get('/waveMeasurements', function(req, res) {
    getWaveMeasurements((error, results) => {
        if (error) {
            console.log(error);
        }
        res.send(results);
    });
});

//Start the backend server to listen for requests.
server.listen(8080, () => console.log('Listening on port 8080'));