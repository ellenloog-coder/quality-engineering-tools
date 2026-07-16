(() => {
  const AI_WORKER_URL = "https://quality-tools-ai-assistant.quality-tools-ai-assistant.workers.dev";
  const HISTORY_LIMIT = 8;

  const workspace = document.getElementById("aiWorkspace");
  const form = document.getElementById("aiForm");
  const input = document.getElementById("aiInput");
  const sendButton = document.getElementById("aiSendButton");
  const clearButton = document.getElementById("aiClearButton");
  const titleEl = document.querySelector(".ai-panel-title");
  const statusEl = document.querySelector(".ai-panel-status span:last-child");
  const privacyEl = document.querySelector(".ai-privacy-note");
  const noteEl = document.querySelector(".ai-form-note");
  let waiting = false;
  let aiOpened = false;
  let messages = [];
  let lastQuestion = "";

  const copy = {
    en: {
      title: "AI Quality Assistant",
      status: "AI assistant is ready",
      intro: "Ask any quality engineering question, or get help choosing the right analysis tool.",
      privacy: "Please avoid entering customer, supplier, product, or other sensitive information.",
      placeholder: "Ask any quality engineering question...",
      note: "AI guidance is for engineering reference and does not replace formal engineering approval.",
      quick: [
        "What is Cpk?",
        "Which quality tool should I use?",
        "How should I start investigating a customer complaint?",
        "Should I perform MSA or capability analysis first?",
        "How can I plan supplier improvement actions?"
      ],
      retry: "Retry",
      cancel: "Cancel",
      unavailable: "AI interpretation is temporarily unavailable. Please try again later.",
      helpful: "Helpful",
      notHelpful: "Not helpful",
      thanks: "Thanks. Feedback recorded.",
      toolPrefix: "Deterministic tool recommendation",
      openTool: "Open tool",
      comingSoon: "Coming soon"
    },
    zh: {
      title: "AI 质量助手",
      status: "AI 助手已就绪",
      intro: "询问任何质量工程问题，或让我帮助你选择合适的分析工具。",
      privacy: "请避免输入客户、供应商、产品名称或其他敏感信息。",
      placeholder: "询问任何质量工程问题……",
      note: "AI 内容仅供工程参考，不能替代正式工程审批。",
      quick: [
        "什么是 Cpk？",
        "我应该使用哪个质量工具？",
        "客诉问题应该如何开始调查？",
        "MSA 和过程能力分析应该先做哪个？",
        "如何制定供应商改善计划？"
      ],
      retry: "重试",
      cancel: "取消",
      unavailable: "AI 工程解读暂时不可用，请稍后重试。",
      helpful: "有帮助",
      notHelpful: "没有帮助",
      thanks: "谢谢，反馈已记录。",
      toolPrefix: "确定性工具推荐",
      openTool: "打开工具",
      comingSoon: "即将推出"
    }
  };

  const toolRoutes = {
    capability: {
      name: "Process Capability Analysis",
      zhName: "过程能力分析",
      url: "https://ellenloog-coder.github.io/process-capability-analysis-tool/",
      comingSoon: false,
      reason: {
        en: "Use this when the engineering question is whether a process can consistently meet specification limits.",
        zh: "当工程问题是过程能否持续满足规格限时，使用过程能力分析。"
      }
    },
    measurement: {
      name: "Measurement System Analysis",
      zhName: "测量系统分析",
      url: "https://ellenloog-coder.github.io/measurement-system-analysis-tool/",
      comingSoon: false,
      reason: {
        en: "Use this when the question is whether the measurement or inspection system is reliable enough for decisions.",
        zh: "当问题是测量或检验系统是否可靠、是否足以支持决策时，使用 MSA。"
      }
    },
    sampling: {
      name: "Sampling Plan Design Tool",
      zhName: "抽样方案设计工具",
      url: "https://ellenloog-coder.github.io/sampling-plan-design-tool/",
      comingSoon: false,
      reason: {
        en: "Use this when you need to design an attribute sampling plan or compare inspection risks.",
        zh: "当需要设计抽样检验方案或比较检验风险时，使用抽样方案设计工具。"
      }
    },
    spc: {
      name: "SPC",
      zhName: "统计过程控制（SPC）",
      url: "",
      comingSoon: true,
      reason: {
        en: "Use SPC when the question is whether a process is stable over time.",
        zh: "当问题是过程是否随时间稳定时，使用 SPC。"
      }
    },
    eightD: {
      name: "Guided 8D Investigation",
      zhName: "引导式 8D 调查",
      url: "",
      comingSoon: true,
      reason: {
        en: "Use Guided 8D when you are investigating a customer complaint, failure, escape, or repeated quality problem.",
        zh: "当你在调查客诉、失效、流出或重复质量问题时，使用引导式 8D。"
      }
    },
    doe: {
      name: "DOE Decision Support",
      zhName: "DOE 决策支持",
      url: "",
      comingSoon: true,
      reason: {
        en: "Use DOE when you need to study several process parameters and optimize settings through planned experiments.",
        zh: "当需要研究多个过程参数并通过计划实验优化设置时，使用 DOE。"
      }
    }
  };

  function language() {
    return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function t() {
    return copy[language()];
  }

  function endpointConfigured() {
    return AI_WORKER_URL.startsWith("https://") && !AI_WORKER_URL.includes("YOUR-SUBDOMAIN");
  }

  function track(name, params = {}) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  }

  window.addEventListener("qualitytools:aiopen", () => {
    if (!aiOpened) {
      track("ai_open", { surface: "homepage" });
      aiOpened = true;
    }
  });

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function formatAnswer(value) {
    return escapeHtml(value).replace(/\n/g, "<br>");
  }

  function resizeInput() {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
  }

  function detectToolRecommendation(question) {
    const q = String(question || "").toLowerCase();
    const zh = /[\u4e00-\u9fff]/.test(q);
    const pairs = [
      ["measurement", /msa|gage|gauge|r&r|repeatability|reproducibility|ndc|kappa|cgk|测量|量具|检验系统|重复性|再现性|一致性|可靠/],
      ["capability", /cpk|cp\b|ppk|pp\b|capability|规格|specification|公差|过程能力|持续满足|满足规格/],
      ["sampling", /sampling|sample size|aql|acceptance|reject|抽样|样本量|aql|接收|拒收|检验方案/],
      ["spc", /spc|control chart|stability|stable over time|trend|控制图|过程稳定|随时间稳定|趋势/],
      ["eightD", /8d|complaint|customer complaint|failure|escape|root cause|corrective action|客诉|失效|流出|重复问题|根因|纠正措施|调查/],
      ["doe", /doe|experiment|optimization|parameter|factor|level|实验|优化|参数|因子|水平/]
    ];

    const asksTool = /which quality tool|what tool|which tool|msa or capability|should i perform|use which|我应该使用|哪个工具|用什么工具|msa 和过程能力|应该做 msa|应该做 cpk|什么方法/.test(q);
    const match = pairs.find(([, pattern]) => pattern.test(q));
    if (!match || (!asksTool && !/msa or capability|msa 和过程能力|customer complaint|客诉/.test(q))) return null;
    const route = toolRoutes[match[0]];
    return {
      key: match[0],
      tool: zh ? route.zhName : route.name,
      tool_en: route.name,
      coming_soon: route.comingSoon,
      url: route.url,
      reason: route.reason[zh ? "zh" : "en"]
    };
  }

  function toolRecommendationHtml(recommendation) {
    if (!recommendation) return "";
    const labels = t();
    const action = recommendation.coming_soon
      ? `<span class="ai-open-tool" aria-disabled="true">${escapeHtml(labels.comingSoon)}</span>`
      : `<a class="ai-open-tool" href="${escapeHtml(recommendation.url)}" target="_blank" rel="noopener noreferrer" data-tool-click="${escapeHtml(recommendation.tool_en)}">${escapeHtml(labels.openTool)}</a>`;
    return `
      <div class="ai-result-card ai-tool-recommendation">
        <h5>${escapeHtml(labels.toolPrefix)}</h5>
        <p><strong>${escapeHtml(recommendation.tool)}</strong>${recommendation.coming_soon ? ` - ${escapeHtml(labels.comingSoon)}` : ""}</p>
        <p>${escapeHtml(recommendation.reason)}</p>
        ${action}
      </div>
    `;
  }

  function feedbackHtml(index) {
    const labels = t();
    return `
      <div class="ai-feedback" data-message-index="${index}">
        <button type="button" data-feedback="positive">${escapeHtml(labels.helpful)}</button>
        <button type="button" data-feedback="negative">${escapeHtml(labels.notHelpful)}</button>
      </div>
    `;
  }

  function render() {
    const labels = t();
    if (titleEl) titleEl.textContent = labels.title;
    if (statusEl) statusEl.textContent = labels.status;
    if (privacyEl) privacyEl.textContent = labels.privacy;
    if (noteEl) noteEl.textContent = labels.note;
    input.placeholder = labels.placeholder;

    if (!messages.length) {
      workspace.innerHTML = `
        <div class="ai-chat-welcome">
          <h4>${escapeHtml(labels.title)}</h4>
          <p>${escapeHtml(labels.intro)}</p>
          <div class="ai-suggestion-row">
            ${labels.quick.map(item => `<button class="ai-suggestion-chip" type="button" data-question="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}
          </div>
        </div>
      `;
      return;
    }

    workspace.innerHTML = `
      <div class="ai-messages">
        ${messages.map((message, index) => `
          <div class="ai-message-row ${escapeHtml(message.role)}">
            <div class="ai-message ${escapeHtml(message.role)}${message.error ? " error" : ""}">
              ${formatAnswer(message.content)}
              ${message.recommendation ? toolRecommendationHtml(message.recommendation) : ""}
              ${message.role === "assistant" && !message.pending && !message.error ? feedbackHtml(index) : ""}
              ${message.error ? `<div class="ai-error-actions"><button type="button" data-action="retry">${escapeHtml(labels.retry)}</button><button type="button" data-action="cancel">${escapeHtml(labels.cancel)}</button></div>` : ""}
            </div>
          </div>
        `).join("")}
      </div>
    `;
    workspace.scrollTop = workspace.scrollHeight;
  }

  function pushMessage(message) {
    messages.push(message);
    if (messages.length > HISTORY_LIMIT + 2) {
      messages = messages.slice(-HISTORY_LIMIT - 2);
    }
    render();
  }

  function historyForRequest() {
    return messages
      .filter(message => !message.pending && !message.error)
      .slice(-HISTORY_LIMIT)
      .map(message => ({
        role: message.role,
        content: message.content
      }));
  }

  async function callWorker(question, recommendation) {
    if (!endpointConfigured()) {
      throw new Error("worker_not_configured");
    }
    const payload = {
      task: "quality_engineering_chat",
      current_tool: "homepage",
      language: language(),
      user_question: question,
      conversation_history: historyForRequest()
    };
    if (recommendation) {
      payload.deterministic_tool_recommendation = recommendation;
    }

    console.debug("[QualityHomepageAI] request", {
      task: payload.task,
      current_tool: payload.current_tool,
      language: payload.language,
      history_count: payload.conversation_history.length,
      has_tool_recommendation: Boolean(recommendation)
    });

    const response = await fetch(AI_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      console.error("[QualityHomepageAI] invalid JSON", { message: error instanceof Error ? error.message : String(error) });
      throw new Error("invalid_json");
    }
    if (!response.ok || data?.success === false) {
      console.error("[QualityHomepageAI] worker error", { status: response.status, success: data?.success === true });
      throw new Error("worker_error");
    }
    const answer = typeof data.answer === "string"
      ? data.answer
      : typeof data.message === "string"
        ? data.message
        : typeof data.result?.answer === "string"
          ? data.result.answer
          : "";
    if (!answer.trim()) {
      console.error("[QualityHomepageAI] empty answer", { success: data?.success === true });
      throw new Error("empty_answer");
    }
    return answer.trim();
  }

  async function sendQuestion(question) {
    const cleanQuestion = String(question || "").trim();
    if (!cleanQuestion || waiting) return;
    waiting = true;
    lastQuestion = cleanQuestion;
    sendButton.disabled = true;
    input.value = "";
    resizeInput();

    const recommendation = detectToolRecommendation(cleanQuestion);
    pushMessage({ role: "user", content: cleanQuestion });
    pushMessage({
      role: "assistant",
      content: language() === "zh" ? "正在思考..." : "Thinking...",
      pending: true
    });
    track("ai_mode_selected", { mode: "chat", surface: "homepage", tool_recommendation: Boolean(recommendation) });
    if (recommendation) {
      track("ai_recommendation_shown", {
        surface: "homepage",
        tool: recommendation.tool_en,
        coming_soon: recommendation.coming_soon
      });
    }

    try {
      const answer = await callWorker(cleanQuestion, recommendation);
      messages = messages.filter(message => !message.pending);
      pushMessage({ role: "assistant", content: answer, recommendation });
      track("ai_flow_completed", { workflow: "homepage_chat", success: true });
    } catch (error) {
      console.error("[QualityHomepageAI] chat failed", { message: error instanceof Error ? error.message : String(error) });
      messages = messages.filter(message => !message.pending);
      pushMessage({
        role: "assistant",
        content: t().unavailable,
        error: true
      });
      track("ai_flow_completed", { workflow: "homepage_chat", success: false });
    } finally {
      waiting = false;
      sendButton.disabled = false;
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    sendQuestion(input.value);
  });

  input.addEventListener("input", resizeInput);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  workspace.addEventListener("click", event => {
    const questionButton = event.target.closest("[data-question]");
    if (questionButton) {
      sendQuestion(questionButton.dataset.question);
      return;
    }

    const retryButton = event.target.closest("[data-action='retry']");
    if (retryButton) {
      messages = messages.filter(message => !message.error);
      sendQuestion(lastQuestion);
      return;
    }

    if (event.target.closest("[data-action='cancel']")) {
      messages = messages.filter(message => !message.error);
      render();
      return;
    }

    const toolLink = event.target.closest("[data-tool-click]");
    if (toolLink) {
      track("ai_tool_clicked", { surface: "homepage", tool: toolLink.dataset.toolClick });
      return;
    }

    const feedbackButton = event.target.closest("[data-feedback]");
    if (feedbackButton) {
      const isPositive = feedbackButton.dataset.feedback === "positive";
      track(isPositive ? "ai_feedback_positive" : "ai_feedback_negative", { surface: "homepage" });
      feedbackButton.closest(".ai-feedback").outerHTML = `<p class="ai-status-note">${escapeHtml(t().thanks)}</p>`;
    }
  });

  clearButton.addEventListener("click", () => {
    messages = [];
    lastQuestion = "";
    render();
  });

  window.addEventListener("qualitytools:languagechange", render);
  render();
})();
