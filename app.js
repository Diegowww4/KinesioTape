const form = document.getElementById("consultationForm");
const submitButton = document.getElementById("submitButton");
const errorBox = document.getElementById("errorBox");
const resultSection = document.getElementById("resultSection");
const knowledgeLibrary = document.getElementById("knowledgeLibrary");
const systemStatus = document.getElementById("systemStatus");
const dailyReminderTitle = document.getElementById("dailyReminderTitle");
const dailyReminderDate = document.getElementById("dailyReminderDate");
const dailyReminderBody = document.getElementById("dailyReminderBody");
const dailyReminderList = document.getElementById("dailyReminderList");

const resultTitle = document.getElementById("resultTitle");
const resultSuggestion = document.getElementById("resultSuggestion");
const resultTapeMethod = document.getElementById("resultTapeMethod");
const resultWarning = document.getElementById("resultWarning");
const resultDepartment = document.getElementById("resultDepartment");

const lineUserIdInput = document.getElementById("line_user_id");
const lineDisplayNameInput = document.getElementById("line_display_name");

const config = window.APP_CONFIG || {};
const apiBaseUrl = String(config.API_BASE_URL || "").trim().replace(/\/$/, "");
const liffId = config.LIFF_ID || "";
const siteUrl = config.SITE_URL || "https://diegowww4.github.io/KinesioTape/";

const MEDICAL_REMINDER =
  "本系統僅供貼紮教學與初步參考，不提供正式醫療診斷。如症狀持續、加重，或出現危險訊號，請盡快就醫。";

const DAILY_REMINDERS = [
  {
    title: "先看提醒，再做貼紮判斷",
    body: `今天若要查詢貼紮方式，請先打開網站 ${siteUrl}，確認安全提醒與症狀表單，再決定是否繼續貼紮。`,
    points: [
      "先確認是否有骨折、麻木、無力或無法行走。",
      "再填寫疼痛部位、症狀描述與疼痛分數。",
      "最後搭配影片查詢，不要只憑印象自行處理。"
    ]
  },
  {
    title: "急性疼痛不要只靠貼布",
    body: `若今天疼痛比昨天更明顯，請先到網站 ${siteUrl} 查看安全提醒；高風險狀況應優先就醫，不要只依賴貼紮。`,
    points: [
      "疼痛 8 分以上通常不適合先自行貼紮。",
      "有腫脹合併劇痛時，先休息與觀察更重要。",
      "若有變形、流血或感染跡象，請直接就醫。"
    ]
  },
  {
    title: "看影片前先確認貼紮目標",
    body: `今天建議先從網站 ${siteUrl} 選擇正確部位，再看對應影片，避免貼錯位置或選錯貼布類型。`,
    points: [
      "白貼較偏固定，肌貼較偏輔助與動作提醒。",
      "同樣是腳踝不適，急性扭傷與恢復期貼法不同。",
      "先分清楚是痠痛、拉傷、扭傷還是不穩。"
    ]
  },
  {
    title: "每天查詢前先做自我檢查",
    body: `使用前請先打開 ${siteUrl} 做一次快速檢查，確認今天的症狀是否比昨天更嚴重，避免錯把醫療問題當成一般貼紮問題。`,
    points: [
      "活動範圍是否明顯變差。",
      "腫脹或瘀青是否比昨天更明顯。",
      "是否開始出現麻、無力、踩地痛或夜間痛。"
    ]
  }
];

const LOCAL_KNOWLEDGE = [
  {
    category: "肩頸與肩膀",
    subPart: "肩頸",
    tapingType: "肌貼",
    title: "肩頸緊繃放鬆貼法",
    purpose: "協助肩頸緊繃與久坐痠痛時的基本支撐與放鬆。",
    description: "適合長時間久坐、姿勢不良或訓練後的肩頸緊繃情況。",
    videoUrl: "https://youtube.com/shorts/YGo2BwNPQqQ?si=XrauyhpAb0uyydqT",
    keywords: ["肩頸", "痠痛", "緊繃"]
  },
  {
    category: "肩頸與肩膀",
    subPart: "肩膀",
    tapingType: "肌貼",
    title: "肩膀穩定貼法",
    purpose: "提供肩膀活動時的穩定感與動作提醒。",
    description: "適合肩膀不穩、活動時有拉扯感的人。",
    videoUrl: "https://youtube.com/shorts/MQSEO5xe6QU?si=TpwMwenvEV71lWkf",
    keywords: ["肩膀", "不穩", "舉手會痛"]
  },
  {
    category: "手腕與手指",
    subPart: "手腕",
    tapingType: "白貼",
    title: "手腕固定貼法",
    purpose: "減少手腕過度活動，提供較直接的固定支撐。",
    description: "較適合急性期或需要較高穩定度的情況。",
    videoUrl: "https://youtu.be/vLVX8Am9McQ?si=kLk61yw5OZQFoZzp",
    keywords: ["手腕", "扭傷", "不穩"]
  },
  {
    category: "手腕與手指",
    subPart: "手指",
    tapingType: "白貼",
    title: "手指挫傷固定貼法",
    purpose: "提供手指挫傷或戳傷後的保護與固定。",
    description: "常見於球類運動後手指撞擊不適。",
    videoUrl: "https://youtu.be/O3BLtpWi-3A?si=ljQR4nTPZPoU_4t7",
    keywords: ["手指", "挫傷", "扭傷"]
  },
  {
    category: "軀幹",
    subPart: "下背",
    tapingType: "肌貼",
    title: "下背痠痛貼法",
    purpose: "協助下背肌群支撐，減少日常活動時的不適感。",
    description: "適合一般肌肉痠痛或訓練後緊繃。",
    videoUrl: "https://youtube.com/shorts/NqpK5xGie5w?si=jdOu1uPjF9kNJSbo",
    keywords: ["下背", "痠痛", "緊繃"]
  },
  {
    category: "腿部",
    subPart: "大腿",
    tapingType: "肌貼",
    title: "大腿拉傷貼法",
    purpose: "協助大腿肌肉拉傷後的支撐與動作保護。",
    description: "適合運動後拉扯感或局部痠痛。",
    videoUrl: "https://youtube.com/shorts/VSrnONiM7lQ?si=O_IPmQe_OmqWMuk8",
    keywords: ["大腿", "拉傷", "痠痛"]
  },
  {
    category: "腿部",
    subPart: "小腿",
    tapingType: "肌貼",
    title: "小腿拉傷貼法",
    purpose: "降低小腿活動時的不適感並提供肌肉支撐。",
    description: "適合小腿拉傷、緊繃或跑步後不適。",
    videoUrl: "https://youtube.com/shorts/McUE1MpXLao?si=HBn4kHBForda-9z6",
    keywords: ["小腿", "拉傷", "痠痛"]
  },
  {
    category: "腳踝與足底",
    subPart: "腳踝",
    tapingType: "白貼",
    title: "腳踝扭傷固定貼法",
    purpose: "提供腳踝扭傷後較高的固定與保護。",
    description: "適合急性扭傷後需要較高穩定度的情況。",
    videoUrl: "https://youtu.be/Tj3HhyfAP_w?si=5E7CKjUL_Zroy56d",
    keywords: ["腳踝", "扭傷", "走路會痛"]
  },
  {
    category: "腳踝與足底",
    subPart: "足底",
    tapingType: "肌貼",
    title: "足底支撐貼法",
    purpose: "協助足底不適、足弓疲勞或長時間站立後的支撐。",
    description: "適合足底痠痛與支撐需求。",
    videoUrl: "https://youtube.com/shorts/7mVS3dd7o2E?si=HBXy4xDiKl0ryfkP",
    keywords: ["足底", "痠痛", "足弓"]
  }
];

const RULES = {
  肩頸: {
    possibleCondition: "常見為肌肉緊繃、姿勢性痠痛或訓練後疲勞。",
    tapeMethod: "可先參考肩頸肌貼放鬆貼法。",
    warning: "若有手麻、手無力、頭暈或劇烈疼痛，不應只靠貼紮處理。",
    recommendedDepartment: "復健科、骨科或物理治療評估"
  },
  肩膀: {
    possibleCondition: "可能是肩膀活動控制不佳、肌肉拉扯或運動後不穩。",
    tapeMethod: "可參考肩膀穩定型肌貼。",
    warning: "若舉手劇痛、懷疑脫臼或夜間痛明顯，請先就醫。",
    recommendedDepartment: "骨科、復健科或運動醫學門診"
  },
  手腕: {
    possibleCondition: "可能是手腕扭傷、過度使用或支撐不足。",
    tapeMethod: "可先用白貼做基本固定，恢復期再考慮肌貼。",
    warning: "若出現麻木、明顯腫脹或變形，請先停止貼紮並就醫。",
    recommendedDepartment: "骨科或復健科"
  },
  手指: {
    possibleCondition: "常見為戳傷、挫傷或小關節扭傷。",
    tapeMethod: "可參考手指固定貼法。",
    warning: "若手指無法彎曲、明顯歪斜或腫痛快速加劇，請先就醫。",
    recommendedDepartment: "骨科"
  },
  下背: {
    possibleCondition: "常見為肌肉緊繃、姿勢性下背不適或訓練後痠痛。",
    tapeMethod: "可參考下背肌貼支撐貼法。",
    warning: "若合併腿麻、無力或突發劇痛，應先就醫，不建議只靠貼紮。",
    recommendedDepartment: "復健科、骨科"
  },
  大腿: {
    possibleCondition: "可能是肌肉拉傷、過度使用或運動後疲勞。",
    tapeMethod: "可參考大腿肌貼支撐貼法。",
    warning: "若疼痛大幅影響行走、瘀青明顯擴大或懷疑撕裂，請先就醫。",
    recommendedDepartment: "骨科、復健科或運動醫學門診"
  },
  小腿: {
    possibleCondition: "可能是小腿拉傷、抽筋後緊繃或跑步過度使用。",
    tapeMethod: "可參考小腿肌貼支撐貼法。",
    warning: "若紅腫熱痛明顯或踩地困難，請優先就醫評估。",
    recommendedDepartment: "骨科、復健科"
  },
  腳踝: {
    possibleCondition: "常見為腳踝扭傷、韌帶拉扯或穩定度不足。",
    tapeMethod: "急性期可優先考慮白貼固定，恢復期再用肌貼做穩定輔助。",
    warning: "若無法行走、懷疑骨折或腫脹劇烈，不建議自行貼紮。",
    recommendedDepartment: "骨科、急診或運動醫學門診"
  },
  足底: {
    possibleCondition: "可能與足底筋膜壓力、久站疲勞或支撐不足有關。",
    tapeMethod: "可參考足底支撐型肌貼。",
    warning: "若踩地劇痛、腫脹明顯或近期有外傷，請優先就醫。",
    recommendedDepartment: "復健科、骨科"
  }
};

const URGENT_KEYWORDS = ["骨折", "不能走", "無法走", "動不了", "麻", "無力", "流血", "傷口", "變形", "劇痛", "胸痛", "呼吸困難", "昏倒", "感染"];

function getTaipeiDate() {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  }).format(new Date());
}

function setSystemStatus(message, kind = "local") {
  if (!systemStatus) {
    return;
  }

  systemStatus.textContent = message;
  systemStatus.dataset.kind = kind;
}

function renderDailyReminder() {
  if (!dailyReminderTitle || !dailyReminderDate || !dailyReminderBody || !dailyReminderList) {
    return;
  }

  const today = new Date();
  const reminder = DAILY_REMINDERS[today.getDate() % DAILY_REMINDERS.length];

  dailyReminderTitle.textContent = reminder.title;
  dailyReminderDate.textContent = getTaipeiDate();
  dailyReminderBody.textContent = reminder.body;
  dailyReminderList.innerHTML = reminder.points
    .map((point) => `<li>${point}</li>`)
    .join("");
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function showResult(data) {
  resultTitle.textContent = data.title || "已完成初步判斷";
  resultSuggestion.textContent = data.suggestion || "-";
  resultTapeMethod.textContent = data.tape_method || "目前沒有適合直接貼紮的建議。";
  resultWarning.textContent = data.warning || MEDICAL_REMINDER;
  resultDepartment.textContent = data.recommended_department || "建議由骨科、復健科或物理治療專業人員評估。";
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

function groupKnowledge(items) {
  const orderedCategories = ["肩頸與肩膀", "手腕與手指", "軀幹", "腿部", "腳踝與足底"];

  return orderedCategories
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category)
    }))
    .filter((group) => group.items.length > 0);
}

function renderKnowledgeLibrary(groups) {
  if (!knowledgeLibrary) {
    return;
  }

  if (!Array.isArray(groups) || groups.length === 0) {
    knowledgeLibrary.innerHTML = '<p class="section-note">目前沒有可顯示的教學資料。</p>';
    return;
  }

  knowledgeLibrary.innerHTML = groups
    .map((group) => {
      const cards = group.items
        .map(
          (item) => `
            <article class="video-card">
              <p class="video-type">${escapeHtml(item.tapingType)}｜${escapeHtml(item.subPart)}</p>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.purpose)}</p>
              <p class="video-desc">${escapeHtml(item.description)}</p>
              <a href="${escapeHtml(item.videoUrl)}" target="_blank" rel="noreferrer">觀看教學影片</a>
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

function scoreKnowledge(payload, item) {
  const searchText = [payload.pain_area, payload.pain_reason, payload.duration]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return item.keywords.reduce((score, keyword) => {
    return searchText.includes(String(keyword).toLowerCase()) ? score + 2 : score;
  }, item.subPart === payload.pain_area ? 3 : 0);
}

function findBestKnowledge(payload) {
  return [...LOCAL_KNOWLEDGE]
    .map((item) => ({ item, score: scoreKnowledge(payload, item) }))
    .sort((a, b) => b.score - a.score)[0]?.item || null;
}

function buildUrgentResult() {
  return {
    title: "目前屬於高風險狀況，不建議先自行貼紮",
    suggestion: "請先停止活動，優先由醫療專業人員評估。",
    tape_method: "暫不建議自行貼紮處理。",
    warning:
      "你填寫的疼痛分數或危險訊號顯示目前不適合先依賴貼紮。若有骨折疑慮、無法行走、麻木、無力、傷口或症狀快速惡化，請直接就醫。",
    recommended_department: "急診、骨科、復健科或運動醫學門診"
  };
}

function buildLocalAnalysis(payload) {
  const painLevel = Number(payload.pain_level || 0);
  const combinedText = [payload.pain_area, payload.pain_reason, payload.duration]
    .filter(Boolean)
    .join(" ");

  const hasUrgentKeyword = URGENT_KEYWORDS.some((keyword) => combinedText.includes(keyword));
  const isUrgent =
    painLevel >= 8 ||
    payload.suspected_fracture ||
    payload.unable_to_walk ||
    payload.wound ||
    payload.numbness ||
    payload.weakness ||
    (payload.swelling && painLevel >= 7) ||
    hasUrgentKeyword;

  if (isUrgent) {
    return buildUrgentResult();
  }

  const rule = RULES[payload.pain_area];
  const matchedKnowledge = findBestKnowledge(payload);

  if (!rule) {
    return {
      title: "目前沒有對應的標準貼紮規則",
      suggestion: "可先改用休息、冰敷與減少刺激動作，並交由專業人員評估。",
      tape_method: matchedKnowledge ? `可先參考：${matchedKnowledge.title}` : "暫時不建議自行貼紮。",
      warning: MEDICAL_REMINDER,
      recommended_department: "骨科、復健科或物理治療評估"
    };
  }

  return {
    title: "可先做初步貼紮參考",
    suggestion: rule.possibleCondition,
    tape_method: matchedKnowledge
      ? `${rule.tapeMethod}\n推薦影片：${matchedKnowledge.title}`
      : rule.tapeMethod,
    warning: `${rule.warning} ${MEDICAL_REMINDER}`,
    recommended_department: rule.recommendedDepartment
  };
}

async function tryLoadRemoteKnowledge() {
  if (!apiBaseUrl) {
    return null;
  }

  const response = await fetch(`${apiBaseUrl}/api/taping-knowledge`);
  const result = await response.json();

  if (!response.ok || !result.success || !Array.isArray(result.data)) {
    throw new Error(result.message || "遠端知識庫回傳格式不正確。");
  }

  return result.data;
}

async function loadKnowledgeLibrary() {
  if (!knowledgeLibrary) {
    return;
  }

  try {
    const remoteGroups = await tryLoadRemoteKnowledge();
    if (remoteGroups) {
      renderKnowledgeLibrary(remoteGroups);
      setSystemStatus("目前使用遠端 API 模式", "remote");
      return;
    }
  } catch (error) {
    console.warn("Remote knowledge unavailable, fallback to local mode.", error);
  }

  renderKnowledgeLibrary(groupKnowledge(LOCAL_KNOWLEDGE));
  setSystemStatus("目前使用前端獨立模式", "local");
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

async function submitToRemoteApi(payload) {
  if (!apiBaseUrl) {
    return null;
  }

  const response = await fetch(`${apiBaseUrl}/api/consultation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "遠端分析失敗。");
  }

  return result.data;
}

async function handleSubmit(event) {
  event.preventDefault();
  hideError();
  resultSection.classList.add("hidden");
  submitButton.disabled = true;
  submitButton.textContent = "分析中...";

  try {
    const payload = getFormData();

    if (!payload.pain_area || !payload.pain_reason || !payload.pain_level) {
      throw new Error("請先完整填寫主要部位、症狀描述與疼痛分數。");
    }

    let data = null;

    try {
      data = await submitToRemoteApi(payload);
      if (data) {
        setSystemStatus("目前使用遠端 API 模式", "remote");
      }
    } catch (remoteError) {
      console.warn("Remote submit unavailable, fallback to local analysis.", remoteError);
      data = buildLocalAnalysis(payload);
      setSystemStatus("目前使用前端獨立模式", "local");
    }

    showResult(data);
  } catch (error) {
    console.error(error);
    showError(error.message || "系統忙碌中，請稍後再試。");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "送出查詢";
  }
}

form.addEventListener("submit", handleSubmit);
renderDailyReminder();
initLiff();
loadKnowledgeLibrary();
