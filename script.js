let currentImages = [];
let currentIndex = 0;
let currentPage = 1;
const itemsPerPage = 20;
let filteredProducts = [];

const products = [];

const models = [
    "iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max",
    "iPhone 12","iPhone 12 Mini","iPhone 12 Pro","iPhone 12 Pro Max",
    "iPhone 13","iPhone 13 Mini","iPhone 13 Pro","iPhone 13 Pro Max",
    "iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max",
    "iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max",
    "iPhone 16","iPhone 16 Plus","iPhone 16 Pro","iPhone 16 Pro Max",
    "iPhone 17","iPhone 17 Air","iPhone 17 Pro","iPhone 17 Pro Max"
];

const defaultImages = [
    "https://horizonplay.fbitsstatic.net/img/p/apple-iphone-16-256gb-tela-super-retina-xdr-6-1-cor-preto-152184/338787-1.jpg?w=670&h=670&v=202503191324",
    "https://http2.mlstatic.com/D_NQ_NP_2X_683735-MLA91746736584_092025-F.webp",
    "https://http2.mlstatic.com/D_NQ_NP_2X_859441-MLA92147489379_092025-F.webp"
];

/* GERAR PRODUTOS */
models.forEach((model) => {
    for (let i = 0; i < 2; i++) {
        const priceBase = 3000 + Math.random() * 7000;

        products.push({
            brand: "Apple",
            model,
            price: Math.floor(priceBase),
            memory: ["64GB", "128GB", "256GB", "512GB"][Math.floor(Math.random() * 4)],
            battery: Math.floor(80 + Math.random() * 20),
            condition: ["novo", "usado", "recondicionado"][Math.floor(Math.random() * 3)],
            images: defaultImages,
            description: `${model} com excelente desempenho, design moderno e ótima bateria.`
        });
    }
});

const container = document.getElementById("products");

/* RENDER */
function render(list) {
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = list.slice(start, start + itemsPerPage);

    container.innerHTML = "";

    paginated.forEach((p) => {
        const realIndex = products.indexOf(p);

        container.innerHTML += `
        <div class="card">
            <img src="${p.images[0]}" onerror="this.src='https://via.placeholder.com/400x400'">
            <h3>${p.brand} ${p.model}</h3>
            <p>${p.memory} • 🔋${p.battery}%</p>
            <span class="badge ${p.condition}">${p.condition}</span>
            <div class="price">R$ ${p.price.toLocaleString("pt-BR")}</div>
            <button onclick="openModal(${realIndex})">Ver detalhes</button>
        </div>`;
    });

    renderPagination(list.length);
}

/* PAGINAÇÃO */
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    if (currentPage > 1) {
        pagination.innerHTML += `<button onclick="changePage(${currentPage - 1})">‹</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
        <button class="${i === currentPage ? "active" : ""}" onclick="changePage(${i})">
            ${i}
        </button>`;
    }

    if (currentPage < totalPages) {
        pagination.innerHTML += `<button onclick="changePage(${currentPage + 1})">›</button>`;
    }
}

function changePage(page) {
    currentPage = page;
    render(filteredProducts);
}

/* FILTRO */
function filter() {
    const search = document.getElementById("search").value.toLowerCase();
    const brand = document.getElementById("brand").value;
    const condition = document.getElementById("condition").value;

    filteredProducts = products.filter(p =>
        p.model.toLowerCase().includes(search) &&
        (!brand || p.brand === brand) &&
        (!condition || p.condition === condition)
    );

    currentPage = 1;
    render(filteredProducts);
}

document.getElementById("search").oninput = filter;
document.getElementById("brand").onchange = filter;
document.getElementById("condition").onchange = filter;

document.getElementById("clearFilters").onclick = () => {
    document.getElementById("search").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("condition").value = "";

    filteredProducts = products;
    currentPage = 1;
    render(filteredProducts);
};

/* MODAL */
const modal = document.getElementById("modal");

function openModal(index) {
    const p = products[index];

    document.getElementById("modalTitle").innerText = `${p.brand} ${p.model}`;
    document.getElementById("modalDesc").innerText = p.description;
    document.getElementById("modalMemory").innerText = `💾 ${p.memory}`;
    document.getElementById("modalBattery").innerText = `🔋 ${p.battery}%`;
    document.getElementById("modalPrice").innerText = `R$ ${p.price.toLocaleString("pt-BR")}`;

    currentImages = p.images;
    currentIndex = 0;

    updateCarousel();

    const message = `Olá, tenho interesse no ${p.model} - R$ ${p.price}`;
    document.getElementById("modalWhatsapp").href =
        `https://wa.me/5599999999999?text=${encodeURIComponent(message)}`;

    modal.classList.remove("hidden");
}

/* CARROSSEL */
function updateCarousel() {
    const img = document.getElementById("carouselImage");
    const left = document.querySelector(".arrow.left");
    const right = document.querySelector(".arrow.right");

    if (!img || currentImages.length === 0) return;

    // controle setas
    if (currentImages.length <= 1) {
        left.style.display = "none";
        right.style.display = "none";
    } else {
        left.style.display = "flex";
        right.style.display = "flex";
    }

    // reset zoom
    img.style.transform = "scale(1)";
    img.style.opacity = 0;

    const newImg = new Image();
    newImg.src = currentImages[currentIndex];

    newImg.onload = () => {
        img.src = newImg.src;
        img.style.opacity = 1;
    };

    newImg.onerror = () => {
        img.src = "https://via.placeholder.com/400x400";
        img.style.opacity = 1;
    };

    updateIndicator();
}

/* INDICADOR */
function updateIndicator() {
    const indicator = document.getElementById("indicator");
    indicator.innerHTML = "";

    currentImages.forEach((_, i) => {
        const dot = document.createElement("span");

        if (i === currentIndex) dot.classList.add("active");

        dot.onclick = () => {
            currentIndex = i;
            updateCarousel();
        };

        indicator.appendChild(dot);
    });
}

/* NAVEGAÇÃO */
function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateCarousel();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateCarousel();
}

/* ZOOM */
function addZoom() {
    const container = document.querySelector(".zoom-container");
    const img = document.getElementById("carouselImage");

    if (!container || !img) return;

    container.onmousemove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        img.style.transform = "scale(1.8)";
    };

    container.onmouseleave = () => {
        img.style.transform = "scale(1)";
    };
}

/* FECHAR MODAL */
document.getElementById("closeModal").onclick = () => {
    modal.classList.add("hidden");
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
};

/* INIT */
filteredProducts = products;
render(products);
addZoom();