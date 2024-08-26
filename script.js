// Menunggu hingga seluruh konten HTML dimuat sebelum menjalankan fungsi
document.addEventListener("DOMContentLoaded", loadTodos)

function loadTodos() {
    // Mengambil data todos dari localStorage dan parsing JSON menjadi objek JavaScript
    let todos = JSON.parse(localStorage.getItem('todos')) || []
    // Mengiterasi setiap todo dan menambahkannya ke dalam daftar
    todos.forEach((todo) => addTodoToList(todo.text, todo.checked, todo.priority, todo.timestamp))
}


function addTodoToList(text, checked = false, priority = 'low', timestamp = null) {
    if (priority === 'high') {
        text = text.toUpperCase();
    }
    
    // Membuat elemen <li> baru untuk item daftar
    let li = document.createElement("li")
    // Mengatur teks dari <li> menjadi nilai input
    li.textContent = text
    
    // Set timestamp, gunakan yang disediakan atau buat yang baru
    if (!timestamp) {
        timestamp = new Date().toISOString()
    }
    // set timestamp
    li.dataset.timestamp = timestamp
    
    // menambahkan timestamp sebagai elemen tambahan
    let timestampElem = document.createElement("span")
    timestampElem.className = "timestamp"
    timestampElem.textContent = new Date(timestamp).toLocaleString()
    li.appendChild(timestampElem)
    


    // Menambahkan class prioritas berdasarkan parameter
    li.classList.add(priority + '-priority')
    
    // Menambahkan class checked jika item ditandai sebagai selesai
    if (checked) {
        li.classList.add('checked')
    }

    // Membuat tombol close untuk menghapus item
    let closeBtn = document.createElement("SPAN")
    closeBtn.textContent = "\u00D7" // Simbol "×"
    closeBtn.className = "close"
    li.appendChild(closeBtn)
    closeBtn.onclick = function() {
        // Menghapus item dari tampilan dan menyimpan perubahan
        li.remove()
        saveTodos()
    }

    // Membuat tombol edit untuk mengubah teks item
    let editBtn = document.createElement("SPAN")
    editBtn.textContent = "Edit"
    editBtn.className = "edit"
    li.appendChild(editBtn)
    editBtn.onclick = function() {
        // Menampilkan prompt untuk mengedit teks item
        let newText = prompt("Edit the item:", li.firstChild.textContent)
        // Memperbarui teks jika baru tidak kosong
        if (newText !== null && newText.trim() !== "") {
            li.firstChild.textContent = newText
            saveTodos()
        }
    }

    // Menambahkan item <li> ke dalam daftar
    document.getElementById("myUL").appendChild(li)
    // Menyimpan perubahan setelah menambahkan item baru
    saveTodos()
}

function saveTodos() {
    // Membuat array untuk menyimpan data todos
    let todos = []
    // Mengiterasi setiap <li> dan mengumpulkan data untuk disimpan
    document.querySelectorAll('li').forEach(function(li) {
        let priority = 'low'
        if (li.classList.contains('medium-priority')) {
            priority = 'medium'
        } else if (li.classList.contains('high-priority')) {
            priority = 'high'
        }

        todos.push({
            text: li.firstChild.textContent,
            checked: li.classList.contains('checked'),
            priority: priority,
            timestamp: li.dataset.timestamp
        })
    })
    // Menyimpan data todos ke localStorage sebagai JSON
    localStorage.setItem('todos', JSON.stringify(todos))
}

function newElement() {
    // Mengambil nilai dari input dan select
    let inputValue = document.getElementById("myInput").value
    let priorityValue = document.getElementById("priorityInput").value
    // Mengecek jika input kosong
    if (inputValue === '') {
        alert("You must write something!")
    } else {
        // Menambahkan item baru ke daftar dan menyimpan perubahan
        addTodoToList(inputValue, false, priorityValue)
        saveTodos()
    }
    // Mengosongkan input setelah menambahkan item
    document.getElementById("myInput").value = ""
}

// Menambahkan fitur pencarian
document.getElementById('searchInput').addEventListener('input', function(){
    // Mengambil nilai pencarian dan mengubah menjadi huruf kecil
    let searchValue = this.value.toLowerCase()
    // Menyembunyikan atau menampilkan item berdasarkan pencarian
    document.querySelectorAll('#myUL li').forEach(function(li){
        let text = li.textContent.toLowerCase()
        if(text.includes(searchValue)){
            li.style.display = ''
        } else {
            li.style.display = 'none'
        }
    })
})

// Menambahkan event listener untuk mengubah status selesai ketika item diklik
document.querySelector("ul").addEventListener("click", function(ev) {
    if (ev.target.tagName === 'LI') {
        // Menambahkan atau menghapus class 'checked' ketika item diklik
        ev.target.classList.toggle("checked")
        // Menyimpan perubahan setelah mengubah status item
        saveTodos()
    }
}, false)


// Menambahkan event listener untuk membuat fitur sortir/filter
document.getElementById('sortInput').addEventListener('change', function(){
    sortTodos(this.value)
})

function sortTodos(criteria){
    let ul = document.getElementById("myUL")
    let items = Array.from(ul.getElementsByTagName("li"))

    // Sortir item berdasarkan kriteria 
    items.sort((a,b) => {
        let aValue, bValue 
        switch (criteria){
            case 'date':
                aValue = new Date(a.dataset.timestamp)
                bValue = new Date(b.dataset.timestamp)
                console.log('Sorting:', aValue, bValue)
                return bValue - aValue
            case 'priority':
                let priorityOrder = {'low': 1, 'medium': 2, 'high': 3}
                aValue = priorityOrder[getPriority(a)]
                bValue = priorityOrder[getPriority(b)]
                return bValue - aValue
            case 'checked':
                aValue = a.classList.contains('checked') ? 1 : 0
                bValue = b.classList.contains('checked') ? 1 : 0
                return bValue - aValue
        }
    })

    // Hapus semua item dari list
    ul.innerHTML = ''

    // Append sorted items
    items.forEach(item => ul.appendChild(item))
}   

function getPriority(li){
    if(li.classList.contains('high-priority')) return 'high'
    if(li.classList.contains('medium-priority')) return 'medium'
    return 'low'
}


// Saat halaman dimuat, cek tema yang tersimpan
document.addEventListener('DOMContentLoaded', function() {
    const currentTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.classList.add(currentTheme);
});

document.getElementById('themeToggleBtn').addEventListener('click', function() {
    let body = document.body;

    // Toggle antara tema light dan dark
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
    }
});
