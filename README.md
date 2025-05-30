# Harper Component Challenge

### Overview

The purpose of this project is to solve the Harper Node Challenge using Harper Components.

### Project Setup

This project assumes you have HarperDB installed globally
Install with "npm install harperdb" locally if you prefer

```bash

npm install
npm link harperdb
npm run start

```

### Seed Database

Below is the route for seeding the database from: http://localhost:9926
You can set a custom seed amount in the request body: {"count": "number"}

```bash

# Seed User DB (default is 200 users for empty requests)
POST "/SeedUsers/"

```

### Stream User Data

Below is the route for streaming the data from: http://localhost:9926
You can use custom sorting and filtering with query params on fields: id, firstName, lastName, email, age, active (boolean)

```bash

# Stream all users
GET "/User/"

# Stream first 100 users
GET "/User/?limit(100)"

# Stream by id from offset to limit
GET "/User/?limit(5,100)"

# Filtering by user age (range: 18-80)
GET "/User/?age=gte=20"
GET "/User/?age=lte=30"
GET "/User/?age=gte=25&age=lte=70"

```

### Node Challenge Overview

The purpose of this challenge is for you to demonstrate familiarity with Node.js, asynchronous streaming, and scalable server architecture, and to act as a starting point for further conversation with you. We would also like you to read the introduction to building applications with Harper, so we can discuss your solution in the context of the Harper platform.

We are not trying to trick you with this challenge, and we are not expecting that you submit a large and complex solution. Our intention is that you spend only 2-3 hours on this challenge. Please approach this challenge with the above things in mind. During the technical interview please be ready to share your screen, discuss your solution, and impress our team with your ideas!

### The Challenge!

Create a simple NodeJS HTTP server that will listen for HTTP requests, and when a request is received, it will read all the entries from an LMDB store with lmdb-js, and stream them back to the client. You should use the getRange method described here to read the entries. The response should be delivered in JSON format. We also want you to demonstrate how you ensure that the iterator pauses when there is network back-pressure, and terminates and closes the iterator if the connection is closed.

The lmdb-js documentation also explains how you can set up a data store and put some sample data in it (using the put method), for your server.

And again, we would like you to read and familiarize yourself with Harper application documentation here. You will not need to write a Harper application or component, but we will discuss how you might approach that and considerations for ensuring scalability.

Here are some considerations that we will discuss:

- How did you ensure that this was responsive to back-pressure and termination? (With potentially unreliable/slow network connections.)
- What are performance bottlenecks with your server, what kind of performance could be expected from this server?
- Are there optimization opportunities for this?
- How would you extend this server to utilize multiple CPU cores with concurrency (say a 32-core server) to increase scalability?
- How would you filter the data to return a subset of the entries?
- Can you describe some of the basic ways that Harper applications are built and how to ensure scalability for code and components written by other developers?
