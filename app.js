const modal = document.querySelector('dialog')
const openFormBtn = document.querySelector('#open-form-btn')
const closeFormBtn = document.querySelector('#close-form-btn')
const form = document.querySelector('#add-book-form')
const container = document.querySelector('#container')
const clear = document.querySelector('#clear-library')
const errorMessages = document.querySelector('#error-message')
const BookIcon = './img/book-icon.png'
let library = []

class Book {
  constructor (title, author, pages, read, cover) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.id = Math.random().toString(16).slice(2)
    this.cover = cover
  }
}

openFormBtn.addEventListener('click', openModal)
closeFormBtn.addEventListener('click', closeModal)
clear.addEventListener('click', clearLibrary)
form.addEventListener('submit', readBookInfo)

function openModal (e) {
  e.preventDefault()
  modal.showModal()
}

function closeModal (e) {
  e.preventDefault()
  errorMessages.innerHTML = ''
  form.reset()
  modal.close()
}

function validateInput (e, data) {
  let messages = []  
  if (data.title.trim() === ''|| data.title == null) {
    messages.push('Title is required. ')
  }
  if (data.author.trim() === ''|| data.author == null){
    messages.push('Author is required.')
  }
  if(data.img.trim() === ''){
    data.img = BookIcon
  }
  if (messages.length > 0){
    e.preventDefault()
    messages.forEach( (err)=> {
      errorMessages.innerHTML += err + ' '
    })
    return true
  } else {
    return false
  }
}

function readBookInfo (event) {
  const formData = new FormData(this)
  const data = Object.fromEntries(formData)
  errorMessages.innerHTML = ''  
  if(validateInput(event, data)){
    return
  }

  const checkbox = document.querySelector('#form-checkbox')
  const newBook = new Book(data.title, data.author, data.pages, checkbox.checked, data.img)
  library.push(newBook)
  form.reset()
  closeModal(event)
  renderBooks()
}

function showBook (book) {
  container.insertAdjacentElement('beforeend', generateCard(book))
}

function renderBooks () {
  container.innerHTML = ''
  library.forEach((book) => showBook(book))
}

function generateCard (book) {
  const cardContainer = document.createElement('div')
  const bookCard = document.createElement('div')
  const img = document.createElement('img')
  const h2 = document.createElement('h2')
  const author = document.createElement('p')
  const pages = document.createElement('p')
  const checkboxDiv = document.createElement('div')
  const readStatusLabel = document.createElement('label')
  const readStatus = document.createElement('input')
  const deleteButton = document.createElement('button')

  cardContainer.classList.add('card-container')
  bookCard.classList.add('book-card')
  bookCard.id = book.id
  h2.innerHTML = book.title
  img.src = book.cover
  img.alt = 'book icon placeholder'
  author.innerHTML = book.author
  pages.innerHTML = book.pages + ' Pages'
  checkboxDiv.classList = 'checkbox-container'
  readStatusLabel.for = 'read'
  readStatusLabel.innerHTML = 'Readed: '
  readStatus.type = 'checkbox'
  readStatus.checked = book.read
  readStatus.name = 'read-status'
  readStatus.id = book.id
  readStatus.classList.add('card-checkbox')
  deleteButton.innerHTML = 'delete'
  deleteButton.type = 'submit'
  deleteButton.classList.add('delete-book-btn')
  deleteButton.id = book.id
  
  readStatus.addEventListener('change', toggleStatus)
  deleteButton.addEventListener('click', deleteBook)

  checkboxDiv.insertAdjacentElement('beforeend', readStatusLabel)
  checkboxDiv.insertAdjacentElement('beforeend', readStatus)
  bookCard.insertAdjacentElement('beforeend', h2)
  bookCard.insertAdjacentElement('beforeend', img)
  bookCard.insertAdjacentElement('beforeend', author)
  bookCard.insertAdjacentElement('beforeend', pages)
  bookCard.insertAdjacentElement('beforeend', checkboxDiv)
  bookCard.insertAdjacentElement('beforeend', deleteButton)
  cardContainer.insertAdjacentElement('beforeend', bookCard)

  return cardContainer
}

function deleteBook () {
  const child = document.getElementById(this.id).parentElement
  const index = searchBookIndex(this.id)
  container.removeChild(child)
  library.splice(index, 1)
}

function searchBookIndex (id) {
  for (let i = 0; i < library.length; i++) {
    if (library[i].id === id) {
      return i
    }
  }
}

function toggleStatus () {
  const index = searchBookIndex(this.id)
  library[index].read = this.checked
}

function clearLibrary () {
  container.innerHTML = ''
  library = []
}