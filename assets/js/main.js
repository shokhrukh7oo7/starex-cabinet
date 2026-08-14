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

// открыть и закрыть пароль (иконка глаза)
// Переключатель видимости пароля (для всех полей)
const togglePassBtns = document.querySelectorAll(".toggle-password");

togglePassBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Находим инпут, который находится в том же .password-wrapper
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

  // Вспомогательная функция проверки полноты номера (+998 + 9 цифр = всего 9 цифр в unmaskedValue)
  const isPhoneComplete = (maskInstance) => {
    if (!maskInstance) return false;
    return maskInstance.isComplete || maskInstance.unmaskedValue.length === 9;
  };

  // 1. Вкладка "По SMS"
  const smsPhoneInput = document.getElementById("sms-phone");
  const smsSubmitBtn = document.getElementById("sms-submit-btn");

  if (smsPhoneInput && smsSubmitBtn) {
    const smsMask = IMask(smsPhoneInput, maskOptions);

    const checkSmsForm = () => {
      const isComplete = isPhoneComplete(smsMask);
      smsSubmitBtn.disabled = !isComplete;
    };

    // Подписываемся и на IMask, и на обычные события браузера
    smsMask.on("accept", checkSmsForm);
    smsPhoneInput.addEventListener("input", checkSmsForm);
    smsPhoneInput.addEventListener("keyup", checkSmsForm);

    // Первоначальная проверка
    checkSmsForm();
  }

  // 2. Вкладка "По паролю"
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

    // Подписываемся на маску и ввод в оба поля
    passMask.on("accept", checkLoginForm);
    passPhoneInput.addEventListener("input", checkLoginForm);
    passPhoneInput.addEventListener("keyup", checkLoginForm);

    passPasswordInput.addEventListener("input", checkLoginForm);
    passPasswordInput.addEventListener("keyup", checkLoginForm);

    // Первоначальная проверка
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
