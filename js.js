const dataInfo = {
  "Alfa Romeo": ["Giulia", "Outro"],
  Audi: [
    "A3",
    "A3 Sportback",
    "A5",
    "A8",
    "E-tron GT",
    "E-tron Sportback",
    "Q3",
    "Q5",
    "Q7",
    "SQ5",
    "Outro",
  ],
  BMW: [
    "Serie 1",
    "Serie 2 Active Tourer",
    "Serie 2 Gran Tourer",
    "Serie 3",
    "Serie 4",
    "Serie 5",
    "Serie 7",
    "Série 2",
    "X1",
    "X2",
    "X3",
    "X5",
    "i4",
    "Outro",
  ],
  Citroën: [
    "C4",
    "C4 Cactus",
    "DS3",
    "Grand C4 Spacetourer",
    "Jumper",
    "Outro",
  ],
  Cupra: ["Born", "Outro"],
  DS: ["DS 3 Crossback", "DS 7 Crossback", "Outro"],
  Dacia: ["Dokker", "Duster", "Jogger", "Logan MCV", "Sandero", "Outro"],
  Fiat: ["500", "500X", "Outro"],
  Ford: ["Fiesta", "Focus", "Outro"],
  Honda: ["Civic", "Honda e", "Outro"],
  Hyundai: ["Bayon", "IONIQ 5", "Kauai", "Santa Fe", "Tucson", "i30", "Outro"],
  Jaguar: ["E-Pace", "Outro"],
  Kia: ["EV6", "Sportage", "Stonic", "Outro"],
  "Land Rover": ["Discovery Sport", "Outro"],
  Lexus: ["RX", "Outro"],
  Mazda: ["CX-5", "Outro"],
  "Mercedes-Benz": [
    "Clase CLA",
    "Classe A",
    "Classe C",
    "Classe CLA",
    "Classe GLC",
    "GLC Coupé",
    "Outro",
  ],
  Mini: ["Clubman", "Cooper", "Mini", "Outro"],
  Mitsubishi: ["Eclipse Cross", "Outro"],
  Nissan: ["JUKE", "LEAF", "Micra", "Qashqai", "X-Trail", "Outro"],
  Opel: [
    "Astra",
    "Corsa",
    "Grandland X",
    "Insignia",
    "Mokka X",
    "Vivaro",
    "Outro",
  ],
  Peugeot: ["2008", "3008", "5008", "508", "Outro"],
  Renault: [
    "Arkana",
    "Austral",
    "Captur",
    "Clio",
    "Espace",
    "Grand Kangoo",
    "Grand Scenic",
    "Kadjar",
    "Kangoo",
    "Kangoo Furgón",
    "Koleos",
    "Megane",
    "Nuevo Clio",
    "Nuevo Espace",
    "Scenic",
    "ZOE",
    "Outro",
  ],
  SEAT: ["Arona", "Ateca", "Leon", "Outro"],
  Tesla: ["Model S", "Outro"],
  Volkswagen: [
    "Golf",
    "ID. BUZZ",
    "ID.3",
    "ID.4",
    "Passat",
    "Scirocco",
    "T-Roc",
    "Outro",
  ],
  Volvo: ["XC40", "XC60", "Outro"],
  Outro: ["Outro"],
};

class MultiStepForm {
  constructor(selector) {
    this.form = document.querySelector(selector);
    this.steps = Array.from(this.form.querySelectorAll(".step"));
    this.header = this.form.querySelector("header");
    this.selects = Array.from(this.form.querySelectorAll("select"));
    this.flags = this.form.querySelector(".flags");
    this.flagSpan = this.form.querySelector(".flags span");
    this.prevButton = this.form.querySelector("[data-prev]");
    this.retryButton = this.form.querySelector("[data-retry]");
    this.nextButton = this.form.querySelector("[data-next]");
    this.sendButton = this.form.querySelector("[data-submit]");
    this.countryInput = this.form.querySelector("input[name='country']");
    this.countryPrefix = this.form.querySelector("input[name='numberPrefix']");
    this.inputs = Array.from(this.form.querySelectorAll("input"));
    this.currentStep = 0;
    this.formStart = false;

    this.setupInputListeners();
    this.setupFlagClickListener();
    this.setupButtonListeners();
    this.setupBrandSelectListener();
    this.setupEventListeners();

    // this.showStep(this.currentStep);
    this.carregarBrands();
    this.createCustomSelect();
  }

  trackEvent(eventName) {
    const formData = new FormData(this.form);
    const formDataObject = {};
    // caso queira enviar todas as keys mesmo que vazia ''
    //this.form
    //  .querySelectorAll("select")
    //  .forEach(
    //    (select) => (formDataObject[select.name] = select.value || "")
    //  );
    for (let [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }
    function selectedFields(data, fields) {
      const result = {};
      fields.forEach((campo) => {
        if (data.hasOwnProperty(campo)) {
          result[campo] = data[campo];
        }
      });
      return result;
    }
    // selecionando quais valore serão enviados para o GTM
    const fieldsToSend = [
      "brand",
      "model",
      "dealer",
      "country",
      "numberPrefix",
      "dealerradio",
    ];
    const resultToSend = selectedFields(formDataObject, fieldsToSend);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: `${eventName}`,
      ...formDataObject,
    });

    console.log(`Event Tracked: ${eventName}`, resultToSend);
  }

  setupInputListeners() {
    this.inputs.forEach((input) => {
      input.addEventListener("focus", () => this.handleInputFocus(input));
      input.addEventListener("blur", () => this.handleInputBlur(input));

      if (input.type !== "radio") {
        input.parentNode.addEventListener("mouseover", () =>
          this.handleInputFocus(input)
        );
      } else {
        input.addEventListener("change", () =>
          this.handleRadioInputChange(input)
        );
      }

      input.parentNode.addEventListener("mouseleave", () =>
        this.handleInputBlur(input)
      );

      if (input.name === "tel") {
        input.addEventListener("keydown", (e) =>
          this.handleTelInputKeyDown(input, e)
        );
      }
    });
  }

  handleRadioInputChange(radioInput) {
    const allRadios = document.querySelectorAll(
      `input[type="radio"][name="${radioInput.name}"]`
    );

    allRadios.forEach((radio) => {
      if (radio !== radioInput) {
        radio.parentNode.classList.remove("check");
      } else {
        radio.parentNode.classList.add("check");
      }
    });
  }

  handleInputFocus(input) {
    input.parentNode.classList.add("active");
  }

  handleInputBlur(input) {
    if (input.value === "") {
      input.parentNode.classList.remove("active");
    }
  }

  handleTelInputKeyDown(input, e) {
    input.value = input.value.replace(/\D+/g, "");
  }

  setupFlagClickListener() {
    this.flagSpan.addEventListener("click", () => this.handleFlagClick());
  }

  handleFlagClick() {
    const dropdown = this.flags.querySelector("div");
    const span = this.flags.querySelector("span");
    const flags = dropdown.querySelectorAll("span");

    dropdown.classList.remove("select-hide");

    const handleFlagClick = (e) => {
      e.stopPropagation();
      const flag = e.currentTarget;
      const flagIcon = flag.querySelector("i");
      const [countryName, countryCode] = flag.textContent
        .trim()
        .match(/([^+\d]+)\s*(\+\d+)/)
        .slice(1);

      span.innerHTML = `${flagIcon.outerHTML} ${countryCode}`;
      span.dataset.country = countryName;
      span.dataset.code = countryCode;
      dropdown.classList.add("select-hide");
    };

    flags.forEach((flag) => {
      flag.removeEventListener("click", this.handleFlagClick);
      flag.addEventListener("click", handleFlagClick);
    });
  }

  setupButtonListeners() {
    this.nextButton.addEventListener("click", () => this.goToNextStep());
    this.prevButton.addEventListener("click", () => this.goToPrevStep());
    this.sendButton.addEventListener("click", (event) =>
      this.submitForm(event)
    );
    this.retryButton.addEventListener("click", () => this.retry());
  }

  setupBrandSelectListener() {
    this.selects
      .filter((e) => e.getAttribute("name") === "brand")
      .forEach((brand) => {
        brand.addEventListener("change", () =>
          this.handleBrandSelectChange(brand)
        );
      });
  }

  handleBrandSelectChange(brand) {
    this.carregarModels(brand.value);
    const modelSelect = this.selects.find(
      (e) => e.getAttribute("name") === "model"
    );

    brand.value !== ""
      ? modelSelect.parentNode.parentNode.removeAttribute("disabled")
      : modelSelect.parentNode.parentNode.setAttribute("disabled", true);

    if (!this.formStart) {
      this.trackEvent("form_start");
      this.trackEvent(`form_step1`);
      this.formStart = true;
    }
  }

  setupEventListeners() {
    document.addEventListener("DOMContentLoaded", () =>
      this.handleDOMContentLoaded()
    );
    document.addEventListener("click", (e) => this.closeOptionsDiv(e));
  }

  handleDOMContentLoaded() {
    console.log("Document is ready");
  }

  closeOptionsDiv(e) {
    const allOptionsDiv = document.querySelectorAll(
      ".select-items, .flags>span,.flags>div.dropdown"
    );
    const isClickedOutsideAllOptions = Array.from(allOptionsDiv).every(
      (optionsDiv) => !optionsDiv.contains(e.target)
    );

    isClickedOutsideAllOptions &&
      allOptionsDiv.forEach((optionsDiv) => {
        optionsDiv.classList.add("select-hide");
        optionsDiv.parentNode.classList.remove("show");
      });
  }

  showStep(i) {
    this.toggleStepDisplay(i);
    this.toggleHeaderClasses(i);
    this.toggleButtonDisplay(i);
  }

  toggleStepDisplay(i) {
    this.steps.forEach((step, index) => {
      step.style.display = index === i ? "grid" : "none";
    });
  }

  toggleHeaderClasses(i) {
    this.header.style.display = i === this.steps.length - 1 ? "none" : "flex";
    const headerIndex = this.header.querySelector("div span b");
    const headerTitle = this.header.querySelector("div strong");
    const actualStepTitle = this.steps[i].getAttribute("data-title");
    headerIndex.innerHTML = i + 1;
    headerTitle.innerHTML = actualStepTitle;
  }

  toggleButtonDisplay(i) {
    const isFirstPage = i === 0;
    const isSubmitPage = i === this.steps.length - 2;
    const isLastPage = i === this.steps.length - 1;

    if (!this.formStart) {
      this.trackEvent(`form_start`);
      this.trackEvent(`form_step1`);
      this.formStart = true;
    }
    this.trackEvent(`form_step${i + 1}`);

    this.prevButton.style.display = isFirstPage || isLastPage ? "none" : "flex";
    this.nextButton.style.display =
      isSubmitPage || isLastPage ? "none" : "flex";
    this.sendButton.style.display = isSubmitPage ? "flex" : "none";
    this.retryButton.style.display = isLastPage ? "flex" : "none";
  }

  validateStep() {
    let actualStep = this.steps[this.currentStep];
    let requiredSelects = actualStep.querySelectorAll("select[required]");
    let requiredInputs = actualStep.querySelectorAll("input[required]");
    let isValid = true;

    this.countryInput.value = this.flagSpan.dataset.country;
    this.countryPrefix.value = this.flagSpan.dataset.code;

    const handleInputValidation = (input, validationFn) => {
      let inputDiv = input.parentElement;
      let spanError = inputDiv.nextElementSibling;

      !validationFn(input.value)
        ? (inputDiv.classList.add("error"),
          spanError?.classList.add("show"),
          (isValid = false))
        : (inputDiv.classList.add("active"),
          spanError?.classList.remove("show"),
          inputDiv.classList.remove("error"));
    };

    requiredInputs.forEach((input) => {
      switch (input.type) {
        case "text":
          switch (input.name) {
            case "name":
              handleInputValidation(input, (value) => value !== "");
              break;
            case "tel":
              handleInputValidation(
                input,
                (value) => value.length >= 9 && value.length <= 15
              );
              break;
            case "email":
              handleInputValidation(input, (value) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
              );
              break;
          }
          break;
        case "checkbox":
          let spanError = input.parentNode.querySelector("label span");
          if (!input.checked && input.hasAttribute("required")) {
            spanError?.classList.add("show");
            isValid = false;
          } else {
            spanError?.classList.remove("show");
          }
          break;
      }
    });

    requiredSelects.forEach((select) => {
      let customSelect = select.parentElement;
      let spanError = customSelect.nextElementSibling;

      select.value === ""
        ? (customSelect.classList.add("error"),
          spanError?.classList.add("show"),
          (isValid = false))
        : (customSelect.classList.add("active"),
          spanError?.classList.remove("show"),
          customSelect.classList.remove("error"));
    });

    return isValid;
  }

  goToNextStep() {
    this.validateStep() &&
      (this.currentStep++, this.showStep(this.currentStep));
  }

  goToPrevStep() {
    this.currentStep--;
    this.showStep(this.currentStep);
  }

  carregarBrands() {
    let brandSelect = this.selects.filter(
      (e) => e.getAttribute("name") === "brand"
    )[0];
    brandSelect.innerHTML = "<option disabled selected value></option>";
    Object.keys(dataInfo).forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.text = brand;
      brandSelect.appendChild(option);
    });
  }

  carregarModels(brandSelected) {
    const modelSelect = this.selects.find(
      (e) => e.getAttribute("name") === "model"
    );
    modelSelect.innerHTML = "<option disabled selected value></option>";
    const modelos = dataInfo[brandSelected] || [];
    const spanTitle = modelSelect.nextElementSibling;
    spanTitle.innerHTML = modelSelect.getAttribute("title");
    modelSelect.value = "";
    this.validateStep();
    modelos.forEach((modelo) => {
      const option = document.createElement("option");
      option.value = modelo;
      option.text = modelo;
      modelSelect.appendChild(option);
    });
  }

  createCustomSelect() {
    Array.from(document.getElementsByClassName("custom-select")).forEach(
      (customSelect) => this.createSingleCustomSelect(customSelect)
    );
  }

  createSingleCustomSelect(customSelect) {
    var selectElement = customSelect.getElementsByTagName("select")[0];
    var selectedDiv = document.createElement("span");
    selectedDiv.setAttribute("class", "select-selected");
    var titleAttribute = selectElement.getAttribute("title");

    titleAttribute && (selectedDiv.innerHTML = titleAttribute);
    customSelect.appendChild(selectedDiv);

    var optionsDiv = document.createElement("DIV");
    optionsDiv.setAttribute("class", "select-items select-hide");

    selectedDiv.addEventListener("click", (e) => {
      let disabledSelect = customSelect.parentNode;
      customSelect.classList.add("show");
      if (!disabledSelect.hasAttribute("disabled")) {
        optionsDiv.innerHTML = "";

        for (var j = 0; j < selectElement.options.length; j++) {
          var optionDiv = document.createElement("span");
          optionDiv.innerHTML = selectElement.options[j].innerHTML;

          optionDiv.addEventListener("click", function (e) {
            var selectedIndex = Array.prototype.indexOf.call(
              this.parentNode.children,
              this
            );
            selectElement.selectedIndex = selectedIndex;
            selectedDiv.innerHTML = this.innerHTML;

            var sameAsSelected =
              this.parentNode.getElementsByClassName("same-as-selected");
            for (var k = 0; k < sameAsSelected.length; k++) {
              sameAsSelected[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            selectElement.dispatchEvent(new Event("change"));
            selectedDiv.click();
          });

          optionsDiv.appendChild(optionDiv);
        }

        customSelect.appendChild(optionsDiv);
        optionsDiv.classList.remove("select-hide");

        selectElement.value !== "" &&
          (this.validateStep(), customSelect.classList.add("active"));
        e.stopPropagation();
      }
    });
  }

  submitForm(e) {
    e.preventDefault();

    if (this.validateStep()) {
      this.trackEvent(`form_submit`);
      const formData = new FormData(this.form);
      const formDataObject = {};
      this.form
        .querySelectorAll("select")
        .forEach(
          (select) => (formDataObject[select.name] = select.value || "")
        );
      for (let [key, value] of formData.entries()) {
        formDataObject[key] = value;
      }
      console.table(formDataObject);
      this.currentStep++;
      this.showStep(this.currentStep);
    }
  }

  retry() {
    this.currentStep = 0;
    this.showStep(this.currentStep);
    this.selects.forEach((select) => {
      let divCustom = select.parentElement;
      let spanTitle = divCustom.querySelector("span");
      let dropdown = divCustom.querySelector("div");
      select.value = "";
      divCustom.classList.remove("active");
      spanTitle.innerHTML = select.getAttribute("title");
      dropdown?.remove();
      select.name === "model" &&
        divCustom.parentElement.setAttribute("disabled", "disabled");
    });

    this.inputs.forEach((input) => {
      switch (input.type) {
        case "text":
          let divParent = input.parentElement;
          input.value = "";
          divParent.classList.remove("active");
          break;
        case "checkbox":
          let spanError = input.parentElement.querySelector("span");
          spanError?.classList.remove("show");
          input.checked = false;
          break;
      }
    });

    this.trackEvent(`form_retry`);
  }
}

const multiStepForm = new MultiStepForm(".form_lp");
