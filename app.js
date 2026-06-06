const form = document.getElementById("consultationForm");
const submitButton = document.getElementById("submitButton");
const errorBox = document.getElementById("errorBox");
const resultSection = document.getElementById("resultSection");
const knowledgeLibrary = document.getElementById("knowledgeLibrary");

const resultTitle = document.getElementById("resultTitle");
const resultSuggestion = document.getElementById("resultSuggestion");
const resultTapeMethod = document.getElementById("resultTapeMethod");
const resultWarning = document.getElementById("resultWarning");
const resultDepartment = document.getElementById("resultDepartment");

const lineUserIdInput = document.getElementById("line_user_id");
const lineDisplayNameInput = document.getElementById("line_display_name");

const config = window.APP_CONFIG || {};
const apiBaseUrl = (config.API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const liffId = config.LIFF_ID || "";

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function showResult(data) {
  resultTitle.textContent = data.title || "查詢結果";
  resultSuggestion.textContent = data.suggestion || "-";
  resultTapeMethod.textContent =
    data.tape_method || "目前沒有可直接提供的貼紮建議。";
  resultWarning.textContent = data.warning || "若症狀持續或惡化，請盡快就醫。";
  resultDepartment.textContent =
    data.recommended_department || "請依症狀考慮骨科或復健科評估。";
  resultSection.classList.remove("hidden");
}

function getBooleanValue(name) {
  return Boolean(form.elements[name]?.checked);
}

function getFormData() {
  return {
    name: form.elements.name.value.trim(),
    age: form.elements.age.value ? Number(form.elements.age.value) : null,
    pain_area: form.elements.pain_area.value,
    pain_reason: form.elements.pain_reason.value,
    pain_level: form.elements.pain_level.value ? Number(form.elements.pain_level.value) : null,
    swelling: getBooleanValue("swelling"),
    bruise: getBooleanValue("bruise"),
    numbness: getBooleanValue("numbness"),
    weakness: getBooleanValue("weakness"),
    unable_to_walk: getBooleanValue("unable_to_walk"),
    wound: getBooleanValue("wound"),
    suspected_fracture: getBooleanValue("suspected_fracture"),
    duration: form.elements.duration.value.trim(),
    line_user_id: lineUserIdInput.value.trim(),
    line_display_name: lineDisplayNameInput.value.trim()
  };
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderKnowledgeLibrary(groups) {
  if (!knowledgeLibrary) {
    return;
  }

  if (!Array.isArray(groups) || groups.length === 0) {
    knowledgeLibrary.innerHTML =
      '<p class="section-note">目前沒有可顯示的影片資料。</p>';
    return;
  }

  knowledgeLibrary.innerHTML = groups
    .map((group) => {
      const cards = (Array.isArray(group.items) ? group.items : [])
        .map(
          (item) => `
            <article class="video-card">
              <p class="video-type">${escapeHtml(item.tapingType)}｜${escapeHtml(item.subPart)}</p>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.purpose)}</p>
              <p class="video-desc">${escapeHtml(item.description)}</p>
              <a href="${escapeHtml(item.videoUrl)}" target="_blank" rel="noreferrer">觀看影片</a>
            </article>
          `
        )
        .join("");

      return `
        <section class="library-group">
          <h3>${escapeHtml(group.category)}</h3>
          <div class="video-grid">${cards}</div>
        </section>
      `;
    })
    .join("");
}

async function loadKnowledgeLibrary() {
  if (!knowledgeLibrary) {
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/taping-knowledge`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "影片資料載入失敗。");
    }

    renderKnowledgeLibrary(result.data);
  } catch (error) {
    console.error("Load knowledge library failed:", error);
    knowledgeLibrary.innerHTML =
      '<p class="section-note">影片資料暫時無法載入，請稍後再試。</p>';
  }
}

async function initLiff() {
  if (!window.liff || !liffId) {
    return;
  }

  try {
    await window.liff.init({ liffId });

    if (!window.liff.isLoggedIn()) {
      return;
    }

    if (window.liff.isInClient()) {
      const profile = await window.liff.getProfile();
      lineUserIdInput.value = profile.userId || "";
      lineDisplayNameInput.value = profile.displayName || "";
    }
  } catch (error) {
    console.error("LIFF init failed:", error);
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  hideError();
  resultSection.classList.add("hidden");
  submitButton.disabled = true;
  submitButton.textContent = "送出中...";

  try {
    const payload = getFormData();

    const response = await fetch(`${apiBaseUrl}/api/consultation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "送出查詢失敗。");
    }

    showResult(result.data);
  } catch (error) {
    console.error(error);
    showError(error.message || "系統忙碌中，請稍後再試。");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "送出查詢";
  }
}

form.addEventListener("submit", handleSubmit);
initLiff();
loadKnowledgeLibrary();
