let currentStep = 0;
const steps = document.querySelectorAll(".form-step");
const progressItems = document.querySelectorAll(".progress-bar li");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const yamlPreview = document.getElementById("yamlPreview");

function showStep(n) {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === n);
  });

  progressItems.forEach((item, index) => {
    item.classList.toggle("active", index <= n);
  });

  // Show or hide buttons
  if (n === 0) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "inline-block";
  }

  if (n === steps.length - 1) {
    nextBtn.style.display = "none";
    generateBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "inline-block";
    generateBtn.style.display = "none";
  }

  // Hide download button initially
  downloadBtn.style.display = "none";

  // Hide YAML preview on navigation
  if (n !== steps.length - 1) {
    yamlPreview.style.display = "none";
  }

  // Clear any existing error messages when navigating steps
  clearErrors(n);
}

function clearErrors(n) {
  // Get all error messages in the current step and clear them
  const currentFormStep = steps[n];
  const errorMessages = currentFormStep.querySelectorAll('.error-message');
  errorMessages.forEach(span => {
    span.textContent = '';
  });
}

function nextStep() {
  if (currentStep < steps.length - 1) {
    if (validateStep(currentStep)) {
      currentStep++;
      showStep(currentStep);
    }
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function escapeYAMLString(str) {
  return str.replace(/"/g, '\\"');
}

function generateYAML() {
  if (!validateAllSteps()) {
    alert("Please fix the errors before generating the YAML.");
    return;
  }

  const chestName = escapeYAMLString(document.getElementById('chestName').value.trim());
  const inventoryName = escapeYAMLString(document.getElementById('inventoryName').value);
  const inventorySize = document.getElementById('inventorySize').value;
  const containerType = document.getElementById('containerType').value;
  const itemName = escapeYAMLString(document.getElementById('itemName').value);

  // Handle Item Lore
  const itemLoreRaw = document.getElementById('itemLore').value.trim();
  const itemLoreArray = itemLoreRaw.split('\n').map(line => `      - "${escapeYAMLString(line)}"`).join('\n');

  // Hologram
  const hologramEnable = document.getElementById('hologramEnable').checked;
  const hologramTitleRaw = document.getElementById('hologramTitle').value.trim();
  const hologramTitleArray = hologramTitleRaw.split('\n').map(line => `      - "${escapeYAMLString(line)}"`).join('\n');

  // Transportation
  const transportEnable = document.getElementById('transportEnable').checked;
  const transportItemName = escapeYAMLString(document.getElementById('transportItemName').value);
  const transportItemLoreRaw = document.getElementById('transportItemLore').value.trim();
  const transportItemLoreArray = transportItemLoreRaw.split('\n').map(line => `      - "${escapeYAMLString(line)}"`).join('\n');

  // Shop
  const shopPrice = document.getElementById('shopPrice').value;

  // Hopper
  const allowHoppersUse = document.getElementById('allowHoppersUse').checked;

  // Pagination
  const previousPageSlot = document.getElementById('previousPageSlot').value;
  const nextPageSlot = document.getElementById('nextPageSlot').value;

  // Upgrades
  const upgradesEnable = document.getElementById('upgradesEnable').checked;
  const upgradesNextUpgrade = escapeYAMLString(document.getElementById('upgradesNextUpgrade').value);
  const upgradesPrice = document.getElementById('upgradesPrice').value;
  const upgradesSlot = document.getElementById('upgradesSlot').value;

  // Sorters
  const sortersEnable = document.getElementById('sortersEnable').checked;
  const sortersPrice = document.getElementById('sortersPrice').value;
  const sortersSlot = document.getElementById('sortersSlot').value;

  // Sells
  const sellsEnable = document.getElementById('sellsEnable').checked;
  const sellsMultiplier = document.getElementById('sellsMultiplier').value;
  const sellsSlot = document.getElementById('sellsSlot').value;

  // Smelter
  const smelterEnable = document.getElementById('smelterEnable').checked;
  const smelterPrice = document.getElementById('smelterPrice').value;
  const smelterSlot = document.getElementById('smelterSlot').value;

  // Compressor
  const compressorEnable = document.getElementById('compressorEnable').checked;
  const compressorPrice = document.getElementById('compressorPrice').value;
  const compressorSlot = document.getElementById('compressorSlot').value;

  // Auto Sells
  const autosellsEnable = document.getElementById('autosellsEnable').checked;
  const autosellsFrequency = document.getElementById('autosellsFrequency').value;
  const autosellsMultiplier = document.getElementById('autosellsMultiplier').value;
  const autosellsTax = document.getElementById('autosellsTax').value;
  const autosellsSlot = document.getElementById('autosellsSlot').value;

  // Deposit
  const depositEnable = document.getElementById('depositEnable').checked;

  // Search
  const searchEnable = document.getElementById('searchEnable').checked;
  const searchSlot = document.getElementById('searchSlot').value;
  
  // Chunk Collector
  const chunkCollectorEnable = document.getElementById('chunkCollectorEnable').checked;
  const chunkCollectorSlot = document.getElementById('chunkCollectorSlot').value;


  // Settings
  const settingsEnable = document.getElementById('settingsEnable').checked;
  const settingsSlot = document.getElementById('settingsSlot').value;

  // Crafting
  const craftingEnable = document.getElementById('craftingEnable').checked;
  const craftingItemsRaw = document.getElementById('craftingItems').value.trim();
  const craftingItemsArray = craftingItemsRaw.split('\n').map(line => `      ${line}`).join('\n');
  const craftingRecipeRaw = document.getElementById('craftingRecipe').value.trim();
  const craftingRecipeArray = craftingRecipeRaw.split('\n').map(line => `      - "${escapeYAMLString(line)}"`).join('\n');

  const yamlContent = `inventory:
  name: "${inventoryName}"
  size: ${inventorySize}
container:
  type: "${containerType}"
item:
  name: "${itemName}"
  lore:
${itemLoreArray}
hologram:
  enable: ${hologramEnable}
  title:
${hologramTitleArray}
transportation:
  enable: ${transportEnable}
  item:
    name: "${transportItemName}"
    lore:
${transportItemLoreArray}
shop-price: ${shopPrice}
allow-hoppers-use: ${allowHoppersUse}
previous-page-slot: ${previousPageSlot}
next-page-slot: ${nextPageSlot}
upgrades:
  enable: ${upgradesEnable}
  next_upgrade: "${upgradesNextUpgrade}"
  price: ${upgradesPrice}
  slot: ${upgradesSlot}
sorters:
  enable: ${sortersEnable}
  price: ${sortersPrice}
  slot: ${sortersSlot}
sells:
  enable: ${sellsEnable}
  multiplier: ${sellsMultiplier}
  slot: ${sellsSlot}
smelter:
  enable: ${smelterEnable}
  price: ${smelterPrice}
  slot: ${smelterSlot}
compressor:
  enable: ${compressorEnable}
  price: ${compressorPrice}
  slot: ${compressorSlot}
autosells:
  enable: ${autosellsEnable}
  frequency: ${autosellsFrequency}
  multiplier: ${autosellsMultiplier}
  tax: ${autosellsTax}
  slot: ${autosellsSlot}
deposit:
  enable: ${depositEnable}
search:
  enable: ${searchEnable}
  slot: ${searchSlot}
chunk-collector:
  enable: ${chunkCollectorEnable}
  slot: ${chunkCollectorSlot}
settings:
  enable: ${settingsEnable}
  slot: ${settingsSlot}
crafting:
  enable: ${craftingEnable}
  items:
${craftingItemsArray}
  recipe:
${craftingRecipeArray}`;

  yamlPreview.textContent = yamlContent;
  yamlPreview.style.display = "block";

  // Store the YAML content and Chest Name for download
  window.generatedYAML = yamlContent.trim();
  window.chestName = chestName || "config"; // Default to 'config' if no name provided

  // Show download button
  downloadBtn.style.display = "inline-block";
}

function downloadYAML() {
  if (!window.generatedYAML) {
    alert("Please generate the YAML first.");
    return;
  }
  const blob = new Blob([window.generatedYAML], { type: "text/yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${window.chestName}.yml`; // Changed extension to .yml
  a.click();
  URL.revokeObjectURL(url);
}

// Validation Function (Enhanced)
function validateStep(n) {
  let isValid = true;

  switch(n) {
    case 0: // Step 1: Chest Name
      const chestName = document.getElementById('chestName').value.trim();
      const chestNameError = document.getElementById('chestNameError');
      if (chestName === "") {
        chestNameError.textContent = "Chest name cannot be empty.";
        isValid = false;
      } else if (/\s/.test(chestName)) {
        chestNameError.textContent = "Chest name cannot contain spaces.";
        isValid = false;
      } else {
        chestNameError.textContent = "";
      }
      break;

    case 1: // Step 2: Inventory
      const inventorySize = document.getElementById('inventorySize').value;
      const inventorySizeError = document.getElementById('inventorySizeError');
      if (inventorySize === "") {
        inventorySizeError.textContent = "Inventory size cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(inventorySize)) || Number(inventorySize) <= 0) {
        inventorySizeError.textContent = "Inventory size must be a positive integer.";
        isValid = false;
      } else if (Number(inventorySize) % 9 !== 0) {
        inventorySizeError.textContent = "Inventory size must be a multiple of 9.";
        isValid = false;
      } else {
        inventorySizeError.textContent = "";
      }
      break;

    case 2: // Step 3: Container
      const containerType = document.getElementById('containerType').value;
      const containerTypeError = document.getElementById('containerTypeError');
      if (containerType === "") {
        containerTypeError.textContent = "Please select a container type.";
        isValid = false;
      } else {
        containerTypeError.textContent = "";
      }
      break;

    case 3: // Step 4: Item
      const itemName = document.getElementById('itemName').value.trim();
      const itemNameError = document.getElementById('itemNameError');
      if (itemName === "") {
        itemNameError.textContent = "Item name cannot be empty.";
        isValid = false;
      } else {
        itemNameError.textContent = "";
      }

      const itemLore = document.getElementById('itemLore').value.trim();
      const itemLoreError = document.getElementById('itemLoreError');
      if (itemLore === "") {
        itemLoreError.textContent = "Item lore cannot be empty.";
        isValid = false;
      } else {
        itemLoreError.textContent = "";
      }
      break;

    case 4: // Step 5: Hologram
      const hologramEnable = document.getElementById('hologramEnable').checked;
      const hologramTitle = document.getElementById('hologramTitle').value.trim();
      const hologramTitleError = document.getElementById('hologramTitleError');

      if (hologramEnable) {
        if (hologramTitle === "") {
          hologramTitleError.textContent = "Hologram title cannot be empty when enabled.";
          isValid = false;
        } else {
          hologramTitleError.textContent = "";
        }
      } else {
        // If hologram is disabled, no need to validate title
        hologramTitleError.textContent = "";
      }
      break;

    case 5: // Step 6: Transportation
      const transportItemName = document.getElementById('transportItemName').value.trim();
      const transportItemNameError = document.getElementById('transportItemNameError');
      if (transportItemName === "") {
        transportItemNameError.textContent = "Transport item name cannot be empty.";
        isValid = false;
      } else {
        transportItemNameError.textContent = "";
      }

      const transportItemLore = document.getElementById('transportItemLore').value.trim();
      const transportItemLoreError = document.getElementById('transportItemLoreError');
      if (transportItemLore === "") {
        transportItemLoreError.textContent = "Transport item lore cannot be empty.";
        isValid = false;
      } else {
        transportItemLoreError.textContent = "";
      }
      break;

    case 6: // Step 7: Shop
      const shopPrice = document.getElementById('shopPrice').value;
      const shopPriceError = document.getElementById('shopPriceError');
      if (shopPrice === "") {
        shopPriceError.textContent = "Shop price cannot be empty.";
        isValid = false;
      } else if (isNaN(shopPrice)) {
        shopPriceError.textContent = "Shop price must be a valid number.";
        isValid = false;
      } else {
        shopPriceError.textContent = "";
      }
      break;

    case 7: // Step 8: Hopper
      // No additional validation needed for checkbox
      break;

    case 8: // Step 9: Pagination
      const previousPageSlot = document.getElementById('previousPageSlot').value;
      const previousPageSlotError = document.getElementById('previousPageSlotError');
      if (previousPageSlot === "") {
        previousPageSlotError.textContent = "Previous page slot cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(previousPageSlot)) || Number(previousPageSlot) < 0) {
        previousPageSlotError.textContent = "Previous page slot must be a non-negative integer.";
        isValid = false;
      } else {
        previousPageSlotError.textContent = "";
      }

      const nextPageSlot = document.getElementById('nextPageSlot').value;
      const nextPageSlotError = document.getElementById('nextPageSlotError');
      if (nextPageSlot === "") {
        nextPageSlotError.textContent = "Next page slot cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(nextPageSlot)) || Number(nextPageSlot) < 0) {
        nextPageSlotError.textContent = "Next page slot must be a non-negative integer.";
        isValid = false;
      } else {
        nextPageSlotError.textContent = "";
      }
      break;

    case 9: // Step 10: Upgrades
      const upgradesEnable = document.getElementById('upgradesEnable').checked;
      const upgradesNextUpgrade = document.getElementById('upgradesNextUpgrade').value.trim();
      const upgradesNextUpgradeError = document.getElementById('upgradesNextUpgradeError');

      if (upgradesEnable) {
        if (upgradesNextUpgrade === "") {
          upgradesNextUpgradeError.textContent = "Next upgrade cannot be empty when upgrades are enabled.";
          isValid = false;
        } else if (/\s/.test(upgradesNextUpgrade)) {
          upgradesNextUpgradeError.textContent = "Next upgrade cannot contain spaces.";
          isValid = false;
        } else {
          upgradesNextUpgradeError.textContent = "";
        }
      } else {
        // If upgrades are disabled, next upgrade can be empty
        upgradesNextUpgradeError.textContent = "";
      }

      const upgradesPrice = document.getElementById('upgradesPrice').value;
      const upgradesPriceError = document.getElementById('upgradesPriceError');
      if (upgradesPrice === "") {
        upgradesPriceError.textContent = "Upgrades price cannot be empty.";
        isValid = false;
      } else if (isNaN(upgradesPrice) || Number(upgradesPrice) < 0) {
        upgradesPriceError.textContent = "Upgrades price must be a non-negative number.";
        isValid = false;
      } else {
        upgradesPriceError.textContent = "";
      }

      const upgradesSlot = document.getElementById('upgradesSlot').value;
      const upgradesSlotError = document.getElementById('upgradesSlotError');
      if (upgradesSlot === "") {
        upgradesSlotError.textContent = "Upgrades slot cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(upgradesSlot)) || Number(upgradesSlot) < 0) {
        upgradesSlotError.textContent = "Upgrades slot must be a non-negative integer.";
        isValid = false;
      } else {
        upgradesSlotError.textContent = "";
      }
      break;

    case 10: // Step 11: Sorters
      const sortersPrice = document.getElementById('sortersPrice').value;
      const sortersPriceError = document.getElementById('sortersPriceError');
      if (sortersPrice === "") {
        sortersPriceError.textContent = "Sorters price cannot be empty.";
        isValid = false;
      } else if (isNaN(sortersPrice) || Number(sortersPrice) < 0) {
        sortersPriceError.textContent = "Sorters price must be a non-negative number.";
        isValid = false;
      } else {
        sortersPriceError.textContent = "";
      }

      const sortersSlot = document.getElementById('sortersSlot').value;
      const sortersSlotError = document.getElementById('sortersSlotError');
      if (sortersSlot === "") {
        sortersSlotError.textContent = "Sorters slot cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(sortersSlot)) || Number(sortersSlot) < 0) {
        sortersSlotError.textContent = "Sorters slot must be a non-negative integer.";
        isValid = false;
      } else {
        sortersSlotError.textContent = "";
      }
      break;

    case 11: // Step 12: Sells
      const sellsMultiplier = document.getElementById('sellsMultiplier').value;
      const sellsMultiplierError = document.getElementById('sellsMultiplierError');
      if (sellsMultiplier === "") {
        sellsMultiplierError.textContent = "Sells multiplier cannot be empty.";
        isValid = false;
      } else if (isNaN(sellsMultiplier) || Number(sellsMultiplier) < 0) {
        sellsMultiplierError.textContent = "Sells multiplier must be a non-negative number.";
        isValid = false;
      } else {
        sellsMultiplierError.textContent = "";
      }

      const sellsSlot = document.getElementById('sellsSlot').value;
      const sellsSlotError = document.getElementById('sellsSlotError');
      if (sellsSlot === "") {
        sellsSlotError.textContent = "Sells slot cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(sellsSlot)) || Number(sellsSlot) < 0) {
        sellsSlotError.textContent = "Sells slot must be a non-negative integer.";
        isValid = false;
      } else {
        sellsSlotError.textContent = "";
      }
      break;

    case 12: // Step 13: Smelter
      const smelterPrice = document.getElementById('smelterPrice').value;
      const smelterPriceError = document.getElementById('smelterPriceError');
      if (smelterPrice === "") {
        smelterPriceError.textContent = "Smelter price cannot be empty.";
        isValid = false;
      } else if (isNaN(smelterPrice) || Number(smelterPrice) < 0) {
        smelterPriceError.textContent = "Smelter price must be a non-negative number.";
        isValid = false;
      } else {
        smelterPriceError.textContent = "";
      }

      const smelterSlot = document.getElementById('smelterSlot').value;
      const smelterSlotError = document.getElementById('smelterSlotError');
      if (smelterSlot === "") {
        smelterSlotError.textContent = "Smelter slot cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(smelterSlot)) || Number(smelterSlot) < 0) {
        smelterSlotError.textContent = "Smelter slot must be a non-negative integer.";
        isValid = false;
      } else {
        smelterSlotError.textContent = "";
      }
      break;

    case 13: // Step 14: Compressor
      const compressorPrice = document.getElementById('compressorPrice').value;
      const compressorPriceError = document.getElementById('compressorPriceError');
      if (compressorPrice === "") {
        compressorPriceError.textContent = "Compressor price cannot be empty.";
        isValid = false;
      } else if (isNaN(compressorPrice) || Number(compressorPrice) < 0) {
        compressorPriceError.textContent = "Compressor price must be a non-negative number.";
        isValid = false;
      } else {
        compressorPriceError.textContent = "";
      }

      const compressorSlot = document.getElementById('compressorSlot').value;
      const compressorSlotError = document.getElementById('compressorSlotError');
      if (compressorSlot === "") {
        compressorSlotError.textContent = "Compressor slot cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(compressorSlot)) || Number(compressorSlot) < 0) {
        compressorSlotError.textContent = "Compressor slot must be a non-negative integer.";
        isValid = false;
      } else {
        compressorSlotError.textContent = "";
      }
      break;

    case 14: // Step 15: Auto Sells
      const autosellsFrequency = document.getElementById('autosellsFrequency').value;
      const autosellsFrequencyError = document.getElementById('autosellsFrequencyError');
      if (autosellsFrequency === "") {
        autosellsFrequencyError.textContent = "Auto sells frequency cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(autosellsFrequency)) || Number(autosellsFrequency) < 0) {
        autosellsFrequencyError.textContent = "Auto sells frequency must be a non-negative integer.";
        isValid = false;
      } else {
        autosellsFrequencyError.textContent = "";
      }

      const autosellsMultiplier = document.getElementById('autosellsMultiplier').value;
      const autosellsMultiplierError = document.getElementById('autosellsMultiplierError');
      if (autosellsMultiplier === "") {
        autosellsMultiplierError.textContent = "Auto sells multiplier cannot be empty.";
        isValid = false;
      } else if (isNaN(autosellsMultiplier) || Number(autosellsMultiplier) < 0) {
        autosellsMultiplierError.textContent = "Auto sells multiplier must be a non-negative number.";
        isValid = false;
      } else {
        autosellsMultiplierError.textContent = "";
      }

      const autosellsTax = document.getElementById('autosellsTax').value;
      const autosellsTaxError = document.getElementById('autosellsTaxError');
      if (autosellsTax === "") {
        autosellsTaxError.textContent = "Auto sells tax cannot be empty.";
        isValid = false;
      } else if (isNaN(autosellsTax) || Number(autosellsTax) < 0 || Number(autosellsTax) > 100) {
        autosellsTaxError.textContent = "Auto sells tax must be between 0 and 100.";
        isValid = false;
      } else {
        autosellsTaxError.textContent = "";
      }

      const autosellsSlot = document.getElementById('autosellsSlot').value;
      const autosellsSlotError = document.getElementById('autosellsSlotError');
      if (autosellsSlot === "") {
        autosellsSlotError.textContent = "Auto sells slot cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(autosellsSlot)) || Number(autosellsSlot) < 0) {
        autosellsSlotError.textContent = "Auto sells slot must be a non-negative integer.";
        isValid = false;
      } else {
        autosellsSlotError.textContent = "";
      }
      break;

    case 16: // Step 17: Search
      const searchEnable = document.getElementById('searchEnable').checked;
      const searchSlot = document.getElementById('searchSlot').value;
      const searchSlotError = document.getElementById('searchSlotError');

      if (searchEnable) {
        if (searchSlot === "") {
          searchSlotError.textContent = "Search slot cannot be empty.";
          isValid = false;
        } else if (!Number.isInteger(Number(searchSlot)) || Number(searchSlot) < 0) {
          searchSlotError.textContent = "Search slot must be a non-negative integer.";
          isValid = false;
        } else {
          searchSlotError.textContent = "";
        }
      } else {
        // If search is disabled, no need to validate slot
        searchSlotError.textContent = "";
      }
      break;
    case 17: // Step: Chunk Collector
      const chunkCollectorSlot = document.getElementById('chunkCollectorSlot').value;
      const chunkCollectorSlotError = document.getElementById('chunkCollectorSlotError');
      if (chunkCollectorSlot === "") {
        chunkCollectorSlotError.textContent = "Chunk collector slot cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(chunkCollectorSlot)) || Number(chunkCollectorSlot) < 0) {
        chunkCollectorSlotError.textContent = "Chunk collector slot must be a non-negative integer.";
        isValid = false;
      } else {
        chunkCollectorSlotError.textContent = "";
      }
      break;

    case 18: // Step 17: Settings
      const settingsSlot = document.getElementById('settingsSlot').value;
      const settingsSlotError = document.getElementById('settingsSlotError');
      if (settingsSlot === "") {
        settingsSlotError.textContent = "Settings slot cannot be empty.";
        isValid = false;
      } else if (!Number.isInteger(Number(settingsSlot)) || Number(settingsSlot) < 0) {
        settingsSlotError.textContent = "Settings slot must be a non-negative integer.";
        isValid = false;
      } else {
        settingsSlotError.textContent = "";
      }
      break;

    case 19: // Step 18: Crafting
      const craftingEnable = document.getElementById('craftingEnable').checked;
      const craftingItems = document.getElementById('craftingItems').value.trim();
      const craftingItemsError = document.getElementById('craftingItemsError');
      const craftingRecipe = document.getElementById('craftingRecipe').value.trim();
      const craftingRecipeError = document.getElementById('craftingRecipeError');

      if (craftingEnable) {
        if (craftingItems === "") {
          craftingItemsError.textContent = "Crafting items cannot be empty when crafting is enabled.";
          isValid = false;
        } else {
          craftingItemsError.textContent = "";
        }

        if (craftingRecipe === "") {
          craftingRecipeError.textContent = "Crafting recipe cannot be empty when crafting is enabled.";
          isValid = false;
        } else {
          craftingRecipeError.textContent = "";
        }
      } else {
        // If crafting is disabled, no need to validate
        craftingItemsError.textContent = "";
        craftingRecipeError.textContent = "";
      }
      break;

    default:
      break;
  }

  return isValid;
}

function validateAllSteps() {
  let allValid = true;
  for (let i = 0; i < steps.length; i++) {
    if (!validateStep(i)) {
      allValid = false;
      // Navigate to the first invalid step
      if (allValid === false) {
        currentStep = i;
        showStep(currentStep);
        break; // Exit the loop after navigating to the first invalid step
      }
    }
  }
  return allValid;
}

// Initialize the first step
showStep(currentStep);

// Event listeners for navigation
function nextStep() {
  if (currentStep < steps.length - 1) {
    if (validateStep(currentStep)) {
      currentStep++;
      showStep(currentStep);
    }
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// Allow clicking on progress bar steps to navigate
progressItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    if (index <= currentStep) {
      currentStep = index;
      showStep(currentStep);
    }
  });
});
