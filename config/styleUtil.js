function cssInjection(content) {
    return content
      .replace(/\/style\/?'/g, "/style/css'")
      .replace(/\/style\/?"/g, '/style/css"')
      .replace(/\.less/g, '.css');
  }
  
  module.exports = {
    cssInjection,
  };