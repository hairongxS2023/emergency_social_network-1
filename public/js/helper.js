function getUrl() {
    if (window.location.hostname === 'localhost') {
      return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    } else {
      return 'https://s23esnb3.onrender.com';
    }
  }
  
  
  