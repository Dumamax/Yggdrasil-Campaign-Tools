/* ================= JOB BOARD ================= */
const NOTICE_CSS=/*NOTICE_CSS*/"";
const Jobs=(()=>{
  let T=DEFAULT_JOB_TABLES;
  function reloadTables(){T=C.tables.jobs||DEFAULT_JOB_TABLES}
  const fillTpl=(s,ctx)=>s.replace(/\{(\w+)\}/g,(_,k)=>{const loc=ctx&&ctx.fill&&ctx.fill[k];const useLoc=loc&&loc.length&&Math.random()<0.65;return pickFresh(useLoc?loc:(T.fill[k]||["?"]),"fill:"+k)});
  const genreData=g=>T.genres.fantasy[g]||T.genres.other[g];
  const ctxOf=h=>h.world.genre?genreData(h.world.genre):(T.locales[h.location]||{});
  function rollRank(){const d=wpick([[0,60],[1,25],[2,15]]);return Math.max(0,S.tierRank-d)}
  function rollGenre(r){const f=T.fantasyShare.iron+(T.fantasyShare.platinum-T.fantasyShare.iron)*(r/14);
    const grp=Math.random()<f?T.genres.fantasy:T.genres.other;return wpick(Object.entries(grp).map(([k,v])=>[k,v.w]))}
  function rollWorld(r,loc){const lc=T.locales[loc];
    if(lc)return {genre:null,line:`${loc==="The Trunk"?"The trunk between worlds":"Home ground"}, where ${pickFresh(lc.quirks,"lq:"+loc)}`};
    const g=rollGenre(r),gd=genreData(g);return {genre:g,line:`${cap(pickFresh(gd.places,"place:"+g))}, where ${pickFresh(gd.quirks,"quirk:"+g)}`}}
  /* names: a small recurring cast plus a large generated pool; avoids names already in play */
  function genName(){const N=T.names||{};const used=new Set([...C.roster.map(m=>m.name),...C.jobs.map(h=>h.patron&&h.patron.name)]);
    if(!N.first){return pickFresh(T.patronNames,"pname",used)}
    for(let i=0;i<20;i++){const roll=Math.random();let n;
      if(roll<0.1&&N.monikers)n=pickFresh(N.monikers,"moniker");
      else{n=`${pickFresh(N.first,"first")} ${pickFresh(N.last,"last")}`;if(N.titles&&Math.random()<0.15)n=`${pick(N.titles)} ${n}`}
      if(!used.has(n))return n}
    return `${pick(N.first)} ${pick(N.last)}`}
  function patronName(){const N=T.names||{};return Math.random()<(N.recurringChance??0.15)?pickFresh(T.patronNames,"recurring"):genName()}
  function rollPatron(){const cat=wpick(Object.entries(T.patrons).map(([k,v])=>[k,v.w]));const arch=pick(Object.keys(T.patrons[cat].archetypes));
    return {cat,arch,name:patronName(),quirk:pickFresh(T.patronQuirks,"pquirk")}}
  function rollIncentive(r,size,p){const ladder=["common","uncommon","rare","very rare","legendary"];
    let rar=ladder.indexOf(pick(T.rarityByTier[tierOf(r)]));if(size==="Small")rar--;if(size==="Major")rar++;rar=Math.max(0,Math.min(4,rar));
    const kind=pick(T.patrons[p.cat].archetypes[p.arch]);const item=pickFresh((T.items[kind]||T.items.favor)[ladder[rar]],"item:"+kind+":"+ladder[rar]);return {kind,rarity:ladder[rar],item}}
  function rollGold(r,size,p){const base=T.goldBaseByLevel[recLevel(r)]||100;
    const g=base*(T.sizes.goldMult[size]||1)*(T.patrons[p.cat].wealth||1)*(0.75+Math.random()*0.5);return g<20?Math.round(g):Math.round(g/5)*5}
  const guildFee=h=>Math.round(h.gold*S.feePct/100);
  function newHook(r){
    r=r??rollRank();const tier=tierOf(r);
    let type=wpick(Object.entries(T.jobTypes).map(([k,w])=>[k,w[tier]]));
    let size=wpick(T.sizes.names.map((n,i)=>[n,T.sizes.weights[tier][i]]));
    if(type==="World Crisis"&&size==="Small")size="Standard";
    const loc=type==="World Crisis"?wpick(T.locations.names.slice(3).map((n,i)=>[n,T.locations.weights[tier][i+3]||1])):wpick(T.locations.names.map((n,i)=>[n,T.locations.weights[tier][i]]));
    const p=rollPatron(),world=rollWorld(r,loc);
    return {id:uid(),rank:r,type,size,location:loc,world,patron:p,
      objective:fillTpl(pickFresh(T.objectives[type],"obj:"+type),world.genre?genreData(world.genre):T.locales[loc]),incentive:rollIncentive(r,size,p),gold:rollGold(r,size,p),
      complication:Math.random()*100<S.jobComp?pickFresh(T.complications,"jcomp"):null,
      contribution:Math.round((r+1)*(T.sizes.contribution[size]||1)),kept:false,final:false,worldBlock:null,expanded:null};
  }
  function rerollField(h,f){
    if(f==="world"){h.world=rollWorld(h.rank,h.location);h.worldBlock=null;h.objective=fillTpl(pickFresh(T.objectives[h.type],"obj:"+h.type),ctxOf(h))}
    if(f==="patron"){h.patron=rollPatron();h.incentive=rollIncentive(h.rank,h.size,h.patron);h.gold=rollGold(h.rank,h.size,h.patron)}
    if(f==="objective")h.objective=fillTpl(pickFresh(T.objectives[h.type],"obj:"+h.type),ctxOf(h));
    if(f==="incentive")h.incentive=rollIncentive(h.rank,h.size,h.patron);
    if(f==="complication")h.complication=pickFresh(T.complications,"jcomp");
    h.expanded=null;
  }
  const rollWorldBlock=()=>({magic:pickFresh(T.worldBlock.magic,"wbm"),faction:pickFresh(T.worldBlock.factions,"wbf"),threat:pickFresh(T.worldBlock.threats,"wbt")});
  function rollBoard(){const kept=C.jobs.filter(h=>h.kept||h.final);
    const n=Math.max(S.hMin,Math.min(S.hMax,S.hMin+rnd(S.hMax-S.hMin+1)));
    const fresh=[];for(let i=kept.length;i<n;i++)fresh.push(newHook());C.jobs=[...kept,...fresh];commit();render()}
  function budget(h){const lvl=Math.max(1,Math.min(20,S.partyLevel)),b=T.xpBudget[lvl];
    return {low:b[0]*S.partySize,mod:b[1]*S.partySize,high:b[2]*S.partySize,plan:T.fightPlan[h.size]}}

  /* expand */
  const hookTitle=h=>h.expanded?.title||`${h.type}: ${h.patron.arch}`;
  const hookSummary=h=>`${hookTitle(h)} [${rankName(h.rank)}, ${h.size}]. Patron: ${h.patron.name}, ${h.patron.arch} (${h.patron.cat}), who ${h.patron.quirk}. Wants the party to ${h.objective}. Location: ${h.location}${h.world.genre?` (${h.world.genre})`:""}: ${h.world.line}.`;
  function prompt(h,b){return `You are helping a DM prep a D&D 5e (2024 rules preferred, 2014 monsters allowed) job for a guild campaign.
Setting: one universal World Tree (Yggdrasil) grows through the planes; branches rise into many worlds of many genres; a city sits at its base and inside it. Guilds rank Iron→Bronze→Silver→Gold→Platinum. The party belongs to a young Adventurer's Guild founded by Mordecai (gruff, sarcastic changeling). Tone: whimsical and strange with a hopeful heart. The DM runs about 1 fight per short rest, 2 per long rest.

JOB HOOK:
${hookSummary(h)}
Reward: ${fmt(h.gold)} gp plus ${h.incentive.item} (${h.incentive.rarity}). The patron also pays the guild a ${fmt(guildFee(h))} gp fee.
${h.complication?`DM-only complication to weave in: ${h.complication}`:"No complication."}
Party: ${S.partySize} characters of level ${S.partyLevel}. XP budget per encounter (2024 DMG): Low ${b.low}, Moderate ${b.mod}, High ${b.high}. Fight plan: ${b.plan}.

Return ONLY JSON with this shape:
{"title": short evocative job title,
 "summary": 2 sentences for the DM,
 "beats": [3 short scene beats, each one sentence],
 "encounters": [2 or 3 example builds: {"name": string, "difficulty": "Low"|"Moderate"|"High", "monsters": "e.g. 2 × Gnoll (CR 1/2), 1 × Hyena", "xp": total XP number, "reskin": one sentence reskinning to the world's genre}],
 "complication": ${h.complication?"one-sentence way the complication shows up":"null"},
 "rewardNote": one sentence on how/when the reward is delivered,
 "notice": {"heading": e.g. "BY ORDER OF" or "HELP WANTED" or "BOUNTY", "title": short in-world title, "body": 2-4 sentences written in-world by the patron (their voice and quirk), no DM secrets, "reward": short in-world reward line, "deadline": short in-world deadline or "Until filled", "signature": how the patron signs}}
Make the world feel coherent: treat its quirk as a grounded, everyday fact of life there and let it touch the job where natural. Use real official monster names, keep each build's XP within the budget for its difficulty.`}
  function fallback(h){return {ai:false,title:`${h.type}: ${h.patron.arch}`,summary:`${h.patron.name} needs the party to ${h.objective}.`,
    beats:[`Meet ${h.patron.name} (${h.patron.quirk}).`,`Travel to ${h.location.toLowerCase()} and ${h.objective}.`,`Return for payment${h.complication?", once the complication surfaces":""}.`],
    encounters:[],complication:h.complication,rewardNote:"Paid on return.",notice:basicNotice(h)}}
  const basicNotice=h=>({heading:"HELP WANTED",title:`${h.type} Needed`,body:`Seeking capable adventurers to ${h.objective}. Inquire with ${h.patron.name}.`,reward:`${fmt(h.gold)} gold & ${h.incentive.item}`,deadline:"Until filled",signature:h.patron.name});
  function expand(h,btn){const b=budget(h);aiRun({prompt:prompt(h,b),fallback:fallback(h),btn,apply:x=>{h.expanded=x;commit();render()}})}

  /* render */
  function render(){
    if(!$("#jobBoard"))return;
    const el=$("#jobBoard");el.innerHTML="";
    $("#jobAI").textContent=AI.mode()==="none"?"No Claude connection: Expand fills in from the tables and gives you a prompt to copy into Claude.":`Expand asks Claude (${AI.mode()==="claude"?"built in":"your API key"}) for the prep card and Quest Notice.`;
    if(!C.jobs.length){el.innerHTML='<p class="muted">Pick the guild tier and roll the board.</p>';return}
    C.jobs.forEach((h,i)=>el.appendChild(UI.jobView==="dm"?dmCard(h):noticeCard(h,i)));
  }
  function dmCard(h,compact){
    const d=document.createElement("div");d.className="card"+(h.final?" final":h.kept?" kept":"");
    const b=budget(h),t=tierOf(h.rank),x=h.expanded,wb=h.worldBlock;
    d.innerHTML=`<h3>${esc(hookTitle(h))}</h3>
    <div class="badges"><span class="badge t${t}">${rankName(h.rank)}</span><span class="badge">${h.size} · ${esc(T.sizes.blurb[h.size]||"")}</span><span class="badge">Rec. lvl ${recLevel(h.rank)}</span><span class="badge">+${h.contribution} contribution</span>${h.final?'<span class="badge leaf">Final</span>':""}</div>
    <div class="row"><b>Where:</b> ${esc(h.location)}${h.world.genre?` · <i>${esc(h.world.genre)}</i>`:""}${compact?"":'<span class="reroll" data-f="world" title="Reroll world">↻</span>'}<br>${esc(h.world.line)}
      ${h.world.genre&&!compact?`<span class="reroll" data-act="wb">${wb?"hide details":"＋ world details"}</span>`:""}</div>
    ${wb?`<div class="worldblock">${esc(wb.magic)}. Local power: ${esc(wb.faction)}. Threat: ${esc(wb.threat)}.</div>`:""}
    <div class="row"><b>Patron:</b> ${esc(h.patron.name)}, ${esc(h.patron.arch)} <span class="muted">(${esc(h.patron.cat)})</span>, ${esc(h.patron.quirk)}${compact?"":'<span class="reroll" data-f="patron" title="Reroll patron">↻</span>'}</div>
    <div class="row"><b>Job:</b> ${esc(cap(h.objective))}${compact?"":'<span class="reroll" data-f="objective" title="Reroll job">↻</span>'}</div>
    <div class="row"><b>Reward:</b> ${fmt(h.gold)} gp + ${esc(h.incentive.item)} <span class="muted">(${h.incentive.rarity})</span>${compact?"":'<span class="reroll" data-f="incentive" title="Reroll incentive">↻</span>'}<br><span class="muted">Guild fee: ${fmt(guildFee(h))} gp to the treasury</span></div>
    ${h.complication?`<div class="dm"><b>DM:</b> ${esc(h.complication)}${compact?"":'<span class="reroll" data-f="complication">↻</span>'}</div>`:""}
    ${x?expandedHTML(h,x,b):""}
    ${compact?"":`<div class="actions">
      <button class="btn small primary" data-act="expand">${x?"Re-expand":"Expand"}</button>
      <button class="btn small" data-act="keep">${h.kept?"★ Kept":"☆ Keep"}</button>
      <button class="btn small" data-act="final">${h.final?"✓ Final":"Mark final"}</button>
      <button class="btn small" data-act="paid">Paid → treasury</button>
      <button class="btn small" data-act="reroll">Reroll</button>
      <button class="btn small" data-act="copy">Copy</button>
      <button class="btn small" data-act="del">✕</button></div>`}`;
    if(!compact&&x&&x.prompt)d.querySelector(".actions").appendChild(aiButtons(x,r=>{h.expanded=r;commit();render()}));
    d.addEventListener("click",ev=>{const f=ev.target.dataset.f,a=ev.target.dataset.act;if(!f&&!a)return;
      if(f)rerollField(h,f);
      else if(a==="wb")h.worldBlock=h.worldBlock?null:rollWorldBlock();
      else if(a==="expand"){expand(h,ev.target);return}
      else if(a==="keep")h.kept=!h.kept;
      else if(a==="final"){h.final=!h.final;if(h.final)h.kept=true}
      else if(a==="paid"){const fee=guildFee(h);C.guild.treasury=(C.guild.treasury||0)+fee;toast(`+${fmt(fee)} gp to the treasury`)}
      else if(a==="reroll"){const k=h.kept;Object.assign(h,newHook(),{kept:k})}
      else if(a==="del"){C.jobs.splice(C.jobs.indexOf(h),1)}
      else if(a==="copy"){copyText(cardText(h));return}
      commit();App.render()});
    return d;
  }
  function expandedHTML(h,x,b){
    return `<div class="expanded">${x.note?`<p class="muted">${esc(x.note)}</p>`:""}
     ${x.summary?`<p>${esc(x.summary)}</p>`:""}
     <h4>Beats</h4><ol>${(x.beats||[]).map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
     <h4>Encounters</h4>
     <div class="muted" style="font-size:14.5px">Budget for ${S.partySize} × lvl ${S.partyLevel}: Low ${fmt(b.low)} · Moderate ${fmt(b.mod)} · High ${fmt(b.high)} XP. ${esc(b.plan)}.</div>
     ${(x.encounters||[]).length?`<ul>${x.encounters.map(e=>`<li><b>${esc(e.name)}</b> (${esc(e.difficulty)}, ${fmt(+e.xp||0)} XP): ${esc(e.monsters)}<br><i class="muted">${esc(e.reskin||"")}</i></li>`).join("")}</ul>`:'<p class="muted">Pick monsters within the budget.</p>'}
     ${x.complication?`<div class="dm"><b>Complication:</b> ${esc(x.complication)}</div>`:""}
     <h4>Reward</h4><p>${fmt(h.gold)} gp + ${esc(h.incentive.item)} (${h.incentive.rarity}). ${esc(x.rewardNote||"")}</p></div>`;
  }
  const noticeData=h=>h.expanded?.notice||basicNotice(h);
  function noticeHTML(h,rot){const n=noticeData(h);
    return `<div class="notice" style="--rot:${rot||0}deg"><div class="nhead">${esc(n.heading)}</div><div class="ntitle">${esc(n.title)}</div><div class="nbody">${esc(n.body)}</div><hr class="nrule">
      <div class="nreward">Reward: ${esc(n.reward)}</div><div class="nfoot"><span>${esc(n.deadline)}</span><span>Rank: ${rankName(h.rank)} or above</span></div>
      <div class="sig">~ ${esc(n.signature)}</div><div class="stamp">${TIERS[tierOf(h.rank)].toUpperCase()}<br>TIER</div></div>`}
  function noticeCard(h,i){const n=noticeData(h),w=document.createElement("div");w.className="notice-wrap";
    w.innerHTML=noticeHTML(h,((i*37)%7-3)*0.6)+`<div class="actions">${h.expanded?"":'<span class="muted" style="font-size:14px">Basic notice. Expand in DM view for a written one.</span>'}<button class="btn small" data-act="copyn">Copy notice text</button></div>`;
    w.querySelector('[data-act="copyn"]').onclick=()=>copyText(`${n.heading}\n${n.title}\n\n${n.body}\n\nReward: ${n.reward}\n${n.deadline} · Rank: ${rankName(h.rank)} or above\n~ ${n.signature}`);
    return w}
  function cardText(h){const x=h.expanded,b=budget(h);
    let s=`${hookTitle(h)} [${rankName(h.rank)} · ${h.size} · rec. lvl ${recLevel(h.rank)} · +${h.contribution} contribution]
Where: ${h.location}${h.world.genre?` (${h.world.genre})`:""}: ${h.world.line}
Patron: ${h.patron.name}, ${h.patron.arch} (${h.patron.cat}), ${h.patron.quirk}
Job: ${cap(h.objective)}
Reward: ${fmt(h.gold)} gp + ${h.incentive.item} (${h.incentive.rarity}); guild fee ${fmt(guildFee(h))} gp`;
    if(h.complication)s+=`\nDM complication: ${h.complication}`;
    if(x){s+=`\n\n${x.summary||""}\nBeats:\n${(x.beats||[]).map((t,i)=>`${i+1}. ${t}`).join("\n")}\nBudget: Low ${b.low} / Moderate ${b.mod} / High ${b.high} XP. ${b.plan}`;
      (x.encounters||[]).forEach(e=>s+=`\n- ${e.name} (${e.difficulty}, ${e.xp} XP): ${e.monsters}. ${e.reskin||""}`)}
    return s}
  function noticesPrintHTML(){const f=C.jobs.filter(h=>h.final);if(!f.length)return "";
    return `<div class="pr-notices">${f.map(h=>`<div class="pr-notice">${noticeHTML(h,0)}</div>`).join("")}</div>`}
  const PRINT_CSS=NOTICE_CSS+`.pr-notices{display:grid;grid-template-columns:1fr;gap:24px;max-width:640px;margin:0 auto}.pr-notice{break-inside:avoid;page-break-inside:avoid;padding-top:12px}.notice{transform:none!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}`;

  function initControls(){
    const sel=$("#tierSel");sel.innerHTML="";
    for(let r=0;r<15;r++){const o=document.createElement("option");o.value=r;o.textContent=`${rankName(r)} (lvl ${recLevel(r)})`;sel.appendChild(o)}
    sel.value=S.tierRank;$("#pl").value=S.partyLevel;$("#ps").value=S.partySize;
    $("#vDM").classList.toggle("on",UI.jobView==="dm");$("#vNotice").classList.toggle("on",UI.jobView!=="dm");
  }
  function bind(){
    $("#tierSel").onchange=e=>{S.tierRank=+e.target.value;commit();App.render()};
    $("#pl").onchange=e=>{S.partyLevel=Math.max(1,Math.min(20,+e.target.value||3));commit();render()};
    $("#ps").onchange=e=>{S.partySize=Math.max(1,+e.target.value||4);commit();render()};
    $("#rollBtn").onclick=rollBoard;
    $("#vDM").onclick=()=>{UI.jobView="dm";saveUI();initControls();render()};
    $("#vNotice").onclick=()=>{UI.jobView="notice";saveUI();initControls();render()};
  }
  return {reloadTables,render,initControls,bind,dmCard,budget,noticesPrintHTML,PRINT_CSS,genName,tables:()=>T};
})();
