# Bubbly
A dynamic chat application created w/ Socket.IO, React, TypeScript and Express, Node.js.  
Live demo deployed on Heroku is **[here](https://bubbly-chat.herokuapp.com/)**.

<p align="center">
  <img src="/screenshots/home-page.png" alt="Bubbly Logo"/>
</p>

### Features
* Creating chat rooms for real-time chat
* Joining conversations by using themed rooms
* JWT based anonymous authentication
* Users can set their username and conversation bubble color
* Sending images/gifs
* Emoji picker
* "User is typing" notifications
* Dark theme
* Automatically linkifying urls, emails etc
* Invite/share buttons
* Sound notification when the window is not focused
* "Back to bottom" button to scroll down automatically

### Stack
* API Framework: [Express](https://expressjs.com/)
* Real-Time Engine: [Socket.IO](https://socket.io/)
* Authentication: [JSON Web Token](https://jwt.io/)
* UI Components: [Material-UI](https://material-ui.com/)
* Styling: [styled-components](https://styled-components.com/)
* Forms: [Formik](https://jaredpalmer.com/formik)
* Form Validations: [Yup](https://github.com/jquense/yup)
* Illustrations: [unDraw](https://undraw.co/)
* Linting: [ESLint](https://eslint.org/)
* Code Formatting: [Prettier](https://prettier.io/)

### Development

To run it in development mode:
##### API:
#### `cd api`
#### `npm install`
#### `npm run dev`
##### Client:
#### `cd client`
#### `npm install`
#### `npm start` 

### Production

To create a production build ready to deploy, you need to set a `JWT_SECRET_KEY` in `api/.env` file first.  

After that, run:
#### `npm run build`
#### `npm start`
