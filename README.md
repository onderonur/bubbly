# Bubbly
Full Stack chat application created w/ Next.js, Socket.IO, Express, React and TypeScript.  
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
* Framework: [Next.js](https://nextjs.org/) (w/ Custom [Express](https://expressjs.com/) Server Integration)
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
#### `npm install`
#### `npm run dev:custom`

### Production

To create a production build ready to deploy, you need to set a `JWT_SECRET_KEY` in `.env` file first.  

After that, run:
#### `npm run build`
#### `npm start`
