import { useEffect } from 'react';

export const getCookie = (cname)=>{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
export const setCookie = (n, v, exDate)=>{
    var expires = "expires="+ exDate.toUTCString();
    document.cookie = n + "=" + v + ";" + expires + ";path=/";
}
export const deleteAllCookies = ()=>{
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export const useEvent = (callback,event)=>{
  useEffect(()=>{
      const eventListener = (e)=>{callback(e.detail)}
      document.addEventListener(event,eventListener)
      return ()=>{document.removeEventListener(event,eventListener)}
  },[])
}
const dispatchEvent = (eventName,payload=null)=>{
  document.dispatchEvent(new CustomEvent(eventName,{detail:payload}))
}





