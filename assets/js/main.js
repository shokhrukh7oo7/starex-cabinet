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
const togglePassBtn = document.querySelector(".toggle-password");
if (togglePassBtn) {
  const toggleIcon = togglePassBtn.querySelector("img");
  const eyeOpenIcon = "/assets/images/sign-in/eye.svg";
  const eyeClosedIcon = "/assets/images/sign-in/eye-off.svg";

  togglePassBtn.addEventListener("click", () => {
    const passInput = document.getElementById("pass-password");
    const isPassword = passInput.getAttribute("type") === "password";

    passInput.setAttribute("type", isPassword ? "text" : "password");

    if (isPassword) {
      passInput.setAttribute("type", "text");
      toggleIcon.setAttribute("src", eyeOpenIcon);
      toggleIcon.setAttribute("alt", "Скрыть пароль");
      togglePassBtn.setAttribute("aria-label", "Скрыть пароль");
    } else {
      passInput.setAttribute("type", "password");
      toggleIcon.setAttribute("src", eyeClosedIcon);
      toggleIcon.setAttribute("alt", "Показать пароль");
      togglePassBtn.setAttribute("aria-label", "Показать пароль");
    }
  });
}
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

  // Переход к OTP при отправке номера
  if (phoneForm) {
    phoneForm.addEventListener("submit", (e) => {
      e.preventDefault();
      phoneForm.classList.add("hidden");
      otpForm.classList.remove("hidden");

      // Фокус на первый инпут OTP
      if (otpInputs.length > 0) otpInputs[0].focus();

      startTimer(30);
    });
  }

  // Назад к вводу телефона
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      otpForm.classList.add("hidden");
      phoneForm.classList.remove("hidden");
      clearInterval(countdownInterval);

      // Очищаем введённые цифры
      otpInputs.forEach((input) => (input.value = ""));
      if (confirmBtn) confirmBtn.disabled = true;
    });
  }

  // Логика ввода OTP (автопереход между ячейками)
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

  // Функция запуска/сброса таймера
  function startTimer(seconds) {
    let timeLeft = seconds;

    // Вставляем начальную верстку таймера
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
        showResendButton(); // Заменяем текст на кнопку "Переслать OTP"
      }
    }, 1000);
  }

  // Функция показа кнопки "Переслать OTP"
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

      // 2. Перезапускаем таймер заново
      startTimer(30);
    });
  }
});
// ===================  =========================
