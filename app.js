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

const quickPresets={
  "campaign-launch":{name:"30-Day Multi-channel Campaign Launch",goal:"Lập và triển khai campaign thu lead chất lượng tại Việt Nam trong 30 ngày, với creative matrix, media plan, landing journey, tracking và approval gate rõ ràng.",context:"Tạo kế hoạch từ strategy đến launch readiness. Ưu tiên chất lượng lead và khả năng chuyển đổi downstream thay vì chỉ tối ưu lead volume.",audience:"Người trưởng thành tại Việt Nam có nhu cầu phù hợp với sản phẩm, được phân nhóm theo intent và mức độ sẵn sàng chuyển đổi.",market:"VN",priority:"high-risk",budget:"USD 5,000 planning scenario",kpiTarget:"120 qualified leads; CPQL ≤ USD 35; theo dõi lead-to-business outcome",assets:"Landing page hiện có, brand guidelines, creative cũ, CRM và đội sales follow-up",constraints:"Không publish, gửi email, dùng claim hoặc thay đổi ngân sách trước khi owner và Compliance phê duyệt.",days:30},
  "competitor-pulse":{name:"SEA Competitor Intelligence Sprint",goal:"Tạo competitor intelligence report có bằng chứng cho SEA, ưu tiên thay đổi promotion, positioning, content, SEO và landing page trong 21 ngày.",context:"Chỉ sử dụng nguồn công khai. Mỗi phát hiện phải có URL, ngày quan sát, trạng thái xác minh và strategic implication.",audience:"Marketing Manager, Campaign, Content và Commercial stakeholders tại SEA.",market:"SEA",priority:"normal",budget:"12 analyst hours / week",kpiTarget:"100% high-priority signals có nguồn; weekly action memo; 5 cơ hội được ưu tiên",assets:"Competitor watchlist, official websites, public ad libraries, data/latest.json và historical snapshots",constraints:"Không dùng scraping trái điều khoản; không coi signal chưa xác minh là fact; không sao chép nội dung đối thủ.",days:21},
  "lead-quality":{name:"Lead Quality Improvement Loop",goal:"Kết nối paid media, landing page, CRM và sales outcome để tăng qualified lead rate trong 30 ngày và xác định điểm nghẽn chính của funnel.",context:"Đánh giá hiệu quả theo qualified lead và downstream outcome; CPL chỉ là chỉ số chẩn đoán, không phải quyết định cuối cùng.",audience:"Lead mới từ paid media được phân nhóm theo source, campaign, creative, market và CRM stage.",market:"VN",priority:"fast",budget:"Giữ nguyên ngân sách hiện tại trong giai đoạn chẩn đoán",kpiTarget:"Tăng qualified lead rate 20%; giảm CPQL 15%; có weekly keep/change/stop decision",assets:"Media export, UTM data, landing analytics, CRM stages và sales disposition",constraints:"Không tăng ngân sách khi chưa có mapping CRM; không gửi PII lên website; mọi thay đổi campaign cần owner duyệt.",days:30},
  "content-engine":{name:"90-Day SEO & Social Content Engine",goal:"Xây content engine 90 ngày từ search intent và competitor gaps, kết nối từng nội dung với funnel, CTA và chỉ số chuyển đổi.",context:"Ưu tiên topic clusters có nhu cầu rõ, bằng chứng competitor gap và khả năng tái sử dụng trên social, email và landing page.",audience:"Khách hàng tiềm năng đang ở giai đoạn awareness và consideration tại Việt Nam.",market:"VN",priority:"normal",budget:"Internal content production capacity",kpiTarget:"12 priority briefs; 36 social derivatives; engaged sessions và content-assisted leads tăng theo tháng",assets:"Website, Search Console, keyword list, social channels, brand guidelines và SME reviewers",constraints:"Không sao chép competitor; claim cần nguồn; nội dung regulated phải qua Compliance và localization QA.",days:90}
};

const demoSignals=[
  {brand:"Competitor watchlist",market:"SEA",kind:"promotion",status:"monitor",title:"Promotion pages are being monitored",summary:"Scanner sẽ hiển thị thay đổi từ nguồn chính thức sau lần chạy GitHub Actions tiếp theo.",url:"https://github.com/hahaonguyen-spec/competitor_research"},
  {brand:"System",market:"VN",kind:"compliance",status:"monitor",title:"Evidence-first control is active",summary:"Mọi signal cần nguồn, ngày quan sát và trạng thái xác minh trước khi dùng trong proposal.",url:"https://github.com/hahaonguyen-spec/competitor_research"}
];

const state={agentFilter:"all",agentSearch:"",signals:[],market:"ALL",kind:"ALL",latest:null,activeProject:null,runner:false};
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
  const deadline=new Date();deadline.setDate(deadline.getDate()+21);
  $("#project-name").value=workflow.name;$("#mission-goal").value=workflow.goal;$("#mission-funnel").value=workflow.funnel;$("#mission-channel").value=workflow.channel;$("#project-deadline").value=deadline.toISOString().slice(0,10);
  document.querySelector("#mission").scrollIntoView({behavior:"smooth"});
  setTimeout(()=>buildMission({preventDefault(){},workflow}),450);
}

function quickRun(id){
  const workflow=workflows.find(item=>item.id===id),preset=quickPresets[id];if(!workflow||!preset||state.runner)return;
  const deadline=new Date();deadline.setDate(deadline.getDate()+preset.days);
  const values={"project-name":preset.name,"mission-goal":preset.goal,"project-context":preset.context,"project-audience":preset.audience,"mission-market":preset.market,"mission-funnel":workflow.funnel,"mission-channel":workflow.channel,"mission-priority":preset.priority,"project-budget":preset.budget,"project-deadline":deadline.toISOString().slice(0,10),"project-kpi":preset.kpiTarget,"project-assets":preset.assets,"project-constraints":preset.constraints};
  Object.entries(values).forEach(([id,value])=>{$(`#${id}`).value=value});
  document.querySelectorAll("[data-quick-run]").forEach(button=>button.classList.toggle("selected",button.dataset.quickRun===id));
  document.querySelector("#mission-output").scrollIntoView({behavior:"smooth",block:"center"});
  buildMission({preventDefault(){},workflow});
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

function readProjectForm(){return{name:$("#project-name").value.trim(),goal:$("#mission-goal").value.trim(),context:$("#project-context").value.trim(),audience:$("#project-audience").value.trim(),market:$("#mission-market").value,funnel:$("#mission-funnel").value,channel:$("#mission-channel").value,priority:$("#mission-priority").value,budget:$("#project-budget").value.trim(),deadline:$("#project-deadline").value,kpiTarget:$("#project-kpi").value.trim(),assets:$("#project-assets").value.trim(),constraints:$("#project-constraints").value.trim()}}
function completeness(project){const fields=[project.name,project.goal,project.context,project.audience,project.budget,project.deadline,project.kpiTarget,project.assets,project.constraints];return Math.round(fields.filter(Boolean).length/fields.length*100)}
function addDays(date,days){const value=new Date(date);value.setDate(value.getDate()+days);return value}
function dueAt(created,deadline,fraction){const start=new Date(created),end=deadline?new Date(`${deadline}T12:00:00`):addDays(start,21),span=Math.max(1,end.getTime()-start.getTime());return new Date(start.getTime()+span*fraction).toISOString().slice(0,10)}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function buildMission(event){
  event.preventDefault();if(state.runner)return;const workflow=event.workflow;const brief=readProjectForm();if(!brief.name||!brief.goal||!brief.deadline){$("#mission-form").reportValidity();return}
  const combined=`${brief.goal} ${brief.context} ${brief.audience} ${brief.constraints}`;const squad=selectSquad(combined,brief.funnel,brief.channel,brief.priority,workflow?.agents||[]);const now=new Date();const id=`MH-${now.toISOString().slice(2,10).replaceAll("-","")}-${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}${String(now.getSeconds()).padStart(2,"0")}`;
  const project={...brief,id,created_at:now.toISOString(),agents:squad.map(agent=>agent.id),phases:buildPhases(squad,brief.goal),kpis:kpisFor(brief.funnel),readiness:completeness(brief)};
  project.tasks=buildTasks(project,squad);project.tracking=buildTracking(project);project.risks=buildRisks(project);state.runner=true;await runAgents(project,squad);state.runner=false;state.activeProject=project;saveProject(project);renderProject(project,"plan");
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

function buildTasks(project,squad){
  const ids=new Set(squad.map(agent=>agent.id)),created=project.created_at,tasks=[];const add=(phase,title,owner,deliverable,fraction)=>tasks.push({id:`T${String(tasks.length+1).padStart(2,"0")}`,phase,title,owner,deliverable,due:dueAt(created,project.deadline,fraction),status:"todo"});
  if(ids.has("competitor"))add("Insight","Xác minh competitor và market signals","Competitor Intelligence","Evidence pack + source log",.10);
  if(ids.has("audience"))add("Insight","Hoàn thiện audience hypothesis","Audience Insight","Segment + pain-point map",.14);
  add("Strategy","Chốt project strategy và KPI tree","Marketing Orchestrator","Approved strategy one-pager",.22);
  add("Tracking","Thiết lập UTM, events và dashboard schema","Analytics & Attribution","Measurement specification",.28);
  if(ids.has("content"))add("Production","Xây content roadmap và SEO briefs","SEO & Content","Editorial backlog",.38);
  if(ids.has("creative"))add("Production","Tạo creative/message matrix","Creative Brief","Hooks + asset briefs",.44);
  if(ids.has("localization"))add("Production","Localization và QA theo thị trường","Localization QA","Localized asset pack",.52);
  if(ids.has("cro"))add("Build","Hoàn thiện landing journey và form QA","CRO & Journey","CRO checklist + test plan",.58);
  if(ids.has("paid"))add("Activation","Xây campaign structure và test matrix","Paid Media Optimizer","Draft media build",.62);
  if(ids.has("social"))add("Activation","Lập social cadence và monitoring","Social Listening","Social publishing plan",.62);
  if(ids.has("lifecycle"))add("Activation","Thiết kế CRM journey và suppression rules","Lifecycle & CRM","Journey map + messages",.66);
  if(ids.has("compliance"))add("Approval","Rà soát claim, eligibility và T&C","Compliance & Risk","Risk review log",.72);
  add("Approval","Phê duyệt launch package","Marketing owner","Signed approval checklist",.78);
  add("Launch","QA tracking và launch readiness","Marketing Orchestrator","Go / no-go decision",.86);
  add("Optimize","Review hiệu quả và quyết định keep/change/stop","Analytics & Attribution","Weekly decision memo",1);return tasks;
}

function buildTracking(project){
  const events={awareness:[["page_view","Website / platform","Reach & traffic"],["engaged_visit","Analytics","Attention quality"],["branded_search","Search console","Demand signal"]],consideration:[["landing_view","Website","Qualified visit"],["content_engaged","Analytics","Content quality"],["return_visit","Analytics","Consideration"],["lead_start","Form / CRM","Intent"]],lead:[["landing_view","Website","Traffic"],["form_start","Form","Intent"],["lead_submit","CRM","Lead volume"],["qualified_lead","CRM","Lead quality"],["sales_outcome","CRM","Business outcome"]],conversion:[["qualified_visit","Website","Eligible traffic"],["conversion_start","Product / CRM","High intent"],["conversion_complete","CRM","Converted customer"],["business_outcome","Approved source","Downstream value"]],retention:[["message_delivered","CRM","Reachable base"],["engaged_click","CRM","Engagement"],["reactivation_event","Product / CRM","Reactivation"],["retained_outcome","Approved source","Retention value"]]}[project.funnel];
  return{primary:project.kpiTarget||kpisFor(project.funnel)[0],quality:kpisFor(project.funnel)[1],business:kpisFor(project.funnel)[2],events,utm:["utm_source","utm_medium","utm_campaign","utm_content","utm_term","market","creative_id"],cadence:"Daily delivery check · Weekly quality review · End-of-campaign decision memo"};
}

function buildRisks(project){const risks=[];if(!project.context)risks.push({level:"Medium",title:"Thiếu bối cảnh",action:"Bổ sung baseline, campaign trước và market evidence trước khi duyệt strategy."});if(!project.audience)risks.push({level:"Medium",title:"Audience chưa rõ",action:"Xác định eligibility, intent và exclusion trước activation."});if(!project.budget)risks.push({level:"Medium",title:"Chưa có ngân sách",action:"Không thể chốt channel allocation và stop/scale threshold."});if(!project.kpiTarget)risks.push({level:"High",title:"Chưa có target định lượng",action:"Marketing owner cần chốt target và quality metric."});if(project.priority==="high-risk")risks.push({level:"High",title:"Project thuộc nhóm regulated",action:"Bắt buộc Compliance/Legal duyệt claim, entity, eligibility và T&C."});risks.push({level:"Control",title:"Không tự động publish",action:"Mọi hành động gửi, publish hoặc thay đổi ngân sách cần human approval và connector được ủy quyền."});return risks}

async function runAgents(project,squad){
  const host=$("#mission-output");host.className="mission-output project-output";host.innerHTML=`<div class="run-console"><div class="runner-head"><div><span class="eyebrow">AGENT RUN IN PROGRESS</span><h3>Đang xử lý ${esc(project.name)}</h3><p>Phân tích brief → lập kế hoạch → implementation → tracking.</p></div><span class="runner-percent" id="runner-percent">0%</span></div><div class="runner-track"><i id="runner-bar"></i></div><div class="agent-run-list">${squad.map(agent=>`<div class="agent-run-row" data-run-agent="${agent.id}"><span class="run-icon">${esc(agent.icon)}</span><div><strong>${esc(agent.name)}</strong><small>${esc(agent.outputs[0])}</small></div><span class="run-state">Queued</span></div>`).join("")}</div></div>`;
  for(let index=0;index<squad.length;index++){const row=document.querySelector(`[data-run-agent="${squad[index].id}"]`);row.classList.add("running");row.querySelector(".run-state").textContent="Running";await delay(180);row.classList.remove("running");row.classList.add("done");row.querySelector(".run-state").textContent="Done";const progress=Math.round((index+1)/squad.length*100);$("#runner-percent").textContent=`${progress}%`;$("#runner-bar").style.width=`${progress}%`}
  await delay(220);
}

function progressOf(project){if(!project.tasks?.length)return 0;const weights={todo:0,doing:.5,blocked:.25,done:1};return Math.round(project.tasks.reduce((sum,task)=>sum+(weights[task.status]??0),0)/project.tasks.length*100)}
function renderProject(project,activeTab="plan"){
  state.activeProject=project;const squad=project.agents.map(getAgent).filter(Boolean),progress=progressOf(project),host=$("#mission-output");host.className="mission-output project-output";
  host.innerHTML=`<div class="project-result"><div class="project-summary"><div><span class="plan-id">${esc(project.id)} · ${esc(marketNames[project.market])}</span><h3>${esc(project.name)}</h3><p>${esc(project.goal)}</p></div><div class="project-score">${esc(project.readiness)}<small>BRIEF SCORE</small></div></div><div class="project-meta"><span>${esc(project.channel)}</span><span>${esc(project.funnel)}</span><span>Deadline ${esc(project.deadline)}</span><span>${esc(project.budget||"Budget pending")}</span></div><div class="project-progress"><span>Implementation progress</span><strong id="project-progress-value">${progress}%</strong><div class="project-progress-bar"><i id="project-progress-bar" style="width:${progress}%"></i></div></div><div class="plan-tabs"><button class="plan-tab ${activeTab==="plan"?"selected":""}" data-plan-tab="plan">Kế hoạch</button><button class="plan-tab ${activeTab==="tasks"?"selected":""}" data-plan-tab="tasks">Triển khai</button><button class="plan-tab ${activeTab==="tracking"?"selected":""}" data-plan-tab="tracking">Tracking</button><button class="plan-tab ${activeTab==="risks"?"selected":""}" data-plan-tab="risks">Risk & approval</button></div>${renderPlanPanel(project,squad,activeTab)}${renderTaskPanel(project,activeTab)}${renderTrackingPanel(project,activeTab)}${renderRiskPanel(project,activeTab)}<div class="result-actions"><button class="icon-button" id="copy-plan">Copy plan</button><button class="icon-button" id="export-plan">Export JSON</button><button class="icon-button" id="export-tasks">Export tasks CSV</button></div></div>`;
  document.querySelectorAll("[data-plan-tab]").forEach(button=>button.addEventListener("click",()=>renderProject(project,button.dataset.planTab)));document.querySelectorAll("[data-task-status]").forEach(select=>select.addEventListener("change",()=>updateTask(project,select.dataset.taskStatus,select.value)));$("#copy-plan").addEventListener("click",()=>copyPlan(project));$("#export-plan").addEventListener("click",()=>exportPlan(project));$("#export-tasks").addEventListener("click",()=>exportTasks(project));renderSavedProjects();
}

function renderPlanPanel(project,squad,active){return`<div class="plan-panel ${active==="plan"?"selected":""}"><div class="squad">${squad.map(agent=>`<span>${esc(agent.icon)} · ${esc(agent.name)}</span>`).join("")}</div><div class="phase-list compact">${project.phases.map((phase,index)=>`<div class="phase"><span>${index+1}</span><div><strong>${esc(phase.name)}</strong><p>${esc(phase.task)}<br>Owner: ${esc(phase.owners.join(" · "))}</p></div></div>`).join("")}</div><div class="plan-footer"><strong>Audience:</strong> ${esc(project.audience||"Cần xác định")}<br><strong>KPI target:</strong> ${esc(project.kpiTarget||project.kpis.join(" · "))}<br><strong>Available assets:</strong> ${esc(project.assets||"Chưa khai báo")}</div></div>`}
function renderTaskPanel(project,active){return`<div class="plan-panel ${active==="tasks"?"selected":""}"><div class="task-board"><div class="task-row task-head"><span>Phase</span><span>Task / deliverable</span><span>Owner</span><span>Due</span><span>Status</span></div>${project.tasks.map(task=>`<div class="task-row"><span class="task-phase">${esc(task.phase)}</span><span class="task-title"><strong>${esc(task.title)}</strong><small>${esc(task.deliverable)}</small></span><span class="task-owner">${esc(task.owner)}</span><span class="task-due">${esc(task.due)}</span><select class="task-status" data-task-status="${task.id}"><option value="todo" ${task.status==="todo"?"selected":""}>To do</option><option value="doing" ${task.status==="doing"?"selected":""}>Doing</option><option value="blocked" ${task.status==="blocked"?"selected":""}>Blocked</option><option value="done" ${task.status==="done"?"selected":""}>Done</option></select></div>`).join("")}</div></div>`}
function renderTrackingPanel(project,active){return`<div class="plan-panel ${active==="tracking"?"selected":""}"><div class="tracking-grid"><div class="tracking-card"><span>Primary target</span><strong>${esc(project.tracking.primary)}</strong></div><div class="tracking-card"><span>Quality metric</span><strong>${esc(project.tracking.quality)}</strong></div><div class="tracking-card"><span>Business outcome</span><strong>${esc(project.tracking.business)}</strong></div></div><div class="tracking-section"><h4>Event tracking specification</h4><table class="tracking-table"><thead><tr><th>Event</th><th>Source</th><th>Purpose</th></tr></thead><tbody>${project.tracking.events.map(event=>`<tr><td><code>${esc(event[0])}</code></td><td>${esc(event[1])}</td><td>${esc(event[2])}</td></tr>`).join("")}</tbody></table></div><div class="tracking-section"><h4>UTM & dimensions</h4><div class="squad">${project.tracking.utm.map(item=>`<span>${esc(item)}</span>`).join("")}</div></div><div class="tracking-section"><h4>Decision formulas</h4><div class="formula-list"><div><strong>CPQL</strong><br>Spend ÷ Qualified leads</div><div><strong>Qualification rate</strong><br>Qualified leads ÷ Total leads</div><div><strong>Conversion rate</strong><br>Business outcomes ÷ Qualified leads</div><div><strong>Decision cadence</strong><br>${esc(project.tracking.cadence)}</div></div></div></div>`}
function renderRiskPanel(project,active){return`<div class="plan-panel risk-panel ${active==="risks"?"selected":""}"><h4>Open risks and approval gates</h4><div class="risk-list">${project.risks.map(risk=>`<div class="risk-item"><span class="risk-level">${esc(risk.level)}</span><div><strong>${esc(risk.title)}</strong><p>${esc(risk.action)}</p></div></div>`).join("")}</div></div>`}

function updateTask(project,taskId,status){const task=project.tasks.find(item=>item.id===taskId);if(!task)return;task.status=status;saveProject(project);const progress=progressOf(project);$("#project-progress-value").textContent=`${progress}%`;$("#project-progress-bar").style.width=`${progress}%`}
function projectText(project){return[`PROJECT ${project.id}: ${project.name}`,project.goal,`Market: ${marketNames[project.market]}`,`Audience: ${project.audience||"TBD"}`,`Budget: ${project.budget||"TBD"}`,`Deadline: ${project.deadline}`,`KPI: ${project.kpiTarget||project.kpis.join(", ")}`,`Squad: ${project.agents.map(id=>getAgent(id)?.name).filter(Boolean).join(", ")}`,"","IMPLEMENTATION",...project.tasks.map(task=>`${task.id} [${task.status}] ${task.title} — ${task.owner} — due ${task.due}`),"","TRACKING",...project.tracking.events.map(event=>`${event[0]} | ${event[1]} | ${event[2]}`),"","Human approval required before publishing, sending or budget changes."].join("\n")}
async function copyPlan(project){try{await navigator.clipboard.writeText(projectText(project));$("#copy-plan").textContent="Đã copy";setTimeout(()=>$("#copy-plan").textContent="Copy plan",1600)}catch{alert("Trình duyệt không cho phép copy tự động.")}}
function download(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
function exportPlan(project){download(`${project.id}.json`,JSON.stringify(project,null,2),"application/json")}
function exportTasks(project){const quote=value=>`"${String(value??"").replaceAll('"','""')}"`,rows=[["Task ID","Phase","Task","Deliverable","Owner","Due","Status"],...project.tasks.map(task=>[task.id,task.phase,task.title,task.deliverable,task.owner,task.due,task.status])];download(`${project.id}-tasks.csv`,rows.map(row=>row.map(quote).join(",")).join("\n"),"text/csv;charset=utf-8")}
function saveProject(project){const projects=JSON.parse(localStorage.getItem("marketingAgentProjects")||"[]").filter(item=>item.id!==project.id);projects.unshift(project);localStorage.setItem("marketingAgentProjects",JSON.stringify(projects.slice(0,8)));renderSavedProjects()}
function renderSavedProjects(){const projects=JSON.parse(localStorage.getItem("marketingAgentProjects")||"[]"),host=$("#saved-projects");host.innerHTML=projects.length?`<span class="eyebrow">SAVED PROJECTS</span>${projects.map((project,index)=>`<button class="saved-plan ${state.activeProject?.id===project.id?"active":""}" data-saved-project="${index}"><strong>${esc(project.name)}</strong><small>${progressOf(project)}% · ${esc(project.deadline)}</small></button>`).join("")}`:"";document.querySelectorAll("[data-saved-project]").forEach(button=>button.addEventListener("click",()=>renderProject(projects[Number(button.dataset.savedProject)],"tasks")))}

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
  const defaultDeadline=new Date();defaultDeadline.setDate(defaultDeadline.getDate()+21);$("#project-deadline").value=defaultDeadline.toISOString().slice(0,10);
  renderAgents();renderWorkflows();renderSavedProjects();loadIntelligence();
  $("#mission-form").addEventListener("submit",buildMission);$("#agent-dialog .dialog-close").addEventListener("click",()=>$("#agent-dialog").close());
  document.querySelectorAll("[data-quick-run]").forEach(button=>button.addEventListener("click",()=>quickRun(button.dataset.quickRun)));
  $("#agent-dialog").addEventListener("click",event=>{if(event.target===$("#agent-dialog"))$("#agent-dialog").close()});
  document.querySelectorAll("[data-agent-filter]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-agent-filter]").forEach(item=>item.classList.remove("selected"));button.classList.add("selected");state.agentFilter=button.dataset.agentFilter;renderAgents()}));
  $("#agent-search").addEventListener("input",event=>{state.agentSearch=event.target.value;renderAgents()});
  document.querySelectorAll("[data-market]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-market]").forEach(item=>item.classList.remove("selected"));button.classList.add("selected");state.market=button.dataset.market;renderSignals()}));
  $("#kind-filter").addEventListener("change",event=>{state.kind=event.target.value;renderSignals()});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll(".sidebar nav a").forEach(link=>link.classList.toggle("active",link.dataset.section===entry.target.id))}}),{rootMargin:"-20% 0px -70% 0px"});document.querySelectorAll(".section-anchor").forEach(section=>observer.observe(section));
}
init();
