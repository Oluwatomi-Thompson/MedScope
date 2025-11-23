// Select some elements
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const contentDiv = document.getElementById("content");


// some international drug names to their US equavalients
const drugNameMap = {
  "paracetamol": "acetaminophen",
  "panadol": "acetaminophen",
  "calpol": "acetaminophen",
  "crocin": "acetaminophen",
  "metacin": "acetaminophen",
  "ibugesic": "ibuprofen",
  "brufen": "ibuprofen"

};

//  event listeners for search button and enter key
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query === "") return alert("Please enter a medicine name.");

  fetchMedicineData(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// function to fetch data from FDA api
async function fetchMedicineData(medicineName) {
  clearOldResults();

  const loadingMsg = showLoading();

  try {
    const lowerName = medicineName.toLowerCase();
    const searchName = drugNameMap[lowerName] || medicineName;

    const queries = [
      `openfda.brand_name:"${searchName}"`,
      `openfda.generic_name:"${searchName}"`,
      `openfda.substance_name:"${searchName}"`,
      `"${searchName}"`
    ];

    let data = null;

    // Try each query until one of them returns a result
    for (let q of queries) {
      const url = `https://api.fda.gov/drug/label.json?search=${q}&limit=1`;
      const res = await fetch(url);

      if (res.ok) {
        const json = await res.json();
        if (json.results && json.results.length > 0) {
          data = json;
          break;
        }
      }
    }

    loadingMsg.remove();

    // Show the mapped name message
    if (lowerName !== searchName && data) {
      showSuggestion(searchName, medicineName);
    }

    displayMedicineData(data);

  } catch (err) {
    console.error(err);
    alert("Something went wrong fetching the medicine data.");
    loadingMsg.remove();
  }
}

// remove the previous search results
function clearOldResults() {
  document.getElementById("results")?.remove();
  document.getElementById("loading")?.remove();
  document.querySelector(".no-results")?.remove();
  document.querySelectorAll(".suggestion").forEach(el => el.remove());
}

// loding indicator
function showLoading() {
  const p = document.createElement("p");
  p.id = "loading";
  p.textContent = "Loading medicine info...";
  p.style.color = "#0FF6FF";
  p.style.marginTop = "20px";
  contentDiv.appendChild(p);
  return p;
}

// show suggestion for mapped drug name
function showSuggestion(mapped, original) {
  const msg = document.createElement("p");
  msg.classList.add("suggestion");
  msg.textContent = `Showing results for "${mapped}" (US equivalent of "${original}")`;
  msg.style.color = "#58A6FF";
  msg.style.fontStyle = "italic";
  msg.style.fontSize = "14px";
  msg.style.marginTop = "8px";
  contentDiv.appendChild(msg);
}

// show truncated text with toggle
function truncate(text, length = 300) {
  if (!text) return { short: "Not available", full: "", needsToggle: false };
  if (text.length <= length)
    return { short: text, full: text, needsToggle: false };

  return {
    short: text.slice(0, length) + "...",
    full: text,
    needsToggle: true,
  };
}
// show the results
function displayMedicineData(data) {
  if (!data || !data.results || data.results.length === 0) {
    const msg = document.createElement("p");
    msg.textContent =
      "No results found. Try another name or brand.";
    msg.classList.add("no-results");
    msg.style.color = "#C9D1D9";
    contentDiv.appendChild(msg);
    return;
  }

  const med = data.results[0];

  // Extract fields
  const name =
    med.openfda.brand_name?.[0] ||
    med.openfda.generic_name?.[0] ||
    "Unknown Medicine";

  const genericName = med.openfda.generic_name?.[0] || null;
  const manufacturer = med.openfda.manufacturer_name?.[0] || "Unknown";

  const purpose = med.purpose?.[0] || med.indications_and_usage?.[0] || "";
  const active = med.active_ingredient?.join(", ") || null;
  const dosage = med.dosage_and_administration?.[0] || "";
  const howToUse =
    med.information_for_patients?.[0] ||
    med.patient_medication_information?.[0] ||
    "";
  const storage = med.storage_and_handling?.[0] || "";

  // Truncate text fields
  const tPurpose = truncate(purpose);
  const tDosage = truncate(dosage);
  const tUse = truncate(howToUse);
  const tStorage = truncate(storage, 200);

// build card to show results
  const card = document.createElement("div");
  card.id = "results";
  card.classList.add("card");

  card.innerHTML = `
    <h2 style="color:#0FF6FF; margin-bottom: 15px;">${name}</h2>

    ${
      genericName && genericName !== name
        ? `<p><strong style="color:#58A6FF;">Generic Name:</strong> ${genericName}</p>`
        : ""
    }

    <p style="margin-top:10px;">
      <strong style="color:#58A6FF;">Manufacturer:</strong> ${manufacturer}
    </p>

    ${
      active
        ? `<p style="margin-top:15px;"><strong style="color:#58A6FF;">Active Ingredients:</strong> ${active}</p>`
        : ""
    }

    ${makeSection("Purpose / Indications", "purposeText", tPurpose)}
    ${makeSection("How to Use", "useText", tUse)}
    ${makeSection("Dosage & Administration", "dosageText", tDosage)}
    ${makeSection("Storage", "storageText", tStorage)}

    <p style="margin-top:20px; border-top:1px solid #30363D; padding-top:15px; font-size:13px; color:#8B949E;">
      <strong>Note:</strong> Always consult a healthcare provider before taking medicine.
    </p>
  `;

  contentDiv.appendChild(card);

  setupToggles(card);
}

//-----------------------------------------
// BUILD A COLLAPSIBLE SECTION
//-----------------------------------------
function makeSection(title, id, textObj) {
  return `
    <div style="margin-top:20px;">
      <p><strong style="color:#58A6FF;">${title}:</strong></p>
      <p id="${id}" style="margin-left: 10px; margin-top: 5px;">${textObj.short}</p>
      ${
        textObj.needsToggle
          ? `<button class="toggle-btn" 
                 data-target="${id}" 
                 data-full="${encodeURIComponent(textObj.full)}" 
                 data-short="${encodeURIComponent(textObj.short)}">
               Show more
             </button>`
          : ""
      }
    </div>
  `;
}

//-----------------------------------------
// TOGGLE BUTTON LOGIC
//-----------------------------------------
function setupToggles(card) {
  const buttons = card.querySelectorAll(".toggle-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetID = btn.dataset.target;
      const full = decodeURIComponent(btn.dataset.full);
      const short = decodeURIComponent(btn.dataset.short);
      const element = document.getElementById(targetID);

      if (btn.textContent === "Show more") {
        element.textContent = full;
        btn.textContent = "Show less";
      } else {
        element.textContent = short;
        btn.textContent = "Show more";
      }
    });
  });
}
