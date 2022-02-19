if (typeof(Storage) !== 'undefined') {
    if (localStorage.getItem('book') == null) {
        console.log('No book found');
        localStorage.setItem('book', '[]');
    }
    book = JSON.parse(localStorage.getItem('book'));

    displayBook(book);

    document.getElementById('searchBook').addEventListener('submit', searchBook());

    clear = document.getElementById('clear');
    clear.addEventListener('click', function(e) {
        e.previousElementSibling.value = '';
        e.focus();
    });

    document.querySelectorAll('#markAsCompleted, #markAsNotCompleted').forEach(e => {
        e.addEventListener('click', toggleCompleteMark(e));
    });

    document.querySelectorAll('#deleteBook').forEach(e => {
        e.addEventListener('click', deleteBook(e));
    });

    inputBook = document.getElementById('inputBook');
    inputBook.addEventListener('submit', insertBook());

    var btn = document.querySelectorAll("#deleteBookModal");
    btn.forEach(e => {
        e.addEventListener('click', openDeleteBookModal(e));
    });
    closeModal = document.querySelectorAll(".close");
    closeModal.forEach(e => {
        e.addEventListener('click', closeDeleteBookModal(e));
    });
    window.addEventListener('click', closeDeleteBookModal2(e));
} else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage")
}

function closeDeleteBookModal2(e) {
    return function(e) {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    };
}

function closeDeleteBookModal(e) {
    return function() {
        modal = e.parentElement.parentElement.parentElement;
        modal.style.display = "none";
    };
}

function openDeleteBookModal(e) {
    return function() {
        modal = e.nextElementSibling;
        modal.style.display = "block";
    };
}

function deleteBook(e) {
    return function(e) {
        e.preventDefault();
        book.forEach(b => {
            if (b.id == e.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('book-id')) {
                book.splice(book.indexOf(b), 1);
            }
        });
        localStorage.setItem('book', JSON.stringify(book));
        document.getElementById('incompleteBookshelfList').innerHTML = '';
        document.getElementById('completeBookshelfList').innerHTML = '';
        window.location.reload();
        displayBook(book);
    };
}

function toggleCompleteMark(e) {
    return function(e) {
        e.preventDefault();
        book.forEach(b => {
            if (b.id == e.target.parentElement.parentElement.getAttribute('book-id')) {
                b.isComplete = !b.isComplete;
                console.log(b.isComplete);
            }
        });
        localStorage.setItem('book', JSON.stringify(book));
        document.getElementById('incompleteBookshelfList').innerHTML = '';
        document.getElementById('completeBookshelfList').innerHTML = '';
        window.location.reload();
        displayBook(book);
    };
}

function searchBook() {
    return function(e) {
        e.preventDefault();
        compareBook = book.filter(function(item) {
            return item.title.toLowerCase().includes(document.getElementById('searchBookTitle').value.toLowerCase());
        });
        document.getElementById('incompleteBookshelfList').innerHTML = '';
        document.getElementById('completeBookshelfList').innerHTML = '';
        displayBook(compareBook);
    };
}

function displayBook(book) {
    notComplete = book.filter(function(item) {
        return item.isComplete == false;
    });
    notComplete.forEach(e => {
        document.getElementById('incompleteBookshelfList').innerHTML += `
        <article class="book_item" book-id="${e.id}">
            <h3>${e.title}</h3>
            <p>Penulis: ${e.author}</p>
            <p>Tahun: ${e.year}</p>

            <div class="action">
                <button id="markAsCompleted" class="green">Selesai Dibaca</button>
                <button id="deleteBookModal" class="red">Hapus</button>
                <div id="myModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <span class="close">&times;</span>
                        </div>
                        <div class="modal-body">
                            <button id="deleteBook" class="red">Hapus Buku</button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
        `;
    });
    hasComplete = book.filter(function(item) {
        return item.isComplete == true;
    });
    hasComplete.forEach(e => {
        document.getElementById('completeBookshelfList').innerHTML += `
        <article class="book_item" book-id="${e.id}">
            <h3>${e.title}</h3>
            <p>Penulis: ${e.author}</p>
            <p>Tahun: ${e.year}</p>

            <div class="action">
                <button id="markAsNotCompleted" class="green">Belum Selesai Dibaca</button>
                <button id="deleteBookModal" class="red">Hapus</button>
                <div id="myModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <span class="close">&times;</span>
                        </div>
                        <div class="modal-body">
                            <button id="deleteBook" class="red">Hapus Buku</button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
        `;
    });
}

function insertBook() {
    return function(e) {
        e.preventDefault();
        if (Object.keys(book).length == 0) {
            addLast = 1;
        } else {
            addLast = Object.keys(book)[Object.keys(book).length - 1] - -1;
        }
        data = {
            id: new Date().getTime(),
            title: document.getElementById('inputBookTitle').value,
            author: document.getElementById('inputBookAuthor').value,
            year: document.getElementById('inputBookYear').value,
            isComplete: document.getElementById('inputBookIsComplete').checked
        };
        book.push(data);
        localStorage.setItem('book', JSON.stringify(book));
        displayBook(book);
    };
}