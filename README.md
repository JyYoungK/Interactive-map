
### Dependencies to download. Open Visual Studio cd to my-app and type 
  `npm i react leaflet react-leaflet bootstrap firebase react-modal`
  `npm i --save react-router-dom`
  `npm i semantic-ui-react`
  `npm install socket.io-client`
  `npm i react-native`
  `firebase init` -- in order to run this you might need to download firebase tools https://firebase.google.com/docs/cli
  and set Fire Storing / Hostage

  ### Under server
  `npm install --save cors nodemon express socket.io`

### To use netlify, you must
`npm run build`
`npm install netlify-cli -g`
`netlify login` (log in with your netlify account
`netlify deploy --prod`
When you see Publish Directory type
`./build`
Ready to launch!

### To re deploy netlify, you must
delete `./build` and `netlify` in your folder. Re install `npm run build` and `netlify deploy --prod`


### How to start. Open Visual Studio cd to my-app and open terminal and type 
`npm start`

Runs the app in the development mode.\
Opens in [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
