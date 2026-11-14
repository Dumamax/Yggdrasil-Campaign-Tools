/* ================= APP SHELL: nav, table mode, print center, settings, boot ================= */
const App=(()=>{
  const PREP_TABS=["jobs","shop","roster","market","maps","print","settings"],TABLE_TABS=["table","maps","print","settings"],PLAYER_TABS=["p-board","p-party","p-guild","p-council","p-market","p-ledger","p-map"];
  const prices=()=>C.tables.prices||DEFAULT_PRICES;
  function tabs(){return !isDM()?PLAYER_TABS:UI.tableMode?TABLE_TABS:PREP_TABS}
  function nav(){
    if(!tabs().includes(UI.tab))UI.tab=tabs()[0];
    $$("#mainNav button").forEach(b=>{b.hidden=!tabs().includes(b.dataset.tab);b.classList.toggle("on",b.dataset.tab===UI.tab)});
    const pl=!isDM();document.body.classList.toggle("player",pl);
    $$("main>section").forEach(s=>s.hidden=pl?s.id!=="tab-p":s.id!=="tab-"+UI.tab);
    $("#dmBtn .lbl").textContent=pl?"DM View":"Player View";$("#dmBtn").title=pl?(unlocked()?"Back to DM View":"Unlock DM View"):"Preview what players see (stays unlocked)";
    $("#tmToggle").classList.toggle("on",UI.tableMode);$("#tmToggle .lbl").textContent=UI.tableMode?"Table Mode: on":"Table Mode";
    $("#aiMode").textContent=AI.label();$("#aiMode").classList.toggle("on",AI.mode()!=="none");
  }
  function render(){nav();Standing.render();({jobs:Jobs.render,shop:Upgrades.render,roster:Roster.render,market:Shops.render,table:renderTable,print:renderPrint,settings:renderSettings,maps:renderMaps,"p-board":renderPlayer,"p-party":renderPlayer,"p-guild":renderPlayer,"p-council":renderPlayer,"p-market":renderPlayer,"p-ledger":renderPlayer,"p-map":renderPlayer}[UI.tab]||(()=>{}))();Standing.render()}
  function reloadAll(){Jobs.reloadTables();Upgrades.reloadTables();Shops.reloadTables();NPCs.reloadTables();NPCs.ensure();Jobs.initControls();render()}

  /* ---------- player view (read-only handouts) ---------- */
  const none=msg=>`<p class="pv-empty">${msg}</p>`;
  function playerRoster(){const L=Roster.sorted().filter(m=>m.status!=="Left");if(!L.length)return "";
    return `<div class="pr pr-sheet"><h1>Members</h1><div class="prsub">${rankName(S.tierRank)}</div><table>${L.map(m=>`<tr><td class="nm">${esc(m.name)}</td><td>${esc(m.kind==="Active PC"?"Adventurer":m.kind==="Retired PC"?"Retired adventurer":m.kind==="Hired NPC"?(m.role||"Staff"):m.kind)}${m.level?` · level ${m.level}`:""}</td><td>${esc(m.ancestry||"")}</td></tr>`).join("")}</table></div>`}
  function renderPlayer(){const el=$("#tab-p");
    const P={"p-board":()=>Jobs.noticesPrintHTML()||none("No notices are posted right now. Check back soon."),
      "p-party":()=>"",
      "p-guild":()=>Standing.printHTML()+playerRoster()+(Upgrades.cardsHTML()?`<h2 class="pv-h">The Hall</h2>${Upgrades.cardsHTML()}`:""),
      "p-council":()=>NPCs.councilHTML()||none("The Council hasn't published its roll yet."),
      "p-market":()=>Shops.printHTML()||none("No shops have been charted yet."),
      "p-ledger":()=>Upgrades.ledgerHTML(false,true),
      "p-map":()=>C.maps.some(m=>!m.hidden)?C.maps.filter(m=>!m.hidden).map(m=>`<figure class="pv-map"><figcaption>${esc(m.name||"Map")}</figcaption><img src="${m.img}" alt="${esc(m.name||"Map")}" data-map="${m.id}"><div class="muted pv-maphint">Tap to zoom</div></figure>`).join(""):none("No maps have been posted yet.")};
    el.innerHTML=`<style>${printCSS()}</style><div class="pv">${(P[UI.tab]||P["p-board"])()}</div><p class="pv-foot muted">${esc(Sync.status()||"")}</p>`;
    if(UI.tab==="p-party")el.querySelector(".pv").append(PCs.tableSection());
    el.onclick=e=>{const i=e.target.closest("[data-map]");if(!i)return;const m=C.maps.find(x=>x.id===i.dataset.map);if(m)openMap(m.img,m.name||"Map")}}
  /* full-screen map viewer: wheel / pinch / buttons to zoom, drag to pan */
  function openMap(src,name){const md=modal(`<div class="mapv"><div class="mapv-bar"><b>${esc(name)}</b><span><button class="btn small" data-z="-" aria-label="Zoom out">−</button><button class="btn small" data-z="fit">Fit</button><button class="btn small" data-z="+" aria-label="Zoom in">+</button><button class="btn ghost" data-close aria-label="Close">✕</button></span></div><div class="mapv-view"><img src="${src}" alt="${esc(name)}" draggable="false"></div></div>`,"map-modal");
    const v=md.el.querySelector(".mapv-view"),img=v.querySelector("img");let z=1;
    const set=(nz,cx,cy)=>{nz=Math.max(1,Math.min(8,nz));const r=v.getBoundingClientRect();cx??=r.width/2;cy??=r.height/2;
      const px=(v.scrollLeft+cx)/img.offsetWidth,py=(v.scrollTop+cy)/img.offsetHeight;z=nz;img.style.width=`${z*100}%`;v.scrollLeft=px*img.offsetWidth-cx;v.scrollTop=py*img.offsetHeight-cy};
    md.el.querySelector(".mapv-bar").onclick=e=>{const k=e.target.closest("[data-z]")?.dataset.z;if(k==="+")set(z*1.5);else if(k==="-")set(z/1.5);else if(k==="fit")set(1);else if(e.target.closest("[data-close]"))md.close()};
    v.addEventListener("wheel",e=>{e.preventDefault();const r=v.getBoundingClientRect();set(z*(e.deltaY<0?1.15:1/1.15),e.clientX-r.left,e.clientY-r.top)},{passive:false});
    img.addEventListener("dblclick",e=>{const r=v.getBoundingClientRect();set(z>1.4?1:2.5,e.clientX-r.left,e.clientY-r.top)});
    let d0=0,z0=1;const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
    v.addEventListener("touchstart",e=>{if(e.touches.length===2){d0=dist(e.touches);z0=z}},{passive:true});
    v.addEventListener("touchmove",e=>{if(e.touches.length===2&&d0){e.preventDefault();const r=v.getBoundingClientRect();set(z0*dist(e.touches)/d0,(e.touches[0].clientX+e.touches[1].clientX)/2-r.left,(e.touches[0].clientY+e.touches[1].clientY)/2-r.top)}},{passive:false});
    v.addEventListener("touchend",e=>{if(e.touches.length<2)d0=0});
    let drag=null;v.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse")return;drag={x:e.clientX,y:e.clientY,l:v.scrollLeft,t:v.scrollTop};v.classList.add("dragging")});
    window.addEventListener("pointermove",e=>{if(drag){v.scrollLeft=drag.l-(e.clientX-drag.x);v.scrollTop=drag.t-(e.clientY-drag.y)}});
    window.addEventListener("pointerup",()=>{drag=null;v.classList.remove("dragging")})}
  /* Maps tab (DM): gallery, upload, players-can-see toggle, link to a world */
  function renderMaps(){const h=$("#mapGallery");if(!h)return;const W=C.worlds||[];
    h.innerHTML=`<div class="controls"><label class="btn primary">＋ Upload a map<input type="file" accept="image/*" id="mapAdd" hidden multiple></label>
      <span class="muted" style="flex:1;min-width:220px">Click a map to open it full screen. New maps start hidden from players; tick <b>Players can see</b> and Save to reveal one.</span></div>
      ${C.maps.length?`<div class="map-grid">${C.maps.map((m,i)=>{const w=m.worldId&&W.find(x=>x.id===m.worldId);return `<div class="card map-card" data-i="${i}">
        <img src="${m.img}" alt="${esc(m.name||"Map")}" data-open title="Open full screen">
        <input class="map-name" data-mapname value="${esc(m.name||"")}" placeholder="Map name">
        <label class="inline map-vis${m.hidden?" off":""}"><input type="checkbox" data-mapvis${m.hidden?"":" checked"}> ${m.hidden?"Hidden from players":"Players can see"}</label>
        <label class="map-world">World <select data-mapworld><option value="">— none (the Tree) —</option>${W.map(x=>`<option value="${x.id}"${m.worldId===x.id?" selected":""}>${esc(x.name)} · ${esc(x.gate)}</option>`).join("")}</select></label>
        ${w?`<a href="#" class="muted" data-goworld="${w.id}">→ ${esc(w.name)} in Worlds</a>`:""}
        <div class="actions"><button class="btn small ghost" data-mapup ${i?"":"disabled"} title="Move earlier">↑</button><span class="muted">${Math.round(m.img.length*0.75/1024)} KB</span><button class="btn small ghost danger" data-mapdel>Remove</button></div></div>`}).join("")}</div>`:'<p class="muted">No maps yet. Upload a map image to get started.</p>'}`;
    h.onchange=async e=>{const t=e.target;
      if(t.id==="mapAdd"&&t.files.length){toast("Preparing map…");let n=0;for(const f of t.files){try{C.maps.push({id:uid(),hidden:true,name:f.name.replace(/\.[^.]+$/,"").replace(/[-_]+/g," "),img:await PCs.shrink(f,2400,0.85)});n++}catch(err){toast(`Couldn't read ${f.name}`)}}
        if(n){commit();renderMaps();toast(`${n} map${n>1?"s":""} added, hidden from players until you tick "Players can see"`)}return}
      const r=t.closest(".map-card");if(!r)return;const m=C.maps[+r.dataset.i];
      if(t.dataset.mapvis!=null){m.hidden=!t.checked;commit();renderMaps();toast(m.hidden?`${m.name||"Map"} hidden from players`:`${m.name||"Map"} visible to players after you save`)}
      else if(t.dataset.mapworld!=null){if(t.value)m.worldId=t.value;else delete m.worldId;commit();renderMaps()}};
    h.oninput=e=>{if(e.target.dataset.mapname!=null){C.maps[+e.target.closest(".map-card").dataset.i].name=e.target.value;commit()}};
    h.onclick=e=>{const r=e.target.closest(".map-card");if(!r)return;const i=+r.dataset.i,m=C.maps[i];
      if(e.target.dataset.open!=null)openMap(m.img,m.name||"Map");
      else if(e.target.dataset.goworld){e.preventDefault();UI.tab="roster";UI.rosterSub="worlds";saveUI();render();flash(`[data-world="${e.target.dataset.goworld}"]`)}
      else if(e.target.dataset.mapup!=null&&i>0){[C.maps[i-1],C.maps[i]]=[C.maps[i],C.maps[i-1]];commit();renderMaps()}
      else if(e.target.dataset.mapdel!=null){if(!e.target.dataset.sure){e.target.dataset.sure=1;e.target.textContent="Remove? Click again";return}C.maps.splice(i,1);commit();renderMaps();toast("Map removed · Ctrl+Z to undo")}}}
  /* ---------- table mode ---------- */
  function renderTable(){
    const el=$("#tableView");el.innerHTML="";el.className="tm-layout";
    el.appendChild(PCs.tableSection());
    const side=document.createElement("aside");side.className="tm-side";el.appendChild(side);
    const closed=UI.tmClosed||(UI.tmClosed=[]);
    const live=C.jobs.filter(h=>(h.kept||h.final)&&!h.done);
    const col=(title,inner)=>{const p=document.createElement("details");p.className="panel side-panel";p.open=!closed.includes(title);p.innerHTML=`<summary><h2>${title}</h2></summary>`;
      p.ontoggle=()=>{const i=closed.indexOf(title);if(p.open&&i>=0)closed.splice(i,1);else if(!p.open&&i<0)closed.push(title);saveUI()};
      const b=document.createElement("div");b.className="side-body";if(typeof inner==="string")b.innerHTML=inner;else b.appendChild(inner);p.appendChild(b);side.appendChild(p);return b};
    col("Guild standing",Standing.tablePanel());
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
    col("Also in the hall",`<table class="ref">${Roster.sorted().filter(m=>m.kind!=="Active PC").map(m=>`<tr><td><b>${esc(m.name)}</b> <span class="muted">${esc(m.kind)} · ${esc(m.status||"")}</span>${m.assign?`<br><i class="muted">Operating ${esc(Roster.assignName(m))}</i>`:""}</td><td style="color:var(--ink);text-align:left;white-space:normal">${(m.skills||[]).map(s=>`${esc(s.s)} (${Roster.gradeOf(m,s)})`).join(", ")}</td></tr>`).join("")}</table>`);
    col("Shops in play",Shops.tableHTML());
    col("Price reference",`<p class="hint" style="margin-bottom:6px">${esc(prices().rule||"")}</p>${priceHTML()}`);
  }

  /* price rows like ["Inn, one night (modest / comfortable)","5 sp / 8 sp"] → label each price instead of matching slashes by eye */
  function priceItems([name,val]){const V=String(val).split(/\s+\/\s+/),unit=(V[V.length-1].match(/\s(cp|sp|gp|pp)(\/\w+)?$/)||[""])[0];
    const vals=V.map(v=>/\d$/.test(v.trim())&&unit?v.trim()+unit:v.trim());
    const pm=String(name).match(/^(.*?)\s*\(([^)]*\/[^)]*)\)\s*$/),cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
    if(pm){const L=pm[2].split(/\s*\/\s*/);if(L.length===vals.length)return {cat:pm[1],items:L.map((l,i)=>[cap(l),vals[i]])}}
    const N=String(name).split(/\s+\/\s+/);if(N.length===vals.length)return {cat:"",items:N.map((l,i)=>[cap(l),vals[i]])};
    return {cat:"",items:[[name,val]]}}
  function priceHTML(){return `<div class="prices">${prices().rows.map(r=>{const {cat,items}=priceItems(r);
    return `<div class="pr-row">${cat?`<div class="pr-cat">${esc(cat)}</div>`:""}${items.map(([l,v])=>`<div class="pr-it"><span>${esc(l)}</span><em></em><b>${esc(v)}</b></div>`).join("")}</div>`}).join("")}</div>`}
  /* ---------- print center ---------- */
  /* print: every handout is its own section starting on a new page; players' handouts first, DM-only last.
     Two-sided: a blank back is added after any section with an odd page count, so each section starts on a fresh sheet. */
  const PAGE_H=10*96,PAGE_W=7.5*96; // US Letter with .5in margins, in CSS px
  function printSections(){const p=UI.print,L=[];const add=(k,label,html,dm)=>{if(html)L.push({k,label,html,dm})};
    if(p.notices)add("notices","Quest Notices",Jobs.noticesPrintHTML());
    if(p.ledger)add("ledger","Builder's Ledger",Upgrades.ledgerHTML(p.full,p.offers));
    if(p.cards)add("cards","Upgrade cards",Upgrades.cardsHTML());
    if(p.shops)add("shops","Shop price lists",Shops.printHTML());
    if(p.council)add("council","Council Notice",NPCs.councilHTML());
    if(p.standing)add("standing","Guild Standing",Standing.printHTML());
    if(p.roster)add("roster","Roster sheet (DM)",Roster.printHTML(),true);
    if(p.npcs)add("npcs","NPC cheat sheet (DM)",NPCs.cheatHTML(),true);
    return L}
  function measure(L){const m=document.createElement("div");m.style.cssText=`position:absolute;left:-99999px;top:0;width:${PAGE_W}px;visibility:hidden`;
    m.className=UI.print.ink?"ink":"";m.innerHTML=`<style>${printCSS()}</style>`+L.map(s=>`<div class="pr-sec">${s.html}</div>`).join("");document.body.appendChild(m);
    const secs=[...m.querySelectorAll(".pr-sec")];L.forEach((s,i)=>s.pages=paginate(secs[i]));m.remove();return L}
  /* simulate page breaks: blocks that must not split get pushed whole to the next page */
  function paginate(sec){const top0=sec.getBoundingClientRect().top,H=PAGE_H-(sec.querySelector(".pr-sheet")?52:0);
    const atoms=[...sec.querySelectorAll(".pr-notice,.pr-shop,.pr-card,.npc-c,.cn-seat,.peddlers,.pr tbody,.pr-roster tr")].map(e=>{const r=e.getBoundingClientRect();return [r.top-top0,r.bottom-top0]}).sort((a,b)=>a[0]-b[0]);
    let pages=1,start=0;
    for(const [t,b] of atoms){if(b-start>H){if(t>start+1){start=t;pages++}while(b-start>H){start+=H;pages++}}}
    while(sec.scrollHeight-start>H+2){start+=H;pages++}
    return pages}
  function printBody(preview){const L=measure(printSections());if(!L.length)return "";
    const blank='<div class="pr-sec pr-blank"><span>This page is intentionally blank (two-sided printing).</span></div>';
    let out="",total=0;L.forEach(s=>{
      out+=`<div class="pr-sec${s.dm?" pr-dm":""}" data-label="${esc(s.label)} · about ${s.pages} page${s.pages>1?"s":""}">${s.html}</div>`;total+=s.pages;
      if(UI.print.duplex&&s.pages%2&&s!==L[L.length-1]){out+=blank;total++}});
    if(preview)$("#pPages").textContent=`About ${total} page${total>1?"s":""}${UI.print.duplex?` (${Math.ceil(total/2)} sheets)`:""}. Letter size; ${UI.print.ink?"black & white, no backgrounds.":"turn on \"Background graphics\" in the print dialog for the parchment."}`;
    return UI.print.ink?`<div class="ink">${out}</div>`:out}
  const printCSS=()=>PRINT_BASE+Standing.PRINT_CSS+Jobs.PRINT_CSS+Upgrades.PRINT_CSS+Shops.PRINT_CSS+NPCs.PRINT_CSS;
  const PRINT_BASE=`@page{size:letter;margin:.5in}
.pr-sec{break-before:page;page-break-before:always}.pr-sec:first-child{break-before:auto;page-break-before:auto}
.pr-blank{height:9.5in;display:flex;align-items:center;justify-content:center;font:italic 12px Georgia,serif;color:#9a8a70}
.pr-notice,.pr-shop,.pr-card,.npc-c,.cn-seat,.peddlers,.pr tbody,.pr tr{break-inside:avoid;page-break-inside:avoid}
.pr h1,.pr h2,.prsub{break-after:avoid;page-break-after:avoid}
@media screen{.preview .pr-sec{position:relative;padding-top:26px}.preview .pr-sec+.pr-sec{margin-top:22px;border-top:2px dashed #b89a6a}
.preview .pr-sec::before{content:attr(data-label);position:absolute;top:5px;left:0;font:600 12px "Cinzel",serif;letter-spacing:.06em;color:#8a6a3a}
.preview .pr-dm::before{color:#8a2a1a}.preview .pr-blank{height:120px;background:repeating-linear-gradient(135deg,#efe5cf 0 10px,#e8dcc0 10px 20px)}.preview .pr-blank::before{content:"Blank back page"}}
.preview .ink{background:#fff;padding:6px}
/* ink-friendly: no fills or shadows, black line-work, same fonts and ornaments */
.ink .pr-sec *{background:none!important;box-shadow:none!important;text-shadow:none!important;color:#111!important;border-color:#111!important}
.ink .pr-sheet{border:3px double #111;padding:20px 24px;border-radius:0}
.ink .pr td,.ink .shopsheet td{border-bottom:1px dotted #777!important}
.ink .pr h2{border-bottom:1.5px solid #111}
.ink .pr .prsub,.ink .pr .lvl,.ink .pr .ad,.ink .pr .foot,.ink .pr-card .fl,.ink .pr-card .k,.ink .shopsheet .sh-type,.ink .shopsheet .sh-by,.ink .shopsheet .d,.ink .shopsheet .sh-foot{color:#444!important}
.ink .pr-card{border:2px solid #111;outline:1px solid #111;outline-offset:-6px;border-radius:2px}
.ink .notice{transform:none!important;border:3px double #111;border-radius:0;padding:24px 24px 20px}
.ink .notice::before{display:none}
.ink .notice .nrule{border-top:1px solid #111}
.ink .notice .stamp{border:3px double #111;color:#111!important;top:14px;bottom:auto;right:14px;width:62px;height:62px;font-size:10px}
.ink .shopsheet{border:3px double #111;border-radius:0}
.ink .npc-c{border:1px solid #111;border-left:4px double #111}
.ink .pr h1::after,.ink .notice .ntitle::after,.ink .shopsheet .sh-name::after{content:"~ \\2766 ~";display:block;font:14px Georgia,serif;letter-spacing:.35em;margin-top:3px;color:#111}
.ink .pr-blank span{color:#888!important}`;
  function renderPrint(){
    const p=UI.print,finals=C.jobs.filter(h=>h.final).length;
    $$("#tab-print input[data-p]").forEach(i=>{i.checked=!!p[i.dataset.p];if(i.dataset.p==="full"||i.dataset.p==="offers"){i.disabled=!p.ledger;i.parentElement.classList.toggle("off",!p.ledger)}});
    $("#pNoticeCount").textContent=`(${finals} marked final)`;
    $("#printGo").textContent=FRAMED?"Download printable":"Print";
    const body=printBody(true);if(!body)$("#pPages").textContent="";
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
    const ss=$("#syncSettings");ss.innerHTML=Sync.settingsHTML();Sync.bindSettings(ss);
    const cs=$("#cpSettings");cs.innerHTML=Standing.settingsHTML();Standing.bindSettings(cs);
    $("#unlinkFile").hidden=!fileHandle;$("#saveAsNew").hidden=!FS_OK;renderBackups();
    loadTblEditor();
  }
  async function renderBackups(){const el=$("#backupList");if(!el)return;let L=[];try{L=(await IDB.list()).sort((a,b)=>b.t-a.t)}catch(e){el.innerHTML='<p class="muted">Backups aren\'t available in this browser.</p>';return}
    const row=b=>`<tr><td><b>${new Date(b.t).toLocaleString()}</b> <span class="muted">${esc(b.reason)}</span><br><span class="muted" style="font-size:14px">${esc(b.summary||"")}</span></td><td><button class="btn small" data-restore="${b.t}">Restore</button> <button class="btn small ghost" data-dl="${b.t}">Download</button></td></tr>`;
    el.innerHTML=L.length?`<table class="ref backups">${row(L[0])}</table>${L.length>1?`<details class="older-backups"><summary>Older backups (${L.length-1})</summary><table class="ref backups">${L.slice(1).map(row).join("")}</table></details>`:""}`:'<p class="muted">No backups yet.</p>';
    el.onclick=async e=>{const t=+(e.target.dataset.restore||e.target.dataset.dl);if(!t)return;const b=L.find(x=>x.t===t);if(!b)return;
      if(e.target.dataset.dl){saveFile(`yggdrasil-backup-${stamp()}.json`,b.data);return}
      if(!e.target.dataset.sure){e.target.dataset.sure=1;e.target.textContent="Replace current? Click again";return}
      replaceCampaign(JSON.parse(b.data),"Before restoring a backup");commit();toast("Backup restored. The state before it was backed up too")}}
  let tblKey="jobs",draft=null;
  const tblDefaults=()=>({jobs:DEFAULT_JOB_TABLES,upgrades:DEFAULT_UPG_TABLES,prices:DEFAULT_PRICES,shops:DEFAULT_SHOP_TABLES,npcs:DEFAULT_NPC_TABLES,places:DEFAULT_PLACES}[tblKey]);
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
    $("#mainNav").onclick=e=>{const t=e.target.closest("[data-tab]")?.dataset.tab;if(!t)return;const same=UI.tab===t;UI.tab=t;saveUI();render();if(!same)window.scrollTo(0,0)};
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
  /* ---------- layout (phone / desktop) + icons ---------- */
  const ICONS={search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',undo:'<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>',
    save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    open:'<path d="m6 14 1.5-2.9A2 2 0 0 1 9.2 10H20a2 2 0 0 1 1.9 2.5l-1.5 6a2 2 0 0 1-2 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v2"/>',
    dice:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="16" cy="16" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="16" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="16" r="1.2" fill="currentColor"/>',
    jobs:'<path d="M8 21h11a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4M15 8h-5M15 12h-5"/>',
    hall:'<path d="M3 21h18M5 21V10l7-6 7 6v11"/><path d="M10 21v-5h4v5"/>',
    party:'<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v2"/>',
    people:'<circle cx="9" cy="8" r="4"/><path d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M16 3.5a4 4 0 0 1 0 8M22 21v-1a5 5 0 0 0-3.5-4.8"/>',
    store:'<path d="M3 9l1.5-5h15L21 9M3 9h18v1.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v8h14v-8M10 21v-5h4v5"/>',
    print:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>',
    map:'<path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/>',shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    gear:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>'};
  function icons(){$$("[data-ico]").forEach(el=>{if(!el.querySelector("svg.ico"))el.insertAdjacentHTML("afterbegin",`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[el.dataset.ico]||""}</svg>`)})}
  const MQ=window.matchMedia("(max-width: 760px), (pointer: coarse) and (max-height: 500px)");
  function layout(){const l=UI.layout||"auto",phone=l==="phone"||(l==="auto"&&MQ.matches);document.body.classList.toggle("mobile",phone);
    $$("#layoutSeg button").forEach(b=>b.classList.toggle("on",b.dataset.l===l));const n=$("#layoutNow");if(n)n.textContent=`Showing: ${phone?"Phone":"Desktop"}`}
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
    (C.worlds||[]).forEach(w=>R.push({k:"World",n:w.name,d:`${w.gate} · ${w.genre||""} · ${w.status||""}`,go:()=>go("roster",`[data-world="${w.id}"]`,()=>{UI.rosterSub="worlds"})}));
    C.maps.forEach(m=>R.push({k:"Map",n:m.name||"Map",d:m.hidden?"hidden from players":"players can see",go:()=>{go("maps","main");openMap(m.img,m.name||"Map")}}));
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
    window.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"&&isDM()){e.preventDefault();$("#qs").hidden?qsOpen():qsClose()}else if(e.key==="Escape"&&!$("#qs").hidden)qsClose()});
  }
  async function boot(){
    Jobs.reloadTables();Upgrades.reloadTables();Shops.reloadTables();NPCs.reloadTables();NPCs.ensure();Jobs.initControls();
    icons();layout();MQ.addEventListener?.("change",layout);$("#layoutSeg").onclick=e=>{const l=e.target.dataset.l;if(!l)return;UI.layout=l;saveUI();layout()};
    $("#dmBtn").onclick=()=>isDM()?previewPlayer():unlocked()?backToDM():dmGate();
    $("#hdrMore").onclick=e=>{const p=e.target.dataset.proxy;if(!p)return;$("#hdrMore").open=false;$("#"+p).click()};
    $("#hdrMore summary").addEventListener("click",()=>{$("#hdrSync").textContent=Sync.status()||"";const t=$("#hdrMore [data-proxy=tmToggle]");t.textContent=UI.tableMode?"Leave Table Mode":"Table Mode"});$("#syncBtn").onclick=()=>Sync.pull(true);
    $("#pwForm").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);if(f.get("pw")!==f.get("pw2")){toast("Passwords don't match");return}S.dmHash=await hashPw(f.get("pw"));lsSet("ygh.dm",S.dmHash);commit();e.target.reset();toast("Password changed. Save so it travels with the campaign")};
    $("#lockNow").onclick=lockDM;
    Jobs.bind();Upgrades.bind();Roster.bind();bind();bindSearch();banner();undoBtn();render();Sync.start();
    if(window.claude?.use){
      try{AI.sample=await claude.use("sample")}catch(e){AI.sample=null}
      try{downloads=await claude.use("downloads")}catch(e){downloads=null}
      render();
    }
  }
  return {render,reloadAll,boot,flash,openMap};
})();
App.boot();
