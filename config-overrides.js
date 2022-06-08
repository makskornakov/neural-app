// Code copied from https://dev.to/ansonh/simplest-way-to-install-babel-plugins-in-create-react-app-7i5

// Overrides create-react-app webpack configs without ejecting
// https://github.com/timarney/react-app-rewired

const { useBabelRc, override } = require('customize-cra');
// eslint-disable-next-line react-hooks/rules-of-hooks
module.exports = override(useBabelRc());

// TODO! put this rewire into a module, then declare it in the package.json using https://github.com/timarney/react-app-rewired#extended-configuration-options
