/* ================= GUILD ROSTER ================= */
const Roster=(()=>{
  const KINDS=["Founder","Active PC","Retired PC","Hired NPC"],STATUSES=["In the hall","Adventuring","Away","Fallen"],GORDER=["Novice","Skilled","Expert","Master"];
  const SKILL_HINTS=["Alchemist's Supplies","Smith's Tools","Cook's Utensils","Herbalism Kit","Arcana","History","Medicine","Religion","Nature","Persuasion","Guild Administration","Tinker's Tools","Calligrapher's Supplies","Carpenter's Tools","Leatherworker's Tools","Brewer's Supplies","Jeweler's Tools","Woodcarver's Tools"];
  let editing=null,filter="all",importing=false;
  function gradeOf(m,sk){if(sk.g==="Prof")return "Skilled";if(sk.g==="Exp")return (m.level||0)>=11?"Master":"Expert";return sk.g||"Skilled"}
  function bestSkill(m,skills){let best=null;(m.skills||[]).forEach(sk=>{if(skills.some(s=>s.toLowerCase()===String(sk.s||"").toLowerCase())){const g=gradeOf(m,sk);if(!best||GORDER.indexOf(g)>GORDER.indexOf(best.g))best={s:sk.s,g}}});return best}
  const assignName=m=>m.assign?(Upgrades.catItem(m.assign)?.name||m.assign):"";
  const sorted=()=>C.roster.filter(m=>KINDS.includes(m.kind)).sort((a,b)=>KINDS.indexOf(a.kind)-KINDS.indexOf(b.kind)||String(a.name).localeCompare(b.name));
  function save(m){const i=C.roster.findIndex(x=>x.id===m.id);if(i<0)C.roster.push(m);else C.roster[i]=m;commit()}
  function render(){park();render0();place()}
  /* the editor opens in place, right after the card being edited; parked at the top while lists re-render */
  function park(){const h=$("#editorHost"),home=$("#editorHome");if(h&&home&&h.parentElement!==home){home.appendChild(h);h.classList.remove("inline-ed")}}
  function place(scroll){const h=$("#editorHost");if(!h||!editing||!editing.id)return;
    const c=document.querySelector(`.card[data-member="${editing.id}"]:not([hidden]),.card[data-npc="${editing.id}"]`);if(!c||c.offsetParent===null)return;
    c.after(h);h.classList.add("inline-ed");if(scroll)setTimeout(()=>{const r=h.getBoundingClientRect(),top=($(".topbar")?.offsetHeight||0)+12;if(r.top>innerHeight*0.7||r.top<top)window.scrollBy({top:r.top-Math.max(top,innerHeight*0.3),behavior:"smooth"})},30)}
  function render0(){
    const sub=UI.rosterSub||"members";$$("#rSub button").forEach(b=>b.classList.toggle("on",b.dataset.sub===sub));
    $("#rMemCtl").hidden=sub!=="members";$("#roster").hidden=sub!=="members";$("#npcHost").hidden=sub==="members";$("#rHint").hidden=sub!=="members";
    renderEditor();if(sub!=="members"){importing=false;renderImport();$("#roster").innerHTML="";NPCs.render(sub);return}
    $("#npcHost").innerHTML="";
    const el=$("#roster");if(!el)return;el.innerHTML="";renderImport();
    $$("#rFilter button").forEach(b=>b.classList.toggle("on",b.dataset.f===filter));
    let list=sorted();
    if(filter==="pc")list=list.filter(m=>m.kind==="Active PC");
    if(filter==="hall")list=list.filter(m=>m.kind!=="Active PC"&&m.status==="In the hall");
    if(!list.length){el.innerHTML=`<p class="muted">${C.roster.length?"No one matches this filter.":"The roster is empty."}</p>`;return}
    list.forEach(m=>{const d=document.createElement("div");d.className="card";d.dataset.member=m.id;
      d.innerHTML=`<h3>${esc(m.name)}</h3>
      <div class="badges"><span class="badge gold">${esc(m.kind)}</span><span class="badge${m.status==="In the hall"?" leaf":""}">${esc(m.status||"")}</span>${m.role?`<span class="badge">${esc(m.role)}</span>`:""}</div>
      <div class="row">${m.level?`Level ${esc(m.level)} `:""}${esc(m.ancestry||"")}${m.player?` <span class="muted">· played by ${esc(m.player)}</span>`:""}</div>
      ${(m.skills||[]).length?`<div class="chips">${m.skills.map(s=>`<span class="chip">${esc(s.s)} · <b>${gradeOf(m,s)}</b></span>`).join("")}</div>`:'<div class="muted" style="font-size:14px">No working skills listed.</div>'}
      ${m.look||(m.forms||[]).length||m.want?NPCs.profileHTML(m,true,true):""}${m.assign?`<div class="row"><b>Operating:</b> ${esc(assignName(m))}</div>`:""}${m.notes?`<div class="row muted">${esc(m.notes)}</div>`:""}
      <div class="actions"><button class="btn small" data-a="edit">Edit</button>${m.kind==="Active PC"?'<button class="btn small primary" data-a="retire">Retire → NPC</button>':""}${m.kind==="Hired NPC"||m.kind==="Retired PC"?'<button class="btn small" data-a="leave">Leave guild</button>':""}<button class="btn small danger" data-a="del">Delete</button></div>`;
      d.addEventListener("click",ev=>{const a=ev.target.dataset.a;if(!a)return;
        if(a==="edit"){editing=clone(m);renderEditor();place(true)}
        else if(a==="leave"){NPCs.leaveGuild(m);return}
        else if(a==="retire"){m.kind="Retired PC";m.status="In the hall";commit();toast(`${m.name} retires to the hall`);render()}
        else if(a==="del"){if(ev.target.dataset.sure){C.roster=C.roster.filter(x=>x.id!==m.id);commit();render()}else{ev.target.dataset.sure=1;ev.target.textContent="Confirm delete?"}}});
      el.appendChild(d)});
  }
  function renderEditor(){
    const h=$("#editorHost");if(!editing){h.innerHTML="";return}
    const m=editing,gopts=[["Novice","Novice"],["Skilled","Skilled"],["Expert","Expert"],["Master","Master"],["Prof","Proficient (auto)"],["Exp","Expertise (auto)"]];
    const owners=Upgrades.opCatalog().filter(u=>(C.guild.owned[u.id]||0)>0);
    h.innerHTML=`<div class="editor"><div class="grid">
      <label>Name <input data-k="name" value="${esc(m.name)}"></label>
      <label>Type <select data-k="kind">${[...KINDS,"NPC"].map(k=>`<option${k===m.kind?" selected":""}>${k}</option>`).join("")}</select></label>
      <label>Status <select data-k="status">${STATUSES.map(k=>`<option${k===m.status?" selected":""}>${k}</option>`).join("")}</select></label>
      <label>Level <input data-k="level" type="number" min="1" max="20" value="${esc(m.level??"")}"></label>
      <label>Ancestry / class <input data-k="ancestry" value="${esc(m.ancestry||"")}"></label>
      <label>Player <input data-k="player" value="${esc(m.player||"")}"></label>
      <label>Role <input data-k="role" value="${esc(m.role||"")}" placeholder="e.g. Alchemist"></label>
      <label>Operating <select data-k="assign"><option value="">— nothing —</option>${owners.map(u=>`<option value="${u.id}"${u.id===m.assign?" selected":""}>${esc(u.name)}</option>`).join("")}</select></label></div>
      <div><div class="muted" style="font-size:13px">Working skills &amp; tools</div><div id="skillRows"></div><button class="btn small" id="addSkill">＋ skill</button></div>
      <label>Notes <textarea data-k="notes" rows="2">${esc(m.notes||"")}</textarea></label>
      ${profileEditor(m)}
      <div id="pcEd">${PCs.editorHTML(m)}</div>
      <datalist id="skillList">${SKILL_HINTS.map(s=>`<option value="${esc(s)}">`).join("")}</datalist>
      <div class="actions"><button class="btn primary" id="saveMem">Save member</button><button class="btn" id="cancelMem">Cancel</button></div></div>`;
    const rows=()=>{$("#skillRows").innerHTML=(m.skills||[]).map((s,i)=>`<div class="skillrow"><input list="skillList" data-si="${i}" value="${esc(s.s)}" placeholder="Skill or tool"><select data-sg="${i}">${gopts.map(([v,l])=>`<option value="${v}"${v===s.g?" selected":""}>${l}</option>`).join("")}</select><button class="btn small" data-sx="${i}">✕</button></div>`).join("")};
    rows();PCs.bindEditor($("#pcEd"),m,renderEditor);
    h.oninput=h.onchange=e=>{const t=e.target;if(e.type==="change"&&t.dataset.k==="kind"){m.kind=t.value;renderEditor();return}
      if(t.dataset.k)m[t.dataset.k]=t.dataset.k==="level"?(t.value?+t.value:null):t.type==="checkbox"?t.checked:t.dataset.k==="forms"?t.value.split("\n").map(x=>x.trim()).filter(Boolean):t.value;
      if(t.dataset.si!=null)m.skills[+t.dataset.si].s=t.value;
      if(t.dataset.sg!=null)m.skills[+t.dataset.sg].g=t.value};
    h.onclick=e=>{const t=e.target;
      if(t.id==="addSkill"){(m.skills=m.skills||[]).push({s:"",g:m.kind==="Active PC"?"Prof":"Skilled"});rows()}
      else if(t.dataset.sx!=null){m.skills.splice(+t.dataset.sx,1);rows()}
      else if(t.id==="cancelMem"){editing=null;renderEditor();park()}
      else if(t.id==="saveMem"){if(!String(m.name||"").trim()){toast("Give them a name");return}
        m.skills=(m.skills||[]).filter(s=>String(s.s).trim());
        if(m.assign)C.roster.forEach(x=>{if(x.assign===m.assign&&x.id!==m.id)x.assign=""});
        if(m.seat)C.roster.forEach(x=>{if(x.seat===m.seat&&x.id!==m.id)x.seat=""});
        save(m);editing=null;render();toast("Saved")}};
  }
  /* ---------- import a character (Guild Hall JSON from Claude, or a sheet via Claude) ---------- */
  function mapG(g){const t=String(g||"").toLowerCase();if(t.startsWith("exp")&&t!=="expert")return "Exp";if(t.startsWith("prof"))return "Prof";const k=GORDER.find(x=>x.toLowerCase()===t);return k||"Prof"}
  function mapMember(x){
    const anc=x.ancestry||[x.species||x.race,x.class||x.classes].filter(Boolean).join(" ");
    return {id:uid(),name:String(x.name||"").trim(),kind:KINDS.includes(x.kind)?x.kind:"Active PC",status:STATUSES.includes(x.status)?x.status:"Adventuring",
      level:+x.level||null,ancestry:anc,player:x.player||"",role:x.role||"",assign:"",notes:x.notes||"",
      skills:(x.skills||[]).map(k=>typeof k==="string"?{s:k,g:"Prof"}:{s:k.s||k.name||k.skill||"",g:mapG(k.g||k.grade||k.proficiency)}).filter(k=>k.s),...(PCs.fromImport(x)?{pc:PCs.fromImport(x)}:{})}}
  function candidates(o){if(Array.isArray(o))return o;if(o&&Array.isArray(o.members))return o.members;if(o&&Array.isArray(o.characters))return o.characters;return [o]}
  function accept(o){
    const list=candidates(o).filter(x=>x&&x.name).map(mapMember);
    if(!list.length){msg("That didn't contain a character with a name.");return false}
    const match=m=>C.roster.find(x=>x.name.toLowerCase()===m.name.toLowerCase());
    if(list.length===1){const m=list[0],ex=match(m);
      editing=ex?Object.assign(clone(ex),m,{id:ex.id,assign:ex.assign,kind:ex.kind==="Active PC"?m.kind:ex.kind,pc:m.pc?Object.assign({},ex.pc||{},m.pc,{portrait:m.pc.portrait||ex.pc?.portrait||null}):ex.pc}):m;
      importing=false;render();toast(ex?`Updating ${m.name}: review and save`:`Review ${m.name}, then save`);$("#editorHost").scrollIntoView({behavior:"smooth"});return true}
    list.forEach(m=>{const ex=match(m);if(ex)Object.assign(ex,m,{id:ex.id,assign:ex.assign});else C.roster.push(m)});
    commit();importing=false;render();toast(`Imported ${list.length} characters`);return true}
  const sheetPrompt=t=>`Convert this D&D 5e character into Guild Hall roster JSON. Return ONLY JSON:
{"guildHall":"character","name":string,"kind":"Active PC","level":number,"ancestry":"Species Class (Subclass)","player":"" or the player's name if given,"role":"" or a guild job they'd suit (e.g. Alchemist),"skills":[{"s":"skill or tool name","g":"Prof" or "Exp"}],"stats":{"str":n,"dex":n,"con":n,"int":n,"wis":n,"cha":n},"ac":n,"hp":max HP,"speed":"30 ft","saves":["str","con"],"senses":"" or e.g. "Darkvision 60 ft","resistances":"","languages":"","spellcasting":{"ability":"wis"} or null,"attacks":[{"name":"Longsword","hit":"+5","damage":"1d8+3 slashing"}],"features":["short rules reminders the DM needs at the table (uses per rest), no backstory"],"notes":"one line: personality or look"}
List every skill and tool they're proficient with; use "Exp" for expertise.
${t?`
CHARACTER:
${t}`:""}`;
  const msg=t=>{const e=$("#impMsg");if(e)e.textContent=t};
  async function runImport(text,pdf){
    if(!pdf){try{const o=AI.parse(text);if(accept(o))return}catch(e){}}
    if(!text.trim()&&!pdf){msg("Paste something first.");return}
    if(AI.mode()==="none"||(pdf&&AI.mode()!=="api")){
      if(pdf){msg("PDF sheets need an API key in Settings. Otherwise paste the sheet's text here, or upload the PDF to Claude in the project and ask for a Guild Hall export.");return}
      copyText(sheetPrompt(text));msg("No Claude connection here, so a Claude prompt with this sheet was copied. Paste it into Claude, then paste Claude's reply here and click Import.");return}
    const b=$("#impGo");b.disabled=true;b.innerHTML='<span class="spin">✦</span> Reading…';
    try{accept(await AI.json(sheetPrompt(pdf?"":text),pdf))}catch(e){msg("Claude couldn't read that: "+e.message)}
    if($("#impGo")){$("#impGo").disabled=false;$("#impGo").textContent="Import"}
  }
  function renderImport(){
    const h=$("#importHost");if(!importing){h.innerHTML="";return}
    h.innerHTML=`<div class="editor"><div style="font:700 16px Cinzel,serif;color:var(--gold)">Import a character</div>
      <p class="hint" style="margin:0">Best: in a Claude chat in this project, ask "Export [character] for the Guild Hall" and paste the block it gives you. You can also paste or upload a character sheet (text, or PDF with an API key) and Claude will pull out the details. Importing someone already on the roster updates them.</p>
      <textarea id="impText" rows="7" style="font:13px ui-monospace,Menlo,monospace" placeholder="Paste here"></textarea>
      <div class="actions"><button class="btn primary" id="impGo">Import</button><button class="btn" id="impUp">Upload file</button><input type="file" id="impFile" accept=".json,.txt,.md,.pdf" hidden><button class="btn" id="impCancel">Cancel</button><span class="muted" id="impMsg"></span></div></div>`;
    $("#impGo").onclick=()=>runImport($("#impText").value);
    $("#impCancel").onclick=()=>{importing=false;renderImport()};
    $("#impUp").onclick=()=>$("#impFile").click();
    $("#impFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
      if(/\.pdf$/i.test(f.name)){r.onload=()=>runImport("",String(r.result).split(",")[1]);r.readAsDataURL(f)}
      else{r.onload=()=>{$("#impText").value=r.result;runImport(r.result)};r.readAsText(f)}};
  }
  const text=()=>sorted().map(m=>`${m.name} [${m.kind}${m.status?", "+m.status:""}]${m.level?" lvl "+m.level:""} ${m.ancestry||""}${m.role?" · "+m.role:""}${m.player?" · player: "+m.player:""}
  Skills: ${(m.skills||[]).map(s=>`${s.s} (${gradeOf(m,s)})`).join(", ")||"none"}${m.assign?"\n  Operating: "+assignName(m):""}${m.notes?"\n  Notes: "+m.notes:""}`).join("\n");
  const printHTML=()=>`<div class="pr pr-sheet pr-roster"><h1>Guild Roster</h1><div class="prsub">${rankName(S.tierRank)}</div><table>${sorted().map(m=>`<tr><td class="nm">${esc(m.name)}<br><span class="lvl">${esc(m.kind)} · ${esc(m.status||"")}</span></td><td>${m.level?`Lvl ${esc(m.level)} `:""}${esc(m.ancestry||"")}${m.role?` · ${esc(m.role)}`:""}<br>${(m.skills||[]).map(s=>`${esc(s.s)} (${gradeOf(m,s)})`).join(", ")}${m.assign?`<br><i>Operating: ${esc(assignName(m))}</i>`:""}</td></tr>`).join("")}</table></div>`;
  /* profile fields (NPC card) shown in the editor for everyone except active PCs */
  function profileEditor(m){const NT=NPCs.tables(),sel=(k,list,blank)=>`<select data-k="${k}">${blank?'<option value="">—</option>':""}${list.map(x=>`<option${x===(m[k]||(k==="attitude"?"Neutral":""))?" selected":""}>${esc(x)}</option>`).join("")}</select>`;
    const inp=(k,l,ph)=>`<label>${l} <input data-k="${k}" value="${esc(m[k]||"")}"${ph?` placeholder="${esc(ph)}"`:""}></label>`;
    return `<details class="addons"${m.kind!=="Active PC"?" open":""}><summary>NPC profile</summary><div class="grid" style="margin-top:6px">
      <label>Occupation ${sel("occupation",Object.keys(NT.occupations),1)}</label>${inp("title","Job / title","e.g. glassblower")}
      <label>Connection ${sel("connection",Object.keys(NT.connections),1)}</label><label>Attitude ${sel("attitude",NPCs.ATT)}</label>
      ${inp("genre","Home world / genre","Tree-born")}<label>Archetype ${sel("archetype",Object.keys(NT.archetypes),1)}</label>
      ${inp("label","Fighting flavor","e.g. ex-sky-pirate with a hook blade")}${inp("guild","Guild")}
      ${inp("look","Look")}${inp("voice","Voice")}${inp("manner","Manner")}${inp("want","Wants")}
      ${inp("secret","Secret (DM)")}${inp("public","Public face (players)")}
      <label>Council seat ${sel("seat",TIERS,1)}</label>
      <label class="inline"><input type="checkbox" data-k="rival"${m.rival?" checked":""}> Rival</label><label class="inline"><input type="checkbox" data-k="pinned"${m.pinned?" checked":""}> Pinned</label></div>
      ${m.kind==="Founder"?`<label>Secrets / motive (DM) <textarea data-k="motive" rows="2">${esc(m.motive||"")}</textarea></label><label>Forms (one per line, in order) <textarea data-k="forms" rows="2">${esc((m.forms||[]).join("\n"))}</textarea></label>`:""}</details>`}
  function edit(m){editing=clone(m);renderEditor();if(!document.querySelector(`.card[data-npc="${m.id}"],.card[data-member="${m.id}"]`)){$("#editorHost").scrollIntoView({behavior:"smooth"});return}place(true)}
  function bind(){
    $("#rSub").onclick=e=>{const s=e.target.dataset.sub;if(!s)return;UI.rosterSub=s;saveUI();editing=null;render()};
    $("#rFilter").onclick=e=>{const f=e.target.dataset.f;if(!f)return;filter=f;render()};
    $("#addMember").onclick=()=>{editing={id:uid(),name:"",kind:"Active PC",status:"Adventuring",level:S.partyLevel,ancestry:"",player:"",role:"",skills:[],assign:"",notes:""};renderEditor()};
    $("#copyRoster").onclick=()=>copyText(text());
    $("#importPC").onclick=()=>{importing=true;renderImport();$("#impText").focus()};
  }
  return {park,place,render,bind,edit,gradeOf,bestSkill,sorted,assignName,printHTML,sheetPrompt};
})();
