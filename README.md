# Reactv2-express-multiple-entry-point

### What is Reactv2-express-multiple-entry-point?
This is an app that allow React V2 support multiple entry point.

The app have two entry point: index.html (default)
							  admin.html (new)

***Navigate index.html*** : localhost:5000/ or localhost:5000/index.html

***Navigate admin.html*** : admin.html : localhost:5000/admin.html

***Note***: This app only work for the build folder. 

If you run ```npm run start``` inside the client folder (the react app), there would have a bug

The app is using Express.js to launch the server
		 
### How to test the app?
**Step 1** : Create a empty directory.
```
mkdir "You_Directory_name"
```

**Step 2** : Use terminal and go into the directory.
```
cd "Your_Directory_Name"
```

**Step 3** : Clone the Repo into the directory.
```
git clone https://github.com/chiKaRau/git-reactv2-express-multiple-entry-point.git
```

**Step 4** : Go to the Reactv2-express-multiple-entry-point. Note: This folder is for express script
```
cd Reactv2-express-multiple-entry-point
```

**Step 5** : In the Reactv2-express-multiple-entry-point directory, install dependencies for express by typing:
```
npm install 
```

**Step 6** : When the installing done, go to the client folder. Note: This folder is for React App
```
cd client
```

**Step 7** : In the client directory, install dependencies for React app by typing:
```
npm install 
```

**Step 8** : When the installing done, create a build folder to serve a server by typing: 
```
npm run build
```

**Step 9** : When the build done, go back previous directory 
```
cd ..
```

**Step 10** : Now we are ready to launch the server by typing: 
```
npm start 
```

**Step 11** : Test the Application by browsing localhost:5000
