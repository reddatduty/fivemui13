'use strict';

var $ = function(s,r){ return (r||document).querySelector(s); };
var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
var ico = function(id){ return '<svg><use href="#'+id+'"></use></svg>'; };
var money = function(n){ return '$ '+Number(n||0).toLocaleString('de-DE'); };
var kk = function(n){ return n>=1000000 ? Math.round(n/1000000)+'kk' : money(n); };
var cap = function(s){ s=String(s||''); return s.charAt(0).toUpperCase()+s.slice(1); };
var clamp = function(v,a,b){ return Math.max(a,Math.min(b,v)); };
var hash = function(s){ var h=2166136261; for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);} return Math.abs(h>>>0); };

var categories = [
  ['paint','Colors','Paint & Finish','Normal, matte, metallic, chrome and chameleon finishes.'],
  ['engine','Engine','Engine Stages','Stage 1–4 plus premium Stage 4 Turbo.'],
  ['suspension','Suspension','Suspension','Stock, street, sport, competition and ultra-low setups.'],
  ['armor','Armor','Vehicle Armor','Protection from stock through 100% armor.'],
  ['spoiler','Spoiler','Spoilers','Vehicle-specific wings, lips and performance spoilers.'],
  ['front_bumper','Front Bumper','Front Bumpers','Front bumper variants, splitters and race fascias.'],
  ['rear_bumper','Rear Bumper','Rear Bumpers','Rear bumper, diffuser and race bumper variants.'],
  ['side_skirt','Side Skirts','Side Skirts','Side skirts, blades and sill extensions.'],
  ['exhaust','Exhaust','Exhaust','Exhaust tips, dual systems and race pipes.'],
  ['frame','Frame','Frame / Chassis','Chassis and structural appearance variants.'],
  ['grille','Grille','Grilles','Mesh, slat, open and performance grille designs.'],
  ['hood','Hood','Hoods','Stock, vented, carbon and race hood options.'],
  ['left_fender','Left Fender','Left Fender','Vehicle-specific front fender variants.'],
  ['right_fender','Right Fender','Right Fender','Vehicle-specific front fender variants.'],
  ['roof','Roof','Roof','Roof panels, scoops, rails and carbon variants.'],
  ['plate_holder','Plate Holder','Plate Holder','Plate holder and mounting styles.'],
  ['trim','Interior Trim','Interior Trim','Trim packages for supported interiors.'],
  ['ornaments','Ornaments','Ornaments','Cabin ornaments and detail pieces.'],
  ['dashboard','Dashboard','Dashboard','Dashboard trim and display variants.'],
  ['dials','Dials','Dials','Gauge face, dial and cluster variants.'],
  ['door_speakers','Door Speakers','Door Speakers','Door audio hardware and visual packages.'],
  ['seats','Seats','Seats','Sport, race and premium seating variants.'],
  ['steering','Steering Wheel','Steering Wheels','Street, sport and race steering wheels.'],
  ['shifter','Shifter','Shifters','Gear lever and shifter designs.'],
  ['plaques','Plaques','Plaques','Dashboard and interior plaques.'],
  ['speakers','Speakers','Speakers','Rear and cabin audio installs.'],
  ['trunk','Trunk','Trunk','Trunk panels, audio builds and show setups.'],
  ['hydraulics','Hydraulics','Hydraulics','Hydraulic and show-car suspension hardware.'],
  ['engine_block','Engine Block','Engine Block','Engine bay cover and block appearance parts.'],
  ['air_filter','Air Filter','Air Filters','Intake and filter appearance variants.'],
  ['struts','Struts','Struts','Strut braces and tower reinforcement pieces.'],
  ['arch_covers','Arch Covers','Arch Covers','Wheel arch and overfender accessories.'],
  ['aerials','Aerials','Aerials','Roof and body aerial designs.'],
  ['secondary_trim','Secondary Trim','Secondary Trim','Additional interior and exterior trim.'],
  ['fuel_tank','Fuel Tank','Fuel Tank','Visible tank and fuel-system appearance options.'],
  ['windows','Windows','Window Accessories','Window accessories and visual variants.'],
  ['livery','Liveries','Liveries','Vehicle-specific graphic packages purchased with Diamante.'],
  ['neon','Neon','Underglow Neon','Custom colors plus premium rainbow underglow.'],
  ['headlights','Headlights','Headlight Color','Custom xenon colors plus premium rainbow lights.'],
  ['smoke','Tire Smoke','Tire Smoke','Custom tire smoke colors plus premium rainbow smoke.'],
  ['wheels','Wheels','Wheel Collection','Street, sport, tuner, track, high-end and specialty wheels.'],
  ['sounds','Engine Sounds','Engine Sound Library','30 profiles from 12kk to 500kk.']
].map(function(x,i){return{id:x[0],label:x[1],title:x[2],desc:x[3],index:i+1};});

var colorPairs = [
  ['#2cff74','#0c6e39'],['#3ec7ff','#1451b5'],['#ffb52f','#a65307'],['#ff557c','#8f1430'],
  ['#9d6dff','#4a1bb7'],['#55e6d4','#0b7065'],['#ff7040','#a63112'],['#e3ff5f','#718d0d'],
  ['#59a7ff','#1a4d9d'],['#ff70d3','#8f1d72'],['#74ffba','#177549'],['#f0f4ff','#61697d']
];

var artKinds = {
  paint:'palette',engine:'engine',suspension:'spring',armor:'shield',spoiler:'spoiler',front_bumper:'bumperFront',
  rear_bumper:'bumperRear',side_skirt:'skirt',exhaust:'exhaust',frame:'frame',grille:'grille',hood:'hood',
  left_fender:'fender',right_fender:'fender',roof:'roof',plate_holder:'plate',trim:'trim',ornaments:'ornament',
  dashboard:'dashboard',dials:'dials',door_speakers:'speaker',seats:'seat',steering:'steering',shifter:'shifter',
  plaques:'plaque',speakers:'speaker',trunk:'trunk',hydraulics:'hydraulic',engine_block:'engine',air_filter:'filter',
  struts:'strut',arch_covers:'arch',aerials:'aerial',secondary_trim:'trim',fuel_tank:'tank',windows:'window',
  livery:'livery',neon:'neon',headlights:'headlight',smoke:'smoke',wheels:'wheel',sounds:'sound'
};

function artShape(kind){
  var m = {
    palette:'<path d="M13 32c0-11 9-20 20-20s20 8 20 18c0 4-3 7-7 7h-5c-3 0-4 4-1 5 4 2 2 8-3 8h-4c-11 0-20-8-20-18Z" fill="rgba(255,255,255,.14)"/><circle cx="25" cy="24" r="4" fill="#ff5a68"/><circle cx="35" cy="20" r="4" fill="#ffc94a"/><circle cx="45" cy="25" r="4" fill="#5ee486"/><circle cx="28" cy="35" r="4" fill="#55b5ff"/>',
    engine:'<path d="M12 24h11l5-6h19l5 6h7v21H48l-5 7H24l-5-7h-7V24Z" fill="rgba(255,255,255,.16)"/><rect x="27" y="24" width="18" height="16" rx="2" fill="rgba(0,0,0,.25)"/><path d="M30 14h12M35 14v8M20 31h-8M52 31h8" stroke="rgba(255,255,255,.8)" stroke-width="3"/>',
    spring:'<path d="M27 9v8l10 5-20 8 20 8-20 8 20 8v7M49 9v8l8 4-16 7 16 7-16 7 16 7v12" fill="none" stroke="rgba(255,255,255,.82)" stroke-width="4"/>',
    shield:'<path d="M36 9 55 17v14c0 14-8 24-19 29-11-5-19-15-19-29V17l19-8Z" fill="rgba(255,255,255,.15)"/><path d="m27 34 6 6 13-14" fill="none" stroke="rgba(255,255,255,.88)" stroke-width="4"/>',
    spoiler:'<path d="M10 20h52l-7 9H17l-7-9Z" fill="rgba(255,255,255,.2)"/><path d="M20 29v23M52 29v23" stroke="rgba(255,255,255,.82)" stroke-width="4"/><path d="M15 50h42" stroke="rgba(255,255,255,.55)" stroke-width="3"/>',
    bumperFront:'<path d="M9 30 18 20h36l9 10-5 17H14L9 30Z" fill="rgba(255,255,255,.17)"/><path d="M17 36h38M25 43h22" stroke="rgba(255,255,255,.78)" stroke-width="3"/>',
    bumperRear:'<path d="M11 22h50l-4 24-10 7H25l-10-7-4-24Z" fill="rgba(255,255,255,.17)"/><path d="M18 39h36M22 47h9M41 47h9" stroke="rgba(255,255,255,.78)" stroke-width="3"/>',
    skirt:'<path d="M8 35h56l-8 11H16L8 35Z" fill="rgba(255,255,255,.18)"/><path d="M18 31h36" stroke="rgba(255,255,255,.72)" stroke-width="3"/>',
    exhaust:'<path d="M12 22h28l8 8h12v12H45l-9-9H12V22Z" fill="rgba(255,255,255,.15)"/><circle cx="56" cy="36" r="7" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="4"/><path d="M20 22v-7M30 22v-7" stroke="rgba(255,255,255,.7)" stroke-width="3"/>',
    frame:'<path d="M12 16h48v38H12z" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="4"/><path d="M12 30h48M28 16v38M44 16v38" stroke="rgba(255,255,255,.38)" stroke-width="3"/>',
    grille:'<rect x="11" y="18" width="50" height="36" rx="5" fill="rgba(255,255,255,.12)"/><path d="M17 25h38M17 32h38M17 39h38M17 46h38" stroke="rgba(255,255,255,.72)" stroke-width="3"/>',
    hood:'<path d="M18 13h36l10 42H8l10-42Z" fill="rgba(255,255,255,.16)"/><path d="M27 20h18l5 25H22l5-25Z" fill="rgba(0,0,0,.24)"/>',
    fender:'<path d="M9 50c3-20 13-32 27-32s24 12 27 32h-9c-2-12-8-20-18-20s-16 8-18 20H9Z" fill="rgba(255,255,255,.17)"/><circle cx="36" cy="48" r="12" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="3"/>',
    roof:'<path d="M13 47 24 18h24l11 29H13Z" fill="rgba(255,255,255,.17)"/><path d="M24 18 18 9M48 18l6-9" stroke="rgba(255,255,255,.7)" stroke-width="3"/>',
    plate:'<rect x="11" y="23" width="50" height="28" rx="4" fill="rgba(255,255,255,.18)"/><path d="M19 31h13M39 31h14M19 42h34" stroke="rgba(255,255,255,.76)" stroke-width="3"/>',
    trim:'<path d="M12 18h48v36H12z" fill="rgba(255,255,255,.12)"/><path d="m12 43 48-15M18 50l40-13" stroke="rgba(255,255,255,.78)" stroke-width="4"/>',
    ornament:'<path d="m36 10 7 14 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2 7-14Z" fill="rgba(255,255,255,.16)"/>',
    dashboard:'<path d="M10 23h52v27H10z" fill="rgba(255,255,255,.13)"/><circle cx="25" cy="37" r="8" fill="none" stroke="rgba(255,255,255,.78)" stroke-width="3"/><circle cx="47" cy="37" r="8" fill="none" stroke="rgba(255,255,255,.78)" stroke-width="3"/>',
    dials:'<circle cx="25" cy="35" r="13" fill="rgba(255,255,255,.12)"/><circle cx="48" cy="35" r="13" fill="rgba(255,255,255,.12)"/><path d="m25 35 6-7M48 35l-4-8" stroke="rgba(255,255,255,.85)" stroke-width="3"/>',
    speaker:'<rect x="13" y="12" width="46" height="48" rx="5" fill="rgba(255,255,255,.12)"/><circle cx="36" cy="38" r="13" fill="none" stroke="rgba(255,255,255,.78)" stroke-width="4"/><circle cx="36" cy="38" r="5" fill="rgba(255,255,255,.25)"/>',
    seat:'<path d="M26 12h19v24H29l-3 22H15l5-30V17c0-3 3-5 6-5Z" fill="rgba(255,255,255,.16)"/><path d="M29 36h25v12H27" fill="rgba(255,255,255,.12)"/>',
    steering:'<circle cx="36" cy="35" r="21" fill="none" stroke="rgba(255,255,255,.78)" stroke-width="5"/><circle cx="36" cy="35" r="5" fill="rgba(255,255,255,.25)"/><path d="M36 30V16M31 38 20 48M41 38l11 10" stroke="rgba(255,255,255,.76)" stroke-width="4"/>',
    shifter:'<circle cx="36" cy="17" r="8" fill="rgba(255,255,255,.18)"/><path d="M36 25v24M27 56h18l-4-12H31l-4 12Z" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.72)" stroke-width="3"/>',
    plaque:'<rect x="12" y="21" width="48" height="30" rx="3" fill="rgba(255,255,255,.15)"/><path d="M21 31h30M21 40h20" stroke="rgba(255,255,255,.76)" stroke-width="3"/>',
    trunk:'<path d="M13 20h46l-5 34H18l-5-34Z" fill="rgba(255,255,255,.15)"/><path d="M18 29h36" stroke="rgba(255,255,255,.75)" stroke-width="3"/>',
    hydraulic:'<path d="M24 12h8v42h-8zM40 18h8v36h-8z" fill="rgba(255,255,255,.18)"/><path d="M18 54h38M28 12V7M44 18v-6" stroke="rgba(255,255,255,.76)" stroke-width="4"/>',
    filter:'<path d="M12 26h20l9-9h18v38H41l-9-9H12V26Z" fill="rgba(255,255,255,.15)"/><path d="M44 23v26M50 23v26M56 23v26" stroke="rgba(255,255,255,.72)" stroke-width="3"/>',
    strut:'<path d="M15 54 28 17h16l13 37" fill="none" stroke="rgba(255,255,255,.78)" stroke-width="5"/><path d="M24 28h24M20 40h32" stroke="rgba(255,255,255,.45)" stroke-width="3"/>',
    arch:'<path d="M10 52c3-25 12-38 26-38s23 13 26 38h-9c-2-17-7-27-17-27S21 35 19 52h-9Z" fill="rgba(255,255,255,.17)"/>',
    aerial:'<path d="M36 55V18M36 18l10-9" stroke="rgba(255,255,255,.82)" stroke-width="4"/><circle cx="36" cy="57" r="6" fill="rgba(255,255,255,.2)"/>',
    tank:'<rect x="13" y="19" width="46" height="35" rx="8" fill="rgba(255,255,255,.15)"/><path d="M24 19v-7h24v7M20 32h32M36 32v15" stroke="rgba(255,255,255,.74)" stroke-width="3"/>',
    window:'<path d="M13 55 22 13h29l8 42H13Z" fill="rgba(255,255,255,.12)"/><path d="M25 20h22l5 27H19l6-27Z" fill="rgba(0,0,0,.25)" stroke="rgba(255,255,255,.45)" stroke-width="2"/>',
    livery:'<rect x="14" y="10" width="44" height="52" fill="rgba(255,255,255,.12)"/><path d="m14 45 44-20M14 57l44-20" stroke="rgba(255,255,255,.78)" stroke-width="5"/>',
    neon:'<path d="M12 46h48M20 39h32l6 7H14l6-7Z" fill="rgba(255,255,255,.13)"/><path d="M18 55h36" stroke="#8affb0" stroke-width="5"/>',
    headlight:'<path d="M15 18h17c15 0 24 8 24 18S47 54 32 54H15V18Z" fill="rgba(255,255,255,.13)"/><path d="m49 20 11-6M52 30h12M49 40l11 6" stroke="rgba(255,255,255,.78)" stroke-width="4"/>',
    smoke:'<path d="M11 51c0-8 6-13 14-13 1-9 7-14 15-14 10 0 15 7 15 15 9 0 14 5 14 12H11Z" fill="rgba(255,255,255,.19)"/><path d="M18 29c2-8 9-13 17-13M42 17c2-5 6-8 12-8" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3"/>',
    wheel:'<circle cx="36" cy="36" r="24" fill="rgba(0,0,0,.3)" stroke="rgba(255,255,255,.8)" stroke-width="4"/><circle cx="36" cy="36" r="7" fill="rgba(255,255,255,.22)"/><path d="M36 12v17M36 43v17M12 36h17M43 36h17M19 19l12 12M41 41l12 12M53 19 41 31M31 41 19 53" stroke="rgba(255,255,255,.68)" stroke-width="3"/>',
    sound:'<path d="M14 42h12l14 13V17L26 30H14v12Z" fill="rgba(255,255,255,.18)"/><path d="M49 27c8 7 8 16 0 23M56 20c13 12 13 26 0 38" fill="none" stroke="rgba(255,255,255,.78)" stroke-width="4"/>'
  };
  return m[kind] || m.trim;
}
function artFor(id,seed){
  var catIndex=Math.max(0,categories.findIndex(function(c){return c.id===id;}));
  var pair=colorPairs[(catIndex+(seed||0))%colorPairs.length];
  var kind=artKinds[id]||'trim';
  var gid='g'+id.replace(/[^a-z0-9]/g,'')+(seed||0);
  return '<svg viewBox="0 0 72 72" aria-hidden="true"><defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+pair[0]+'"/><stop offset="1" stop-color="'+pair[1]+'"/></linearGradient></defs><rect width="72" height="72" fill="#09100c"/><circle cx="55" cy="14" r="32" fill="url(#'+gid+')" opacity=".45"/><circle cx="13" cy="65" r="28" fill="url(#'+gid+')" opacity=".18"/><g>'+artShape(kind)+'</g><path d="M0 62h72" stroke="rgba(255,255,255,.08)"/></svg>';
}

var finishPrices={normal:{cash:50000},matte:{cash:90000},metallic:{cash:125000},chrome:{diamonds:95},chameleon:{diamonds:180}};
var swatches=[['Obsidian','#050807'],['Graphite','#252b28'],['Silver','#9fa8a3'],['Ice White','#edf4f0'],['Crimson','#d91836'],['Inferno','#ff4a21'],['Sunset','#ff8a1d'],['Gold','#d8a62a'],['Lime','#5eff42'],['Emerald','#0fc86c'],['Forest','#0a5e38'],['Mint','#59f2b7'],['Cyan','#2dd9ff'],['Electric Blue','#157dff'],['Royal Blue','#2836d8'],['Midnight','#10172f'],['Violet','#7a42ff'],['Purple','#a32cff'],['Hot Pink','#ff3ea7'],['Rose','#d64f71'],['Bronze','#9e633e'],['Sand','#c6ab75'],['Cream','#e4d8b4'],['Smoke','#4a5350']];

var engineStages=[
{id:'engine-stock',name:'Factory ECU',note:'Original engine calibration',price:{diamonds:0},code:'OEM',impact:{power:0,handling:0,style:0},speedGain:0},
{id:'engine-1',name:'Stage 1',note:'+15% maximum speed',price:{diamonds:95},code:'S1',impact:{power:18,handling:0,style:0},speedGain:15},
{id:'engine-2',name:'Stage 2',note:'+30% maximum speed',price:{diamonds:190},code:'S2',impact:{power:34,handling:0,style:0},speedGain:30},
{id:'engine-3',name:'Stage 3',note:'+45% maximum speed',price:{diamonds:310},code:'S3',impact:{power:52,handling:0,style:0},speedGain:45},
{id:'engine-4',name:'Stage 4',note:'+60% maximum speed',price:{diamonds:480},code:'S4',impact:{power:70,handling:0,style:0},speedGain:60},
{id:'engine-turbo',name:'Stage 4 Turbo',note:'Stage 4 plus a final +30% top-speed boost',price:{diamonds:650,lei:24},code:'4T',impact:{power:100,handling:4,style:12},speedGain:90,premium:true}
];
var suspension=[
{id:'susp-stock',name:'Stock Suspension',note:'Factory ride height',price:{cash:0},code:'OEM',impact:{power:0,handling:0,style:0}},
{id:'susp-street',name:'Street',note:'Subtle drop for daily use',price:{cash:85000},code:'S1',impact:{power:0,handling:6,style:5}},
{id:'susp-sport',name:'Sport',note:'Lower center of gravity',price:{cash:165000},code:'S2',impact:{power:0,handling:11,style:9}},
{id:'susp-competition',name:'Competition',note:'Aggressive track setup',price:{cash:290000},code:'S3',impact:{power:0,handling:17,style:12}},
{id:'susp-ultra',name:'Ultra Low',note:'Maximum supported drop',price:{cash:425000},code:'LOW',impact:{power:0,handling:13,style:20}}
];
var armor=[0,20,40,60,80,100].map(function(v,i){return{id:'armor-'+v,name:v?'Armor '+v+'%':'No Armor',note:v?'Reinforcement level '+v+'%':'Factory protection',price:{cash:[0,120000,250000,420000,680000,950000][i]},code:v?v+'%':'OEM',impact:{power:0,handling:Math.max(0,5-i),style:Math.round(v/12)},premium:v===100};});
var liveries=Array.from({length:14},function(_,i){return{id:'livery-'+i,name:i?'Livery '+String(i).padStart(2,'0'):'Factory Clean',note:i?['Street graphic package','Motorsport graphic package','Limited design collection'][i%3]:'No graphics applied',price:{diamonds:i?55+i*12:0},code:i?'L'+i:'OEM',impact:{power:0,handling:0,style:i?12+(i%5)*3:0},premium:i>=10};});
var lightColors=[['White','#f7ffff'],['Ice Blue','#bfe9ff'],['Electric Blue','#177dff'],['Cyan','#23e5ff'],['Mint','#6effc4'],['Lime','#72ff2f'],['Green','#13d964'],['Yellow','#ffe033'],['Amber','#ffac22'],['Orange','#ff6a1e'],['Red','#ff293f'],['Pink','#ff48af'],['Purple','#9d45ff'],['Violet','#653cff']];
var wheelGroups=['Street','Sport','Tuner','Track','High End','Muscle','Lowrider','Offroad'],wheels=[];
wheelGroups.forEach(function(group,g){for(var i=0;i<4;i++){var premium=g>=3&&i>=2;wheels.push({id:'wheel-'+g+'-'+i,name:group+' '+String(i+1).padStart(2,'0'),note:premium?'Premium forged collection':'Performance wheel design',price:premium?{diamonds:105+g*17+i*11}:{cash:190000+g*70000+i*45000},code:'W'+(i+1),impact:{power:0,handling:4+g,style:10+g*2},premium:premium});}});
var soundNames=['Compact I4','Street I4','Classic Inline-6','Modern V6','Sport V6','Touring V8','Muscle V8','Race V8','Flat-6 Sport','Twin-Turbo V6','Twin-Turbo V8','Supercharged V8','V10 Road','V10 Race','V12 Grand Tourer','V12 Performance','Boxer Rally','Turbo Rally','Drift I6','Street Racer V6','Street Racer V8','Track V8','Track V10','Hyper V8TT','Hyper V10','Hyper V12','Extreme I6','Extreme V8','Extreme V10','Apex Signature'];
var soundPrices=[12,18,25,35,45,58,72,88,105,122,140,158,178,198,220,242,265,288,310,330,350,370,392,414,436,455,472,485,495,500];
var sounds=soundNames.map(function(name,i){return{id:'sound-'+i,name:name,note:i>22?'Premium aggressive profile with pops':i>16?'Aggressive overrun / popping':'Street / performance profile',price:{cash:soundPrices[i]*1000000},code:String(i+1).padStart(2,'0'),impact:{power:i>22?2:0,handling:0,style:5+Math.floor(i/3)},premium:i>=23,pops:i>=17};});

function genericOptions(categoryId){
  var c=categories.find(function(x){return x.id===categoryId;});
  var names=['Factory / OEM','Street','Sport','Competition','Carbon','Forged / Premium'];
  return names.map(function(n,i){
    var premium=i===5;
    var display=i===0?'Factory '+c.label:c.label+' '+String(i).padStart(2,'0');
    return{id:categoryId+'-'+i,name:display,note:i===0?'Factory component':n+' '+c.label.toLowerCase()+' variant',price:premium?{diamonds:110+(c.index%7)*15}:{cash:i===0?0:85000+i*52000+(c.index%9)*12000},code:i===0?'OEM':String(i).padStart(2,'0'),impact:{power:categoryId==='engine_block'?i*3:0,handling:['frame','struts','arch_covers'].indexOf(categoryId)!==-1?i*2:0,style:i*5},premium:premium};
  });
}
function lightOptions(kind){
  var base=kind==='neon'?42:kind==='headlights'?55:35;
  var rainbow=kind==='neon'?190:kind==='headlights'?240:165;
  var arr=lightColors.map(function(x,i){return{id:kind+'-'+i,name:x[0],note:cap(kind)+' · '+x[1].toUpperCase(),price:{diamonds:base+i*2},code:'CLR',color:x[1],impact:{power:0,handling:0,style:8+i%4}};});
  arr.push({id:kind+'-rainbow',name:'Rainbow',note:'Premium animated multicolor effect',price:{diamonds:rainbow},code:'RGB',rainbow:true,premium:true,impact:{power:0,handling:0,style:28}});
  return arr;
}
function dataFor(id){
  if(id==='engine')return engineStages;
  if(id==='suspension')return suspension;
  if(id==='armor')return armor;
  if(id==='livery')return liveries;
  if(id==='wheels')return wheels;
  if(id==='sounds')return sounds;
  if(id==='neon'||id==='headlights'||id==='smoke')return lightOptions(id);
  return genericOptions(id);
}

var state={category:'paint',selected:{},preview:null,cart:new Map(),finish:'normal',color:'#111714',search:'',adding:false,locked:false,balances:{cash:12650000,bank:287066000,diamonds:1844,lei:1250}};
var el={app:$('#app'),rail:$('#categoryRail'),content:$('#partsContent'),scroll:$('#partsScroll'),search:$('#searchInput'),add:$('#addToBuild'),selectedArt:$('#selectedArt'),mini:$('#miniBuild'),drawer:$('#cartDrawer'),cartItems:$('#cartItems'),cartEmpty:$('#cartEmpty'),checkout:$('#checkoutButton'),payment:$('#paymentLayer'),cartTarget:$('#cartTarget'),cartSlots:$('#cartSlots'),canvas:$('#cartCanvas')};

function category(){return categories.find(function(c){return c.id===state.category;})||categories[0];}
function plainPrice(p){p=p||{};var a=[];if(p.cash)a.push(p.cash>=1000000?kk(p.cash):money(p.cash));if(p.diamonds)a.push(p.diamonds+' ◆');if(p.lei)a.push(p.lei+' L');return a.join(' + ')||'FREE';}
function priceHtml(p){p=p||{};var a=[];if(p.cash)a.push('<span class="price cash">'+ico('i-cash')+(p.cash>=1000000?kk(p.cash):money(p.cash))+'</span>');if(p.diamonds)a.push('<span class="price diamond">'+ico('i-diamond')+p.diamonds+'</span>');if(p.lei)a.push('<span class="price lei">'+ico('i-lei')+p.lei+'</span>');return a.length>1?'<div class="multi-price">'+a.join('')+'</div>':(a[0]||'<span class="price cash">FREE</span>');}
function goldRain(count){var s='<span class="gold-rain">';for(var i=0;i<count;i++){s+='<i style="--x:'+(5+(i*31)%90)+'%;--delay:-'+(((i*17)%13)/10)+'s;--dur:'+(1.6+((i*29)%13)/10)+'s"></i>';}return s+'</span>';}

function renderRail(){
  el.rail.innerHTML=categories.map(function(c){return'<button class="category-btn '+(state.category===c.id?'active':'')+'" data-category="'+c.id+'" data-label="'+c.label+'" title="'+c.label+'"><span class="category-art-mini">'+artFor(c.id,0)+'</span></button>';}).join('');
  $$('[data-category]',el.rail).forEach(function(btn){btn.onclick=function(){setCategory(btn.dataset.category);};});
}
function setCategory(id){
  if(state.locked||id===state.category)return;
  state.category=id;state.search='';el.search.value='';
  renderRail();
  el.content.animate([{opacity:.2,transform:'translateX(-8px)'},{opacity:1,transform:'none'}],{duration:230,easing:'cubic-bezier(.2,.8,.2,1)'});
  renderParts();el.scroll.scrollTop=0;
}
function optionCard(o,seed){
  var selected=state.selected[state.category],classes='option-card';
  if(selected&&selected.id===o.id)classes+=' selected';
  if(o.premium)classes+=' premium';
  var badges=(o.premium?'<span class="badge gold">PREMIUM</span>':'')+(o.pops?'<span class="badge">POPS</span>':'');
  return'<article class="'+classes+'" data-option="'+o.id+'">'+(o.premium?goldRain(8):'')+'<div class="option-thumb">'+artFor(state.category,seed||0)+'<span class="thumb-code">'+(o.code||'MOD')+'</span></div><div class="option-copy"><b>'+o.name+' '+badges+'</b><small>'+o.note+'</small></div><div class="option-price">'+priceHtml(o.price)+'</div></article>';
}
function renderOptions(items){
  var q=state.search.toLowerCase(),filtered=items.filter(function(o){return!q||(o.name+' '+o.note).toLowerCase().indexOf(q)!==-1;});
  if(!filtered.length)return'<div class="empty-options"><b>No matching parts</b>Try another search.</div>';
  return'<div class="option-list">'+filtered.map(function(o,i){return optionCard(o,i+1);}).join('')+'</div>';
}
function renderPaint(){
  var names={normal:'Normal',matte:'Matte',metallic:'Metallic',chrome:'Chrome',chameleon:'Chameleon'};
  var item=state.selected.paint||{id:'paint-current',name:cap(state.finish)+' · '+state.color.toUpperCase(),note:'Custom '+state.finish+' finish',price:finishPrices[state.finish],code:'CLR',impact:{power:0,handling:0,style:18},premium:state.finish==='chrome'||state.finish==='chameleon'};
  return'<div class="section-label"><span>Finish type</span><span>5 MATERIALS</span></div><div class="finish-tabs">'+Object.keys(names).map(function(k){var p=k==='chrome'||k==='chameleon';return'<button class="finish-tab '+(state.finish===k?'active ':'')+(p?'premium':'')+'" data-finish="'+k+'">'+names[k]+'</button>';}).join('')+'</div><div class="section-label"><span>Custom color</span><span>'+(state.finish==='chrome'||state.finish==='chameleon'?'DIAMANTE':'CASH')+'</span></div><div class="color-workbench"><div class="color-picker" style="--pick:'+state.color+'"><input id="nativeColor" type="color" value="'+state.color+'"></div><div class="color-value" style="--pick:'+state.color+'"><code>'+state.color.toUpperCase()+'</code></div></div><div class="section-label"><span>Palette</span><span>24 COLORS</span></div><div class="swatch-grid">'+swatches.map(function(x){return'<button class="swatch '+(state.color.toLowerCase()===x[1]?'active':'')+'" data-color="'+x[1]+'" style="--swatch:'+x[1]+'" title="'+x[0]+'"></button>';}).join('')+'</div><div class="section-label"><span>Selected finish</span><span>PREVIEW</span></div><div class="option-list">'+optionCard(item,3)+'</div>';
}
function renderEngine(){
  var selected=state.selected.engine||engineStages[0];
  return'<div class="section-label"><span>ECU calibration</span><span>+15% EACH STAGE</span></div><div class="stage-grid">'+engineStages.map(function(o){return'<article class="stage-card '+(selected.id===o.id?'selected ':'')+(o.premium?'premium':'')+'" data-option="'+o.id+'">'+(o.premium?goldRain(12):'')+'<small>'+(o.premium?'PREMIUM PERFORMANCE':'ENGINE CALIBRATION')+'</small><h3>'+o.name+(o.premium?' <span class="badge gold">TURBO</span>':'')+'</h3><p>'+o.note+'</p><div class="stage-price">'+priceHtml(o.price)+'</div></article>';}).join('')+'</div>';
}
function renderLights(id){
  var items=lightOptions(id),selected=state.selected[id];
  return'<div class="section-label"><span>Color library</span><span>'+items.length+' COLORS</span></div><div class="swatch-grid">'+items.map(function(o){return'<button class="swatch '+(o.rainbow?'rainbow ':'')+(selected&&selected.id===o.id?'active':'')+'" data-light="'+o.id+'" style="'+(o.color?'--swatch:'+o.color:'')+'" title="'+o.name+'"></button>';}).join('')+'</div>'+renderOptions(items);
}
function renderParts(){
  var c=category();
  $('#categoryKicker').textContent=String(c.index).padStart(2,'0')+' / '+c.label.toUpperCase();
  $('#categoryTitle').textContent=c.title;
  $('#categoryDescription').textContent=c.desc;
  if(c.id==='paint')el.content.innerHTML=renderPaint();
  else if(c.id==='engine')el.content.innerHTML=renderEngine();
  else if(c.id==='neon'||c.id==='headlights'||c.id==='smoke')el.content.innerHTML=renderLights(c.id);
  else el.content.innerHTML='<div class="section-label"><span>Available '+c.label+'</span><span>'+dataFor(c.id).length+' OPTIONS</span></div>'+renderOptions(dataFor(c.id));
  bindParts();
}
function bindParts(){
  $$('[data-option]',el.content).forEach(function(node){node.onclick=function(){var item=findOption(state.category,node.dataset.option);if(item)selectItem(item,node);};});
  $$('[data-finish]',el.content).forEach(function(btn){btn.onclick=function(){state.finish=btn.dataset.finish;previewPaint(btn);renderParts();};});
  $$('[data-color]',el.content).forEach(function(btn){btn.onclick=function(){state.color=btn.dataset.color;previewPaint(btn);renderParts();};});
  $$('[data-light]',el.content).forEach(function(btn){btn.onclick=function(){var item=lightOptions(state.category).find(function(o){return o.id===btn.dataset.light;});if(item)selectItem(item,btn);};});
  var nativeColor=$('#nativeColor',el.content);
  if(nativeColor){nativeColor.oninput=function(){state.color=nativeColor.value;previewPaint(nativeColor,false);var p=$('.color-picker',el.content),v=$('.color-value',el.content),code=$('.color-value code',el.content);if(p)p.style.setProperty('--pick',state.color);if(v)v.style.setProperty('--pick',state.color);if(code)code.textContent=state.color.toUpperCase();};nativeColor.onchange=function(){renderParts();};}
}
function findOption(id,optId){return dataFor(id).find(function(o){return o.id===optId;});}
function selectItem(item,source){state.selected[state.category]=item;state.preview={category:state.category,item:item,source:source};updateSelected();renderParts();if(item.premium)burstGold(source);}
function previewPaint(source,doToast){
  if(doToast===undefined)doToast=true;
  var premium=state.finish==='chrome'||state.finish==='chameleon';
  var item={id:'paint-current',name:cap(state.finish)+' · '+state.color.toUpperCase(),note:'Custom '+state.finish+' finish',price:finishPrices[state.finish],code:'CLR',impact:{power:0,handling:0,style:premium?25:18},premium:premium};
  state.selected.paint=item;state.preview={category:'paint',item:item,source:source};updateSelected();if(premium)burstGold(source);if(doToast)toast('Previewing <b>'+item.name+'</b>');
}
function updateSelected(){
  var p=state.preview;
  if(!p){$('#selectedTitle').textContent='Factory setup';$('#selectedSubtitle').textContent='Choose a part to preview it.';$('#selectedName').textContent='Nothing selected';$('#selectedPrice').textContent='—';el.selectedArt.innerHTML=artFor(state.category,0);el.add.disabled=true;setImpact({power:0,handling:0,style:0});return;}
  $('#selectedTitle').textContent=p.item.name;$('#selectedSubtitle').textContent=p.item.note;$('#selectedName').textContent=p.item.name;$('#selectedPrice').textContent=plainPrice(p.item.price);el.selectedArt.innerHTML=artFor(p.category,3);el.add.disabled=false;setImpact(p.item.impact||{power:0,handling:0,style:0});
}
function setImpact(impact){['Power','Handling','Style'].forEach(function(n){var k=n.toLowerCase(),v=clamp(Number(impact[k]||0),0,100);$('#impact'+n).style.width=v+'%';$('#impact'+n+'Text').textContent='+'+v+'%';});}
function cartKey(categoryId,item){return categoryId==='paint'||['engine','suspension','armor','livery','neon','headlights','smoke','wheels','sounds'].indexOf(categoryId)!==-1?categoryId:categoryId+':'+item.id;}
function cartTotals(){var t={cash:0,diamonds:0,lei:0};state.cart.forEach(function(x){t.cash+=Number(x.price.cash||0);t.diamonds+=Number(x.price.diamonds||0);t.lei+=Number(x.price.lei||0);});return t;}
function totalText(){var t=cartTotals(),a=[];if(t.cash)a.push(t.cash>=1000000?kk(t.cash):money(t.cash));if(t.diamonds)a.push(t.diamonds+' ◆');if(t.lei)a.push(t.lei+' L');return a.join(' · ')||'No parts selected';}

async function addPreview(){
  if(!state.preview||state.adding||state.locked)return;
  state.adding=true;
  var p=state.preview,key=cartKey(p.category,p.item);
  var source=p.source||$('.option-card.selected,.stage-card.selected',el.content)||$('.option-card',el.content);
  var slot=randomCartPoint(key);
  await flyCard(source,slot,p.item.premium);
  state.cart.set(key,{key:key,category:p.category,name:p.item.name,price:Object.assign({},p.item.price||{}),item:p.item,slot:slot});
  renderCart();
  impactCart(p.item.premium,slot);
  state.adding=false;
  toast('Added <b>'+p.item.name+'</b> to the cart');
}
function randomCartPoint(key){
  var h=hash(key+':slot');
  var x=18+(h%65),y=22+((h>>8)%48),r=-18+((h>>16)%37);
  return{x:x,y:y,r:r};
}
function flyCard(source,slot,premium){
  return new Promise(function(resolve){
    if(!source){resolve();return;}
    var r=source.getBoundingClientRect(),tr=el.cartTarget.getBoundingClientRect();
    var clone=source.cloneNode(true);clone.classList.add('fly-part');clone.style.left=r.left+'px';clone.style.top=r.top+'px';clone.style.width=r.width+'px';clone.style.height=r.height+'px';document.body.appendChild(clone);
    var centerX=window.innerWidth*.5-(r.left+r.width*.5),centerY=window.innerHeight*.5-(r.top+r.height*.5);
    var tx=tr.left+tr.width*(slot.x/100)-(r.left+r.width*.5),ty=tr.top+tr.height*(slot.y/100)-(r.top+r.height*.5);
    var anim=clone.animate([
      {offset:0,transform:'translate3d(0,0,0) scale(1)',opacity:1,filter:'blur(0)'},
      {offset:.38,transform:'translate3d('+centerX+'px,'+centerY+'px,0) scale(1.23)',opacity:1,filter:'blur(0)',boxShadow:'0 35px 90px rgba(0,0,0,.55)'},
      {offset:.50,transform:'translate3d('+centerX+'px,'+centerY+'px,0) scale(1.23)',opacity:1,filter:'blur(0)'},
      {offset:.82,transform:'translate3d('+(tx*.82)+'px,'+(ty*.82-40)+'px,0) scale(.42) rotate('+(premium?8:4)+'deg)',opacity:.96},
      {offset:1,transform:'translate3d('+tx+'px,'+ty+'px,0) scale(.06) rotate('+(slot.r)+'deg)',opacity:0,filter:'blur(1px)'}
    ],{duration:920,easing:'cubic-bezier(.16,.84,.2,1)',fill:'forwards'});
    anim.onfinish=function(){clone.remove();resolve();};
  });
}
function impactCart(premium,slot){
  el.cartTarget.classList.remove('impact');void el.cartTarget.offsetWidth;el.cartTarget.classList.add('impact');setTimeout(function(){el.cartTarget.classList.remove('impact');},450);
  var tr=el.cartTarget.getBoundingClientRect(),x=tr.left+tr.width*(slot.x/100),y=tr.top+tr.height*(slot.y/100);
  for(var i=0;i<12;i++){setTimeout(function(){spark(x,y,premium);},i*18);}
}
function spark(x,y,gold){
  var s=document.createElement('i');s.className='fly-spark'+(gold?' gold':'');s.style.left=x+'px';s.style.top=y+'px';var a=Math.random()*Math.PI*2,d=18+Math.random()*34;s.style.setProperty('--sx',(Math.cos(a)*d)+'px');s.style.setProperty('--sy',(Math.sin(a)*d)+'px');document.body.appendChild(s);setTimeout(function(){s.remove();},600);
}
function burstGold(node){if(!node)return;var r=node.getBoundingClientRect();for(var i=0;i<15;i++){setTimeout(function(){spark(r.left+r.width*(.2+Math.random()*.6),r.top+r.height*(.2+Math.random()*.6),true);},i*24);}}

function renderCart(){
  var items=Array.from(state.cart.values()),t=cartTotals();
  $('#cartBadge').textContent=items.length;$('#cart3dCount').textContent=items.length;$('#buildCount').textContent=items.length+' ITEM'+(items.length===1?'':'S');$('#buildTotal').textContent=totalText();el.cartEmpty.classList.toggle('hidden',items.length>0);el.checkout.disabled=!items.length;
  $('#totalCash').textContent=money(t.cash);$('#totalDiamonds').textContent=t.diamonds+' ◆';$('#totalLei').textContent=t.lei+' L';
  el.cartItems.innerHTML=items.map(function(x,i){return'<div class="cart-item"><div class="cart-item-art">'+artFor(x.category,i+2)+'</div><div><b>'+x.name+'</b><small>'+categoryLabel(x.category)+'</small></div><span class="cart-item-price">'+plainPrice(x.price)+'</span><button class="remove-item" data-remove="'+x.key+'">'+ico('i-close')+'</button></div>';}).join('');
  el.mini.innerHTML=items.length?items.slice(-6).map(function(x){return'<div class="mini-item"><span>'+x.name+'</span><span>'+plainPrice(x.price)+'</span></div>';}).join(''):'<div class="mini-empty">No parts queued.</div>';
  el.cartSlots.innerHTML=items.map(function(x){return'<span class="cart-drop-chip" style="--x:'+x.slot.x+'%;--y:'+x.slot.y+'%;--r:'+x.slot.r+'deg">'+shortCode(x.item)+'</span>';}).join('');
  $$('[data-remove]',el.cartItems).forEach(function(btn){btn.onclick=function(){state.cart.delete(btn.dataset.remove);renderCart();};});
}
function categoryLabel(id){var c=categories.find(function(x){return x.id===id;});return c?c.label:cap(id);}
function shortCode(item){return(item.code||item.name.slice(0,3)).toUpperCase().slice(0,4);}
function resetCategory(){if(state.locked)return;delete state.selected[state.category];if(state.preview&&state.preview.category===state.category)state.preview=null;if(state.category==='paint'){state.finish='normal';state.color='#111714';}renderParts();updateSelected();}
function toast(html){var n=document.createElement('div');n.className='toast';n.innerHTML=html;$('#toastStack').appendChild(n);setTimeout(function(){n.style.opacity='0';n.style.transform='translateX(10px)';setTimeout(function(){n.remove();},240);},2100);}
function updateWallet(){$('#cashBalance').textContent=money(state.balances.cash);$('#bankBalance').textContent=money(state.balances.bank);$('#diamondBalance').textContent=Number(state.balances.diamonds).toLocaleString('de-DE');$('#leiBalance').textContent=Number(state.balances.lei).toLocaleString('de-DE');}

function startPurchase(){
  if(!state.cart.size||state.locked)return;
  state.locked=true;el.app.classList.add('locked');el.drawer.classList.remove('open');
  var modes=[{name:'insert',label:'CARD INSERT',duration:1700},{name:'swipe',label:'CARD SWIPE',duration:1700},{name:'tap',label:'CONTACTLESS TAP',duration:1750}],mode=modes[Math.floor(Math.random()*modes.length)];
  $('#paymentModeLabel').textContent=mode.label;el.payment.className='payment-layer show mode-'+mode.name+' playing';
  setTimeout(function(){
    var count=state.cart.size;state.cart.clear();renderCart();toast('<b>'+count+' upgrade'+(count===1?'':'s')+' installed.</b>');
    setTimeout(function(){el.payment.className='payment-layer';el.app.classList.remove('locked');state.locked=false;closeUi();},380);
  },mode.duration);
}
function closeUi(){if(state.locked){toast('Purchase animation is still running.');return;}el.app.classList.add('closing');setTimeout(function(){el.app.classList.remove('closing');el.app.classList.add('closed');},410);}
function reopenUi(){el.app.classList.remove('closed');}
function bindGlobal(){
  el.search.oninput=function(e){state.search=e.target.value.trim();renderParts();};
  $('#resetCategory').onclick=resetCategory;el.add.onclick=addPreview;$('#undoPreview').onclick=resetCategory;
  $('#openCart').onclick=function(){if(!state.locked)el.drawer.classList.add('open');};$('#closeCart').onclick=function(){if(!state.locked)el.drawer.classList.remove('open');};
  $('#clearCart').onclick=function(){if(state.locked)return;state.cart.clear();renderCart();toast('Build cleared');};
  el.checkout.onclick=startPurchase;$('#closeGui').onclick=closeUi;$('#reopenUi').onclick=reopenUi;
  document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();el.search.focus();}if(e.key==='Escape'){if(state.locked){toast('Purchase animation is still running.');return;}if(el.drawer.classList.contains('open'))el.drawer.classList.remove('open');else closeUi();}});
}

/* Stationary renderer using the uploaded model.gltf geometry. */
var CART_POSITIONS=[0.3125,0.1875,0.5,-0.292969,0.1875,0.25,0.292969,0.1875,0.25,-0.3125,0.1875,0.5,-0.3125,0.4375,0.4375,0.3125,0.4375,0.4375,-0.3125,0.1875,0.5,0.3125,0.1875,0.5,-0.25,0.498134,-0.452658,0.25,0.498134,-0.452658,-0.3125,0.4375,0.4375,0.3125,0.4375,0.4375,-0.25,0.846131,-0.452514,0.25,0.846131,-0.452514,-0.25,0.498134,-0.452658,0.25,0.498134,-0.452658,-0.3125,0.935634,0.531717,0.3125,0.935634,0.531717,-0.3125,0.4375,0.4375,0.3125,0.4375,0.4375,-0.296875,0.685634,0.359842,0.296875,0.685634,0.359842,-0.3125,0.4375,0.4375,0.3125,0.4375,0.4375,-0.28125,0.964031,0.294299,0.28125,0.964031,0.294299,-0.296875,0.685634,0.359842,0.296875,0.685634,0.359842,-0.3125,0.682781,0.481799,0.3125,0.682781,0.481799,-0.296875,0.685634,0.359842,0.296875,0.685634,0.359842,-0.3125,0.4375,0.4375,-0.3125,0.935634,0.531717,-0.25,0.498134,-0.452658,-0.25,0.846131,-0.452514,0.3125,0.935634,0.531717,0.3125,0.4375,0.4375,0.25,0.846131,-0.452514,0.25,0.498134,-0.452658,-0.3125,0.997045,0.543332,0.3125,0.997045,0.543332,-0.3125,0.935634,0.531717,0.3125,0.935634,0.531717,-0.3125,1.058456,0.679947,0.3125,1.058456,0.679947,-0.3125,0.997045,0.543332,0.3125,0.997045,0.543332,0.273438,0.1875,0.0,-0.253906,0.1875,-0.25,0.253906,0.1875,-0.25,-0.273438,0.1875,0.0,-0.273438,0.1875,0.0,-0.292969,0.1875,0.25,0.292969,0.1875,0.25,0.273438,0.1875,0.0,-0.234375,0.1875,-0.5,-0.253906,0.1875,-0.25,0.253906,0.1875,-0.25,0.234375,0.1875,-0.5,-0.234375,0.002951,-0.506598,-0.253906,0.002951,-0.256598,-0.234375,0.1875,-0.5,-0.253906,0.1875,-0.25,-0.292969,0.002951,0.243402,-0.3125,0.002951,0.493402,-0.292969,0.1875,0.25,-0.3125,0.1875,0.5,0.253906,0.002951,-0.256598,0.234375,0.002951,-0.506598,0.253906,0.1875,-0.25,0.234375,0.1875,-0.5,0.3125,0.002951,0.493402,0.292969,0.002951,0.243402,0.3125,0.1875,0.5,0.292969,0.1875,0.25];
var CART_INDICES=[0,2,1,0,1,3,6,4,5,6,5,7,10,8,9,10,9,11,14,12,13,14,13,15,18,16,17,18,17,19,22,20,21,22,21,23,26,24,25,26,25,27,30,28,29,30,29,31,34,32,33,34,33,35,38,36,37,38,37,39,42,40,41,42,41,43,46,44,45,46,45,47,48,50,49,48,49,51,52,53,54,52,54,55,56,57,58,56,58,59,62,60,61,62,61,63,66,64,65,66,65,67,70,68,69,70,69,71,74,72,73,74,73,75];

function renderStaticCart(){
  var canvas=el.canvas,ctx=canvas.getContext('2d'),rect=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);
  canvas.width=Math.max(1,Math.round((rect.width||230)*dpr));canvas.height=Math.max(1,Math.round((rect.height||185)*dpr));
  var w=canvas.width,h=canvas.height,ry=-.62,rx=-.28,cy=.53,cz=.06,crY=Math.cos(ry),srY=Math.sin(ry),crX=Math.cos(rx),srX=Math.sin(rx),scale=Math.min(w,h)*1.52,verts=[];
  for(var i=0;i<CART_POSITIONS.length;i+=3){var x=CART_POSITIONS[i],y=CART_POSITIONS[i+1]-cy,z=CART_POSITIONS[i+2]-cz,x1=x*crY+z*srY,z1=-x*srY+z*crY,y2=y*crX-z1*srX,z2=y*srX+z1*crX,depth=2.55-z2,p=1/depth;verts.push({x:w*.5+x1*scale*p,y:h*.59-y2*scale*p,z:z2,x3:x1,y3:y2,z3:z2});}
  var tris=[];for(var j=0;j<CART_INDICES.length;j+=3){var a=verts[CART_INDICES[j]],b=verts[CART_INDICES[j+1]],c=verts[CART_INDICES[j+2]],ux=b.x3-a.x3,uy=b.y3-a.y3,uz=b.z3-a.z3,vx=c.x3-a.x3,vy=c.y3-a.y3,vz=c.z3-a.z3,nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,nl=Math.hypot(nx,ny,nz)||1;nx/=nl;ny/=nl;nz/=nl;tris.push({a:a,b:b,c:c,z:(a.z+b.z+c.z)/3,light:clamp(nx*.34+ny*.8+nz*.45,-.2,1)});}
  tris.sort(function(A,B){return A.z-B.z;});ctx.clearRect(0,0,w,h);
  tris.forEach(function(tr){var k=.50+tr.light*.40,r=Math.round(65*k),g=Math.round(230*k),b=Math.round(111*k);ctx.beginPath();ctx.moveTo(tr.a.x,tr.a.y);ctx.lineTo(tr.b.x,tr.b.y);ctx.lineTo(tr.c.x,tr.c.y);ctx.closePath();ctx.fillStyle='rgba('+r+','+g+','+b+',.95)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.13)';ctx.lineWidth=Math.max(1,dpr*.6);ctx.stroke();});
}
window.addEventListener('resize',renderStaticCart);

updateWallet();renderRail();renderParts();renderCart();updateSelected();bindGlobal();setTimeout(renderStaticCart,20);
