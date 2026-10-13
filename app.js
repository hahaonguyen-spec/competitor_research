const marketNames={VN:"Việt Nam",ID:"Indonesia",TH:"Thailand",PH:"Philippines",SEA:"SEA multi-market"};
const agents=[
  {id:"orchestrator",icon:"MO",name:"Marketing Orchestrator",category:"strategy",role:"Điều phối",description:"Biến mục tiêu thành scope, lựa chọn agent, sắp thứ tự công việc và kiểm tra độ hoàn chỉnh trước khi trình duyệt.",inputs:["Business objective","Thị trường và deadline","Ngân sách / ràng buộc"],outputs:["Mission plan","RACI và timeline","Decision memo"],approval:"Marketing owner duyệt scope, priority và nguồn lực."},
  {id:"competitor",icon:"CI",name:"Competitor Intelligence",category:"strategy",role:"Research",description:"Theo dõi promotion, positioning, content, landing page và thay đổi thị trường từ nguồn công khai.",inputs:["Competitor watchlist","Official URLs","Market scope"],outputs:["Verified signals","Change log","Strategic implications"],approval:"Fact chưa có nguồn chính thức phải giữ nhãn unverified."},
  {id:"audience",icon:"AI",name:"Audience Insight",category:"strategy",role:"Insight",description:"Tổng hợp nhu cầu, rào cản, intent và phân khúc để biến dữ liệu khách hàng thành audience hypothesis.",inputs:["CRM aggregates","Research notes","Campaign outcomes"],outputs:["Audience segments","Pain points","Message hypotheses"],approval:"Không đưa PII hoặc dữ liệu khách hàng thô vào website."},
  {id:"campaign",icon:"CS",name:"Campaign Strategist",category:"growth",role:"Planning",description:"Thiết kế proposition, funnel, offer architecture, channel mix và kế hoạch đo lường cho từng campaign.",inputs:["Business target","Audience insight","Budget and timing"],outputs:["Campaign blueprint","Funnel map","KPI tree"],approval:"Offer, incentive và commercial terms cần owner phê duyệt."},
  {id:"paid",icon:"PM",name:"Paid Media Optimizer",category:"growth",role:"Acquisition",description:"Đề xuất cấu trúc campaign, audience test, creative matrix và quy tắc tối ưu dựa trên chất lượng downstream.",inputs:["Spend and delivery","Lead quality","Sales outcomes"],outputs:["Optimization actions","Test matrix","Budget recommendation"],approval:"Không tự tăng ngân sách hoặc publish campaign."},
  {id:"cro",icon:"CX",name:"CRO & Journey",category:"growth",role:"Conversion",description:"Phân tích landing page, form friction và hành trình để đề xuất test cải thiện conversion có kiểm soát.",inputs:["Page analytics","Funnel drop-off","Session evidence"],outputs:["CRO backlog","Test hypothesis","Measurement plan"],approval:"Test phải có guardrail metric và QA trước khi mở traffic."},
  {id:"creative",icon:"CB",name:"Creative Brief",category:"content",role:"Creative",description:"Chuyển strategy thành creative territories, hooks, proof points, formats và production brief rõ ràng.",inputs:["Campaign blueprint","Audience pain points","Brand rules"],outputs:["Creative brief","Hook matrix","Asset checklist"],approval:"Claim và visual nhạy cảm cần brand/compliance review."},
  {id:"content",icon:"SE",name:"SEO & Content",category:"content",role:"Organic",description:"Xây topic cluster, content gap, keyword intent và editorial plan kết nối organic traffic với funnel.",inputs:["Keyword set","Competitor content","Conversion goal"],outputs:["Content roadmap","SEO brief","Internal-link plan"],approval:"Không sao chép nội dung hoặc đưa claim thiếu bằng chứng."},
  {id:"social",icon:"SL",name:"Social Listening",category:"content",role:"Social",description:"Theo dõi chủ đề, cadence, format và phản ứng công khai để phát hiện tín hiệu nội dung sớm.",inputs:["Official feeds","Topic watchlist","Public engagement"],outputs:["Trend digest","Content opportunities","Escalation flags"],approval:"Không suy diễn sentiment khi mẫu dữ liệu không đủ."},
  {id:"lifecycle",icon:"LC",name:"Lifecycle & CRM",category:"operations",role:"Retention",description:"Thiết kế segmentation, nurture, trigger, suppression và win-back journey gắn với trạng thái khách hàng.",inputs:["Lifecycle stage","Consent state","Behavior events"],outputs:["Journey map","Message sequence","Entry / exit rules"],approval:"Consent, unsubscribe, frequency cap và eligibility là bắt buộc."},
  {id:"analytics",icon:"AA",name:"Analytics & Attribution",category:"operations",role:"Measurement",description:"Chuẩn hóa taxonomy, UTM, dashboard và KPI để tách lead volume khỏi chất lượng và sales outcome.",inputs:["Media data","CRM stages","Business definitions"],outputs:["Measurement spec","Dashboard schema","Insight narrative"],approval:"Không gọi deposit là revenue; ghi rõ attribution window và data gaps."},
  {id:"localization",icon:"LQ",name:"Localization QA",category:"operations",role:"Regional",description:"Thích nghi thông điệp theo thị trường, kiểm tra thuật ngữ, placeholder, link và consistency giữa các asset.",inputs:["Approved master","Glossary","Market context"],outputs:["Localized copy","QA checklist","Deviation log"],approval:"Giữ nguyên số liệu, risk disclosure và placeholder nếu chưa được duyệt thay đổi."},
  {id:"compliance",icon:"CR",name:"Compliance & Risk",category:"governance",role:"Control",description:"Rà soát claim, eligibility, disclaimer, promotion mechanics và các khoảng trống cần Legal/Risk xác nhận.",inputs:["Final copy","T&C","Entity / jurisdiction"],outputs:["Risk flags","Approval checklist","Required amendments"],approval:"Agent chỉ hỗ trợ review; Compliance/Legal là người phê duyệt cuối."}
];

const workflows=[
  {id:"competitor-pulse",name:"Competitor Pulse",description:"Theo dõi promotion, content, SEO và website changes rồi chuyển signal thành action đề xuất.",agents:["competitor","social","content","analytics","orchestrator"],goal:"Tạo báo cáo competitor intelligence hàng tuần, ưu tiên thay đổi promotion, positioning và content tại SEA.",funnel:"awareness",channel:"multi"},
  {id:"campaign-launch",name:"Campaign Launch",description:"Từ audience hypothesis và offer đến creative, media plan, measurement và compliance gate.",agents:["audience","campaign","creative","paid","analytics","localization","compliance"],goal:"Lập kế hoạch ra mắt campaign đa kênh với KPI, creative matrix và approval checklist.",funnel:"lead",channel:"multi"},
  {id:"lead-quality",name:"Lead Quality Loop",description:"Kết nối media với CRM để tối ưu theo qualified lead và sales outcome thay vì chỉ CPL.",agents:["paid","lifecycle","analytics","cro","orchestrator"],goal:"Cải thiện chất lượng lead bằng cách nối dữ liệu campaign với CRM và xác định điểm nghẽn funnel.",funnel:"conversion",channel:"paid"},
  {id:"content-engine",name:"Content Engine",description:"Biến search intent và competitor gap thành hệ thống content có cadence và đường dẫn conversion.",agents:["competitor","audience","content","creative","social","localization"],goal:"Xây content engine 90 ngày dựa trên keyword intent, competitor gaps và conversion goal.",funnel:"consideration",channel:"content"},
  {id:"retention",name:"Retention Recovery",description:"Phân tích lifecycle, tạo segment và journey win-back với frequency cap và measurement rõ ràng.",agents:["audience","lifecycle","analytics","creative","compliance"],goal:"Thiết kế chương trình nurture và win-back cho nhóm khách hàng giảm tương tác.",funnel:"retention",channel:"email"},
  {id:"promotion-review",name:"Promotion Control",description:"Kiểm tra mechanics, T&C, localization, tracking và readiness trước khi yêu cầu phê duyệt launch.",agents:["campaign","localization","analytics","compliance","orchestrator"],goal:"Rà soát promotion trước launch: mechanics, T&C, tracking, localization và approval owners.",funnel:"conversion",channel:"multi"}
];

const demoSignals=[
  {brand:"Competitor watchlist",market:"SEA",kind:"promotion",status:"monitor",title:"Promotion pages are being monitored",summary:"Scanner sẽ hiển thị thay đổi từ nguồn chính thức sau lần chạy GitHub Actions tiếp theo.",url:"https://github.com/hahaonguyen-spec/competitor_research"},
  {brand:"System",market:"VN",kind:"compliance",status:"monitor",title:"Evidence-first control is active",summary:"Mọi signal cần nguồn, ngày quan sát và trạng thái xác minh trước khi dùng trong proposal.",url:"https://github.com/hahaonguyen-spec/competitor_research"}
];

const state={agentFilter:"all",agentSearch:"",signals:[],market:"ALL",kind:"ALL",latest:null};
const $=selector=>document.querySelector(selector);
const esc=value=>String(value??"").replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
const getAgent=id=>agents.find(agent=>agent.id===id);

function renderAgents(){
  const host=$("#agent-grid"),template=$("#agent-template");host.innerHTML="";
  const query=state.agentSearch.toLowerCase();
  const visible=agents.filter(agent=>(state.agentFilter==="all"||agent.category===state.agentFilter)&&(`${agent.name} ${agent.role} ${agent.description}`.toLowerCase().includes(query)));
  visible.forEach((agent,index)=>{
    const node=template.content.cloneNode(true),card=node.querySelector("article");
    node.querySelector(".agent-index").textContent=String(index+1).padStart(2,"0");
    node.querySelector(".agent-icon").textContent=agent.icon;
    node.querySelector(".agent-category").textContent=`${agent.category} · ${agent.role}`;
    node.querySelector("h3").textContent=agent.name;
    node.querySelector(".agent-description").textContent=agent.description;
    node.querySelector(".agent-output").textContent=`Output: ${agent.outputs.slice(0,2).join(" · ")}`;
    node.querySelector("button").addEventListener("click",()=>openAgent(agent));card.dataset.agent=agent.id;host.appendChild(node);
  });
}

function openAgent(agent){
  $("#agent-detail").innerHTML=`<div class="dialog-content"><div class="agent-icon">${esc(agent.icon)}</div><span class="eyebrow">${esc(agent.category)} · ${esc(agent.role)}</span><h2>${esc(agent.name)}</h2><p>${esc(agent.description)}</p><div class="detail-grid"><div><h4>Đầu vào cần có</h4><ul>${agent.inputs.map(item=>`<li>${esc(item)}</li>`).join("")}</ul></div><div><h4>Đầu ra chịu trách nhiệm</h4><ul>${agent.outputs.map(item=>`<li>${esc(item)}</li>`).join("")}</ul></div></div><div class="approval-note"><strong>Approval gate:</strong> ${esc(agent.approval)}</div></div>`;
  $("#agent-dialog").showModal();
}

function renderWorkflows(){
  $("#workflow-grid").innerHTML=workflows.map((workflow,index)=>`<article class="workflow-card"><span class="workflow-number">PLAYBOOK ${String(index+1).padStart(2,"0")}</span><h3>${esc(workflow.name)}</h3><p>${esc(workflow.description)}</p><div class="workflow-chain">${workflow.agents.map(id=>`<span>${esc(getAgent(id).icon)} · ${esc(getAgent(id).name)}</span>`).join("")}</div><button data-workflow="${workflow.id}">Dùng playbook này →</button></article>`).join("");
  document.querySelectorAll("[data-workflow]").forEach(button=>button.addEventListener("click",()=>useWorkflow(button.dataset.workflow)));
}

function useWorkflow(id){
  const workflow=workflows.find(item=>item.id===id);if(!workflow)return;
  $("#mission-goal").value=workflow.goal;$("#mission-funnel").value=workflow.funnel;$("#mission-channel").value=workflow.channel;
  document.querySelector("#mission").scrollIntoView({behavior:"smooth"});
  setTimeout(()=>buildMission({preventDefault(){},workflow}),450);
}

function selectSquad(goal,funnel,channel,priority,preferred=[]){
  const ids=new Set(["orchestrator","analytics",...preferred]);const text=goal.toLowerCase();
  if(/đối thủ|competitor|market|research|promotion/.test(text))ids.add("competitor");
  if(/audience|khách hàng|segment|insight/.test(text))ids.add("audience");
  if(/campaign|ra mắt|launch|webinar|offer/.test(text))ids.add("campaign");
  if(channel==="paid"||/paid|meta|google ads|quảng cáo|cpl|budget/.test(text))ids.add("paid");
  if(channel==="content"||/seo|content|keyword|blog/.test(text)){ids.add("content");ids.add("creative")}
  if(channel==="social"||/social|facebook|tiktok|instagram/.test(text))ids.add("social");
  if(channel==="email"||funnel==="retention"||/crm|email|nurture|retention|win-back/.test(text))ids.add("lifecycle");
  if(channel==="web"||/landing|website|form|conversion/.test(text))ids.add("cro");
  if(channel==="multi"){ids.add("campaign");ids.add("creative")}
  if(/creative|copy|message|video|banner/.test(text))ids.add("creative");
  if(/sea|việt nam|indonesia|thailand|philippines|local/.test(text))ids.add("localization");
  if(priority==="high-risk"||/bonus|cashback|credit|financial|trading|claim|t&c|điều khoản/.test(text))ids.add("compliance");
  if(funnel==="lead"||funnel==="conversion")ids.add("cro");
  return agents.filter(agent=>ids.has(agent.id));
}

function buildMission(event){
  event.preventDefault();const workflow=event.workflow;const goal=$("#mission-goal").value.trim();if(!goal)return;
  const market=$("#mission-market").value,funnel=$("#mission-funnel").value,channel=$("#mission-channel").value,priority=$("#mission-priority").value;
  const squad=selectSquad(goal,funnel,channel,priority,workflow?.agents||[]);const now=new Date();const id=`MH-${now.toISOString().slice(2,10).replaceAll("-","")}-${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}`;
  const plan={id,goal,market,funnel,channel,priority,created_at:now.toISOString(),agents:squad.map(agent=>agent.id),phases:buildPhases(squad,goal),kpis:kpisFor(funnel)};
  savePlan(plan);renderPlan(plan);
}

function buildPhases(squad,goal){
  const has=id=>squad.some(agent=>agent.id===id),phases=[];
  if(has("competitor")||has("audience")||has("social"))phases.push({name:"Evidence & insight",owners:squad.filter(a=>["competitor","audience","social"].includes(a.id)).map(a=>a.name),task:"Xác minh nguồn, tổng hợp audience/market signals và ghi rõ data gaps."});
  phases.push({name:"Strategy & success criteria",owners:squad.filter(a=>["orchestrator","campaign","analytics"].includes(a.id)).map(a=>a.name),task:`Chuyển mục tiêu “${goal.slice(0,90)}${goal.length>90?"…":""}” thành KPI tree, scope và decision gates.`});
  if(has("creative")||has("content")||has("localization"))phases.push({name:"Message & production",owners:squad.filter(a=>["creative","content","localization"].includes(a.id)).map(a=>a.name),task:"Tạo message architecture, asset brief và bản địa hóa có QA."});
  if(has("paid")||has("cro")||has("lifecycle"))phases.push({name:"Activation design",owners:squad.filter(a=>["paid","cro","lifecycle"].includes(a.id)).map(a=>a.name),task:"Thiết kế audience, journey, test matrix, tracking và stop/scale rules."});
  if(has("compliance"))phases.push({name:"Risk & approval gate",owners:["Compliance & Risk","Marketing owner"],task:"Rà soát claim, eligibility, T&C, consent và lấy phê duyệt trước khi launch."});
  phases.push({name:"Measure & decide",owners:["Analytics & Attribution","Marketing Orchestrator"],task:"Đọc hiệu quả theo funnel, tách volume khỏi quality và đưa ra keep/change/stop decision."});return phases;
}

function kpisFor(funnel){return({awareness:["Qualified reach","Attention / view quality","Branded search lift"],consideration:["Engaged sessions","Content-assisted leads","Return visitors"],lead:["Qualified lead rate","Cost per qualified lead","Lead-to-KYC / SQL"],conversion:["Conversion rate","Cost per converted customer","Contribution outcome"],retention:["Reactivation rate","Incremental active users","Retention / value outcome"]})[funnel]}

function renderPlan(plan){
  const squad=plan.agents.map(getAgent).filter(Boolean);$("#mission-output").classList.remove("empty-state");
  $("#mission-output").innerHTML=`<div class="plan-head"><div><span class="plan-id">${esc(plan.id)} · ${esc(marketNames[plan.market])}</span><h3>Mission plan sẵn sàng</h3><p>${esc(plan.goal)}</p></div><div class="plan-actions"><button class="icon-button" id="copy-plan">Copy</button><button class="icon-button" id="export-plan">JSON</button></div></div><div class="squad">${squad.map(agent=>`<span>${esc(agent.icon)} · ${esc(agent.name)}</span>`).join("")}</div><div class="phase-list">${plan.phases.map((phase,index)=>`<div class="phase"><span>${index+1}</span><div><strong>${esc(phase.name)}</strong><p>${esc(phase.task)}<br>Owner: ${esc(phase.owners.join(" · "))}</p></div></div>`).join("")}</div><div class="plan-footer"><strong>Success metrics:</strong> ${plan.kpis.map(esc).join(" · ")}<br><strong>Approval:</strong> Human owner phải duyệt trước mọi hành động gửi, xuất bản hoặc thay đổi ngân sách.</div>`;
  $("#copy-plan").addEventListener("click",()=>copyPlan(plan));$("#export-plan").addEventListener("click",()=>exportPlan(plan));
}

function planText(plan){return [`MISSION ${plan.id}`,plan.goal,`Market: ${marketNames[plan.market]}`,`Squad: ${plan.agents.map(id=>getAgent(id)?.name).filter(Boolean).join(", ")}`,"",...plan.phases.map((phase,index)=>`${index+1}. ${phase.name}\n${phase.task}\nOwner: ${phase.owners.join(", ")}`),"",`KPIs: ${plan.kpis.join(", ")}`,"Approval required before publishing, sending or budget changes."].join("\n")}
async function copyPlan(plan){try{await navigator.clipboard.writeText(planText(plan));$("#copy-plan").textContent="Đã copy";setTimeout(()=>$("#copy-plan").textContent="Copy",1600)}catch{alert("Trình duyệt không cho phép copy tự động.")}}
function exportPlan(plan){const blob=new Blob([JSON.stringify(plan,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${plan.id}.json`;a.click();URL.revokeObjectURL(url)}
function savePlan(plan){const plans=JSON.parse(localStorage.getItem("marketingAgentPlans")||"[]").filter(item=>item.id!==plan.id);plans.unshift(plan);localStorage.setItem("marketingAgentPlans",JSON.stringify(plans.slice(0,6)));renderSavedPlans()}
function renderSavedPlans(){const plans=JSON.parse(localStorage.getItem("marketingAgentPlans")||"[]");$("#saved-plans").innerHTML=plans.length?`<span class="eyebrow">RECENT</span>${plans.map((plan,index)=>`<button class="saved-plan" data-saved="${index}">${esc(plan.id)} · ${esc(marketNames[plan.market])}</button>`).join("")}`:"";document.querySelectorAll("[data-saved]").forEach(button=>button.addEventListener("click",()=>renderPlan(plans[Number(button.dataset.saved)])))}

function matchesSignal(item){const kind=state.kind==="social"?["social_post","social_campaign"].includes(item.kind):state.kind==="ALL"||item.kind===state.kind;return(state.market==="ALL"||item.market===state.market||item.market==="SEA")&&kind}
function renderSignals(){
  const items=state.signals.filter(matchesSignal).slice(0,9);$("#kpi-signals").textContent=state.signals.length;$("#kpi-live").textContent=state.signals.filter(item=>item.status==="live").length;$("#kpi-risk").textContent=state.signals.filter(item=>item.kind==="compliance").length;
  $("#signal-grid").innerHTML=items.length?items.map(item=>`<article class="signal-card"><div class="signal-meta"><span class="signal-chip">${esc(marketNames[item.market]||item.market)} · ${esc(item.kind)}</span><span class="signal-status ${esc(item.status)}">${esc(item.status)}</span></div><h3>${esc(item.title)}</h3><p>${esc(item.summary||item.takeaway||"Chưa có mô tả.")}</p><span class="signal-brand">${esc(item.brand||"Market signal")}</span><a href="${esc(item.url||"#")}" target="_blank" rel="noopener">Mở nguồn gốc ↗</a></article>`).join(""):'<div class="empty-signal">Không có signal phù hợp với bộ lọc hiện tại.</div>';
}

async function loadIntelligence(){
  try{const response=await fetch(`data/latest.json?v=${Date.now()}`);if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();state.latest=data;state.signals=data.items||[];const stamp=new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Ho_Chi_Minh"}).format(new Date(data.generated_at));$("#last-scan").textContent=stamp;$("#sidebar-scan").textContent=`Last scan · ${stamp}`;const health=data.scan_health||{};$("#kpi-health").textContent=`${health.sources_ok??0}/${health.sources_total??0}`;renderSignals()}
  catch{$("#last-scan").textContent="Chờ GitHub scanner";$("#sidebar-scan").textContent="Planner ready · scanner pending";$("#kpi-health").textContent="—";state.signals=demoSignals;renderSignals()}
}

function init(){
  $("#today").textContent=new Intl.DateTimeFormat("vi-VN",{weekday:"long",day:"2-digit",month:"long",year:"numeric",timeZone:"Asia/Ho_Chi_Minh"}).format(new Date());
  renderAgents();renderWorkflows();renderSavedPlans();loadIntelligence();
  $("#mission-form").addEventListener("submit",buildMission);$("#agent-dialog .dialog-close").addEventListener("click",()=>$("#agent-dialog").close());
  $("#agent-dialog").addEventListener("click",event=>{if(event.target===$("#agent-dialog"))$("#agent-dialog").close()});
  document.querySelectorAll("[data-agent-filter]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-agent-filter]").forEach(item=>item.classList.remove("selected"));button.classList.add("selected");state.agentFilter=button.dataset.agentFilter;renderAgents()}));
  $("#agent-search").addEventListener("input",event=>{state.agentSearch=event.target.value;renderAgents()});
  document.querySelectorAll("[data-market]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-market]").forEach(item=>item.classList.remove("selected"));button.classList.add("selected");state.market=button.dataset.market;renderSignals()}));
  $("#kind-filter").addEventListener("change",event=>{state.kind=event.target.value;renderSignals()});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll(".sidebar nav a").forEach(link=>link.classList.toggle("active",link.dataset.section===entry.target.id))}}),{rootMargin:"-20% 0px -70% 0px"});document.querySelectorAll(".section-anchor").forEach(section=>observer.observe(section));
}
init();
