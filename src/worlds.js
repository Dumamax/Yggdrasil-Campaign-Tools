/* ===== Worlds: every world the guild has been sent to (Roster → Worlds) =====
   C.worlds = [{id,name,gate,genre,line,block,status,notes,npcs:[ids],created}]. A job marked Final in another world gets one
   automatically (h.worldId); the DM can point a job at an existing world instead. NPCs link by m.worldId, a job's patron, or w.npcs. */
const Worlds=(()=>{
  const STATUS=["Thriving","Healthy","Ailing","Rotting","Dying","Saved","Lost"];
  const list=()=>C.worlds||(C.worlds=[]);
  const byId=id=>list().find(w=>w.id===id);
  const jobsOf=w=>C.jobs.filter(h=>h.worldId===w.id);
  const npcsOf=w=>{const ids=new Set(w.npcs||[]);jobsOf(w).forEach(h=>h.patron?.npcId&&ids.add(h.patron.npcId));return C.roster.filter(m=>m.worldId===w.id||ids.has(m.id))};
  function create(h){const w={id:uid(),name:Places.worldName(h?.world?.genre),gate:Places.gateId(h?h.rank:S.tierRank),genre:h?.world?.genre||"",line:h?.world?.line||"",block:h?.worldBlock||null,status:"Healthy",notes:"",npcs:[],created:Date.now()};list().push(w);return w}
  /* called when a job is marked Final */
  function forJob(h){if(!h.world?.genre)return null;if(h.worldId&&byId(h.worldId))return byId(h.worldId);const w=create(h);h.worldId=w.id;return w}
  const label=h=>{const w=h.worldId&&byId(h.worldId);return w?`${w.name}, through ${w.gate}`:""};
  /* job card row: pick which world a final job belongs to */
  function jobRow(h,compact){if(!h.world?.genre)return "";const w=h.worldId&&byId(h.worldId);
    if(!w)return `<div class="row muted"><b>World:</b> named and given a gate when the job is marked final</div>`;
    return `<div class="row"><b>World:</b> ${esc(w.name)} <span class="badge">${esc(w.gate)}</span>${compact?"":` <select class="w-sel" data-wsel title="Use a world you've already visited">${list().map(x=>`<option value="${x.id}"${x.id===w.id?" selected":""}>${esc(x.name)} · ${esc(x.gate)}</option>`).join("")}</select>`}</div>`}
  function setJobWorld(h,id){h.worldId=id;commit()}

  /* ---------- Roster → Worlds ---------- */
  function card(w){const J=jobsOf(w),N=npcsOf(w);
    return `<div class="card world-card" data-world="${w.id}">
      <div class="w-head"><input class="w-name" data-wf="name" value="${esc(w.name)}" aria-label="World name"><button class="btn small ghost" data-wa="rename" title="New name for this genre">↻</button></div>
      <div class="badges"><input class="w-gate badge" data-wf="gate" value="${esc(w.gate)}" aria-label="Gate ID">${w.genre?`<span class="badge"><i>${esc(w.genre)}</i></span>`:""}
        <select data-wf="status" class="w-status s-${esc(w.status)}">${STATUS.map(s=>`<option${s===w.status?" selected":""}>${s}</option>`).join("")}</select></div>
      ${w.line?`<div class="row">${esc(cap(w.line))}</div>`:""}
      ${w.block?`<div class="worldblock">${esc(w.block.magic)}. Local power: ${esc(w.block.faction)}. Threat: ${esc(w.block.threat)}.</div>`:""}
      <div class="row"><b>Jobs here:</b> ${J.length?J.map(h=>`<span class="w-job">${esc(Jobs.hookTitle(h))}${h.done?` <i class="muted">(${h.done==="success"?"done":"failed"})</i>`:""}</span>`).join(" · "):'<span class="muted">none yet</span>'}</div>
      <div class="row"><b>People:</b> ${N.length?N.map(m=>`<a href="#" data-npcgo="${m.id}">${esc(m.name)}</a>${m.attitude?` <i class="muted">(${esc(m.attitude)})</i>`:""}${(w.npcs||[]).includes(m.id)?` <span class="w-unlink" data-unlink="${m.id}" title="Unlink">✕</span>`:""}`).join(" · "):'<span class="muted">none linked</span>'}
        <select data-wlink><option value="">＋ Link an NPC…</option>${C.roster.filter(m=>!N.includes(m)).map(m=>`<option value="${m.id}">${esc(m.name)}</option>`).join("")}</select></div>
      <label class="w-notes">Notes <textarea data-wf="notes" rows="2" placeholder="What happened there, who owes whom, the state of its Tree…">${esc(w.notes||"")}</textarea></label>
      <div class="actions"><button class="btn small ghost danger" data-wa="del">Delete world</button></div></div>`}
  function render(host){const L=list();
    host.innerHTML=`<div class="controls" style="margin-bottom:12px"><span class="muted" style="flex:1;min-width:220px">Every world the guild has been sent to. Jobs in other worlds get a name and a gate here when marked final.</span>
      <label>Genre <select id="wGenre">${Object.keys((C.tables.places||DEFAULT_PLACES).worldNames).filter(g=>g!=="_").map(g=>`<option>${esc(g)}</option>`).join("")}</select></label><button class="btn" id="wAdd">＋ Add a world</button></div>
      ${L.length?`<div class="board">${L.slice().reverse().map(card).join("")}</div>`:'<p class="muted">No worlds yet. Mark a job in another world as Final, or add one here.</p>'}`;
    $("#wAdd").onclick=()=>{const g=$("#wGenre").value;const w=create({world:{genre:g,line:""},rank:S.tierRank});commit();render(host);App.flash(`[data-world="${w.id}"]`)};
    host.onchange=e=>{const c=e.target.closest("[data-world]");if(!c)return;const w=byId(c.dataset.world);if(!w)return;const f=e.target.dataset.wf;
      if(f){w[f]=e.target.value;commit();if(f==="status")e.target.className=`w-status s-${w.status}`;return}
      if(e.target.dataset.wlink!=null&&e.target.value){(w.npcs=w.npcs||[]).push(e.target.value);commit();render(host)}};
    host.onclick=e=>{const c=e.target.closest("[data-world]");if(!c)return;const w=byId(c.dataset.world);if(!w)return;
      const a=e.target.dataset.wa;
      if(e.target.dataset.npcgo){e.preventDefault();const m=C.roster.find(x=>x.id===e.target.dataset.npcgo);if(!m)return;UI.rosterSub=NPCs.isMember(m)?"members":m.seat?"council":"npcs";NPCs.reset();saveUI();App.render();App.flash(NPCs.isMember(m)?`[data-member="${m.id}"]`:`[data-npc="${m.id}"]`);return}
      if(e.target.dataset.unlink){w.npcs=(w.npcs||[]).filter(x=>x!==e.target.dataset.unlink);commit();render(host);return}
      if(a==="rename"){w.name=Places.worldName(w.genre);commit();render(host)}
      else if(a==="del"){if(!e.target.dataset.sure){e.target.dataset.sure=1;e.target.textContent="Delete? Click again";return}
        C.jobs.forEach(h=>{if(h.worldId===w.id)delete h.worldId});C.roster.forEach(m=>{if(m.worldId===w.id)delete m.worldId});C.worlds=list().filter(x=>x!==w);commit();render(host);toast("World deleted · Ctrl+Z to undo")}}}
  return {list,byId,forJob,jobRow,setJobWorld,label,render,npcsOf};
})();
