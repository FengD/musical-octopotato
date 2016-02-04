# musical-octopotato

## Table of contents
  // TODO

## Team
  // TODO who did what

## Installation

### Local mode

To install and deploy all the servers on a single machine, follow these instruction.

#### Prerequisites

First of all, you should have installed [MongoDB][2] on your computer in a version compatible with MongoDB 3.2 community edition.

Please refer to the [official MongoDB instructions][1] to install and set it up and running.

Ensure now that MongoDB is running locally with the default configuration, meaning that databases are reachable at the host `localhost:27017`.

#### Ubuntu

Run the `install_local.sh` script with root privileges. This will setup all project modules and their dependencies.

Then execute the `run_local.sh` script, it will start the backend services and the frontend. You can now test the application at: [TODOlink].

To stop the system, run the `stop_local.sh` script.

Notice that the two last commands may be executed in root or normal mode, but they have to be both run with same privileges.

## Links
 * [MongoDB official website][2]
 * [MongoDB installation instructions][1]

[1]: https://docs.mongodb.org/master/installation/
[2]: https://www.mongodb.org/
