/* ================= APP SHELL: nav, table mode, print center, settings, boot ================= */
const App=(()=>{
  const PREP_TABS=["jobs","shop","roster","market","print","settings"],TABLE_TABS=["table","print","settings"];
  const prices=()=>C.tables.prices||DEFAULT_PRICES;
  function tabs(){return UI.tableMode?TABLE_TABS:PREP_TABS}
  function nav(){
    if(!tabs().includes(UI.tab))UI.tab=tabs()[0];
    $$("#mainNav button").forEach(b=>{b.hidden=!tabs().includes(b.dataset.tab);b.classList.toggle("on",b.dataset.tab===UI.tab)});
    $$("main>section").forEach(s=>s.hidden=s.id!=="tab-"+UI.tab);
    $("#tmToggle").classList.toggle("on",UI.tableMode);$("#tmToggle").textContent=UI.tableMode?"Table Mode: on":"Table Mode";
    $("#aiMode").textContent=AI.label();$("#aiMode").classList.toggle("on",AI.mode()!=="none");
  }
  function render(){nav();({jobs:Jobs.render,shop:Upgrades.render,roster:Roster.render,market:Shops.render,table:renderTable,print:renderPrint,settings:renderSettings}[UI.tab]||(()=>{}))()}
  function reloadAll(){Jobs.reloadTables();Upgrades.reloadTables();Shops.reloadTables();NPCs.reloadTables();NPCs.ensure();Jobs.initControls();render()}

  /* ---------- table mode ---------- */
  function renderTable(){
    const el=$("#tableView");el.innerHTML="";
    const live=C.jobs.filter(h=>h.kept||h.final);
    const col=(title,inner)=>{const p=document.createElement("div");p.className="panel";p.innerHTML=`<h2>${title}</h2>`;if(typeof inner==="string")p.insertAdjacentHTML("beforeend",inner);else p.appendChild(inner);el.appendChild(p);return p};
    const jobs=document.createElement("div");jobs.style.display="grid";jobs.style.gap="10px";
    if(!live.length)jobs.innerHTML='<p class="muted">Keep or finalize jobs on the Job Board and they show up here.</p>';
    live.forEach(h=>jobs.appendChild(Jobs.dmCard(h,true)));
    col("Jobs in play",jobs);
    const UT=Upgrades.tables(),g=C.guild,owned=UT.catalog.filter(u=>(g.owned[u.id]||0)>0);
    col("The guild hall",`<div class="row"><b>Treasury:</b> ${g.treasury==null?"—":fmt(g.treasury)+" gp"}</div>
      ${owned.length||g.uniques.length?`<ul style="margin:4px 0;padding-left:18px">${owned.map(u=>{const lv=g.owned[u.id],L=u.levels[lv-1],op=C.roster.find(m=>m.assign===u.id);return `<li><b>${esc(u.name)} ${Upgrades.ROMAN[lv-1]}</b>: ${esc(L.perk)}${op?` <span class="muted">(${esc(op.name)})</span>`:""}</li>`}).join("")}${g.uniques.map(u=>`<li><b>${esc(u.name)}</b>: ${esc(u.perk)}</li>`).join("")}</ul>`:'<p class="muted">No upgrades yet.</p>'}`);
    const chapel=g.owned.chapel||0,disc=[0,.25,.5,.75][chapel]||0;
    const rv=col("Revival fee",`<label class="inline">Character level <input id="rvLvl" type="number" min="1" max="20" value="${S.partyLevel}"></label><div class="row" id="rvOut"></div><p class="hint">${S.revive} gp × level${chapel?`, −${disc*100}% from the Root Chapel ${Upgrades.ROMAN[chapel-1]}`:""}. Death in the worlds is normal D&D.</p>`);
    const upd=()=>{const l=Math.max(1,+rv.querySelector("#rvLvl").value||1);rv.querySelector("#rvOut").innerHTML=`<b>Fee:</b> <span style="color:var(--gold);font-size:20px">${fmt(Math.round(S.revive*l*(1-disc)))} gp</span>`};
    rv.querySelector("#rvLvl").oninput=upd;upd();
    col("NPCs in play",NPCs.tableEl());
    col("Who's in the hall",`<table class="ref">${Roster.sorted().map(m=>`<tr><td><b>${esc(m.name)}</b> <span class="muted">${esc(m.kind)} · ${esc(m.status||"")}</span>${m.assign?`<br><i class="muted">Operating ${esc(Roster.assignName(m))}</i>`:""}</td><td style="color:var(--ink);text-align:left;white-space:normal">${(m.skills||[]).map(s=>`${esc(s.s)} (${Roster.gradeOf(m,s)})`).join(", ")}</td></tr>`).join("")}</table>`);
    col("Shops in play",Shops.tableHTML());
    col("Price reference",`<p class="hint" style="margin-bottom:6px">${esc(prices().rule||"")}</p><table class="ref">${prices().rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table>`);
  }

  /* ---------- print center ---------- */
  function printBody(){const p=UI.print;let out="";
    if(p.notices)out+=Jobs.noticesPrintHTML();
    if(p.ledger)out+=(out?'<div class="pr-break"></div>':"")+Upgrades.ledgerHTML(p.full,p.offers);
    if(p.cards){const c=Upgrades.cardsHTML();if(c)out+=(out?'<div class="pr-break"></div>':"")+c}
    if(p.shops){const s=Shops.printHTML();if(s)out+=(out?'<div class="pr-break"></div>':"")+s}
    if(p.roster)out+=(out?'<div class="pr-break"></div>':"")+Roster.printHTML();
    if(p.npcs){const s=NPCs.cheatHTML();if(s)out+=(out?'<div class="pr-break"></div>':"")+s}
    if(p.council){const s=NPCs.councilHTML();if(s)out+=(out?'<div class="pr-break"></div>':"")+s}
    return out}
  const printCSS=()=>Jobs.PRINT_CSS+Upgrades.PRINT_CSS+Shops.PRINT_CSS+NPCs.PRINT_CSS;
  function renderPrint(){
    const p=UI.print,finals=C.jobs.filter(h=>h.final).length;
    $$("#tab-print input[data-p]").forEach(i=>{i.checked=!!p[i.dataset.p];if(i.dataset.p==="full"||i.dataset.p==="offers"){i.disabled=!p.ledger;i.parentElement.classList.toggle("off",!p.ledger)}});
    $("#pNoticeCount").textContent=`(${finals} marked final)`;
    $("#printGo").textContent=FRAMED?"Download printable":"Print";
    const body=printBody();
    $("#preview").innerHTML=body?`<style>${printCSS().replace(/@media print\{[^}]*\}\}?/g,"")}</style>${body}`:'<p class="muted" style="color:#5a3e1e">Nothing selected yet. Mark jobs final on the Job Board, buy upgrades, or tick a section above.</p>';
  }

  /* ---------- settings ---------- */
  function renderSettings(){
    const mt=$("#mapTbl");mt.innerHTML="";
    TIERS.forEach(t=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${t}</td><td>lvl <input type="number" min="1" max="20" data-t="${t}" data-i="0" value="${S.mapping[t][0]}"> to <input type="number" min="1" max="20" data-t="${t}" data-i="1" value="${S.mapping[t][1]}"></td><td class="muted">1 job ≈ ${fmt(Math.round(Upgrades.fee(TIERS.indexOf(t))))} gp</td>`;mt.appendChild(tr)});
    $$("#numSettings input[data-s]").forEach(i=>i.value=S[i.dataset.s]);
    $("#apiKey").value="";$("#apiKey").placeholder=AI.key()?"Key saved in this browser (hidden)":"sk-ant-…";
    const known=["claude-haiku-5-5","claude-sonnet-5-5","claude-opus-5-5"];
    $("#modelSel").value=known.includes(UI.model)?UI.model:"custom";$("#modelCustom").value=known.includes(UI.model)?"":UI.model;$("#modelCustom").hidden=known.includes(UI.model);
    $("#aiStatus").textContent={claude:"Running inside Claude: Expand uses Claude directly. The API key isn't needed here.",api:"Using your API key from this browser.",none:"No connection: Expand fills in from the tables and gives you a prompt to copy into Claude."}[AI.mode()];
    $("#lastSaved").textContent=C.savedAt?`Last saved to file: ${new Date(C.savedAt).toLocaleString()}`:"Not saved to a file yet.";
    $("#linkedFile").innerHTML=FS_OK?(fileHandle?`Linked file: <b>${esc(fileHandle.name)}</b>. Save and Ctrl+S overwrite it.`:'<span class="muted">No linked file yet: the next Save asks where to keep it, then updates that same file.</span>'):'<span class="muted">This browser downloads a new dated file on each save (Chrome or Edge can update one file in place).</span>';
    $("#unlinkFile").hidden=!fileHandle;$("#saveAsNew").hidden=!FS_OK;renderBackups();
    loadTblEditor();
  }
  async function renderBackups(){const el=$("#backupList");if(!el)return;let L=[];try{L=(await IDB.list()).sort((a,b)=>b.t-a.t)}catch(e){el.innerHTML='<p class="muted">Backups aren\'t available in this browser.</p>';return}
    el.innerHTML=L.length?`<table class="ref backups">${L.map(b=>`<tr><td><b>${new Date(b.t).toLocaleString()}</b> <span class="muted">${esc(b.reason)}</span><br><span class="muted" style="font-size:14px">${esc(b.summary||"")}</span></td><td><button class="btn small" data-restore="${b.t}">Restore</button> <button class="btn small ghost" data-dl="${b.t}">Download</button></td></tr>`).join("")}</table>`:'<p class="muted">No backups yet.</p>';
    el.onclick=async e=>{const t=+(e.target.dataset.restore||e.target.dataset.dl);if(!t)return;const b=L.find(x=>x.t===t);if(!b)return;
      if(e.target.dataset.dl){saveFile(`yggdrasil-backup-${stamp()}.json`,b.data);return}
      if(!e.target.dataset.sure){e.target.dataset.sure=1;e.target.textContent="Replace current? Click again";return}
      replaceCampaign(JSON.parse(b.data),"Before restoring a backup");commit();toast("Backup restored. The state before it was backed up too")}}
  let tblKey="jobs",draft=null;
  const tblDefaults=()=>({jobs:DEFAULT_JOB_TABLES,upgrades:DEFAULT_UPG_TABLES,prices:DEFAULT_PRICES,shops:DEFAULT_SHOP_TABLES,npcs:DEFAULT_NPC_TABLES}[tblKey]);
  function loadTblEditor(){
    $("#tblSel").value=tblKey;draft=clone(C.tables[tblKey]||tblDefaults());
    const cur=C.tables[tblKey],def=tblDefaults(),stale=cur&&def.version&&(cur.version||0)<def.version;
    $("#tblState").textContent=cur?(stale?"Customized, and newer default content is available":"Customized (saved in the campaign file)"):"Using the built-in defaults";
    $("#mergeTbl").hidden=!stale;
    const easy=UI.tblMode!=="json";$("#tmEasy").classList.toggle("on",easy);$("#tmJson").classList.toggle("on",!easy);
    $("#tblEasy").hidden=!easy;$("#tblJson").hidden=easy;
    if(easy)TableEditor.render($("#tblEasy"),draft,()=>{$("#tblState").textContent="Unsaved table edits: click Save tables"});
    else $("#tblJson").value=JSON.stringify(draft,null,2);
  }

  function bind(){
    $("#mainNav").onclick=e=>{const t=e.target.dataset.tab;if(!t)return;UI.tab=t;saveUI();render()};
    $("#tmToggle").onclick=()=>{UI.tableMode=!UI.tableMode;UI.tab=UI.tableMode?"table":"jobs";saveUI();render()};
    $("#saveCamp").onclick=$("#bannerSave").onclick=()=>saveCampaign();
    $("#undoBtn").onclick=undo;
    $("#loadCamp").onclick=openCampaign;
    $("#saveAsNew").onclick=()=>saveCampaign(true);$("#unlinkFile").onclick=unlinkFile;
    $("#fileIn").onchange=e=>{const f=e.target.files[0];if(f)loadCampaignFile(f);e.target.value=""};
    $("#tab-print").onchange=e=>{const k=e.target.dataset.p;if(!k)return;UI.print[k]=e.target.checked;saveUI();renderPrint()};
    $("#printGo").onclick=()=>{const b=printBody();if(!b){toast("Nothing to print yet");return}printHTML("Yggdrasil Handouts",b,printCSS())};
    $("#mapTbl").oninput=e=>{const t=e.target.dataset.t;if(!t)return;S.mapping[t][+e.target.dataset.i]=+e.target.value||1;commit();Jobs.initControls()};
    $("#numSettings").onchange=e=>{const k=e.target.dataset.s;if(!k)return;const v=+e.target.value;S[k]=isNaN(v)?S[k]:v;if(S.hMax<S.hMin)S.hMax=S.hMin;commit()};
    $("#saveKey").onclick=()=>{const k=$("#apiKey").value.trim();if(!k){toast("Paste a key first");return}lsSet("ygh.apikey",k);toast("Key saved in this browser");render()};
    $("#forgetKey").onclick=()=>{try{localStorage.removeItem("ygh.apikey")}catch(e){}toast("Key removed");render()};
    $("#testKey").onclick=async e=>{const b=e.target;b.disabled=true;b.textContent="Testing…";
      try{const r=await AI.json('Return {"ok":true} as JSON.');toast(r&&r.ok?"Claude answered":"Claude answered, oddly")}catch(err){toast(err.noai?"No key saved":"Failed: "+err.message)}b.disabled=false;b.textContent="Test"};
    $("#modelSel").onchange=e=>{const v=e.target.value;$("#modelCustom").hidden=v!=="custom";if(v!=="custom"){UI.model=v;saveUI()}};
    $("#modelCustom").onchange=e=>{if(e.target.value.trim()){UI.model=e.target.value.trim();saveUI()}};
    $("#tblSel").onchange=e=>{tblKey=e.target.value;loadTblEditor()};
    $("#saveTbl").onclick=()=>{try{C.tables[tblKey]=UI.tblMode==="json"?JSON.parse($("#tblJson").value):clone(draft);commit();reloadAll();toast("Tables saved")}catch(e){toast("Invalid JSON: "+e.message)}};
    $("#mergeTbl").onclick=()=>{C.tables[tblKey]=mergeNew(C.tables[tblKey],tblDefaults());commit();reloadAll();toast("New default content added; your edits kept")};
    $("#tmEasy").onclick=()=>{UI.tblMode="easy";saveUI();loadTblEditor()};
    $("#tmJson").onclick=()=>{UI.tblMode="json";saveUI();loadTblEditor()};
    $("#resetTbl").onclick=()=>{C.tables[tblKey]=null;commit();reloadAll();toast("Defaults restored")};
    $("#copyTbl").onclick=()=>copyText($("#tblJson").value);
    $("#importPaste").onclick=()=>{try{importData(JSON.parse($("#importJson").value));$("#importJson").value=""}catch(e){toast("Invalid JSON: "+e.message)}};
    $("#newCamp").onclick=e=>{if(!e.target.dataset.sure){e.target.dataset.sure=1;e.target.textContent="Really wipe this browser's copy? Click again";return}
      replaceCampaign(newCampaign(),"Before starting a new campaign");commit();e.target.dataset.sure="";e.target.textContent="Start a new campaign";toast("New campaign started")};
  }
  /* ---------- go to + quick search ---------- */
  function flash(sel){requestAnimationFrame(()=>{const el=document.querySelector(sel);if(!el)return;el.scrollIntoView({behavior:"smooth",block:"center"});el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash")})}
  function go(tab,sel,prep){if(UI.tableMode&&!TABLE_TABS.includes(tab))UI.tableMode=false;UI.tab=tab;if(prep)prep();saveUI();render();flash(sel)}
  function index(){const R=[];
    C.jobs.forEach(h=>R.push({k:"Job",n:Jobs.hookTitle(h),d:`${h.objective} · ${h.patron.name}${h.final?" · Final":h.kept?" · Kept":""}`,
      go:()=>go("jobs",`[data-job="${h.id}"]`,()=>{UI.jobView="dm";Jobs.setOpen(h,true);Jobs.initControls()})}));
    C.roster.forEach(m=>{const mem=NPCs.isMember(m),sub=mem?"members":m.seat?"council":"npcs";
      R.push({k:mem?m.kind:m.seat?`${m.seat} Seat`:"NPC",n:m.name||"(unnamed)",d:[m.title||m.occupation||m.role,m.ancestry,m.guild].filter(Boolean).join(" · "),
        go:()=>go("roster",mem?`[data-member="${m.id}"]`:`[data-npc="${m.id}"]`,()=>{UI.rosterSub=sub;NPCs.reset()})})});
    C.shops.forEach(s=>R.push({k:"Shop",n:s.name,d:`${s.typeLabel||s.type} · ${s.place}${s.kept?" · Kept":""}`,go:()=>go("market",`[data-id="${s.id}"]`,()=>{UI.mkt&&(UI.mkt.view="dm")})}));
    Upgrades.tables().catalog.forEach(u=>R.push({k:"Upgrade",n:u.name,d:`${u.cat} · ${u.levels.map(L=>L.name).join(" → ")}`,go:()=>go("shop",`[data-upg="${u.id}"]`,()=>{UI.shopCat="All";UI.shopView="dm"})}));
    [["jobs","Job Board"],["shop","Guild Upgrades"],["roster","Roster"],["market","Shop Generator"],["print","Print"],["settings","Settings & Tables"]].forEach(([t,n])=>R.push({k:"Tab",n,d:"",go:()=>go(t,"main")}));
    return R}
  let qsItems=[],qsSel=0;
  function qsOpen(){$("#qs").hidden=false;$("#qsIn").value="";qsItems=index();qsDraw();$("#qsIn").focus()}
  function qsClose(){$("#qs").hidden=true}
  function qsDraw(){const q=$("#qsIn").value.toLowerCase().trim(),w=q.split(/\s+/).filter(Boolean);
    let L=w.length?qsItems.filter(r=>{const s=(r.n+" "+r.d+" "+r.k).toLowerCase();return w.every(x=>s.includes(x))}):qsItems.filter(r=>r.k==="Tab"||r.k==="Job"&&/Final|Kept/.test(r.d));
    if(q)L.sort((a,b)=>(b.n.toLowerCase().startsWith(q)-a.n.toLowerCase().startsWith(q))||(b.n.toLowerCase().includes(q)-a.n.toLowerCase().includes(q)));
    L=L.slice(0,40);qsSel=Math.min(qsSel,Math.max(0,L.length-1));$("#qsRes")._L=L;
    $("#qsRes").innerHTML=L.length?L.map((r,i)=>`<div class="qs-item${i===qsSel?" on":""}" data-i="${i}"><span class="badge">${esc(r.k)}</span> <b>${esc(r.n)}</b> <span class="muted">${esc(r.d)}</span></div>`).join(""):'<p class="muted" style="padding:8px 12px">Nothing matches.</p>';
    $("#qsRes .qs-item.on")?.scrollIntoView({block:"nearest"})}
  function qsPick(i){const r=$("#qsRes")._L[i];if(!r)return;qsClose();r.go()}
  function bindSearch(){
    $("#qsBtn").onclick=qsOpen;
    $("#qs").onclick=e=>{if(e.target.id==="qs")qsClose();const it=e.target.closest(".qs-item");if(it)qsPick(+it.dataset.i)};
    $("#qsIn").oninput=()=>{qsSel=0;qsDraw()};
    $("#qsIn").onkeydown=e=>{const n=$("#qsRes")._L.length;
      if(e.key==="ArrowDown"){e.preventDefault();qsSel=(qsSel+1)%Math.max(1,n);qsDraw()}else if(e.key==="ArrowUp"){e.preventDefault();qsSel=(qsSel-1+n)%Math.max(1,n);qsDraw()}
      else if(e.key==="Enter"){e.preventDefault();qsPick(qsSel)}else if(e.key==="Escape")qsClose()};
    window.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#qs").hidden?qsOpen():qsClose()}else if(e.key==="Escape"&&!$("#qs").hidden)qsClose()});
  }
  async function boot(){
    Jobs.reloadTables();Upgrades.reloadTables();Shops.reloadTables();NPCs.reloadTables();NPCs.ensure();Jobs.initControls();
    Jobs.bind();Upgrades.bind();Roster.bind();bind();bindSearch();banner();undoBtn();render();
    if(window.claude?.use){
      try{AI.sample=await claude.use("sample")}catch(e){AI.sample=null}
      try{downloads=await claude.use("downloads")}catch(e){downloads=null}
      render();
    }
  }
  return {render,reloadAll,boot,flash};
})();
App.boot();
