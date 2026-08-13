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
