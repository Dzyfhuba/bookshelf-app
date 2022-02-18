if (typeof(Storage) !== 'undefined') {
    if (localStorage.getItem('book') == null) {
        console.log('No book found');
        localStorage.setItem('book', '[]');
    }
    book = JSON.parse(localStorage.getItem('book'));

    displayBook(book);

    document.getElementById('searchBook').addEventListener('submit', function(e) {
        e.preventDefault();
        compareBook = book.filter(function(item) {
            return item.title.toLowerCase().includes(document.getElementById('searchBookTitle').value.toLowerCase());
        });
        document.getElementById('incompleteBookshelfList').innerHTML = '';
        displayBook(compareBook);
    });

    inputBook = document.getElementById('inputBook');
    inputBook.addEventListener('submit', insertBook());
} else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage")
}

function displayBook(book) {
    notComplete = book.filter(function(item) {
        return item.isComplete == false;
    });
    notComplete.forEach(e => {
        document.getElementById('incompleteBookshelfList').innerHTML += `
        <article class="book_item">
            <h3>${e.title}</h3>
            <p>Penulis: ${e.author}</p>
            <p>Tahun: ${e.year}</p>

            <div class="action">
                <button class="green">Selesai dibaca</button>
                <button class="red">Hapus buku</button>
            </div>
        </article>
        `;
    });
    hasComplete = book.filter(function(item) {
        return item.isComplete == true;
    });
    hasComplete.forEach(e => {
        document.getElementById('completeBookshelfList').innerHTML += `
        <article class="book_item">
            <h3>${e.title}</h3>
            <p>Penulis: ${e.author}</p>
            <p>Tahun: ${e.year}</p>

            <div class="action">
                <button class="green">Selesai dibaca</button>
                <button class="red">Hapus buku</button>
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