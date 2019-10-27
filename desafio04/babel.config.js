module.exports = {
  presets: [
    "@babel/preset-env",  //Transforma as funcionalidades do Javascript que o navegadores nao entendem
    "@babel/preset-react"  //Transforma as funcionalidades do React que os navegadores nao entendem
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties'
  ]
};