import json,re
B="/home/claude/5e-bits/5e-database/src/"
def fr(cr):
  return {0.125:"1/8",0.25:"1/4",0.5:"1/2"}.get(cr,str(int(cr)) if cr==int(cr) else str(cr))
AB=["strength","dexterity","constitution","intelligence","wisdom","charisma"]
def ent(L):
  out=[]
  for a in L or []:
    n=a.get("name","");u=a.get("usage") or {}
    if u.get("type")=="per day":n+=f" ({u.get('times')}/Day)"
    elif u.get("type")=="recharge on roll":n+=f" (Recharge {u.get('min_value')}–6)" if u.get('min_value',6)<6 else " (Recharge 6)"
    elif u.get("type")=="recharge after rest":n+=" (Recharges after a "+" or ".join(u.get("rest_types",[]))+" Rest)"
    d=a.get("desc","")
    sc=a.get("spellcasting")
    if sc and sc.get("spells") and not any(sp["name"].lower() in d.lower() for sp in sc["spells"]):
      g={}
      for sp in sc["spells"]:
        u=sp.get("usage") or {};k="At will" if u.get("type")=="at will" else (f"{u.get('times')}/Day each" if u.get("type")=="per day" else "Other")
        g.setdefault(k,[]).append(sp["name"]+(f" ({sp['notes']})" if sp.get("notes") else ""))
      d+=" "+"; ".join(f"{k}: {', '.join(v)}" for k,v in g.items())
    out.append([n,d])
  return out
def conv(x,ed):
  ac=x["armor_class"][0];acn=ac.get("type","")
  if ac.get("armor"):acn=", ".join(i["name"] for i in ac["armor"])
  sp=x.get("speed",{});speed=", ".join((v if k=="walk" else f"{k} {v}") for k,v in sp.items() if isinstance(v,str))
  if sp.get("hover"):speed+=" (hover)"
  saves=[];skills=[]
  for p in x.get("proficiencies",[]):
    nm=p["proficiency"]["name"];v=p["value"]
    if nm.startswith("Saving Throw:"):saves.append(nm.split(": ")[1].title()+f" +{v}")
    elif nm.startswith("Skill:"):skills.append(nm.split(": ")[1]+f" +{v}")
  sen=x.get("senses",{});senses=", ".join(f"{k.replace('_',' ').title()} {v}" for k,v in sen.items() if k!="passive_perception")
  senses=(senses+"; " if senses else "")+f"Passive Perception {sen.get('passive_perception','')}"
  ci=[c["name"] if isinstance(c,dict) else c for c in x.get("condition_immunities",[])]
  t=x.get("type","");st=x.get("subtype")
  m={"id":("s24:" if ed=="2024" else "s14:")+x["index"],"name":x["name"],"src":"SRD "+ed,"size":x.get("size",""),"type":t+(f" ({st})" if st else ""),"align":x.get("alignment",""),
     "ac":ac["value"],"acn":acn,"hp":x["hit_points"],"hd":x.get("hit_points_roll") or x.get("hit_dice",""),"speed":speed,
     "ab":[x[a] for a in AB],"saves":", ".join(saves),"skills":", ".join(skills),
     "vuln":", ".join(x.get("damage_vulnerabilities",[])),"resist":", ".join(x.get("damage_resistances",[])),"immune":", ".join(x.get("damage_immunities",[])),"cimm":", ".join(ci),
     "senses":senses,"langs":x.get("languages","") or "—","cr":fr(x["challenge_rating"]),"xp":x.get("xp",0),"pb":x.get("proficiency_bonus",2),
     "traits":ent(x.get("special_abilities")),"actions":ent(x.get("actions")),"bonus":ent(x.get("bonus_actions")),"reactions":ent(x.get("reactions")),"legendary":ent(x.get("legendary_actions"))}
  if x.get("gear"):m["gear"]=x["gear"]
  return {k:v for k,v in m.items() if v not in ("",[],None)}
a=json.load(open(B+"2024/en/5e-SRD-Monsters.json"));b=json.load(open(B+"2014/en/5e-SRD-Monsters.json"))
L=[conv(x,"2024") for x in a];names={x["name"].lower() for x in a}|{x["index"] for x in a}
L+= [conv(x,"2014") for x in b if x["name"].lower() not in names and x["index"] not in names]
L.sort(key=lambda m:m["name"])
out={"version":1,"license":"Includes material from the System Reference Document 5.2 (2024) and 5.1 (2014) by Wizards of the Coast LLC, licensed under CC BY 4.0 (creativecommons.org/licenses/by/4.0). Data via the 5e-bits/5e-database project (MIT).","monsters":L}
s=json.dumps(out,separators=(",",":"),ensure_ascii=False)
open("/home/claude/repo/data/srd-monsters.json","w").write(s)
print(len(L),sum(1 for m in L if m["src"]=="SRD 2014"),len(s)//1024,"KB")
print(json.dumps([m for m in L if m["id"]=="s24:goblin-warrior"][0])[:900])
