const baseURL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Cache DOM elements
function getDOMElements() {
    return {
        selects: document.querySelectorAll("select"),
        button: document.querySelector("button"),
        swap: document.querySelector("#swap"),
        msg: document.querySelector("#msg"),
        images: document.querySelectorAll(".select-container img"),
        amountInput: document.querySelector(".amount input"),
    };
}

// Populate currency dropdowns
function populateDropdowns(selects) {
    selects.forEach((select) => {
        for (const [country, currency] of Object.entries(countryCurrency)) {
            if (!currency) continue; // skip null currencies

            const option = document.createElement("option");
            option.innerText = `${country} - ${currency}`;
            option.value = country;

            if (select.name === "from" && country === "US") { option.selected = true };
            if (select.name === "to" && country === "IN") { option.selected = true };

            select.append(option);
        }
    });
}

// Update flag image
function updateFlag(e) {
    const img = e.target.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${e.target.value}/flat/64.png`;
}

// Fetch & convert currency
async function convertCurrency(selects, amountInput, msg) {
    const amount = amountInput.value;

    if (!amount || amount <= 0 || isNaN(amount)) {
        msg.innerText = "Please enter a valid amount";
        msg.style.backgroundColor = "#f00"
        return;
    }

    const fromCurr = countryCurrency[selects[0].value].toLowerCase();
    const toCurr = countryCurrency[selects[1].value].toLowerCase();

    try {
        const response = await fetch(`${baseURL}/${fromCurr}.json`);
        const data = await response.json();
        const rate = data[fromCurr][toCurr];

        msg.innerHTML = `
            ${amount} ${currencySymbols[fromCurr.toUpperCase()]} =
            ${(amount * rate).toFixed(2)} ${currencySymbols[toCurr.toUpperCase()]}
        `;
        msg.style.backgroundColor = "#000000ab"
    } catch {
        msg.innerText = "Error fetching exchange rate";
        msg.style.backgroundColor = "#fb542b"
    }
}

// Swap currencies & flags
function swapCurrencies(selects, images) {
    [selects[0].value, selects[1].value] = [selects[1].value, selects[0].value];

    [images[0].src, images[1].src] = [images[1].src, images[0].src];
}

// Attach listeners
function attachEventListeners(dom) {
    dom.selects.forEach((select) => {
        select.addEventListener("change", updateFlag)
    });

    dom.button.addEventListener("click", (e) => {
        e.preventDefault();
        convertCurrency(dom.selects, dom.amountInput, dom.msg);
    });

    dom.swap.addEventListener("click", () => {
        swapCurrencies(dom.selects, dom.images)
    });
}

/* -------------------- MAIN -------------------- */

function main() {
    // 1. Get DOM
    const dom = getDOMElements();

    // 2. Populate UI
    populateDropdowns(dom.selects);

    // 3. Attach events
    attachEventListeners(dom);
}

/* -------------------- INVOKE MAIN -------------------- */

main();
