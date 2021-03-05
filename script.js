const input = document.querySelector("input");
const appContainer = document.querySelector(".app-container");
const toolsBar = document.querySelector(".tools");
const checkBtn = document.querySelector(".fa-check");
const editBtn = document.querySelector(".fa-wrench");
const deleteBtn = document.querySelector(".fa-trash-alt");

let editElement;
let editFlag = false;
let editID = "";

const list = document.createElement("ol");
list.classList.add("list");
appContainer.append(list);

const placeElement = (element) => {
	let listHeight = list.offsetHeight;
	if (listHeight / 2 < 48) {
		listHeight = `48px`;
		element.style.top = listHeight;
	} else {
		element.style.top = `${listHeight / 2}px`;
	}
};

const handleModalVisibility = () => {
	const modal = document.querySelector(".modal");
	const closeModalBtn = document.querySelector(".close-modal-btn");
	const backdrop = document.querySelector(".backdrop");

	modal.classList.add("show");
	backdrop.classList.add("show");

	const closeModalAndBackdrop = () => {
		modal.classList.remove("show");
		backdrop.classList.remove("show");
	};
	closeModalBtn.addEventListener("click", () => {
		closeModalAndBackdrop();
	});
	backdrop.addEventListener("click", () => {
		closeModalAndBackdrop();
	});
};

const clearSelectedElement = () => {
	const listItems = document.querySelectorAll(".list-item");
	listItems.forEach((item) => {
		item.classList.remove("current", "edit-mode");
	});
	toolsBar.classList.remove("visible");
};

const createListItem = (id, value, completed = false) => {
	clearSelectedElement();
	const listItem = document.createElement("li");
	let attr = document.createAttribute("data-id");
	attr.value = id;
	listItem.setAttributeNode(attr);
	listItem.textContent = value;
	listItem.classList.add("list-item");
	listItem.addEventListener("click", handleEditMode);

	if (completed === true) {
		listItem.classList.add("completed");
	}

	list.append(listItem);
};

const addListItem = () => {
	const id = new Date().getTime().toString();
	const inputValue = input.value.trim();

	if (inputValue && !editFlag) {
		createListItem(id, inputValue);
		saveLocalToDos(id, inputValue);
	} else if (inputValue && editFlag) {
		editFlag = false;
		editElement.innerHTML = inputValue;
		editElement.classList.remove("edit-mode");
		toolsBar.classList.remove("visible");
		editLocalToDos(editID, inputValue);
	} else {
		handleModalVisibility();
	}
	input.value = "";
};

const handleEditMode = (e) => {
	const listItems = document.querySelectorAll(".list-item");
	const currentListItem = e.target;

	listItems.forEach((item) => {
		if (item !== currentListItem) {
			item.classList.remove("current", "edit-mode");
		}
	});

	toolsBar.classList.add("visible");
	currentListItem.classList.add("current", "edit-mode");

	placeElement(toolsBar);
};

const handleEdit = () => {
	editElement = document.querySelector(".current");
	input.value = editElement.innerHTML;
	editFlag = true;
};

const handleCompletedItem = (id) => {
	const currentListItem = document.querySelector(".current");
	let items = getLocalToDos();
	id = currentListItem.dataset.id;
	items.forEach((item) => {
		if (item.id === id) {
			item.completed = !item.completed;
		}
	});

	localStorage.setItem("toDos", JSON.stringify(items));

	currentListItem.classList.toggle("completed");
	toolsBar.classList.remove("visible");
	currentListItem.classList.remove("edit-mode");
};

const handleDelete = () => {
	const currentListItem = document.querySelector(".current");
	const id = currentListItem.dataset.id;

	currentListItem.remove();
	toolsBar.classList.remove("visible");
	removeLocalToDos(id);
};

const getLocalToDos = () => {
	return localStorage.getItem("toDos")
		? JSON.parse(localStorage.getItem("toDos"))
		: [];
};

const setupToDos = () => {
	let items = getLocalToDos();
	if (items.length > 0) {
		items.forEach((item) => {
			createListItem(item.id, item.value, item.completed);
		});
	}
};

const saveLocalToDos = (id, value) => {
	const todo = { id, value, completed: false };
	let items = getLocalToDos();
	items.push(todo);
	localStorage.setItem("toDos", JSON.stringify(items));
};

const editLocalToDos = (id, value) => {
	let items = getLocalToDos();
	items = items.map((item) => {
		if (item.id === id) {
			item.value = value;
		}
		return item;
	});
	localStorage.setItem("toDos", JSON.stringify(items));
};

const removeLocalToDos = (id) => {
	let items = getLocalToDos();
	items = items.filter((item) => {
		if (item.id !== id) {
			return item;
		}
	});
	localStorage.setItem("toDos", JSON.stringify(items));
};

window.addEventListener("DOMContentLoaded", setupToDos);
input.addEventListener("change", addListItem);
checkBtn.addEventListener("click", handleCompletedItem);
editBtn.addEventListener("click", handleEdit);
deleteBtn.addEventListener("click", handleDelete);
