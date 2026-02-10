const itemForm = document.getElementById("itemForm");
const itemList = document.getElementById("itemList");
const itemName = document.getElementById("itemName");
const itemPrice = document.getElementById("itemPrice");
const ticketBody = document.getElementById("ticketBody");
const ticketTotal = document.getElementById("ticketTotal");
const ticketDate = document.getElementById("ticketDate");
const storeName = document.getElementById("storeName");
const storeAddress = document.getElementById("storeAddress");
const storePhone = document.getElementById("storePhone");
const ticketStore = document.getElementById("ticketStore");
const ticketAddress = document.getElementById("ticketAddress");
const ticketPhone = document.getElementById("ticketPhone");
const printTicket = document.getElementById("printTicket");

const storageKey = "thermal-ticket-items";
const storeKey = "thermal-ticket-store";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value);

const readItems = () => {
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : [];
};

const saveItems = (items) => {
  localStorage.setItem(storageKey, JSON.stringify(items));
};

const readStore = () => {
  const saved = localStorage.getItem(storeKey);
  return saved
    ? JSON.parse(saved)
    : {
        name: "Mi negocio",
        address: "Calle 123",
        phone: "+52 555 555 555",
      };
};

const saveStore = (store) => {
  localStorage.setItem(storeKey, JSON.stringify(store));
};

const updateDate = () => {
  const now = new Date();
  ticketDate.textContent = now.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const state = {
  items: readItems(),
  store: readStore(),
};

const renderTicket = (items) => {
  ticketBody.innerHTML = "";
  let total = 0;
  items.forEach((item) => {
    total += item.price;
    const row = document.createElement("div");
    row.className = "ticket__row";

    const name = document.createElement("span");
    name.textContent = item.name;

    const price = document.createElement("span");
    price.textContent = formatCurrency(item.price);

    row.append(name, price);
    ticketBody.appendChild(row);
  });
  ticketTotal.textContent = formatCurrency(total);
};

const renderItems = (items) => {
  itemList.innerHTML = "";
  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = item.name;
    nameInput.dataset.index = String(index);
    nameInput.dataset.field = "name";

    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.step = "0.01";
    priceInput.value = String(item.price);
    priceInput.dataset.index = String(index);
    priceInput.dataset.field = "price";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.dataset.action = "remove";
    removeButton.dataset.index = String(index);
    removeButton.textContent = "Eliminar";

    row.append(nameInput, priceInput, removeButton);
    itemList.appendChild(row);
  });
};

const updateStoreFields = (store) => {
  storeName.value = store.name;
  storeAddress.value = store.address;
  storePhone.value = store.phone;
  ticketStore.textContent = store.name;
  ticketAddress.textContent = store.address;
  ticketPhone.textContent = store.phone;
};

const updateTicketStore = (store) => {
  ticketStore.textContent = store.name;
  ticketAddress.textContent = store.address;
  ticketPhone.textContent = store.phone;
};

const syncStore = () => {
  const store = {
    name: storeName.value.trim() || "Mi negocio",
    address: storeAddress.value.trim() || "Calle 123",
    phone: storePhone.value.trim() || "+52 555 555 555",
  };
  state.store = store;
  updateTicketStore(store);
  saveStore(store);
};

itemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = itemName.value.trim();
  const priceValue = parseFloat(itemPrice.value);
  if (!name || Number.isNaN(priceValue)) {
    return;
  }
  state.items.push({ name, price: priceValue });
  saveItems(state.items);
  renderItems(state.items);
  renderTicket(state.items);
  itemForm.reset();
  itemName.focus();
});

itemList.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  const index = Number(target.dataset.index);
  const field = target.dataset.field;
  if (!state.items[index]) {
    return;
  }
  if (field === "price") {
    const priceValue = parseFloat(target.value);
    state.items[index][field] = Number.isNaN(priceValue) ? 0 : priceValue;
  } else {
    state.items[index][field] = target.value;
  }
  saveItems(state.items);
  renderTicket(state.items);
});

itemList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }
  if (target.dataset.action !== "remove") {
    return;
  }
  const index = Number(target.dataset.index);
  state.items.splice(index, 1);
  saveItems(state.items);
  renderItems(state.items);
  renderTicket(state.items);
});

[storeName, storeAddress, storePhone].forEach((input) => {
  input.addEventListener("input", syncStore);
});

printTicket.addEventListener("click", () => {
  updateDate();
  window.print();
});

window.addEventListener("beforeprint", updateDate);

const init = () => {
  updateDate();
  renderItems(state.items);
  renderTicket(state.items);
  updateStoreFields(state.store);
};

init();
