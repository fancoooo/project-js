// Create needed constants
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');


var docCookies = {
    getItem: function (sKey) {
      if (!sKey) { return null; }
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
  };

  function appendLI(title,content) {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    const btn = document.createElement('button');

    h3.textContent = title;
    p.textContent = content;
    btn.textContent = 'Delete';
    li.appendChild(h3);
    li.appendChild(p);
    li.appendChild(btn);
    list.appendChild(li);

    btn.onclick = deleteData;
  }

  function deleteData(e) {
    const li = e.target.parentNode;
    const s = li.firstElementChild.textContent;
    list.removeChild(li);
    const data = getCookie();
    const da = data.filter(str => str['title'] !== s);
    docCookies.setItem('notes',JSON.stringify(da),'Wed, 19 Feb 2127 01:04:55 GMT');
  }

  function getCookie() {
    const cookie = docCookies.getItem('notes');
    const li = JSON.parse(cookie);
    if(cookie) return li;
    else return [];
  }

  function displayCookie() {
    const cookie = docCookies.getItem('notes');
    const li = JSON.parse(cookie);
    if(cookie){
      li.forEach(note => {
        appendLI(note['title'],note['content']);
      });
    }
  }

  function addData(title,content) {
    let arr = getCookie();
    const data = {
      'title':title,
      'content':content
    };
    arr.push(data);
    docCookies.setItem('notes',JSON.stringify(arr),'Wed, 19 Feb 2127 01:04:55 GMT');
  }

  window.onload = () => {

    displayCookie();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = titleInput.value;
      const content = bodyInput.value;
      const item = Array.from(list.children);
      const li = item.filter( str => str.firstElementChild.textContent === title);
      if(li.length === 0){
        appendLI(title,content);
        addData(title,content);
        titleInput.value = '';
        bodyInput.value = '';
      }else{
        alert('nhap lai');
      }
    });

  }