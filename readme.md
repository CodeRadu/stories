### `Cloning`
To clone the repository run "git clone https://github.com/papucicumuci/stories.git"
### `Setting up`
In the config folder create a config.env file
copy this model:
PORT=443
HTTP=80
MONGO_URI=your mongodb connect url
GOOGLE_CLIENT_ID=your client id
GOOGLE_CLIENT_SECRET=your client secret code
HTTPS_ENABLED=1 or 0
HTTPS_URL=https://yoursite.com
HTTP_URL=http://yoursite.com
NODE_ENV=production
### `Google cloud platform`
Go to https://console.cloud.google.com/ and create an account
Create a project
Enable apis
Enable google+ api
Setup Oauth consent screen
Setup oauth client id in credentials
### `MongoDB setup`
Go to https://www.mongodb.com/2 and create an account
Create a cluster and a user
Make sure you added your server's ip address to the whitelist
Click connect and connect your application and copy the connection token
You should find a "<password>" tag. Change it to the user's password
### `Running`
For dev mode run "npm run dev"
For production mode run "npm start"
