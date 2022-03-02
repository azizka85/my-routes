module.exports = {
  transform: {
    "\\.[jt]sx?$": "babel-jest",
    "\\.ejs$": "./src/compiler/jest-ejs-transform.js"
  }
}
