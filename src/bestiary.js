/* ================= BESTIARY: monsters, stat blocks, encounters =================
   Free official monsters (SRD 5.2 2024, plus SRD 5.1 2014 ones the 2024 list lacks) live in data/srd-monsters.json, loaded on first use and cached in IDB.
   Ids: "s24:<index>" / "s14:<index>" (never copied into C unless edited). C.monsters = the DM's own (Homebrew / Claude / Book reference).
   Book monsters store only a page reference + table numbers, because the campaign is saved to a public repo (no copyrighted rules text).
   C.encounters = [{id,name,jobId,groups:[{mid,n}],live:{cr:[{k,mid,label,hp,max,ac,init,cond[]}],round}}]; live tracking runs in the Home tile. */
const Bestiary=(()=>{
  const SRD_URL=["../data/srd-monsters.json","https://raw.githubusercontent.com/Dumamax/Yggdrasil-Campaign-Tools/main/data/srd-monsters.json"];
  const XP={"0":10,"1/8":25,"1/4":50,"1/2":100,"1":200,"2":450,"3":700,"4":1100,"5":1800,"6":2300,"7":2900,"8":3900,"9":5000,"10":5900,"11":7200,"12":8400,"13":10000,"14":11500,"15":13000,"16":15000,"17":18000,"18":20000,"19":22000,"20":25000,"21":33000,"22":41000,"23":50000,"24":62000,"25":75000,"26":90000,"27":105000,"28":120000,"29":135000,"30":155000};
  const CRS=Object.keys(XP),crNum=c=>{const s=String(c);return s.includes("/")?1/ +s.split("/")[1]:+s||0};
  /* 2024 DMG XP budget per character: Low / Moderate / High */
  const BUDGET=[0,[50,75,100],[100,150,200],[150,225,400],[250,375,500],[500,750,1100],[600,1000,1400],[750,1300,1700],[1000,1700,2100],[1300,2000,2600],[1600,2300,3100],[1900,2900,4100],[2200,3700,4700],[2600,4200,5400],[2900,4900,6200],[3300,5400,7800],[3800,6100,9800],[4500,7200,11700],[5000,8700,14200],[5500,10700,17200],[6400,13200,22000]];
  const CONDS=["Bloodied","Blinded","Charmed","Concentrating","Deafened","Exhaustion","Frightened","Grappled","Incapacitated","Invisible","Paralyzed","Petrified","Poisoned","Prone","Restrained","Stunned","Unconscious"];
  const ABN=["STR","DEX","CON","INT","WIS","CHA"],SECT=[["traits","Traits"],["actions","Actions"],["bonus","Bonus Actions"],["reactions","Reactions"],["legendary","Legendary Actions"]];
  let SRD=null,SRDI={},LICENSE="",loading=null;
  const mine=()=>C.monsters,encs=()=>C.encounters;
  /* ---------- data ---------- */
  function load(){if(SRD)return Promise.resolve(SRD);if(loading)return loading;
    loading=(async()=>{let txt=null;try{txt=await IDB.get("srd:1")}catch(e){}
      if(!txt)for(const u of SRD_URL){try{const r=await fetch(u,{cache:"no-cache"});if(r.ok){txt=await r.text();break}}catch(e){}}
      if(!txt)throw new Error("Couldn't load the free monster list (are you offline?)");
      const d=JSON.parse(txt);try{IDB.set("srd:1",txt)}catch(e){}
      SRD=d.monsters;LICENSE=d.license;SRDI={};SRD.forEach(m=>SRDI[m.id]=m);return SRD})().catch(e=>{loading=null;throw e});
    return loading}
  const get=id=>mine().find(m=>m.id===id)||SRDI[id]||null;
  const isSRD=id=>/^s(24|14):/.test(id||"");
  const all=()=>[...mine(),...(SRD||[])];
  const mod=s=>Math.floor(((+s||10)-10)/2),sg=n=>(n>=0?"+":"−")+Math.abs(n);
  const initOf=m=>m.init!=null&&m.init!==""?+m.init:mod((m.ab||[])[1]);
  const xpOf=m=>+m.xp||XP[String(m.cr)]||0;
  /* ---------- stat block ---------- */
  function statHTML(m,o={}){if(!m)return '<p class="muted">Monster not found.</p>';
    const line=(k,v)=>v?`<div class="sb-line"><b>${k}</b> ${esc(v)}</div>`:"";
    if(m.src==="Book")return `<div class="sb-block sb-book"><h3 class="sb-name">${esc(m.name)}</h3><div class="sb-meta">${esc([m.book,m.page?"p. "+m.page:""].filter(Boolean).join(", "))}</div><hr>
      <div class="sb-line"><b>AC</b> ${esc(m.ac||"—")} <b>Initiative</b> ${sg(initOf(m))} <b>HP</b> ${esc(m.hp||"—")}${m.hd?` (${esc(m.hd)})`:""}</div>${line("Speed",m.speed)}${line("CR",m.cr?`${m.cr} (XP ${fmt(xpOf(m))})`:"")}
      ${m.notes?`<hr><div class="sb-notes">${esc(m.notes).replace(/\n/g,"<br>")}</div>`:""}<div class="sb-src">Full stat block: see the book. Only table numbers are saved here.</div></div>`;
    const sv={};String(m.saves||"").split(/,\s*/).forEach(s=>{const x=s.match(/^(\w{3})\w*\s*([+−-]\s*\d+)/);if(x)sv[x[1].toUpperCase()]=x[2].replace(/\s/g,"").replace("−","-")});
    const ab=(m.ab||[10,10,10,10,10,10]).map((s,i)=>{const md=mod(s),k=ABN[i],save=sv[k]!=null?+sv[k]:md;return `<td class="sb-k">${k}</td><td>${s}</td><td>${sg(md)}</td><td${sv[k]!=null?' class="sb-p"':""}>${sg(save)}</td>`});
    const sect=(k,t)=>(m[k]||[]).length?`<h4>${t}</h4>${(m[k]||[]).map(([n,d])=>`<p><b><i>${esc(n)}.</i></b> ${esc(d)}</p>`).join("")}`:"";
    return `<div class="sb-block${o.compact?" compact":""}"><h3 class="sb-name">${esc(m.name)}</h3><div class="sb-meta">${esc([m.size,m.type].filter(Boolean).join(" "))}${m.align?", "+esc(m.align):""}</div><hr>
      <div class="sb-line"><b>AC</b> ${esc(m.ac)}${m.acn?` <span class="sb-dim">(${esc(m.acn)})</span>`:""} <b class="sb-gap">Initiative</b> ${sg(initOf(m))} (${10+initOf(m)})</div>
      <div class="sb-line"><b>HP</b> ${esc(m.hp)}${m.hd?` (${esc(m.hd)})`:""}</div>${line("Speed",m.speed)}
      <table class="sb-ab"><tr><th></th><th></th><th>Mod</th><th>Save</th><th></th><th></th><th>Mod</th><th>Save</th></tr><tr>${ab[0]}${ab[3]}</tr><tr>${ab[1]}${ab[4]}</tr><tr>${ab[2]}${ab[5]}</tr></table>
      ${line("Skills",m.skills)}${line("Vulnerabilities",m.vuln)}${line("Resistances",m.resist)}${line("Immunities",[m.immune,m.cimm].filter(Boolean).join("; "))}${line("Gear",m.gear)}${line("Senses",m.senses)}${line("Languages",m.langs)}
      <div class="sb-line"><b>CR</b> ${esc(m.cr)} <span class="sb-dim">(XP ${fmt(xpOf(m))}; PB ${sg(+m.pb||2)})</span></div><hr>
      ${SECT.map(([k,t])=>sect(k,t)).join("")}${m.notes?`<div class="sb-notes">${esc(m.notes)}</div>`:""}
      <div class="sb-src">${esc(m.src||"Homebrew")}${isSRD(m.id)?" · free rules, CC BY 4.0":""}</div></div>`}
  /* ---------- Bestiary tab ---------- */
  const F=()=>UI.bx||(UI.bx={q:"",src:"all",lo:"",hi:"",type:"",n:60});
  function render(){const el=$("#bestiaryView");if(!el)return;const f=F();
    if(!SRD&&!loading)load().then(()=>{if(UI.tab==="bestiary")render()}).catch(e=>toast(e.message));
    const types=[...new Set(all().map(m=>(m.type||"").replace(/\s*\(.*$/,"").toLowerCase()).filter(Boolean))].sort();
    el.innerHTML=`<div class="panel enc-panel"><div class="enc-head"><h2>Encounters</h2><button class="btn primary small" data-b="newenc">＋ New encounter</button></div><div id="encList"></div></div>
      <div class="controls bx-controls"><input id="bxQ" placeholder="Search monsters" value="${esc(f.q)}" style="flex:1;min-width:180px">
        <label>CR <select id="bxLo"><option value="">any</option>${CRS.map(c=>`<option${f.lo===c?" selected":""}>${c}</option>`).join("")}</select> to <select id="bxHi"><option value="">any</option>${CRS.map(c=>`<option${f.hi===c?" selected":""}>${c}</option>`).join("")}</select></label>
        <label>Type <select id="bxType"><option value="">any</option>${types.map(t=>`<option${f.type===t?" selected":""}>${esc(t)}</option>`).join("")}</select></label>
        <div class="seg" id="bxSrc">${[["all","All"],["mine","Mine"],["srd","Free rules"]].map(([k,l])=>`<button class="btn${f.src===k?" on":""}" data-src="${k}">${l}</button>`).join("")}</div>
        <details class="more bx-new"><summary class="btn primary">＋ Add monster</summary><div class="menu">
          <button class="btn small ghost" data-b="claude">Create with Claude</button><button class="btn small ghost" data-b="paste">Paste a stat block</button>
          <button class="btn small ghost" data-b="manual">Write my own</button><button class="btn small ghost" data-b="book">Book monster (page reference)</button></div></details></div>
      <div id="bxList"></div><p class="muted bx-lic">${esc(LICENSE||"Free monsters come from the System Reference Document (CC BY 4.0).")}</p>`;
    renderEnc();renderList();
    el.oninput=e=>{if(e.target.id==="bxQ"){f.q=e.target.value;f.n=60;saveUI();renderList()}};
    el.onchange=e=>{const id=e.target.id;if(id==="bxLo")f.lo=e.target.value;else if(id==="bxHi")f.hi=e.target.value;else if(id==="bxType")f.type=e.target.value;else return encChange(e);f.n=60;saveUI();renderList()};
    el.onclick=e=>{const s=e.target.closest("[data-src]");if(s){f.src=s.dataset.src;f.n=60;saveUI();return render()}
      const b=e.target.closest("[data-b]")?.dataset.b;if(b){e.target.closest("details")?.removeAttribute("open");
        if(b==="newenc"){encs().unshift({id:uid(),name:`Encounter ${encs().length+1}`,jobId:"",groups:[]});commit();return renderEnc()}
        if(b==="claude")return createClaude();if(b==="paste")return pasteBlock();if(b==="manual")return editor(null);if(b==="book")return bookForm(null);if(b==="more"){f.n+=100;return renderList()}}
      const r=e.target.closest("[data-mon]");if(r&&!e.target.closest(".enc-card"))return open(r.dataset.mon);
      encClick(e)}}
  function filtered(){const f=F(),q=f.q.toLowerCase().trim(),lo=f.lo?crNum(f.lo):-1,hi=f.hi?crNum(f.hi):99;
    let L=f.src==="mine"?mine():f.src==="srd"?(SRD||[]):all();
    return L.filter(m=>{const c=crNum(m.cr);if(c<lo||c>hi)return false;if(f.type&&!(m.type||"").toLowerCase().startsWith(f.type))return false;
      return !q||(m.name+" "+(m.type||"")).toLowerCase().includes(q)}).sort((a,b)=>a.name.localeCompare(b.name))}
  function renderList(){const h=$("#bxList");if(!h)return;const f=F(),L=filtered();
    if(!SRD&&F().src!=="mine"&&!mine().length){h.innerHTML='<p class="muted">Loading the free monster list…</p>';return}
    h.innerHTML=L.length?`<table class="ref bx-table"><tr><th>Monster</th><th>CR</th><th>AC</th><th>HP</th><th class="bx-hide">Type</th><th class="bx-hide">Source</th></tr>${L.slice(0,f.n).map(m=>`<tr data-mon="${esc(m.id)}"><td><b>${esc(m.name)}</b>${Home.isPinned("mon",m.id)?" 📌":""}</td><td>${esc(m.cr||"—")}</td><td>${esc(m.ac||"—")}</td><td>${esc(m.hp||"—")}</td><td class="bx-hide">${esc(m.size||"")} ${esc(m.type||"")}</td><td class="bx-hide muted">${esc(m.src||"Homebrew")}</td></tr>`).join("")}</table>
      ${L.length>f.n?`<div class="actions"><button class="btn" data-b="more">Show more (${L.length-f.n} left)</button></div>`:""}`:'<p class="muted">No monsters match.</p>'}
  /* ---------- monster detail ---------- */
  function open(id){const m=get(id);if(!m)return;const own=!isSRD(id);Usage.event("monster:open");
    const md=modal(`<div class="bx-modal">${statHTML(m)}</div><div class="actions bx-acts">
      <button class="btn small primary" data-x="pin">${Home.isPinned("mon",id)?"📌 Unpin from Home":"📌 Pin to Home"}</button>
      ${encs().length?`<select data-x="enc"><option value="">＋ Add to encounter…</option>${encs().map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join("")}<option value="new">New encounter</option></select>`:'<button class="btn small" data-x="newenc">＋ New encounter with this</button>'}
      ${own?`<button class="btn small" data-x="edit">Edit</button>`:`<button class="btn small" data-x="copy">Make an editable copy</button>`}
      ${m.src!=="Book"?'<button class="btn small" data-x="reskin">Reskin with Claude</button>':""}
      ${own?'<button class="btn small danger" data-x="del">Delete</button>':""}<button class="btn small ghost" data-close>Close</button></div>`,"bx-modal-w");
    md.el.onclick=e=>{const x=e.target.closest("[data-x]")?.dataset.x;if(e.target.closest("[data-close]"))return md.close();if(!x||x==="enc")return;
      if(x==="pin"){const on=Home.toggle("mon",id);e.target.textContent=on?"📌 Unpin from Home":"📌 Pin to Home";toast(on?"Pinned to Home":"Removed from Home");renderList();return}
      if(x==="newenc"){const en={id:uid(),name:m.name+(/s$/.test(m.name)?"":"s"),jobId:"",groups:[{mid:id,n:1}]};encs().unshift(en);commit();md.close();toast("Encounter started");return rerender()}
      if(x==="edit"){md.close();return m.src==="Book"?bookForm(m):editor(m)}
      if(x==="copy"){md.close();return editor(Object.assign(clone(m),{id:null,src:"Homebrew (from "+m.src+")"}))}
      if(x==="reskin"){md.close();return reskin(m)}
      if(x==="del"){if(!e.target.dataset.sure){e.target.dataset.sure=1;e.target.textContent="Delete? Click again";return}C.monsters=mine().filter(z=>z.id!==id);commit();md.close();rerender();toast("Deleted · Ctrl+Z to undo")}};
    md.el.onchange=e=>{if(e.target.dataset.x!=="enc"||!e.target.value)return;let en=e.target.value==="new"?null:encs().find(z=>z.id===e.target.value);
      if(!en){en={id:uid(),name:`Encounter ${encs().length+1}`,jobId:"",groups:[]};encs().unshift(en)}
      const g=en.groups.find(z=>z.mid===id);if(g)g.n++;else en.groups.push({mid:id,n:1});syncLive(en);commit();toast(`Added to ${en.name}`);e.target.value="";rerender()}}
  const rerender=()=>{if(UI.tab==="bestiary")render();else if(UI.tab==="home")Home.render()};
  /* ---------- your own monsters ---------- */
  const entTxt=L=>(L||[]).map(([n,d])=>`${n}. ${d}`).join("\n");
  const txtEnt=t=>String(t||"").split(/\n+/).map(s=>s.trim()).filter(Boolean).map(s=>{const x=s.match(/^(.+?)\.\s+([\s\S]*)$/);return x?[x[1],x[2]]:[s,""]});
  function save(m,quiet){const i=mine().findIndex(z=>z.id===m.id);if(i>=0)mine()[i]=m;else{m.id=m.id||uid();mine().unshift(m)}commit();if(!quiet)toast(`${m.name} saved to the Bestiary`);F().src="all";rerender();return m}
  function editor(m0){const m=m0?clone(m0):{name:"",size:"Medium",type:"",align:"",ac:12,hp:10,hd:"3d8",speed:"30 ft.",ab:[10,10,10,10,10,10],cr:"1",src:"Homebrew"};
    const fld=(k,l,w)=>`<label${w?` style="flex:${w}"`:""}>${l}<input name="${k}" value="${esc(m[k]??"")}"></label>`;
    const md=modal(`<h2>${m0&&m0.id?"Edit":"New"} monster</h2><form class="bx-form"><div class="bx-row">${fld("name","Name",3)}${fld("cr","CR",1)}</div>
      <div class="bx-row">${fld("size","Size")}${fld("type","Type")}${fld("align","Alignment")}</div>
      <div class="bx-row">${fld("ac","AC")}${fld("acn","AC note")}${fld("hp","HP")}${fld("hd","HP dice")}${fld("init","Initiative (blank = Dex)")}</div>
      <div class="bx-row">${fld("speed","Speed",2)}${fld("pb","PB")}</div>
      <div class="bx-row">${ABN.map((a,i)=>`<label>${a}<input name="ab${i}" type="number" value="${(m.ab||[])[i]??10}"></label>`).join("")}</div>
      <div class="bx-row">${fld("saves","Saves (Dex +4, Wis +2)")}${fld("skills","Skills")}</div>
      <div class="bx-row">${fld("vuln","Vulnerabilities")}${fld("resist","Resistances")}${fld("immune","Damage immunities")}${fld("cimm","Condition immunities")}</div>
      <div class="bx-row">${fld("senses","Senses",2)}${fld("langs","Languages",2)}</div>
      <p class="muted">One entry per line, written as <i>Name. What it does</i></p>
      ${SECT.map(([k,t])=>`<label>${t}<textarea name="${k}" rows="${k==="actions"?4:2}">${esc(entTxt(m[k]))}</textarea></label>`).join("")}
      <label>Notes (tactics, flavor)<textarea name="notes" rows="2">${esc(m.notes||"")}</textarea></label>
      <div class="actions"><button class="btn primary">Save</button><button type="button" class="btn ghost" data-close>Cancel</button></div></form>`,"bx-edit");
    md.el.querySelector("[data-close]").onclick=md.close;
    md.el.querySelector("form").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),o=Object.assign({},m);
      ["name","cr","size","type","align","acn","hd","speed","saves","skills","vuln","resist","immune","cimm","senses","langs","notes"].forEach(k=>o[k]=String(f.get(k)||"").trim());
      ["ac","hp","pb"].forEach(k=>o[k]=+f.get(k)||0);o.init=String(f.get("init")||"").trim();if(o.init==="")delete o.init;else o.init=+o.init;
      o.ab=ABN.map((_,i)=>+f.get("ab"+i)||10);SECT.forEach(([k])=>o[k]=txtEnt(f.get(k)));o.xp=XP[o.cr]||o.xp||0;if(!o.pb)o.pb=2+Math.max(0,Math.floor((crNum(o.cr)-1)/4));
      if(!o.name){toast("Give it a name");return}if(!o.src||/^SRD/.test(o.src))o.src="Homebrew";md.close();save(o)}}
  function bookForm(m0){const m=m0?clone(m0):{src:"Book",book:"Monster Manual (2024)",page:"",name:"",cr:"",ac:"",hp:"",init:""};
    const fld=(k,l,w)=>`<label${w?` style="flex:${w}"`:""}>${l}<input name="${k}" value="${esc(m[k]??"")}"></label>`;
    const md=modal(`<h2>Book monster</h2><p class="muted">Saves a page reference plus the numbers you need at the table. The campaign is stored in a public GitHub repo, so book text isn't copied in; use the notes for your own reminders.</p>
      <form class="bx-form"><div class="bx-row">${fld("name","Name",3)}${fld("cr","CR",1)}</div><div class="bx-row">${fld("book","Book",3)}${fld("page","Page",1)}</div>
      <div class="bx-row">${fld("ac","AC")}${fld("hp","HP")}${fld("hd","HP dice")}${fld("init","Initiative bonus")}${fld("speed","Speed")}</div>
      <label>Your notes<textarea name="notes" rows="3">${esc(m.notes||"")}</textarea></label>
      <div class="actions"><button class="btn primary">Save</button><button type="button" class="btn ghost" data-close>Cancel</button></div></form>`,"bx-edit");
    md.el.querySelector("[data-close]").onclick=md.close;
    md.el.querySelector("form").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),o=Object.assign({},m,{src:"Book"});
      ["name","cr","book","page","hd","speed","notes"].forEach(k=>o[k]=String(f.get(k)||"").trim());o.ac=+f.get("ac")||"";o.hp=+f.get("hp")||"";o.init=+f.get("init")||0;o.xp=XP[o.cr]||0;
      if(!o.name){toast("Give it a name");return}md.close();save(o)}}
  /* ---------- Claude ---------- */
  const SHAPE=`{"name":"","size":"","type":"","align":"","ac":0,"acn":"armor or natural armor","hp":0,"hd":"dice expression with Con bonus","speed":"30 ft., fly 60 ft.","ab":[STR,DEX,CON,INT,WIS,CHA],"init":dex mod or higher if proficient,"saves":"Dex +4, Wis +2","skills":"Perception +4","vuln":"","resist":"","immune":"","cimm":"","senses":"Darkvision 60 ft.; Passive Perception 12","langs":"","cr":"1/2","xp":100,"pb":2,"traits":[["Name","text"]],"actions":[["Name","text"]],"bonus":[],"reactions":[],"legendary":[],"notes":"one or two sentences: how it fights, plus a story hook"}`;
  const RULES=`Use the 2024 D&D rules (2024 Monster Manual conventions; fall back to 2014 only if needed). Balance it for its CR with the DMG guidelines: AC, HP, attack bonus, save DC and damage per round should all fit the CR. Write attacks the 2024 way: "Melee Attack Roll: +5, reach 5 ft. Hit: 7 (1d8 + 3) Slashing damage." Saving throws: "Dexterity Saving Throw: DC 13, each creature in a 15-foot Cone. Failure: ... Success: Half damage." The campaign uses a mana point house rule for player casters; monsters cast normally.
Setting: one universal World Tree (Yggdrasil) whose branches grow into worlds of every genre; tone is whimsical-weird first, heroic second.`;
  function claude(prompt,src,after){const go=r=>{const m=normalizeAI(r,src);if(!m){toast("That reply didn't look like a stat block");return}save(m);after&&after(m);open(m.id)};
    if(AI.mode()!=="none"){toast("Asking Claude…");AI.json(prompt).then(go).catch(e=>e.noai?manual():(toast("Claude couldn't do it: "+e.message),manual()));return}
    manual();
    function manual(){const md=modal(`<h2>Run this in Claude</h2><p class="muted">No Claude connection on this device. Copy the prompt into Claude, then paste its JSON reply below.</p>
      <textarea readonly rows="6" style="width:100%">${esc(prompt)}</textarea><div class="actions"><button class="btn small" data-c>Copy prompt</button></div>
      <textarea data-r rows="6" style="width:100%" placeholder="Paste Claude's JSON reply"></textarea><div class="actions"><button class="btn primary" data-a>Use this</button><button class="btn ghost" data-close>Cancel</button></div>`,"bx-edit");
      md.el.onclick=e=>{if(e.target.closest("[data-close]"))return md.close();if(e.target.closest("[data-c]"))return copyText(prompt);
        if(e.target.closest("[data-a]")){let r;try{const t=md.el.querySelector("[data-r]").value;r=JSON.parse(t.slice(t.indexOf("{"),t.lastIndexOf("}")+1))}catch(err){toast("Couldn't read that JSON");return}md.close();go(r)}}}}
  function normalizeAI(r,src){if(!r||!r.name)return null;const m={id:uid(),src};
    ["name","size","type","align","acn","hd","speed","saves","skills","vuln","resist","immune","cimm","senses","langs","notes"].forEach(k=>{if(r[k])m[k]=String(r[k])});
    m.ac=+r.ac||10;m.hp=+r.hp||1;m.cr=String(r.cr??"1");m.xp=+r.xp||XP[m.cr]||0;m.pb=+r.pb||2;if(r.init!=null&&!isNaN(+r.init))m.init=+r.init;
    m.ab=(Array.isArray(r.ab)&&r.ab.length===6?r.ab:[10,10,10,10,10,10]).map(x=>+x||10);
    SECT.forEach(([k])=>{m[k]=(r[k]||[]).map(e=>Array.isArray(e)?[String(e[0]),String(e[1]||"")]:[String(e.name||""),String(e.desc||e.text||"")]).filter(e=>e[0])});return m}
  function createClaude(){const md=modal(`<h2>Create a monster with Claude</h2><form class="bx-form"><label>What is it?<textarea name="c" rows="3" required placeholder="a mushroom-folk bandit who robs travelers of their memories"></textarea></label>
      <div class="bx-row"><label>CR<select name="cr">${CRS.map(c=>`<option${c===String(Math.max(1,S.partyLevel-1))?" selected":""}>${c}</option>`).join("")}</select></label><label style="flex:2">Based on (optional)<input name="b" placeholder="e.g. Bandit Captain" list="bxNames"></label></div>
      <datalist id="bxNames">${(SRD||[]).map(m=>`<option value="${esc(m.name)}">`).join("")}</datalist>
      <div class="actions"><button class="btn primary">Create</button><button type="button" class="btn ghost" data-close>Cancel</button></div></form>`,"bx-edit");
    md.el.querySelector("[data-close]").onclick=md.close;
    md.el.querySelector("form").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),base=(SRD||[]).find(m=>m.name.toLowerCase()===String(f.get("b")).trim().toLowerCase());md.close();Usage.event("monster:claude");
      claude(`You are helping a DM build a monster for a D&D 5e campaign. ${RULES}
Concept: ${f.get("c")}
Challenge Rating: ${f.get("cr")}${f.get("b")?`\nBuild it on this base (adjust as needed to fit the concept and CR): ${base?JSON.stringify(base):f.get("b")}`:""}
Return ONLY JSON in this shape: ${SHAPE}`,"Claude")}}
  function reskin(m){const md=modal(`<h2>Reskin ${esc(m.name)}</h2><p class="muted">Claude keeps every number and mechanic, and changes the name, look and the names and wording of its abilities.</p><form class="bx-form"><label>Into what?<textarea name="c" rows="2" required placeholder="a clockwork owlbear from a steampunk branch"></textarea></label>
      <div class="actions"><button class="btn primary">Reskin</button><button type="button" class="btn ghost" data-close>Cancel</button></div></form>`,"bx-edit");
    md.el.querySelector("[data-close]").onclick=md.close;
    md.el.querySelector("form").onsubmit=e=>{e.preventDefault();const c=new FormData(e.target).get("c");md.close();Usage.event("monster:reskin");
      const base=Object.assign({},m);delete base.id;delete base.src;
      claude(`You are helping a DM reskin a D&D 5e monster. ${RULES}
Keep every number and mechanic exactly the same (AC, HP, ability scores, CR, attack bonuses, damage dice, DCs, ranges, uses). Change the name, size/type flavor if fitting, and rename and reword traits and actions to fit this idea: ${c}
Monster: ${JSON.stringify(base)}
Return ONLY JSON in this shape: ${SHAPE}`,"Claude (reskin of "+m.name+")")}}
  function pasteBlock(){const md=modal(`<h2>Paste a stat block</h2><p class="muted">Claude turns pasted text into a stat block you can edit. The campaign is saved to a <b>public</b> GitHub repo, so only paste homebrew or free-rules monsters; for book monsters, use <b>Book monster</b> instead.</p>
      <form class="bx-form"><textarea name="t" rows="10" required placeholder="Paste the stat block text here"></textarea><div class="actions"><button class="btn primary">Convert</button><button type="button" class="btn ghost" data-close>Cancel</button></div></form>`,"bx-edit");
    md.el.querySelector("[data-close]").onclick=md.close;
    md.el.querySelector("form").onsubmit=e=>{e.preventDefault();const t=new FormData(e.target).get("t");md.close();Usage.event("monster:paste");
      claude(`Convert this D&D 5e stat block into JSON. Copy the text faithfully; don't invent anything. If a value is missing, leave it empty.
Stat block:
${t}
Return ONLY JSON in this shape: ${SHAPE}`,"Homebrew")}}
  /* ---------- encounters ---------- */
  function difficulty(en){const xp=en.groups.reduce((a,g)=>a+xpOf(get(g.mid)||{})*g.n,0),lv=Math.min(20,Math.max(1,+S.partyLevel||1)),n=Math.max(1,+S.partySize||4),[lo,mo,hi]=BUDGET[lv].map(x=>x*n);
    const lab=xp===0?"Empty":xp<lo?"Easy (under Low)":xp<mo?"Low":xp<hi?"Moderate":xp<=hi*1.05?"High":"Beyond High (very deadly)";
    const cls=xp<mo?"leaf":xp<hi?"gold":"red";return {xp,lab,cls,txt:`${fmt(xp)} XP · <b>${lab}</b> for ${n} level-${lv} characters <span class="muted">(Low ${fmt(lo)} · Moderate ${fmt(mo)} · High ${fmt(hi)})</span>`}}
  function renderEnc(){const h=$("#encList");if(!h)return;const J=C.jobs.filter(j=>j.kept||j.final);
    h.innerHTML=encs().length?encs().map(en=>{const d=difficulty(en);return `<div class="card enc-card" data-enc="${en.id}">
      <div class="bx-row"><input class="enc-name" data-e="name" value="${esc(en.name)}"><select data-e="job"><option value="">— no quest —</option>${J.map(j=>`<option value="${j.id}"${en.jobId===j.id?" selected":""}>${esc(Jobs.hookTitle(j))}</option>`).join("")}</select></div>
      <div class="enc-groups">${en.groups.map((g,i)=>{const m=get(g.mid);return `<div class="enc-g"><a href="#" data-mon="${esc(g.mid)}">${esc(m?m.name:"(loading…)")}</a> <span class="muted">CR ${esc(m?.cr||"?")}</span>
        <span class="enc-n"><button class="btn small ghost" data-e="minus" data-i="${i}">−</button><b>${g.n}</b><button class="btn small ghost" data-e="plus" data-i="${i}">＋</button></span></div>`}).join("")||'<p class="muted">Add monsters: search below and open one, or type a name here.</p>'}</div>
      <div class="bx-row"><input data-e="add" list="encNames" placeholder="＋ Add a monster by name" style="flex:1"></div>
      <div class="badge ${d.cls} enc-diff">${d.txt}</div>
      <div class="actions"><button class="btn small primary" data-e="run">${Home.isPinned("enc",en.id)?"Open on Home":"📌 Run on Home"}</button><button class="btn small ghost danger" data-e="del">Delete</button></div></div>`}).join("")+
      `<datalist id="encNames">${all().map(m=>`<option value="${esc(m.name)}">`).join("")}</datalist>`:'<p class="muted">Build a fight: add monsters, see how hard it is for the party, then run it on Home with HP and initiative tracking.</p>'}
  function encOf(e){const c=e.target.closest(".enc-card");return c&&encs().find(z=>z.id===c.dataset.enc)}
  function encChange(e){const en=encOf(e);if(!en)return;const k=e.target.dataset.e;
    if(k==="name"){en.name=e.target.value;commit()}
    else if(k==="job"){en.jobId=e.target.value;commit()}
    else if(k==="add"){const v=e.target.value.trim().toLowerCase(),m=all().find(z=>z.name.toLowerCase()===v);if(!m){toast("No monster by that name");return}
      const g=en.groups.find(z=>z.mid===m.id);if(g)g.n++;else en.groups.push({mid:m.id,n:1});syncLive(en);commit();renderEnc()}}
  function encClick(e){const en=encOf(e);if(!en)return;const k=e.target.closest("[data-e]")?.dataset.e;
    const mon=e.target.closest("a[data-mon]");if(mon){e.preventDefault();return open(mon.dataset.mon)}
    const i=+e.target.closest("[data-i]")?.dataset.i;
    if(k==="plus"){en.groups[i].n++;syncLive(en);commit();renderEnc()}
    else if(k==="minus"){en.groups[i].n--;if(en.groups[i].n<=0)en.groups.splice(i,1);syncLive(en);commit();renderEnc()}
    else if(k==="run"){if(!Home.isPinned("enc",en.id))Home.toggle("enc",en.id);syncLive(en);commit();App.go("home",`.tile[data-ref="${en.id}"]`)}
    else if(k==="del"){const b=e.target.closest("[data-e]");if(!b.dataset.sure){b.dataset.sure=1;b.textContent="Delete? Click again";return}C.encounters=encs().filter(z=>z.id!==en.id);commit();renderEnc();toast("Encounter deleted · Ctrl+Z to undo")}}
  /* live creatures follow the groups; existing ones keep their HP and conditions */
  function syncLive(en){const L=(en.live=en.live||{cr:[],round:1}).cr,keep=[];
    en.groups.forEach(g=>{const m=get(g.mid);for(let n=1;n<=g.n;n++){const k=g.mid+"#"+n;let c=L.find(z=>z.k===k);
      if(!c)c={k,mid:g.mid,label:(m?m.name:"Monster")+(g.n>1||n>1?" "+n:""),hp:+(m?.hp)||1,max:+(m?.hp)||1,ac:m?.ac||"",init:null,cond:[]};
      else if(m&&g.n>1&&!/ \d+$/.test(c.label))c.label+=" "+n;keep.push(c)}});
    en.live.cr=keep}
  /* Home tile: run the fight */
  function encTile(en){if(!en.live||!en.live.cr.length)syncLive(en);const L=en.live.cr,d=difficulty(en);
    return `<div class="enc-top"><span class="badge ${d.cls}">${esc(d.lab)} · ${fmt(d.xp)} XP</span>${en.jobId?` <span class="muted">${esc(Jobs.hookTitle(C.jobs.find(j=>j.id===en.jobId)||{})||"")}</span>`:""}</div>
      <div class="enc-live">${L.map((c,i)=>{const p=Math.max(0,Math.min(100,c.hp/c.max*100)),bl=c.hp>0&&c.hp<=c.max/2,dead=c.hp<=0;
        return `<div class="cr-row${dead?" dead":""}" data-ci="${i}"><div class="cr-top"><a href="#" data-mon="${esc(c.mid)}"><b>${esc(c.label)}</b></a><span class="muted">AC ${esc(c.ac)}${c.init!=null?` · Init ${c.init}`:""}</span></div>
          <div class="cr-hp"><div class="hpbar${bl?" bl":""}"><i style="width:${p}%"></i><span>${c.hp} / ${c.max}</span></div>
          <input type="number" data-w="amt" placeholder="0" min="0"><button class="btn small" data-w="dmg" title="Damage">−</button><button class="btn small" data-w="heal" title="Heal">＋</button></div>
          <div class="cr-cond">${bl?'<span class="badge red">Bloodied</span>':""}${c.cond.map(x=>`<span class="badge" data-w="uncond" data-v="${esc(x)}" title="Remove">${esc(x)} ✕</span>`).join("")}<select data-w="cond"><option value="">＋ condition</option>${CONDS.filter(x=>x!=="Bloodied"&&!c.cond.includes(x)).map(x=>`<option>${x}</option>`).join("")}</select></div></div>`}).join("")||'<p class="muted">No monsters yet. Add some in NPCs → Bestiary.</p>'}</div>
      <div class="actions"><button class="btn small primary" data-w="einit">Roll initiative → tracker</button><button class="btn small" data-w="erollhp">Roll HP</button><button class="btn small ghost" data-w="ereset">Reset fight</button></div>`}
  function encAct(en,a,e){const ci=+e.target.closest("[data-ci]")?.dataset.ci,c=en.live?.cr[ci];
    if(a==="dmg"||a==="heal"){const box=e.target.closest(".cr-row").querySelector("[data-w=amt]"),v=Math.abs(+box.value||0);if(!v){box.focus();return false}
      c.hp=a==="dmg"?Math.max(0,c.hp-v):Math.min(c.max,c.hp+v);commit();return true}
    if(a==="uncond"){c.cond=c.cond.filter(x=>x!==e.target.closest("[data-v]").dataset.v);commit();return true}
    if(a==="einit"){const L=en.live.cr.filter(x=>x.hp>0);L.forEach(x=>{const m=get(x.mid);x.init=1+rnd(20)+(m?initOf(m):0)});
      let t=C.home.items.find(i=>i.type==="init");if(!t){t={id:uid(),type:"init",size:"s"};C.home.items.push(t)}t.state=t.state||{rows:[],turn:0,round:1};
      const names=new Set(L.map(x=>x.label));t.state.rows=t.state.rows.filter(r=>!names.has(r.n)).concat(L.map(x=>({n:x.label,i:x.init})));t.state.rows.sort((a,b)=>b.i-a.i);t.state.turn=0;
      commit();toast("Initiative rolled and added to the tracker");return true}
    if(a==="erollhp"){en.live.cr.forEach(x=>{const m=get(x.mid),r=m&&m.hd&&rollExpr(m.hd);if(r){x.max=r;x.hp=r}});commit();return true}
    if(a==="ereset"){en.live=null;syncLive(en);commit();return true}
    return false}
  function encCond(en,e){const c=en.live.cr[+e.target.closest("[data-ci]").dataset.ci];if(e.target.value&&!c.cond.includes(e.target.value))c.cond.push(e.target.value);commit()}
  function rollExpr(s){const t=String(s).replace(/\s+/g,"").match(/[+-]?(\d*d\d+|\d+)/g);if(!t)return 0;let n=0;
    t.forEach(x=>{const g=x[0]==="-"?-1:1,b=x.replace(/^[+-]/,"");if(b.includes("d")){const [c,f]=b.split("d").map(Number);for(let i=0;i<(c||1);i++)n+=g*(1+rnd(f))}else n+=g*+b});return Math.max(1,n)}
  /* ---------- print: stat blocks for monsters on Home and in encounters ---------- */
  function printHTML(){const ids=new Set();C.home.items.forEach(i=>{if(i.type==="mon")ids.add(i.ref);if(i.type==="enc"){const en=encs().find(z=>z.id===i.ref);en&&en.groups.forEach(g=>ids.add(g.mid))}});
    if([...ids].some(id=>isSRD(id)&&!SRDI[id])){load().then(()=>{if(UI.tab==="print")App.render()}).catch(()=>{});}
    const L=[...ids].map(get).filter(Boolean);return L.length?`<div class="pr pr-sb"><h1>Stat Blocks</h1><div class="prsub">Monsters pinned to Home and in encounters you're running</div><div class="sb-grid">${L.map(m=>statHTML(m)).join("")}</div>${L.some(m=>isSRD(m.id))?`<p class="sb-lic">${esc(LICENSE)}</p>`:""}</div>`:""}
  const SB_CSS=`.sb-block{background:#f7f0dd;color:#2a1d10;border-radius:6px;padding:12px 14px;font:15px/1.35 "Crimson Pro",Georgia,serif;box-shadow:0 0 0 1px #c9b48a inset}
.sb-block hr{border:0;border-top:2px solid #8a2a1a;margin:6px 0}
.sb-name{font:700 22px "Cinzel",serif;color:#7a1f12;margin:0}.sb-meta{font-style:italic;color:#5a4630}
.sb-line{margin:2px 0}.sb-line b{color:#7a1f12}.sb-gap{margin-left:12px}.sb-dim{color:#6a5640}
.sb-ab{border-collapse:collapse;margin:6px 0;font-size:14px;width:100%;max-width:360px}.sb-ab th{font-size:11px;color:#6a5640;font-weight:600;text-align:center}
.sb-ab td{text-align:center;padding:1px 4px;background:#ece0c2}.sb-ab td.sb-k{font-weight:700;color:#7a1f12;background:#e2d2ab}.sb-ab td.sb-p{font-weight:700}
.sb-block h4{font:700 15px "Cinzel",serif;color:#7a1f12;border-bottom:1px solid #8a2a1a;margin:10px 0 4px}
.sb-block p{margin:3px 0}.sb-notes{margin-top:8px;font-style:italic;color:#4a3a28}.sb-src{margin-top:8px;font-size:12px;color:#7a6650;text-align:right}
.sb-block.compact{font-size:14px;padding:10px}.sb-block.compact .sb-name{font-size:18px}
.sb-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.sb-lic{font-size:10px;color:#7a6650;margin-top:10px}
.pr-sb .sb-block{break-inside:avoid;page-break-inside:avoid}`;
  document.head.insertAdjacentHTML("beforeend",`<style>${SB_CSS}</style>`);
  return {load,get,all,isSRD,statHTML,render,open,encTile,encAct,encCond,syncLive,printHTML,PRINT_CSS:SB_CSS,loaded:()=>!!SRD,mine}})();
