/* ================= GUILD ROSTER ================= */
const Roster=(()=>{
  const KINDS=["Founder","Active PC","Retired PC","Hired NPC"],STATUSES=["In the hall","Adventuring","Away","Fallen"],GORDER=["Novice","Skilled","Expert","Master"];
  const SKILL_HINTS=["Alchemist's Supplies","Smith's Tools","Cook's Utensils","Herbalism Kit","Arcana","History","Medicine","Religion","Nature","Persuasion","Guild Administration","Tinker's Tools","Calligrapher's Supplies","Carpenter's Tools","Leatherworker's Tools","Brewer's Supplies","Jeweler's Tools","Woodcarver's Tools"];
  let editing=null,filter="all";
  function gradeOf(m,sk){if(sk.g==="Prof")return "Skilled";if(sk.g==="Exp")return (m.level||0)>=11?"Master":"Expert";return sk.g||"Skilled"}
  function bestSkill(m,skills){let best=null;(m.skills||[]).forEach(sk=>{if(skills.some(s=>s.toLowerCase()===String(sk.s||"").toLowerCase())){const g=gradeOf(m,sk);if(!best||GORDER.indexOf(g)>GORDER.indexOf(best.g))best={s:sk.s,g}}});return best}
  const assignName=m=>m.assign?(Upgrades.catItem(m.assign)?.name||m.assign):"";
  const sorted=()=>C.roster.slice().sort((a,b)=>KINDS.indexOf(a.kind)-KINDS.indexOf(b.kind)||String(a.name).localeCompare(b.name));
  function save(m){const i=C.roster.findIndex(x=>x.id===m.id);if(i<0)C.roster.push(m);else C.roster[i]=m;commit()}
  function render(){
    const el=$("#roster");if(!el)return;el.innerHTML="";renderEditor();
    $$("#rFilter button").forEach(b=>b.classList.toggle("on",b.dataset.f===filter));
    let list=sorted();
    if(filter==="pc")list=list.filter(m=>m.kind==="Active PC");
    if(filter==="hall")list=list.filter(m=>m.kind!=="Active PC"&&m.status==="In the hall");
    if(!list.length){el.innerHTML=`<p class="muted">${C.roster.length?"No one matches this filter.":"The roster is empty."}</p>`;return}
    list.forEach(m=>{const d=document.createElement("div");d.className="card";
      d.innerHTML=`<h3>${esc(m.name)}</h3>
      <div class="badges"><span class="badge gold">${esc(m.kind)}</span><span class="badge${m.status==="In the hall"?" leaf":""}">${esc(m.status||"")}</span>${m.role?`<span class="badge">${esc(m.role)}</span>`:""}</div>
      <div class="row">${m.level?`Level ${esc(m.level)} `:""}${esc(m.ancestry||"")}${m.player?` <span class="muted">· played by ${esc(m.player)}</span>`:""}</div>
      ${(m.skills||[]).length?`<div class="chips">${m.skills.map(s=>`<span class="chip">${esc(s.s)} · <b>${gradeOf(m,s)}</b></span>`).join("")}</div>`:'<div class="muted" style="font-size:14px">No working skills listed.</div>'}
      ${m.assign?`<div class="row"><b>Operating:</b> ${esc(assignName(m))}</div>`:""}${m.notes?`<div class="row muted">${esc(m.notes)}</div>`:""}
      <div class="actions"><button class="btn small" data-a="edit">Edit</button>${m.kind==="Active PC"?'<button class="btn small primary" data-a="retire">Retire → NPC</button>':""}<button class="btn small danger" data-a="del">Delete</button></div>`;
      d.addEventListener("click",ev=>{const a=ev.target.dataset.a;if(!a)return;
        if(a==="edit"){editing=clone(m);renderEditor();$("#editorHost").scrollIntoView({behavior:"smooth"})}
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
      <label>Type <select data-k="kind">${KINDS.map(k=>`<option${k===m.kind?" selected":""}>${k}</option>`).join("")}</select></label>
      <label>Status <select data-k="status">${STATUSES.map(k=>`<option${k===m.status?" selected":""}>${k}</option>`).join("")}</select></label>
      <label>Level <input data-k="level" type="number" min="1" max="20" value="${esc(m.level??"")}"></label>
      <label>Ancestry / class <input data-k="ancestry" value="${esc(m.ancestry||"")}"></label>
      <label>Player <input data-k="player" value="${esc(m.player||"")}"></label>
      <label>Role <input data-k="role" value="${esc(m.role||"")}" placeholder="e.g. Alchemist"></label>
      <label>Operating <select data-k="assign"><option value="">— nothing —</option>${owners.map(u=>`<option value="${u.id}"${u.id===m.assign?" selected":""}>${esc(u.name)}</option>`).join("")}</select></label></div>
      <div><div class="muted" style="font-size:13px">Working skills &amp; tools</div><div id="skillRows"></div><button class="btn small" id="addSkill">＋ skill</button></div>
      <label>Notes <textarea data-k="notes" rows="2">${esc(m.notes||"")}</textarea></label>
      <datalist id="skillList">${SKILL_HINTS.map(s=>`<option value="${esc(s)}">`).join("")}</datalist>
      <div class="actions"><button class="btn primary" id="saveMem">Save member</button><button class="btn" id="cancelMem">Cancel</button></div></div>`;
    const rows=()=>{$("#skillRows").innerHTML=(m.skills||[]).map((s,i)=>`<div class="skillrow"><input list="skillList" data-si="${i}" value="${esc(s.s)}" placeholder="Skill or tool"><select data-sg="${i}">${gopts.map(([v,l])=>`<option value="${v}"${v===s.g?" selected":""}>${l}</option>`).join("")}</select><button class="btn small" data-sx="${i}">✕</button></div>`).join("")};
    rows();
    h.oninput=h.onchange=e=>{const t=e.target;
      if(t.dataset.k)m[t.dataset.k]=t.dataset.k==="level"?(t.value?+t.value:null):t.value;
      if(t.dataset.si!=null)m.skills[+t.dataset.si].s=t.value;
      if(t.dataset.sg!=null)m.skills[+t.dataset.sg].g=t.value};
    h.onclick=e=>{const t=e.target;
      if(t.id==="addSkill"){(m.skills=m.skills||[]).push({s:"",g:m.kind==="Active PC"?"Prof":"Skilled"});rows()}
      else if(t.dataset.sx!=null){m.skills.splice(+t.dataset.sx,1);rows()}
      else if(t.id==="cancelMem"){editing=null;renderEditor()}
      else if(t.id==="saveMem"){if(!String(m.name||"").trim()){toast("Give them a name");return}
        m.skills=(m.skills||[]).filter(s=>String(s.s).trim());
        if(m.assign)C.roster.forEach(x=>{if(x.assign===m.assign&&x.id!==m.id)x.assign=""});
        save(m);editing=null;render();toast("Saved")}};
  }
  const text=()=>sorted().map(m=>`${m.name} [${m.kind}${m.status?", "+m.status:""}]${m.level?" lvl "+m.level:""} ${m.ancestry||""}${m.role?" · "+m.role:""}${m.player?" · player: "+m.player:""}
  Skills: ${(m.skills||[]).map(s=>`${s.s} (${gradeOf(m,s)})`).join(", ")||"none"}${m.assign?"\n  Operating: "+assignName(m):""}${m.notes?"\n  Notes: "+m.notes:""}`).join("\n");
  const printHTML=()=>`<div class="pr pr-sheet pr-roster"><h1>Guild Roster</h1><div class="prsub">${rankName(S.tierRank)}</div><table>${sorted().map(m=>`<tr><td class="nm">${esc(m.name)}<br><span class="lvl">${esc(m.kind)} · ${esc(m.status||"")}</span></td><td>${m.level?`Lvl ${esc(m.level)} `:""}${esc(m.ancestry||"")}${m.role?` · ${esc(m.role)}`:""}<br>${(m.skills||[]).map(s=>`${esc(s.s)} (${gradeOf(m,s)})`).join(", ")}${m.assign?`<br><i>Operating: ${esc(assignName(m))}</i>`:""}</td></tr>`).join("")}</table></div>`;
  function bind(){
    $("#rFilter").onclick=e=>{const f=e.target.dataset.f;if(!f)return;filter=f;render()};
    $("#addMember").onclick=()=>{editing={id:uid(),name:"",kind:"Active PC",status:"Adventuring",level:S.partyLevel,ancestry:"",player:"",role:"",skills:[],assign:"",notes:""};renderEditor()};
    $("#copyRoster").onclick=()=>copyText(text());
  }
  return {render,bind,gradeOf,bestSkill,sorted,assignName,printHTML};
})();
