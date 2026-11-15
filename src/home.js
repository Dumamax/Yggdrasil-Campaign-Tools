/* ================= HOME: the DM's pinned page (pins + widgets), feedback notes, usage counts =================
   C.home.items = [{id,type,ref?,size:"s"|"m"|"l",locked?,text?,state?}]. Pinned NPCs/members mirror m.pinned (one source of truth
   for the NPC cheat sheet too). Widgets are types without a ref. Generator results and timers live only on this device. */
const Home=(()=>{
  const PIN_TYPES={npc:"Person",job:"Quest",shop:"Shop",map:"Map",mon:"Monster",enc:"Encounter"};
  const WIDGETS={
    "gen-npc":{g:"Generators",n:"NPC generator",d:"Roll a full NPC; save or pin the keepers",size:"m"},
    "gen-name":{g:"Generators",n:"Name generator",d:"Six fresh names; tap one to copy it",size:"s"},
    "gen-shop":{g:"Generators",n:"Shop generator",d:"Roll a shop with staff and stock",size:"m"},
    dice:{g:"Tools",n:"Dice roller",d:"Any dice, advantage and disadvantage",size:"s"},
    notes:{g:"Tools",n:"Notepad",d:"Quick notes that save with the campaign",size:"m"},
    timer:{g:"Tools",n:"Timer",d:"Countdown with a chime",size:"s"},
    init:{g:"Tools",n:"Initiative tracker",d:"Turn order and rounds",size:"s"},
    party:{g:"Guild & party",n:"Party",d:"The PCs' play stat cards",size:"l"},
    quests:{g:"Guild & party",n:"Quests in play",d:"Every kept or final quest",size:"m"},
    npcsplay:{g:"Guild & party",n:"NPCs in play",d:"Quest patrons, the Iron Seat, pinned people",size:"m"},
    standing:{g:"Guild & party",n:"Guild standing",d:"Rank progress and points",size:"m"},
    hall:{g:"Guild & party",n:"The guild hall",d:"Treasury and owned upgrades",size:"m"},
    prices:{g:"Reference",n:"Price reference",d:"What things cost",size:"m"},
    revival:{g:"Reference",n:"Revival fee",d:"The Root Chapel's price by level",size:"s"}};
  const H=()=>C.home,items=()=>H().items;
  const gen={},timers={},rolls={},dcount={};const W0={s:300,m:500,l:780},GAP=14;
  const byRef=(type,ref)=>items().find(i=>i.type===type&&i.ref===ref);
  const isPinned=(type,ref)=>type==="npc"?!!C.roster.find(m=>m.id===ref)?.pinned:!!byRef(type,ref);
  function add(type,ref,extra){const it=Object.assign({id:uid(),type,size:ref?(type==="map"?"m":type==="job"?"m":"m"):(WIDGETS[type]?.size||"m")},ref?{ref}:{},extra||{});items().push(it);return it}
  function toggle(type,ref){
    if(type==="npc"){const m=C.roster.find(x=>x.id===ref);if(!m)return false;m.pinned=!m.pinned;sync();commit();return m.pinned}
    const it=byRef(type,ref);if(it)items().splice(items().indexOf(it),1);else add(type,ref);commit();return !it}
  /* keep pinned people and pins of deleted things in step (no commit: called on render) */
  function sync(){const L=items();
    C.roster.filter(m=>m.pinned&&!byRef("npc",m.id)).forEach(m=>add("npc",m.id));
    for(let i=L.length-1;i>=0;i--){const it=L[i];if(!it.ref)continue;
      const gone=it.type==="npc"?!C.roster.find(m=>m.id===it.ref&&m.pinned):it.type==="job"?!C.jobs.find(h=>h.id===it.ref):it.type==="shop"?!C.shops.find(s=>s.id===it.ref):it.type==="map"?!C.maps.find(m=>m.id===it.ref):it.type==="enc"?!C.encounters.find(x=>x.id===it.ref):it.type==="mon"?!(Bestiary.isSRD(it.ref)||C.monsters.find(x=>x.id===it.ref)):true;
      if(gone)L.splice(i,1)}}

  /* ---------- render ---------- */
  /* free board: each item has its own x/y/w (and optional h) in px and a z order; moving or resizing brings it to the top.
     Positions are clamped to the board's width so nothing can be dragged off-screen; the board grows downward to fit. Phone layout stacks them. */
  const phone=()=>document.body.classList.contains("mobile");
  function render(){const el=$("#homeView");if(!el)return;sync();
    const L=items();
    el.innerHTML=`<div class="controls home-bar"><button class="btn primary" data-h="add">＋ Add widget</button>
      <button class="btn" data-h="tidy" title="Line everything up neatly, top to bottom">Tidy up</button>
      <button class="btn ghost" data-h="clear" title="Remove everything that isn't locked 🔒">Clear unlocked pins</button>
      <span class="muted home-tip">Drag a title bar to move, the corner to resize. Pin things with 📌 on any card; lock 🔒 what should stay between sessions.</span></div>
      ${L.length?`<div class="home-board"></div>`:`<div class="home-empty"><h2>Your table, your way</h2><p>Pin the NPCs, quest, map and shops you'll need with 📌 on their cards, then add tools like dice or a notepad with <b>＋ Add widget</b>.</p></div>`}`;
    const g=el.querySelector(".home-board");
    if(g){const order=phone()?[...L].sort((a,b)=>(a.y??1e9)-(b.y??1e9)||(a.x||0)-(b.x||0)):L;
      order.forEach(it=>{try{g.appendChild(tile(it))}catch(e){console.error(e)}});if(!phone())layout(g)}
    el.onclick=onClick;el.oninput=onInput;el.onchange=onChange;
    if(g&&!phone()){g.onpointerdown=startDrag;g.ondblclick=e=>{if(!e.target.closest(".tile-rs"))return;const it=items().find(i=>i.id===e.target.closest(".tile").dataset.id);if(it){it.h=null;commit();render()}}}}
  let rzT=null;addEventListener("resize",()=>{clearTimeout(rzT);rzT=setTimeout(()=>{if(UI.tab==="home"&&isDM())render()},200)});
  const BW=g=>Math.max(320,g.clientWidth);
  function place(g,it,d){const bw=BW(g),w=Math.min(it.w||W0[it.size||"m"],bw);d.style.width=w+"px";d.style.height=it.h?it.h+"px":"";
    d.style.left=Math.max(0,Math.min(it.x||0,bw-w))+"px";d.style.top=Math.max(0,it.y||0)+"px";d.style.zIndex=it.z||0}
  function rects(g,skip){return [...g.children].filter(t=>!skip||!skip.has(t.dataset.id)).map(t=>({x:t.offsetLeft,y:t.offsetTop,w:t.offsetWidth,h:t.offsetHeight}))}
  /* drop placement: the spot where the tile can sit highest, leftmost on ties */
  function spot(R,w,bw){let best=null;for(let x=0;x<=Math.max(0,bw-w);x+=Math.max(20,Math.floor((bw-w)/24)||20)){
      const y=R.filter(r=>r.x<x+w+GAP&&x<r.x+r.w+GAP).reduce((m,r)=>Math.max(m,r.y+r.h+GAP),0);if(!best||y<best.y)best={x,y}}
    return best||{x:0,y:0}}
  function layout(g,all){const bw=BW(g),L=items(),byId=id=>g.querySelector(`.tile[data-id="${id}"]`);let ch=false;
    const fresh=new Set(L.filter(it=>all||it.x==null||it.y==null).map(it=>it.id));
    L.forEach(it=>{if(!it.w){it.w=W0[it.size||"m"];ch=true}if(!fresh.has(it.id))place(g,it,byId(it.id))});
    const R=rects(g,fresh);
    L.filter(it=>fresh.has(it.id)).forEach(it=>{const d=byId(it.id),w=Math.min(it.w,bw);d.style.width=w+"px";d.style.height=it.h?it.h+"px":"";const p=spot(R,w,bw);it.x=p.x;it.y=p.y;place(g,it,d);R.push({x:p.x,y:p.y,w,h:d.offsetHeight});ch=true});
    grow(g);if(ch)commit()}
  function grow(g){const b=[...g.children].reduce((m,t)=>Math.max(m,t.offsetTop+t.offsetHeight),0);g.style.height=(b+40)+"px"}
  const topZ=()=>items().reduce((m,i)=>Math.max(m,i.z||0),0)+1;
  function startDrag(e){if(e.button>0)return;const t=e.target.closest(".tile");if(!t)return;const rs=e.target.closest(".tile-rs"),hd=e.target.closest(".tile-head");
    if(!rs&&(!hd||e.target.closest("button,select,input,a")))return;
    const it=items().find(i=>i.id===t.dataset.id);if(!it)return;const g=t.parentElement,bw=BW(g);e.preventDefault();
    const sx=e.clientX,sy=e.clientY,x0=t.offsetLeft,y0=t.offsetTop,w0=t.offsetWidth,h0=t.offsetHeight;let moved=false;
    it.z=topZ();t.style.zIndex=it.z;t.classList.add("moving");try{t.setPointerCapture(e.pointerId)}catch(_){}
    let scrollT=null,lastY=sy;
    const move=ev=>{const dx=ev.clientX-sx,dy=ev.clientY-sy+(window.scrollY-sy0);lastY=ev.clientY;if(!moved&&Math.hypot(dx,dy)<4)return;moved=true;
      if(rs){const w=Math.max(220,Math.min(bw-x0,w0+dx)),h=Math.max(110,h0+dy);t.style.width=w+"px";t.style.height=h+"px"}
      else{t.style.left=Math.max(0,Math.min(bw-w0,x0+dx))+"px";t.style.top=Math.max(0,y0+dy)+"px"}
      if(t.offsetTop+t.offsetHeight+40>g.offsetHeight)g.style.height=(t.offsetTop+t.offsetHeight+40)+"px"};
    const sy0=window.scrollY;
    scrollT=setInterval(()=>{if(lastY>innerHeight-50)window.scrollBy(0,14);else if(lastY<90&&window.scrollY>0)window.scrollBy(0,-14)},30);
    const up=()=>{clearInterval(scrollT);t.removeEventListener("pointermove",move);t.removeEventListener("pointerup",up);t.removeEventListener("pointercancel",up);t.classList.remove("moving");
      if(moved){if(rs){it.w=t.offsetWidth;it.h=t.offsetHeight}else{it.x=t.offsetLeft;it.y=t.offsetTop}Usage.event(rs?"home:resize":"home:move")}
      grow(g);commit()};
    t.addEventListener("pointermove",move);t.addEventListener("pointerup",up);t.addEventListener("pointercancel",up)}
  function title(it){if(!it.ref)return WIDGETS[it.type]?.n||it.type;
    if(it.type==="npc")return C.roster.find(m=>m.id===it.ref)?.name||"Person";
    if(it.type==="job"){const h=C.jobs.find(x=>x.id===it.ref);return h?Jobs.hookTitle(h):"Quest"}
    if(it.type==="shop")return C.shops.find(s=>s.id===it.ref)?.name||"Shop";
    if(it.type==="map")return C.maps.find(m=>m.id===it.ref)?.name||"Map";
    if(it.type==="enc")return C.encounters.find(x=>x.id===it.ref)?.name||"Encounter";
    if(it.type==="mon")return Bestiary.get(it.ref)?.name||"Monster";return ""}
  function tile(it){const d=document.createElement("div");d.className=`panel tile${it.locked?" locked":""}`;d.dataset.id=it.id;if(it.ref)d.dataset.ref=it.ref;
    const kind=it.ref?PIN_TYPES[it.type]:WIDGETS[it.type]?.g.replace(/s$/,"")||"";
    d.innerHTML=`<div class="tile-head"><span class="tile-kind">${esc(kind)}</span><h3>${esc(title(it))}</h3><span class="tile-ctl">
      ${it.ref?`<button class="btn small ghost" data-t="open" title="Open where it lives">↗</button>`:""}
      <button class="btn small ghost lockbtn${it.locked?" on":""}" data-t="lock" title="${it.locked?"Locked: stays when you clear pins (click to unlock)":"Lock so Clear unlocked pins keeps it"}">${it.locked?"🔒":"🔓"}</button>
      <button class="btn small ghost" data-t="rm" title="Remove from Home">✕</button></span></div><div class="tile-body"></div><div class="tile-rs" title="Drag to resize; double-click to fit the height"></div>`;
    const b=d.querySelector(".tile-body"),c=body(it);if(typeof c==="string")b.innerHTML=c;else if(c)b.appendChild(c);return d}

  function body(it){
    switch(it.type){
      case "npc":{const m=C.roster.find(x=>x.id===it.ref);if(!m)return "";const mem=NPCs.isMember(m);
        return `<div class="card-head">${Roster.thumb(m)}<div>${mem?`<div class="badges"><span class="badge gold">${esc(m.kind)}</span>${m.role?`<span class="badge">${esc(m.role)}</span>`:""}</div>`:NPCs.badges(m)}</div></div>
          ${mem?(m.notes?`<div class="row">${esc(m.notes)}</div>`:""):NPCs.profileHTML(m)}<div class="actions"><button class="btn small" data-w="bigview">Full view</button></div>`}
      case "job":{const h=C.jobs.find(x=>x.id===it.ref);return h?Jobs.dmCard(h,true):""}
      case "shop":{const s=C.shops.find(x=>x.id===it.ref);return s?shopHTML(s):""}
      case "map":{const m=C.maps.find(x=>x.id===it.ref);return m?`<img class="tile-map" src="${m.img}" alt="${esc(m.name||"Map")}" data-w="map" title="Open full screen">`:""}
      case "mon":{const m=Bestiary.get(it.ref);if(!m&&Bestiary.isSRD(it.ref)){Bestiary.load().then(()=>{if(UI.tab==="home")render()}).catch(e=>toast(e.message));return '<p class="muted">Loading…</p>'}return Bestiary.statHTML(m,{compact:true})}
      case "enc":{const en=C.encounters.find(x=>x.id===it.ref);if(!en)return "";if(!Bestiary.loaded()&&en.groups.some(g=>Bestiary.isSRD(g.mid)))Bestiary.load().then(()=>{if(UI.tab==="home")render()}).catch(()=>{});return Bestiary.encTile(en)}
      case "gen-npc":{const m=gen[it.id];return `<div class="actions"><button class="btn primary small" data-w="roll">${m?"↻ Reroll":"Roll an NPC"}</button>${m?'<button class="btn small" data-w="savenpc">Save to NPCs</button><button class="btn small" data-w="pinnpc">📌 Save &amp; pin</button>':""}</div>`+
        (m?`<h4 class="gen-name">${esc(m.name)}</h4>${NPCs.badges(m)}${NPCs.profileHTML(m)}`:"")}
      case "gen-name":{const L=gen[it.id]||(gen[it.id]=names());return `<div class="name-list">${L.map(n=>`<button class="btn small ghost" data-w="copy" data-v="${esc(n)}" title="Copy">${esc(n)}</button>`).join("")}</div><div class="actions"><button class="btn small primary" data-w="roll">↻ New names</button></div>`}
      case "gen-shop":{const s=gen[it.id];return `<div class="actions"><button class="btn primary small" data-w="roll">${s?"↻ Reroll":"Roll a shop"}</button>${s?'<button class="btn small" data-w="saveshop">Save to Shops</button><button class="btn small" data-w="pinshop">📌 Save &amp; pin</button>':""}</div>`+(s?shopHTML(s):`<p class="muted">Uses the type, place and wealth last picked on the Shops tab (${esc(UI.mkt?.type||"any type")}).</p>`)}
      case "dice":{const R=rolls[it.id]||[],cnt=dcount[it.id]||1;return `<div class="dice-row dice-count"><span class="muted">How many</span>${[1,2,3,4,5,6,7,8,9,10].map(n=>`<button class="btn small${n===cnt?" on":""}" data-w="dcount" data-v="${n}">${n}</button>`).join("")}</div>
        <div class="dice-row">${[4,6,8,10,12,20,100].map(n=>`<button class="btn small" data-w="die" data-v="${cnt}d${n}">${cnt>1?cnt:""}d${n}</button>`).join("")}</div>
        <div class="dice-row"><button class="btn small" data-w="die" data-v="adv">d20 adv</button><button class="btn small" data-w="die" data-v="dis">d20 dis</button>
        <input data-w="expr" placeholder="2d6+3" value="${esc(it.text||"")}" style="width:90px"><button class="btn small primary" data-w="die" data-v="expr">Roll</button></div>
        <div class="dice-out">${R.map((r,i)=>`<div class="${i?"muted":"dice-top"}"><b>${r.total}</b> <span>${esc(r.label)}</span> <span class="muted">${esc(r.detail)}</span></div>`).join("")||'<span class="muted">Tap a die.</span>'}</div>`}
      case "notes":return `<textarea class="home-notes" data-w="notes" placeholder="Notes for this session…">${esc(it.text||"")}</textarea>`;
      case "timer":{const t=timers[it.id]||(timers[it.id]={left:(+it.text||5)*60e3,end:0});
        return `<div class="timer-face" data-timer="${it.id}">${clock(t)}</div><div class="dice-row">${[1,5,10,30].map(n=>`<button class="btn small" data-w="tset" data-v="${n}">${n} min</button>`).join("")}</div>
          <div class="actions"><button class="btn small primary" data-w="tgo">${t.end?"Pause":"Start"}</button><button class="btn small" data-w="treset">Reset</button></div>`}
      case "init":{const st=it.state||(it.state={rows:[],turn:0,round:1});const R=st.rows;
        return `<div class="init-top"><b>Round ${st.round}</b><button class="btn small primary" data-w="inext">Next turn ▶</button><button class="btn small ghost" data-w="iclear">Clear</button></div>
          <table class="ref init">${R.map((r,i)=>`<tr class="${i===st.turn?"on":""}"><td>${esc(r.n)}</td><td><input class="init-in" type="number" data-w="iset" data-v="${i}" value="${r.i}"></td><td><button class="btn small ghost" data-w="irm" data-v="${i}">✕</button></td></tr>`).join("")}</table>
          <form class="dice-row" data-w="iadd">${whoSel(st)}<input name="n" placeholder="Name" hidden style="flex:1;min-width:90px"><input name="i" type="number" placeholder="Roll" title="Leave blank to roll d20 + their initiative bonus" style="width:64px"><button class="btn small">Add</button></form>`}
      case "party":return PCs.tableSection();
      case "quests":{const w=document.createElement("div");w.className="tile-stack";const L=C.jobs.filter(h=>(h.kept||h.final)&&!h.done);
        if(!L.length)w.innerHTML='<p class="muted">Keep or finalize quests on the Quests tab and they show up here.</p>';L.forEach(h=>w.appendChild(Jobs.dmCard(h,true)));return w}
      case "npcsplay":return NPCs.tableEl();
      case "standing":return Standing.tablePanel();
      case "hall":{const UT=Upgrades.tables(),g=C.guild,owned=UT.catalog.filter(u=>(g.owned[u.id]||0)>0);
        return `<div class="row"><b>Treasury:</b> ${g.treasury==null?"—":fmt(g.treasury)+" gp"}</div>${owned.length||g.uniques.length?`<ul style="margin:4px 0;padding-left:18px">${owned.map(u=>{const lv=g.owned[u.id],L=u.levels[lv-1],op=C.roster.find(m=>m.assign===u.id);return `<li><b>${esc(u.name)} ${Upgrades.ROMAN[lv-1]}</b>: ${esc(L.perk)}${op?` <span class="muted">(${esc(op.name)})</span>`:""}</li>`}).join("")}${g.uniques.map(u=>`<li><b>${esc(u.name)}</b>: ${esc(u.perk)}</li>`).join("")}</ul>`:'<p class="muted">No upgrades yet.</p>'}`}
      case "prices":return App.priceHTML();
      case "revival":{const chapel=C.guild.owned.chapel||0,disc=[0,.25,.5,.75][chapel]||0,l=Math.max(1,+it.text||S.partyLevel||1);
        return `<label class="inline">Character level <input data-w="rvl" type="number" min="1" max="20" value="${l}" style="width:64px"></label>
          <div class="row"><b>Fee:</b> <span style="color:var(--gold);font-size:20px">${fmt(Math.round(S.revive*l*(1-disc)))} gp</span></div><p class="muted" style="font-size:14px">${S.revive} gp × level${chapel?`, −${disc*100}% from the Root Chapel ${Upgrades.ROMAN[chapel-1]}`:""}.</p>`}
    }
    return `<p class="muted">This widget isn't available in this version.</p>`}
  /* who can join initiative: party members, pinned monsters, and live creatures in pinned encounters */
  function candidates(){const L=[];PCs.list().forEach(m=>L.push({k:"pc:"+m.id,n:m.name,b:PCs.init(m),g:"Party"}));
    items().forEach(i=>{if(i.type==="mon"){const m=Bestiary.get(i.ref);if(m)L.push({k:"mon:"+m.id,n:m.name,b:Bestiary.initOf(m),g:"Monsters"})}
      if(i.type==="enc"){const en=C.encounters.find(x=>x.id===i.ref);(en?.live?.cr||[]).filter(c=>c.hp>0).forEach(c=>{const m=Bestiary.get(c.mid);L.push({k:"cr:"+en.id+":"+c.k,n:c.label,b:m?Bestiary.initOf(m):0,g:"Monsters"})})}});return L}
  function whoSel(st){const have=new Set(st.rows.map(r=>r.n)),L=candidates().filter(c=>!have.has(c.n)),grp=g=>L.filter(c=>c.g===g);
    return `<select name="who" data-w="iwho" style="flex:1;min-width:130px"><option value="">Add to the order…</option>${["Party","Monsters"].map(g=>grp(g).length?`<optgroup label="${g}">${grp(g).map(c=>`<option value="${esc(c.k)}">${esc(c.n)} (${c.b>=0?"+":""}${c.b})</option>`).join("")}</optgroup>`:"").join("")}<option value="custom">Someone else (type a name)</option></select>`}
  function isort(st,cur){st.rows.sort((a,b)=>b.i-a.i);const t=st.rows.findIndex(r=>r.n===cur);st.turn=t>=0?t:0}
  function shopHTML(s){return `<div class="badges"><span class="badge gold">${esc(s.typeLabel||s.type)}</span><span class="badge">${esc(s.place||"")}</span><span class="badge">${esc(s.wealth||"")}</span></div>
    ${(s.staff||[]).map(p=>`<div class="row"><b>${esc(p.name)}</b>, ${esc(p.role)}${p.personality?` <span class="muted">· ${esc(p.personality)}</span>`:""}</div>`).join("")}
    <table class="ref stock">${(s.stock||[]).map(i=>`<tr><td>${esc(i.name)}${i.rarity?` <span class="badge leaf">${esc(i.rarity)}</span>`:""}</td><td>${Shops.coins(i.price)}</td></tr>`).join("")}</table>
    ${s.quirk?`<div class="row muted"><b>Quirk:</b> ${esc(s.quirk)}</div>`:""}`}
  function names(){const L=[];for(let i=0;i<6;i++){const n=Jobs.genName();if(!L.includes(n))L.push(n)}return L}
  const clock=t=>{const ms=t.end?Math.max(0,t.end-Date.now()):t.left,s=Math.ceil(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`};
  setInterval(()=>{for(const [id,t] of Object.entries(timers)){if(!t.end)continue;const el=document.querySelector(`[data-timer="${id}"]`);if(el)el.textContent=clock(t);
    if(Date.now()>=t.end){t.end=0;t.left=0;chime();if(el){el.textContent="0:00";el.classList.add("done")}toast("⏰ Time's up");if(UI.tab==="home")render()}}},500);
  function chime(){try{const a=new (window.AudioContext||window.webkitAudioContext)();[0,.35,.7].forEach(dt=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=880;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.25,a.currentTime+dt);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+dt+.3);o.start(a.currentTime+dt);o.stop(a.currentTime+dt+.3)})}catch(e){}try{navigator.vibrate?.([200,100,200])}catch(e){}}
  /* dice: "2d6+1d4+3", "d20-1" */
  function roll(expr){const terms=String(expr).replace(/\s+/g,"").toLowerCase().match(/[+-]?(\d*d\d+|\d+)/g);if(!terms)return null;let total=0;const det=[];
    for(const t of terms){const sg=t[0]==="-"?-1:1,b=t.replace(/^[+-]/,"");
      if(b.includes("d")){let [n,f]=b.split("d").map(Number);n=Math.min(n||1,100);if(!f)continue;const R=Array.from({length:n},()=>1+rnd(f));total+=sg*R.reduce((a,x)=>a+x,0);det.push((sg<0?"−":"")+`[${R.join(", ")}]`)}
      else{total+=sg*+b;det.push((sg<0?"− ":"+ ")+b)}}
    return {total,label:expr,detail:det.join(" ")}}

  /* ---------- events ---------- */
  function find(e){const t=e.target.closest(".tile");return t&&items().find(i=>i.id===t.dataset.id)}
  async function onClick(e){
    const h=e.target.closest("[data-h]")?.dataset.h;
    if(h==="add")return picker();
    if(h==="tidy"){const g=$(".home-board");if(g){items().forEach(i=>{i.h=null;i.z=1});render();layout($(".home-board"),true);toast("Tidied up · Ctrl+Z to undo")}return}
    if(h==="clear"){const b=e.target.closest("[data-h]");const n=items().filter(i=>!i.locked).length;if(!n){toast("Everything here is locked");return}
      if(!b.dataset.sure){b.dataset.sure=1;b.textContent=`Remove ${n} unlocked? Click again`;return}
      items().filter(i=>!i.locked).forEach(i=>{if(i.type==="npc"){const m=C.roster.find(x=>x.id===i.ref);if(m)m.pinned=false}});
      H().items=items().filter(i=>i.locked);commit();render();toast("Cleared · Ctrl+Z to undo");return}
    const it=find(e);if(!it)return;const L=items(),i=L.indexOf(it);
    const t=e.target.closest("[data-t]")?.dataset.t;
    if(t==="lock"){it.locked=!it.locked;commit();return render()}
    if(t==="rm"){if(it.type==="npc"){const m=C.roster.find(x=>x.id===it.ref);if(m)m.pinned=false}L.splice(i,1);commit();render();toast("Removed from Home · Ctrl+Z to undo");return}
    if(t==="open")return openRef(it);
    const mon=e.target.closest("a[data-mon]");if(mon){e.preventDefault();return Bestiary.open(mon.dataset.mon)}
    const w=e.target.closest("[data-w]");if(!w||w.tagName==="INPUT"||w.tagName==="TEXTAREA"||w.tagName==="FORM")return;const a=w.dataset.w,v=w.dataset.v;
    if(it.type==="enc"){const en=C.encounters.find(x=>x.id===it.ref);if(en&&Bestiary.encAct(en,a,e))render();return}
    if(a==="bigview"){const m=C.roster.find(x=>x.id===it.ref);if(m)(m.pc?PCs:NPCs).openBig(m);return}
    if(a==="map"){const m=C.maps.find(x=>x.id===it.ref);if(m)App.openMap(m.img,m.name||"Map");return}
    if(a==="roll"){gen[it.id]=it.type==="gen-npc"?NPCs.generate():it.type==="gen-shop"?Shops.newShop():names();Usage.event("gen:"+it.type);return render()}
    if(a==="copy")return copyText(v);
    if(a==="savenpc"||a==="pinnpc"){const m=gen[it.id];if(!m)return;m.pinned=a==="pinnpc";C.roster.push(m);delete gen[it.id];commit();render();toast(`${m.name} saved to NPCs${m.pinned?" and pinned here":""}`);return}
    if(a==="saveshop"||a==="pinshop"){const s=gen[it.id];if(!s)return;s.kept=true;C.shops.unshift(s);if(a==="pinshop")add("shop",s.id);delete gen[it.id];commit();render();toast(`${s.name} saved to Shops${a==="pinshop"?" and pinned here":""}`);return}
    if(a==="dcount"){dcount[it.id]=+v;return render()}
    if(a==="die"){const ex=v==="expr"?(it.text||"").trim():v;let r;
      if(v==="adv"||v==="dis"){const x=1+rnd(20),y=1+rnd(20);r={total:v==="adv"?Math.max(x,y):Math.min(x,y),label:v==="adv"?"d20 advantage":"d20 disadvantage",detail:`[${x}, ${y}]`}}else r=roll(ex);
      if(!r){toast("Try something like 2d6+3");return}(rolls[it.id]||(rolls[it.id]=[])).unshift(r);rolls[it.id].length=Math.min(rolls[it.id].length,6);if(/^\d+d\d+$/.test(v))dcount[it.id]=1;return render()}
    if(a==="tset"){it.text=v;timers[it.id]={left:+v*60e3,end:0};commit();return render()}
    if(a==="tgo"){const tm=timers[it.id];if(tm.end){tm.left=Math.max(0,tm.end-Date.now());tm.end=0}else{if(!tm.left)tm.left=(+it.text||5)*60e3;tm.end=Date.now()+tm.left}return render()}
    if(a==="treset"){timers[it.id]={left:(+it.text||5)*60e3,end:0};return render()}
    if(a==="inext"){const st=it.state;if(!st.rows.length)return;st.turn++;if(st.turn>=st.rows.length){st.turn=0;st.round++}commit();return render()}
    if(a==="iclear"){it.state={rows:[],turn:0,round:1};commit();return render()}
    if(a==="irm"){it.state.rows.splice(+v,1);if(it.state.turn>=it.state.rows.length)it.state.turn=0;commit();return render()}}
  let noteT=null;
  function onInput(e){const it=find(e);if(!it)return;const w=e.target.dataset.w;
    if(w==="notes"||w==="expr"){it.text=e.target.value;if(w==="notes"){clearTimeout(noteT);noteT=setTimeout(commit,700)}}}
  function onChange(e){const it=find(e);if(!it)return;
    if(e.target.dataset.w==="iwho"){const f=e.target.form;f.n.hidden=e.target.value!=="custom";if(!f.n.hidden)f.n.focus();else f.i.focus();return}
    if(e.target.dataset.w==="iset"){const st=it.state,cur=st.rows[st.turn]?.n;st.rows[+e.target.dataset.v].i=+e.target.value||0;isort(st,cur);commit();return render()}
    if(e.target.dataset.w==="cond"&&it.type==="enc"){const en=C.encounters.find(x=>x.id===it.ref);if(en){Bestiary.encCond(en,e);render()}return}
    if(e.target.dataset.w==="rvl"){it.text=e.target.value;commit();return render()}}
  document.addEventListener("submit",e=>{if(e.target.dataset?.w!=="iadd")return;e.preventDefault();const it=find(e);if(!it)return;const f=new FormData(e.target),n=String(f.get("n")||"").trim();
    const who=String(f.get("who")||""),c=candidates().find(x=>x.k===who),name=c?c.n:n;if(!name){toast("Pick someone, or choose “Someone else” and type a name");return}
    const typed=String(f.get("i")??"").trim(),roll=typed===""?1+rnd(20):null,val=roll!=null?roll+(c?c.b:0):+typed;
    const st=it.state,cur=st.rows[st.turn]?.n;st.rows.push({n:name,i:val});isort(st,cur);
    if(who.startsWith("cr:")){const [,eid,...k]=who.split(":"),en=C.encounters.find(x=>x.id===eid),cr=en?.live?.cr.find(x=>x.k===k.join(":"));if(cr)cr.init=val}
    commit();render();if(roll!=null)toast(`${name} rolled ${roll}${c&&c.b?` ${c.b>0?"+":"−"} ${Math.abs(c.b)}`:""} = ${val}`);$(`.tile[data-id="${it.id}"] select[name=who]`)?.focus()});
  document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.dataset?.w==="amt"){e.preventDefault();e.target.closest(".cr-row")?.querySelector('[data-w="dmg"]')?.click()}if(e.key==="Enter"&&e.target.dataset?.w==="expr"){e.preventDefault();e.target.closest(".tile")?.querySelector('[data-v="expr"]')?.click()}});
  function openRef(it){if(it.type==="npc"){const m=C.roster.find(x=>x.id===it.ref);if(!m)return;const mem=NPCs.isMember(m);App.go("roster",mem?`[data-member="${m.id}"]`:`[data-npc="${m.id}"]`,()=>{UI.rosterSub=mem?"members":m.seat?"council":"npcs";NPCs.reset()})}
    else if(it.type==="job"){const h=C.jobs.find(x=>x.id===it.ref);if(h)App.go("jobs",`[data-job="${h.id}"]`,()=>{UI.jobView="dm";Jobs.setOpen(h,true);Jobs.initControls()})}
    else if(it.type==="shop")App.go("market",`[data-id="${it.ref}"]`,()=>{UI.mkt&&(UI.mkt.view="dm")});
    else if(it.type==="map")App.go("maps",`.map-card`);
    else if(it.type==="enc")App.go("bestiary",`[data-enc="${it.ref}"]`);
    else if(it.type==="mon"){App.go("bestiary","main");Bestiary.open(it.ref)}}
  function picker(){const groups={};Object.entries(WIDGETS).forEach(([k,w])=>(groups[w.g]||(groups[w.g]=[])).push([k,w]));
    const md=modal(`<h2>Add to Home</h2><div class="picker">${Object.entries(groups).map(([g,L])=>`<h4>${esc(g)}</h4><div class="picker-grid">${L.map(([k,w])=>`<button class="btn" data-add="${k}"><b>${esc(w.n)}</b><span class="muted">${esc(w.d)}</span></button>`).join("")}</div>`).join("")}
      <p class="muted" style="margin-top:10px">To pin a person, quest, shop or map, use the 📌 on its card. Monsters and encounters pin from NPCs → Bestiary.</p></div><div class="actions"><button class="btn ghost" data-close>Close</button></div>`,"home-picker");
    md.el.onclick=e=>{if(e.target.closest("[data-close]"))return md.close();const k=e.target.closest("[data-add]")?.dataset.add;if(!k)return;add(k);Usage.event("widget:"+k);commit();md.close();render();
      setTimeout(()=>{const t=$$(".tile");t[t.length-1]?.scrollIntoView({behavior:"smooth",block:"center"})},50)}}

  /* ---------- 📌 buttons on cards elsewhere (added after any re-render) ---------- */
  function refOf(card){if(card.dataset.job)return ["job",card.dataset.job];if(card.dataset.member)return ["npc",card.dataset.member];
    if(card.classList.contains("map-card")){const m=C.maps[+card.dataset.i];return m?["map",m.id]:null}
    if(card.dataset.id&&card.closest("#tab-market"))return ["shop",card.dataset.id];return null}
  function decorate(){if(!isDM())return;
    $$("#tab-jobs .card[data-job],#tab-roster .card[data-member],#tab-market .card[data-id],#tab-maps .map-card").forEach(c=>{const r=refOf(c);if(!r)return;
      let b=c.querySelector(":scope>.pinbtn");if(!b){b=document.createElement("button");b.className="pinbtn";c.classList.add("has-pin");c.prepend(b)}
      const on=isPinned(...r);b.dataset.pin=r.join(":");b.classList.toggle("on",on);b.title=on?"On Home (click to unpin)":"Pin to Home";b.textContent="📌"});
    $$("main section:not(#tab-home) p.hint:not(.tk):not(#pPages):not(#jobAI)").forEach(p=>{if(!p.textContent.trim())return;p.classList.add("tk");
      const q=document.createElement("button");q.className="hint-q";q.type="button";q.textContent="?";q.title="Show the tip";q.onclick=()=>{p.classList.toggle("tk-open");q.classList.toggle("on")};const h=p.previousElementSibling;if(h&&/^(H2|H3|H4)$/.test(h.tagName)&&!h.querySelector(".hint-q")){q.classList.add("in-h");h.append(q)}else p.before(q)})}
  let decoT=0;new MutationObserver(()=>{if(!decoT)decoT=requestAnimationFrame(()=>{decoT=0;decorate()})}).observe(document.querySelector("main"),{childList:true,subtree:true});
  document.addEventListener("click",e=>{const b=e.target.closest(".pinbtn");if(!b)return;e.preventDefault();e.stopPropagation();const [type,ref]=b.dataset.pin.split(":");
    const on=toggle(type,ref);b.classList.toggle("on",on);toast(on?"Pinned to Home":"Removed from Home");Usage.event("pin:"+type)},true);
  return {render,toggle,isPinned,sync,WIDGETS}})();

/* ---------- usage counts: which tabs get opened and what gets searched, per device. Kept in this browser and copied into the campaign on each save ---------- */
const Usage=(()=>{
  const dev=()=>{let d=lsGet("ygh.dev",null);if(!d){d={id:uid().slice(0,6),label:/Android|iPad|iPhone|Mobile|Tablet/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Macintosh/.test(navigator.userAgent))?"Tablet / phone":"Computer"};lsSet("ygh.dev",d)}return d};
  const get=()=>Object.assign({since:Date.now(),tabs:{},events:{},search:[]},lsGet("ygh.usage",{}));
  function bump(k,key){if(typeof isDM==="function"&&!isDM())return;const u=get();u[k][key]=(u[k][key]||0)+1;lsSet("ygh.usage",u)}
  const tab=t=>bump("tabs",t),event=e=>bump("events",e);
  function search(q,picked){if(!q||!isDM())return;const u=get();u.search.unshift({q,p:picked||"",t:Date.now()});u.search.length=Math.min(u.search.length,60);lsSet("ygh.usage",u)}
  function merge(){if(!isDM())return;const d=dev();C.usage=C.usage||{};C.usage[d.id]=Object.assign({label:d.label,at:Date.now()},get())}
  return {tab,event,search,merge,dev}})();

/* ---------- feedback notes: the DM taps "Feedback" whenever something is confusing; notes travel with the campaign ---------- */
const Feedback=(()=>{
  const TAB_NAMES={home:"Home",jobs:"Quests",shop:"Guild · Hall",members:"Guild · Members",standing:"Guild · Standing",npcs:"NPCs",council:"NPCs · Council",bestiary:"NPCs · Bestiary",market:"Shops",maps:"World · Maps",worlds:"World · Worlds",print:"Print",settings:"Settings"};
  const tabName=t=>TAB_NAMES[t]||t;
  function open(){const md=modal(`<h2>What was confusing or annoying?</h2><p class="muted">A quick note is plenty. It's saved with where you are now (${esc(tabName(UI.tab))}).</p>
      <form id="fbForm"><textarea name="t" rows="4" style="width:100%" placeholder="e.g. I couldn't find where to change an NPC's attitude" required></textarea>
      <div class="actions"><button class="btn primary">Save note</button><button type="button" class="btn ghost" data-close>Cancel</button></div></form>`,"fb-modal");
    setTimeout(()=>md.el.querySelector("textarea").focus(),40);
    md.el.querySelector("[data-close]").onclick=md.close;
    md.el.querySelector("form").onsubmit=e=>{e.preventDefault();const t=new FormData(e.target).get("t").trim();if(!t)return;
      C.feedback.unshift({id:uid(),t:Date.now(),tab:UI.tab,dev:Usage.dev().label,text:t});commit();md.close();toast("Noted. It travels with your next save")}}
  function settingsHTML(){const F=C.feedback||[],U=Object.values(C.usage||{});
    const top=o=>Object.entries(o||{}).sort((a,b)=>b[1]-a[1]);
    return `<p class="hint">Notes from the Feedback button, plus how often each tab gets opened and what gets searched (each device's counts arrive when it saves).</p>
      <h3>Notes (${F.length})</h3>${F.length?`<table class="ref">${F.map(f=>`<tr><td><b>${esc(f.text)}</b><br><span class="muted">${new Date(f.t).toLocaleString()} · ${esc(tabName(f.tab))} · ${esc(f.dev||"")}</span></td><td><button class="btn small ghost" data-fbdone="${f.id}">Done</button></td></tr>`).join("")}</table>`:'<p class="muted">No notes yet.</p>'}
      <h3>Usage</h3>${U.length?U.map(u=>`<details class="usage"><summary><b>${esc(u.label)}</b> <span class="muted">since ${new Date(u.since).toLocaleDateString()}, last saved ${new Date(u.at).toLocaleString()}</span></summary>
        <div class="usage-cols"><div><h4>Tabs opened</h4><table class="ref">${top(u.tabs).map(([k,n])=>`<tr><td>${esc(tabName(k))}</td><td>${n}</td></tr>`).join("")}</table></div>
        <div><h4>Searches</h4><table class="ref">${(u.search||[]).slice(0,25).map(s=>`<tr><td>${esc(s.q)}</td><td class="muted">${s.p?"→ "+esc(s.p):"nothing picked"}</td></tr>`).join("")||'<tr><td class="muted">None</td></tr>'}</table></div>
        <div><h4>Actions</h4><table class="ref">${top(u.events).slice(0,25).map(([k,n])=>`<tr><td>${esc(k)}</td><td>${n}</td></tr>`).join("")||'<tr><td class="muted">None</td></tr>'}</table></div></div></details>`).join(""):'<p class="muted">No usage saved yet.</p>'}`}
  function bindSettings(el){el.onclick=e=>{const id=e.target.dataset.fbdone;if(!id)return;C.feedback=C.feedback.filter(f=>f.id!==id);commit();el.innerHTML=settingsHTML()}}
  return {open,settingsHTML,bindSettings}})();
