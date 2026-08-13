const state={items:[],strategies:[],market:"ALL",kind:"ALL",status:"ALL"};
const $=selector=>document.querySelector(selector);
const fmt=value=>value===null||value===undefined?"N/A":new Intl.NumberFormat("en",{notation:"compact"}).format(value);
const marketName={ID:"Indonesia",TH:"Thailand",PH:"Philippines",VN:"Vietnam",SEA:"SEA"};

function matchesKind(item){
  if(state.kind==="ALL")return true;
  if(state.kind==="social")return ["social_post","social_campaign"].includes(item.kind);
  if(state.kind==="promotion")return item.kind==="promotion";
  return item.kind===state.kind;
}
function filtered(){return state.items.filter(item=>(state.market==="ALL"||item.market===state.market||item.market==="SEA")&&matchesKind(item)&&(state.status==="ALL"||item.status===state.status));}
function renderKpis(){
  $("#kpi-signals").textContent=state.items.length;
  $("#kpi-live").textContent=state.items.filter(i=>i.status==="live").length;
  $("#kpi-social").textContent=state.items.filter(i=>i.kind.startsWith("social")).length;
  $("#kpi-risk").textContent=state.items.filter(i=>i.kind==="compliance").length;
}
function renderSignals(){
  const host=$("#signal-grid"),template=$("#signal-template"),items=filtered(); host.innerHTML="";
  $("#result-count").textContent=`${items.length} signals`;
  if(!items.length){host.innerHTML='<div class="empty">Không có signal phù hợp với bộ lọc hiện tại.</div>';return;}
  items.forEach(item=>{
    const node=template.content.cloneNode(true),card=node.querySelector("article");
    node.querySelector(".market-chip").textContent=marketName[item.market]||item.market;
    node.querySelector(".score").textContent=`Signal score ${item.signal_score??"N/A"}`;
    node.querySelector(".brand-name").textContent=item.brand;
    node.querySelector(".platform").textContent=item.platform;
    node.querySelector("h3").textContent=item.title;
    node.querySelector(".summary").textContent=item.summary;
    const metrics=item.metrics||{};
    node.querySelector(".metrics").innerHTML=`<span>Views ${fmt(metrics.views)}</span><span>Reactions ${fmt(metrics.reactions)}</span><span>Comments ${fmt(metrics.comments)}</span>`;
    node.querySelector(".takeaway p").textContent=item.takeaway;
    const status=node.querySelector(".status");status.textContent=item.status;status.classList.add(item.status);
    const link=node.querySelector("a");link.href=item.url;link.setAttribute("aria-label",`Open source for ${item.title}`);
    card.dataset.kind=item.kind;host.appendChild(node);
  });
}
function renderPromotions(){
  const rows=$("#promotion-rows");rows.innerHTML="";
  state.items.filter(i=>["promotion","social_campaign"].includes(i.kind)).forEach(item=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td><strong>${item.brand}</strong><br><small>${marketName[item.market]||item.market}</small></td><td>${item.title}</td><td>${item.funnel_stage}</td><td><span class="status ${item.status}">${item.status}</span></td><td><a href="${item.url}" target="_blank" rel="noopener">Official source ↗</a></td>`;
    rows.appendChild(tr);
  });
}
function renderStrategies(){
  const host=$("#strategy-grid");host.innerHTML="";
  state.strategies.forEach(strategy=>{const article=document.createElement("article");article.className="strategy-card";article.innerHTML=`<span class="horizon">${strategy.horizon}</span><h3>${strategy.name}</h3><p>${strategy.objective}</p><ul>${strategy.kpis.map(k=>`<li>${k}</li>`).join("")}</ul><p class="decision"><strong>Decision:</strong> ${strategy.decision}<br><strong>Owner:</strong> ${strategy.owner}</p>`;host.appendChild(article);});
}
function renderAll(){renderKpis();renderSignals();renderPromotions();renderStrategies();}
async function load(){
  try{const response=await fetch(`data/latest.json?v=${Date.now()}`);if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();state.items=data.items||[];state.strategies=data.strategies||[];
    $("#last-scan").textContent=new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Ho_Chi_Minh"}).format(new Date(data.generated_at));
    const health=data.scan_health||{};$("#scan-health").textContent=`${health.sources_ok??0}/${health.sources_total??0} sources OK`;
    renderAll();
  }catch(error){$("#signal-grid").innerHTML=`<div class="empty">Không tải được dữ liệu: ${error.message}. Hãy chạy dashboard qua web server.</div>`;}
}
document.querySelectorAll("[data-market]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-market]").forEach(b=>b.classList.remove("selected"));button.classList.add("selected");state.market=button.dataset.market;renderSignals();}));
$("#kind-filter").addEventListener("change",event=>{state.kind=event.target.value;renderSignals();});
$("#status-filter").addEventListener("change",event=>{state.status=event.target.value;renderSignals();});
load();

