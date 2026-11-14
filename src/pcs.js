/* ===== PCs: play stats + portraits for Table Mode character cards =====
   Stored on the roster member as m.pc = {stats:{str..cha}, ac, hp, speed, init (null = Dex), saves:[ab], senses, resist, langs,
   spell:{ab, dc, atk} (dc/atk blank = auto), attacks (text, one per line "Name | +5 | 1d8+3 slashing"), features (text, one per line), portrait (data URL or URL)}.
   Nothing about personality or background lives here; that stays in notes. */
const PCs=(()=>{
  const AB=["str","dex","con","int","wis","cha"],ABN={str:"STR",dex:"DEX",con:"CON",int:"INT",wis:"WIS",cha:"CHA"};
  const SKILLS=[["Acrobatics","dex"],["Animal Handling","wis"],["Arcana","int"],["Athletics","str"],["Deception","cha"],["History","int"],["Insight","wis"],["Intimidation","cha"],["Investigation","int"],["Medicine","wis"],["Nature","int"],["Perception","wis"],["Performance","cha"],["Persuasion","cha"],["Religion","int"],["Sleight of Hand","dex"],["Stealth","dex"],["Survival","wis"]];
  const SK=Object.fromEntries(SKILLS.map(([n,a])=>[n.toLowerCase(),a]));
  const isPC=m=>m.kind==="Active PC";
  const P=m=>m.pc||{};
  const has=m=>{const s=P(m).stats;return !!s&&AB.some(a=>s[a]!=null&&s[a]!=="")};
  const score=(m,a)=>{const v=P(m).stats?.[a];return v==null||v===""?10:+v};
  const mod=(m,a)=>Math.floor((score(m,a)-10)/2);
  const pb=m=>2+Math.floor(((+m.level||1)-1)/4);
  const sg=n=>(n>=0?"+":"")+n;
  function prof(m,name){const k=(m.skills||[]).find(s=>String(s.s).toLowerCase()===name.toLowerCase());if(!k)return 0;return /^(exp|expert|master)$/i.test(k.g)?2:/^novice$/i.test(k.g)?0:1}
  const skill=(m,name)=>mod(m,SK[name.toLowerCase()])+prof(m,name)*pb(m);
  const save=(m,a)=>mod(m,a)+((P(m).saves||[]).includes(a)?pb(m):0);
  const passive=(m,name)=>10+skill(m,name);
  const init=m=>P(m).init!=null&&P(m).init!==""?+P(m).init:mod(m,"dex");
  function spell(m){const s=P(m).spell||{};if(!s.ab)return null;return {ab:s.ab,dc:s.dc||8+pb(m)+mod(m,s.ab),atk:s.atk||pb(m)+mod(m,s.ab)}}
  /* "40 ft, climb 40 ft" → walk 40 (chip) + extras "climb 40 ft" (shown as a note) */
  const walk=m=>{const s=String(P(m).speed||"30"),n=s.match(/\d+/);return n?n[0]:s};
  const moves=m=>{const s=String(P(m).speed||""),i=s.search(/[,;]/);return i<0?"":s.slice(i+1).trim()};
  const lines=t=>String(t||"").split("\n").map(x=>x.trim()).filter(Boolean);
  const attacks=m=>lines(P(m).attacks).map(l=>{const [n,h,d]=l.split("|").map(x=>x.trim());return {n,h:h||"",d:d||""}});
  const tools=m=>(m.skills||[]).filter(s=>!SK[String(s.s).toLowerCase()]).map(s=>s.s+(/^(exp|expert|master)$/i.test(s.g)?" (expertise)":""));
  const initials=n=>String(n||"?").split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase();
  const pic=(m,cls)=>P(m).portrait?`<img class="${cls}" src="${esc(P(m).portrait)}" alt="">`:`<div class="${cls} pc-noimg">${esc(initials(m.name))}</div>`;
  const list=()=>Roster.sorted().filter(isPC).filter(m=>m.status!=="Left");

  /* ---------- Table Mode ---------- */
  function cardHTML(m){const p=P(m);
    return `<button class="pc-card" data-pc="${m.id}">${pic(m,"pc-pic")}
      <div class="pc-body"><div class="pc-name">${esc(m.name)}</div><div class="pc-sub">Lv ${m.level||"?"} ${esc(m.ancestry||"")}${m.player?` · ${esc(m.player)}`:""}</div>
      ${has(m)?`<div class="pc-chips"><span><b>${p.ac||"—"}</b>AC</span><span><b>${p.hp||"—"}</b>HP</span><span><b>${sg(init(m))}</b>Init</span><span><b>${esc(walk(m))}</b>Speed</span></div>
      <div class="pc-abs">${AB.map(a=>`<span class="${(p.saves||[]).includes(a)?"sv":""}"><i>${ABN[a]}</i>${sg(mod(m,a))}</span>`).join("")}</div>
      <div class="pc-pass">Passive Perception <b>${passive(m,"Perception")}</b> · Insight <b>${passive(m,"Insight")}</b> · Investigation <b>${passive(m,"Investigation")}</b></div>
      ${p.senses||p.resist||moves(m)?`<div class="pc-note">${esc([moves(m)&&moves(m)[0].toUpperCase()+moves(m).slice(1),p.senses,p.resist&&("Resist: "+p.resist)].filter(Boolean).join(" · "))}</div>`:""}`
      :`<div class="pc-note">No play stats yet: Roster → Edit → Play stats.</div>`}</div></button>`}
  function bigHTML(m){const p=P(m),sp=spell(m),at=attacks(m),ft=lines(p.features),tl=tools(m);
    return `<div class="pc-big"><div class="pc-tools"><button class="btn small" data-edit>✎ Edit stats</button><button class="btn ghost" data-close aria-label="Close">✕</button></div>
      <div class="pc-big-head">${pic(m,"pc-bigpic")}<div><h2>${esc(m.name)}</h2><div class="pc-sub">Level ${m.level||"?"} ${esc(m.ancestry||"")}${m.player?` · played by ${esc(m.player)}`:""}</div>
        <div class="pc-chips big"><span><b>${p.ac||"—"}</b>AC</span><span><b>${p.hp||"—"}</b>Max HP</span><span><b>${sg(init(m))}</b>Initiative</span><span><b>${esc(walk(m))} ft</b>Speed</span><span><b>${sg(pb(m))}</b>Prof.</span>${sp?`<span><b>${sp.dc}</b>Spell DC</span><span><b>${sg(sp.atk)}</b>Spell atk</span>`:""}</div></div></div>
      <div class="pc-grid">
        <section><h3>Abilities</h3><table class="pc-tab"><tr><th></th><th>Score</th><th>Mod</th><th>Save</th></tr>${AB.map(a=>`<tr><td>${ABN[a]}</td><td>${score(m,a)}</td><td><b>${sg(mod(m,a))}</b></td><td class="${(p.saves||[]).includes(a)?"sv":""}">${sg(save(m,a))}</td></tr>`).join("")}</table>
          <h3>Passives</h3><div class="pc-pass">Perception <b>${passive(m,"Perception")}</b> · Insight <b>${passive(m,"Insight")}</b> · Investigation <b>${passive(m,"Investigation")}</b></div></section>
        <section class="pc-sk"><h3>Skills</h3><div class="pc-skills">${SKILLS.map(([n,a])=>{const pr=prof(m,n);return `<span class="${pr?"on":""}${pr===2?" exp":""}">${n} <i>${ABN[a]}</i><em class="lead"></em><b>${sg(skill(m,n))}</b></span>`}).join("")}</div></section>
        ${at.length?`<section><h3>Attacks</h3><table class="pc-tab">${at.map(x=>`<tr><td><b>${esc(x.n)}</b></td><td>${esc(x.h)}</td><td>${esc(x.d)}</td></tr>`).join("")}</table></section>`:""}
        ${ft.length?`<section><h3>Features &amp; abilities</h3><ul class="pc-feat">${ft.map(f=>`<li>${esc(f)}</li>`).join("")}</ul></section>`:""}
        <section><h3>Other</h3>${[["Movement",moves(m)&&p.speed],["Senses",p.senses],["Resistances",p.resist],["Languages",p.langs],["Tools",tl.join(", ")],["In the guild",[m.status,m.assign&&("operating "+Roster.assignName(m))].filter(Boolean).join(" · ")]].filter(x=>x[1]).map(([k,v])=>`<div class="row"><b>${k}:</b> ${esc(v)}</div>`).join("")||'<p class="muted">Nothing else recorded.</p>'}</section>
      </div></div>`}
  function tableSection(){const d=document.createElement("section");d.className="pc-section";const L=list();
    d.innerHTML=`<h2 class="pc-title">Characters</h2>${L.length?`<div class="pc-cards">${L.map(cardHTML).join("")}</div>`:'<p class="muted">Add the party in Roster → Guild Members (type Active PC) and fill in their play stats.</p>'}`;
    d.onclick=e=>{const b=e.target.closest("[data-pc]");if(!b)return;const m=C.roster.find(x=>x.id===b.dataset.pc);if(m)openBig(m)};
    return d}
  /* full card, with in-place editing of play stats (and level) during play */
  function openBig(m){const md=modal(bigHTML(m),"pc-modal"),box=md.el.querySelector(".qs-box");let d=null;
    const form=()=>editorHTML(d).replace('<details class="pc-edit"','<details class="pc-edit" open');
    const view=()=>{d=null;box.innerHTML=bigHTML(m);box.scrollTop=0};
    const edit=()=>{d=clone(m);d.pc=d.pc||{};
      box.innerHTML=`<div class="pc-big"><div class="pc-tools"><button class="btn ghost" data-close aria-label="Close">✕</button></div><h2>Edit ${esc(m.name)}</h2>
        <div class="grid" style="margin:10px 0;max-width:420px"><label>Level <input type="number" min="1" max="20" data-lvl value="${esc(m.level??"")}"></label></div>
        <div id="pcEdM">${form()}</div>
        <div class="actions pc-edit-bar"><button class="btn primary" data-save>Save changes</button><button class="btn" data-cancel>Cancel</button><span class="muted">Skills, tools and notes: Roster → Edit.</span></div></div>`;
      const host=box.querySelector("#pcEdM");bindEditor(host,d,()=>{host.innerHTML=form()});
      box.querySelector("[data-lvl]").oninput=e=>{d.level=e.target.value?+e.target.value:null};box.scrollTop=0};
    box.addEventListener("click",e=>{
      if(e.target.closest("[data-close]")){if(d&&JSON.stringify(d.pc)!==JSON.stringify(m.pc||{})&&!confirmLeave(e.target.closest("[data-close]")))return;md.close()}
      else if(e.target.closest("[data-edit]"))edit();
      else if(e.target.closest("[data-cancel]"))view();
      else if(e.target.closest("[data-save]")){m.pc=d.pc;m.level=d.level;commit();App.render();view();toast(`${m.name} updated`)}})}
  function confirmLeave(b){if(b.dataset.sure)return true;b.dataset.sure=1;b.textContent="Discard?";b.classList.add("danger");return false}

  /* ---------- Roster editor ---------- */
  function editorHTML(m){if(!/^(Active|Retired) PC$/.test(m.kind))return "";const p=P(m);
    return `<details class="pc-edit"${has(m)?"":" open"}><summary><b>Play stats</b> <span class="muted">for the Table Mode character card</span></summary>
      <div class="pc-edit-top"><div class="pc-portrait">${pic(m,"pc-pic")}<div class="actions"><label class="btn small">Upload portrait<input type="file" accept="image/*" data-pcimg hidden></label>${p.portrait?'<button class="btn small ghost" data-pcnoimg>Remove</button>':""}</div>
        <input data-pc="portraitUrl" placeholder="…or paste an image link" value="${p.portrait&&!p.portrait.startsWith("data:")?esc(p.portrait):""}"></div>
        <div class="grid">${AB.map(a=>`<label>${ABN[a]} <input type="number" min="1" max="30" data-pcs="${a}" value="${esc(p.stats?.[a]??"")}"></label>`).join("")}
          <label>AC <input type="number" data-pc="ac" value="${esc(p.ac??"")}"></label><label>Max HP <input type="number" data-pc="hp" value="${esc(p.hp??"")}"></label>
          <label class="wide">Speed <input data-pc="speed" value="${esc(p.speed??"")}" placeholder="30 ft"></label><label>Initiative <input type="number" data-pc="init" value="${esc(p.init??"")}" placeholder="Dex mod"></label></div></div>
      <div class="actions"><span class="muted">Saving throws</span>${AB.map(a=>`<label class="inline"><input type="checkbox" data-pcsave="${a}"${(p.saves||[]).includes(a)?" checked":""}> ${ABN[a]}</label>`).join("")}</div>
      <div class="grid"><label>Spellcasting ability <select data-pcsp="ab"><option value="">— none —</option>${AB.slice(3).map(a=>`<option value="${a}"${p.spell?.ab===a?" selected":""}>${ABN[a]}</option>`).join("")}</select></label>
        <label>Senses <input data-pc="senses" value="${esc(p.senses||"")}" placeholder="Darkvision 60 ft"></label><label>Resistances <input data-pc="resist" value="${esc(p.resist||"")}"></label><label>Languages <input data-pc="langs" value="${esc(p.langs||"")}"></label></div>
      <label>Attacks <span class="muted">(one per line: Name | to hit | damage)</span><textarea data-pc="attacks" rows="3" placeholder="Longsword | +5 | 1d8+3 slashing">${esc(p.attacks||"")}</textarea></label>
      <label>Features the DM should know at the table <span class="muted">(one per line, no backstory)</span><textarea data-pc="features" rows="4" placeholder="Rage (3/long rest): resistance to bludgeoning, piercing, slashing&#10;Lucky (3/long rest)">${esc(p.features||"")}</textarea></label>
      <p class="hint">Skill and save bonuses, passives and spell DC are worked out from these, the level, and the skills list above.</p></details>`}
  function bindEditor(host,m,rerender){
    host.addEventListener("input",e=>{const t=e.target;if(!t.closest(".pc-edit"))return;const p=m.pc=m.pc||{};
      if(t.dataset.pcs){(p.stats=p.stats||{})[t.dataset.pcs]=t.value===""?null:+t.value}
      else if(t.dataset.pc==="portraitUrl"){p.portrait=t.value.trim()||null}
      else if(t.dataset.pc){p[t.dataset.pc]=t.type==="number"?(t.value===""?null:+t.value):t.value}
      else if(t.dataset.pcsp){(p.spell=p.spell||{})[t.dataset.pcsp]=t.value}});
    host.addEventListener("change",async e=>{const t=e.target;if(!t.closest(".pc-edit"))return;const p=m.pc=m.pc||{};
      if(t.dataset.pcsave){const s=new Set(p.saves||[]);t.checked?s.add(t.dataset.pcsave):s.delete(t.dataset.pcsave);p.saves=AB.filter(a=>s.has(a))}
      else if(t.dataset.pcsp){(p.spell=p.spell||{})[t.dataset.pcsp]=t.value}
      else if(t.dataset.pcimg!=null&&t.files[0]){try{p.portrait=await shrink(t.files[0]);rerender()}catch(err){toast("Couldn't read that image")}}});
    host.addEventListener("click",e=>{if(e.target.dataset.pcnoimg!=null){e.preventDefault();m.pc.portrait=null;rerender()}})}
  /* downscale to keep the campaign file small (portraits travel inside it, so they reach GitHub with each save) */
  function shrink(file,max=320,q=0.82){return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const img=new Image();img.onerror=rej;img.onload=()=>{
    const k=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement("canvas");c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
    const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",q))};img.src=r.result};r.readAsDataURL(file)})}

  /* ---------- import (Guild Hall Import Format) ---------- */
  function fromImport(x){const st=x.stats||x.abilities||null,o={};
    if(st){o.stats={};AB.forEach(a=>{const v=st[a]??st[a.toUpperCase()]??st[{str:"strength",dex:"dexterity",con:"constitution",int:"intelligence",wis:"wisdom",cha:"charisma"}[a]];if(v!=null)o.stats[a]=+v})}
    ["ac","hp","init"].forEach(k=>{if(x[k]!=null)o[k]=+x[k]});if(x.speed)o.speed=String(x.speed);
    if(x.saves)o.saves=x.saves.map(s=>String(s).toLowerCase().slice(0,3)).filter(a=>AB.includes(a));
    if(x.senses)o.senses=String(x.senses);if(x.resistances||x.resist)o.resist=String(x.resistances||x.resist);if(x.languages)o.langs=[].concat(x.languages).join(", ");
    const sp=x.spellcasting||x.spell;if(sp)o.spell={ab:String(sp.ability||sp.ab||"").toLowerCase().slice(0,3),dc:sp.dc?+sp.dc:null,atk:sp.attack!=null?+String(sp.attack).replace("+",""):null};
    if(x.attacks)o.attacks=x.attacks.map(a=>typeof a==="string"?a:[a.name,a.hit??a.toHit??a.bonus,a.damage??a.dmg].filter(v=>v!=null&&v!=="").join(" | ")).join("\n");
    if(x.features)o.features=x.features.map(f=>typeof f==="string"?f:[f.name,f.text||f.desc].filter(Boolean).join(": ")).join("\n");
    if(x.portrait)o.portrait=String(x.portrait);
    return Object.keys(o).length?o:null}

  return {shrink,tableSection,editorHTML,bindEditor,fromImport,list};
})();
