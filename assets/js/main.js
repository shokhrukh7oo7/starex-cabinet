document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("langDropdown");
  const btn = dropdown.querySelector(".lang-btn");
  const currentLang = dropdown.querySelector(".lang-current");
  const options = dropdown.querySelectorAll(".lang-option");

  function updateMenuOptions(selectedLang) {
    options.forEach((option) => {
      const val = option.getAttribute("data-value");
      if (val === selectedLang) {
        option.classList.add("hidden", "active");
      } else {
        option.classList.remove("hidden", "active");
      }
    });
  }

  updateMenuOptions(currentLang.textContent.trim());

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle("open");
    btn.setAttribute("aria-expanded", isOpen);
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedValue = option.getAttribute("data-value");

      currentLang.textContent = selectedValue;

      updateMenuOptions(selectedValue);

      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");

      console.log(`Язык изменён на: ${selectedValue}`);
    });
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
});
// =================== SIGN IN TABS =========================
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetTab = btn.getAttribute("data-tab");

    tabBtns.forEach((b) => b.classList.remove("active"));
    tabPanes.forEach((pane) => pane.classList.remove("active"));

    btn.classList.add("active");
    const activePane = document.getElementById(`tab-${targetTab}`);
    if (activePane) {
      activePane.classList.add("active");
    }
  });
});

const togglePassBtns = document.querySelectorAll(".toggle-password");

togglePassBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const wrapper = btn.closest(".password-wrapper");
    if (!wrapper) return;

    const passInput = wrapper.querySelector("input");
    const toggleIcon = btn.querySelector("img");
    if (!passInput || !toggleIcon) return;

    const isPassword = passInput.getAttribute("type") === "password";
    const eyeOpenIcon = "/assets/images/sign-in/eye.svg";
    const eyeClosedIcon = "/assets/images/sign-in/eye-off.svg";

    if (isPassword) {
      passInput.setAttribute("type", "text");
      toggleIcon.setAttribute("src", eyeOpenIcon);
      toggleIcon.setAttribute("alt", "Скрыть пароль");
      btn.setAttribute("aria-label", "Скрыть пароль");
    } else {
      passInput.setAttribute("type", "password");
      toggleIcon.setAttribute("src", eyeClosedIcon);
      toggleIcon.setAttribute("alt", "Показать пароль");
      btn.setAttribute("aria-label", "Показать пароль");
    }
  });
});
// =================== SIGN IN TABS =========================
// =================== SIGN IN INPUT MASK =========================
document.addEventListener("DOMContentLoaded", () => {
  const maskOptions = {
    mask: "+998 (00) 000-00-00",
    lazy: false,
  };

  const isPhoneComplete = (maskInstance) => {
    if (!maskInstance) return false;
    return maskInstance.isComplete || maskInstance.unmaskedValue.length === 9;
  };

  const telInputs = document.querySelectorAll('input[type="tel"]');
  const smsPhoneInput = document.getElementById("sms-phone");
  const smsSubmitBtn = document.getElementById("sms-submit-btn");

  telInputs.forEach((input) => {
    IMask(input, maskOptions);
  });

  if (smsPhoneInput && smsSubmitBtn) {
    const smsMask = IMask(smsPhoneInput, maskOptions);

    const checkSmsForm = () => {
      const isComplete = isPhoneComplete(smsMask);
      smsSubmitBtn.disabled = !isComplete;
    };

    smsMask.on("accept", checkSmsForm);
    smsPhoneInput.addEventListener("input", checkSmsForm);
    smsPhoneInput.addEventListener("keyup", checkSmsForm);

    checkSmsForm();
  }

  const passPhoneInput = document.getElementById("pass-phone");
  const passPasswordInput = document.getElementById("pass-password");
  const loginSubmitBtn = document.getElementById("login-submit-btn");

  if (passPhoneInput && passPasswordInput && loginSubmitBtn) {
    const passMask = IMask(passPhoneInput, maskOptions);

    const checkLoginForm = () => {
      const isPhoneValid = isPhoneComplete(passMask);
      const isPasswordFilled = passPasswordInput.value.trim().length > 0;

      loginSubmitBtn.disabled = !(isPhoneValid && isPasswordFilled);
    };

    passMask.on("accept", checkLoginForm);
    passPhoneInput.addEventListener("input", checkLoginForm);
    passPhoneInput.addEventListener("keyup", checkLoginForm);

    passPasswordInput.addEventListener("input", checkLoginForm);
    passPasswordInput.addEventListener("keyup", checkLoginForm);

    checkLoginForm();
  }
});
// =================== SIGN IN OTP =========================
document.addEventListener("DOMContentLoaded", () => {
  const phoneForm = document.getElementById("sms-phone-form");
  const otpForm = document.getElementById("otp-form");
  const backBtn = document.getElementById("back-to-phone-btn");
  const otpInputs = document.querySelectorAll(".otp-input");
  const resendWrapper = document.getElementById("resend-wrapper");
  const confirmBtn = document.getElementById("confirm-otp-btn");

  let countdownInterval = null;

  if (phoneForm) {
    phoneForm.addEventListener("submit", (e) => {
      e.preventDefault();
      phoneForm.classList.add("hidden");
      otpForm.classList.remove("hidden");

      if (otpInputs.length > 0) otpInputs[0].focus();

      startTimer(30);
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      otpForm.classList.add("hidden");
      phoneForm.classList.remove("hidden");
      clearInterval(countdownInterval);

      otpInputs.forEach((input) => (input.value = ""));
      if (confirmBtn) confirmBtn.disabled = true;
    });
  }

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");

      if (e.target.value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }

      checkOtpCompletion();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  function checkOtpCompletion() {
    const isAllFilled = Array.from(otpInputs).every(
      (inp) => inp.value.length === 1,
    );
    if (confirmBtn) {
      confirmBtn.disabled = !isAllFilled;
    }
  }

  function startTimer(seconds) {
    let timeLeft = seconds;

    resendWrapper.innerHTML = `
      <p class="resend-text">
        Повторная отправка OTP через <span id="timer">${timeLeft}</span> секунд
      </p>
    `;

    const timerElement = document.getElementById("timer");
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      timeLeft--;
      if (timerElement) timerElement.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        showResendButton();
      }
    }, 1000);
  }

  function showResendButton() {
    resendWrapper.innerHTML = `
      <button type="button" class="resend-link" id="resend-otp-btn">
        Переслать OTP
      </button>
    `;

    const resendBtn = document.getElementById("resend-otp-btn");
    resendBtn.addEventListener("click", () => {
      // 1. Здесь можно добавить AJAX-запрос на бэкенд для повторной отправки SMS
      console.log("Запрос на повторную отправку OTP отправлен");

      startTimer(30);
    });
  }
});
// =================== RESET PASSWORD & VALIDATION =========================
document.addEventListener("DOMContentLoaded", () => {
  const forgotLink = document.querySelector(".forgot-link");
  const passwordForm = document.getElementById("password-form");
  const resetForm = document.getElementById("reset-password-form");
  const backFromResetBtn = document.getElementById("back-from-reset-btn");

  const authTabsHeader = document.querySelector(".tabs-header");
  const formHeaderTitle = document.querySelector(".form-header h1");
  const formHeaderSub = document.querySelector(".form-header p");

  const newPassInput = document.getElementById("new-password");
  const confirmPassInput = document.getElementById("confirm-password");
  const resetSubmitBtn = document.getElementById("reset-submit-btn");
  const strengthBars = document.querySelectorAll(
    ".password-strength-bars .bar",
  );

  const originalTitle = formHeaderTitle
    ? formHeaderTitle.textContent
    : "Добро пожаловать!";

  const ICON_DEFAULT = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#EDEDED"/>
      <path d="M6 10L8.5 12.5L14 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  const ICON_CHECK = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#B3DB25"/>
      <path d="M6 10L8.5 12.5L14 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  const ICON_ERROR = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#CE2525"/>
      <path d="M10 6V11M10 14H10.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  if (forgotLink && resetForm) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (passwordForm) passwordForm.classList.add("hidden");
      if (authTabsHeader) authTabsHeader.style.display = "none";
      resetForm.classList.remove("hidden");
      if (formHeaderTitle) formHeaderTitle.textContent = "Сбросить пароль";
      if (formHeaderSub) formHeaderSub.style.display = "none";
    });
  }

  if (backFromResetBtn) {
    backFromResetBtn.addEventListener("click", () => {
      resetForm.classList.add("hidden");
      if (passwordForm) passwordForm.classList.remove("hidden");
      if (authTabsHeader) authTabsHeader.style.display = "flex";
      if (formHeaderTitle) formHeaderTitle.textContent = originalTitle;
      if (formHeaderSub) formHeaderSub.style.display = "block";

      if (newPassInput) newPassInput.value = "";
      if (confirmPassInput) confirmPassInput.value = "";
      updateValidation();
    });
  }

  function updateValidation() {
    if (!newPassInput || !confirmPassInput || !resetSubmitBtn) return;

    const passVal = newPassInput.value;
    const confirmVal = confirmPassInput.value;

    const isMinLength = passVal.length >= 8;
    const isMatch = passVal === confirmVal && confirmVal.length > 0;
    const hasConfirmValue = confirmVal.length > 0;

    const newPassStatus = document.getElementById("new-password-status");
    const confirmPassStatus = document.getElementById(
      "confirm-password-status",
    );
    const confirmWrapper = document.getElementById("confirm-password-wrapper");
    const confirmError = document.getElementById("confirm-password-error");

    if (newPassStatus) {
      newPassStatus.innerHTML = isMinLength ? ICON_CHECK : ICON_DEFAULT;
    }

    const len = passVal.length;
    strengthBars.forEach((bar, index) => {
      if (len === 0) {
        bar.classList.remove("active");
      } else if (index === 0 && len > 0) {
        bar.classList.add("active");
      } else if (index === 1 && len >= 5) {
        bar.classList.add("active");
      } else if (index === 2 && len >= 8) {
        bar.classList.add("active");
      } else {
        bar.classList.remove("active");
      }
    });

    if (confirmWrapper && confirmError && confirmPassStatus) {
      if (hasConfirmValue) {
        if (isMatch) {
          confirmWrapper.classList.remove("invalid");
          confirmError.classList.add("hidden");
          confirmPassStatus.innerHTML = ICON_CHECK;
        } else {
          confirmWrapper.classList.add("invalid");
          confirmError.classList.remove("hidden");
          confirmPassStatus.innerHTML = ICON_ERROR;
        }
      } else {
        confirmWrapper.classList.remove("invalid");
        confirmError.classList.add("hidden");
        confirmPassStatus.innerHTML = ICON_DEFAULT;
      }
    }

    resetSubmitBtn.disabled = !(isMinLength && isMatch);
  }

  [newPassInput, confirmPassInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", updateValidation);
    }
  });

  updateValidation();
});
// ====================================== NAVBAR BURGER MENU ====================================
document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => {
      burgerBtn.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      document.body.classList.toggle("no-scroll");
    });

    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
        burgerBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }
    });
  }
});
// ====================================== CALCULATOR TABS ====================================
document.addEventListener("DOMContentLoaded", () => {
  // const tabs = document.querySelectorAll(".tab-wrapper .tab");
  // const panes = document.querySelectorAll(".tab-wrapper .tab-pane");

  // tabs.forEach((tab) => {
  //   tab.addEventListener("click", () => {
  //     const targetId = tab.dataset.tab;

  //     if (targetId === "calc") {
  //       window.location.href = "/assets/pages/calculator.html";
  //       return;
  //     }

  //     tabs.forEach((t) => t.classList.remove("active"));
  //     panes.forEach((p) => p.classList.remove("active"));

  //     tab.classList.add("active");
  //     document.getElementById(targetId)?.classList.add("active");
  //   });
  // });

  const filterGroups = document.querySelectorAll(".filter-group");
  filterGroups.forEach((group) => {
    const buttons = group.querySelectorAll(".filter-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });
});
// ====================================== PROGRESS LINE IN HOME ====================================
// Функция обновления прогресса на основе данных из API
function updateParcelStatus(apiData) {
  const progressLine = document.getElementById("progress-line");
  const progressPoint = document.getElementById("progress-point");

  const percent = Math.min(Math.max(apiData.progress_percent, 0), 100);

  // Динамически меняем ширину линии и положение точки
  progressLine.style.width = `${percent}%`;
  progressPoint.style.left = `${percent}%`;

  // Обновляем текстовые данные
  document.getElementById("origin-city").textContent = apiData.origin.city;
  document.getElementById("origin-date").textContent = apiData.origin.date;
  document.getElementById("dest-city").textContent = apiData.destination.city;
  document.getElementById("dest-date").textContent = apiData.destination.date;
}

// Пример вызова при получении ответа от API:
/*
fetch('/api/v1/parcels/TRK-998-2024-001')
.then(response => response.json())
.then(data => updateParcelStatus(data));
*/
// ====================================== CALCULATOR PAGE ====================================
document.addEventListener("DOMContentLoaded", () => {
  const routeSection = document.querySelector(".calc-route-section");
  const swapBtn = document.getElementById("swap-btn");

  const fromSelect = document.getElementById("from-city");
  const toSelect = document.getElementById("to-city");

  const fromCard = document.getElementById("from-card");
  const toCard = document.getElementById("to-card");

  function updateActiveTag(cardElement, selectedValue) {
    if (!cardElement) return;
    const tags = cardElement.querySelectorAll(".tag-btn");
    tags.forEach((tag) => {
      if (tag.dataset.city === selectedValue) {
        tag.classList.add("active");
      } else {
        tag.classList.remove("active");
      }
    });
  }

  function setupTagClicks(cardElement, selectElement) {
    if (!cardElement || !selectElement) return;
    const tags = cardElement.querySelectorAll(".tag-btn");
    tags.forEach((tag) => {
      tag.addEventListener("click", () => {
        const cityName = tag.dataset.city;
        selectElement.value = cityName;
        updateActiveTag(cardElement, cityName);
      });
    });
  }

  setupTagClicks(fromCard, fromSelect);
  setupTagClicks(toCard, toSelect);

  if (fromSelect) {
    fromSelect.addEventListener("change", (e) =>
      updateActiveTag(fromCard, e.target.value),
    );
  }
  if (toSelect) {
    toSelect.addEventListener("change", (e) =>
      updateActiveTag(toCard, e.target.value),
    );
  }
  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      routeSection.classList.toggle("is-swapped");

      const tempValue = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = tempValue;

      updateActiveTag(fromCard, fromSelect.value);
      updateActiveTag(toCard, toSelect.value);
    });
  }
});

// ====================================== PROFILE CHANGE CONTENT ====================================
document.addEventListener("DOMContentLoaded", () => {
  const profileMenuItems = document.querySelectorAll(
    ".profile-menu-item[data-tab]",
  );

  const profileContents = document.querySelectorAll(
    ".profile-tab-content[data-content]",
  );

  profileMenuItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      const tabName = item.dataset.tab;

      profileMenuItems.forEach((menuItem) => {
        menuItem.classList.remove("active");
      });

      item.classList.add("active");

      profileContents.forEach((content) => {
        content.classList.remove("active");
      });

      const activeContent = document.querySelector(
        `.profile-tab-content[data-content="${tabName}"]`,
      );

      if (activeContent) {
        activeContent.classList.add("active");
      }
    });
  });
});
// ====================================== PROFILE ADDRESS ====================================
document.addEventListener("DOMContentLoaded", () => {
  let addresses = [
    {
      id: 1,
      recipient: "Timur Islakayev",
      phone: "+998901234567",
      extraPhone: "",
      region: "Ташкент",
      address: "Чиланзар - 3, Ориентир: Финанс Банк",
      isPickup: false,
      isMain: true,
    },
  ];

  let addressToDeleteId = null;

  const addressesListEl = document.getElementById("addressesList");
  const addressModal = document.getElementById("addressModal");
  const deleteModal = document.getElementById("deleteModal");
  const addressForm = document.getElementById("addressForm");
  const modalTitle = document.getElementById("modalTitle");

  const openAddModalBtn = document.getElementById("openAddModalBtn");
  const closeAddressModalBtn = document.getElementById("closeAddressModalBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeDeleteModalBtn = document.getElementById("closeDeleteModalBtn");
  const deleteModalOverlay = document.getElementById("deleteModalOverlay");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  const addressIdInput = document.getElementById("addressId");
  const modalRecipient = document.getElementById("modalRecipient");
  const modalPhone = document.getElementById("modalPhone");
  const modalExtraPhone = document.getElementById("modalExtraPhone");
  const modalRegion = document.getElementById("modalRegion");
  const modalPickup = document.getElementById("modalPickup");
  const modalAddress = document.getElementById("modalAddress");
  const modalIsMain = document.getElementById("modalIsMain");

  function renderAddresses() {
    if (!addressesListEl) return;

    addressesListEl.innerHTML = "";

    addresses.forEach((item) => {
      const card = document.createElement("div");
      card.className = "address-item-card";

      card.innerHTML = `
      <div class="address-item-header">
      <div class="address-title-group">
      <span class="address-region-title">${item.region}</span>
      ${item.isMain ? '<span class="badge-main">Основной</span>' : ""}
      </div>
      <div class="address-actions">
      <button class="action-btn star-btn ${item.isMain ? "active" : ""}" data-id="${item.id}" title="${item.isMain ? "Основной адрес" : "Сделать основным"}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="${item.isMain ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      </button>
      <button class="action-btn edit-btn" data-id="${item.id}" title="Редактировать">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                </button>
                <button class="action-btn delete-btn" data-id="${item.id}" title="Удалить">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            </div>
        </div>
        
        <div class="address-info-line">
        <div class="address-info-label">Адрес:</div>
        <div>${item.address}</div>
        </div>
        
        <div class="address-info-line">
        <div class="address-info-label">Телефон:</div>
        <div>${item.phone}</div>
        </div>
        
        <button class="btn-show-map">Показать на карте</button>
        `;

      addressesListEl.appendChild(card);
    });

    bindCardEvents();
  }

  function bindCardEvents() {
    document.querySelectorAll(".star-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.currentTarget.dataset.id);
        addresses = addresses.map((addr) => ({
          ...addr,
          isMain: addr.id === id,
        }));
        renderAddresses();
      });
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.currentTarget.dataset.id);
        const item = addresses.find((a) => a.id === id);
        if (!item) return;

        addressIdInput.value = item.id;
        modalRecipient.value = item.recipient;
        modalPhone.value = item.phone;
        modalExtraPhone.value = item.extraPhone || "";
        modalRegion.value = item.region;
        modalPickup.checked = item.isPickup;
        modalAddress.value = item.address;
        modalIsMain.checked = item.isMain;

        modalTitle.textContent = "Редактировать адрес";
        openModal(addressModal);
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        addressToDeleteId = Number(e.currentTarget.dataset.id);
        openModal(deleteModal);
      });
    });
  }

  function openModal(modal) {
    modal.classList.add("active");
  }

  function closeModal(modal) {
    modal.classList.remove("active");
  }

  if (openAddModalBtn) {
    openAddModalBtn.addEventListener("click", () => {
      addressForm.reset();
      addressIdInput.value = "";
      modalTitle.textContent = "Новый адрес";
      openModal(addressModal);
    });
  }

  if (closeAddressModalBtn) {
    closeAddressModalBtn.addEventListener("click", () =>
      closeModal(addressModal),
    );
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", () => closeModal(addressModal));
  }

  if (closeDeleteModalBtn) {
    closeDeleteModalBtn.addEventListener("click", () =>
      closeModal(deleteModal),
    );
  }

  if (deleteModalOverlay) {
    deleteModalOverlay.addEventListener("click", () => closeModal(deleteModal));
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", () => closeModal(deleteModal));
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      if (addressToDeleteId !== null) {
        addresses = addresses.filter((a) => a.id !== addressToDeleteId);
        addressToDeleteId = null;
        renderAddresses();
        closeModal(deleteModal);
      }
    });
  }

  if (addressForm) {
    addressForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const id = addressIdInput.value
        ? Number(addressIdInput.value)
        : Date.now();
      const isMain = modalIsMain.checked;

      if (isMain) {
        addresses.forEach((a) => (a.isMain = false));
      }

      const addressData = {
        id,
        recipient: modalRecipient.value,
        phone: modalPhone.value,
        extraPhone: modalExtraPhone.value,
        region: modalRegion.value,
        isPickup: modalPickup.checked,
        address: modalAddress.value,
        isMain: isMain,
      };

      if (addressIdInput.value) {
        const index = addresses.findIndex((a) => a.id === id);
        addresses[index] = addressData;
      } else {
        addresses.push(addressData);
      }

      renderAddresses();
      closeModal(addressModal);
    });
  }

  renderAddresses();
});
// ====================================== PROFILE ADDRESS ====================================
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("profile-page-body")) {
    return;
  }

  const burgerBtn = document.getElementById("burgerBtn");
  const profileSidebar = document.querySelector(".profile-sidebar");
  const overlay = document.getElementById("profileSidebarOverlay");

  if (!burgerBtn || !profileSidebar || !overlay) return;

  function openProfileSidebar() {
    burgerBtn.classList.add("active");
    burgerBtn.setAttribute("aria-expanded", "true");

    profileSidebar.classList.add("mobile-open");
    overlay.classList.add("active");

    document.body.classList.add("no-scroll");
  }

  function closeProfileSidebar() {
    burgerBtn.classList.remove("active");
    burgerBtn.setAttribute("aria-expanded", "false");

    profileSidebar.classList.remove("mobile-open");
    overlay.classList.remove("active");

    document.body.classList.remove("no-scroll");
  }

  burgerBtn.addEventListener("click", () => {
    if (profileSidebar.classList.contains("mobile-open")) {
      closeProfileSidebar();
    } else {
      openProfileSidebar();
    }
  });

  overlay.addEventListener("click", closeProfileSidebar);

  profileSidebar
    .querySelectorAll(".profile-menu-item[data-tab]")
    .forEach((item) => {
      item.addEventListener("click", () => {
        closeProfileSidebar();
      });
    });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      closeProfileSidebar();
    }
  });
});
//============================== PACKAGE PAGE ACCORDION ===========================
document.addEventListener("DOMContentLoaded", () => {
  const packageItems = document.querySelectorAll(".package-item");

  packageItems.forEach((item) => {
    const header = item.querySelector(".package-item-header");

    header.addEventListener("click", () => {
      packageItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      item.classList.toggle("active");
    });
  });
});
