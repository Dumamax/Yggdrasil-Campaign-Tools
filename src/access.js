/* ===== Player View / DM Mode + GitHub sync =====
   Player View (default): read-only handouts, no editing, no secrets on screen. DM Mode: unlocked per browser with the DM password
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
document.addEventListener("error",e=>{const i=e.target;if(i.tagName!=="IMG"||!/raw\.githubusercontent\.com/.test(i.src))return;const n=+(i.dataset.retry||0);if(n>=4)return;
  i.dataset.retry=n+1;setTimeout(()=>{i.src=i.src.split("?")[0]+"?r="+Date.now()},[3e3,15e3,60e3,180e3][n])},true);
const SYNC_DEF={repo:"Dumamax/Yggdrasil-Campaign-Tools",branch:"main",path:"data/campaign.json"};
async function hashPw(pw){const s="ygh-dm:"+pw;
  try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
  catch(e){let h=5381;for(const c of s)h=(h*33^c.charCodeAt(0))>>>0;return "d"+h.toString(16)}}
const unlocked=()=>!!S.dmHash&&lsGet("ygh.dm",null)===S.dmHash;
const isDM=()=>unlocked()&&!UI.preview;
/* Player View from DM Mode is just a preview: this browser stays unlocked, so DM Mode comes back without the password */
function previewPlayer(){UI.preview=true;UI.tab="p-board";saveUI();App.render();toast("Player View (DM Mode is one tap away)")}
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
  const m=modal(`<h2>${first?"Set a DM password":"DM Mode"}</h2>
    <p class="muted">${first?"DM Mode shows secrets and lets you edit everything. Pick a password to keep players from wandering in; this browser stays unlocked until you lock it.":"Enter the DM password. This browser stays unlocked until you switch back to Player View."}</p>
    <form><input type="password" name="pw" placeholder="Password" autocomplete="current-password" required>${first?'<input type="password" name="pw2" placeholder="Repeat password" required>':""}
    <div class="actions"><button class="btn primary">${first?"Set password & unlock":"Unlock"}</button><button type="button" class="btn ghost" data-x>Cancel</button></div><p class="muted" id="gateMsg"></p></form>`);
  m.el.querySelector("[data-x]").onclick=m.close;
  m.el.querySelector("form").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),pw=f.get("pw");
    if(first){if(pw!==f.get("pw2")){$("#gateMsg").textContent="Passwords don't match.";return}S.dmHash=await hashPw(pw);commit()}
    else if(await hashPw(pw)!==S.dmHash){$("#gateMsg").textContent="That's not it.";e.target.pw.select();return}
    lsSet("ygh.dm",S.dmHash);m.close();UI.preview=false;UI.tab="home";saveUI();App.render();toast(first?"Password set. Save so it travels with the campaign":"DM Mode unlocked")}}

const Sync=(()=>{
  const cfg=()=>Object.assign({},SYNC_DEF,lsGet("ygh.sync",{}));
  const token=()=>lsGet("ygh.ghtoken","")||"";
  let sha=lsGet("ygh.sha",null),remoteAt=null,last=null,status="",busy=false;
  const api=(withRef)=>{const c=cfg();return `https://api.github.com/repos/${c.repo}/contents/${c.path.split("/").map(encodeURIComponent).join("/")}${withRef?`?ref=${encodeURIComponent(c.branch)}`:""}`};
  const hdr=raw=>{const h={Accept:raw?"application/vnd.github.raw+json":"application/vnd.github+json"};if(token())h.Authorization="Bearer "+token();return h};
  const enc=s=>{const b=new TextEncoder().encode(s);let o="";for(let i=0;i<b.length;i+=0x8000)o+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));return btoa(o)};
  const dec=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,"")),c=>c.charCodeAt(0)));
  const canPush=()=>isDM()&&!!token();
  function setStatus(s){if(s==="Up to date"&&C.savedAt)s+=` · save from ${whenStr(C.savedAt)}`;status=s;const h=$("#hdrSync");if(h)h.textContent=s;
    if(/^(Offline|Can't reach GitHub)/.test(s))Alerts.set("sync",(s.startsWith("Offline")?"You're offline":"Can't reach GitHub")+". Changes stay safe in this browser and save once the connection is back.","sync");
    else if(/^Picture upload paused/.test(s))Alerts.set("img","Pictures haven't finished uploading to GitHub (retrying every minute). Keep the app open until this clears.","sync");
    else if(/^(Up to date|Saved to GitHub|Unsaved changes|Your copy differs)/.test(s))Alerts.clear("sync");
    banner()}
  async function fetchRemote(skipIfSha){const r=await fetch(api(true),{headers:hdr(),cache:"no-cache"});
    if(r.status===404)return {missing:true};if(!r.ok)throw new Error(r.status===401?"GitHub token was refused":r.status===403||r.status===429?"GitHub is busy (too many checks from this network); retrying shortly":"GitHub error "+r.status);
    const j=await r.json();if(skipIfSha&&j.sha===skipIfSha)return {sha:j.sha,same:true};let text;
    /* big files: download the blob by sha. The contents URL serves both the metadata and the raw file under one ETag, and phone caches could hand back the metadata as "the campaign" */
    if(j.content&&j.encoding==="base64")text=dec(j.content);
    else{const b=await fetch(`https://api.github.com/repos/${cfg().repo}/git/blobs/${j.sha}`,{headers:hdr(true)});if(!b.ok)throw new Error("GitHub error "+b.status+" downloading the save");text=await b.text()}
    let data;try{data=JSON.parse(text)}catch(e){throw new Error("The GitHub save didn't download completely")}
    if(!data||data.app!==APP_ID)throw new Error("Downloaded something that isn't the campaign");
    return {sha:j.sha,data:await assemble(resolveImgs(data))}}
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
  /* ---- images live as their own files (data/img/<hash>.<ext>); campaign.json holds "ghimg:<file>" refs ----
     A save uploads only the small JSON plus images GitHub doesn't have yet (Git Data API: blobs → tree → commit → ref).
     Loading turns refs into raw.githubusercontent URLs (content-addressed, so CDN caching is safe; not API rate-limited). */
  const IMGDIR="data/img/",REF="ghimg:";
  const rawBase=()=>{const c=cfg();return `https://raw.githubusercontent.com/${c.repo}/${c.branch}/${IMGDIR}`};
  const isData=v=>typeof v==="string"&&v.startsWith("data:image/")&&v.length>200;
  const names=new Map();
  async function imgName(v){let n=names.get(v);if(n)return n;const ext=(v.slice(11,v.indexOf(";"))||"img").replace("jpeg","jpg").replace(/[^a-z0-9]/g,"");
    let h;try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v));h=[...new Uint8Array(b)].slice(0,12).map(x=>x.toString(16).padStart(2,"0")).join("")}catch(e){h=qhash(v).replace(/\W/g,"")}
    n=h+"."+ext;names.set(v,n);return n}
  /* big images upload as ~150 KB text pieces (<name>.p0, .p1 …): large single uploads stalled on some connections */
  const CH=200000,PARTS="ghparts:";
  function resolveImgs(d){const base=rawBase();return JSON.parse(JSON.stringify(d),(k,v)=>typeof v==="string"&&v.startsWith(REF)?(v.includes("#")?PARTS+v.slice(REF.length):base+v.slice(REF.length)):v)}
  async function rawText(url){for(let a=0;a<5;a++){const r=await fetch(a?url+"?r="+Date.now():url).catch(()=>null);if(r&&r.ok)return r.text();await sleep([2e3,5e3,15e3,30e3][a]||30e3)}throw new Error("Couldn't download a map or picture from GitHub")}
  async function assemble(d){const want=new Set();JSON.stringify(d,(k,v)=>{if(typeof v==="string"&&v.startsWith(PARTS))want.add(v);return v});if(!want.size)return d;const got=new Map(),base=rawBase();
    await Promise.all([...want].map(async v=>{const [n,k]=v.slice(PARTS.length).split("#");let u=null;try{u=await IDB.get("img:"+n)}catch(e){}
      if(!u){const parts=await Promise.all(Array.from({length:+k},(_,i)=>rawText(base+n+".p"+i)));const ext=n.split(".").pop();u=`data:image/${ext==="jpg"?"jpeg":ext};base64,`+parts.join("");try{await IDB.set("img:"+n,u)}catch(e){}}
      names.set(u,n);got.set(v,u)}));
    return JSON.parse(JSON.stringify(d),(k,v)=>got.has(v)?got.get(v):v)}
  async function pack(obj){const found=[];JSON.stringify(obj,(k,v)=>{if(isData(v))found.push(v);return v});const imgs=new Map();
    for(const v of found)imgs.set(await imgName(v),v);const base=rawBase();
    const ref=v=>{const n=names.get(v),L=v.length-v.indexOf(",")-1;return REF+n+(L>CH?"#"+Math.ceil(L/CH):"")};
    const json=JSON.stringify(obj,(k,v)=>isData(v)?ref(v):typeof v==="string"&&v.startsWith(base)?REF+v.slice(base.length).split("?")[0]:v,1);
    return {json,imgs}}
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const visible=()=>document.hidden?new Promise(r=>{const f=()=>{if(!document.hidden){document.removeEventListener("visibilitychange",f);setTimeout(r,1500)}};document.addEventListener("visibilitychange",f)}):Promise.resolve();
  async function gh(path,opt={},tries=6){let r,m="";
    for(let a=0;;a++){
      const ac=new AbortController(),to=setTimeout(()=>ac.abort(),60e3);
      try{r=await fetch(`https://api.github.com/repos/${cfg().repo}/${path}`,Object.assign({cache:"no-store",signal:ac.signal},opt,{headers:Object.assign(hdr(),opt.body?{"Content-Type":"application/json"}:{})}))}
      catch(e){clearTimeout(to);if(e.name==="AbortError")e=new Error("GitHub didn't answer within a minute");if(a<tries-1){await visible();await sleep([3e3,10e3,20e3,40e3,60e3][a]||60e3);continue}const err=new Error(`Lost the connection to GitHub (${e.message})`);err.net=true;throw err}
      clearTimeout(to);if(r.ok)return r.json();
      m="";try{m=(await r.json()).message||""}catch(e){}
      const busy=r.status>=500||r.status===429||(r.status===403&&(r.headers.get("retry-after")||/secondary|abuse|rate limit/i.test(m)));
      if(busy&&a<tries-1){await sleep(Math.max((+r.headers.get("retry-after")||0)*1e3,[3e3,10e3,30e3][a]||30e3));continue}
      break}
    {const err=new Error((r.status===401?"GitHub refused the token (mistyped or expired)":/secondary|abuse|rate limit/i.test(m)?"GitHub is limiting how fast saves can go; wait a minute and Save again":r.status===403||r.status===404?`The token can't write to ${cfg().repo}`:"GitHub error "+r.status)+(m?` (GitHub says: ${m})`:""));err.status=r.status;throw err}
    return r.json()}
  /* ---- pictures upload in the background as soon as they're added (one picture per small commit), so Save only sends the text.
     Self-healing: every run scans C for images GitHub doesn't have yet, so an interrupted upload simply continues next time. */
  let known=null,imgJob=null,imgT=null;
  async function listKnown(force){if(known&&!force)return known;let s=new Set();try{const L=await gh(`contents/${IMGDIR.slice(0,-1)}?ref=${encodeURIComponent(cfg().branch)}`);if(Array.isArray(L))s=new Set(L.map(x=>x.name))}catch(e){if(e.status!==404)throw e}return known=s}
  function pieces(imgs,have){const files=[];for(const [n,v] of imgs){const b=v.slice(v.indexOf(",")+1);
      if(b.length<=CH){if(!have.has(n))files.push([n,b,"base64"])}
      else{const k=Math.ceil(b.length/CH);for(let i=0;i<k;i++)if(!have.has(n+".p"+i))files.push([n+".p"+i,b.slice(i*CH,(i+1)*CH),"utf-8"])}}return files}
  async function uploadFiles(todo,label){const tree=[],sent=lsGet("ygh.blobs",{});let k=0;
    for(const [n,content,encoding] of todo){k++;let bs=sent[n];
      if(!bs){setStatus(label(k,todo.length));if(k>1)await sleep(400);await visible();
        try{bs=(await gh("git/blobs",{method:"POST",body:JSON.stringify({content,encoding})})).sha}
        catch(e){e.message=`Piece ${k} of ${todo.length} didn't upload: ${e.message}. Pieces already sent are remembered, so it continues where it stopped`;throw e}
        sent[n]=bs;lsSet("ygh.blobs",sent)}
      tree.push({path:IMGDIR+n,mode:"100644",type:"blob",sha:bs})}return tree}
  async function commitFiles(tree,message,retry=0){const b=cfg().branch,head=await gh(`git/ref/heads/${encodeURIComponent(b)}`),base=await gh(`git/commits/${head.object.sha}`);
    const t=await gh("git/trees",{method:"POST",body:JSON.stringify({base_tree:base.tree.sha,tree})}),cm=await gh("git/commits",{method:"POST",body:JSON.stringify({message,tree:t.sha,parents:[head.object.sha]})});
    try{await gh(`git/refs/heads/${encodeURIComponent(b)}`,{method:"PATCH",body:JSON.stringify({sha:cm.sha,force:false})})}catch(e){if(e.status===422&&retry<3)return commitFiles(tree,message,retry+1);throw e}}
  function imagesSoon(){if(!isDM()||!canPush())return;clearTimeout(imgT);imgT=setTimeout(syncImages,2500)}
  function syncImages(){if(!isDM()||!canPush())return Promise.resolve();if(imgJob)return imgJob;if(navigator.onLine===false){addEventListener("online",imagesSoon,{once:true});return Promise.resolve()}
    imgJob=(async()=>{const {imgs}=await pack(C),have=await listKnown(),list=[...imgs].filter(([n,v])=>pieces([[n,v]],have).length);if(!list.length)return;
      const keep=status;let i=0;
      for(const [n,v] of list){i++;const files=pieces([[n,v]],have);if(!files.length)continue;
        const tree=await uploadFiles(files,(k,N)=>`Uploading picture ${i} of ${list.length}${N>1?` (${Math.round(100*(k-1)/N)}%)`:""}…`);
        setStatus(`Uploading picture ${i} of ${list.length}…`);await commitFiles(tree,`Add picture ${n.split(".")[0].slice(0,8)}`);
        files.forEach(f=>have.add(f[0]));const s=lsGet("ygh.blobs",{});files.forEach(f=>delete s[f[0]]);lsSet("ygh.blobs",s)}
      Alerts.clear("img");setStatus(keep&&!/^(Uploading picture|Picture upload)/.test(keep)?keep:dirty?"Unsaved changes":"Up to date");toast(list.length>1?`${list.length} pictures uploaded to GitHub`:"Picture uploaded to GitHub")})()
      .catch(e=>{setStatus("Picture upload paused (retrying)");clearTimeout(imgT);imgT=setTimeout(syncImages,60e3)})
      .finally(()=>{imgJob=null});
    return imgJob}
  async function push(retry=0){const c=cfg();
    /* someone else saved since we loaded? */
    const mr=await fetch(api(true),{headers:hdr(),cache:"no-store"});const meta=mr.status===404?null:mr.ok?await mr.json():null;
    if(!mr.ok&&mr.status!==404)throw new Error(mr.status===401?"GitHub refused the token (mistyped or expired)":"GitHub error "+mr.status);
    if(meta&&meta.sha!==sha){const remote=await fetchRemote().catch(()=>null);const i=await choose(remote,"GitHub has a different save");
      if(i===0&&remote){adopt(remote,"Loaded the GitHub version (yours is in Backups)");setStatus("Up to date");return false}
      if(i===0){toast("Couldn't download the GitHub copy; try again");return false}
      if(i!==1)return false;sha=meta.sha}
    const {json,imgs}=await pack(C);
    if(imgJob)await imgJob.catch(()=>{}); // a background picture upload is finishing: reuse its work
    const have=await listKnown(true),todo=pieces(imgs,have),tree=await uploadFiles(todo,(k,n)=>`Saving to GitHub… picture piece ${k} of ${n} (keep this screen open)`);
    setStatus("Saving to GitHub…");
    const cb=await gh("git/blobs",{method:"POST",body:JSON.stringify({content:json,encoding:"utf-8"})});tree.push({path:c.path,mode:"100644",type:"blob",sha:cb.sha});
    const head=await gh(`git/ref/heads/${encodeURIComponent(c.branch)}`),base=await gh(`git/commits/${head.object.sha}`);
    let t;try{t=await gh("git/trees",{method:"POST",body:JSON.stringify({base_tree:base.tree.sha,tree})})}
    catch(e){if(e.status===422&&todo.length&&retry<2){lsSet("ygh.blobs",{});return push(retry+1)}throw e} // a remembered image blob expired on GitHub: send them again
    lsSet("ygh.blobs",{});todo.forEach(f=>have.add(f[0]));
    const cm=await gh("git/commits",{method:"POST",body:JSON.stringify({message:`Save campaign · ${new Date().toLocaleString()}${todo.length?` (+${todo.length} image${todo.length>1?"s":""})`:""}`,tree:t.sha,parents:[head.object.sha]})});
    try{await gh(`git/refs/heads/${encodeURIComponent(c.branch)}`,{method:"PATCH",body:JSON.stringify({sha:cm.sha,force:false})})}
    catch(e){if(e.status===422&&retry<2)return push(retry+1);throw e} // the branch moved meanwhile: redo on top of it
    sha=cb.sha;lsSet("ygh.sha",sha);lsSet("ygh.shaAt",C.savedAt);setStatus("Saved to GitHub");ping({c:cm.sha,b:cb.sha,at:C.savedAt});return true}
  /* ---- live updates: after a GitHub save, a tiny "updated" ping goes out through ntfy.sh (no account; carries only commit ids, never campaign content).
     Open copies load that exact commit from raw.githubusercontent (not API rate-limited). The 2-minute poll stays as the fallback. ---- */
  const NTFY="https://ntfy.sh/",topic=()=>"ygh-"+qhash(cfg().repo.toLowerCase()+"|"+cfg().path).replace(/\W/g,"");
  function ping(d){try{fetch(NTFY+topic(),{method:"POST",body:JSON.stringify(d)}).catch(()=>{})}catch(e){}}
  let es=null;
  function live(){try{es&&es.close()}catch(e){}es=null;if(!window.EventSource)return;
    try{es=new EventSource(NTFY+topic()+"/sse")}catch(e){return}
    es.onmessage=e=>{let d;try{const m=JSON.parse(e.data);if(m.event&&m.event!=="message")return;d=JSON.parse(m.message)}catch(x){return}
      if(!d||!d.c||!d.b||d.b===sha||(d.at&&C.savedAt&&d.at<C.savedAt))return;onPing(d)}}
  async function onPing(d){if(busy){setTimeout(()=>onPing(d),3e3);return}
    if(isDM()&&dirty){pull();return} // unsaved work here: the normal check asks before replacing anything
    busy=true;let failed=false;
    try{const text=await rawText(`https://raw.githubusercontent.com/${cfg().repo}/${d.c}/${cfg().path}`);let data;try{data=JSON.parse(text)}catch(e){throw new Error("partial download")}
      if(!data||data.app!==APP_ID)throw new Error("not the campaign");
      const r={sha:d.b,data:await assemble(resolveImgs(data))};last=Date.now();remoteAt=r.data.savedAt;
      adopt(r,isDM()?"Loaded the latest save from GitHub":"Updated with the DM's latest save");setStatus("Up to date")}
    catch(e){failed=true}finally{busy=false}
    if(failed)pull()}
  /* soon: save to GitHub (and ping players) a moment after a player-visible toggle, so the DM needn't press Save */
  let soonT=null;
  function soon(){if(!isDM()||!canPush())return false;clearTimeout(soonT);const go=()=>{if(saving)soonT=setTimeout(go,2e3);else saveCampaign()};soonT=setTimeout(go,1500);return true}
  let timer=null;
  function start(){pull();live();imagesSoon();addEventListener("online",imagesSoon);clearInterval(timer);timer=setInterval(()=>{if(document.hidden)return;if(!isDM()||!dirty)pull()},isDM()?5*60e3:2*60e3);
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
      sha=null;lsSet("ygh.sha",null);toast("GitHub settings saved");live();await pull(true);App.render()}
    else if(id==="ghPull")pull(true);
    else if(id==="ghCheck")check();
    else if(id==="ghForce")force();
    else if(id==="ghForget"){lsSet("ygh.ghtoken","");toast("Token removed from this browser");App.render()}}}
  return {imagesSoon,syncImages,force,check,pull,push,start,soon,canPush,settingsHTML,bindSettings,status:()=>status,setStatus};
})();
