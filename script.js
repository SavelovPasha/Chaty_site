const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".price-card");
const serviceCards = document.querySelectorAll(".service-card[data-target-filter]");
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const pageSections = Array.from(document.querySelectorAll("main section[id]"));
const searchInput = document.querySelector("#priceSearch");
const actionMenus = document.querySelectorAll(".header-menu, .action-menu");
const orderForm = document.querySelector("#orderForm");
const mobileSticky = document.querySelector(".mobile-sticky");
const contactSection = document.querySelector(".contact-section");
const priceSection = document.querySelector(".price-section");
const orderName = document.querySelector("#orderName");
const orderPhone = document.querySelector("#orderPhone");
const orderService = document.querySelector("#orderService");
const orderDetails = document.querySelector("#orderDetails");
const orderTime = document.querySelector("#orderTime");
const orderMessageInput = document.querySelector("#orderMessageInput");
const orderRedirect = document.querySelector("#orderRedirect");
const copyStatus = document.querySelector("#copyStatus");
const priceFilterStatus = document.querySelector("#priceFilterStatus");
const priceEmptyMessage = document.querySelector("#priceEmptyMessage");
const serviceChoiceButtons = document.querySelectorAll("[data-service-choice]");

let activeFilter = "all";

function syncPriceTableLabels() {
  document.querySelectorAll(".price-table").forEach((table) => {
    const labels = Array.from(table.querySelectorAll("thead th")).map((cell) =>
      cell.textContent.trim()
    );

    table.querySelectorAll("tbody tr").forEach((row) => {
      row.querySelectorAll("td").forEach((cell, index) => {
        if (labels[index]) {
          cell.dataset.label = labels[index];
        }
      });
    });
  });
}

const filterLabels = {
  all: "все разделы прайса",
  photo: "раздел «Печать фото»",
  docs: "раздел «Фото на документы»",
  digital: "раздел «Оцифровка»",
  scan: "раздел «Сканирование»",
  print: "раздел «Ксерокопии и распечатка»",
  binding: "раздел «Брошюровка»",
  lamination: "раздел «Ламинирование»",
  paper: "раздел «Плотная бумага»",
  sticker: "раздел «Самоклеющаяся бумага»",
  gifts: "раздел «Сувенирная печать»",
};

syncPriceTableLabels();

function updateMobileStickyVisibility() {
  if (!mobileSticky) {
    return;
  }

  const reachedContacts =
    contactSection &&
    contactSection.getBoundingClientRect().top <= window.innerHeight - 120;
  const priceRect = priceSection && priceSection.getBoundingClientRect();
  const viewingPrices =
    priceRect && priceRect.top < window.innerHeight - 80 && priceRect.bottom > 120;
  document.body.classList.toggle("hide-mobile-sticky", Boolean(viewingPrices));
  const shouldShow =
    window.innerWidth <= 760 && window.scrollY > 260 && !reachedContacts && !viewingPrices;
  mobileSticky.classList.toggle("is-visible", shouldShow);
}

function closeActionMenu(menu, { restoreFocus = false } = {}) {
  menu.classList.remove("open");
  const toggle = menu.querySelector(".header-menu-toggle, .action-menu-toggle");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) {
      toggle.focus();
    }
  }
}

function getActionMenuItems(menu) {
  return Array.from(
    menu.querySelectorAll(".header-menu-dropdown a, .action-menu-dropdown a")
  );
}

function openActionMenu(menu, { focusItem = false, focusLast = false } = {}) {
  const toggle = menu.querySelector(".header-menu-toggle, .action-menu-toggle");
  if (!toggle) {
    return;
  }

  actionMenus.forEach((otherMenu) => {
    if (otherMenu !== menu) {
      closeActionMenu(otherMenu);
    }
  });

  menu.classList.add("open");
  toggle.setAttribute("aria-expanded", "true");

  if (focusItem) {
    const items = getActionMenuItems(menu);
    const targetItem = focusLast ? items.at(-1) : items[0];
    targetItem?.focus();
  }
}

function moveActionMenuFocus(menu, currentItem, direction) {
  const items = getActionMenuItems(menu);
  if (!items.length) {
    return;
  }

  const currentIndex = Math.max(items.indexOf(currentItem), 0);
  const nextIndex = (currentIndex + direction + items.length) % items.length;
  items[nextIndex].focus();
}

actionMenus.forEach((menu) => {
  const toggle = menu.querySelector(".header-menu-toggle, .action-menu-toggle");
  const dropdown = menu.querySelector(".header-menu-dropdown, .action-menu-dropdown");
  const links = getActionMenuItems(menu);

  if (!toggle) {
    return;
  }

  if (dropdown) {
    if (!dropdown.id) {
      dropdown.id = `action-menu-${Math.random().toString(36).slice(2, 10)}`;
    }
    toggle.setAttribute("aria-controls", dropdown.id);
    toggle.setAttribute("aria-haspopup", "menu");
  }

  toggle.addEventListener("click", () => {
    if (menu.classList.contains("open")) {
      closeActionMenu(menu);
      return;
    }

    openActionMenu(menu);
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      closeActionMenu(menu);
    });

    link.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActionMenuFocus(menu, link, 1);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActionMenuFocus(menu, link, -1);
      }

      if (event.key === "Home") {
        event.preventDefault();
        links[0]?.focus();
      }

      if (event.key === "End") {
        event.preventDefault();
        links.at(-1)?.focus();
      }

      if (event.key === "Tab" && !event.shiftKey && link === links.at(-1)) {
        closeActionMenu(menu);
      }

      if (event.key === "Tab" && event.shiftKey && link === links[0]) {
        closeActionMenu(menu);
      }
    });
  });

  toggle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openActionMenu(menu, { focusItem: true });
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openActionMenu(menu, { focusItem: true, focusLast: true });
    }
  });
});

document.addEventListener("click", (event) => {
  actionMenus.forEach((menu) => {
    if (!menu.contains(event.target)) {
      closeActionMenu(menu);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    actionMenus.forEach((menu) => {
      if (menu.classList.contains("open")) {
        closeActionMenu(menu, { restoreFocus: true });
      }
    });
  }
});

updateMobileStickyVisibility();
window.addEventListener("scroll", updateMobileStickyVisibility, { passive: true });
window.addEventListener("resize", updateMobileStickyVisibility);

function formatPhoneValue(value) {
  const digits = value.replace(/\D/g, "");
  let normalized = digits;

  if (!normalized.length) {
    return "+7 ";
  }

  if (normalized.startsWith("8")) {
    normalized = "7" + normalized.slice(1);
  } else if (!normalized.startsWith("7")) {
    normalized = "7" + normalized;
  }

  normalized = normalized.slice(0, 11);
  const local = normalized.slice(1);

  let result = "+7";

  if (local.length > 0) {
    result += " " + local.slice(0, 3);
  }
  if (local.length >= 4) {
    result += " " + local.slice(3, 6);
  }
  if (local.length >= 7) {
    result += "-" + local.slice(6, 8);
  }
  if (local.length >= 9) {
    result += "-" + local.slice(8, 10);
  }

  return result;
}

function getNormalizedPhoneDigits(value) {
  const digits = value.replace(/\D/g, "");

  if (!digits.length) {
    return "";
  }

  if (digits.startsWith("8")) {
    return ("7" + digits.slice(1)).slice(0, 11);
  }

  if (digits.startsWith("7")) {
    return digits.slice(0, 11);
  }

  return ("7" + digits).slice(0, 11);
}

function isPhoneComplete(value) {
  return getNormalizedPhoneDigits(value).length === 11;
}

function setFieldValidityState(field, isValid) {
  if (!field) {
    return;
  }

  field.setAttribute("aria-invalid", String(!isValid));
}

function validateOrderForm() {
  const hasName = Boolean(orderName.value.trim());
  const hasPhone = isPhoneComplete(orderPhone.value);

  setFieldValidityState(orderName, hasName);
  setFieldValidityState(orderPhone, hasPhone);

  if (!hasName && !hasPhone) {
    return "Заполните имя и телефон, чтобы оставить заявку.";
  }

  if (!hasName) {
    return "Укажите имя, чтобы мы знали, как к вам обращаться.";
  }

  if (!hasPhone) {
    return "Введите полный номер телефона в формате +7 999 123-45-67.";
  }

  return "";
}

function setPriceFilter(filter) {
  activeFilter = filter;
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.filter === activeFilter);
    tab.setAttribute("aria-pressed", String(tab.dataset.filter === activeFilter));
  });
  if (priceFilterStatus) {
    priceFilterStatus.textContent =
      activeFilter === "all"
        ? "Показаны все разделы прайса."
        : `Показаны цены по выбранной услуге: ${filterLabels[activeFilter] || "выбранный раздел"}.`;
  }
  applyFilters();
}

function updateCurrentNavSection() {
  if (!navLinks.length || !pageSections.length) {
    return;
  }

  const checkpoint = window.innerHeight * 0.28;
  let currentSectionId = "";

  pageSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= checkpoint && rect.bottom > checkpoint) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${currentSectionId}`;
    link.setAttribute("aria-current", isCurrent ? "location" : "false");
  });
}

function selectOrderService(serviceName) {
  if (!serviceName || !orderService) {
    return;
  }

  const option = Array.from(orderService.options).find((item) => item.value === serviceName);
  if (!option) {
    return;
  }

  orderService.value = serviceName;
  syncServiceChoiceButtons();
  updateOrderMessage();
}

function syncServiceChoiceButtons() {
  serviceChoiceButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.serviceChoice === orderService.value);
  });
}

function normalize(value) {
  return value.toLowerCase().replaceAll("ё", "е").trim();
}

function applyFilters() {
  const query = normalize(searchInput.value);
  let visibleCount = 0;

  cards.forEach((card) => {
    const categories = card.dataset.category.split(/\s+/);
    const categoryMatch = activeFilter === "all" || categories.includes(activeFilter);
    const textMatch = normalize(card.textContent).includes(query);
    const isHidden = !categoryMatch || !textMatch;
    card.classList.toggle("hidden", isHidden);
    if (!isHidden) {
      visibleCount += 1;
    }
  });

  if (priceEmptyMessage) {
    priceEmptyMessage.classList.toggle("is-visible", visibleCount === 0);
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setPriceFilter(tab.dataset.filter);
  });
});

searchInput.addEventListener("input", applyFilters);

if (orderRedirect) {
  orderRedirect.value = new URL("thanks.html", window.location.href).href;
}

orderPhone.addEventListener("focus", () => {
  if (!orderPhone.value.trim()) {
    orderPhone.value = "+7 ";
  }
});

orderPhone.addEventListener("input", () => {
  orderPhone.value = formatPhoneValue(orderPhone.value);
  setFieldValidityState(orderPhone, isPhoneComplete(orderPhone.value));
  updateOrderMessage();
});

orderPhone.addEventListener("blur", () => {
  if (orderPhone.value.trim() === "+7") {
    orderPhone.value = "";
  }

  setFieldValidityState(orderPhone, !orderPhone.value.trim() || isPhoneComplete(orderPhone.value));
  updateOrderMessage();
});

serviceCards.forEach((card) => {
  card.addEventListener("click", () => {
    const filter = card.dataset.targetFilter || "all";
    setPriceFilter(filter);
    selectOrderService(card.dataset.orderService);
    document.querySelector("#prices").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

serviceChoiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectOrderService(button.dataset.serviceChoice);
  });
});

function buildOrderMessage() {
  const name = orderName.value.trim() || "не указано";
  const phone = orderPhone.value.trim() || "не указан";
  const service = orderService.value;
  const details = orderDetails.value.trim() || "уточню в сообщениях";
  const time = orderTime.value.trim() || "уточню в сообщениях";

  return `Здравствуйте! Хочу оставить заявку. Имя: ${name}. Телефон: ${phone}. Услуга: ${service}. Детали: ${details}. Забрать удобно: ${time}.`;
}

function updateOrderMessage(clearStatus = true) {
  const message = buildOrderMessage();
  orderMessageInput.value = message;
  if (clearStatus) {
    copyStatus.textContent = "";
  }
}

[orderName, orderDetails, orderTime].forEach((field) => {
  field.addEventListener("input", updateOrderMessage);
});

orderName.addEventListener("input", () => {
  setFieldValidityState(orderName, Boolean(orderName.value.trim()));
});

orderService.addEventListener("input", () => {
  syncServiceChoiceButtons();
  updateOrderMessage();
});

syncServiceChoiceButtons();
setPriceFilter(activeFilter);
updateCurrentNavSection();
window.addEventListener("scroll", updateCurrentNavSection, { passive: true });
window.addEventListener("resize", updateCurrentNavSection);

function saveLead() {
  const leads = JSON.parse(localStorage.getItem("fotochkaLeads") || "[]");
  const lead = {
    name: orderName.value.trim(),
    phone: orderPhone.value.trim(),
    service: orderService.value,
    details: orderDetails.value.trim(),
    pickupTime: orderTime.value.trim(),
    createdAt: new Date().toISOString(),
  };

  leads.unshift(lead);
  localStorage.setItem("fotochkaLeads", JSON.stringify(leads.slice(0, 30)));
}

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  copyStatus.classList.remove("error");
  const validationMessage = validateOrderForm();

  if (validationMessage) {
    copyStatus.classList.add("error");
    copyStatus.textContent = validationMessage;
    if (!orderName.value.trim()) {
      orderName.focus();
    } else if (!isPhoneComplete(orderPhone.value)) {
      orderPhone.focus();
    }
    return;
  }

  saveLead();
  updateOrderMessage();
  HTMLFormElement.prototype.submit.call(orderForm);
});