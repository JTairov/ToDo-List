(function () {
  let listArray = []
      listName = ''

	function createAppTitle(title) {
		let appTitle = document.createElement('h2')
		appTitle.innerHTML = title
		return appTitle
	}

	function createTodoInputForm() {
		let form = document.createElement('form')
		let input = document.createElement('input')
		let buttonWrapper = document.createElement('div')
		let button = document.createElement('button')

		form.classList.add('input-group', 'mb-3')
		input.classList.add('form-control')
		input.placeholder = 'Внести новое задание'
		buttonWrapper.classList.add('input-group-append')
		button.classList.add('btn', 'btn-primary')
		button.textContent = 'Добавить задание'
    button.disabled = true

    input.addEventListener('input', () => {
      if (input.value) button.disabled = false
      else button.disabled = true
    })


		buttonWrapper.append(button)
		form.append(input)
		form.append(buttonWrapper)

		return {
			form,
			input,
			button,
		}
	}

	function createTodoList() {
		let list =  document.createElement('ul')
		list.classList.add('list-group')
		return list
	}

	function createTodoItem(obj) {
		let item = document.createElement('li')
		let buttonGroup = document.createElement('div')
		let doneBtn = document.createElement('button')
		let deleteBtn = document.createElement('button')

		item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
		item.textContent = obj.name

    if (obj.done) {
      item.classList.add('list-group-item-success')
    }

		buttonGroup.classList.add('btn-group', 'btn-group-sm')
		doneBtn.classList.add('btn', 'btn-success')
		doneBtn.textContent = 'Готово'
		deleteBtn.classList.add('btn', 'btn-danger')
		deleteBtn.textContent = 'Удалить'

    doneBtn.addEventListener('click', () => {
      item.classList.toggle('list-group-item-success')

      for (const listItem of listArray) {
        if (obj.id == listItem.id) listItem.done = !listItem.done
      }

      saveList(listArray, listName)
    })

    deleteBtn.addEventListener('click', () => {
      if (confirm('Вы уверены?')) {
        item.remove()

        for (let index = 0; index < listArray.length; index++) {
          if(listArray[index].id == obj.id) {
            listArray.splice(index, 1)
          }
        }

        saveList(listArray, listName)
      }

    })

		buttonGroup.append(doneBtn)
		buttonGroup.append(deleteBtn)
		item.append(buttonGroup)

		return {
			item,
			doneBtn,
			deleteBtn,
		}
	}

  function getNewId(array) {
    let max = 0
    for(let item of array) {
      if(item.id > max) max = item.id
    }
    return max + 1
  }

  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr))
  }

  function createTodoApp(container, title = 'Список дел', keyName, defArray = []) {
		let todoAppTitle = createAppTitle(title)
		let todoItemForm = createTodoInputForm()
		let todoList = createTodoList()

    listName = keyName
    listArray = defArray

		container.append(todoAppTitle)
		container.append(todoItemForm.form)
		container.append(todoList)

    let localData = localStorage.getItem(listName)
    if (localData !== null && localData !== '') listArray = JSON.parse(localData)
    for (let item of listArray) {
      let todoItem = createTodoItem(item)
      todoList.append(todoItem.item)
    }

		todoItemForm.form.addEventListener('submit', (e) => {
			e.preventDefault()

      let newItem = {
        id: getNewId(listArray),
        name: todoItemForm.input.value,
        done: false,
      }

			if(!todoItemForm.input.value) return
			let todoItem = createTodoItem(newItem)

      listArray.push(newItem)
      saveList(listArray, listName)
      todoList.append(todoItem.item)

			todoItemForm.input.value = ''
      todoItemForm.button.disabled = true
		})
  }
  window.createTodoApp = createTodoApp
})()

