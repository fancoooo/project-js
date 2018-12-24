

function isLocalStorage() {
  try{
    return 'localStorage' in window || window['localStorage'] !==null ;
  }catch(e){
    return false;
  }
}

function getListUse() {
  const input = localStorage.getItem('use');
  if(input){
    return JSON.parse(input);
  }
  return [];
}

function setChecked(usename,check) {
  const set = getListUse();
  set.forEach( (str) => {
      if(str['usename'] == usename) str['checked'] = check;
  })
  localStorage.setItem('use',JSON.stringify(set));
}

function saveListUse(name,check) {
  const sav = getListUse();
  const save = {
    'usename': name,
    'checked': check
  };
  sav.push(save);
  localStorage.setItem('use',JSON.stringify(sav));
}

function removeUse(usename) {
  const obj = JSON.parse(localStorage['use']);
  const newobj = obj.filter((str) => str['usename'] != usename);
  localStorage.setItem('use',JSON.stringify(newobj));
}


window.onload = function(){

  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  const ul = document.getElementById('invitedList');
  const main = document.getElementsByClassName('main');

  const div = document.createElement('div');
  const labe = document.createElement('label');
  const checkbox = document.createElement('input');
  labe.textContent = 'Click hide to checkbox for display';
  checkbox.type = 'checkbox';
  labe.appendChild(checkbox);
  div.appendChild(labe);
  main[0].insertBefore(div,ul);
  // function create to li 
  function createLI(usename, ischeckbox){
      const li = document.createElement('li');
      if(ischeckbox === true) li.classList.add('responded');
      // function create element
      function createEle(elementName,property,text){
        const ele = document.createElement(elementName);
        ele[property] = text;
        return ele;
      }
      
      const span = createEle('span','textContent',usename);
      li.appendChild(span);
    
      const label = createEle('label','textContent','Configmed');
      li.appendChild(label);
    
      const checkbox = createEle('input','type','checkbox');
      checkbox.checked = ischeckbox;
      label.appendChild(checkbox);
      li.appendChild(label);
    
      const remove = createEle('button','textContent','Remove');
      li.appendChild(remove);
    
      const edit = createEle('button','textContent','Edit');
      li.appendChild(edit);
    
      return li;
  }


  if(isLocalStorage()){

    const data = getListUse();
    for(let i=0;i<data.length;i++){
      ul.appendChild(createLI(data[i]['usename'],data[i]['checked']));
    }

    form.addEventListener('submit', (e) =>{
      e.preventDefault();
      const name = input.value;
      const lis = ul.children;
      var count = 0;
      for(let i=0;i<lis.length;i++){
        if(name === lis[i].firstElementChild.textContent) count++;
      }
     
      if(name !== '' && count === 0){
        saveListUse(name,false);
        ul.appendChild(createLI(name,false));
        input.value = '';
      }else alert('người dùng cần nhập thông tin tên chính xác || trùng tên '); 
    });



    ul.addEventListener('change', (e) => {
        const check = e.target;
        const li = check.parentNode.parentNode;
        if(check.checked){
          li.classList.add('responded');
          setChecked(li.firstElementChild.textContent,true);
        } 
        else{
          li.classList.remove('responded');
          setChecked(li.firstElementChild.textContent,false);
          if(checkbox.checked === true){
            li.style.display = 'none';
          }
        }
    });
    // event click to Remove , Edit , Save ...
    ul.addEventListener('click' , (e) => {
        // nếu bấm vào các nút
        if(e.target.tagName === 'BUTTON'){
          const click = e.target;
          const listnode = click.parentNode;
          const ulnode = listnode.parentNode;
          // đối tượng để lực chọn nút 
          const action = {
            Remove: () => {
              ulnode.removeChild(listnode);
              removeUse(listnode.firstElementChild.textContent);
            },
            Edit: () => {
              click.textContent = 'Save';
              const input = document.createElement('input');
              input.type = 'text';
              const span = listnode.firstElementChild;
              input.value = span.textContent;
              listnode.replaceChild(input,span);
              removeUse(span.textContent);
            },
            Save: () => {
              
              const sp = document.createElement('span');
              if(listnode.firstElementChild.value !== ''){
                click.textContent = 'Edit';
                sp.textContent = listnode.firstElementChild.value;
                const ip = listnode.firstElementChild;
                listnode.replaceChild(sp,ip);
                saveListUse(ip.value,listnode.children[1].firstElementChild.checked);
              }
              else alert('sửa thông tin không được để trống');
              
            }
          }
          action[click.textContent]();
        }
    });

    // event lọc khách hàng đã tích vào checkbox
    div.addEventListener('change', (e) => {
      
      const check = e.target;
      const li = ul.querySelectorAll('li');
      if(check.checked === true){
        for(var i=0;i<li.length;i++){
          var label = li[i].querySelector('label');
          if(label.firstElementChild.checked === false){
            li[i].style.display = 'none';
          }
        }
      }else{
        li.forEach(ele => ele.style.display = 'initial');
      }
    });
  }
  
}












