/* ================= FRIENDLY TABLE EDITOR (form view over any table JSON) ================= */
const TableEditor=(()=>{
  const HIDE=new Set(["version","tiers"]);
  const RECORD=new Set(["fantasyShare","worldBlock","sizes","locations","offers","names","typeWeightsByTier","op","genres"]);
  const LABELS={w:"Weight",wealth:"Wealth (gold ×)",jobTypes:"Job types",fantasyShare:"Fantasy share",worldBlock:"World details",patronNames:"Patron names",patronQuirks:"Patron quirks",
    goldBaseByLevel:"Job gold by party level",rarityByTier:"Incentive rarity by tier",xpBudget:"XP budget per character",fightPlan:"Fight plan",goldMult:"Gold multiplier",
    perkLabels:"Perk type labels",typeWeightsByTier:"Peddler type weights by tier",dealReasons:"Deal reasons",jobs:"Price (in jobs)",gp:"Price override (gp)",days:"Build days",
    tier:"Recommended tier",types:"Perk types (P/A/B/C)",op:"Operator",makes:"Makes (per level)",cat:"Category",s:"Skill",g:"Grade",cap:"Rarity cap",output:"Items per downtime",
    first:"First names",last:"Last names",rows:"Rows",rule:"Rule of thumb",arch:"Archetype"};
  const HINTS={jobTypes:"How often each job type appears at each tier. Bigger number = more common; 0 = never.",
    sizes:"How often each job size appears per tier, plus its gold multiplier and contribution value.",locations:"Where jobs happen, weighted per tier.",
    fantasyShare:"Share of fantasy-flavored worlds at Iron vs. Platinum (0 to 1).",genres:"World genres: weight, places, quirks, and fill-in words used in job text.",
    locales:"Home-ground locations (the city, inside the Tree, the Trunk) and their quirks.",worldBlock:"Extra world details rolled on demand.",
    patrons:"Patron categories → archetypes → which kinds of incentive each gives.",objectives:"Job text templates per job type. Words in {braces} are filled from the fill-in lists.",
    fill:"Fill-in word lists used by the {braces} in job text.",complications:"Complications that can be rolled.",goldBaseByLevel:"Gold for a Standard job (whole party), by party level.",
    rarityByTier:"Which incentive rarities each tier can roll.",items:"Incentive items by kind and rarity.",xpBudget:"XP per character for Low / Moderate / High encounters, by level.",
    grades:"Operator grades: items per downtime, rarity cap, and hire price (tier + jobs).",catalog:"Every Facility, Service, and Staff upgrade with its three levels and add-ons.",
    offers:"Peddlers: type weights per tier, discounts, vendors, one-of-a-kind upgrades, rare hires.",names:"Name parts for generated NPCs.",perkLabels:"What the perk-type letters mean.",
    rows:"Item and price, one row each.",rule:"Shown above the price table."};
  const human=k=>LABELS[k]||String(k).replace(/([a-z])([A-Z])/g,"$1 $2").replace(/^./,c=>c.toUpperCase());
  const isNum=v=>typeof v==="number",isStr=v=>typeof v==="string",isObj=v=>v&&typeof v==="object"&&!Array.isArray(v);
  const sig=v=>Array.isArray(v)?"a"+(v.length?sig(v[0]):""):isObj(v)?"o":typeof v;
  const rowLabel=(n,i)=>n===5?TIERS[i]:n===21?`Lvl ${i}`:`${i+1}`;
  function blankLike(v){if(isStr(v))return "";if(isNum(v))return 0;if(typeof v==="boolean")return false;
    if(Array.isArray(v)){if(!v.length||isStr(v[0])||isObj(v[0]))return [];return v.map(blankLike)}
    if(isObj(v)){const o={};Object.keys(v).forEach(k=>o[k]=blankLike(v[k]));return o}return null}
  const isMap=(key,o)=>{if(RECORD.has(key))return false;const ks=Object.keys(o);if(ks.length<2)return false;
    if(ks.every(k=>/^[a-z][a-zA-Z]*$/.test(k))&&Object.values(o).every(v=>!isObj(v)))return false;
    const s=sig(o[ks[0]]);return ks.every(k=>sig(o[k])===s)};
  const el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
  let changed=()=>{};

  /* a collapsible section whose body renders on first open */
  function lazy(title,count,build,open){
    const d=el("details","te-sec");d.innerHTML=`<summary>${title}${count!=null?` <span class="muted">(${count})</span>`:""}</summary>`;
    const body=el("div","te-body");d.appendChild(body);let done=false;
    const go=()=>{if(!done&&d.open){done=true;build(body)}};d.addEventListener("toggle",go);if(open){d.open=true;go()}return d}
  function input(val,set,opts={}){
    let i;
    if(opts.tier){i=el("select");TIERS.forEach((t,n)=>i.insertAdjacentHTML("beforeend",`<option value="${n}"${n===val?" selected":""}>${t}</option>`));i.onchange=()=>{set(+i.value);changed()};return i}
    if(isNum(val)){i=el("input");i.type="number";i.step="any";i.value=val;i.className="te-num";i.oninput=()=>{set(i.value===""?0:+i.value);changed()};return i}
    if(typeof val==="boolean"){i=el("input");i.type="checkbox";i.checked=val;i.onchange=()=>{set(i.checked);changed()};return i}
    const long=isStr(val)&&val.length>70;i=el(long?"textarea":"input");if(long)i.rows=2;i.value=val??"";i.className="te-txt";
    i.oninput=()=>{set(val===null&&i.value===""?null:i.value);changed()};return i}
  function rm(fn){const b=el("button","btn small","✕");b.title="Remove";b.onclick=e=>{e.preventDefault();fn();changed()};return b}
  function addBtn(label,fn){const b=el("button","btn small","＋ "+label);b.onclick=e=>{e.preventDefault();fn();changed()};return b}

  /* render one value into container; parent[key] is the value */
  function field(container,parent,key,ctx={}){
    const v=parent[key],label=ctx.label??human(key),hint=HINTS[key];
    const set=nv=>{parent[key]=nv};
    if(v===undefined)return;
    // primitives
    if(!Array.isArray(v)&&!isObj(v)){const row=el("label","te-row");row.innerHTML=`<span>${esc(label)}</span>`;row.appendChild(input(v,set,{tier:key==="tier"&&isNum(v)}));container.appendChild(row);return}
    // number list (per tier / per level)
    if(Array.isArray(v)&&v.length&&v.every(isNum)){const box=el("div","te-row");box.innerHTML=`<span>${esc(label)}</span>`;const g=el("div","te-inline");
      v.forEach((n,i)=>{const w=el("label","te-mini");w.innerHTML=`<small>${rowLabel(v.length,i)}</small>`;w.appendChild(input(n,x=>v[i]=x));g.appendChild(w)});box.appendChild(g);container.appendChild(box);return}
    // matrix of numbers or tuples of strings
    if(Array.isArray(v)&&v.length&&v.every(r=>Array.isArray(r)&&r.every(x=>isNum(x)||isStr(x)))){
      const cols=(ctx.siblings&&Array.isArray(ctx.siblings.names)&&ctx.siblings.names.length===v[0].length)?ctx.siblings.names:null;
      container.appendChild(lazy(esc(label)+(hint?` <span class="te-hint">${esc(hint)}</span>`:""),v.length,body=>{
        const draw=()=>{body.innerHTML="";const t=el("table","te-matrix");
          if(cols)t.insertAdjacentHTML("beforeend",`<tr><th></th>${cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr>`);
          v.forEach((r,i)=>{const tr=el("tr");tr.appendChild(el("th","",v.length===5||v.length===21?rowLabel(v.length,i):""));
            r.forEach((x,j)=>{const td=el("td");td.appendChild(input(x,nv=>r[j]=nv));tr.appendChild(td)});
            if(v.length!==5&&v.length!==21){const td=el("td");td.appendChild(rm(()=>{v.splice(i,1);draw()}));tr.appendChild(td)}t.appendChild(tr)});
          body.appendChild(t);if(v.length!==5&&v.length!==21)body.appendChild(addBtn("row",()=>{v.push(blankLike(v[0]));draw()}))};draw()},ctx.open));return}
    // list of strings
    if(Array.isArray(v)&&(v.length===0||v.every(isStr))){
      container.appendChild(lazy(esc(label)+(hint?` <span class="te-hint">${esc(hint)}</span>`:""),v.length,body=>{
        const draw=()=>{body.innerHTML="";v.forEach((s,i)=>{const r=el("div","te-li");r.appendChild(input(s,x=>v[i]=x));r.appendChild(rm(()=>{v.splice(i,1);draw()}));body.appendChild(r)});
          body.appendChild(addBtn("add",()=>{v.push("");draw();body.querySelectorAll("input,textarea")[v.length-1]?.focus()}))};draw()},ctx.open));return}
    // list of objects
    if(Array.isArray(v)){
      container.appendChild(lazy(esc(label)+(hint?` <span class="te-hint">${esc(hint)}</span>`:""),v.length,body=>{
        const draw=()=>{body.innerHTML="";v.forEach((o,i)=>{
          const t=o&&(o.name||o.role||o.arch||o.id)||`Item ${i+1}`;
          const sec=lazy(esc(t)+(o&&o.cat?` <span class="muted">· ${esc(o.cat)}</span>`:""),null,b=>{objFields(b,o,key);const a=el("div","actions");
            a.appendChild(addBtn("duplicate",()=>{const c=clone(o);if(c.id)c.id+="-copy";if(c.name)c.name+=" (copy)";v.splice(i+1,0,c);draw()}));a.appendChild(rm(()=>{v.splice(i,1);draw()}));b.appendChild(a)});
          body.appendChild(sec)});
          body.appendChild(addBtn("new",()=>{const n=blankLike(v[0]||{name:""});if("name" in n)n.name="New entry";if("id" in n)n.id="new-"+uid();v.push(n);draw()}))};draw()},ctx.open));return}
    // object: map (add/remove entries) or record (fixed fields)
    if(isMap(key,v)){
      container.appendChild(lazy(esc(label)+(hint?` <span class="te-hint">${esc(hint)}</span>`:""),Object.keys(v).length,body=>{
        const draw=()=>{body.innerHTML="";const simple=Object.values(v).every(x=>!isObj(x)&&!(Array.isArray(x)&&x.some(y=>isObj(y)||Array.isArray(y)))&&!(Array.isArray(x)&&x.every(isStr)&&x.length>0));
          Object.keys(v).forEach(k=>{
            if(simple){const r=el("div","te-li");field(r,v,k,{label:k});r.firstChild&&r.firstChild.classList&&r.firstChild.classList.add("grow");r.appendChild(rm(()=>{delete v[k];draw()}));body.appendChild(r)}
            else{const sec=lazy(esc(k),null,b=>{if(isObj(v[k]))objFields(b,v[k],k);else field(b,v,k,{label:"Entries",open:true});const a=el("div","actions");a.appendChild(rm(()=>{delete v[k];draw()}));b.appendChild(a)});body.appendChild(sec)}});
          const add=el("div","te-li");const nm=el("input","te-txt");nm.placeholder="New entry name";add.appendChild(nm);
          add.appendChild(addBtn("add",()=>{const k=nm.value.trim();if(!k){toast("Type a name first");return}if(k in v){toast("That name exists");return}const f=Object.values(v)[0];v[k]=f===undefined?"":blankLike(f);draw()}));body.appendChild(add)};draw()},ctx.open));return}
    container.appendChild(lazy(esc(label)+(hint?` <span class="te-hint">${esc(hint)}</span>`:""),null,b=>objFields(b,v,key),ctx.open));
  }
  function objFields(container,o,key){Object.keys(o).forEach(k=>{if(!HIDE.has(k))field(container,o,k,{siblings:o})})}
  function render(container,data,onChange){
    changed=onChange||(()=>{});container.innerHTML="";
    Object.keys(data).forEach(k=>{if(!HIDE.has(k))field(container,data,k,{siblings:data})});
  }
  return {render};
})();
