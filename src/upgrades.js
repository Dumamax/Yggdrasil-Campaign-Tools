/* ================= GUILD UPGRADES ================= */
const Upgrades=(()=>{
  let T=DEFAULT_UPG_TABLES;
  function reloadTables(){T=C.tables.upgrades||DEFAULT_UPG_TABLES}
  const G=()=>C.guild;
  const ROMAN=["I","II","III"];
  const fee=t=>(T.goldBaseByLevel[tierMidLevel(t)]||100)*S.feePct/100;
  function nice(n){if(n<=0)return 0;if(n<100)return Math.max(5,Math.round(n/5)*5);if(n<1000)return Math.round(n/25)*25;if(n<10000)return Math.round(n/100)*100;return Math.round(n/500)*500}
  const priceOf=L=>L.gp!=null?L.gp:nice((L.jobs||1)*fee(L.tier||0));
  const genName=()=>Jobs.genName();
  const catItem=id=>T.catalog.find(u=>u.id===id);
  const canAfford=c=>G().treasury==null||c<=G().treasury;
  const typeBadges=t=>[...(t||"")].map(c=>`<span class="badge">${T.perkLabels[c]||c}</span>`).join("");
  const opCatalog=()=>T.catalog.filter(u=>u.op);

  /* peddlers */
  function rollGenre(t){const JT=Jobs.tables();const f=JT.fantasyShare.iron+(JT.fantasyShare.platinum-JT.fantasyShare.iron)*(t/4);
    const grp=Math.random()<f?JT.genres.fantasy:JT.genres.other;return wpick(Object.entries(grp).map(([k,v])=>[k,v.w??v]))}
  function newOffer(){
    const t=tierOf(S.tierRank),tn=TIERS[t];
    const w=T.offers.typeWeightsByTier[tn]||{unique:60,deal:25,hire:15};
    const type=wpick(Object.entries(w)),genre=rollGenre(t);
    const o={id:uid(),type,genre,vendor:pickFresh((T.offers.vendors[genre]||[]).concat(T.offers.vendors.Any||[]),"vendor"),tier:t};
    if(type==="deal"){const opts=[];T.catalog.forEach(u=>{const lv=G().owned[u.id]||0;if(lv<3&&(u.levels[lv].tier||0)<=t+1)opts.push([u,lv])});
      if(opts.length){const [u,lv]=pick(opts),L=u.levels[lv],d=pick(T.offers.discounts);
        return Object.assign(o,{ref:{id:u.id,lvl:lv},name:`${u.name} ${ROMAN[lv]}: ${L.name}`,cat:u.cat,orig:priceOf(L),cost:nice(priceOf(L)*(100-d)/100),discount:d,days:L.days,perk:L.perk,reason:pickFresh(T.offers.dealReasons,"dealr")})}
      o.type="unique"}
    if(o.type==="hire"){const h=pickFresh(T.offers.hires,"hire"),g=T.grades[h.grade]||T.grades.Skilled;
      return Object.assign(o,{name:`${genName()}, ${h.arch}`,cat:"Staff",role:h.role,skills:h.skills,grade:h.grade,quirk:h.quirk,cost:nice(nice(g.jobs*fee(g.tier))*(0.8+Math.random()*0.4)),days:0,perk:`${h.grade} ${h.role.toLowerCase()} (${h.skills.join(", ")}); ${h.quirk}.`})}
    const own=T.offers.unique[genre]||[],any=T.offers.unique.Any||[];
    const u=pickFresh(own.length&&Math.random()<0.6?own:own.concat(any),"unique");
    return Object.assign(o,{type:"unique",name:u.name,cat:u.cat,cost:nice(u.jobs*fee(t)),days:u.days,perk:u.perk});
  }
  function rollOffers(){G().offers=Array.from({length:Math.max(1,S.offerCount)},newOffer);commit();render()}

  /* buying */
  function spend(cost){const g=G();if(g.treasury!=null){if(cost>g.treasury){toast(`Not enough in the treasury (${fmt(cost)} gp)`);return false}g.treasury-=cost}return true}
  function hireStaff(u,L){let m=C.roster.find(x=>x.staffOf===u.id);
    if(m){m.skills=(m.skills||[]).map(s=>({...s,g:L.grade}));m.role=u.name}
    else C.roster.push({id:uid(),name:genName(),kind:"Hired NPC",role:u.name,level:null,ancestry:"",player:"",status:"In the hall",skills:(u.skills||[]).map(s=>({s,g:L.grade})),assign:"",notes:"",staffOf:u.id})}
  function buyLevel(u,lv){if(!spend(priceOf(u.levels[lv])))return;G().owned[u.id]=lv+1;if(u.cat==="Staff")hireStaff(u,u.levels[lv]);
    commit();toast(`${u.levels[lv].name} bought${u.cat==="Staff"?" and added to the roster":""}`);App.render()}
  function buyOffer(o){if(o.sold||!spend(o.cost))return;const g=G();
    if(o.type==="deal"){const u=catItem(o.ref.id),lv=g.owned[u.id]||0;
      if(lv!==o.ref.lvl){if(g.treasury!=null)g.treasury+=o.cost;toast("That level isn't next in line anymore");return}
      g.owned[u.id]=lv+1;if(u.cat==="Staff")hireStaff(u,u.levels[lv])}
    else if(o.type==="hire")C.roster.push({id:uid(),name:o.name.split(",")[0],kind:"Hired NPC",role:o.role,level:null,ancestry:o.name.split(", ").slice(1).join(", "),player:"",status:"In the hall",skills:o.skills.map(s=>({s,g:o.grade})),assign:"",notes:o.quirk?`Quirk: ${o.quirk}.`:""});
    else g.uniques.push({id:o.id,name:o.name,cat:o.cat,perk:o.perk,genre:o.genre,cost:o.cost,days:o.days,x:o.x||null});
    o.sold=true;commit();toast("Bought");App.render()}

  /* expand */
  function expand(info,btn,apply){
    const comp=Math.random()*100<S.buildComp?pickFresh(T.complications,"bcomp"):null;
    const prompt=`You are helping a DM prep a guild-hall upgrade for a D&D 5e campaign.
Setting: one universal World Tree (Yggdrasil) grows through the planes; branches rise into worlds of every genre; a city sits at its base and inside it, where space is strange and guild halls can grow without limit. The guild is young (current tier: ${rankName(S.tierRank)}). Its founder is Mordecai, a gruff, sarcastic, world-weary changeling who looks like a rat-folk and hides his care under complaints. Tone: whimsical-weird with a hopeful heart.

UPGRADE: ${info.name} (${info.cat})${info.genre?`, sold by ${info.vendor}, flavored by a ${info.genre} world`:""}.
Perk: ${info.perk}
Cost: ${fmt(info.cost)} gp. Build time: ${info.days} days.${info.op?` Needs an operator with ${info.op}.`:""}
${comp?`DM-only build complication to adapt: ${comp}`:"No build complication."}

Return ONLY JSON:
{"title": short evocative name for this specific build,
 "description": 2-3 sentences of player-safe flavor describing how it looks and feels in the hall,
 "npc": {"name": string, "role": "builder" or "operator" or similar, "quirk": one short phrase},
 "mordecai": one line of Mordecai grumbling about the cost, in quotes,
 "hooks": [1 or 2 one-sentence story hooks tied to this upgrade],
 "complication": ${comp?"one or two sentences on how the complication plays out":"null"}}
Don't change the perk's mechanics.`;
    aiRun({prompt,btn,apply,fallback:{ai:false,title:info.name,description:info.perk,npc:{name:genName(),role:"builder",quirk:"works fast, talks faster"},mordecai:pickFresh(NPCs.tables().mordecai?.grumbles||["\"That much? For THAT? Fine. Fine.\""],"grumble"),hooks:[],complication:comp}});
  }
  function expandedHTML(x,dm){if(!x)return"";
    return `<div class="expanded">${dm&&x.note?`<p class="muted">${esc(x.note)}</p>`:""}${x.title?`<div><b>${esc(x.title)}</b></div>`:""}<div>${esc(x.description)}</div>
    ${dm?`${x.npc?`<h4>${esc(cap(x.npc.role||"NPC"))}</h4><div>${esc(x.npc.name)}: ${esc(x.npc.quirk)}</div>`:""}
    ${x.mordecai?`<div class="muted" style="margin-top:4px"><i>Mordecai: ${esc(x.mordecai)}</i></div>`:""}
    ${(x.hooks||[]).length?`<h4>Hooks</h4><ul>${x.hooks.map(h=>`<li>${esc(h)}</li>`).join("")}</ul>`:""}
    ${x.complication?`<div class="dm" style="margin-top:4px"><b>Build complication:</b> ${esc(x.complication)}</div>`:""}`:""}</div>`}

  /* render */
  function render(){
    const el=$("#shop");if(!el)return;el.innerHTML="";
    const dm=UI.shopView==="dm",c=UI.shopCat,g=G();
    $("#treasury").value=g.treasury??"";
    $$(".dmonly").forEach(e=>e.style.display=dm?"":"none");
    $$("#cats button").forEach(b=>b.classList.toggle("on",b.dataset.c===c));
    $("#vDMs").classList.toggle("on",dm);$("#vShop").classList.toggle("on",!dm);
    const section=(title,cards)=>{el.insertAdjacentHTML("beforeend",`<div class="section-h">${title}</div>`);const b=document.createElement("div");b.className="board";cards(b);el.appendChild(b)};
    if(c==="All"||c==="Offers")section("Today's Peddlers",b=>{if(!g.offers.length)b.innerHTML=`<p class="muted">${dm?"Roll Peddlers to see who's selling this downtime.":"No peddlers today."}</p>`;g.offers.forEach(o=>b.appendChild(offerCard(o,dm)))});
    if(c==="All"&&g.uniques.length)section("Unique Acquisitions",b=>g.uniques.forEach(u=>{const d=document.createElement("div");d.className="card owned";
      d.innerHTML=`<h3>${esc(u.name)}</h3><div class="badges"><span class="badge gold">Owned</span><span class="badge">${esc(u.cat)}</span>${u.genre?`<span class="badge">${esc(u.genre)}</span>`:""}</div><div class="row">${esc(u.perk)}</div>${expandedHTML(u.x,dm)}${dm?`<div class="actions"><button class="btn small danger" data-a="rm">Remove</button></div>`:""}`;
      d.querySelector('[data-a="rm"]')?.addEventListener("click",()=>{g.uniques=g.uniques.filter(x=>x!==u);commit();render()});b.appendChild(d)}));
    ["Facilities","Services","Staff"].forEach(cat=>{if(c!=="All"&&c!==cat)return;section(cat,b=>T.catalog.filter(u=>u.cat===cat).forEach(u=>b.appendChild(upgradeCard(u,dm))))});
  }
  function upgradeCard(u,dm){
    const g=G(),own=g.owned[u.id]||0,d=document.createElement("div");d.className="card"+(own?" owned":"");d.dataset.upg=u.id;
    const lvls=u.levels.map((L,i)=>{const cost=priceOf(L),st=i<own?"owned":i===own?"next":"later",dim=st!=="owned"&&!canAfford(cost);
      return `<div class="lv ${st}${dim?" dim":""}"><span class="n">${ROMAN[i]}</span><span class="nm">${esc(L.name)} <span class="badge t${L.tier||0}">${TIERS[L.tier||0]}</span></span><span class="cost">${st==="owned"?"✓ Owned":fmt(cost)+" gp"}</span>
      <span class="perk">${esc(L.perk)}</span><span class="meta">${L.days?`${L.days} day${L.days>1?"s":""} to build`:u.cat==="Staff"?"Hired immediately":"Ready immediately"}${dm&&st==="next"?` · <button class="btn small primary" data-buy="${i}">${u.cat==="Staff"?(i?"Promote":"Hire"):"Buy"}</button>`:""}</span></div>`}).join("");
    const ad=u.addons||[],ownedAd=g.addons[u.id]||[];
    const addons=ad.length?`<details class="addons"><summary>${u.cat==="Staff"?"Other options":"Add-ons"} (${ad.length})${ownedAd.length?` · ${ownedAd.length} owned`:""}</summary><ul>${ad.map((a,i)=>{const o=ownedAd.includes(a.name);return `<li class="${o?"addon-owned":""}${!o&&!canAfford(a.gp)?" muted":""}"><b>${esc(a.name)}</b> · ${o?"✓ owned":fmt(a.gp)+" gp"}: ${esc(a.perk)} ${dm&&!o?`<button class="btn small" data-ad="${i}">Buy</button>`:""}${dm&&o?`<button class="btn small" data-adrm="${i}">✕</button>`:""}</li>`}).join("")}</ul></details>`:"";
    let op="";
    if(u.op&&dm){const ops=Roster.sorted().filter(m=>Roster.bestSkill(m,u.op.skills)),cur=C.roster.find(m=>m.assign===u.id),best=cur?Roster.bestSkill(cur,u.op.skills):null,out=best?T.grades[best.g]:null;
      op=`<div class="op"><b>Operator:</b> <select data-op><option value="">${ops.length?"— none —":"no one on the roster has "+esc(u.op.skills.join(" / "))}</option>${ops.map(m=>`<option value="${m.id}"${cur&&cur.id===m.id?" selected":""}>${esc(m.name)} (${Roster.bestSkill(m,u.op.skills).g})</option>`).join("")}</select>
      ${own&&out?`<br>${esc(best.g)}: <b style="color:var(--ink)">${out.output}×</b> ${esc(u.op.makes[Math.max(0,own-1)]||"")} per downtime, up to ${out.cap}.`:own?`<br><span class="muted">Needs ${esc(u.op.skills.join(" or "))}.</span>`:`<br><span class="muted">Buy Level I first.</span>`}</div>`}
    const x=C.expanded[u.id];
    d.innerHTML=`<h3>${esc(u.name)}</h3><div class="badges">${own?`<span class="badge gold">Owned ${ROMAN[own-1]}</span>`:""}${typeBadges(u.types)}${u.skills?`<span class="badge">${esc(u.skills.join(" / "))}</span>`:""}${u.op?`<span class="badge">Operator: ${esc(u.op.skills.join(" / "))}</span>`:""}</div>
    <div class="flav">${esc(u.flavor||"")}</div>${lvls}${addons}${op}${expandedHTML(x,dm)}
    ${dm?`<div class="actions">${own<3?`<button class="btn small" data-a="exp">${x?"Re-expand":"Expand"}</button>`:""}<label class="inline" style="font-size:14px;color:var(--mute)">Owned <select data-own>${[0,1,2,3].map(n=>`<option value="${n}"${n===own?" selected":""}>${n?ROMAN[n-1]:"none"}</option>`).join("")}</select></label></div>`:""}`;
    const setX=r=>{C.expanded[u.id]=r;commit();render()};
    if(dm&&x&&x.prompt)d.querySelector(".actions").appendChild(aiButtons(x,setX));
    d.addEventListener("click",ev=>{const t=ev.target;
      if(t.dataset.buy!=null)buyLevel(u,+t.dataset.buy);
      else if(t.dataset.ad!=null){const a=ad[+t.dataset.ad];if(!spend(a.gp))return;(g.addons[u.id]=g.addons[u.id]||[]).push(a.name);commit();render()}
      else if(t.dataset.adrm!=null){g.addons[u.id]=(g.addons[u.id]||[]).filter(n=>n!==ad[+t.dataset.adrm].name);commit();render()}
      else if(t.dataset.a==="exp"){const i=Math.min(own,2),L=u.levels[i];expand({name:`${u.name} ${ROMAN[i]}: ${L.name}`,cat:u.cat,perk:L.perk,cost:priceOf(L),days:L.days,op:u.op?u.op.skills.join(" or "):null},t,setX)}});
    d.querySelector("[data-own]")?.addEventListener("change",e=>{g.owned[u.id]=+e.target.value;commit();render()});
    d.querySelector("[data-op]")?.addEventListener("change",e=>{C.roster.forEach(m=>{if(m.assign===u.id)m.assign=""});const m=C.roster.find(x=>x.id===e.target.value);if(m)m.assign=u.id;commit();render()});
    return d;
  }
  function offerCard(o,dm){
    const d=document.createElement("div");d.className="card offer"+(o.sold?" sold":"");
    d.innerHTML=`<h3>${esc(o.name)}</h3><div class="badges"><span class="badge gold">${{unique:"Unique",deal:"Deal",hire:"Rare hire"}[o.type]}</span><span class="badge">${esc(o.cat)}</span><span class="badge">${esc(o.genre)}</span>${o.sold?'<span class="badge leaf">Sold</span>':""}</div>
     <div class="flav">Offered by ${esc(o.vendor)}${o.reason?`: ${esc(o.reason)}`:""}.</div>
     <div class="lv${!o.sold&&!canAfford(o.cost)?" dim":""}"><span class="n">⟡</span><span class="nm">${o.type==="deal"?`<s class="muted">${fmt(o.orig)}</s> −${o.discount}%`:o.type==="hire"?"Hire":"One of a kind"}</span><span class="cost">${fmt(o.cost)} gp</span><span class="perk">${esc(o.perk)}</span><span class="meta">${o.days?`${o.days} day${o.days>1?"s":""} to build`:"Ready immediately"}</span></div>
     ${expandedHTML(o.x,dm)}${dm?`<div class="actions">${o.sold?"":`<button class="btn small primary" data-a="buy">Buy</button>`}<button class="btn small" data-a="exp">${o.x?"Re-expand":"Expand"}</button><button class="btn small" data-a="npc">${o.npcId?"✓ NPC saved":"Save NPC"}</button><button class="btn small" data-a="re">Reroll</button><button class="btn small" data-a="del">✕</button></div>`:""}`;
    const setX=r=>{o.x=r;commit();render()};
    if(dm&&o.x&&o.x.prompt)d.querySelector(".actions").appendChild(aiButtons(o.x,setX));
    d.addEventListener("click",ev=>{const a=ev.target.dataset.a;if(!a)return;
      if(a==="buy")buyOffer(o);
      else if(a==="re"){Object.assign(o,newOffer(),{x:null,sold:false});commit();render()}
      else if(a==="del"){G().offers=G().offers.filter(x=>x!==o);commit();render()}
      else if(a==="exp")expand(o,ev.target,setX)
      else if(a==="npc"){NPCs.fromOffer(o);render()}});
    return d;
  }

  /* print */
  const PRINT_CSS=`.pr{font-family:"Crimson Pro",Georgia,serif;color:#2a1c0c}
.pr-sheet{background:linear-gradient(135deg,#f1e4c3,#e6d3a5);padding:24px 26px;border-radius:4px;margin:0 auto;max-width:820px;box-decoration-break:clone;-webkit-box-decoration-break:clone;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pr h1{font:700 30px "IM Fell English SC",serif;text-align:center;margin:0;color:#2a1c0c;letter-spacing:.05em}
.pr .prsub{text-align:center;font-family:"IM Fell English",serif;font-style:italic;margin:2px 0 14px;color:#5a3e1e}
.pr h2{font:700 17px "Cinzel",serif;color:#5a1e10;border-bottom:1.5px solid #8a6a3a;margin:16px 0 6px;padding-bottom:2px}
.pr table{width:100%;border-collapse:collapse;font-size:14px}
.pr td{padding:4px 6px;vertical-align:top;border-bottom:1px dotted #a88a5a}
.pr td.c{white-space:nowrap;text-align:right;font-weight:600;color:#5a1e10}
.pr td.nm{width:30%;font-weight:600}
.pr .lvl{font:700 11px "Cinzel",serif;color:#7a5a2a}
.pr .ad{font-size:12px;color:#5a3e1e;font-style:italic}
.pr .peddlers{border:2px double #5a1e10;padding:8px 12px;margin-top:10px}
.pr .foot{margin-top:14px;text-align:center;font-style:italic;font-size:13px;color:#5a3e1e}
.pr-cards{display:grid;grid-template-columns:1fr 1fr;gap:.2in;max-width:820px;margin:0 auto}
.pr-card{border:2px solid #5a3e1e;border-radius:6px;padding:14px 16px;height:3.1in;overflow:hidden;background:linear-gradient(135deg,#f1e4c3,#e6d3a5);break-inside:avoid;page-break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pr-card h3{font:700 18px "IM Fell English SC",serif;margin:0;color:#2a1c0c}
.pr-card .k{font:600 11px "Cinzel",serif;color:#7a5a2a;letter-spacing:.08em}
.pr-card p{font-size:14.5px;margin:6px 0}
.pr-card .fl{font-style:italic;color:#5a3e1e}
.pr-break{break-before:page;page-break-before:always}
.pr-roster td{font-size:14px}`;
  function ledgerHTML(full,withOffers){const g=G();
    const sec=cat=>`<h2>${cat}</h2><table>${T.catalog.filter(u=>u.cat===cat).map(u=>{const own=g.owned[u.id]||0;if(!full&&own>=3)return "";
      const idxs=full?[0,1,2]:[own];
      const lr=idxs.map(i=>{const L=u.levels[i];return `<tr><td class="nm">${i===idxs[0]?esc(u.name)+"<br>":""}<span class="lvl">${ROMAN[i]} · ${esc(L.name)}</span></td><td>${esc(L.perk)}${L.days?` <i>(${L.days} d)</i>`:""}</td><td class="c">${i<own?"✓ owned":fmt(priceOf(L))+" gp"}</td></tr>`}).join("");
      const ad=(u.addons||[]).filter(a=>!(g.addons[u.id]||[]).includes(a.name));
      return `<tbody>${lr}${ad.length?`<tr><td></td><td colspan="2" class="ad">${cat==="Staff"?"Also":"Add-ons"}: ${ad.map(a=>`${esc(a.name)} (${fmt(a.gp)} gp)`).join(" · ")}</td></tr>`:""}</tbody>`}).join("")}</table>`;
    const open=g.offers.filter(o=>!o.sold);
    const ped=withOffers&&open.length?`<div class="peddlers"><h2 style="margin-top:0">Today's Peddlers</h2><table>${open.map(o=>`<tr><td class="nm">${esc(o.name)}<br><span class="lvl">${{unique:"One of a kind",deal:`Deal: ${o.discount}% off`,hire:"Rare hire"}[o.type]}</span></td><td>${esc(o.perk)}${o.days?` <i>(${o.days} d)</i>`:""}</td><td class="c">${fmt(o.cost)} gp</td></tr>`).join("")}</table></div>`:"";
    return `<div class="pr pr-sheet"><h1>The Builder's Ledger</h1><div class="prsub">Upgrades for the guild hall · ${rankName(S.tierRank)}${g.treasury!=null?` · Treasury: ${fmt(g.treasury)} gp`:""}</div>${ped}${sec("Facilities")}${sec("Services")}${sec("Staff")}<div class="foot">Prices are final. Complaints may be addressed to Mordecai, who will ignore them.</div></div>`}
  function cardsHTML(){const g=G(),cards=[];
    T.catalog.forEach(u=>{const own=g.owned[u.id]||0;if(!own)return;const L=u.levels[own-1],x=C.expanded[u.id],ad=g.addons[u.id]||[];
      cards.push(`<div class="pr pr-card"><div class="k">${esc(u.cat)} · ${ROMAN[own-1]}</div><h3>${esc(u.name)}: ${esc(L.name)}</h3><p class="fl">${esc(x?.description||u.flavor||"")}</p><p>${esc(L.perk)}</p>${own>1?`<p style="font-size:13px">Also: ${u.levels.slice(0,own-1).map(l=>esc(l.perk)).join(" ")}</p>`:""}${ad.length?`<p style="font-size:13px"><b>Add-ons:</b> ${ad.map(esc).join(", ")}</p>`:""}${u.op?`<p style="font-size:13px"><b>Operator:</b> ${esc(C.roster.find(m=>m.assign===u.id)?.name||"unassigned")}</p>`:""}</div>`)});
    g.uniques.forEach(u=>cards.push(`<div class="pr pr-card"><div class="k">Unique · ${esc(u.cat)}</div><h3>${esc(u.name)}</h3>${u.x?.description?`<p class="fl">${esc(u.x.description)}</p>`:""}<p>${esc(u.perk)}</p></div>`));
    return cards.length?`<div class="pr-cards">${cards.join("")}</div>`:""}

  function bind(){
    let tt;$("#treasury").oninput=e=>{clearTimeout(tt);tt=setTimeout(()=>{G().treasury=e.target.value===""?null:Math.max(0,+e.target.value);commit();render()},400)};
    $("#rollOffers").onclick=rollOffers;
    $("#vDMs").onclick=()=>{UI.shopView="dm";saveUI();render()};
    $("#vShop").onclick=()=>{UI.shopView="shop";saveUI();render()};
    $("#cats").onclick=e=>{const c=e.target.dataset.c;if(!c)return;UI.shopCat=c;saveUI();render()};
  }
  return {reloadTables,render,bind,ledgerHTML,cardsHTML,PRINT_CSS,catItem,opCatalog,priceOf,fee,tables:()=>T,ROMAN};
})();
