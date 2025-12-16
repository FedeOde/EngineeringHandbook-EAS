module.exports = function (api) {
  api.cache(true);
  return {
    // Usamos el preset de Expo, que ya incluye el preset de Metro
    presets: ['babel-preset-expo'],
    plugins: [
      // Si estás usando Reanimated, este es el único plugin que debe ir aquí.
      // Si no usas Reanimated, puedes dejar 'plugins: []' o eliminar esta línea.
      'react-native-reanimated/plugin',
    ],
  };
};
