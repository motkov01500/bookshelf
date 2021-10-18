class Book
{	
	constructor(title,author,isbn)
	{
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}


class Store
{
	static getBooks()
	{
		let books;
		if(localStorage.getItem('books') ===  null)
		{
			books = [];
		}else
		{
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}
	
	static addBook(book)
	{
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books',JSON.stringify(books));
	}
	
	static removeBook(isbn)
	{
		const books = Store.getBooks();
		books.forEach((book,index)=>
		{
			if(books.isbn === isbn)
			{
				books.splice(index,1);
			}
		});
		localStorage.setItem('books',JSON.stringify(books));
	}
}


class UI
{
	static displayBooks()
	{
		const books = Store.getBooks();
		
		books.forEach((book)=> UI.addBookToList(book));
	}
	
	static addBookToList(book)
	{
		const list = document.querySelector('#book-list');
		
		const row = document.createElement('tr');
		
		row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class = 'btn btn-danger btn-sm delete'>X</a></td>
		`;
		
		list.appendChild(row);
	}
	
	static deleteBook(el){
		if(el.classList.contains('delete'))
		{
			el.parentElement.parentElement.remove();
		}
	}
	
	static showAlert(message,className)
	{
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		
		const container = document.querySelector('.container');
		const forma = document.querySelector('#book-form');
		container.insertBefore(div,forma);
		setTimeout(()=>document.querySelector('.alert').remove(),2000);
	}
	
	static clearFields()
	{
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}
}

document.addEventListener('DOMContentLoaded',UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit',(e)=>
{
	e.preventDefault();
	
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;
	
	if(title === '' || author === '' || isbn === '')
	{
		UI.showAlert('Please fill all blank inputs','danger');
	}else{
		const book = new Book(title,author,isbn);
		
		UI.addBookToList(book);
		
		Store.addBook(book);
		
		UI.showAlert('Book added','success');
		
		UI.clearFields();
	}
});

document.querySelector('#book-list').addEventListener('click',(e)=>{
	const isbn = document.getElementById('isbnn');
	UI.deleteBook(e.target);
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
	UI.showAlert('Book removed','success');
});