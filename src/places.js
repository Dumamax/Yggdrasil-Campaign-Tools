/* ===== Places: the Tree's gazetteer (one area per map) + world names and gate IDs =====
   Place tags: c commoner, m merchant, n noble, g guild, k council, o otherworldly (who you'd find there, matched to patron categories);
   s = a quest can happen here. Area tier (0 Iron … 4 Platinum) is set for the Wards. Editable in Settings → Tables → Places. */
const DEFAULT_PLACES={version:2,
 areas:[
  {id:"pinboard",group:"The Bazaar",name:"Pinboard Plaza",blurb:"The cobbled heart of the bazaar, where the great Job Board stands.",places:[
   {n:"the Great Job Board",t:"s",b:"a notice board taller than a house, layered with petitions from a hundred worlds"},
   {n:"the Petitioners' Steps",t:"cs",b:"where commoners wait, hats in hand, to plead for help"},
   {n:"the Inkwell Kiosk",t:"cm",b:"a scribe's booth that writes petitions for anyone who can't"},
   {n:"the Clocktower of Mismatched Hours",t:"s",b:"each face keeps a different world's time"},
   {n:"the Tack & Tankard",t:"cg",b:"an adventurers' tavern; the back booth is for haggling fees"},
   {n:"the Lost-Notice Fountain",t:"s",b:"torn notices drift in its basin, and some still glow"},
   {n:"the Iron Liaison Booth",t:"k",b:"where the Iron Seat's clerks post Council-mandated jobs"}]},
  {id:"exchange",group:"The Bazaar",name:"The Exchange Burl",blurb:"A knotted burl of counting-houses where every world's coin is weighed.",places:[
   {n:"the Pouch Wardens' Counting House",t:"mk",b:"certifies Currency Conversion Pouches, very slowly"},
   {n:"the Weighing Hall",t:"ms",b:"giant brass scales that settle arguments about whose coin is real"},
   {n:"the Coin-Glass Arcade",t:"m",b:"money changers behind lenses that can spot a forged world"},
   {n:"the Debtors' Knot",t:"cs",b:"a tangle of alleys where people hide from what they owe"},
   {n:"the Vault of Small Mercies",t:"ms",b:"rents tiny vaults by the day, no questions asked"},
   {n:"the Ledgerhouse",t:"mg",b:"insures guild expeditions and keeps score of who came back"}]},
  {id:"glowmarket",group:"The Bazaar",name:"The Glowmarket",blurb:"A night market lit by caged fireflies and lantern-fungus; it opens when the Tree dims.",places:[
   {n:"Lantern Row",t:"ms",b:"a street of glowing stalls selling light from other skies"},
   {n:"the Mothlight Stage",t:"cs",b:"buskers, fire-eaters, and the occasional riot"},
   {n:"the Whisper Stalls",t:"mc",b:"rumors sold by the ounce, truth not guaranteed"},
   {n:"the Candlewax Auction",t:"mn",b:"bids are made by how far your candle burns"},
   {n:"Under-Awning Alley",t:"cs",b:"the part of the market nobody admits to shopping in"},
   {n:"Pip's All-Night Noodles",t:"c",b:"a steaming cart that has fed every adventurer in the city once"}]},
  {id:"gaslamp",group:"The Bazaar",name:"Gaslamp Lane",blurb:"Steampunk traders, hissing pipes, and inventors who never sleep.",places:[
   {n:"Brassfoot Foundry",t:"mgs",b:"pours anything in brass, including things that shouldn't move"},
   {n:"the Patent Pavilion",t:"ms",b:"where inventions are registered, challenged, and stolen"},
   {n:"Cogwright's Repairs",t:"cm",b:"fixes clocks, limbs, and the odd automaton's feelings"},
   {n:"the Steam Baths at Lane's End",t:"cn",b:"steam piped up from somewhere far too deep"},
   {n:"the Valve Club",t:"ng",b:"a members-only inventors' club with a very loud door"},
   {n:"Smogstack Yard",t:"s",b:"a soot-black yard of boilers, coal, and rumors of a ghost"}]},
  {id:"hearthring",group:"The Bazaar",name:"Hearthring",blurb:"A ring of inns and kitchens where travelers from every world sleep off the trip.",places:[
   {n:"the Wayfarer's Rest",t:"oc",b:"cheap, friendly, and full of people who just arrived"},
   {n:"the Ninefold Hearth",t:"on",b:"a fine inn with a fireplace for every climate"},
   {n:"Bunkroot Hostel",t:"cs",b:"hammocks strung between living roots, a copper a night"},
   {n:"the Homesick Kitchen",t:"oc",b:"cooks any world's food, close enough to make you cry"},
   {n:"the Courier Roost",t:"ms",b:"message birds, bats, and one very tired wyvern"},
   {n:"the Hearthring Lodging Office",t:"mk",b:"assigns rooms, settles brawls, and keeps the guest ledger"}]},
  {id:"skyfoot",group:"The Bazaar",name:"Skyfoot Steps",blurb:"The great stair from the bazaar up to the Bough Docks.",places:[
   {n:"the Thousand Steps",t:"s",b:"there are more than a thousand, and they change"},
   {n:"the Porters' Hall",t:"cg",b:"the porters' union, who carry anything up for a fee"},
   {n:"Ropewalk Landing",t:"ms",b:"a halfway terrace of rope-makers and rigging sellers"},
   {n:"Crate Terrace",t:"ms",b:"cargo stacked high, waiting to go up or come down"},
   {n:"the Windvane Shrine",t:"c",b:"sailors leave a feather here for a safe crossing"},
   {n:"Freight Lift Nine",t:"s",b:"the lift everyone uses, despite what happened to Lift Eight"}]},
  {id:"twilight",group:"The Bazaar",name:"Twilight Fair",blurb:"The fey market, where it is always almost dusk and every bargain has a catch.",places:[
   {n:"the Hourless Carousel",t:"os",b:"riders come off a little older or a little younger"},
   {n:"the Bargain Ring",t:"om",b:"names, memories, and years traded under a toadstool tent"},
   {n:"the Dewdrop Bazaar",t:"m",b:"stalls that sell bottled weather and pressed wishes"},
   {n:"the Changeling Hedge",t:"os",b:"a hedge maze that rearranges itself to keep visitors"},
   {n:"the Moonmilk Tavern",t:"oc",b:"never eat anything here you didn't pay for"},
   {n:"the Court of Small Courtesies",t:"on",b:"minor fey nobles hold audience over tea and grudges"}]},
  {id:"scrapper",group:"The Bazaar",name:"Scrapper's Gnarl",blurb:"The salvage market, built from whatever fell out of other worlds.",places:[
   {n:"the Heap",t:"s",b:"a hill of salvage from a hundred worlds, still settling"},
   {n:"Rustmother's Yard",t:"mg",b:"the gnarl's matriarch buys and sells everything"},
   {n:"Wire & Wonder",t:"m",b:"a stall of half-working devices nobody can name"},
   {n:"the Junkers' Pit",t:"cs",b:"salvaged-armor pit fights every third evening"},
   {n:"Melters' Row",t:"ms",b:"forges that turn junk back into something useful"},
   {n:"the Chapel of the Grease Saint",t:"c",b:"a shrine to the patron of things that should have broken"}]},
  {id:"tumbleroot",group:"The Bazaar",name:"Tumbleroot Post",blurb:"A dusty frontier post where caravans and drifters come in off the root roads.",places:[
   {n:"the Tumbleroot Trading Post",t:"mc",b:"sells rope, beans, maps, and advice you didn't ask for"},
   {n:"the Hitching Roots",t:"s",b:"where riders tie up mounts from a dozen worlds"},
   {n:"the Dusty Bough Saloon",t:"cg",b:"swinging doors, a player piano, and a standing bounty board"},
   {n:"the Sheriff's Hollow",t:"ks",b:"the bazaar watch post, with a single very small jail"},
   {n:"the Caravan Corral",t:"ms",b:"wagons circled for the night before the long roads out"},
   {n:"the Wanted Wall",t:"s",b:"faces from a hundred worlds, some of them crossed out"}]},
  {id:"mossbank",group:"The Bazaar",name:"The Mossbank",blurb:"A soft green park between the roots, with a very odd little shop at its edge.",places:[
   {n:"Odds & Ends of Elsewhere",t:"mo",b:"a crooked shop that sells one of everything from nowhere in particular"},
   {n:"the Mossbank Lawns",t:"cs",b:"picnics, duels, and naps in equal measure"},
   {n:"Old Root Pond",t:"s",b:"something at the bottom keeps returning lost things, wrong"},
   {n:"the Storytellers' Ring",t:"c",b:"stones where tellers trade tales for coin or for silence"},
   {n:"the Hollow Stump",t:"cs",b:"the park keeper's home, and a lost-and-found for small creatures"},
   {n:"Bramble Folly",t:"s",b:"an overgrown ruin older than the bazaar around it"}]},
  {id:"heartwood",group:"Inside the Tree",name:"The Heartwood Atrium",blurb:"The vast entrance hall inside the trunk, where physical and planar space start to blur.",places:[
   {n:"the Bark Gate",t:"s",b:"the great doorway into the Tree, a little bigger on the inside"},
   {n:"the Council Hall",t:"kn",b:"where the five seats meet beneath a ceiling of living wood"},
   {n:"the Guild Registry",t:"kg",b:"charters, rank seals, and a queue that never ends"},
   {n:"the Sapway Lifts",t:"s",b:"sap-driven lifts rising to every ward"},
   {n:"the Revival Chapel",t:"ck",b:"where the dead of the Tree are brought back, for a fee"},
   {n:"the Atrium Galleries",t:"mc",b:"balconies of cafés and stalls ringing the trunk"},
   {n:"the Hall of Lost Charters",t:"ks",b:"records of guilds that fell, and why"},
   {n:"the Rootstair",t:"s",b:"the spiral stair down toward the Roots"}]},
  {id:"iron",group:"The Wards",tier:0,name:"Iron Ward",blurb:"Low ceilings, cheerful crowds, and the hollows where new guilds start.",places:[
   {n:"our guild hall",t:"s",b:"Mordecai's newly chartered hollow, still mostly empty"},
   {n:"the Cellar Lanterns' Hall",t:"g",b:"Goldie's guild, small and stubborn and always busy"},
   {n:"Ironmonger Row",t:"mc",b:"cheap gear, used armor, and honest-ish advice"},
   {n:"the Sawdust Common",t:"cs",b:"a training yard shared by every guild too poor for their own"},
   {n:"the Apprentice Hostel",t:"cg",b:"where would-be adventurers wait to be noticed"},
   {n:"the Bucket Brigade Watch",t:"ks",b:"the ward's volunteer fire and flood watch"},
   {n:"the Knothole Tavern",t:"cg",b:"the Iron guilds' favorite tavern, inside a burl with one round window"}]},
  {id:"bronze",group:"The Wards",tier:1,name:"Bronze Ward",blurb:"The working middle: guilds with dirt under their nails and caravans to run.",places:[
   {n:"the Tin Gale Company Yards",t:"g",b:"Captain Varn's docks-in-a-ward, full of crates and bluster"},
   {n:"the Caravan Guildhouse",t:"gm",b:"escort contracts for the long root roads"},
   {n:"the Sapworks",t:"s",b:"pumps and pipes that move the Tree's sap to the upper wards"},
   {n:"the Bronze Bell Market",t:"m",b:"sturdy goods for working adventurers"},
   {n:"the Crossbeam Tavern",t:"cg",b:"a tavern built on a beam across the ward's open heart"},
   {n:"the Roots-Traffic Office",t:"k",b:"permits and inspections for anything bound below"}]},
  {id:"silver",group:"The Wards",tier:2,name:"Silver Ward",blurb:"Archives, academies, and the quiet business of who is right.",places:[
   {n:"the Lamplit Archive",t:"gk",b:"Professor Ashgrave-Mott's guild of record-keepers"},
   {n:"the Arbiters' Court",t:"kn",b:"where guild disputes are settled, eventually"},
   {n:"the Owlery Academy",t:"gc",b:"a school for scholars, scouts, and very clever birds"},
   {n:"the Quillstack Library",t:"s",b:"stacks so tall they have their own weather"},
   {n:"the Charter Office",t:"k",b:"certifies tier advancements with three kinds of wax"},
   {n:"the Quiet Teahouse",t:"ng",b:"no talking above a whisper, by Council order"}]},
  {id:"gold",group:"The Wards",tier:3,name:"Gold Ward",blurb:"Root-wardens and veterans, close to the Tree's living heart.",places:[
   {n:"the Green Vein Wardens' Grove",t:"gk",b:"Sister Verdance's guild tends the Tree from here"},
   {n:"the Veterans' Hearth",t:"gc",b:"old heroes, older stories, and a long bar"},
   {n:"the Sapspring",t:"s",b:"a pool where the Tree's sap runs clear and warm"},
   {n:"the Gilded Armory",t:"mg",b:"masterwork arms for those who can afford them"},
   {n:"the Hall of Fallen Banners",t:"s",b:"banners of guilds lost in the worlds, still swaying"},
   {n:"the Golden Terraces",t:"n",b:"homes of retired legends and their very nosy neighbors"}]},
  {id:"platinum",group:"The Wards",tier:4,name:"Platinum Ward",blurb:"Living legends near the crown, where the maps stop agreeing.",places:[
   {n:"the Gilded Spiral",t:"gn",b:"Aurelian Vey's guild hall, a tower that turns as you climb it"},
   {n:"the Legends' Promenade",t:"ns",b:"statues of the living, who sometimes come to visit themselves"},
   {n:"the Silent Garden",t:"s",b:"no sound carries here, by design or by accident"},
   {n:"the Observatory of Unagreeing Maps",t:"os",b:"star-charts of a dozen skies that refuse to line up"},
   {n:"the Starlit Salon",t:"n",b:"where the powerful drink, gossip, and make worlds' worth of deals"},
   {n:"the Last Stair",t:"s",b:"it leads up past where anyone admits to going"}]},
  {id:"docks",group:"Docks, Gates & Roots",name:"The Bough Docks",blurb:"Airship moorings along a great branch high above the bazaar.",places:[
   {n:"the Mooring Branches",t:"s",b:"airships tied to twigs as thick as towers"},
   {n:"the Harbormaster's Perch",t:"km",b:"a crow's nest office that sees every ship coming"},
   {n:"the Skyfreight Warehouses",t:"ms",b:"cargo from a hundred skies, some of it still moving"},
   {n:"the Updraft Tavern",t:"cg",b:"sky-sailors' tavern with a floor that sways a little"},
   {n:"Shipwright's Crook",t:"mg",b:"airships built and patched in the crook of a branch"},
   {n:"the Lookout Nest",t:"s",b:"the highest open point most people will ever stand"}]},
  {id:"gatewood",group:"Docks, Gates & Roots",name:"The Gatewood",blurb:"The great concourse of branch gates to other worlds, in three galleries running deeper into the Tree the farther the world.",places:[
   {n:"the Near Gallery",t:"s",b:"N-gates: bright, busy arches to neighboring worlds, a short walk in"},
   {n:"the Far Gallery",t:"s",b:"F-gates: quieter arches deeper in, to worlds days away by any other road"},
   {n:"the Fringe Gallery",t:"s",b:"X-gates: the dim far end, where the arches flicker and the numbering gets creative"},
   {n:"the Gatewardens' Lodge",t:"k",b:"keepers of the gate ledger and the reopening rites"},
   {n:"the Customs Hollow",t:"km",b:"where everything that crosses gets weighed, taxed, or confiscated"},
   {n:"the Arrivals Hall",t:"oc",b:"newcomers from every world, blinking at the light"}]},
  {id:"rootgate",group:"Docks, Gates & Roots",name:"The Rootgate",blurb:"The edge of the Roots, where the Tree's tunnels lead out between worlds.",places:[
   {n:"the Rootgate",t:"s",b:"a cavern-mouth of living root, where the maps run out"},
   {n:"the Last Lantern Post",t:"gk",b:"the final watch post, and the last warm meal"},
   {n:"the Tunnelers' Camp",t:"cgs",b:"diggers who chart the Roots, and sometimes don't come back"},
   {n:"the Rot Watch",t:"ks",b:"wardens who listen for sickness in the wood"},
   {n:"the Echo Galleries",t:"s",b:"tunnels that repeat your words a little wrong"},
   {n:"the Smugglers' Seam",t:"os",b:"a crack in the roots nobody officially knows about"}]}],
 tags:{"Local commoner":"c","Merchant":"m","Noble":"n","Guild":"g","Council":"k","Otherworldly being":"o"},
 gateGalleries:{near:"N",far:"F",fringe:"X"},
 worldNames:{
  "High fantasy":{a:["Aelmoor","Valdren","Silverrun","Elandor","Thornhallow","Brightmere","Caer Amon","Ivoryreach","Lindarra","Galespire"],b:["","the Shining Vale","the Seven Crowns","the Dawnlands","the Elder Realms"]},
  "Low fantasy / medieval":{a:["Oxbridge","Mardale","Greyfen","Hollins","Wealdmarch","Ashby","Coldwater","Brackenholt","Dunmere","Saltcote"],b:["","Shire","March","Hundred","Vale"]},
  "Dark fantasy / grimdark":{a:["Gravenhold","Mourncrag","Ashenveil","Blackmere","Vor Khal","Hollowmourn","Cinderwake","Wretchmoor","Dusk Harrow","Sorrowfen"],b:["","the Ashen Reach","the Last Kingdom","the Withered Lands"]},
  "Fey / whimsical":{a:["Glimmerdell","Thistlewick","Puddingstone","Moonmeadow","Fiddlefern","Dewhollow","Mallowmere","Twinklewood","Candlebrook","Quillfeather"],b:["","Hollow","Glade","Under-Hill","Downs"]},
  "Swashbuckling / nautical":{a:["Saltspire","Corsair's Rest","Tidebreak","the Brineholds","Port Merrow","Galleon Reach","Coralhaven","Stormwake","Seafoam Isles","Gullwind"],b:["","Isles","Archipelago","Straits","Main"]},
  "Steampunk / gaslamp":{a:["New Brassmouth","Cogsworth","Smoke Harbor","Gearhaven","Ironvale","Lamplight City","Coalbridge","Kettlewhistle","Rivetmoor","Copperton"],b:["","Reach","Union","Metropole","Concord"]},
  "Frontier / weird west":{a:["Dustwater","Hangman's Mesa","Redcliff","Lonesome Gulch","Silverspur","Rattlesnake Flats","Bone Creek","Tumblestone","Deadwick","Copper Canyon"],b:["","Territory","Badlands","Basin","Range"]},
  "Post-apocalyptic":{a:["Ashfall","the Rustlands","Glasshaven","Cinder Flats","Zero Mile","Scrapcastle","Dryreach","the Green Ruin","Tollgate","Kilnsprawl"],b:["","Wastes","Remnant","Expanse","Sprawl"]},
  "Planar / elemental":{a:["the Ember Reach","Tidecrown","the Stormspire","Glassdune","the Ashen Choir","Brinefire","the Quiet Lattice","Emberdeep","Skyforge","the Mirror Sea"],b:["","Plane","Reach","Expanse","Domain"]},
  "Modern":{a:["Greyport","Halverton","Millbrook","Northgate","Riverside","Easton","Westmere","Lakefield","Bayford","Kingsley"],b:["","City","Heights","Metro","Valley"]},
  "Cyberpunk / sci-fi":{a:["Neon Meridian","Kepler's Rest","Arcology Nine","Helix","Station Vesper","New Lagos Orbital","Chrome Delta","Sigma Reach","Vantablack","Solace Prime"],b:["","Sprawl","Station","Colony","Array"]},
  "_":{a:["Elsewhen","Driftmark","Farward","Hollowsky","Lastlight"],b:[""]}}};

const Places=(()=>{
  const T=()=>C.tables.places||DEFAULT_PLACES;
  const areas=()=>T().areas||[];
  const area=id=>areas().find(a=>a.id===id);
  const place=ref=>{const a=ref&&area(ref.a);return a?(a.places||[]).find(p=>p.n===ref.p)||null:null};
  const bare=s=>String(s).toLowerCase().replace(/^the /,"");
  const label=ref=>{const a=ref&&area(ref.a);if(!a)return "";return bare(ref.p)===bare(a.name)?a.name:`${cap(ref.p)}, ${a.name}`};
  const blurb=ref=>place(ref)?.b||"";
  function choose(list){if(!list.length)return null;const x=pick(list);return {a:x.a.id,p:x.p.n}}
  const all=filter=>areas().flatMap(a=>(a.places||[]).filter(p=>filter(a,p)).map(p=>({a,p})));
  /* where the quest giver can be found */
  function giver(h){const tag=(T().tags||{})[h.patron?.cat]||"c",tier=tierOf(h.rank);
    if(h.patron?.cat==="Guild"){const w=all((a,p)=>a.tier===tier&&p.t.includes("g"));if(w.length)return choose(w)}
    if(h.patron?.cat==="Noble"){const w=all((a,p)=>p.t.includes("n")&&(a.tier==null||a.tier<=Math.max(tier,2)));if(w.length)return choose(w)}
    return choose(all((a,p)=>p.t.includes(tag)&&(a.tier==null||a.tier<=tier+1)))||choose(all(()=>true))}
  /* where the quest happens (in the Tree); other worlds go through a gate instead */
  function site(h){const loc=String(h.location||""),tier=tierOf(h.rank);
    if(/City|bazaar/i.test(loc))return choose(all((a,p)=>a.group==="The Bazaar"&&p.t.includes("s")));
    if(/Inside the Tree/i.test(loc))return choose(all((a,p)=>p.t.includes("s")&&(a.group==="Inside the Tree"||a.id==="docks"||(a.tier!=null&&a.tier<=tier+1))));
    if(/Roots/i.test(loc))return choose(all((a,p)=>a.id==="rootgate"&&p.t.includes("s")))||{a:"rootgate",p:"the Rootgate"};
    return null}
  /* worlds: generated names that fit the genre, and unique gate IDs (ward prefix + number) */
  function worldName(genre){const W=T().worldNames||{},g=W[genre]||W["_"]||{a:["Elsewhere"],b:[""]},used=new Set((C.worlds||[]).map(w=>w.name));
    for(let i=0;i<40;i++){const a=pick(g.a),b=pick(g.b||[""]);const n=b&&Math.random()<0.4?(/^the /i.test(b)?`${a}, ${b}`:`${a} ${b}`):a;if(!used.has(n))return n}
    return `${pick(g.a)} ${(C.worlds||[]).length+1}`}
  /* gallery by how far the world is (the job's location roll), not its tier */
  function gallery(loc){const g=Object.assign({},DEFAULT_PLACES.gateGalleries,T().gateGalleries||{}),s=String(loc||"");return /far-flung|strange/i.test(s)?g.fringe:/distant/i.test(s)?g.far:g.near}
  function gateId(loc){const pre=gallery(loc),used=new Set((C.worlds||[]).map(w=>w.gate));
    for(let i=0;i<200;i++){const g=`Gate ${pre}-${String(1+rnd(99)).padStart(2,"0")}`;if(!used.has(g))return g}return `Gate ${pre}-${100+(C.worlds||[]).length}`}
  return {areas,area,place,label,blurb,giver,site,worldName,gateId,gallery};
})();
