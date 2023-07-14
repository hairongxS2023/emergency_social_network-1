function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      //console.log("in index.js Cookie: ",cookie);
      if (cookie[0] === name) {
        return cookie[1];
      }
    }
    return null;
  }