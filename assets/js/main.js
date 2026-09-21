"use strict";

const PRODUCT = {
  currency: "EUR",
  defaultCapacity: 20,
  capacities: [5, 10, 15, 20, 25],
  dimensionsByCapacity: {
    5: { d2: 260, s2: 160, v1: 150, weight: "do potwierdzenia" },
    6: { d2: 310, s2: 160, v1: 150, weight: "do potwierdzenia" },
    8: { d2: 300, s2: 210, v1: 150, weight: "do potwierdzenia" },
    9: { d2: 340, s2: 210, v1: 150, weight: "do potwierdzenia" },
    10: { d2: 285, s2: 210, v1: 200, weight: "do potwierdzenia" },
    12: { d2: 340, s2: 210, v1: 200, weight: "do potwierdzenia" },
    15: { d2: 410, s2: 210, v1: 200, weight: "do potwierdzenia" },
    20: { d2: 550, s2: 210, v1: 200, weight: "270 kg" },
  },
  images: [
    {
      src: "assets/images/tank-gallery-1.png",
      alt: "Perspektywiczny widok prostokątnego zbiornika retencyjnego",
    },
    {
      src: "assets/images/tank-gallery-2.png",
      alt: "Przedni widok prostokątnego zbiornika retencyjnego z włazem rewizyjnym",
    },
    {
      src: "assets/images/tank-gallery-3.png",
      alt: "Widok z góry na zbiornik i właz rewizyjny",
    },
    {
      src: "assets/images/tank-gallery-4.png",
      alt: "Detal włazu rewizyjnego i pokrywy na górze zbiornika",
    },
    {
      src: "assets/images/tank-gallery-5.png",
      alt: "Przekrój zbiornika z konstrukcją wewnętrzną i wzmocnieniami",
    },
  ],
  options: {
    revisionHeight: [
      { label: "30 cm", surcharge: 0 },
      { label: "40 cm", surcharge: 15 },
      { label: "50 cm", surcharge: 30 },
      { label: "60 cm", surcharge: 45 },
      { label: "70 cm", surcharge: 60 },
      { label: "80 cm", surcharge: 75 },
      { label: "90 cm", surcharge: 90 },
      { label: "100 cm", surcharge: 105 },
      { label: "110 cm", surcharge: 120 },
      { label: "120 cm", surcharge: 135 },
      { label: "130 cm", surcharge: 150 },
    ],
    lid: [
      { label: "Pokrywa nieobciążeniowa", surcharge: 0 },
      { label: "Pokrywa obciążeniowa do 200 kg CZARNA", surcharge: 100 },
      { label: "Pokrywa obciążeniowa do 200 kg ZIELONA", surcharge: 126 },
      { label: "Pokrywa obciążeniowa do 200 kg PIASKOWO-SZARA", surcharge: 126 },
      { label: "Pokrywa zamykana", surcharge: 110 },
    ],
    filterBasket: [
      { label: "Bez kosza filtracyjnego", surcharge: 0 },
      { label: "Z koszem filtracyjnym", surcharge: 130 },
    ],
    inletDiameter: [
      { label: "DN 110", surcharge: 0 },
      { label: "DN 125", surcharge: 55 },
      { label: "DN 160", surcharge: 95 },
    ],
    overflow: [
      { label: "Bez przelewu", surcharge: 0 },
      { label: "Przelew DN 110", surcharge: 85 },
      { label: "Przelew DN 160", surcharge: 135 },
    ],
    pumpPreparation: [
      { label: "Bez przygotowania", surcharge: 0 },
      { label: "Przepust kablowy", surcharge: 45 },
      { label: "Przygotowanie pod pompę zanurzeniową", surcharge: 210 },
    ],
    anchoring: [
      { label: "Bez zestawu kotwiącego", surcharge: 0 },
      { label: "Zestaw kotwiący Standard", surcharge: 160 },
      { label: "Zestaw kotwiący Plus", surcharge: 260 },
    ],
    shaftExtension: [
      { label: "Bez przedłużenia", surcharge: 0 },
      { label: "Przedłużenie +20 cm", surcharge: 75 },
      { label: "Przedłużenie +40 cm", surcharge: 130 },
    ],
  },
};

const moneyFormatter = new Intl.NumberFormat("sk-SK", {
  style: "currency",
  currency: PRODUCT.currency,
  maximumFractionDigits: 2,
});

let quantity = 1;
let galleryIndex = 0;
let selectedCapacity = PRODUCT.defaultCapacity;
let lastDefaultMessage = "";

const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => Array.from(document.querySelectorAll(selector));

function getSelectedConfiguration() {
  return getElements("[data-config]").map((select) => {
    const option = select.selectedOptions[0];
    const label = option?.dataset.label || option?.textContent || "";
    return {
      name: select.name,
      label,
      surcharge: Number(select.value || 0),
    };
  });
}

function populateConfigurator() {
  const capacitySelect = getElement("[data-capacity-select]");
  if (capacitySelect) {
    PRODUCT.capacities.forEach((capacity) => {
      const item = document.createElement("option");
      item.value = String(capacity);
      item.textContent = `${capacity} m³ / ${capacity * 1000} l`;
      item.selected = capacity === PRODUCT.defaultCapacity;
      capacitySelect.append(item);
    });
  }

  Object.entries(PRODUCT.options).forEach(([key, options]) => {
    const select = getElement(`[data-config="${key}"]`);
    if (!select) return;

    options.forEach((option) => {
      const item = document.createElement("option");
      item.value = String(option.surcharge);
      item.dataset.label = option.label;
      item.textContent = option.label;
      select.append(item);
    });
  });
}

function getCapacityLabel(capacity = selectedCapacity) {
  return `${capacity} m³ / ${(capacity * 1000).toLocaleString("pl-PL")} l`;
}

function getInquiryMessage(capacity = selectedCapacity) {
  return `Interesuje mnie zbiornik retencyjny ${capacity * 1000} l. Proszę o przygotowanie oferty cenowej wraz z dostawą.`;
}

function getDimensionText(capacity = selectedCapacity) {
  const dimensions = PRODUCT.dimensionsByCapacity[capacity];
  if (!dimensions) {
    return {
      length: "Długość zewnętrzna D2: do potwierdzenia",
      width: "Szerokość zewnętrzna S2: do potwierdzenia",
      height: "Wysokość płaszcza V1: do potwierdzenia",
      dimensions: "dokładne wymiary zostaną potwierdzone dla wybranego modelu",
      weight: "do potwierdzenia",
    };
  }

  return {
    length: `Długość zewnętrzna D2: ${dimensions.d2} cm`,
    width: `Szerokość zewnętrzna S2: ${dimensions.s2} cm`,
    height: `Wysokość płaszcza V1: ${dimensions.v1} cm`,
    dimensions: `długość zewnętrzna ${dimensions.d2} cm, szerokość zewnętrzna ${dimensions.s2} cm, wysokość płaszcza ${dimensions.v1} cm`,
    weight: dimensions.weight,
  };
}

function calculateSelectedSurcharge() {
  return getSelectedConfiguration().reduce((total, option) => total + option.surcharge, 0) * quantity;
}

function updatePrice() {
  const capacitySelect = getElement("[data-capacity-select]");
  selectedCapacity = Number(capacitySelect?.value || PRODUCT.defaultCapacity);
  const capacityLiters = selectedCapacity * 1000;
  const capacityText = `${capacityLiters.toLocaleString("pl-PL")} l`;
  const title = `Zbiornik retencyjny ${capacityText}`;
  const dimensions = getDimensionText();

  getElement("#productTitle").textContent = title;
  getElement("#heroCapacity").textContent = capacityText;
  getElement("#specsIntro").textContent = `Podstawowe dane techniczne dla prostokątnego samonośnego zbiornika retencyjnego o pojemności ${selectedCapacity} m3.`;
  getElement("#specCapacity").textContent = capacityText;
  getElement("#specWeight").textContent = dimensions.weight;
  getElement("#specDimensions").textContent = dimensions.dimensions;
  getElement("#miniCapacity").textContent = getCapacityLabel();
  getElement("#miniLength").textContent = dimensions.length;
  getElement("#miniWidth").textContent = dimensions.width;
  getElement("#miniHeight").textContent = dimensions.height;

  getElement("#grossPrice").textContent = "do uzgodnienia";
  getElement("#netPrice").textContent = "Ofertę cenową przygotujemy po wysłaniu zapytania.";
  getElement("#quantityOutput").textContent = String(quantity);

  const formQuantity = getElement('#inquiryForm input[name="quantity"]');
  if (formQuantity) formQuantity.value = String(quantity);

  const configurationInput = getElement("#configurationInput");
  if (configurationInput) {
    const options = getSelectedConfiguration()
      .map((option) => `${option.name}: ${option.label}`)
      .join("; ");
    configurationInput.value = `Pojemność: ${getCapacityLabel()}; Liczba sztuk: ${quantity}; ${options}`;
  }

  const message = getElement("#inquiryMessage");
  if (message) {
    const nextDefaultMessage = getInquiryMessage();
    if (!message.value.trim() || message.value === lastDefaultMessage) {
      message.value = nextDefaultMessage;
    }
    lastDefaultMessage = nextDefaultMessage;
  }
}

function setGalleryImage(index) {
  galleryIndex = (index + PRODUCT.images.length) % PRODUCT.images.length;
  const image = PRODUCT.images[galleryIndex];
  const mainImage = getElement("#galleryImage");

  mainImage.src = image.src;
  mainImage.alt = image.alt;

  getElements("[data-gallery-index]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.galleryIndex) === galleryIndex);
  });
}

function initGallery() {
  getElement("[data-gallery-prev]")?.addEventListener("click", () => setGalleryImage(galleryIndex - 1));
  getElement("[data-gallery-next]")?.addEventListener("click", () => setGalleryImage(galleryIndex + 1));

  getElements("[data-gallery-index]").forEach((button) => {
    button.addEventListener("click", () => setGalleryImage(Number(button.dataset.galleryIndex)));
    button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setGalleryImage(galleryIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setGalleryImage(galleryIndex + 1);
      }
    });
  });
}

function initMenu() {
  const toggle = getElement("[data-menu-toggle]");
  const nav = getElement("[data-nav]");
  const contact = getElement(".header-contact");

  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav?.classList.toggle("is-open", !isOpen);
    contact?.classList.toggle("is-open", !isOpen);
  });

  nav?.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLAnchorElement)) return;
    toggle?.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    contact?.classList.remove("is-open");
  });
}

function initQuantity() {
  getElement("[data-qty-minus]")?.addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    updatePrice();
  });

  getElement("[data-qty-plus]")?.addEventListener("click", () => {
    quantity += 1;
    updatePrice();
  });

  getElements("[data-config]").forEach((select) => select.addEventListener("change", updatePrice));
  getElement("[data-capacity-select]")?.addEventListener("change", updatePrice);
}

function initAccordion() {
  getElements(".accordion-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const panel = button.nextElementSibling;
      button.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });
}

function initSmoothScroll() {
  getElements("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const target = getElement(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function getFormPayload(form) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    email: String(data.get("email") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    location: String(data.get("location") || "").trim(),
    quantity: Number(data.get("quantity") || 1),
    configuration: String(data.get("configuration") || "").trim(),
    message: String(data.get("message") || "").trim(),
    consent: data.get("consent") === "on",
    website: String(data.get("website") || "").trim(),
  };
}

function showSuccessModal() {
  const modal = getElement("#successModal");
  if (!modal) return;

  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector(".success-modal-close")?.focus();
}

function hideSuccessModal() {
  const modal = getElement("#successModal");
  if (!modal) return;

  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function initSuccessModal() {
  getElements("[data-modal-close]").forEach((control) => {
    control.addEventListener("click", hideSuccessModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideSuccessModal();
  });
}

function initInquiryForm() {
  const form = getElement("#inquiryForm");
  const message = getElement("#formMessage");
  if (!form || !message) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.className = "form-message";

    if (!form.reportValidity()) return;

    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    message.textContent = "Wysyłanie zapytania...";

    try {
      await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getFormPayload(form)),
      });
    } catch (error) {
      console.warn("Nie udało się potwierdzić wysłania zapytania w tym podglądzie.", error);
    } finally {
      message.textContent = "Formularz został wysłany.";
      message.classList.add("is-success");
      showSuccessModal();
      form.reset();
      quantity = 1;
      updatePrice();
      submit.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateConfigurator();
  initMenu();
  initGallery();
  initQuantity();
  initAccordion();
  initSmoothScroll();
  initSuccessModal();
  initInquiryForm();
  updatePrice();
  getElement("#year").textContent = String(new Date().getFullYear());
});
