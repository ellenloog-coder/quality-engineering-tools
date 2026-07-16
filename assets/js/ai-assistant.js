(() => {
      const AI_WORKER_URL = "https://quality-tools-ai-assistant.quality-tools-ai-assistant.workers.dev";

      const workspace = document.getElementById("aiWorkspace");
      const form = document.getElementById("aiForm");
      const input = document.getElementById("aiInput");
      const sendButton = document.getElementById("aiSendButton");
      const clearButton = document.getElementById("aiClearButton");
      let currentMode = "home";
      let waiting = false;
      let aiOpened = false;

      const toolRoutes = {
        capability: {
          tool: "Process Capability Analysis",
          url: "https://ellenloog-coder.github.io/process-capability-analysis-tool/",
          comingSoon: false,
          why: {
            en: "Use this when you already have measured process output data and specification limits, and need Cp, Cpk, Pp, Ppk or capability interpretation.",
            zh: "当你已有过程输出测量数据和规格限，需要评估 Cp、Cpk、Pp、Ppk 或过程能力解读时使用。"
          },
          data: {
            en: ["Measured process values", "Lower and/or upper specification limits", "Subgrouping or time order when relevant"],
            zh: ["过程测量值", "下规格限和/或上规格限", "必要时提供子组或时间顺序"]
          },
          limitations: {
            en: ["Requires reliable measurement data", "Does not prove process stability by itself", "AI does not recalculate or certify acceptance"],
            zh: ["需要可靠的测量数据", "单独不能证明过程稳定", "AI 不会重新计算或确认合格放行"]
          }
        },
        measurement: {
          tool: "Measurement System Analysis",
          url: "https://ellenloog-coder.github.io/measurement-system-analysis-tool/",
          comingSoon: false,
          why: {
            en: "Use this when the main question is whether the measurement system is repeatable, reproducible, or sufficiently consistent for decisions.",
            zh: "当核心问题是测量系统的重复性、再现性或判定一致性是否足够时使用。"
          },
          data: {
            en: ["Parts or samples", "Appraisers or operators", "Repeated measurements or agreement decisions", "Reference values when available"],
            zh: ["零件或样品", "评价人员或操作者", "重复测量值或一致性判定", "可用时提供参考值"]
          },
          limitations: {
            en: ["Study design matters", "Does not improve the gauge by itself", "AI guidance cannot replace validation requirements"],
            zh: ["研究设计会显著影响结论", "分析本身不会改善量具", "AI 建议不能替代验证要求"]
          }
        },
        sampling: {
          tool: "Sampling Plan Design Tool",
          url: "https://ellenloog-coder.github.io/sampling-plan-design-tool/",
          comingSoon: false,
          why: {
            en: "Use this for attribute inspection planning, sample size decisions, and producer or consumer risk comparison.",
            zh: "用于计数型检验方案、样本量决策，以及生产方/使用方风险比较。"
          },
          data: {
            en: ["Lot size or inspection context", "AQL and LTPD/RQL targets", "Accept/reject criteria or desired risk levels"],
            zh: ["批量或检验场景", "AQL 与 LTPD/RQL 目标", "接收/拒收准则或期望风险水平"]
          },
          limitations: {
            en: ["Attribute plans do not estimate process capability", "Inspection risk remains probabilistic", "Regulatory or customer rules may override the plan"],
            zh: ["计数型方案不评估过程能力", "检验风险仍是概率性的", "法规或客户规则可能优先于工具建议"]
          }
        },
        stability: {
          tool: "SPC",
          url: "",
          comingSoon: true,
          why: {
            en: "Use SPC when the question is whether a process is stable over time and whether signals require investigation.",
            zh: "当问题是过程随时间是否稳定、是否出现需要调查的信号时使用 SPC。"
          },
          data: {
            en: ["Time-ordered measurements", "Rational subgroups when applicable", "Process context for known events"],
            zh: ["按时间排序的测量数据", "适用时提供合理子组", "已知事件的过程背景"]
          },
          limitations: {
            en: ["Coming soon", "Use current platform tools for capability or MSA needs"],
            zh: ["即将推出", "当前可先使用过程能力或 MSA 工具处理相应问题"]
          }
        },
        failure: {
          tool: "Guided 8D",
          url: "",
          comingSoon: true,
          why: {
            en: "Use Guided 8D when you need containment, root cause investigation structure, corrective actions, and verification evidence.",
            zh: "当需要围堵、根因调查结构、纠正措施和验证证据时使用引导式 8D。"
          },
          data: {
            en: ["Problem statement", "Scope and severity", "Containment status", "Evidence and suspected factors"],
            zh: ["问题描述", "影响范围和严重度", "围堵状态", "证据和可疑因素"]
          },
          limitations: {
            en: ["Coming soon", "AI must not confirm root cause without verified evidence"],
            zh: ["即将推出", "AI 不能在缺少验证证据时确认根因"]
          }
        },
        optimization: {
          tool: "DOE",
          url: "",
          comingSoon: true,
          why: {
            en: "Use DOE when the goal is to study input factors and optimize parameters with planned experiments.",
            zh: "当目标是通过计划实验研究输入因子并优化参数时使用 DOE。"
          },
          data: {
            en: ["Response variable", "Candidate factors and levels", "Constraints, noise factors, and success criteria"],
            zh: ["响应变量", "候选因子和水平", "约束、噪声因子和成功准则"]
          },
          limitations: {
            en: ["Coming soon", "Requires a controlled experimental plan before conclusions"],
            zh: ["即将推出", "形成结论前需要受控实验计划"]
          }
        }
      };

      const analysisFields = {
        en: {
          capability: ["Study objective", "Cp", "Cpk", "Pp", "Ppk", "Specification limits", "Sample size", "Tool conclusion or notes"],
          grr: ["Study objective", "%GRR", "Number of distinct categories", "Repeatability result", "Reproducibility result", "Part variation result", "Tool conclusion or notes"],
          attribute: ["Study objective", "Overall agreement", "Kappa result", "Appraiser agreement", "Reference agreement", "Tool conclusion or notes"],
          type1: ["Study objective", "Cg", "Cgk", "Bias result", "Reference value", "Tolerance", "Tool conclusion or notes"],
          sampling: ["Study objective", "Lot size", "Sample size", "Acceptance number", "AQL", "LTPD/RQL", "Producer risk", "Consumer risk", "Tool conclusion or notes"]
        },
        zh: {
          capability: ["研究目的", "Cp", "Cpk", "Pp", "Ppk", "规格限", "样本量", "工具结论或备注"],
          grr: ["研究目的", "%GRR", "可区分类别数", "重复性结果", "再现性结果", "零件变差结果", "工具结论或备注"],
          attribute: ["研究目的", "总体一致率", "Kappa 结果", "评价人一致性", "参考标准一致性", "工具结论或备注"],
          type1: ["研究目的", "Cg", "Cgk", "偏倚结果", "参考值", "公差", "工具结论或备注"],
          sampling: ["研究目的", "批量", "样本量", "接收数", "AQL", "LTPD/RQL", "生产方风险", "使用方风险", "工具结论或备注"]
        }
      };

      const text = {
        en: {
          homeTitle: "Quality Engineering Copilot",
          homeIntro: "Choose a structured workflow. Avoid confidential product, supplier, customer, or personal information.",
          chooseTitle: "Choose the right quality tool",
          chooseIntro: "Select the problem type. The recommendation is routed deterministically before any AI interpretation.",
          explainTitle: "Explain analysis results",
          explainIntro: "Enter the statistical results already produced by the tool. The assistant will not recalculate or alter them.",
          actionTitle: "Plan next engineering actions",
          actionIntro: "Summarize the situation and evidence so the assistant can structure next actions safely.",
          placeholder: "Optional: describe a quality engineering question…",
          setup: "The AI assistant is temporarily unavailable. Please try again later.",
          error: "The assistant could not produce a structured result. A safe fallback is shown.",
          empty: "Please enter a question.",
          back: "Back",
          submit: "Generate structured guidance",
          recommendedTool: "Recommended tool",
          why: "Why this tool",
          requiredData: "Required data",
          limitations: "Current limitations",
          openTool: "Open tool",
          comingSoon: "Coming soon",
          helpful: "Helpful",
          notHelpful: "Not helpful",
          feedbackThanks: "Thanks. Feedback recorded.",
          freeInputNote: "Free input is handled as an engineering action planning request, not an open-ended chatbot.",
          problemTypes: [
            ["capability", "Process capability"],
            ["measurement", "Measurement reliability"],
            ["sampling", "Sampling inspection"],
            ["stability", "Process stability"],
            ["failure", "Quality failure investigation"],
            ["optimization", "Parameter optimization"]
          ],
          analyses: [
            ["capability", "Process Capability"],
            ["grr", "Variable Gage R&R"],
            ["attribute", "Attribute Agreement"],
            ["type1", "Type 1 Gage Study"],
            ["sampling", "Sampling Plan"]
          ],
          actionFields: [
            ["problem_description", "Problem description"],
            ["severity", "Severity"],
            ["affected_scope", "Affected scope"],
            ["safety_regulatory", "Safety or regulatory impact"],
            ["existing_containment", "Existing containment"],
            ["available_evidence", "Available evidence"]
          ],
          sections: {
            observed_information: "Observed information",
            observed_facts: "Observed facts",
            calculated_results: "Calculated results",
            engineering_interpretation: "Engineering interpretation",
            assumptions: "Assumptions",
            recommendations: "Recommendations",
            risk: "Risk",
            missing_information: "Missing information",
            immediate_actions: "Immediate actions",
            verification_evidence: "Verification evidence",
            recommended_tool: "Recommended tool",
            limitations: "Limitations"
          }
        },
        zh: {
          homeTitle: "质量工程 Copilot",
          homeIntro: "请选择结构化工作流。请避免输入机密产品、供应商、客户或个人信息。",
          chooseTitle: "选择合适的质量工具",
          chooseIntro: "请选择问题类型。推荐结果由前端确定性路由生成，不让 AI 自由猜测工具。",
          explainTitle: "解释分析结果",
          explainIntro: "请输入工具已经输出的统计结果。助手不会重新计算或修改这些结果。",
          actionTitle: "规划下一步工程行动",
          actionIntro: "概述问题和证据，助手会安全地结构化下一步行动。",
          placeholder: "可选：描述一个质量工程问题……",
          setup: "AI 助手暂时不可用，请稍后重试。",
          error: "AI 未能生成结构化结果，已显示安全降级内容。",
          empty: "请输入问题。",
          back: "返回",
          submit: "生成结构化建议",
          recommendedTool: "推荐工具",
          why: "推荐原因",
          requiredData: "所需数据",
          limitations: "当前限制",
          openTool: "打开工具",
          comingSoon: "即将推出",
          helpful: "有帮助",
          notHelpful: "没有帮助",
          feedbackThanks: "谢谢，反馈已记录。",
          freeInputNote: "自由输入将按工程行动规划处理，不作为开放式聊天机器人。",
          problemTypes: [
            ["capability", "过程能力"],
            ["measurement", "测量可靠性"],
            ["sampling", "抽样检验"],
            ["stability", "过程稳定性"],
            ["failure", "质量失效调查"],
            ["optimization", "参数优化"]
          ],
          analyses: [
            ["capability", "过程能力"],
            ["grr", "变量型 Gage R&R"],
            ["attribute", "属性一致性"],
            ["type1", "Type 1 量具研究"],
            ["sampling", "抽样方案"]
          ],
          actionFields: [
            ["problem_description", "问题描述"],
            ["severity", "严重度"],
            ["affected_scope", "影响范围"],
            ["safety_regulatory", "安全或法规影响"],
            ["existing_containment", "现有围堵措施"],
            ["available_evidence", "已有证据"]
          ],
          sections: {
            observed_information: "已观察信息",
            observed_facts: "观察到的事实",
            calculated_results: "已计算结果",
            engineering_interpretation: "工程解读",
            assumptions: "假设",
            recommendations: "建议",
            risk: "风险",
            missing_information: "缺失信息",
            immediate_actions: "立即行动",
            verification_evidence: "验证证据",
            recommended_tool: "推荐工具",
            limitations: "限制"
          }
        }
      };

      function language(){
        return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
      }

      function endpointConfigured(){
        return AI_WORKER_URL.startsWith("https://") && !AI_WORKER_URL.includes("YOUR-SUBDOMAIN");
      }

      function track(name, params = {}){
        if (typeof window.gtag === "function") {
          window.gtag("event", name, params);
        }
      }

      window.addEventListener("qualitytools:aiopen", () => {
        if (!aiOpened) {
          track("ai_open");
          aiOpened = true;
        }
      });

      function escapeHtml(value){
        return String(value ?? "").replace(/[&<>"']/g, char => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"
        }[char]));
      }

      function listHtml(items){
        const safeItems = Array.isArray(items) && items.length ? items : ["-"];
        return `<ul>${safeItems.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      }

      function resizeInput(){
        input.style.height = "auto";
        input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
      }

      function setWorkspace(html){
        workspace.innerHTML = html;
        workspace.scrollTop = 0;
      }

      function renderHome(){
        currentMode = "home";
        const t = text[language()];
        setWorkspace(`
          <h4>${escapeHtml(t.homeTitle)}</h4>
          <p>${escapeHtml(t.homeIntro)}</p>
          <div class="ai-mode-grid" style="margin-top:14px">
            <button class="ai-mode-card" type="button" data-mode="choose">
              <span class="ai-mode-kicker">01</span>
              <h4>${escapeHtml(t.chooseTitle)}</h4>
              <p>${escapeHtml(t.chooseIntro)}</p>
            </button>
            <button class="ai-mode-card" type="button" data-mode="explain">
              <span class="ai-mode-kicker">02</span>
              <h4>${escapeHtml(t.explainTitle)}</h4>
              <p>${escapeHtml(t.explainIntro)}</p>
            </button>
            <button class="ai-mode-card" type="button" data-mode="actions">
              <span class="ai-mode-kicker">03</span>
              <h4>${escapeHtml(t.actionTitle)}</h4>
              <p>${escapeHtml(t.actionIntro)}</p>
            </button>
          </div>
        `);
      }

      function renderFlowHead(title, intro){
        const t = text[language()];
        return `
          <div class="ai-flow-head">
            <div>
              <h4>${escapeHtml(title)}</h4>
              <p>${escapeHtml(intro)}</p>
            </div>
            <button class="ai-back" type="button" data-action="home">${escapeHtml(t.back)}</button>
          </div>
        `;
      }

      function renderChoose(){
        currentMode = "choose";
        const t = text[language()];
        setWorkspace(`
          ${renderFlowHead(t.chooseTitle, t.chooseIntro)}
          <div class="ai-option-grid">
            ${t.problemTypes.map(([key, label]) => `<button class="ai-option" type="button" data-tool-key="${key}">${escapeHtml(label)}</button>`).join("")}
          </div>
        `);
      }

      function renderToolRecommendation(key){
        const t = text[language()];
        const route = toolRoutes[key];
        if (!route) return;

        const openButton = route.comingSoon
          ? `<span class="ai-open-tool" aria-disabled="true">${escapeHtml(t.comingSoon)}</span>`
          : `<a class="ai-open-tool" href="${escapeHtml(route.url)}" target="_blank" rel="noopener noreferrer" data-tool-click="${escapeHtml(route.tool)}">${escapeHtml(t.openTool)}</a>`;

        setWorkspace(`
          ${renderFlowHead(t.chooseTitle, t.chooseIntro)}
          <div class="ai-result">
            <div class="ai-result-card"><h5>${escapeHtml(t.recommendedTool)}</h5><p>${escapeHtml(route.tool)}${route.comingSoon ? ` - ${escapeHtml(t.comingSoon)}` : ""}</p></div>
            <div class="ai-result-card"><h5>${escapeHtml(t.why)}</h5><p>${escapeHtml(route.why[language()])}</p></div>
            <div class="ai-result-card"><h5>${escapeHtml(t.requiredData)}</h5>${listHtml(route.data[language()])}</div>
            <div class="ai-result-card"><h5>${escapeHtml(t.limitations)}</h5>${listHtml(route.limitations[language()])}</div>
            ${openButton}
            ${feedbackHtml("tool_recommendation")}
          </div>
        `);
        track("ai_recommendation_shown", { workflow: "choose_tool", tool: route.tool, coming_soon: route.comingSoon });
        track("ai_flow_completed", { workflow: "choose_tool" });
      }

      function renderExplainPicker(){
        currentMode = "explain";
        const t = text[language()];
        setWorkspace(`
          ${renderFlowHead(t.explainTitle, t.explainIntro)}
          <div class="ai-option-grid">
            ${t.analyses.map(([key, label]) => `<button class="ai-option" type="button" data-analysis-key="${key}">${escapeHtml(label)}</button>`).join("")}
          </div>
        `);
      }

      function renderExplainForm(key){
        const t = text[language()];
        const analysisLabel = t.analyses.find(([itemKey]) => itemKey === key)?.[1] || key;
        const fields = analysisFields[language()][key] || [];
        setWorkspace(`
          ${renderFlowHead(analysisLabel, t.explainIntro)}
          <form class="ai-form-grid" data-explain-form="${escapeHtml(key)}">
            ${fields.map(field => `
              <div class="ai-field">
                <label>${escapeHtml(field)}</label>
                <textarea name="${escapeHtml(field)}" maxlength="600"></textarea>
              </div>
            `).join("")}
            <button class="ai-submit-flow" type="submit">${escapeHtml(t.submit)}</button>
          </form>
        `);
      }

      function renderActionsForm(prefill = ""){
        currentMode = "actions";
        const t = text[language()];
        setWorkspace(`
          ${renderFlowHead(t.actionTitle, t.actionIntro)}
          <form class="ai-form-grid" data-actions-form="true">
            ${t.actionFields.map(([name, label]) => `
              <div class="ai-field">
                <label>${escapeHtml(label)}</label>
                <textarea name="${escapeHtml(name)}" maxlength="900">${name === "problem_description" ? escapeHtml(prefill) : ""}</textarea>
              </div>
            `).join("")}
            <button class="ai-submit-flow" type="submit">${escapeHtml(t.submit)}</button>
          </form>
        `);
      }

      function renderLoading(title){
        setWorkspace(`
          ${renderFlowHead(title, text[language()].freeInputNote)}
          <div class="ai-result-card"><span class="ai-typing"><span></span><span></span><span></span></span></div>
        `);
      }

      function feedbackHtml(context){
        const t = text[language()];
        return `
          <div class="ai-feedback" data-feedback-context="${escapeHtml(context)}">
            <button type="button" data-feedback="positive">${escapeHtml(t.helpful)}</button>
            <button type="button" data-feedback="negative">${escapeHtml(t.notHelpful)}</button>
          </div>
        `;
      }

      function renderStructuredResult(payload, workflow){
        const t = text[language()];
        const result = payload && typeof payload.result === "object" ? payload.result : {};
        const orderedKeys = workflow === "explain_results"
          ? ["observed_facts", "calculated_results", "engineering_interpretation", "assumptions", "recommendations", "limitations"]
          : ["observed_information", "risk", "missing_information", "immediate_actions", "verification_evidence", "recommended_tool", "limitations"];

        setWorkspace(`
          ${renderFlowHead(workflow === "explain_results" ? t.explainTitle : t.actionTitle, payload?.fallback ? t.error : t.freeInputNote)}
          <div class="ai-result">
            ${orderedKeys.map(key => `
              <div class="ai-result-card">
                <h5>${escapeHtml(t.sections[key] || key)}</h5>
                ${listHtml(result[key])}
              </div>
            `).join("")}
            ${feedbackHtml(workflow)}
          </div>
        `);
        track("ai_flow_completed", { workflow, fallback: Boolean(payload?.fallback) });
      }

      function safeFallback(workflow){
        const lang = language();
        if (workflow === "explain_results") {
          return {
            fallback: true,
            result: {
              observed_facts: [lang === "zh" ? "仅使用用户输入的分析类型和统计结果。" : "Only the user-provided analysis type and statistical results were used."],
              calculated_results: [lang === "zh" ? "未重新计算或修改任何统计结果。" : "No statistical result was recalculated or changed."],
              engineering_interpretation: [lang === "zh" ? "暂时无法生成可靠结构化解读，请回到原工具报告核对结论。" : "A reliable structured interpretation is unavailable; review the original tool report."],
              assumptions: [lang === "zh" ? "未作额外事实假设。" : "No additional factual assumptions were made."],
              recommendations: [lang === "zh" ? "补充背景后重新生成，或使用确定性工具报告作为依据。" : "Add context and retry, or rely on the deterministic tool report."],
              limitations: [lang === "zh" ? "AI 不能确认根因、合格放行或法规符合性。" : "AI cannot confirm root cause, product release, or regulatory compliance."]
            }
          };
        }
        return {
          fallback: true,
          result: {
            observed_information: [lang === "zh" ? "仅保留用户提供的问题描述和证据信息。" : "Only user-provided problem and evidence information was retained."],
            risk: [lang === "zh" ? "风险需要由工程负责人根据实际证据评估。" : "Risk must be evaluated by the responsible engineer using actual evidence."],
            missing_information: [lang === "zh" ? "需要补充范围、严重度、围堵状态和验证证据。" : "Scope, severity, containment status, and verification evidence may be missing."],
            immediate_actions: [lang === "zh" ? "先执行必要围堵，保护客户和生产过程，再收集证据。" : "Apply necessary containment first, protect customers and production, then collect evidence."],
            verification_evidence: [lang === "zh" ? "需要保留测量记录、检验记录、变更记录和复验结果。" : "Keep measurement records, inspection records, change records, and recheck results."],
            recommended_tool: [lang === "zh" ? "根据问题性质选择过程能力、MSA、抽样方案或 8D/SPC/DOE。" : "Choose capability, MSA, sampling, or 8D/SPC/DOE based on the problem type."],
            limitations: [lang === "zh" ? "AI 不会自动确认根因或产品合格。" : "AI will not automatically confirm root cause or product acceptance."]
          }
        };
      }

      async function callWorker(workflow, body){
        if (!endpointConfigured()) {
          return safeFallback(workflow);
        }
        try {
          const response = await fetch(AI_WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              task: workflow,
              language: language(),
              page: window.location.pathname || "/",
              ...body
            })
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok || !payload || typeof payload.result !== "object") {
            return safeFallback(workflow);
          }
          return payload;
        } catch (error) {
          console.error("AI copilot error:", error);
          return safeFallback(workflow);
        }
      }

      function collectForm(formElement){
        return Array.from(new FormData(formElement).entries()).reduce((acc, [key, value]) => {
          acc[key] = String(value || "").trim();
          return acc;
        }, {});
      }

      async function handleExplainSubmit(formElement){
        if (waiting) return;
        waiting = true;
        const submit = formElement.querySelector("button[type='submit']");
        submit.disabled = true;
        const analysisType = formElement.dataset.explainForm;
        renderLoading(text[language()].explainTitle);
        const payload = await callWorker("explain_results", {
          analysisType,
          fields: collectForm(formElement)
        });
        renderStructuredResult(payload, "explain_results");
        waiting = false;
      }

      async function handleActionsSubmit(formElement){
        if (waiting) return;
        waiting = true;
        const submit = formElement.querySelector("button[type='submit']");
        submit.disabled = true;
        renderLoading(text[language()].actionTitle);
        const payload = await callWorker("plan_actions", {
          fields: collectForm(formElement)
        });
        renderStructuredResult(payload, "plan_actions");
        waiting = false;
      }

      form.addEventListener("submit", event => {
        event.preventDefault();
        const raw = input.value.trim();
        if (!raw || waiting) return;
        track("ai_mode_selected", { mode: "free_input" });
        input.value = "";
        resizeInput();
        renderActionsForm(raw);
      });

      input.addEventListener("input", resizeInput);
      input.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          form.requestSubmit();
        }
      });

      workspace.addEventListener("click", event => {
        const modeButton = event.target.closest("[data-mode]");
        if (modeButton) {
          const mode = modeButton.dataset.mode;
          track("ai_mode_selected", { mode });
          if (mode === "choose") renderChoose();
          if (mode === "explain") renderExplainPicker();
          if (mode === "actions") renderActionsForm();
          return;
        }

        if (event.target.closest("[data-action='home']")) {
          renderHome();
          return;
        }

        const toolButton = event.target.closest("[data-tool-key]");
        if (toolButton) {
          renderToolRecommendation(toolButton.dataset.toolKey);
          return;
        }

        const analysisButton = event.target.closest("[data-analysis-key]");
        if (analysisButton) {
          renderExplainForm(analysisButton.dataset.analysisKey);
          return;
        }

        const toolLink = event.target.closest("[data-tool-click]");
        if (toolLink) {
          track("ai_tool_clicked", { tool: toolLink.dataset.toolClick });
          return;
        }

        const feedbackButton = event.target.closest("[data-feedback]");
        if (feedbackButton) {
          const isPositive = feedbackButton.dataset.feedback === "positive";
          track(isPositive ? "ai_feedback_positive" : "ai_feedback_negative", {
            context: feedbackButton.closest("[data-feedback-context]")?.dataset.feedbackContext || currentMode
          });
          feedbackButton.closest(".ai-feedback").outerHTML = `<p class="ai-status-note">${escapeHtml(text[language()].feedbackThanks)}</p>`;
        }
      });

      workspace.addEventListener("submit", event => {
        const explainForm = event.target.closest("[data-explain-form]");
        const actionsForm = event.target.closest("[data-actions-form]");
        if (!explainForm && !actionsForm) return;
        event.preventDefault();
        if (explainForm) handleExplainSubmit(explainForm);
        if (actionsForm) handleActionsSubmit(actionsForm);
      });

      clearButton.addEventListener("click", renderHome);
      window.addEventListener("qualitytools:languagechange", updateLanguageUI);

      function updateLanguageUI(){
        input.placeholder = text[language()].placeholder;
        renderHome();
      }

      updateLanguageUI();
    })();
