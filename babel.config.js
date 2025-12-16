module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // === ESTA ES LA LÍNEA QUE NECESITAS AÑADIR ===
    '@babel/plugin-transform-private-methods',
  ],
};
