# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Design

The primary motivation behind this web application is to provide a framework to simulate DPS not of a single move, but rather a rotation based on a team composition. To that end, the direct approach is to create a timeline based analysis tool that can support not just the multiplier analysis. Further works based on this project could be perhaps ML optimization of rotations based on character selection, or possibly machine search a selection of characters that achieves a certain DPS.

## Data Structures

We will establish a couple of data structures that will each uniquely represent a certain feature of the timeline.

### Stats
```js
let Stat = class {
    constructor(a bunch of character stats here) {
        //we set the stats like Atk, Def, etc used for calculation.
    }
}
```

### Skill Representation
```js
let Skill = class {
  constructor(name, start, duration, cd, effect, multipliers) {
    this.name = name;                   // string: The name of the skill
    this.start = start;                 // float: start time of the skill
    this.duration = duration;           // float: The duration of the skill; (0 for pure instance damage skills)
    this.cd = cd;                       // float: The cooldown of the skill
    this.effect = effect;               // function: the effect of the skill (i.e. buffs)
    this.multipliers = multipliers;     // array: Multipliers of the skill in an array of (%, offset) pairs
  }
};
```
### Timeline Representation
We will use 3 different queues/dictionaries to represent the timeline: One queue to represent the buffs on the characters, the other to represent the instances of damage - i.e. pure multipliers. The 3rd queue will be used as representation of the resulting damage, for use in dps calculations.

## Algorithms

## Rationale
