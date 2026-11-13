/* ================= SHOP GENERATOR ================= */
const Shops=(()=>{
  let T=DEFAULT_SHOP_TABLES;
  function reloadTables(){T=C.tables.shops||DEFAULT_SHOP_TABLES}
  const RAR=["common","uncommon","rare","very rare","legendary"];
  const M=()=>(UI.mkt=UI.mkt||{type:"General Store",custom:"",place:"The City (base bazaar)",wealth:"Modest",tier:null,view:"dm"});
  const between=r=>{const [a,b]=r||[1,1];return a+rnd(Math.max(0,b-a)+1)};
  const tierNow=()=>M().tier==null?tierOf(S.tierRank):M().tier;
  const typeName=s=>s.typeLabel||s.type;
  function roundPrice(g){g=+g||0;if(g<=0)return 0;if(g>=100)return Math.round(g/5)*5;if(g>=10)return Math.round(g);if(g>=1)return Math.round(g*10)/10;return Math.max(0.01,Math.round(g*100)/100)}
  function coins(g){g=+g||0;if(g<=0)return "—";if(g>=10)return fmt(Math.round(g))+" gp";
    const cp=Math.round(g*100),G=Math.floor(cp/100),s=Math.floor(cp%100/10),c=cp%10;return [G&&G+" gp",s&&s+" sp",c&&c+" cp"].filter(Boolean).join(" ")}
  function matchType(text){const t=(text||"").toLowerCase();let best=null,score=0;
    Object.entries(T.shopTypes).forEach(([k,v])=>{const s=(v.keywords||[]).filter(w=>t.includes(w)).length;if(s>score){score=s;best=k}});return best}
  const allowedRarities=t=>RAR.filter((r,i)=>((T.magicRarityByTier||[])[t]||[])[i]>0);

  /* ---------- rolling ---------- */
  function ownerKey(name){const p=String(name).split(" ").filter(w=>!/^(old|young|madame|master|mother|father|sister|brother|auntie|uncle|captain|doctor|lady|lord|sir|dame|the)$/i.test(w));
    return p.length>1&&Math.random()<0.5?p[p.length-1]:(p[0]||name)}
  function rollName(type,owner){const ty=T.shopTypes[type]||{},nouns=ty.nouns&&ty.nouns.length?ty.nouns:["Lantern"],n1=pick(nouns);let n2=pick(nouns);for(let i=0;i<4&&n2===n1;i++)n2=pick(nouns);
    return pickFresh(T.namePatterns,"shopname").replace("{adj}",pickFresh(T.adjectives,"shopadj")).replace("{noun2}",n2).replace("{noun}",n1)
      .replace("{kind}",pick(ty.kinds&&ty.kinds.length?ty.kinds:["Shop"])).replace("{owner}",ownerKey(owner)).replace("{place}",pick(T.placeNouns||["Old Knot"]))}
  function rollNPC(role){const N=T.npc;return {name:Jobs.genName(),role,ancestry:pickFresh(N.ancestries,"sanc"),look:pickFresh(N.looks,"slook"),
    personality:pickFresh(N.personalities,"spers"),voice:pickFresh(N.voices,"svoice"),want:pickFresh(N.wants,"swant")}}
  function rollStaff(s){const roles=(T.shopTypes[s.type].roles||["Owner"]).slice(),n=between((T.wealth[s.wealth]||{}).staffCount);
    const out=[rollNPC(roles.shift()||"Owner")];for(let i=1;i<n;i++)out.push(rollNPC(roles.length?roles.splice(rnd(roles.length),1)[0]:"Helper"));return out}
  function rollMagic(t){const w=(T.magicRarityByTier||[])[t]||[1];const r=wpick(RAR.map((k,i)=>[k,w[i]||0]));const it=pickFresh(T.magicItems[r]||[],"smag:"+r);return it?Object.assign({rarity:r},it):null}
  const priceOf=(it,s)=>it.price?roundPrice(it.price*((T.wealth[s.wealth]||{}).mult||1)*(0.9+Math.random()*0.25)):0;
  function rollItem(s,have){const ty=T.shopTypes[s.type];
    for(let i=0;i<15;i++){let it=Math.random()<(ty.magic||0)?rollMagic(s.tier):null;if(!it)it=pickFresh(ty.stock,"stock:"+s.type);
      if(it&&!have.has(it.name)){have.add(it.name);return {name:it.name,price:priceOf(it,s),desc:it.desc||"",rarity:it.rarity||null}}}
    return null}
  const sortStock=a=>a.sort((x,y)=>(x.rarity?1:0)-(y.rarity?1:0)||x.price-y.price);
  function rollStock(s){const have=new Set(),out=[],n=between((T.wealth[s.wealth]||{}).itemCount);for(let i=0;i<n;i++){const it=rollItem(s,have);if(it)out.push(it)}return sortStock(out)}
  function rollLook(s){const P=T.places[s.place]||Object.values(T.places)[0],ty=T.shopTypes[s.type];
    return {exterior:cap(pickFresh(P.exterior,"sext:"+s.place)),interior:cap(pickFresh(ty.interiors||["shelves of goods"],"sint:"+s.type)),sensory:cap(pickFresh(P.sensory,"ssen:"+s.place)),detail:cap(pickFresh(T.details,"sdet"))}}
  function newShop(){const m=M(),custom=(m.custom||"").trim();let type=m.type;
    if(type==="__custom"||(custom&&!T.shopTypes[type]))type=matchType(custom)||"Pawnshop & Oddities";
    if(!T.shopTypes[type])type=Object.keys(T.shopTypes)[0];
    const s={id:uid(),type,custom:m.type==="__custom"||custom?custom:"",place:T.places[m.place]?m.place:Object.keys(T.places)[0],wealth:T.wealth[m.wealth]?m.wealth:"Modest",tier:tierNow(),
      kept:false,ai:false,tagline:"",readAloud:"",prompt:null,note:null};
    s.staff=rollStaff(s);s.name=rollName(type,s.staff[0].name);s.look=rollLook(s);s.stock=rollStock(s);
    s.quirk=pickFresh(T.quirks,"squirk");s.rumor=pickFresh(T.rumors,"srumor");s.haggle=pick(T.haggle);
    if(s.custom){s.prompt=prompt(s);s.note=`Built from the "${type}" tables. Your custom idea needs Claude: use the write-up button, or copy the prompt.`}
    return s}
  function generate(withAI,btn){const s=newShop();
    const unkept=C.shops.filter(x=>!x.kept);if(unkept.length>=8){const drop=unkept[unkept.length-1];C.shops.splice(C.shops.indexOf(drop),1)}
    C.shops.unshift(s);commit();render();
    if(withAI)writeUp(s,$(`#mShops [data-id="${s.id}"] [data-act="ai"]`))}

  /* ---------- Claude ---------- */
  function prompt(s){const w=T.wealth[s.wealth]||{},n=w.itemCount||[8,12];return `You are helping a DM prep a shop for a D&D 5e campaign.
Setting: one universal World Tree (Yggdrasil) grows through the planes. A bazaar city sits at its base, more lives inside the Tree, its Roots link the worlds, and its branches rise into worlds of every genre. Tone: whimsical and strange with a hopeful heart. Currency is cp/sp/gp/pp; 1 gp is about a day of modest living; use PHB/DMG prices. The party's guild is ${TIERS[s.tier]} tier, so any magic items should be ${allowedRarities(s.tier).join(" or ")||"uncommon"}.

SHOP REQUEST
Type: ${s.type}${s.custom?`\nThe DM's idea (follow it closely; it overrides the type): ${s.custom}`:""}
Location: ${s.place}. Wealth: ${s.wealth} (${w.blurb||""}).
Draft from the random tables (keep what fits, improve or replace the rest):
Name: ${s.name}
Staff: ${s.staff.map(p=>`${p.name} (${p.role}), ${p.ancestry}, ${p.personality}`).join("; ")}
Stock: ${s.stock.map(i=>`${i.name} ${coins(i.price)}`).join("; ")}
Look: ${s.look.exterior}. ${s.look.interior}. ${s.look.sensory}. ${s.look.detail}.
Quirk: ${s.quirk}

Return ONLY JSON:
{"name": shop name, "type": short shop-type label, "tagline": the sign's slogan,
 "look": {"exterior": 1-2 sentences, "interior": 1-2 sentences, "sensory": 1 sentence of sounds and smells, "detail": one memorable signature detail},
 "readAloud": 2-3 sentences the DM reads aloud as the party walks in,
 "staff": [1-4 NPCs: {"name", "role", "ancestry", "look", "personality", "voice", "want": DM-only want or secret that could become a job}],
 "stock": [${n[0]}-${n[1]} items: {"name", "price_gp": number (0.1 = 1 sp, 0.01 = 1 cp), "desc": one short in-world line, "rarity": null or the magic item rarity}],
 "quirk": one shop quirk, "rumor": one DM-only rumor or hook, "haggle": one line on haggling here, with a DC}
Use official names for standard gear and magic items, add a few invented local goods, and price everything for this shop's wealth.`}
  function fromAI(s,x){const num=v=>{const n=parseFloat(String(v).replace(/[^0-9.]/g,""));return isNaN(n)?0:n};
    if(x.name)s.name=x.name;if(x.type)s.typeLabel=x.type;if(x.tagline!=null)s.tagline=x.tagline;if(x.readAloud)s.readAloud=x.readAloud;
    if(x.look)s.look=Object.assign({},s.look,x.look);
    if(Array.isArray(x.staff)&&x.staff.length)s.staff=x.staff.map(p=>({name:p.name||"?",role:p.role||"",ancestry:p.ancestry||"",look:p.look||"",personality:p.personality||"",voice:p.voice||"",want:p.want||""}));
    if(Array.isArray(x.stock)&&x.stock.length)s.stock=x.stock.map(i=>({name:i.name||"?",price:roundPrice(num(i.price_gp??i.price)),desc:i.desc||"",rarity:i.rarity||null}));
    ["quirk","rumor","haggle"].forEach(k=>{if(x[k])s[k]=x[k]});s.ai=true;s.prompt=null;s.note=null}
  function writeUp(s,btn){aiRun({prompt:prompt(s),fallback:{},btn,apply:x=>{if(x.ai)fromAI(s,x);else{s.prompt=x.prompt;s.note=x.note}commit();render()}})}

  /* ---------- render ---------- */
  const opts=(list,cur)=>list.map(v=>`<option ${v===cur?"selected":""}>${esc(v)}</option>`).join("");
  function render(){const host=$("#tab-market");if(!host)return;const m=M(),gt=tierOf(S.tierRank);
    host.innerHTML=`<div class="controls">
      <label>Shop type <select id="mType">${opts(Object.keys(T.shopTypes),m.type)}<option value="__custom" ${m.type==="__custom"?"selected":""}>Custom (describe it)</option></select></label>
      <label>Location <select id="mPlace">${opts(Object.keys(T.places),m.place)}</select></label>
      <label>Wealth <select id="mWealth">${opts(Object.keys(T.wealth),m.wealth)}</select></label>
      <label>Magic stock tier <select id="mTier"><option value="">Guild tier (${TIERS[gt]})</option>${TIERS.map((t,i)=>`<option value="${i}" ${m.tier===i?"selected":""}>${t}</option>`).join("")}</select></label>
      <label style="flex:1;min-width:260px">Custom shop idea (optional) <input id="mCustom" placeholder="e.g. a mushroom-folk tea house that also sells memories" value="${esc(m.custom)}"></label>
      <span class="btn-pair"><button class="btn primary" id="mGen">Generate</button><button class="btn" id="mGenAI" title="Generate, then have Claude write it up">+ Claude write-up</button></span>
    </div>
    <div class="seg cats" id="mQuick">${(T.quickTypes||[]).filter(t=>T.shopTypes[t]).map(t=>`<button class="btn" data-q="${esc(t)}">${esc(t)}</button>`).join("")}</div>
    <div class="actions" style="margin-bottom:10px"><div class="seg"><button class="btn ${m.view!=="player"?"on":""}" data-v="dm">DM view</button><button class="btn ${m.view==="player"?"on":""}" data-v="player">Player view</button></div>
      <button class="btn small" id="mClear">Clear unkept</button><span class="hint" style="margin:0">${AI.mode()==="none"?"No Claude connection: shops come from the tables; custom ideas give you a prompt to copy into Claude.":"Claude write-ups use "+(AI.mode()==="claude"?"Claude directly.":"your API key.")} Quick buttons generate instantly. Kept shops go to Print and At the Table.</span></div>
    <div id="mShops" class="board shops"></div>`;
    const box=$("#mShops");
    if(!C.shops.length)box.innerHTML='<p class="muted">Pick a shop type (or describe your own) and generate.</p>';
    C.shops.forEach(s=>box.appendChild(m.view==="player"?playerCard(s):dmCard(s)));
    const set=(k,v)=>{m[k]=v;saveUI()};
    $("#mType").onchange=e=>set("type",e.target.value);$("#mPlace").onchange=e=>set("place",e.target.value);$("#mWealth").onchange=e=>set("wealth",e.target.value);
    $("#mTier").onchange=e=>set("tier",e.target.value===""?null:+e.target.value);$("#mCustom").oninput=e=>set("custom",e.target.value);
    $("#mGen").onclick=()=>generate(false);$("#mGenAI").onclick=()=>generate(true);
    $("#mQuick").onclick=e=>{const q=e.target.dataset.q;if(!q)return;m.type=q;m.custom="";saveUI();generate(false)};
    host.querySelector(".seg [data-v]").parentNode.onclick=e=>{const v=e.target.dataset.v;if(v){set("view",v);render()}};
    $("#mClear").onclick=()=>{C.shops=C.shops.filter(s=>s.kept);commit();render()};
  }
  const rr=(f,t)=>`<span class="reroll" data-act="re" data-f="${f}" title="${t}">↻</span>`;
  function dmCard(s){const d=document.createElement("div");d.className="card"+(s.kept?" kept":"");d.dataset.id=s.id;const L=s.look||{};
    d.innerHTML=`<h3>${esc(s.name)}${rr("name","Reroll name")}</h3>
    <div class="badges"><span class="badge gold">${esc(typeName(s))}</span><span class="badge">${esc(s.wealth)}</span><span class="badge">${esc(s.place)}</span><span class="badge t${s.tier}">${TIERS[s.tier]} stock</span>${s.ai?'<span class="badge leaf">Claude write-up</span>':""}${s.kept?'<span class="badge gold">Kept</span>':""}</div>
    ${s.custom?`<div class="row"><b>Idea:</b> <i>${esc(s.custom)}</i></div>`:""}
    ${s.tagline?`<div class="flav">“${esc(s.tagline)}”</div>`:""}
    <h4 class="sh4">The look${rr("look","Reroll look")}</h4>
    <div class="row"><b>Outside:</b> ${esc(L.exterior)}</div><div class="row"><b>Inside:</b> ${esc(L.interior)}</div>
    <div class="row"><b>Senses:</b> ${esc(L.sensory)}</div><div class="row"><b>Detail:</b> ${esc(L.detail)}</div>
    ${s.readAloud?`<div class="worldblock"><b>Read aloud:</b> <i>${esc(s.readAloud)}</i></div>`:""}
    <h4 class="sh4">Staff${rr("staff","Reroll staff")}</h4>
    ${s.staff.map(p=>`<div class="row"><b style="color:var(--ink)">${esc(p.name)}</b>, ${esc(p.role)} <span class="muted">(${esc(p.ancestry)})</span><br>${esc(cap(p.look||""))}${p.look?". ":""}${esc(cap(p.personality||""))}${p.voice?`; ${esc(p.voice)}`:""}.${p.want?`<br><span class="muted">DM: ${esc(p.want)}</span>`:""} <span class="reroll" data-act="snpc" data-i="${s.staff.indexOf(p)}" title="Save to Roster → NPCs">save NPC</span></div>`).join("")}
    <h4 class="sh4">Stock${rr("stock","Reroll all stock")} <span class="reroll" data-act="add" title="Add an item">＋ item</span></h4>
    <table class="ref stock">${s.stock.map((i,k)=>`<tr><td><b>${esc(i.name)}</b>${i.rarity?` <span class="badge leaf">${esc(i.rarity)}</span>`:""}<br><span class="muted">${esc(i.desc)}</span></td><td>${coins(i.price)} <span class="reroll" data-act="rm" data-i="${k}" title="Remove">✕</span></td></tr>`).join("")}</table>
    <div class="dm"><b>Quirk:</b> ${esc(s.quirk)}${rr("quirk","Reroll")}<br><b>Rumor:</b> ${esc(s.rumor)}${rr("rumor","Reroll")}<br><b>Haggling:</b> ${esc(s.haggle)}${rr("haggle","Reroll")}</div>
    ${s.note?`<p class="muted" style="font-size:14px;margin:0">${esc(s.note)}</p>`:""}
    <div class="actions"><button class="btn small primary" data-act="ai">${s.ai?"Rewrite with Claude":"Write up with Claude"}</button>
      <button class="btn small" data-act="keep">${s.kept?"★ Kept":"☆ Keep"}</button><button class="btn small" data-act="copy">Copy</button><button class="btn small" data-act="del">✕</button></div>`;
    if(s.prompt)d.querySelector(".actions").appendChild(aiButtons(s,r=>{fromAI(s,r);commit();render()}));
    d.addEventListener("click",e=>{const a=e.target.dataset.act;if(!a)return;
      if(a==="ai"){writeUp(s,e.target);return}
      if(a==="snpc"){NPCs.fromStaff(s,s.staff[+e.target.dataset.i]);return}
      if(a==="copy"){copyText(shopText(s));return}
      if(a==="re"){const f=e.target.dataset.f;
        if(f==="name")s.name=rollName(s.type,s.staff[0]?.name||"Someone");
        if(f==="look")s.look=rollLook(s);
        if(f==="staff")s.staff=rollStaff(s);
        if(f==="stock")s.stock=rollStock(s);
        if(f==="quirk")s.quirk=pickFresh(T.quirks,"squirk");
        if(f==="rumor")s.rumor=pickFresh(T.rumors,"srumor");
        if(f==="haggle")s.haggle=pick(T.haggle)}
      if(a==="add"){const it=rollItem(s,new Set(s.stock.map(i=>i.name)));if(it){s.stock.push(it);sortStock(s.stock)}else toast("No new items left in this shop's tables")}
      if(a==="rm")s.stock.splice(+e.target.dataset.i,1);
      if(a==="keep")s.kept=!s.kept;
      if(a==="del"){C.shops.splice(C.shops.indexOf(s),1);setTimeout(()=>toast("Shop deleted · Ctrl+Z to undo"),0)}
      commit();render()});
    return d}
  function sheetHTML(s){return `<div class="shopsheet"><div class="sh-type">${esc(typeName(s))}</div><div class="sh-name">${esc(s.name)}</div>${s.tagline?`<div class="sh-tag">“${esc(s.tagline)}”</div>`:""}
    <div class="sh-by">Proprietor: ${esc(s.staff[0]?.name||"")}</div>
    <table>${s.stock.map(i=>`<tr><td>${esc(i.name)}${i.rarity?` <i>(${esc(i.rarity)})</i>`:""}<div class="d">${esc(i.desc)}</div></td><td class="p">${coins(i.price)}</td></tr>`).join("")}</table>
    <div class="sh-foot">gp = gold · sp = silver · cp = copper</div></div>`}
  function playerCard(s){const w=document.createElement("div");w.innerHTML=sheetHTML(s)+`<div class="actions" style="justify-content:center"><button class="btn small">Copy price list</button></div>`;
    w.querySelector("button").onclick=()=>copyText(`${s.name}\n${s.tagline||""}\n\n${s.stock.map(i=>`${i.name}: ${coins(i.price)}`).join("\n")}`);return w}
  function shopText(s){const L=s.look||{};return `${s.name} (${typeName(s)}, ${s.wealth}, ${s.place})${s.tagline?`\n"${s.tagline}"`:""}
Outside: ${L.exterior}\nInside: ${L.interior}\nSenses: ${L.sensory}\nDetail: ${L.detail}${s.readAloud?`\nRead aloud: ${s.readAloud}`:""}
Staff:\n${s.staff.map(p=>`- ${p.name}, ${p.role} (${p.ancestry}). ${p.look}. ${p.personality}; ${p.voice}. DM: ${p.want}`).join("\n")}
Stock:\n${s.stock.map(i=>`- ${i.name}${i.rarity?` (${i.rarity})`:""}: ${coins(i.price)}. ${i.desc}`).join("\n")}
Quirk: ${s.quirk}\nRumor: ${s.rumor}\nHaggling: ${s.haggle}`}
  function tableHTML(){const k=C.shops.filter(s=>s.kept);if(!k.length)return '<p class="muted">Keep shops in the Shop Generator and they show up here.</p>';
    return k.map(s=>`<details class="addons" style="margin-bottom:6px"><summary><b style="color:var(--ink)">${esc(s.name)}</b> <span class="muted">${esc(typeName(s))} · ${esc(s.staff[0]?.name||"")}</span></summary>
      <p class="hint">${esc(s.haggle)}</p><table class="ref">${s.stock.map(i=>`<tr><td>${esc(i.name)}</td><td>${coins(i.price)}</td></tr>`).join("")}</table></details>`).join("")}
  function printHTML(){const k=C.shops.filter(s=>s.kept);return k.length?`<div class="pr-shops">${k.map(s=>`<div class="pr-shop">${sheetHTML(s)}</div>`).join("")}</div>`:""}
  const PRINT_CSS=`.shopsheet{background:#f4e9cf;color:#2b1d0e;font-family:"IM Fell English",Georgia,serif;border:2px solid #7a5a2e;border-radius:4px;padding:16px 22px;max-width:620px;margin:0 auto;box-shadow:inset 0 0 40px rgba(120,80,30,.25);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.shopsheet .sh-type{text-align:center;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#6b4d26}
.shopsheet .sh-name{font-family:"IM Fell English SC",serif;font-size:28px;text-align:center;line-height:1.1}
.shopsheet .sh-tag{text-align:center;font-style:italic}.shopsheet .sh-by{text-align:center;font-size:14px;color:#6b4d26;margin-top:2px}
.shopsheet table{width:100%;border-collapse:collapse;margin-top:8px}.shopsheet td{padding:4px 2px;border-bottom:1px dotted #a88a5c;vertical-align:top;font-size:16px}
.shopsheet td.p{text-align:right;white-space:nowrap;font-weight:bold;padding-left:10px}.shopsheet .d{font-size:13.5px;font-style:italic;color:#5a4123}
.shopsheet .sh-foot{text-align:center;font-size:12px;margin-top:8px;color:#6b4d26}.pr-shops{display:grid;gap:24px}.pr-shop{break-inside:avoid;page-break-inside:avoid}`;
  document.head.insertAdjacentHTML("beforeend",`<style>${PRINT_CSS}.board.shops{grid-template-columns:repeat(auto-fill,minmax(420px,1fr))}.sh4{margin:6px 0 0;font:600 14px "Cinzel",serif;color:var(--leaf);letter-spacing:.03em}table.ref.stock td:last-child{vertical-align:top}</style>`);
  if(UI.print&&UI.print.shops===undefined)UI.print.shops=true;
  return {reloadTables,render,tableHTML,printHTML,PRINT_CSS,coins,tables:()=>T};
})();
