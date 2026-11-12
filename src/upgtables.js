/* Guild Upgrade default tables */
const DEFAULT_UPG_TABLES = {
  version: 1,
  goldBaseByLevel:[0,30,60,100,150,250,350,500,650,850,1100,1500,2000,2600,3300,4200,5300,6800,8500,10500,13000],
  perkLabels:{P:"Passive",A:"Active",B:"Boon",C:"Crafting"},
  grades:{
    Novice:{output:1,cap:"common",tier:0,jobs:0.5},
    Skilled:{output:2,cap:"common",tier:0,jobs:2},
    Expert:{output:3,cap:"uncommon",tier:2,jobs:1.5},
    Master:{output:4,cap:"rare",tier:3,jobs:2}
  },
  catalog:[
    {id:"common-room",cat:"Facilities",name:"Common Room",types:"PB",flavor:"Where the guild eats, argues, and pretends Mordecai's chair isn't sacred.",
     levels:[
      {name:"Hearth Hall",tier:0,jobs:1,days:2,perk:"Free Modest lifestyle between jobs. Patrons and NPCs can find the guild here."},
      {name:"Taproom",tier:1,jobs:2,days:6,perk:"Free Comfortable lifestyle, plus 1 free rumor each downtime."},
      {name:"Great Hall",tier:3,jobs:2,days:14,perk:"After a send-off feast, every PC starts the next adventure with Heroic Inspiration."}],
     addons:[{name:"Notice Board Nook",gp:5,perk:"A proper place to pin Job Board hooks."},{name:"Mordecai's Armchair",gp:15,perk:"He's marginally less grumpy. Marginally."},{name:"Bard's Corner",gp:30,perk:"Visiting performers: +1 rumor per downtime."},{name:"Trophy Wall",gp:40,perk:"One trophy per finished job. Once per tier, an impressed patron ups their incentive one rarity step."}]},
    {id:"kitchen",cat:"Facilities",name:"Kitchen",types:"AB",op:{skills:["Cook's Utensils"],makes:["hearty meals","hearty meals","hearty meals"]},flavor:"Something is always simmering. Nobody asks what.",
     levels:[
      {name:"Hearth Kitchen",tier:0,jobs:1,days:2,perk:"Free meals. The operator packs hearty meals: eaten on a short rest, a PC regains 1d4 extra HP."},
      {name:"Galley",tier:1,jobs:2,days:5,perk:"Hearty meals restore 2d4 extra HP, and travel rations are always covered."},
      {name:"Feast Kitchen",tier:3,jobs:1.5,days:12,perk:"Before an adventure, a feast grants each PC temp HP equal to 2 × their level."}],
     addons:[{name:"Spice Rack",gp:10,perk:"Guests remember the food. Flavor."},{name:"Cold Cellar",gp:25,perk:"Food never spoils; rations last twice as long."},{name:"Brewing Corner",gp:40,perk:"Guild ale: sells for 2d10 gp per downtime."}]},
    {id:"training-yard",cat:"Facilities",name:"Training Yard",types:"PB",flavor:"Packed dirt between two roots, scarred by every weapon in the multiverse.",
     levels:[
      {name:"Sparring Ring",tier:0,jobs:1.5,days:2,perk:"Downtime training (tools, languages) takes half the time."},
      {name:"Drill Grounds",tier:2,jobs:1,days:7,perk:"Retraining a feat, fighting style, skill, or spell costs no gold and takes half the time."},
      {name:"Proving Hall",tier:3,jobs:2.5,days:15,perk:"Once per adventure, each PC can reroll one failed attack roll or saving throw."}],
     addons:[{name:"Target Dummies",gp:10,perk:"Painted to look like rival guild members."},{name:"Climbing Wall",gp:20,perk:"Bark handholds; contests for bragging rights."},{name:"Archery Lane",gp:25,perk:"Ranged practice; weekly guild contests."}]},
    {id:"alchemy",cat:"Facilities",name:"Alchemist's Workshop",types:"AC",op:{skills:["Alchemist's Supplies"],makes:["Potions of Healing (half cost)","Greater Healing / uncommon potions & oils (half cost)","Superior Healing / rare potions (half cost)"]},flavor:"Copper, glass, and the faint smell of singed eyebrows.",
     levels:[
      {name:"Alchemist's Table",tier:0,jobs:2,days:1,perk:"The operator brews Potions of Healing at half cost."},
      {name:"Laboratory",tier:2,jobs:1.5,days:7,perk:"Adds Greater Healing and uncommon potions and oils (Expert+)."},
      {name:"Root Laboratory",tier:3,jobs:3,days:15,perk:"Adds Superior Healing and rare potions (Master). Output +1."}],
     addons:[{name:"Fume Hood",gp:15,perk:"No more singed eyebrows."},{name:"Ingredient Shelves",gp:25,perk:"+1 Potion of Healing per downtime."},{name:"Distillery Coil",gp:40,perk:"Antitoxin and alchemist's fire at half cost."}]},
    {id:"forge",cat:"Facilities",name:"Forge",types:"AC",op:{skills:["Smith's Tools"],makes:["mundane arms & ammo (half cost)","silvered/adamantine work, uncommon arms","rare arms, +1/+2 weapons & armor (discounted)"]},flavor:"A bellows that breathes with the Tree's sap-warmth.",
     levels:[
      {name:"Anvil & Bellows",tier:0,jobs:2.5,days:2,perk:"Free repairs; mundane weapons, armor, and ammo at half cost."},
      {name:"Smithy",tier:2,jobs:2,days:8,perk:"Silvered and adamantine conversions at half cost; uncommon arms (Expert+)."},
      {name:"Heartwood Forge",tier:3,jobs:3.5,days:18,perk:"Rare arms and +1/+2 weapons and armor (Master), at a discount."}],
     addons:[{name:"Quench Barrel",gp:10,perk:"Hisses dramatically. Flavor."},{name:"Ammo Mold",gp:25,perk:"20 free arrows, bolts, or bullets per downtime."},{name:"Whetstone Wheel",gp:30,perk:"Each PC's first weapon hit of an adventure deals +1d4."}]},
    {id:"library",cat:"Facilities",name:"Library",types:"AP",op:{skills:["Arcana","History"],makes:["clues about the next job's world","clues + free identification","clues + Root Archive answers"]},flavor:"Shelves grown, not built. Some books are from worlds that no longer exist.",
     levels:[
      {name:"Reading Nook",tier:0,jobs:1,days:1,perk:"The operator turns up clues about the next job's world (1 per output)."},
      {name:"Archive",tier:1,jobs:2.5,days:6,perk:"Free item identification; spell scrolls copied at half cost."},
      {name:"Root Archive",tier:3,jobs:2,days:15,perk:"Once per adventure, ask the Tree one question (Commune-style; cryptic unless a Master operates)."}],
     addons:[{name:"Reading Lamps",gp:5,perk:"Warm light. Mordecai complains about the oil."},{name:"Map Table",gp:20,perk:"Advantage on the first navigation check of each job."},{name:"Scrying Lens",gp:50,perk:"Glimpse the next job's location before setting out."}]},
    {id:"chapel",cat:"Facilities",name:"Root Chapel",types:"PB",op:{skills:["Medicine","Religion"],makes:["healing between jobs","cures for curses and disease","blessings for the road"]},flavor:"A hollow where the sap runs gold. People come back from the dead here, mostly intact.",
     levels:[
      {name:"Shrine",tier:0,jobs:2,days:2,perk:"Revival fee −25%. Lesser Restoration between adventures is free."},
      {name:"Chapel",tier:2,jobs:1.5,days:8,perk:"Revival fee −50%. Curses and diseases removed for free (needs an operator)."},
      {name:"Sanctum of Sap",tier:3,jobs:2.5,days:16,perk:"Revival fee −75% with no lingering penalty. Each PC starts the adventure with one Bless-style d4."}],
     addons:[{name:"Votive Candles",gp:5,perk:"Flavor. They never quite go out."},{name:"Memorial Bough",gp:20,perk:"Names of the fallen, carved in living wood."},{name:"Healing Spring",gp:35,perk:"Free healer's kits for the guild."}]},
    {id:"vault",cat:"Facilities",name:"Vault",types:"P",flavor:"Behind a door that only opens if you ask it nicely.",
     levels:[
      {name:"Strongroom",tier:0,jobs:1,days:2,perk:"Safe storage; no fees on CCV conversions."},
      {name:"Treasury",tier:1,jobs:2,days:6,perk:"The guild's credit is good: buy now, pay after the next job."},
      {name:"Pocket Vault",tier:3,jobs:2,days:12,perk:"Once per adventure, pull one stored item straight into your hand."}],
     addons:[{name:"Member Lockboxes",gp:10,perk:"One per member. Mordecai keeps the master key. Probably."},{name:"Coin-Sorter Imp",gp:30,perk:"Counts the treasury exactly. Talks the whole time."}]},
    {id:"greenhouse",cat:"Facilities",name:"Greenhouse",types:"AC",op:{skills:["Herbalism Kit","Nature"],makes:["healer's kits & herbs","spell components (50 gp each)","rare reagents"]},flavor:"Seeds smuggled home from a dozen worlds, all arguing over the sunlight.",
     levels:[
      {name:"Herb Beds",tier:0,jobs:1,days:1,perk:"Free healer's kits; herbalism costs halved."},
      {name:"Conservatory",tier:1,jobs:3,days:6,perk:"Grows spell components worth 50 gp per output each downtime, plus antitoxins."},
      {name:"Grafted Bough",tier:3,jobs:2,days:14,perk:"A cutting from another world's Tree: one rare reagent (halves a rare potion's cost) or a Goodberry batch per adventure."}],
     addons:[{name:"Mushroom Bed",gp:10,perk:"Edible. Mostly."},{name:"Talking Flytrap",gp:15,perk:"Excellent guard. Terrible conversationalist."},{name:"Sunlamp Crystal",gp:25,perk:"Plants from dark worlds thrive too."}]},
    {id:"couriers",cat:"Services",name:"Courier Sprites",types:"PA",flavor:"Tiny, fast, and unionized.",
     levels:[
      {name:"City Runs",tier:0,jobs:0.5,days:0,perk:"Messages delivered anywhere in the city the same day."},
      {name:"Branch Runs",tier:1,jobs:3,days:3,perk:"Messages cross branches to known worlds (once per adventure, Sending-style)."},
      {name:"Field Drops",tier:3,jobs:2,days:10,perk:"Once per adventure, a sprite delivers a small item or potion to the party mid-job."}]},
    {id:"rumors",cat:"Services",name:"Rumor Mill",types:"P",flavor:"A network of gossips, barkeeps, and one very nosy owl.",
     levels:[
      {name:"Ears",tier:0,jobs:0.5,days:0,perk:"+1 extra hook on each Job Board roll."},
      {name:"Whisper Network",tier:1,jobs:2,days:3,perk:"Reroll one Job Board hook per downtime."},
      {name:"Spymaster",tier:3,jobs:1.5,days:8,perk:"Learn one job's complication before accepting it."}]},
    {id:"fence",cat:"Services",name:"Fence & Broker",types:"PC",flavor:"Doesn't ask questions. Asks for a cut.",
     levels:[
      {name:"Loot Buyer",tier:0,jobs:1,days:1,perk:"Sell mundane loot at full price."},
      {name:"Broker",tier:1,jobs:4,days:4,perk:"Sell magic items at fair value; buy common items on request."},
      {name:"Procurer",tier:3,jobs:3,days:10,perk:"Source a specific uncommon or rare item within one adventure."}]},
    {id:"cartographer",cat:"Services",name:"Cartographer's Contract",types:"P",flavor:"Maps of places that refuse to stay put.",
     levels:[
      {name:"Local Charts",tier:0,jobs:1,days:1,perk:"Maps of the city and nearby worlds; advantage on navigation there."},
      {name:"Branch Atlas",tier:2,jobs:1.5,days:5,perk:"Travel time to known worlds is halved."},
      {name:"Branch Keys",tier:3,jobs:3.5,days:12,perk:"One single-use Branch Key per adventure: return to the hall from anywhere."}]},
    {id:"supply",cat:"Services",name:"Supply Contract",types:"P",flavor:"A standing order with the bazaar's least-terrible quartermaster.",
     levels:[
      {name:"Account",tier:0,jobs:1.5,days:1,perk:"Mundane gear −20%."},
      {name:"Preferred Account",tier:1,jobs:3.5,days:4,perk:"−30%, plus common consumables on account."},
      {name:"Outfitter",tier:3,jobs:2.5,days:10,perk:"−40%, plus a free basic restock (rations, ammo, kits) before each adventure."}]},
    {id:"trunk-guides",cat:"Services",name:"Trunk Guides",types:"P",flavor:"Folk who know the Trunk's shortcuts, and which ones bite.",
     levels:[
      {name:"Pathfinder",tier:0,jobs:2,days:1,perk:"The party never gets lost in the Trunk."},
      {name:"Escort",tier:2,jobs:2,days:6,perk:"A guide joins travel legs as a non-combat NPC."},
      {name:"Private Branch Gate",tier:4,jobs:1.5,days:18,perk:"A gate in the hall opening to any world the guild has visited."}]},
    {id:"steward",cat:"Staff",name:"Steward",types:"P",skills:["Guild Administration"],flavor:"Runs the hall so Mordecai doesn't have to. Mordecai disapproves anyway.",
     levels:[{name:"Skilled Steward",grade:"Skilled",tier:0,jobs:2,days:0,perk:"Build times −10%."},{name:"Expert Steward",grade:"Expert",tier:2,jobs:1.5,days:1,perk:"Build times −25%."},{name:"Master Steward",grade:"Master",tier:3,jobs:2,days:3,perk:"Build times −50%."}],
     addons:[{name:"Novice apprentice",gp:20,perk:"A Novice instead: cheap, eager, occasionally helpful."}]},
    {id:"quartermaster",cat:"Staff",name:"Quartermaster",types:"P",skills:["Persuasion"],flavor:"Haggles like it's a blood sport.",
     levels:[{name:"Skilled Quartermaster",grade:"Skilled",tier:0,jobs:2,days:0,perk:"An extra −5% on Supply Contract purchases."},{name:"Expert Quartermaster",grade:"Expert",tier:2,jobs:1.5,days:1,perk:"An extra −10%."},{name:"Master Quartermaster",grade:"Master",tier:3,jobs:2,days:3,perk:"An extra −15%, and rare stock shows up first."}],
     addons:[{name:"Novice apprentice",gp:20,perk:"A Novice instead."}]},
    {id:"cook",cat:"Staff",name:"Cook",types:"A",skills:["Cook's Utensils"],flavor:"Operates the Kitchen.",
     levels:[{name:"Skilled Cook",grade:"Skilled",tier:0,jobs:2,days:0,perk:"Runs the Kitchen at Skilled output."},{name:"Expert Cook",grade:"Expert",tier:2,jobs:1.5,days:1,perk:"Expert output."},{name:"Master Cook",grade:"Master",tier:3,jobs:2,days:3,perk:"Master output; feasts also grant advantage on the first Constitution save of the adventure."}],
     addons:[{name:"Novice apprentice",gp:20,perk:"A Novice instead."}]},
    {id:"healer",cat:"Staff",name:"Healer",types:"A",skills:["Medicine"],flavor:"Operates the Root Chapel.",
     levels:[{name:"Skilled Healer",grade:"Skilled",tier:0,jobs:2,days:0,perk:"Operates the Root Chapel."},{name:"Expert Healer",grade:"Expert",tier:2,jobs:1.5,days:1,perk:"Expert output."},{name:"Master Healer",grade:"Master",tier:3,jobs:2,days:3,perk:"One free Revivify per tier-up."}],
     addons:[{name:"Novice apprentice",gp:20,perk:"A Novice instead."}]},
    {id:"scholar",cat:"Staff",name:"Scholar",types:"A",skills:["Arcana","History"],flavor:"Operates the Library.",
     levels:[{name:"Skilled Scholar",grade:"Skilled",tier:0,jobs:2,days:0,perk:"Operates the Library."},{name:"Expert Scholar",grade:"Expert",tier:2,jobs:1.5,days:1,perk:"Expert output."},{name:"Master Scholar",grade:"Master",tier:3,jobs:2,days:3,perk:"Root Archive answers come clearly."}],
     addons:[{name:"Novice apprentice",gp:20,perk:"A Novice instead."}]},
    {id:"smith",cat:"Staff",name:"Smith",types:"AC",skills:["Smith's Tools"],flavor:"Operates the Forge.",
     levels:[{name:"Skilled Smith",grade:"Skilled",tier:0,jobs:2,days:0,perk:"Operates the Forge."},{name:"Expert Smith",grade:"Expert",tier:2,jobs:1.5,days:1,perk:"Uncommon arms."},{name:"Master Smith",grade:"Master",tier:3,jobs:2,days:3,perk:"Rare arms; output +1."}],
     addons:[{name:"Novice apprentice",gp:20,perk:"A Novice instead."}]},
    {id:"alchemist",cat:"Staff",name:"Alchemist",types:"AC",skills:["Alchemist's Supplies"],flavor:"Operates the Alchemist's Workshop.",
     levels:[{name:"Skilled Alchemist",grade:"Skilled",tier:0,jobs:2,days:0,perk:"Operates the Workshop."},{name:"Expert Alchemist",grade:"Expert",tier:2,jobs:1.5,days:1,perk:"Uncommon potions and oils."},{name:"Master Alchemist",grade:"Master",tier:3,jobs:2,days:3,perk:"Rare potions; output +1."}],
     addons:[{name:"Novice apprentice",gp:20,perk:"A Novice instead."}]},
    {id:"gardener",cat:"Staff",name:"Gardener",types:"A",skills:["Herbalism Kit","Nature"],flavor:"Operates the Greenhouse.",
     levels:[{name:"Skilled Gardener",grade:"Skilled",tier:0,jobs:2,days:0,perk:"Operates the Greenhouse."},{name:"Expert Gardener",grade:"Expert",tier:2,jobs:1.5,days:1,perk:"Expert output."},{name:"Master Gardener",grade:"Master",tier:3,jobs:2,days:3,perk:"Grafted Bough yields twice per adventure."}],
     addons:[{name:"Novice apprentice",gp:20,perk:"A Novice instead."}]}
  ],
  offers:{
    typeWeightsByTier:{Iron:{unique:45,deal:40,hire:15},Bronze:{unique:55,deal:30,hire:15},Silver:{unique:60,deal:25,hire:15},Gold:{unique:65,deal:15,hire:20},Platinum:{unique:65,deal:10,hire:25}},
    discounts:[15,20,25,30,40],
    dealReasons:["a rival guild's leftover materials","a bankrupt builder clearing stock","a branch-merchant who owes Mordecai a favor","off-season rates in the carpenters' quarter","a contractor who wants the guild's name on their portfolio","materials 'found' after a Trunk storm"],
    vendors:{
      Any:["a traveling contractor with a cart of oddities","a branch-merchant passing through the bazaar","a retired adventurer selling off their old hall"],
      "High fantasy":["a dwarven building clan","an elven artisan on pilgrimage"],
      "Low fantasy / medieval":["a guild of village masons","a wandering carpenter-monk"],
      "Dark fantasy / grimdark":["a gaunt undertaker-architect","a cult that swears it's reformed"],
      "Fey / whimsical":["a fey tinker who trades in favors","a pixie building crew (paid in honey)"],
      "Swashbuckling / nautical":["a retired shipwright","a pirate quartermaster with 'surplus'"],
      "Steampunk / gaslamp":["a clockwork contractor","a gaslamp engineering firm"],
      "Frontier / weird west":["a snake-oil salesman (mostly honest)","a frontier homesteader's co-op"],
      "Post-apocalyptic":["a scrapper caravan","a vault-dweller trading tech for food"],
      "Planar / elemental":["a djinn with a sideline in renovations","an elemental binding guild"],
      "Modern":["a confused contractor from a world with power tools","a corporate facilities rep"],
      "Cyberpunk / sci-fi":["a chrome-armed fixer","a decommissioned maintenance android"]
    },
    unique:{
      Any:[
        {name:"Talking Portrait of a Previous Tenant",cat:"Facilities",jobs:0.5,days:0,perk:"Knows the hall's secrets; once per tier, reveals one useful one."},
        {name:"Bottomless Bathtub",cat:"Facilities",jobs:1,days:2,perk:"A long soak removes one level of exhaustion between adventures."},
        {name:"Hall of Echoes",cat:"Facilities",jobs:1.5,days:4,perk:"Speak a member's name and they hear you, anywhere in the city."},
        {name:"Lost-and-Found Closet",cat:"Facilities",jobs:1,days:1,perk:"Once per downtime, roll on a trinket table: something from another world turns up."},
        {name:"Guild Familiar",cat:"Staff",jobs:1,days:0,perk:"A sardonic cat (or similar) that delivers messages around the hall and spies on visitors."},
        {name:"Heirloom Banner",cat:"Facilities",jobs:1.5,days:2,perk:"Carried on a job, once per adventure allies who can see it gain advantage on one save against fear."}],
      "High fantasy":[
        {name:"Griffon Roost",cat:"Facilities",jobs:2.5,days:6,perk:"Once per adventure, a griffon carries a message, a small item, or one creature home."},
        {name:"Dwarven Rune-Anvil",cat:"Facilities",jobs:2,days:5,perk:"Forge add-on: one weapon per downtime gains a minor property (glows, never rusts, or counts as magical)."}],
      "Low fantasy / medieval":[
        {name:"Tithe-Barn Granary",cat:"Facilities",jobs:1.5,days:4,perk:"Free rations for the guild; sell surplus for 1d6 × 10 gp per downtime."},
        {name:"Bell Tower",cat:"Facilities",jobs:1,days:3,perk:"The guild hears of city emergencies first: +1 hook on Council-assigned rolls."}],
      "Dark fantasy / grimdark":[
        {name:"Ossuary Bell",cat:"Facilities",jobs:1.5,days:3,perk:"Rings when a member dies inside the Tree. Revival fee −10% (stacks with the Chapel)."},
        {name:"Plague Doctor's Cabinet",cat:"Services",jobs:1.5,days:2,perk:"Free antitoxins; diseases and poisons treated between jobs."}],
      "Fey / whimsical":[
        {name:"Door That Knows",cat:"Facilities",jobs:1,days:1,perk:"Opens to whichever room you actually need. Flavor, mostly."},
        {name:"Fairy Ring Lawn",cat:"Facilities",jobs:2,days:5,perk:"After a night of revelry, each PC can reroll one Charisma check during the next adventure."}],
      "Swashbuckling / nautical":[
        {name:"Smuggler's Hold",cat:"Facilities",jobs:1.5,days:4,perk:"Hidden compartments; loot sold through the guild fetches +10%."},
        {name:"Crow's Nest Spyglass",cat:"Services",jobs:1,days:1,perk:"+1 hook from coastal and seafaring worlds on each Job Board roll."}],
      "Steampunk / gaslamp":[
        {name:"Pneumatic Tube Network",cat:"Services",jobs:1.5,days:4,perk:"Instant messages within the hall and to three city addresses."},
        {name:"Clockwork Porter",cat:"Staff",jobs:2,days:0,perk:"Hauls 300 lb of gear to and from any branch."}],
      "Frontier / weird west":[
        {name:"Hitching Post of Far Trails",cat:"Facilities",jobs:2,days:4,perk:"Stabled mounts wait for the party at any branch exit."},
        {name:"Snake-Oil Still",cat:"Facilities",jobs:1,days:2,perk:"Tonics grant 1d4 temp HP. 1 in 6 has a harmless side effect."}],
      "Post-apocalyptic":[
        {name:"Scrap Workshop",cat:"Facilities",jobs:1.5,days:3,perk:"Jury-rig and repair anything; free improvised gear."},
        {name:"Sealed Pantry",cat:"Facilities",jobs:1,days:2,perk:"Food never spoils; the Kitchen's hearty meals count double."}],
      "Planar / elemental":[
        {name:"Bottled Elemental Hearth",cat:"Facilities",jobs:2.5,days:5,perk:"A bound fire elemental heats the hall; Forge and Kitchen build times −25%."},
        {name:"Gate-Shard Window",cat:"Facilities",jobs:2,days:4,perk:"Peer into one known world per downtime: one clue."}],
      "Modern":[
        {name:"Bottomless Coffee Machine",cat:"Facilities",jobs:1,days:1,perk:"Once per adventure, one PC can reroll an initiative roll."},
        {name:"Electric Lighting",cat:"Facilities",jobs:1,days:2,perk:"The hall never goes dark; Library research is faster."}],
      "Cyberpunk / sci-fi":[
        {name:"Holo-Training Sim",cat:"Facilities",jobs:2.5,days:6,perk:"Training Yard add-on: once per adventure, advantage on one check against a creature type you've simmed."},
        {name:"Med-Pod",cat:"Facilities",jobs:3,days:6,perk:"Root Chapel add-on: revival fee −10%; no lingering penalty."}]
    },
    hires:[
      {role:"Cook",arch:"retired dragon-hunter",skills:["Cook's Utensils"],grade:"Expert",quirk:"keeps a scale from every dragon they've cooked"},
      {role:"Scholar",arch:"clockwork scribe",skills:["History","Calligrapher's Supplies"],grade:"Expert",quirk:"files everything, including people"},
      {role:"Alchemist",arch:"exiled fey alchemist",skills:["Alchemist's Supplies"],grade:"Master",quirk:"answers questions with riddles"},
      {role:"Smith",arch:"quiet gnome smith",skills:["Smith's Tools","Tinker's Tools"],grade:"Expert",quirk:"hums one song, endlessly"},
      {role:"Scholar",arch:"ghost librarian",skills:["Arcana","History"],grade:"Master",quirk:"can't leave the Library; very strict about returns"},
      {role:"Healer",arch:"disgraced court healer",skills:["Medicine"],grade:"Expert",quirk:"won't say whose court"},
      {role:"Quartermaster",arch:"sky-pirate quartermaster",skills:["Persuasion"],grade:"Expert",quirk:"counts everything twice"},
      {role:"Gardener",arch:"mushroom-folk gardener",skills:["Herbalism Kit","Nature"],grade:"Skilled",quirk:"communicates in spores when upset"},
      {role:"Steward",arch:"former noble's majordomo",skills:["Guild Administration"],grade:"Expert",quirk:"constantly corrects Mordecai's posture"}
    ]
  },
  names:{first:["Bram","Ottilie","Fennick","Saro","Mags","Ilwen","Corvo","Dabble","Hesk","Prudence","Tamsin","Juniper","Grizzle","Wren","Osric","Lune","Pip","Varga","Thistle","Ambrose"],
         last:["Copperkettle","Underbough","Ashgrove","Mossfoot","Quill","Ironroot","Hearthwell","Larkspur","Saltmarsh","Thornbury","Vane","Burrow"]},
  complications:["A rival guild bids on the same materials, and the price climbs 10% unless the party intervenes.","The builders hit a pocket of something living inside the Tree. Build delayed 1d4 days.","It works, with one odd side effect (it hums, glows, or attracts squirrels).","A Council inspector wants paperwork nobody filed.","The contractor is secretly using the job to smuggle something.","The Tree reshapes the room overnight: better than planned, but different.","A materials shipment goes missing in the Trunk.","Mordecai 'improves' the plans without telling anyone."]
};
/* Price reference (PHB/DMG baseline), editable */
const DEFAULT_PRICES={rule:"1 gp ≈ one day of modest living. Copper and silver are everyday money; gold is for gear, services, and big purchases.",rows:[["Mug of ale / loaf of bread","4 cp / 2 cp"],["Inn, one night (modest / comfortable)","5 sp / 8 sp"],["Meals, one day (modest / comfortable)","3 sp / 5 sp"],["Lifestyle per day (poor / modest / comfortable / wealthy)","2 sp / 1 gp / 2 gp / 4 gp"],["Unskilled / skilled hireling, per day","2 sp / 2 gp"],["Messenger / coach / ship passage","2 cp/mi / 3 cp/mi / 1 sp/mi"],["Torch / rope / rations (per day)","1 cp / 1 gp / 5 sp"],["Backpack / healer's kit / tool kit","2 gp / 5 gp / 5–50 gp"],["Dagger / longsword / shortbow","2 / 15 / 25 gp"],["Chain mail / plate armor","75 / 1,500 gp"],["Riding horse / cart","75 / 15 gp"],["Potion of Healing","50 gp"],["Spellcasting service (cantrip / 1st / 2nd / 3rd)","30 / 50 / 200 / 300 gp"],["Spellcasting service (4th–5th / 6th–8th / 9th)","2,000 / 20,000 / 100,000 gp"],["Magic items (common / uncommon / rare / very rare / legendary)","100 / 400 / 4,000 / 40,000 / 200,000 gp"]]};
