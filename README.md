# LFD reader

Web application with camera access to read LFD results.

# LFD
LFD reader demo app (next.js)

# Requirements
* Node (14+)

# Install
* Clone repo and remove node modules
* Install node and npm via nvm
```
cd ./MobileReadout/lfd
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm list-remote #get latest LTS version - in this case v16.17.1
nvm install v16.17.1
npm install
``` 

# Development
After checking out the repo, run `npm install` within the project root directory.
Start the development server with `npm run dev`.

Start server in screen
Don't forget to start mongo db after server restart - sudo service mongod start
Start the server with "npm run start"

Need to install mongodb (https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/), nodejs + npm (https://linuxhint.com/install-nodejs-npm-on-ubuntu-22-04/), ssl certificate (because camera app only works through https)
