/*
 * Elektro-Bud - prosta aplikacja magazynowa
 *
 * Zakres funkcjonalny (fragment pracy magazynu):
 *  - wyświetlanie listy produktów w magazynie,
 *  - dodawanie nowego produktu (nazwa, kategoria, ilość, cena),
 *  - edycja produktu (zmiana ilości i ceny),
 *  - usuwanie produktu z listy.
 *
 * Dane przechowywane są tylko w pamięci (tablica), po odświeżeniu strony znikają.
 */

type Product = {
    id: number,
    name: string,
    category: string,
    quantity: number,
    price: number,
}

// --- Elementy strony ---
const nameInput: HTMLInputElement = document.querySelector("#productName")!;
const categoryInput: HTMLInputElement = document.querySelector("#productCategory")!;
const quantityInput: HTMLInputElement = document.querySelector("#productQuantity")!;
const priceInput: HTMLInputElement = document.querySelector("#productPrice")!;
const addButton: HTMLButtonElement = document.querySelector("#productAddButton")!;
const productsContainer: HTMLDivElement = document.querySelector("#productsContainer")!;

// --- Dane ---
let products: Product[] = [
    { id: 1, name: "Przewód YDY 3x2,5", category: "Kable", quantity: 120, price: 4.5 },
    { id: 2, name: "Gniazdko podwójne", category: "Osprzęt", quantity: 35, price: 18.99 },
];
let nextId = 3;

// --- Logika ---
function addProduct(name: string, category: string, quantity: number, price: number) {
    products.push({ id: nextId, name, category, quantity, price });
    nextId++;
}

function editProduct(id: number, quantity: number, price: number) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.quantity = quantity;
        product.price = price;
    }
}

function removeProduct(id: number) {
    products = products.filter(p => p.id !== id);
}

// --- Wyświetlanie ---
function buildList() {
    productsContainer.innerHTML = "";

    if (products.length === 0) {
        productsContainer.textContent = "Brak produktów w magazynie.";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("card", "card-body", "mt-2", "shadow-sm");

        const title = document.createElement("h5");
        title.textContent = product.name;

        const info = document.createElement("p");
        info.classList.add("mb-2");
        info.textContent = `ID: ${product.id} | Kategoria: ${product.category} | Ilość: ${product.quantity} szt. | Cena: ${product.price.toFixed(2)} zł`;

        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-warning", "btn-sm", "me-2");
        editButton.textContent = "Edytuj";
        editButton.addEventListener("click", () => onEditClick(product));

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.textContent = "Usuń";
        deleteButton.addEventListener("click", () => {
            removeProduct(product.id);
            buildList();
        });

        card.appendChild(title);
        card.appendChild(info);
        card.appendChild(editButton);
        card.appendChild(deleteButton);
        productsContainer.appendChild(card);
    });
}

// --- Obsługa zdarzeń ---
function onAddClick() {
    const name = nameInput.value.trim();
    const category = categoryInput.value.trim();
    const quantity = Number(quantityInput.value);
    const price = Number(priceInput.value);

    if (name === "" || quantityInput.value === "" || priceInput.value === "" || quantity < 0 || price < 0) {
        alert("Uzupełnij poprawnie nazwę, ilość i cenę.");
        return;
    }

    addProduct(name, category || "Inne", quantity, price);

    nameInput.value = "";
    categoryInput.value = "";
    quantityInput.value = "";
    priceInput.value = "";
    buildList();
}

function onEditClick(product: Product) {
    const newQuantity = prompt("Nowa ilość:", String(product.quantity));
    const newPrice = prompt("Nowa cena:", String(product.price));
    if (newQuantity === null || newPrice === null) {
        return;
    }

    const quantity = Number(newQuantity);
    const price = Number(newPrice);
    if (isNaN(quantity) || isNaN(price) || quantity < 0 || price < 0) {
        alert("Niepoprawne dane.");
        return;
    }

    editProduct(product.id, quantity, price);
    buildList();
}

addButton.addEventListener("click", onAddClick);
buildList();
