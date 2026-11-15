/* ===== Player View / DM View + GitHub sync =====
   Player View (default): read-only handouts, no editing, no secrets on screen. DM View: unlocked per browser with the DM password
   (hash kept in the campaign as S.dmHash; this browser remembers the hash it unlocked with in ygh.dm). Casual-snooping protection only.
   GitHub sync: the campaign file lives in the repo (data/campaign.json). Everyone pulls it automatically; a DM browser with a
   GitHub token (ygh.ghtoken, never in the campaign) saves by committing it. */
const BUILD="/*BUILD*/";
const whenStr=s=>s?new Date(s).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}):"never";
/* hosted copy only: phones keep old tabs/caches, so compare our BUILD with the live file and reload into the new one */
const Updater=(()=>{const live=location.protocol==="https:"&&/github\.io$/.test(location.hostname)&&!FRAMED;let lastCheck=0;
  async function check(){if(!live||Date.now()-lastCheck<10*60e3)return;lastCheck=Date.now();
    try{const t=await (await fetch(location.pathname+"?u="+Date.now(),{cache:"no-store"})).text();const m=t.match(/const BUILD="([^"]+)"/);
      if(!m||m[1]===BUILD||m[1].startsWith("/*"))return;
      if(dirty&&isDM()){toast("A newer version of the app is ready: save, then reload");return}
      persistNow();location.replace(location.pathname+"?v="+encodeURIComponent(m[1])+location.hash)}catch(e){}}
  function start(){check();document.addEventListener("visibilitychange",()=>{if(!document.hidden)check()});setInterval(()=>{if(!document.hidden)check()},30*60e3)}
  return {start,check}})();
const SYNC_DEF={repo:"Dumamax/Yggdrasil-Campaign-Tools",branch:"main",path:"data/campaign.json"};
async function hashPw(pw){const s="ygh-dm:"+pw;
  try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
  catch(e){let h=5381;for(const c of s)h=(h*33^c.charCodeAt(0))>>>0;return "d"+h.toString(16)}}
const unlocked=()=>!!S.dmHash&&lsGet("ygh.dm",null)===S.dmHash;
const isDM=()=>unlocked()&&!UI.preview;
/* Player View from DM View is just a preview: this browser stays unlocked, so DM View comes back without the password */
function previewPlayer(){UI.preview=true;UI.tab="p-board";saveUI();App.render();toast("Player View (DM View is one tap away)")}
function backToDM(){UI.preview=false;UI.tab="jobs";saveUI();App.render()}
function lockDM(){lsSet("ygh.dm",null);UI.preview=false;UI.tab="p-board";saveUI();App.render();toast("Locked: this browser will ask for the password again")}

/* small modal helper: returns {el,close} */
function modal(html,cls=""){const w=document.createElement("div");w.className="qs";w.innerHTML=`<div class="qs-box modal ${cls}">${html}</div>`;document.body.appendChild(w);
  const close=()=>w.remove();w.addEventListener("click",e=>{if(e.target===w)close()});w.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
  setTimeout(()=>w.querySelector("input,button")?.focus(),30);return {el:w,close}}
function ask(title,msg,buttons){return new Promise(res=>{const m=modal(`<h2>${esc(title)}</h2><p>${msg}</p><div class="actions">${buttons.map((b,i)=>`<button class="btn${i===0?" primary":""}" data-i="${i}">${esc(b)}</button>`).join("")}</div>`);
  m.el.addEventListener("click",e=>{const i=e.target.dataset.i;if(i==null)return;m.close();res(+i)})})}

function dmGate(){
  const first=!S.dmHash;
  const m=modal(`<h2>${first?"Set a DM password":"DM View"}</h2>
    <p class="muted">${first?"DM View shows secrets and lets you edit everything. Pick a password to keep players from wandering in; this browser stays unlocked until you lock it.":"Enter the DM password. This browser stays unlocked until you switch back to Player View."}</p>
    <form><input type="password" name="pw" placeholder="Password" autocomplete="current-password" required>${first?'<input type="password" name="pw2" placeholder="Repeat password" required>':""}
    <div class="actions"><button class="btn primary">${first?"Set password & unlock":"Unlock"}</button><button type="button" class="btn ghost" data-x>Cancel</button></div><p class="muted" id="gateMsg"></p></form>`);
  m.el.querySelector("[data-x]").onclick=m.close;
  m.el.querySelector("form").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),pw=f.get("pw");
    if(first){if(pw!==f.get("pw2")){$("#gateMsg").textContent="Passwords don't match.";return}S.dmHash=await hashPw(pw);commit()}
    else if(await hashPw(pw)!==S.dmHash){$("#gateMsg").textContent="That's not it.";e.target.pw.select();return}
    lsSet("ygh.dm",S.dmHash);m.close();UI.preview=false;UI.tab="jobs";saveUI();App.render();toast(first?"Password set. Save so it travels with the campaign":"DM View unlocked")}}

const Sync=(()=>{
  const cfg=()=>Object.assign({},SYNC_DEF,lsGet("ygh.sync",{}));
  const token=()=>lsGet("ygh.ghtoken","")||"";
  let sha=lsGet("ygh.sha",null),remoteAt=null,last=null,status="",busy=false;
  const api=(withRef)=>{const c=cfg();return `https://api.github.com/repos/${c.repo}/contents/${c.path.split("/").map(encodeURIComponent).join("/")}${withRef?`?ref=${encodeURIComponent(c.branch)}`:""}`};
  const hdr=raw=>{const h={Accept:raw?"application/vnd.github.raw+json":"application/vnd.github+json"};if(token())h.Authorization="Bearer "+token();return h};
  const enc=s=>{const b=new TextEncoder().encode(s);let o="";for(let i=0;i<b.length;i+=0x8000)o+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));return btoa(o)};
  const dec=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,"")),c=>c.charCodeAt(0)));
  const canPush=()=>isDM()&&!!token();
  function setStatus(s){if(s==="Up to date"&&C.savedAt)s+=` · save from ${whenStr(C.savedAt)}`;status=s;const b=$("#syncBtn");if(b){b.title=s+" (click to check now)";b.querySelector(".lbl").textContent=s}}
  async function fetchRemote(skipIfSha){const r=await fetch(api(true),{headers:hdr(),cache:"no-cache"});
    if(r.status===404)return {missing:true};if(!r.ok)throw new Error(r.status===401?"GitHub token was refused":r.status===403||r.status===429?"GitHub is busy (too many checks from this network); retrying shortly":"GitHub error "+r.status);
    const j=await r.json();if(skipIfSha&&j.sha===skipIfSha)return {sha:j.sha,same:true};let text;
    /* big files: download the blob by sha. The contents URL serves both the metadata and the raw file under one ETag, and phone caches could hand back the metadata as "the campaign" */
    if(j.content&&j.encoding==="base64")text=dec(j.content);
    else{const b=await fetch(`https://api.github.com/repos/${cfg().repo}/git/blobs/${j.sha}`,{headers:hdr(true)});if(!b.ok)throw new Error("GitHub error "+b.status+" downloading the save");text=await b.text()}
    let data;try{data=JSON.parse(text)}catch(e){throw new Error("The GitHub save didn't download completely")}
    if(!data||data.app!==APP_ID)throw new Error("Downloaded something that isn't the campaign");
    return {sha:j.sha,data}}
  function adopt(r,msg){const wasDM=isDM();replaceCampaign(r.data,"Before loading the GitHub save");sha=r.sha;lsSet("ygh.sha",sha);lsSet("ygh.shaAt",C.savedAt);dirty=false;lsSet("ygh.dirty",false);banner();
    if(wasDM&&!isDM())lsSet("ygh.dm",S.dmHash); // a password change elsewhere shouldn't lock out a DM mid-session
    if(msg)toast(msg)}
  async function pull(manual){if(busy)return;busy=true;try{
      const fresh=sha&&C.savedAt&&C.savedAt===lsGet("ygh.shaAt",null);const r=await fetchRemote(fresh?sha:null);last=Date.now();if(!r.missing&&!r.same)remoteAt=r.data.savedAt;else if(r.same)remoteAt=C.savedAt;
      if(r.missing){setStatus(isDM()?(canPush()?"Not on GitHub yet: press Save":"Not on GitHub yet"):"Nothing published yet");return}
      if(r.same||r.sha===sha&&C.savedAt===r.data.savedAt){if(!r.same)lsSet("ygh.shaAt",C.savedAt);setStatus("Up to date");if(manual)toast("Already up to date");return}
      if(!isDM()){adopt(r,sha?"Updated with the DM's latest save":"");setStatus("Up to date");return}
      const localEmpty=!C.savedAt&&!C.jobs.length&&!C.guild.cp.log.length;
      if(sha&&!dirty||localEmpty){adopt(r,"Loaded the latest save from GitHub");setStatus("Up to date");return}
      const i=await choose(r,"Newer save on GitHub");
      if(i===0){adopt(r,"Loaded the GitHub version");setStatus("Up to date")}
      else{sha=r.sha;lsSet("ygh.sha",sha);dirty=true;lsSet("ygh.dirty",true);banner();setStatus("Your copy differs");if(i===1&&canPush()){busy=false;await saveCampaign()}}
    }catch(e){setStatus(navigator.onLine===false?"Offline":"Can't reach GitHub");if(manual)toast(e.message)}finally{busy=false}}
  /* both copies side by side; 0 = use GitHub's, 1 = save mine to GitHub now, 2 = decide later */
  function choose(r,title){const gh=r?.data?.savedAt?whenStr(r.data.savedAt):"unknown time",mine=whenStr(C.savedAt);
    return ask(title,`<b>On GitHub:</b> saved ${esc(gh)}<br><b>On this device:</b> ${C.savedAt?`from the ${esc(mine)} save`:"never saved"}${dirty?" + unsaved changes":""}<br><span class="muted">Nothing is lost either way: this device's copy goes to Settings → Backups, and GitHub keeps every earlier save in its history.</span>`,
      canPush()?["Use the GitHub version","Save mine to GitHub now","Decide later"]:["Use the GitHub version","Keep mine for now"])}
  async function force(){if(dirty&&await ask("Replace this device's copy?","This device has unsaved changes. They go to Settings → Backups, then the GitHub save loads.",["Load the GitHub save","Cancel"])!==0)return;
    busy=true;try{const r=await fetchRemote(null);if(r.missing){toast("Nothing saved on GitHub yet");return}remoteAt=r.data.savedAt;adopt(r,"Loaded the GitHub save ("+whenStr(r.data.savedAt)+")");setStatus("Up to date");App.render()}
    catch(e){toast(e.message)}finally{busy=false}}
  async function check(){const c=cfg();if(!token()){toast("No token saved in this browser");return}
    try{const r=await fetch(`https://api.github.com/repos/${c.repo}`,{headers:hdr(),cache:"no-store"});
      if(r.status===401){await ask("Token problem","GitHub refused this token. It may be mistyped, expired, or revoked. Make a new one and paste it in.",["OK"]);return}
      if(!r.ok){await ask("Token problem",`The token can't see <b>${esc(c.repo)}</b> (error ${r.status}). Check the repo name, and that the token's Repository access includes it.`,["OK"]);return}
      /* real write test: an unreferenced blob needs the same Contents: write permission as a save, and changes nothing visible */
      const w=await fetch(`https://api.github.com/repos/${c.repo}/git/blobs`,{method:"POST",headers:Object.assign(hdr(),{"Content-Type":"application/json"}),body:JSON.stringify({content:"guild hall write test",encoding:"utf-8"})});
      const push=w.ok;
      await ask(push?"Token works":"Token can't save",push?`This browser can save to <b>${esc(c.repo)}</b>. Press Save to publish the campaign.`:`The token can read <b>${esc(c.repo)}</b> but not write. Edit the token on GitHub: Repository access must list this repo, and Repository permissions → <b>Contents</b> must be <b>Read and write</b>. Then paste it in again.`,["OK"])}
    catch(e){await ask("Can't reach GitHub",esc(e.message),["OK"])}}
  async function push(){const c=cfg();const body={message:`Save campaign · ${new Date().toLocaleString()}`,content:enc(JSON.stringify(C,null,1)),branch:c.branch};if(sha)body.sha=sha;
    const r=await fetch(api(false),{method:"PUT",headers:Object.assign(hdr(),{"Content-Type":"application/json"}),body:JSON.stringify(body)});
    if(r.status===409||r.status===422){const remote=await fetchRemote().catch(()=>null);
      if(remote?.missing){sha=null;return push()}
      const i=await choose(remote,"GitHub has a different save");
      if(i===1){if(remote)sha=remote.sha;else{const m=await fetch(api(true),{headers:hdr(),cache:"no-store"}).then(x=>x.ok?x.json():null).catch(()=>null);if(!m){throw new Error("Couldn't read the GitHub copy to replace it")}sha=m.sha}return push()}
      if(i===0&&remote){adopt(remote,"Loaded the GitHub version (yours is in Backups)");setStatus("Up to date")}else if(i===0)toast("Couldn't download the GitHub copy; try again");
      return false}
    if(!r.ok){let m="";try{m=(await r.json()).message||""}catch(e){}throw new Error((r.status===401?"GitHub refused the token (mistyped or expired)":r.status===403||r.status===404?`The token can't write to ${c.repo}`:"GitHub error "+r.status)+(m?` (GitHub says: ${m})`:""))}
    const j=await r.json();sha=j.content.sha;lsSet("ygh.sha",sha);lsSet("ygh.shaAt",C.savedAt);setStatus("Saved to GitHub");return true}
  let timer=null;
  function start(){pull();clearInterval(timer);timer=setInterval(()=>{if(document.hidden)return;if(!isDM()||!dirty)pull()},isDM()?5*60e3:2*60e3);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden&&last&&Date.now()-last>30e3&&(!isDM()||!dirty))pull()})}
  function settingsHTML(){const c=cfg();return `
    <p class="hint">Saves go to <b>${esc(c.repo)}</b> → <code>${esc(c.path)}</code>, and every copy of the app (players included) pulls the latest automatically. Saving needs a GitHub token on this browser; it's kept here only, never in the campaign.</p>
    <div class="controls" style="margin:0;background:none;border:0;padding:0">
      <label style="flex:1;min-width:260px">GitHub token <input id="ghTok" type="password" placeholder="${token()?"•••••••• (saved; paste to replace)":"github_pat_…"}" autocomplete="off"></label>
      <label>Repo <input id="ghRepo" value="${esc(c.repo)}" style="width:260px"></label>
      <label>Branch <input id="ghBranch" value="${esc(c.branch)}" style="width:90px"></label>
      <label>File <input id="ghPath" value="${esc(c.path)}" style="width:180px"></label></div>
    <div class="actions"><button class="btn" id="ghSave">Save settings</button><button class="btn" id="ghCheck">Check my token</button><button class="btn" id="ghPull">Check for a newer save</button><button class="btn" id="ghForce">Load the GitHub save now</button>${token()?'<button class="btn ghost danger" id="ghForget">Forget token</button>':""}<span class="muted">${esc(status||"")}</span></div>
    <p class="muted" style="margin:6px 0 0">GitHub save: <b>${esc(whenStr(remoteAt))}</b>${remoteAt?"":" (not checked yet)"} · This device: <b>${esc(whenStr(C.savedAt))}</b>${dirty?" + unsaved changes":""} · App version ${esc(BUILD)}</p>
    <details class="hint" style="margin-top:8px"><summary>How to make a token (2 minutes)</summary>
      <ol><li>GitHub → Settings → Developer settings → Personal access tokens → <b>Fine-grained tokens</b> → Generate new token.</li>
      <li>Expiration: up to 1 year (set a reminder to renew). Repository access: <b>Only select repositories</b> → ${esc(c.repo.split("/")[1]||c.repo)}.</li>
      <li>Repository permissions → <b>Contents: Read and write</b>. Generate, copy, and paste it above.</li>
      <li>The repo owner must add the DM as a collaborator first, or the DM uses a token from the owner's account.</li></ol></details>`}
  function bindSettings(host){host.onclick=async e=>{const id=e.target.id;
    if(id==="ghSave"){const t=$("#ghTok").value.trim();if(t)lsSet("ygh.ghtoken",t);lsSet("ygh.sync",{repo:$("#ghRepo").value.trim()||SYNC_DEF.repo,branch:$("#ghBranch").value.trim()||"main",path:$("#ghPath").value.trim()||SYNC_DEF.path});
      sha=null;lsSet("ygh.sha",null);toast("GitHub settings saved");await pull(true);App.render()}
    else if(id==="ghPull")pull(true);
    else if(id==="ghCheck")check();
    else if(id==="ghForce")force();
    else if(id==="ghForget"){lsSet("ygh.ghtoken","");toast("Token removed from this browser");App.render()}}}
  return {force,check,pull,push,start,canPush,settingsHTML,bindSettings,status:()=>status,setStatus};
})();
