/* ===== Guild Standing: points toward the next guild rank (name is configurable in Settings) =====
   Unit: a Standard job at the guild's current rank is worth 3 × (rank index + 1) points (same as the Job Board's job values),
   so deeds and step costs are set in "Standard jobs" and scale up automatically with the guild. */
const Standing=(()=>{
  const cfg=()=>S.cp;
  const G=()=>C.guild.cp;
  const N=()=>esc(cfg().name),U=()=>esc(cfg().short);
  const unit=r=>3*(r+1);
  const MAX=TIERS.length*3-1;
  const need=(r=S.tierRank)=>r>=MAX?null:Math.round(unit(r)*(cfg().stepJobs[TIERS[tierOf(r)]]??4));
  const deedPts=(size,r=S.tierRank)=>Math.max(1,Math.round(unit(r)*(cfg().deeds[size]??1)));
  const bellTower=()=>(C.guild.uniques||[]).some(u=>/bell tower/i.test(u.name||""));
  function jobPts(h){let p=h.contribution||0;if(h.patron?.cat==="Council"&&bellTower())p=Math.round(p*(1+(cfg().councilBonus||0)/100));return p}
  function log(kind,label,pts,extra){const e=Object.assign({id:uid(),t:Date.now(),kind,label,pts,rank:S.tierRank},extra||{});G().log.unshift(e);G().pts=Math.max(0,G().pts+pts);return e}
  const ready=()=>need()!=null&&G().pts>=need();

  /* ---- actions ---- */
  function completeJob(h,ok=true){if(h.done)return;h.done=ok?"success":"failed";h.doneAt=Date.now();h.kept=true;
    const p=ok?jobPts(h):Math.round(jobPts(h)*(cfg().failPct||0)/100);
    log("Job",`${ok?"Completed":"Failed"}: ${Jobs.hookTitle(h)} (${h.patron?.name||"patron"})`,p,{jobId:h.id});
    toast(p?`+${p} ${cfg().short}${ok?"":" (failed job)"}${ready()?` · Ready to rise to ${rankName(S.tierRank+1)}!`:""}`:"Job marked failed")}
  function reopenJob(h){const i=G().log.findIndex(e=>e.jobId===h.id&&e.kind==="Job");if(i>=0){G().pts=Math.max(0,G().pts-G().log[i].pts);G().log.splice(i,1)}delete h.done;delete h.doneAt}
  function promote(){const n=need();if(n==null)return;const from=rankName(S.tierRank);G().pts=Math.max(0,G().pts-n);S.tierRank++;
    log("Promotion",`Rose from ${from} to ${rankName(S.tierRank)}`,0);commit();App.reloadAll();toast(`The guild is now ${rankName(S.tierRank)}!`)}
  function demote(){if(S.tierRank<=0)return;const from=rankName(S.tierRank);S.tierRank--;log("Demotion",`Dropped from ${from} to ${rankName(S.tierRank)}`,0);commit();App.reloadAll()}

  /* ---- UI: standing strip (Job Board, Guild Upgrades) ---- */
  let openLog=false,form=null;
  function bar(){const n=need(),p=G().pts,pct=n?Math.min(100,p/n*100):100;
    return `<div class="cp-bar${ready()?" ready":""}"><span style="width:${pct}%"></span></div>`}
  function strip(host){if(!host)return;const n=need(),p=G().pts;
    host.innerHTML=`<div class="standing">
      <div class="st-head"><span class="st-rank">${rankName(S.tierRank)}</span>
        <span class="st-next">${n==null?"Highest rank reached":ready()?`<b>Ready to rise to ${rankName(S.tierRank+1)}</b>`:`${fmt(p)} / ${fmt(n)} ${U()} to ${rankName(S.tierRank+1)}`}</span>
        <span class="st-btns">${ready()?'<button class="btn small primary" data-st="promote">Promote guild</button>':""}<button class="btn small" data-st="deed">＋ Log deed</button><button class="btn small ghost" data-st="log">${openLog?"Hide":"History"}</button></span></div>
      ${bar()}
      ${form?formHTML():""}${openLog?logHTML():""}</div>`;
    host.onclick=onClick;host.onsubmit=onSubmit}
  function formHTML(){const r=S.tierRank;return `<form class="st-form">
    <label>Kind <select name="kind"><option>Community contribution</option><option>Act of heroism</option><option>Council recognition</option><option>Other</option></select></label>
    <label>Size <select name="size">${Object.keys(cfg().deeds).map(k=>`<option value="${k}"${k==="Notable"?" selected":""}>${k} (+${deedPts(k,r)})</option>`).join("")}<option value="custom">Custom…</option></select></label>
    <label class="st-custom" hidden>${U()} <input name="pts" type="number" step="1" value="${deedPts("Notable",r)}"></label>
    <label style="flex:1;min-width:200px">What happened <input name="label" placeholder="e.g. Rebuilt the Lantern Market after the fire" required></label>
    <span class="st-btns"><button class="btn primary small">Add</button><button type="button" class="btn small ghost" data-st="cancel">Cancel</button></span></form>`}
  function logHTML(){const L=G().log;
    return `<div class="st-log">${L.length?`<table class="ref">${L.slice(0,60).map(e=>`<tr><td><span class="badge${e.kind==="Promotion"?" leaf":e.kind==="Demotion"?" red":""}">${esc(e.kind)}</span> ${esc(e.label)}<br><span class="muted" style="font-size:13px">${new Date(e.t).toLocaleDateString()} · at ${rankName(e.rank)}</span></td><td>${e.pts?`${e.pts>0?"+":""}${fmt(e.pts)}`:""} <button class="btn small ghost danger" data-st="del" data-id="${e.id}" title="Remove this entry (its points too)">✕</button></td></tr>`).join("")}</table>`:'<p class="muted">Nothing logged yet. Complete jobs on the Quests tab or log a deed.</p>'}
      <div class="actions" style="margin-top:6px"><button class="btn small ghost" data-st="adjust">± Adjust ${U()}</button>${S.tierRank>0?'<button class="btn small ghost danger" data-st="demote">Lower guild rank</button>':""}</div></div>`}
  function onClick(e){const a=e.target.closest("[data-st]")?.dataset.st;
    if(e.target.name==="size"||e.target.closest?.(".st-form")&&!a){return}
    if(!a)return;
    if(a==="promote")return promote();
    if(a==="deed"){form=!form;rerender();return}
    if(a==="cancel"){form=null;rerender();return}
    if(a==="log"){openLog=!openLog;rerender();return}
    if(a==="demote"){if(confirmTwice(e.target,"Lower the rank? Click again"))demote();return}
    if(a==="adjust"){const v=prompt(`Add or remove ${cfg().short} (negative to remove):`,"0");const n=Math.round(+v);if(!v||!n)return;const why=prompt("Reason (optional):","DM adjustment")||"DM adjustment";log("Adjust",why,n);commit();rerender();return}
    if(a==="del"){const i=G().log.findIndex(x=>x.id===e.target.dataset.id);if(i<0)return;const x=G().log[i];
      if(x.kind==="Promotion"||x.kind==="Demotion"){G().log.splice(i,1)}else{G().pts=Math.max(0,G().pts-x.pts);G().log.splice(i,1);if(x.jobId){const h=C.jobs.find(j=>j.id===x.jobId);if(h){delete h.done;delete h.doneAt}}}
      commit();App.render();toast("Entry removed · Ctrl+Z to undo");return}}
  function onSubmit(e){e.preventDefault();const f=new FormData(e.target),size=f.get("size"),pts=size==="custom"?Math.round(+f.get("pts")||0):deedPts(size);
    log("Deed",`${f.get("kind")}: ${String(f.get("label")).trim()}${size==="custom"?"":` (${size})`}`,pts);form=null;commit();App.render();
    toast(`+${pts} ${cfg().short}${ready()?` · Ready to rise to ${rankName(S.tierRank+1)}!`:""}`)}
  document.addEventListener("change",e=>{if(e.target.name==="size"&&e.target.closest(".st-form")){const c=e.target.closest(".st-form").querySelector(".st-custom");c.hidden=e.target.value!=="custom"}});
  function confirmTwice(b,msg){if(b.dataset.sure)return true;b.dataset.sure=1;b.textContent=msg;return false}
  function rerender(){$$(".standing-host").forEach(strip)}
  function render(){rerender()}

  /* ---- Table Mode panel ---- */
  function tablePanel(){const d=document.createElement("div");d.className="standing-host";strip(d);return d}

  /* ---- Print: player-facing Guild Standing ---- */
  /* every rank from Iron 3 to Platinum 1, left to right: reached ranks filled, the next one filling with progress */
  function ladderHTML(){const r=S.tierRank,n=need(),f=n?Math.min(1,G().pts/n):0;
    return `<div class="ps-ladder" aria-label="Guild rank ${esc(rankName(r))}">${TIERS.map((t,ti)=>`<div class="pl-tier pl-${t.toLowerCase()}"><div class="pl-cells">${[0,1,2].map(k=>{const i=ti*3+k,
      fill=i<=r?100:i===r+1?Math.round(f*100):0;return `<span class="pl-cell${i===r?" pl-here":""}" title="${esc(rankName(i))}"><i style="width:${fill}%"></i><b>${subOf(i)}</b></span>`}).join("")}</div><div class="pl-name">${t}</div></div>`).join("")}</div>`}
  function printHTML(opt={}){const n=need(),p=G().pts,deeds=G().log.filter(e=>e.kind!=="Adjust").slice(0,14);
    return `<div class="pr pr-sheet pr-standing"><h1>Guild Standing</h1><div class="prsub">Recorded by the Council of Five</div>
      <div class="ps-rank">${rankName(S.tierRank)}</div>${opt.ladder?ladderHTML():""}
      ${n==null?'<p class="ps-next">The highest standing in the Tree.</p>':`<div class="ps-bar"><span style="width:${Math.min(100,p/n*100)}%"></span></div><p class="ps-next">${p>=n?`Eligible to rise to ${rankName(S.tierRank+1)}, pending the Council's seal`:`${fmt(p)} of ${fmt(n)} ${N()} toward ${rankName(S.tierRank+1)}`}</p>`}
      <h2>Recent deeds</h2>${deeds.length?`<table>${deeds.map(e=>`<tr><td class="nm" style="width:22%">${new Date(e.t).toLocaleDateString()}</td><td>${esc(e.label)}</td><td class="c">${e.pts?`+${fmt(e.pts)}`:"★"}</td></tr>`).join("")}</table>`:'<p class="ps-next">No deeds recorded yet. The Council is waiting.</p>'}
      <div class="foot">Guilds rise through completed work, service to the community, and acts of heroism.</div></div>`}
  const PRINT_CSS=`.pr-standing .ps-rank{font:700 34px "IM Fell English SC",serif;text-align:center;margin:10px 0 6px;color:#5a1e10}
.pr-standing .ps-bar{height:16px;border:2px solid #5a3e1e;border-radius:9px;margin:4px 40px;overflow:hidden}.pr-standing .ps-bar span{display:block;height:100%;background:#8a6a3a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pr-standing .ps-next{text-align:center;font-style:italic;margin:6px 0}
.ps-ladder{display:flex;gap:6px;margin:8px 4px 14px}.pl-tier{flex:1;min-width:0}.pl-cells{display:flex;gap:2px}
.pl-cell{position:relative;flex:1;height:20px;border:1.5px solid #5a3e1e;border-radius:3px;overflow:hidden;background:rgba(90,62,30,.08)}
.pl-cell i{position:absolute;inset:0 auto 0 0;background:var(--pl);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pl-cell b{position:relative;display:block;text-align:center;font:700 12px/17px "IM Fell English SC",serif;color:#3a2a14}
.pl-here{box-shadow:0 0 0 2px #5a1e10;border-color:#5a1e10}.pl-here b{color:#5a1e10}
.pl-name{text-align:center;font:700 12px "IM Fell English SC",serif;margin-top:3px;color:#3a2a14;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl-iron{--pl:#8d8f93}.pl-bronze{--pl:#b07a3e}.pl-silver{--pl:#c9ccd1}.pl-gold{--pl:#d6a84a}.pl-platinum{--pl:#9fc3cf}
.ink .pr-standing .ps-bar span{background:repeating-linear-gradient(45deg,#111 0 2px,transparent 2px 6px)!important}`;

  /* ---- Settings ---- */
  function settingsHTML(){const c=cfg();return `
    <div class="controls" style="margin:0;background:none;border:0;padding:0">
      <label>Name <input id="cpName" value="${esc(c.name)}" style="width:200px"></label>
      <label>Short label <input id="cpShort" value="${esc(c.short)}" style="width:80px"></label>
      <label title="Bonus for Council patrons' jobs when the guild owns the Bell Tower">Bell Tower bonus % <input id="cpBell" type="number" value="${c.councilBonus}" style="width:80px"></label>
      <label title="Share of a job's points still earned when it fails">Failed job % <input id="cpFail" type="number" value="${c.failPct}" style="width:80px"></label></div>
    <p class="hint" style="margin:10px 0 4px">Standard jobs (at the guild's current rank) needed to rise one step, per tier:</p>
    <div class="controls" style="margin:0;background:none;border:0;padding:0">${TIERS.map(t=>`<label>${t} <input data-step="${t}" type="number" step="0.5" min="0.5" value="${c.stepJobs[t]}" style="width:70px"></label>`).join("")}</div>
    <p class="hint" style="margin:10px 0 4px">Deed sizes, in Standard jobs:</p>
    <div class="controls" style="margin:0;background:none;border:0;padding:0">${Object.keys(c.deeds).map(k=>`<label>${k} <input data-deed="${k}" type="number" step="0.5" min="0" value="${c.deeds[k]}" style="width:70px"></label>`).join("")}</div>
    <p class="hint">Right now one Standard job is worth ${unit(S.tierRank)} ${U()}, and the next step costs ${need()==null?"nothing (top rank)":fmt(need())+" "+U()}. Job values come from Settings → Tables → Job Board (sizes → contribution).</p>`}
  function bindSettings(host){host.onchange=e=>{const c=cfg(),t=e.target;
    if(t.id==="cpName")c.name=t.value.trim()||DEFAULT_CP.name;else if(t.id==="cpShort")c.short=t.value.trim()||DEFAULT_CP.short;
    else if(t.id==="cpBell")c.councilBonus=+t.value||0;else if(t.id==="cpFail")c.failPct=Math.max(0,Math.min(100,+t.value||0));
    else if(t.dataset.step)c.stepJobs[t.dataset.step]=Math.max(0.5,+t.value||1);else if(t.dataset.deed)c.deeds[t.dataset.deed]=Math.max(0,+t.value||0);else return;
    commit();host.innerHTML=settingsHTML()}}

  return {ladderHTML,need,jobPts,completeJob,reopenJob,render,strip,tablePanel,printHTML,PRINT_CSS,settingsHTML,bindSettings,promote,ready,name:()=>cfg().name,short:()=>cfg().short};
})();
