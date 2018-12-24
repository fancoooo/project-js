// Create needed constants
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

let db ;

window.onload = function(){
    const request = indexedDB.open('notes',1);

    request.onerror = function(e){
        console.log("ket noi ko thanh cong");
    }

    request.onsuccess = function(e){
        console.log("ket noi thanh cong");
        
        db = request.result;
        displaydata();
    }

    request.onupgradeneeded = function(e) {
        // Grab a reference to the opened database
        let db = e.target.result;
      
        // Create an objectStore to store our notes in (basically like a single table)
        // including a auto-incrementing key
        let objectStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement:true });
      
        // Define what data items the objectStore will contain
        objectStore.createIndex('title', 'title', { unique: false });
        objectStore.createIndex('body', 'body', { unique: false });
      
        console.log('Database setup complete');
      };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const item = {title: titleInput.value,body: bodyInput.value};

        const s=  db.transaction('notes','readwrite');
        const data = s.objectStore('notes');

        const request = data.add(item);

        request.onsuccess = () =>{
            console.log("them thanh cong");
            titleInput.value = '';
            bodyInput.value = '';
        }

        displaydata();

    });

    function displaydata() {

        while(list.firstElementChild){
            list.removeChild(list.firstElementChild);
        }
        
        const data = db.transaction('notes').objectStore('notes');
        data.openCursor().onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
                const li = document.createElement('li');
                const h3 = document.createElement('h3');
                const p = document.createElement('p');
                const btn = document.createElement('button');
                li.setAttribute('data-note-id', cursor.value.id);
                li.appendChild(h3);
                li.appendChild(p);
                li.appendChild(btn);
                list.appendChild(li);
                

                h3.textContent = cursor.value.title;
                p.textContent = cursor.value.body;

                btn.textContent = 'Delete';
                btn.onclick = deleteData;
                cursor.continue();
            }else{
                if(!list.firstChild) {
                    let listItem = document.createElement('li');
                    listItem.textContent = 'No notes stored.';
                    list.appendChild(listItem);
                }
            }

        }

    }

    function deleteData(e) {
        const li = e.target.parentNode;
        const id = Number(li.getAttribute('data-note-id'));
        const s = db.transaction('notes','readwrite');
        const data = s.objectStore('notes');

        const request = data.delete(id);
        request.onsuccess = () => {
            list.removeChild(li);
        }
        if(!list.firstChild) {
            let listItem = document.createElement('li');
            listItem.textContent = 'No notes stored.';
            list.appendChild(listItem);
        }
    }
}