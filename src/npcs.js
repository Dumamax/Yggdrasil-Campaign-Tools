/* ================= NPCs & COUNCIL (Roster → NPCs subtab) ================= */
const NPCs=(()=>{
  let T=DEFAULT_NPC_TABLES;
  function reloadTables(){T=C.tables.npcs||DEFAULT_NPC_TABLES}
  const GUILD_KINDS=["Founder","Active PC","Retired PC","Hired NPC"],ATT=["Hostile","Wary","Neutral","Friendly","Devoted"];
  const isMember=m=>GUILD_KINDS.includes(m.kind);
  const all=()=>C.roster.filter(m=>!isMember(m)).sort((a,b)=>String(a.name).localeCompare(b.name));
  const byId=id=>C.roster.find(m=>m.id===id);
  const seatHolder=t=>C.roster.find(m=>m.seat===t);
  const SN=()=>(Shops.tables()&&Shops.tables().npc)||{};
  let gen={occ:"",con:"",genre:"",arch:"",level:""},cands=[],filt="all",q="";

  /* ---------- generation ---------- */
  const wkeys=o=>Object.entries(o).map(([k,v])=>[k,typeof v==="number"?v:(v.w??1)]);
  function rollLevel(adv){const k=wpick(Object.entries(T.levelCurve||{"1-2":1}));const [a,b]=String(k).split("-").map(Number);let l=a+rnd((b||a)-a+1);
    const t=tierOf(S.tierRank);if(adv&&t>0){const lo=S.mapping[TIERS[t]][0];l=Math.min(15,l+Math.round((lo-3)*(T.adventurerShift??0.75)))}return Math.max(1,l)}
  const genreList=()=>{const G=Jobs.tables().genres;return ["Tree-born",...Object.keys(G.fantasy),...Object.keys(G.other)]};
  const isFantasy=g=>!!Jobs.tables().genres.fantasy[g];
  function rollGenre(){return Math.random()<(T.cityShare??0.55)?"Tree-born":Jobs.rollGenre(S.tierRank)}
  const ancList=g=>T.ancestries[g]||(isFantasy(g)?T.ancestries.Fantasy:null)||T.ancestries["Tree-born"];
  function rollName(g){const L=(T.names||{})[g];if(L&&L.length&&Math.random()<0.6){const used=new Set(C.roster.map(m=>m.name));const n=pickFresh(L,"nname:"+g,used);if(!used.has(n))return n}return Jobs.genName()}
  const gradeFor=l=>l<=1?"Novice":l<=4?"Skilled":l<=10?"Expert":"Master";
  function generate(o={}){
    const occ=o.occ||wpick(wkeys(T.occupations)),O=T.occupations[occ]||{};
    const con=o.con||wpick(wkeys(T.connections)),K=T.connections[con]||{};
    const genre=o.genre||rollGenre(),arch=o.arch||wpick(Object.entries(O.arch||{Noncombatant:1}));
    const adv=occ==="Adventurer"||(con==="Hireable"&&arch!=="Noncombatant");
    const N=SN(),m={id:uid(),kind:"NPC",status:"",name:rollName(genre),ancestry:pickFresh(ancList(genre),"nanc:"+genre)||"",genre,occupation:occ,
      title:pickFresh(O.titles||[occ.toLowerCase()],"ntitle:"+occ)||"",connection:con,archetype:arch,level:+o.level||rollLevel(adv),label:"",
      look:pickFresh(N.looks||[],"nlook")||"",voice:pickFresh(N.voices||[],"nvoice")||"",manner:pickFresh(N.personalities||[],"nmanner")||"",
      want:pickFresh(K.wants||N.wants||[],"nwant:"+con)||"",secret:pickFresh(T.secrets||[],"nsecret")||"",attitude:wpick(Object.entries(K.attitude||{Neutral:1})),
      notes:"",skills:[],role:"",player:"",assign:"",guild:"",public:"",seat:"",rival:false,pinned:false};
    if(con==="Hireable"){const sk=(O.skills||[]).slice(),n=Math.min(sk.length,Math.random()<0.4?2:1),g=gradeFor(m.level);
      const w=String(m.title).toLowerCase().slice(0,5),fit=sk.findIndex(s=>s.toLowerCase().includes(w));
      for(let i=0;i<n;i++)m.skills.push({s:sk.splice(i===0&&fit>=0?fit:rnd(sk.length),1)[0],g});
      m.role=(m.skills[0]&&T.guildJobs[m.skills[0].s])||cap(m.title)}
    return m}
  function add(m,quiet){C.roster.push(m);commit();if(!quiet)toast(`${m.name} saved to NPCs`);return m}

  /* ---------- bridges from other tabs ---------- */
  function fromPatron(h,quiet){
    const p=h.patron;let m=p.npcId&&byId(p.npcId);if(m)return m;
    m=C.roster.find(x=>x.name===p.name);if(m){p.npcId=m.id;commit();return m}
    m=generate({con:"Patron",genre:h.world.genre||"Tree-born",occ:(T.patronOccupations||{})[p.cat]});
    Object.assign(m,{name:p.name,title:p.arch,manner:p.quirk,want:`wants the party to ${h.objective}`,notes:`Patron: ${h.expanded?.title||h.type}.`});
    p.npcId=m.id;return add(m,quiet)}
  function usePatron(h,id){const m=byId(id);if(!m)return;Object.assign(h.patron,{name:m.name,npcId:m.id,quirk:m.manner||m.voice||h.patron.quirk});commit()}
  function fromOffer(o){let m=o.npcId&&byId(o.npcId);if(m){toast(`${m.name} is already saved`);return m}
    if(o.type==="hire"){m=generate({con:"Hireable",occ:"Crafter",genre:o.genre&&o.genre!=="Any"?o.genre:undefined});
      Object.assign(m,{name:o.name.split(",")[0],title:o.name.split(", ").slice(1).join(", ")||o.role,role:o.role,skills:(o.skills||[]).map(s=>({s,g:o.grade})),manner:o.quirk||m.manner})}
    else{m=generate({con:"Contact",occ:"Merchant"});Object.assign(m,{title:`peddler: ${o.vendor}`,notes:`Sold "${o.name}" as a Peddler.`})}
    o.npcId=m.id;return add(m)}
  function fromStaff(s,p){let m=C.roster.find(x=>x.name===p.name);if(m){toast(`${m.name} is already saved`);return m}
    m=generate({con:"Contact",occ:"Merchant",genre:"Tree-born"});
    Object.assign(m,{name:p.name,ancestry:p.ancestry||m.ancestry,title:`${(p.role||"staff").toLowerCase()} at ${s.name}`,look:p.look||m.look,voice:p.voice||m.voice,manner:p.personality||m.manner,want:p.want||m.want});
    return add(m)}
  function addToGuild(m){m.kind="Hired NPC";m.status="In the hall";commit();toast(`${m.name} joins the guild`);App.render()}
  function leaveGuild(m){m.kind="NPC";m.status="";m.assign="";commit();toast(`${m.name} moves to NPCs`);App.render()}

  /* ---------- Claude: write-up, stat block, Council re-roll ---------- */
  const WORLD=()=>`Setting: a D&D 5e campaign around a planar World Tree whose city is a cosmopolitan bazaar; branches lead to worlds of every genre. Tone: whimsical-weird with a hopeful heart. The players' guild is young (currently ${rankName(S.tierRank)}), founded by Mordecai, a gruff changeling who looks like a rat-folk.`;
  const summary=m=>`${m.name}: ${m.ancestry||"?"} ${m.title||m.occupation||""}${m.genre?` (from ${m.genre==="Tree-born"?"the Tree city":"a "+m.genre+" world"})`:""}; ${m.archetype||"Noncombatant"} level ${m.level||"?"}${m.label?` (${m.label})`:""}. Look: ${m.look||"?"}. Voice: ${m.voice||"?"}; ${m.manner||""}. Wants: ${m.want||"?"}. Secret: ${m.secret||"?"}. Attitude toward the guild: ${m.attitude||"Neutral"}.${m.seat?` Holds the ${m.seat} seat on the Council${m.guild?` for ${m.guild}`:""}.`:""}`;
  function merge(m,r){["name","ancestry","title","look","voice","manner","want","secret","label","guild","public"].forEach(k=>{if(r[k]&&typeof r[k]==="string")m[k]=r[k]});
    if(r.level&&!isNaN(+r.level))m.level=+r.level;if(r.archetype&&T.archetypes[r.archetype])m.archetype=r.archetype;
    m.x={ai:!!r.ai,bio:r.bio||m.x?.bio||"",hooks:Array.isArray(r.hooks)?r.hooks:(m.x?.hooks||[]),prompt:r.prompt,note:r.note}}
  function writeUp(m,btn){
    const prompt=`${WORLD()}
Flesh out this NPC for the DM, keeping their name, ancestry, occupation, archetype and level:
${summary(m)}
Return ONLY JSON:
{"look": one vivid line, "voice": how they talk, "manner": one short phrase, "want": what they want right now, "secret": a DM-only secret, "label": short flavor tag for how they fight (e.g. "ex-sky-pirate with a hook blade"), "bio": 2-3 DM-facing sentences, "hooks": [2 one-sentence hooks tying them to the players' guild]}`;
    aiRun({prompt,btn,fallback:{bio:"",hooks:[]},apply:r=>{merge(m,r);commit();App.render()}})}
  const crTxt=c=>c===0.125?"⅛":c===0.25?"¼":c===0.5?"½":String(c);
  function ladderPick(m){const A=T.archetypes[m.archetype]||T.archetypes.Noncombatant,target=(m.level||1)*(T.crPerLevel??0.6);
    let best=A.ladder[0];A.ladder.forEach(r=>{if(Math.abs(r.cr-target)<Math.abs(best.cr-target))best=r});return {r:best,target}}
  function sbBasic(m){const {r,target}=ladderPick(m),d=target-r.cr;
    const adjust=d>0.75?`Tougher than the base: +${Math.min(60,Math.round(d*12))}% hit points and +${Math.max(1,Math.round(d/2))} to attack rolls and save DCs.`:d<-0.75?`Weaker than the base: −${Math.min(50,Math.round(-d*12))}% hit points and −1 to attack rolls and save DCs.`:"Use as written.";
    return {base:`${r.name} (CR ${crTxt(r.cr)})`,adjust,reskin:`Reskin weapons, spells and gear to fit ${m.genre==="Tree-born"||!m.genre?"the Tree city":"a "+m.genre+" world"}${m.label?`: ${m.label}`:""}.`}}
  function statBlock(m,btn){const b=sbBasic(m);
    const prompt=`${WORLD()}
Build a compact reference stat block for this NPC from the official D&D 5e "${b.base.replace(/ \(CR.*$/,"")}" stat block, adjusted to their level and reskinned to their genre and fighting style:
${summary(m)}
Return ONLY JSON:
{"base": official stat block used and its CR, "ac": string, "hp": string, "speed": string, "abilities": "STR x DEX x CON x INT x WIS x CHA x", "attacks": [short attack lines with to-hit and damage], "traits": [2-4 short traits or spells], "tactics": one sentence on how they fight}`;
    aiRun({prompt,btn,fallback:b,apply:r=>{m.sb=r;commit();App.render()}})}
  function rerollSeat(t,btn){
    const ST=T.council.seats[t]||{},old=seatHolder(t),others=TIERS.filter(x=>x!==t).map(seatHolder).filter(Boolean).map(summary).join("\n");
    const lv=String(ST.level||"").split("-").map(Number),level=lv[0]?lv[0]+rnd((lv[1]||lv[0])-lv[0]+1):tierMidLevel(TIERS.indexOf(t));
    const fb=generate({occ:"Adventurer",con:"Bystander",level});Object.assign(fb,{title:`guild master of a top ${t} guild`,want:ST.stance||fb.want,public:`Newly elected to ${ST.title||"the "+t+" Seat"}.`});
    const prompt=`${WORLD()}
Write a new member of the Council (5 seats, one per guild tier, each elected by that tier's guilds; usually a top guild's master). They now hold ${ST.title||t}.
Seat duties: ${ST.duties||""}
Seat's usual stance toward Iron guilds: ${ST.stance||""}
Typical level for this seat: ${ST.level||level}.${old?`\nThey replace: ${summary(old)}`:""}
Other current Council members (make this one distinct from them):
${others||"none"}
Return ONLY JSON:
{"name": string, "ancestry": string, "title": e.g. "guild master of the X (${t} 1)", "guild": guild name, "archetype": one of ${Object.keys(T.archetypes).join(", ")}, "level": number, "label": short flavor tag for how they fight, "look": one line, "voice": how they talk, "manner": short phrase, "public": one line players would hear about them, "want": their agenda, "secret": DM-only secret with a hook, "bio": 2-3 DM-facing sentences, "hooks": [2 one-sentence hooks tying them to the players' Iron guild]}`;
    aiRun({prompt,btn,fallback:{},apply:r=>{const m=fb;merge(m,r);m.occupation="Adventurer";m.connection="Bystander";m.seat=t;
      if(old){old.seat="";old.notes=`${old.notes?old.notes+" ":""}Former ${t} Council seat.`}C.roster.push(m);commit();toast(`${m.name} takes the ${t} seat`);App.render()}})}
  function seatNPC(t,id){const cur=seatHolder(t);if(cur)cur.seat="";const m=byId(id);if(m)m.seat=t;commit();App.render()}

  /* seed Council + Mordecai's profile fields (old campaigns get them on load) */
  function ensure(){let ch=false;
    if(!C.councilSeeded){(T.council.starting||[]).forEach(s=>{if(!C.roster.some(m=>m.name===s.name)){C.roster.push(Object.assign({id:uid(),kind:"NPC",status:"",skills:[],role:"",player:"",assign:"",notes:"",rival:false,pinned:s.seat==="Iron"},clone(s)))}});C.councilSeeded=true;ch=true}
    const mo=C.roster.find(m=>m.kind==="Founder");
    if(mo&&mo.forms==null){Object.assign(mo,{forms:["Rat Folk (current form)"],motive:"",occupation:"Adventurer",archetype:mo.archetype||"Support",look:mo.look||"a scruffy, grey-whiskered rat-folk with tired eyes and a stained vest",voice:mo.voice||"a gravelly mutter, mostly complaints",manner:mo.manner||"gruff, sarcastic, secretly caring"});ch=true}
    if(ch)commit()}

  /* ---------- UI ---------- */
  const attSel=m=>`<select class="att" data-att="${m.id}">${ATT.map(a=>`<option${a===(m.attitude||"Neutral")?" selected":""}>${a}</option>`).join("")}</select>`;
  const attCls=a=>({Hostile:"t-hostile",Wary:"t-wary",Friendly:"leaf",Devoted:"gold"}[a]||"");
  function profileHTML(m,dm=true,noAnc=false){
    const sb=m.sb;return `${!noAnc&&(m.ancestry||m.genre)?`<div class="row">${esc(m.ancestry||"")}${m.genre?` <span class="muted">· ${esc(m.genre)}</span>`:""}${m.guild?` <span class="muted">· ${esc(m.guild)}</span>`:""}</div>`:""}
    ${m.look||m.voice||m.manner?`<div class="row">${esc(cap(m.look||""))}${m.look?". ":""}${m.voice?`<i>${esc(cap(m.voice))}</i>`:""}${m.manner?`; ${esc(m.manner)}`:""}.</div>`:""}
    ${m.public?`<div class="row"><b>Known for:</b> ${esc(m.public)}</div>`:""}
    ${m.want?`<div class="row"><b>Wants:</b> ${esc(m.want)}</div>`:""}
    ${dm&&(m.secret||m.motive)?`<div class="dm">${m.motive?`<b>Motive:</b> ${esc(m.motive)}<br>`:""}${m.secret?`<b>Secret:</b> ${esc(m.secret)}`:""}</div>`:""}
    ${(m.forms||[]).length?`<div class="row"><b>Forms:</b> ${m.forms.map(esc).join(" → ")}</div>`:""}
    ${m.x&&(m.x.bio||(m.x.hooks||[]).length||m.x.note)?`<div class="expanded">${m.x.note?`<p class="muted">${esc(m.x.note)}</p>`:""}${m.x.bio?`<p>${esc(m.x.bio)}</p>`:""}${(m.x.hooks||[]).length?`<h4>Hooks</h4><ul>${m.x.hooks.map(h=>`<li>${esc(h)}</li>`).join("")}</ul>`:""}</div>`:""}
    ${sb?`<div class="worldblock"><b>Stat block:</b> ${esc(sb.base||"")}${sb.ac?` · AC ${esc(sb.ac)} · HP ${esc(sb.hp)} · Speed ${esc(sb.speed||"")}<br>${esc(sb.abilities||"")}`:""}
      ${(sb.attacks||[]).length?`<br><b>Attacks:</b> ${sb.attacks.map(esc).join("; ")}`:""}${(sb.traits||[]).length?`<br><b>Traits:</b> ${sb.traits.map(esc).join("; ")}`:""}
      ${sb.tactics?`<br><i>${esc(sb.tactics)}</i>`:""}${sb.adjust?`<br>${esc(sb.adjust)}`:""}${sb.reskin?`<br><span class="muted">${esc(sb.reskin)}</span>`:""}${sb.note?`<br><span class="muted">${esc(sb.note)}</span>`:""}</div>`:""}`}
  function badges(m){return `<div class="badges">${m.seat?`<span class="badge gold">${esc(m.seat)} Seat</span>`:""}${m.occupation?`<span class="badge">${esc(m.occupation)}${m.title?`: ${esc(m.title)}`:""}</span>`:""}${m.connection?`<span class="badge">${esc(m.connection)}</span>`:""}
    <span class="badge">${esc(m.archetype||"Noncombatant")}${m.level?` · Lvl ${esc(m.level)}`:""}</span>${m.label?`<span class="badge"><i>${esc(m.label)}</i></span>`:""}<span class="badge ${attCls(m.attitude)}">${esc(m.attitude||"Neutral")}</span>${m.rival?'<span class="badge t-hostile">Rival</span>':""}${m.pinned?'<span class="badge gold">📌 Pinned</span>':""}</div>`}
  function card(m,candidate){
    const d=document.createElement("div");d.className="card"+(m.seat?" owned":"");d.dataset.npc=m.id;
    d.innerHTML=`<h3>${esc(m.name)}</h3>${badges(m)}${profileHTML(m)}
      ${(m.skills||[]).length?`<div class="chips">${m.skills.map(s=>`<span class="chip">${esc(s.s)} · <b>${Roster.gradeOf(m,s)}</b></span>`).join("")}${m.role?` <span class="muted" style="font-size:14px">suits: ${esc(m.role)}</span>`:""}</div>`:""}
      ${m.notes?`<div class="row muted">${esc(m.notes)}</div>`:""}
      <div class="actions">${candidate?`<button class="btn small primary" data-a="keep">Save NPC</button><button class="btn small" data-a="reroll">Reroll</button>`:
      `<button class="btn small" data-a="edit">Edit</button>${attSel(m)}<button class="btn small" data-a="pin">${m.pinned?"Unpin":"📌 Pin"}</button><button class="btn small" data-a="rival">${m.rival?"Not a rival":"Mark rival"}</button>
      <button class="btn small primary" data-a="write">${m.x?.ai?"Rewrite":"Write up"}</button><button class="btn small" data-a="sb">${m.sb?"Re-roll stat block":"Roll stat block"}</button><button class="btn small" data-a="join">Add to Guild</button><button class="btn small danger" data-a="del">Delete</button>`}</div>`;
    if(!candidate){const acts=d.querySelector(".actions");if(m.x&&m.x.prompt)acts.appendChild(aiButtons(m.x,r=>{merge(m,r);commit();App.render()}));
      if(m.sb&&m.sb.prompt){const w=aiButtons(m.sb,r=>{m.sb=r;commit();App.render()});w.querySelectorAll("button").forEach(b=>b.textContent=b.textContent.replace("Claude prompt","stat block prompt").replace("Paste result","Paste stat block"));acts.appendChild(w)}}
    d.addEventListener("click",ev=>{const a=ev.target.dataset.a;if(!a)return;
      if(candidate){if(a==="keep"){add(m);cands=cands.filter(x=>x!==m)}else if(a==="reroll")cands[cands.indexOf(m)]=generate(genOpts());render();return}
      if(a==="edit"){Roster.edit(m);return}
      if(a==="pin")m.pinned=!m.pinned;else if(a==="rival")m.rival=!m.rival;
      else if(a==="write"){writeUp(m,ev.target);return}else if(a==="sb"){statBlock(m,ev.target);return}
      else if(a==="join"){addToGuild(m);return}
      else if(a==="del"){if(!ev.target.dataset.sure){ev.target.dataset.sure=1;ev.target.textContent="Confirm delete?";return}C.roster=C.roster.filter(x=>x!==m)}
      commit();render()});
    return d}
  function bindAtt(root){root.addEventListener("change",e=>{const id=e.target.dataset.att;if(!id)return;const m=byId(id);if(m){m.attitude=e.target.value;commit();toast(`${m.name}: ${m.attitude}`)}})}
  const genOpts=()=>({occ:gen.occ,con:gen.con,genre:gen.genre,arch:gen.arch,level:gen.level});
  const opt=(list,v,any="Any")=>`<option value="">${any}</option>`+list.map(x=>`<option${x===v?" selected":""}>${esc(x)}</option>`).join("");
  function councilEl(){
    const p=document.createElement("div");p.className="panel";p.innerHTML=`<h2>The Council</h2><table class="ref council">${TIERS.map(t=>{const m=seatHolder(t),ST=T.council.seats[t]||{};
      return `<tr><td><b>${esc(ST.title||t)}</b><br><span class="muted" style="font-size:13px">${esc(ST.duties||"")}</span></td>
      <td style="text-align:left;white-space:normal">${m?`<b><a href="#" data-go="${m.id}">${esc(m.name)}</a></b> <span class="badge ${attCls(m.attitude)}">${esc(m.attitude||"Neutral")}</span><br><span class="muted">${esc(m.title||"")}</span>`:'<span class="muted">Vacant</span>'}
      <div class="actions" style="margin-top:4px"><select data-seat="${t}"><option value="">Assign NPC…</option>${all().filter(x=>x.seat!==t).map(x=>`<option value="${x.id}">${esc(x.name)}${x.seat?` (${x.seat} seat)`:""}</option>`).join("")}</select>
      <button class="btn small" data-reseat="${t}">Re-roll seat</button><button class="btn small" data-newseat="${t}">Enter manually</button>${m?`<button class="btn small" data-vacate="${t}">Vacate</button>`:""}</div></td></tr>`}).join("")}</table>
      <p class="hint">Re-roll writes a new member with Claude (or fills one from the tables, with a prompt to copy). The old holder stays in your NPCs.</p>`;
    p.onclick=e=>{const t=e.target.dataset;
      if(t.go){e.preventDefault();App.flash(`[data-npc="${t.go}"]`)}
      else if(t.reseat)rerollSeat(t.reseat,e.target);
      else if(t.newseat){const m=generate({occ:"Adventurer",con:"Bystander",level:tierMidLevel(TIERS.indexOf(t.newseat))});Object.assign(m,{name:"",seat:t.newseat,want:"",secret:"",look:"",voice:"",manner:""});Roster.edit(m)}
      else if(t.vacate){const m=seatHolder(t.vacate);if(m){m.seat="";commit();render()}}};
    p.onchange=e=>{const t=e.target.dataset.seat;if(t&&e.target.value)seatNPC(t,e.target.value)};
    return p}
  let mode="npcs";
  function render(m){if(m)mode=m;
    const h=$("#npcHost");if(!h)return;h.innerHTML="";
    if(mode==="council"){h.appendChild(councilEl());const b=document.createElement("div");b.className="board";b.id="councilCards";bindAtt(b);
      TIERS.map(seatHolder).filter(Boolean).forEach(m=>b.appendChild(card(m)));h.appendChild(b);return}
    const g=document.createElement("div");g.className="panel";
    g.innerHTML=`<h2>Generate NPCs</h2><div class="controls gen-row" style="margin:0;background:none;border:0;padding:0">
      <label>Occupation <select data-g="occ">${opt(Object.keys(T.occupations),gen.occ)}</select></label>
      <label>Connection <select data-g="con">${opt(Object.keys(T.connections),gen.con)}</select></label>
      <label>Genre <select data-g="genre">${opt(genreList(),gen.genre)}</select></label>
      <label>Archetype <select data-g="arch">${opt(Object.keys(T.archetypes),gen.arch)}</select></label>
      <label>Level <input data-g="level" type="number" min="1" max="20" placeholder="any" value="${esc(gen.level)}" style="width:70px"></label>
      <button class="btn primary" id="npcRoll" title="Blank fields roll weighted: common genres and low levels are most likely; over level 10 is rare and over 15 never happens.">Roll 3</button><button class="btn" id="npcNew">＋ New NPC</button></div>
      
      <div class="board" id="npcCands" style="margin-top:8px"></div>`;
    h.appendChild(g);cands.forEach(m=>g.querySelector("#npcCands").appendChild(card(m,true)));
    g.onchange=g.oninput=e=>{const k=e.target.dataset.g;if(k)gen[k]=e.target.value};
    g.querySelector("#npcRoll").onclick=()=>{cands=[0,1,2].map(()=>generate(genOpts()));render()};
    g.querySelector("#npcNew").onclick=()=>Roster.edit({id:uid(),kind:"NPC",status:"",name:"",occupation:"",connection:"",genre:"Tree-born",archetype:"Noncombatant",level:null,attitude:"Neutral",skills:[],role:"",player:"",assign:"",notes:""});
    if(filt==="council")filt="all";
    const f=document.createElement("div");f.className="controls";
    f.innerHTML=`<div class="seg">${[["all","All"],["patron","Patrons"],["rival","Rivals"],["pinned","Pinned"]].map(([k,l])=>`<button class="btn${filt===k?" on":""}" data-f="${k}">${l}</button>`).join("")}</div><input id="npcQ" placeholder="Search names, jobs, notes" value="${esc(q)}" style="width:240px">`;
    f.onclick=e=>{if(e.target.dataset.f){filt=e.target.dataset.f;render()}};
    f.querySelector("#npcQ").oninput=e=>{q=e.target.value;drawList()};
    h.appendChild(f);const b=document.createElement("div");b.className="board";b.id="npcList";h.appendChild(b);bindAtt(b);drawList()}
  function drawList(){const b=$("#npcList");if(!b)return;b.innerHTML="";
    let L=all();if(filt==="patron")L=L.filter(m=>m.connection==="Patron");if(filt==="council")L=L.filter(m=>m.seat);if(filt==="rival")L=L.filter(m=>m.rival);if(filt==="pinned")L=L.filter(m=>m.pinned);
    if(q.trim()){const s=q.toLowerCase();L=L.filter(m=>JSON.stringify([m.name,m.title,m.occupation,m.notes,m.guild,m.ancestry]).toLowerCase().includes(s))}
    if(!L.length){b.innerHTML='<p class="muted">No NPCs here yet. Roll some above, or save patrons from the Job Board.</p>';return}
    L.forEach(m=>b.appendChild(card(m)))}

  /* ---------- Table Mode + print ---------- */
  function tableEl(){const w=document.createElement("div");
    const ids=new Set(),L=[];const push=(m,why)=>{if(m&&!ids.has(m.id)){ids.add(m.id);L.push([m,why])}};
    C.jobs.filter(h=>h.kept||h.final).forEach(h=>push(h.patron.npcId&&byId(h.patron.npcId),"Patron"));
    push(seatHolder("Iron"),"Iron Seat");C.roster.filter(m=>m.pinned).forEach(m=>push(m,"Pinned"));
    w.innerHTML=L.length?`<table class="ref">${L.map(([m,why])=>`<tr><td><b>${esc(m.name)}</b> <span class="muted">${why}</span><br><i class="muted">${esc(m.voice||"")}${m.manner?`; ${esc(m.manner)}`:""}</i></td><td>${attSel(m)}</td></tr>`).join("")}</table>`:'<p class="muted">Pin NPCs, or keep jobs with saved patrons, to see them here.</p>';
    bindAtt(w);return w}
  const pinnedOrSeated=()=>C.roster.filter(m=>m.pinned);
  function cheatHTML(){const L=pinnedOrSeated();if(!L.length)return"";
    return `<div class="pr npc-sheet"><h1>NPC Cheat Sheet</h1><div class="npc-grid">${L.map(m=>`<div class="npc-c"><h3>${esc(m.name)}</h3><div class="lvl">${esc([m.ancestry,m.title||m.occupation].filter(Boolean).join(", "))}${m.seat?` · ${esc(m.seat)} Seat`:""} · ${esc(m.archetype||"")} ${m.level?"lvl "+esc(m.level):""} · <b>${esc(m.attitude||"Neutral")}</b></div>
      ${m.look?`<div>${esc(cap(m.look))}.</div>`:""}${m.voice||m.manner?`<div><i>${esc(cap(m.voice||""))}${m.manner?`; ${esc(m.manner)}`:""}</i></div>`:""}${m.want?`<div><b>Wants:</b> ${esc(m.want)}</div>`:""}${m.secret?`<div><b>Secret:</b> ${esc(m.secret)}</div>`:""}${m.sb?`<div><b>Stats:</b> ${esc(m.sb.base||"")}${m.sb.ac?`, AC ${esc(m.sb.ac)}, HP ${esc(m.sb.hp)}`:""}</div>`:""}</div>`).join("")}</div></div>`}
  function councilHTML(){const L=TIERS.map(t=>[t,seatHolder(t)]).filter(x=>x[1]);if(!L.length)return"";
    return `<div class="council-notice notice"><div class="nhead">BY THE AUTHORITY OF THE TREE</div><div class="ntitle">The Council of Five</div><hr class="nrule">${L.map(([t,m])=>`<div class="cn-seat"><div class="nreward">${esc((T.council.seats[t]||{}).title||t)}</div><b>${esc(m.name)}</b>${m.guild?`, ${esc(m.guild)}`:""}<br><span>${esc(cap(m.look||""))}${m.look?". ":""}${esc(m.public||"")}</span></div>`).join("")}<hr class="nrule"><div class="sig">Petitions are heard at the Iron Seat each morning, snacks permitting.</div></div>`}
  const PRINT_CSS=`.npc-sheet h1{font:700 22px Cinzel,serif;text-align:center;margin:0 0 10px}.npc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.npc-c{border:1px solid #7a5a2e;border-radius:4px;padding:8px 10px;font-size:13.5px;line-height:1.3;break-inside:avoid;page-break-inside:avoid}.npc-c h3{margin:0;font:700 15px Cinzel,serif}.npc-c .lvl{font-size:12px;color:#5a3e1e;margin-bottom:3px}
  .council-notice{max-width:620px;margin:24px auto 0;-webkit-print-color-adjust:exact;print-color-adjust:exact}.council-notice .cn-seat{margin:9px 0;font-size:16px;line-height:1.35}.council-notice .nreward{font-size:16px}`;
  return {reset:()=>{filt="all";q=""},reloadTables,render,ensure,generate,fromPatron,usePatron,fromOffer,fromStaff,addToGuild,leaveGuild,profileHTML,badges,bindAtt,tableEl,cheatHTML,councilHTML,PRINT_CSS,all,isMember,tables:()=>T,ATT,GUILD_KINDS};
})();
