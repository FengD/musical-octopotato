# musical-octopotato

## Installation

### Local mode

To install and deploy all the servers on a single machine, follow these instruction.

#### Prerequisites

##### MongoDB

First of all, you should have installed [MongoDB][2] on your computer in a version compatible with MongoDB 3.2 community edition.

Please refer to the [official MongoDB instructions][1] to install and set it up and running.

Ensure now that MongoDB is running locally with the default configuration, meaning that databases are reachable at the host `localhost:27017`.

##### Node.js

You should also have an [ECMAScript 6][4] compatible version of [Node.js][3], we suggest `v5.6.0`.

##### Compass

Finally, in order to be able to compile SASS files, you must install [Compass][5].

#### Ubuntu

Run the `install_local.sh` script with root privileges. This will setup all project modules and their dependencies.

The following commands do not need to be executed in root mode, but they have to be all run with same privileges.

Then execute the `run_local.sh` script, it will start the backend services. You can now launch the frontend through the `TODO COMMAND` and test the application at: [TODOlink].

To stop the system, run the `stop_local.sh` script.

## Team
 * Fernando Garrigos: MP3-files upload/download service (backend) and login (frontend)
 * Ying Jiang: Frontend
 * Marc Karassev: Users and Mixes services, and MongoDB configuration (backend)
 * Tom Veniat: Frontend
  // TODO who did what

## Links
 * [MongoDB official website][2]
 * [MongoDB installation instructions][1]
 * [Node.js official website][3]
 * [ECMAScript 6 features][4]
 * [Compass installation instructions][5]

[1]: https://docs.mongodb.org/master/installation/
[2]: https://www.mongodb.org/
[3]: https://nodejs.org/en/
[4]: http://es6-features.org/
[5]: http://compass-style.org/install/