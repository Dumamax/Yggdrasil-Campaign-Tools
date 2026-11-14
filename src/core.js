/* ================= CORE: helpers, campaign state, files, AI, print ================= */
const APP_ID="yggdrasil-guild-hall", SCHEMA=5;
const TIERS=["Iron","Bronze","Silver","Gold","Platinum"];
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
function wpick(entries){const tot=entries.reduce((s,e)=>s+Math.max(0,e[1]),0);let r=Math.random()*tot;for(const [k,w] of entries){r-=Math.max(0,w);if(r<0)return k}return entries[entries.length-1][0]}
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cap=s=>String(s).charAt(0).toUpperCase()+String(s).slice(1);
const fmt=n=>Number(n||0).toLocaleString();
const uid=()=>Math.random().toString(36).slice(2,10);
const clone=o=>JSON.parse(JSON.stringify(o));
/* pickFresh: random pick that avoids recently used entries (memory saved in the campaign, so it spans sessions) */
function pickFresh(list,key,exclude){
  if(!list||!list.length)return undefined;
  const R=(C.recent=C.recent||{}),r=(R[key]=R[key]||[]),id=x=>typeof x==="string"?x:(x&&(x.name||x.arch))||JSON.stringify(x);
  const mem=Math.min(Math.floor(list.length*0.7),150);
  let pool=list.filter(x=>!r.includes(id(x))&&!(exclude&&exclude.has(id(x))));if(!pool.length)pool=list.filter(x=>!r.slice(-Math.ceil(mem/3)).includes(id(x)));if(!pool.length)pool=list;
  const v=pick(pool);r.push(id(v));while(r.length>mem)r.shift();return v}
/* mergeNew: add default content a customized table set is missing (keeps the DM's edits) */
function mergeNew(cur,def){
  if(Array.isArray(def)&&Array.isArray(cur)){const key=x=>typeof x==="string"?x:(x&&(x.id||x.name||x.arch))||JSON.stringify(x);const have=new Set(cur.map(key));def.forEach(x=>{if(!have.has(key(x)))cur.push(clone(x))});return cur}
  if(def&&typeof def==="object"&&cur&&typeof cur==="object"){Object.keys(def).forEach(k=>{if(!(k in cur))cur[k]=clone(def[k]);else if(typeof def[k]==="object")mergeNew(cur[k],def[k])});if("version" in def)cur.version=def.version;return cur}
  return cur}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove("show"),2000)}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast("Copied")}catch(e){toast("Copy blocked: select and copy manually")}}
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
const FRAMED=(()=>{try{return window.self!==window.top}catch(e){return true}})();

/* ---------- campaign state (the thing that gets saved to file) ---------- */
const DEFAULT_CP={name:"Contribution Points",short:"pts",
  stepJobs:{Iron:4,Bronze:5,Silver:6,Gold:7,Platinum:8},
  deeds:{Minor:0.5,Notable:1,Major:3,Legendary:8},
  councilBonus:50,failPct:0};
const DEFAULT_SETTINGS={cp:null,tierRank:0,partyLevel:3,partySize:4,
  mapping:{Iron:[3,5],Bronze:[6,8],Silver:[9,12],Gold:[13,16],Platinum:[17,20]},
  jobComp:30,hMin:6,hMax:8,feePct:25,offerCount:3,buildComp:10,revive:50};
function newCampaign(){return {app:APP_ID,schema:SCHEMA,savedAt:null,settings:clone(DEFAULT_SETTINGS),
  tables:{jobs:null,upgrades:null,prices:null,shops:null,npcs:null},jobs:[],shops:[],
  guild:{treasury:null,owned:{},addons:{},offers:[],uniques:[],cp:{pts:0,log:[]}},
  roster:[{id:"mordecai",name:"Mordecai",kind:"Founder",status:"In the hall",level:null,ancestry:"Changeling (currently Rat Folk)",player:"",role:"Guild founder",skills:[{s:"Guild Administration",g:"Expert"}],assign:"",notes:"Gruff, sarcastic, world-weary; care hidden under complaints. Skills are placeholders."}],
  expanded:{},recent:{}}}
/* v3: "The Trunk" was renamed "The Roots" */
function renameTrunk(c){if(!c||(c.schema||1)>=3)return c;try{return JSON.parse(JSON.stringify(c).replace(/Trunk Guides/g,"Root Guides").replace(/Trunk ferry/g,"Roots ferry").replace(/the Trunk's/g,"the Roots'").replace(/([Tt])he Trunk/g,"$1he Roots"))}catch(e){return c}}
function normalize(c){c=renameTrunk(c);const n=newCampaign();const o=Object.assign(n,c||{});
  o.settings=Object.assign(clone(DEFAULT_SETTINGS),o.settings||{});o.tables=Object.assign({jobs:null,upgrades:null,prices:null,shops:null,npcs:null},o.tables||{});o.shops=o.shops||[];o.schema=SCHEMA;
  o.guild=Object.assign({treasury:null,owned:{},addons:{},offers:[],uniques:[]},o.guild||{});
  /* v5: guild standing (points toward the next rank) */
  o.guild.cp=Object.assign({pts:0,log:[]},o.guild.cp||{});const sc=o.settings.cp||{};o.settings.cp=Object.assign(clone(DEFAULT_CP),sc,{stepJobs:Object.assign(clone(DEFAULT_CP.stepJobs),sc.stepJobs||{}),deeds:Object.assign(clone(DEFAULT_CP.deeds),sc.deeds||{})});
  o.jobs=o.jobs||[];o.roster=o.roster||[];o.expanded=o.expanded||{};o.recent=o.recent||{};return o}
let C=normalize(lsGet("ygh.campaign",null));
let S=C.settings;
let UI=Object.assign({tab:"jobs",tableMode:false,jobView:"dm",shopView:"dm",shopCat:"All",model:"claude-sonnet-5-5",print:{notices:true,ledger:true,full:false,offers:true,cards:true,roster:false,shops:true,npcs:false,council:false}},lsGet("ygh.ui",{}));
let dirty=lsGet("ygh.dirty",false);
function saveUI(){lsSet("ygh.ui",UI)}
/* undo: snapshots of C before each commit (session only) */
const UNDO=[];let lastSnap=JSON.stringify(C);
function commit(){if(!commit.open){commit.open=true;UNDO.push(lastSnap);if(UNDO.length>40)UNDO.shift();setTimeout(()=>{commit.open=false;lastSnap=JSON.stringify(C)},0)}lsSet("ygh.campaign",C);dirty=true;lsSet("ygh.dirty",true);banner();undoBtn()}
function undoBtn(){const b=$("#undoBtn");if(b)b.disabled=!UNDO.length}
function undo(){if(!UNDO.length){toast("Nothing to undo");return}const s=UNDO.pop();C=normalize(JSON.parse(s));S=C.settings;lastSnap=s;lsSet("ygh.campaign",C);dirty=true;lsSet("ygh.dirty",true);banner();undoBtn();App.reloadAll();toast("Undone")}
function replaceCampaign(c,reason){backup(reason||"Before loading a file");C=normalize(c);S=C.settings;lsSet("ygh.campaign",C);UNDO.length=0;lastSnap=JSON.stringify(C);undoBtn();App.reloadAll()}

/* tiers */
const tierOf=r=>Math.floor(r/3);
const subOf=r=>3-(r%3);
const rankName=r=>`${TIERS[tierOf(r)]} ${subOf(r)}`;
function recLevel(r){const [a,b]=S.mapping[TIERS[tierOf(r)]];return Math.round(a+(b-a)*(r%3)/2)}
function tierMidLevel(t){const [a,b]=S.mapping[TIERS[t]]||[3,5];return Math.max(1,Math.min(20,Math.round((a+b)/2)))}

/* ---------- files ---------- */
let downloads=null;
async function saveFile(filename,data,mime){
  if(FRAMED){
    if(!downloads){copyText(data);toast("Download isn't available here, so the file contents were copied instead");return false}
    try{await downloads.save({filename,data});return true}catch(e){toast("Download declined or failed");return false}
  }
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:mime||"application/json"}));a.download=filename;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);return true;
}
function stamp(){const d=new Date(),p=n=>String(n).padStart(2,"0");return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`}
/* IndexedDB: linked file handle + rolling backups (this browser only) */
const IDB=(()=>{let dbp;const db=()=>dbp||(dbp=new Promise((res,rej)=>{const r=indexedDB.open("ygh",1);
    r.onupgradeneeded=()=>{const d=r.result;d.createObjectStore("kv");d.createObjectStore("backups",{keyPath:"t"})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
  const tx=async(st,mode,fn)=>{const d=await db();return new Promise((res,rej)=>{const t=d.transaction(st,mode),r=fn(t.objectStore(st));t.oncomplete=()=>res(r&&r.result);t.onerror=()=>rej(t.error)})};
  return {get:k=>tx("kv","readonly",s=>s.get(k)),set:(k,v)=>tx("kv","readwrite",s=>s.put(v,k)),del:k=>tx("kv","readwrite",s=>s.delete(k)),
    list:()=>tx("backups","readonly",s=>s.getAll()),put:b=>tx("backups","readwrite",s=>s.put(b)),drop:t=>tx("backups","readwrite",s=>s.delete(t))}})();
const BACKUP_KEEP=25;
async function backup(reason){try{const data=JSON.stringify(C),p=C.roster.filter(m=>m.kind!=="NPC").length,n=C.roster.length-p,
    summary=`${C.jobs.length} jobs · ${p} members · ${n} NPCs · ${C.shops.length} shops · treasury ${C.guild.treasury==null?"—":fmt(C.guild.treasury)+" gp"}`;
  const L=(await IDB.list()).sort((a,b)=>a.t-b.t);if(L.length&&L[L.length-1].data===data)return;
  await IDB.put({t:Date.now(),reason,data,summary});
  for(const b of L.slice(0,Math.max(0,L.length+1-BACKUP_KEEP)))await IDB.drop(b.t)}catch(e){}}
let backupAt=lsGet("ygh.backupAt",0);
setInterval(()=>{if(dirty&&Date.now()-backupAt>5*60e3){backupAt=Date.now();lsSet("ygh.backupAt",backupAt);backup("Auto (every 5 min of changes)")}},60e3);
/* linked campaign file (Chrome / Edge): pick once, then Save overwrites it */
const FS_OK=!FRAMED&&!!window.showSaveFilePicker;
let fileHandle=null;
const FILE_TYPES=[{description:"Guild Hall campaign",accept:{"application/json":[".json"]}}];
async function linkHandle(h){fileHandle=h;try{await IDB.set("fileHandle",h)}catch(e){}banner()}
async function unlinkFile(){fileHandle=null;try{await IDB.del("fileHandle")}catch(e){}banner();App.render();toast("Unlinked: Save will ask where to save next time")}
async function writeHandle(h,text){if((await h.queryPermission({mode:"readwrite"}))!=="granted"&&(await h.requestPermission({mode:"readwrite"}))!=="granted")throw new Error("permission");
  const w=await h.createWritable();await w.write(text);await w.close()}
function markSaved(msg){dirty=false;lsSet("ygh.dirty",false);lsSet("ygh.campaign",C);banner();toast(msg);backup("Saved to file");if(typeof App!=="undefined")App.render()}
async function saveCampaign(asNew){
  if(!isDM())return;
  C.savedAt=new Date().toISOString();
  if(Sync.canPush()&&asNew!==true&&asNew!=="file"){try{const ok=await Sync.push();if(ok)markSaved("Saved to GitHub");return}catch(e){Sync.setStatus("GitHub save failed");if(await ask("Could not save to GitHub",esc(e.message)+". Your changes are still safe in this browser. Settings → GitHub saves → <b>Check my token</b> shows the cause.",["Save a file instead","Cancel"])!==0)return}}
  const text=JSON.stringify(C,null,1);
  if(FS_OK){
    try{if(fileHandle&&!asNew){await writeHandle(fileHandle,text);markSaved(`Saved to ${fileHandle.name}`);return}}
    catch(e){toast(`Couldn't write ${fileHandle.name}; choose where to save`)}
    try{const h=await showSaveFilePicker({suggestedName:"yggdrasil-campaign.json",types:FILE_TYPES});await writeHandle(h,text);await linkHandle(h);markSaved(`Saved to ${h.name}. Ctrl+S updates this file from now on`)}
    catch(e){if(e.name!=="AbortError")toast("Save failed: "+e.message)}
    return}
  const ok=await saveFile(`yggdrasil-campaign-${stamp()}.json`,text);
  if(ok)markSaved("Campaign saved to file");
}
async function openCampaign(){
  if(!FS_OK){$("#fileIn").click();return}
  try{const [h]=await showOpenFilePicker({types:FILE_TYPES});const d=JSON.parse(await (await h.getFile()).text());
    importData(d);if(d&&d.app===APP_ID){await linkHandle(h);toast(`Loaded ${h.name}. Save updates this file`)}}
  catch(e){if(e.name!=="AbortError")toast(e instanceof SyntaxError?"That file isn't valid JSON":"Couldn't open: "+e.message)}}
(async()=>{if(FS_OK)try{fileHandle=(await IDB.get("fileHandle"))||null;banner()}catch(e){}})();
function loadCampaignFile(file){
  const r=new FileReader();
  r.onload=()=>{try{importData(JSON.parse(r.result))}catch(e){toast("That file isn't valid JSON")}};
  r.readAsText(file);
}
function importData(d){
  if(d&&d.app===APP_ID){if(fileHandle){fileHandle=null;IDB.del("fileHandle").catch(()=>{})}replaceCampaign(d);dirty=false;lsSet("ygh.dirty",false);banner();toast("Campaign loaded");return}
  if(d&&d.source==="job-board"){ // export from the old standalone Job Board
    const have=new Set(C.jobs.map(h=>h.id));(d.hooks||[]).forEach(h=>{if(!have.has(h.id))C.jobs.push(h)});
    if(d.settings){["tierRank","partyLevel","partySize","mapping","hMin","hMax"].forEach(k=>{if(d.settings[k]!=null)S[k]=d.settings[k]});if(d.settings.compChance!=null)S.jobComp=d.settings.compChance}
    if(d.tables&&JSON.stringify(d.tables)!==JSON.stringify(DEFAULT_JOB_TABLES))C.tables.jobs=d.tables;
    commit();App.reloadAll();toast(`Imported ${(d.hooks||[]).length} Job Board hooks`);return}
  if(d&&(d.guild||d.roster)){ // export from the old Upgrade Chart
    if(d.guild)C.guild=Object.assign(C.guild,d.guild);
    if(Array.isArray(d.roster)){const ids=new Set(C.roster.map(m=>m.id));d.roster.forEach(m=>{if(!ids.has(m.id))C.roster.push(m)})}
    commit();App.reloadAll();toast("Imported Upgrade Chart data");return}
  toast("Didn't recognize that file");
}
function banner(){
  const b=$("#banner");if(!b)return;
  b.classList.toggle("show",dirty);
  $("#bannerText").textContent=Sync.canPush()?"Unsaved changes. Ctrl+S saves them to GitHub so everyone gets them.":fileHandle?`Unsaved changes. Ctrl+S saves them to ${fileHandle.name}.`:C.savedAt?`Unsaved changes since your last campaign file (${new Date(C.savedAt).toLocaleString()}).`:"This campaign hasn't been saved to a file yet.";
  const s=$("#saveCamp");if(s)s.title=fileHandle?`Save to ${fileHandle.name} (Ctrl+S)`:"Save Campaign (Ctrl+S)";
}
document.addEventListener("click",e=>$$("details.more[open]").forEach(d=>{if(!d.contains(e.target))d.open=false}));
window.addEventListener("keydown",e=>{if(!(e.ctrlKey||e.metaKey)||e.altKey||!isDM())return;const k=e.key.toLowerCase();
  if(k==="s"){e.preventDefault();saveCampaign()}
  else if(k==="z"&&!e.shiftKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||"")){e.preventDefault();undo()}});
window.addEventListener("beforeunload",e=>{if(dirty&&!FRAMED){e.preventDefault();e.returnValue=""}});

/* ---------- AI: Claude-in-artifact, API key, or copy/paste ---------- */
const AI={
  sample:null,
  key(){return lsGet("ygh.apikey","")},
  mode(){return this.sample?"claude":this.key()?"api":"none"},
  label(){return {claude:"Claude: built in",api:"Claude: API key",none:"Claude: copy/paste"}[this.mode()]},
  parse(text){let t=String(text).trim().replace(/^```(?:json)?\s*/i,"").replace(/```\s*$/,"");const a=t.indexOf("{"),b=t.lastIndexOf("}");if(a<0||b<a)throw new Error("No JSON found");return JSON.parse(t.slice(a,b+1))},
  async json(prompt,pdfBase64){
    if(this.sample&&!pdfBase64)return await this.sample.json(prompt,{modelTier:"default"});
    const key=this.key(); if(!key){const e=new Error("no-ai");e.noai=true;throw e}
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:UI.model||"claude-sonnet-5-5",max_tokens:4000,system:"You write prep material for a D&D 5e campaign. Reply with only valid JSON, no prose or code fences.",messages:[{role:"user",content:pdfBase64?[{type:"document",source:{type:"base64",media_type:"application/pdf",data:pdfBase64}},{type:"text",text:prompt}]:prompt}]})});
    const data=await res.json().catch(()=>({}));
    if(!res.ok)throw new Error(data?.error?.message||`API error ${res.status}`);
    return this.parse((data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join(""));
  }
};
/* run(): try AI; on no AI or failure, apply the fallback and keep the prompt so the DM can copy/paste it */
async function aiRun({prompt,fallback,apply,btn}){
  if(btn){btn.innerHTML='<span class="spin">✦</span> Writing…';btn.disabled=true}
  try{const r=await AI.json(prompt);apply(Object.assign({ai:true},r))}
  catch(e){apply(Object.assign(fallback,{prompt,note:e.noai?"Basic card from the tables. Copy the Claude prompt, run it in Claude, and paste the result to upgrade it.":`Claude couldn't write this one (${e.message}). Basic card filled in; you can copy the prompt and paste a result.`}))}
}
/* small paste box used by cards; calls onApply(obj) */
function pasteBox(onApply){
  const d=document.createElement("div");d.className="paste";
  d.innerHTML=`<textarea placeholder="Paste Claude's JSON reply here"></textarea><div class="actions"><button class="btn small primary">Apply</button><button class="btn small">Cancel</button></div>`;
  const [ok,cancel]=d.querySelectorAll("button");
  ok.onclick=()=>{try{onApply(Object.assign({ai:true},AI.parse(d.querySelector("textarea").value)))}catch(e){toast("Couldn't read that: "+e.message)}};
  cancel.onclick=()=>d.remove();
  return d;
}
function aiButtons(x,onApply){ // returns element with Copy prompt / Paste result when x has a prompt
  const w=document.createElement("span");if(!x||!x.prompt)return w;
  w.innerHTML=`<button class="btn small">Copy Claude prompt</button> <button class="btn small">Paste result</button>`;
  const [cp,ps]=w.querySelectorAll("button");
  cp.onclick=()=>copyText(x.prompt);
  ps.onclick=()=>{const card=w.closest(".card");if(card.querySelector(".paste"))return;card.appendChild(pasteBox(onApply))};
  return w;
}

/* ---------- printing ---------- */
const FONT_LINK=`<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&display=swap" rel="stylesheet">`;
async function printHTML(title,body,css){
  if(FRAMED){ // sandboxed (artifact): browser print is blocked, so hand over a print-ready file
    const doc=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(title)}</title>${FONT_LINK}<style>body{margin:18px;background:#fff}@page{margin:12mm}${css}</style></head><body>${body}<script>window.onload=()=>setTimeout(()=>print(),600)<\/script></body></html>`;
    if(await saveFile(title.toLowerCase().replace(/[^a-z0-9]+/g,"-")+".html",doc,"text/html"))toast("Saved a printable page: open it to print");
    return;
  }
  const pa=$("#printArea");pa.innerHTML=`<style>${css}</style>${body}`;
  document.body.classList.add("printing");
  const done=()=>{document.body.classList.remove("printing");pa.innerHTML="";window.removeEventListener("afterprint",done)};
  window.addEventListener("afterprint",done);
  setTimeout(()=>{window.print();setTimeout(done,1500)},150);
}
