'use strict';

var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var ico=function(id){return '<svg><use href="#'+id+'"></use></svg>'};
var money=function(n){return '$ '+Number(n||0).toLocaleString('de-DE')};
var kk=function(n){return n>=1000000?Math.round(n/1000000)+'kk':money(n)};
var cap=function(s){s=String(s||'');return s.charAt(0).toUpperCase()+s.slice(1)};
var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};

var categories=[
  {id:'paint',label:'Paint & Finish',sub:'Color / material',icon:'i-paint',group:'EXTERIOR',title:'Paint & Finish',desc:'Choose paint material, color and premium finishes.'},
  {id:'engine',label:'Engine',sub:'Stage upgrades',icon:'i-engine',group:'PERFORMANCE',title:'Engine Stages',desc:'Progressive ECU stages with visible power and speed gains.'},
  {id:'transmission',label:'Transmission',sub:'Gear response',icon:'i-transmission',group:'PERFORMANCE',title:'Transmission',desc:'Sharper shifts and stronger high-speed gearing.'},
  {id:'brakes',label:'Brakes',sub:'Stopping power',icon:'i-brakes',group:'PERFORMANCE',title:'Brake System',desc:'Upgrade brake response from stock to competition level.'},
  {id:'suspension',label:'Suspension',sub:'Ride height',icon:'i-suspension',group:'HANDLING',title:'Suspension',desc:'Factory, street, sport and competition suspension.'},
  {id:'stance',label:'Stance',sub:'Camber / offset',icon:'i-stance',group:'HANDLING',title:'Stance Setup',desc:'Fine-tune ride height, camber and wheel track width.'},
  {id:'armor',label:'Armor',sub:'Protection',icon:'i-armor',group:'PROTECTION',title:'Vehicle Armor',desc:'Add progressively stronger body reinforcement.'},
  {id:'turbo',label:'Turbo',sub:'Forced induction',icon:'i-turbo',group:'PERFORMANCE',title:'Turbo System',desc:'From street boost to the premium Stage 4 Turbo package.'},
  {id:'body',label:'Body Parts',sub:'Exterior mods',icon:'i-body',group:'EXTERIOR',title:'Body Components',desc:'Spoilers, bumpers, hood, roof, skirts, exhaust and more.'},
  {id:'wheels',label:'Wheels',sub:'32 designs',icon:'i-wheel',group:'WHEELS',title:'Wheel Collection',desc:'Street, sport, tuner, track, high-end and specialty wheels.'},
  {id:'livery',label:'Liveries',sub:'Graphic sets',icon:'i-livery',group:'STYLE',title:'Liveries',desc:'Vehicle-specific graphic packages purchased with Diamante.'},
  {id:'neon',label:'Neon',sub:'Underglow',icon:'i-neon',group:'LIGHTING',title:'Underglow Neon',desc:'Custom RGB-style presets plus premium rainbow lighting.'},
  {id:'headlights',label:'Headlights',sub:'Xenon color',icon:'i-headlight',group:'LIGHTING',title:'Headlight Color',desc:'Custom xenon colors with a premium rainbow option.'},
  {id:'windows',label:'Window Tint',sub:'Glass level',icon:'i-window',group:'EXTERIOR',title:'Window Tint',desc:'From clear glass to blackout and premium color-shift tint.'},
  {id:'smoke',label:'Tire Smoke',sub:'Smoke color',icon:'i-smoke',group:'EFFECTS',title:'Tire Smoke',desc:'Pick a smoke color or premium animated rainbow smoke.'},
  {id:'sounds',label:'Engine Sound',sub:'30 profiles',icon:'i-sound',group:'AUDIO',title:'Engine Sound Library',desc:'30 profiles from basic street notes to premium aggressive sounds.'},
  {id:'plate',label:'Plate',sub:'Frame / style',icon:'i-plate',group:'DETAILS',title:'Plate Style',desc:'Plate frame and finish presets for the final detail.'}
];

var finishPrices={
  normal:{cash:50000},
  matte:{cash:90000},
  metallic:{cash:125000},
  chrome:{diamonds:95},
  chameleon:{diamonds:180}
};

var swatches=[
  ['Obsidian','#050807'],['Graphite','#242a27'],['Silver','#9ca5a0'],['Ice White','#eef4f0'],
  ['Crimson','#d91836'],['Inferno','#ff4a21'],['Sunset','#ff8a1d'],['Gold','#d5a428'],
  ['Lime','#5eff42'],['Emerald','#0fc86c'],['Forest','#0a5e38'],['Mint','#59f2b7'],
  ['Cyan','#2dd9ff'],['Electric Blue','#157dff'],['Royal Blue','#2836d8'],['Midnight','#10172f'],
  ['Violet','#7a42ff'],['Purple','#a32cff'],['Hot Pink','#ff3ea7'],['Rose','#d64f71'],
  ['Bronze','#9e633e'],['Sand','#c6ab75'],['Cream','#e4d8b4'],['Smoke','#4a5350']
];

var engineStages=[
  {id:'engine-stock',name:'Factory ECU',note:'Original engine calibration',price:{diamonds:0},icon:'OEM',impact:{power:0,handling:0,style:0},speedGain:0},
  {id:'engine-1',name:'Stage 1',note:'+15% maximum speed',price:{diamonds:95},icon:'S1',impact:{power:18,handling:0,style:0},speedGain:15},
  {id:'engine-2',name:'Stage 2',note:'+30% maximum speed',price:{diamonds:190},icon:'S2',impact:{power:35,handling:0,style:0},speedGain:30},
  {id:'engine-3',name:'Stage 3',note:'+45% maximum speed',price:{diamonds:310},icon:'S3',impact:{power:53,handling:0,style:0},speedGain:45},
  {id:'engine-4',name:'Stage 4',note:'+60% maximum speed',price:{diamonds:480},icon:'S4',impact:{power:70,handling:0,style:0},speedGain:60},
  {id:'engine-turbo',name:'Stage 4 Turbo',note:'Stage 4 plus a final +30% top-speed boost',price:{diamonds:650,lei:24},icon:'4T',impact:{power:100,handling:4,style:7},speedGain:90,premium:true,turbo:true}
];

var transmission=[
  {id:'trans-stock',name:'Stock Transmission',note:'Factory shift timing',price:{cash:0},icon:'OEM',impact:{power:0,handling:0,style:0}},
  {id:'trans-street',name:'Street Gearbox',note:'Faster shift response',price:{cash:225000},icon:'T1',impact:{power:5,handling:6,style:0}},
  {id:'trans-sport',name:'Sport Gearbox',note:'Close ratios / faster shifts',price:{cash:460000},icon:'T2',impact:{power:9,handling:10,style:0}},
  {id:'trans-race',name:'Race Transmission',note:'Maximum shift performance',price:{diamonds:145},icon:'T3',impact:{power:14,handling:15,style:1},premium:true}
];

var brakes=[
  {id:'brake-stock',name:'Stock Brakes',note:'Factory braking system',price:{cash:0},icon:'OEM',impact:{power:0,handling:0,style:0}},
  {id:'brake-street',name:'Street Brakes',note:'Improved pedal response',price:{cash:110000},icon:'B1',impact:{power:0,handling:7,style:0}},
  {id:'brake-sport',name:'Sport Brakes',note:'High-friction pads and discs',price:{cash:255000},icon:'B2',impact:{power:0,handling:14,style:0}},
  {id:'brake-race',name:'Race Brakes',note:'Competition stopping power',price:{cash:495000},icon:'B3',impact:{power:0,handling:22,style:2}}
];

var suspension=[
  {id:'susp-stock',name:'Stock Suspension',note:'Factory ride height',price:{cash:0},icon:'OEM',impact:{power:0,handling:0,style:0}},
  {id:'susp-street',name:'Street',note:'Subtle drop for daily use',price:{cash:85000},icon:'S1',impact:{power:0,handling:5,style:5}},
  {id:'susp-sport',name:'Sport',note:'Lower center of gravity',price:{cash:165000},icon:'S2',impact:{power:0,handling:10,style:9}},
  {id:'susp-competition',name:'Competition',note:'Aggressive track-biased setup',price:{cash:290000},icon:'S3',impact:{power:0,handling:17,style:12}},
  {id:'susp-ultra',name:'Ultra Low',note:'Maximum supported drop',price:{cash:425000},icon:'LOW',impact:{power:0,handling:13,style:19}}
];

var armor=[0,20,40,60,80,100].map(function(v,i){
  return {id:'armor-'+v,name:v?'Armor '+v+'%':'No Armor',note:v?'Reinforcement level '+v+'%':'Factory protection',price:{cash:[0,120000,250000,420000,680000,950000][i]},icon:v?v+'%':'OEM',impact:{power:0,handling:v?Math.max(0,6-i):0,style:v/12},badge:v===100?'MAX':''};
});

var turbos=[
  {id:'turbo-none',name:'Naturally Aspirated',note:'Factory induction',price:{diamonds:0},icon:'NA',impact:{power:0,handling:0,style:0}},
  {id:'turbo-street',name:'Street Turbo',note:'Quick spool / mild boost',price:{diamonds:130},icon:'T1',impact:{power:24,handling:0,style:4}},
  {id:'turbo-sport',name:'Sport Turbo',note:'Higher boost pressure',price:{diamonds:250},icon:'T2',impact:{power:45,handling:0,style:6}},
  {id:'turbo-race',name:'Race Turbo',note:'Aggressive boost curve',price:{diamonds:390},icon:'T3',impact:{power:68,handling:0,style:8}},
  {id:'turbo-stage4',name:'Stage 4 Turbo',note:'Premium final boost package',price:{diamonds:620,lei:22},icon:'4T',impact:{power:90,handling:2,style:10},premium:true}
];

var bodyParts=[
  ['spoiler','Spoiler','SPL'],['front-bumper','Front Bumper','FB'],['rear-bumper','Rear Bumper','RB'],['side-skirt','Side Skirts','SK'],
  ['exhaust','Exhaust','EX'],['frame','Frame / Chassis','FR'],['grille','Grille','GR'],['hood','Hood','HD'],
  ['left-fender','Left Fender','LF'],['right-fender','Right Fender','RF'],['roof','Roof','RF'],['plate-holder','Plate Holder','PL'],
  ['trim','Interior Trim','TR'],['ornaments','Ornaments','OR'],['dashboard','Dashboard','DB'],['dials','Dials','DL'],
  ['door-speakers','Door Speakers','DS'],['seats','Seats','ST'],['steering','Steering Wheel','SW'],['shifter','Shifter','SH'],
  ['plaques','Plaques','PQ'],['speakers','Speakers','SP'],['trunk','Trunk','TK'],['engine-block','Engine Block','EB'],
  ['air-filter','Air Filter','AF'],['struts','Struts','SR'],['arch-cover','Arch Covers','AC'],['aerials','Aerials','AR'],
  ['secondary-trim','Secondary Trim','T2'],['fuel-tank','Fuel Tank','FT'],['windows-body','Window Accessories','WN']
].map(function(x,i){
  return {id:'body-'+x[0],name:x[1],note:'4 vehicle-specific variants',price:{cash:95000+i*12000},icon:x[2],impact:{power:0,handling:i<10?3:0,style:7+(i%5)}};
});

var wheelGroups=['Street','Sport','Tuner','Track','High End','Muscle','Lowrider','Offroad'];
var wheels=[];
wheelGroups.forEach(function(group,g){
  for(var i=0;i<4;i++){
    var premium=g>=3&&i>=2;
    wheels.push({
      id:'wheel-'+g+'-'+i,
      name:group+' '+String(i+1).padStart(2,'0'),
      note:premium?'Premium forged collection':'Cast / flow-formed wheel',
      price:premium?{diamonds:110+g*15+i*12}:{cash:220000+g*65000+i*42000},
      icon:'W'+String(i+1),
      premium:premium,
      impact:{power:0,handling:4+g,style:9+g*2}
    });
  }
});

var liveries=Array.from({length:14},function(_,i){
  return {id:'livery-'+i,name:i?'Livery '+String(i).padStart(2,'0'):'Factory Clean',note:i?'Vehicle-specific graphic package':'No graphics applied',price:{diamonds:i?55+i*12:0},icon:i?'L'+i:'OEM',impact:{power:0,handling:0,style:i?12+(i%5)*3:0},premium:i>9};
});

var lightColors=[
  ['White','#f7ffff'],['Ice Blue','#bfe9ff'],['Electric Blue','#177dff'],['Cyan','#23e5ff'],['Mint','#6effc4'],['Lime','#72ff2f'],
  ['Green','#13d964'],['Yellow','#ffe033'],['Amber','#ffac22'],['Orange','#ff6a1e'],['Red','#ff293f'],['Pink','#ff48af'],['Purple','#9d45ff'],['Violet','#653cff']
];

var windowTints=[
  {id:'tint-clear',name:'Clear',note:'Factory glass',price:{cash:0},icon:'0%',impact:{power:0,handling:0,style:0}},
  {id:'tint-light',name:'Light Smoke',note:'Subtle 20% tint',price:{cash:65000},icon:'20%',impact:{power:0,handling:0,style:5}},
  {id:'tint-medium',name:'Medium Smoke',note:'Balanced 40% tint',price:{cash:105000},icon:'40%',impact:{power:0,handling:0,style:8}},
  {id:'tint-dark',name:'Dark Smoke',note:'Deep 65% tint',price:{cash:160000},icon:'65%',impact:{power:0,handling:0,style:12}},
  {id:'tint-blackout',name:'Blackout',note:'Maximum dark finish',price:{cash:240000},icon:'90%',impact:{power:0,handling:0,style:17}},
  {id:'tint-chameleon',name:'Chameleon Tint',note:'Premium color-shift glass',price:{diamonds:175},icon:'RGB',impact:{power:0,handling:0,style:25},premium:true}
];

var soundNames=[
  'Compact I4','Street I4','Classic Inline-6','Modern V6','Sport V6','Touring V8','Muscle V8','Race V8','Flat-6 Sport','Twin-Turbo V6',
  'Twin-Turbo V8','Supercharged V8','V10 Road','V10 Race','V12 Grand Tourer','V12 Performance','Boxer Rally','Turbo Rally','Drift I6',
  'Street Racer V6','Street Racer V8','Track V8','Track V10','Hyper V8TT','Hyper V10','Hyper V12','Extreme I6','Extreme V8','Extreme V10','Apex Signature'
];
var soundPrices=[12,18,25,35,45,58,72,88,105,122,140,158,178,198,220,242,265,288,310,330,350,370,392,414,436,455,472,485,495,500];
var sounds=soundNames.map(function(name,i){
  return {id:'sound-'+i,name:name,note:i>22?'Premium aggressive profile with pops':i>16?'Aggressive overrun / popping':'Street / performance profile',price:{cash:soundPrices[i]*1000000},icon:String(i+1).padStart(2,'0'),impact:{power:i>20?2:0,handling:0,style:5+Math.floor(i/3)},premium:i>22,pops:i>16};
});

var plates=[
  {id:'plate-stock',name:'Factory Plate',note:'Standard white frame',price:{cash:0},icon:'OEM',impact:{power:0,handling:0,style:0}},
  {id:'plate-black',name:'Black Frame',note:'Gloss black surround',price:{cash:55000},icon:'BLK',impact:{power:0,handling:0,style:5}},
  {id:'plate-carbon',name:'Carbon Frame',note:'Forged carbon surround',price:{cash:125000},icon:'CF',impact:{power:0,handling:0,style:10}},
  {id:'plate-neon',name:'Neon Frame',note:'Green illuminated surround',price:{diamonds:95},icon:'NEO',impact:{power:0,handling:0,style:16},premium:true},
  {id:'plate-prism',name:'Prismatic Frame',note:'Premium color-shift finish',price:{diamonds:155},icon:'RGB',impact:{power:0,handling:0,style:22},premium:true}
];

var state={
  category:'paint',
  selected:{},
  preview:null,
  cart:new Map(),
  finish:'normal',
  color:'#181c19',
  neon:'#66ff9b',
  headlight:'#f7ffff',
  stance:{height:-12,camber:-2.5,track:8},
  vehicle:{name:'OBEY 10F',plate:'RED 013',basePower:620,baseTorque:710,baseSpeed:205,baseAccel:3.8},
  balances:{cash:12650000,bank:287066000,diamonds:1844,lei:1250},
  carRotate:0,
  carScale:1,
  dockExpanded:false
};

var el={
  app:$('#app'),
  rail:$('#categoryRail'),
  content:$('#categoryContent'),
  optionPanel:$('#optionPanel'),
  search:$('#optionSearch'),
  scroll:$('#optionScroll'),
  inspectorTitle:$('#inspectorTitle'),
  inspectorSub:$('#inspectorSub'),
  previewName:$('#previewName'),
  previewPrice:$('#previewPrice'),
  previewIcon:$('#previewIcon'),
  addSelected:$('#addSelected'),
  miniBuildList:$('#miniBuildList'),
  queuedCount:$('#queuedCount'),
  buildTotal:$('#buildTotal'),
  cartCount:$('#cartCount'),
  cartDrawer:$('#cartDrawer'),
  cartItems:$('#cartItems'),
  cartEmpty:$('#cartEmpty'),
  checkout:$('#checkoutButton'),
  modal:$('#modalLayer'),
  modalTotals:$('#modalTotals'),
  demoCar:$('#demoCar'),
  stage:$('#vehicleStage'),
  overlay:$('#viewOverlay'),
  overlayContent:$('#overlayContent')
};

function plainPrice(p){
  p=p||{};
  var a=[];
  if(p.cash)a.push(p.cash>=1000000?kk(p.cash):money(p.cash));
  if(p.diamonds)a.push(p.diamonds+' ◆');
  if(p.lei)a.push(p.lei+' L');
  return a.join(' + ')||'FREE';
}
function priceHtml(p){
  p=p||{};
  var a=[];
  if(p.cash)a.push('<span class="price cash">'+ico('i-cash')+(p.cash>=1000000?kk(p.cash):money(p.cash))+'</span>');
  if(p.diamonds)a.push('<span class="price diamond">'+ico('i-diamond')+p.diamonds+'</span>');
  if(p.lei)a.push('<span class="price lei">'+ico('i-lei')+p.lei+'</span>');
  return a.length>1?'<div class="multi-price">'+a.join('')+'</div>':(a[0]||'<span class="price cash">FREE</span>');
}
function currentCategory(){return categories.find(function(c){return c.id===state.category})||categories[0]}
function currentSelected(){return state.selected[state.category]||null}
function optionByCategory(id){
  if(id==='engine')return engineStages;
  if(id==='transmission')return transmission;
  if(id==='brakes')return brakes;
  if(id==='suspension')return suspension;
  if(id==='armor')return armor;
  if(id==='turbo')return turbos;
  if(id==='body')return bodyParts;
  if(id==='wheels')return wheels;
  if(id==='livery')return liveries;
  if(id==='windows')return windowTints;
  if(id==='sounds')return sounds;
  if(id==='plate')return plates;
  return [];
}
function lightOptions(kind){
  var base=kind==='neon'?42:kind==='headlights'?55:35;
  var rainbow=kind==='neon'?190:kind==='headlights'?240:165;
  var arr=lightColors.map(function(x,i){
    return {id:kind+'-'+i,name:x[0],note:cap(kind)+' color · '+x[1].toUpperCase(),price:{diamonds:base+i*2},icon:'CLR',color:x[1],impact:{power:0,handling:0,style:8+i%4}};
  });
  arr.push({id:kind+'-rainbow',name:'Rainbow',note:'Premium animated multicolor effect',price:{diamonds:rainbow},icon:'RGB',rainbow:true,premium:true,impact:{power:0,handling:0,style:28}});
  return arr;
}
function wheelIcon(){return ico('i-wheel')}
function optionList(items){
  var q=state.search||'';
  q=q.toLowerCase();
  var selected=currentSelected();
  var filtered=items.filter(function(o){
    return !q||(o.name+' '+(o.note||'')).toLowerCase().indexOf(q)!==-1;
  });
  if(!filtered.length)return '<div class="empty-options"><b>No matching options</b>Try a different search term.</div>';
  return '<div class="option-list">'+filtered.map(function(o){
    var classes='option-card';
    if(selected&&selected.id===o.id)classes+=' selected';
    if(o.premium)classes+=' premium';
    return '<article class="'+classes+'" data-option="'+o.id+'">'+
      '<div class="option-icon text-icon">'+(o.icon||'MOD')+'</div>'+
      '<div class="option-copy"><b>'+o.name+(o.badge?' <span class="badge">'+o.badge+'</span>':'')+(o.premium?' <span class="badge diamond">PREMIUM</span>':'')+(o.pops?' <span class="badge">POPS</span>':'')+'</b><small>'+o.note+'</small></div>'+
      '<div class="option-meta">'+priceHtml(o.price)+'</div>'+
    '</article>';
  }).join('')+'</div>';
}
function renderRail(){
  el.rail.innerHTML=categories.map(function(c){
    return '<button class="category-button '+(state.category===c.id?'active':'')+'" data-category="'+c.id+'">'+
      '<span class="category-icon">'+ico(c.icon)+'</span>'+
      '<span class="category-copy"><b>'+c.label+'</b><small>'+c.sub+'</small></span>'+
    '</button>';
  }).join('');
  $$('[data-category]',el.rail).forEach(function(btn){
    btn.addEventListener('click',function(){setCategory(btn.dataset.category)});
  });
}
function setCategory(id){
  if(state.category===id)return;
  state.category=id;
  state.search='';
  el.search.value='';
  renderRail();
  el.optionPanel.classList.remove('swap');
  void el.optionPanel.offsetWidth;
  el.optionPanel.classList.add('swap');
  setTimeout(function(){renderCategory();el.optionPanel.classList.remove('swap')},145);
  el.scroll.scrollTop=0;
}
function renderCategory(){
  var c=currentCategory();
  $('#panelEyebrow').textContent=c.group;
  $('#panelTitle').textContent=c.title;
  $('#panelDescription').textContent=c.desc;

  if(c.id==='paint')el.content.innerHTML=renderPaint();
  else if(c.id==='engine')el.content.innerHTML=renderStages();
  else if(c.id==='stance')el.content.innerHTML=renderStance();
  else if(c.id==='wheels')el.content.innerHTML=renderWheels();
  else if(c.id==='neon'||c.id==='headlights'||c.id==='smoke')el.content.innerHTML=renderLights(c.id);
  else {
    var items=optionByCategory(c.id);
    el.content.innerHTML='<div class="section-label"><span>Available '+c.label+'</span><span>'+items.length+' OPTIONS</span></div>'+optionList(items);
  }
  bindCategoryEvents();
}
function renderPaint(){
  var finishNames={normal:'Normal',matte:'Matte',metallic:'Metallic',chrome:'Chrome',chameleon:'Chameleon'};
  return '<div class="section-label"><span>Finish type</span><span>5 MATERIALS</span></div>'+
    '<div class="finish-tabs">'+Object.keys(finishNames).map(function(k){
      return '<button class="finish-tab '+(state.finish===k?'active ':'')+((k==='chrome'||k==='chameleon')?'premium':'')+'" data-finish="'+k+'">'+finishNames[k]+'</button>';
    }).join('')+'</div>'+
    '<div class="section-label"><span>Custom color</span><span>'+((state.finish==='chrome'||state.finish==='chameleon')?'DIAMANTE':'CASH')+'</span></div>'+
    '<div class="color-workbench">'+
      '<div class="color-picker-shell" style="--picker-hue:145"><input id="colorPicker" type="color" value="'+state.color+'"><span class="color-picker-dot"></span></div>'+
      '<div class="color-preview-box" style="--selected-color:'+state.color+'"><code>'+state.color.toUpperCase()+'</code></div>'+
    '</div>'+
    '<div class="section-label"><span>Quick palette</span><span>24 COLORS</span></div>'+
    '<div class="swatch-grid">'+swatches.map(function(x){return '<button class="swatch '+(state.color.toLowerCase()===x[1]?'active':'')+'" style="--swatch:'+x[1]+'" data-swatch="'+x[1]+'" title="'+x[0]+'"></button>'}).join('')+'</div>'+
    '<div class="detail-grid">'+
      '<div class="detail-cell"><small>Finish</small><b>'+finishNames[state.finish]+'</b></div>'+
      '<div class="detail-cell"><small>Color</small><b>'+state.color.toUpperCase()+'</b></div>'+
      '<div class="detail-cell"><small>Price</small><b>'+plainPrice(finishPrices[state.finish])+'</b></div>'+
    '</div>';
}
function renderStages(){
  var selected=currentSelected()||engineStages[0];
  return '<div class="section-label"><span>ECU calibration</span><span>+15% EACH STAGE</span></div>'+
    '<div class="stage-grid">'+engineStages.map(function(o){
      return '<article class="stage-card '+(o.turbo?'turbo ':'')+(selected.id===o.id?'selected':'')+'" data-option="'+o.id+'">'+
        '<div class="stage-number">'+(o.turbo?'PREMIUM PERFORMANCE':o.id==='engine-stock'?'FACTORY':'ENGINE STAGE')+'</div>'+
        '<h3>'+o.name+(o.turbo?' <span class="badge gold">TURBO</span>':'')+'</h3>'+
        '<p>'+o.note+'</p>'+
        '<div class="stage-price">'+priceHtml(o.price)+'</div>'+
      '</article>';
    }).join('')+'</div>'+
    '<div class="detail-grid">'+
      '<div class="detail-cell"><small>Selected</small><b>'+selected.name+'</b></div>'+
      '<div class="detail-cell"><small>Top-speed gain</small><b>+'+(selected.speedGain||0)+'%</b></div>'+
      '<div class="detail-cell"><small>Projected</small><b>'+Math.round(state.vehicle.baseSpeed*(1+(selected.speedGain||0)/100))+' KM/H</b></div>'+
    '</div>';
}
function renderStance(){
  return '<div class="section-label"><span>Precision setup</span><span>LIVE PREVIEW</span></div>'+
    sliderHtml('height','Ride Height',-40,10,state.stance.height,'mm')+
    sliderHtml('camber','Camber',-8,2,state.stance.camber,'°')+
    sliderHtml('track','Track Width',-20,25,state.stance.track,'mm')+
    '<div class="detail-grid">'+
      '<div class="detail-cell"><small>Height</small><b>'+state.stance.height+' mm</b></div>'+
      '<div class="detail-cell"><small>Camber</small><b>'+state.stance.camber+'°</b></div>'+
      '<div class="detail-cell"><small>Track</small><b>'+state.stance.track+' mm</b></div>'+
    '</div>';
}
function sliderHtml(key,label,min,max,value,unit){
  var pct=((value-min)/(max-min))*100;
  return '<div class="slider-card"><div class="slider-head"><b>'+label+'</b><output id="out-'+key+'">'+value+unit+'</output></div><input class="tune-slider" data-stance="'+key+'" type="range" min="'+min+'" max="'+max+'" step="'+(key==='camber'?'0.1':'1')+'" value="'+value+'" style="--range:'+pct+'%"></div>';
}
function renderWheels(){
  var q=(state.search||'').toLowerCase();
  var selected=currentSelected();
  var filtered=wheels.filter(function(w){return !q||(w.name+' '+w.note).toLowerCase().indexOf(q)!==-1});
  return '<div class="section-label"><span>Wheel designs</span><span>'+filtered.length+' RESULTS</span></div>'+
    '<div class="wheel-grid">'+filtered.map(function(o){
      return '<article class="wheel-card '+(selected&&selected.id===o.id?'selected':'')+'" data-option="'+o.id+'">'+
        '<div class="wheel-art">'+wheelIcon()+'</div><span class="badge '+(o.premium?'diamond':'')+'">'+(o.premium?'PREMIUM':o.name.split(' ')[0].toUpperCase())+'</span>'+
        '<h3>'+o.name+'</h3><small>'+o.note+'</small><div class="wheel-price">'+priceHtml(o.price)+'</div>'+
      '</article>';
    }).join('')+'</div>';
}
function renderLights(kind){
  var items=lightOptions(kind),selected=currentSelected();
  return '<div class="section-label"><span>Color library</span><span>'+items.length+' COLORS</span></div>'+
    '<div class="swatch-grid">'+items.map(function(o){
      return '<button class="swatch '+(o.rainbow?'rainbow ':'')+(selected&&selected.id===o.id?'active':'')+'" style="'+(o.color?'--swatch:'+o.color:'')+'" data-light="'+o.id+'" title="'+o.name+'"></button>';
    }).join('')+'</div>'+
    optionList(items);
}
function bindCategoryEvents(){
  $$('[data-option]',el.content).forEach(function(card){
    card.addEventListener('click',function(){
      var item=findOption(state.category,card.dataset.option);
      if(item)selectItem(item);
    });
  });
  $$('[data-light]',el.content).forEach(function(node){
    node.addEventListener('click',function(){
      var item=lightOptions(state.category).find(function(x){return x.id===node.dataset.light});
      if(item)selectItem(item);
    });
  });
  $$('[data-finish]',el.content).forEach(function(btn){
    btn.addEventListener('click',function(){
      state.finish=btn.dataset.finish;
      setPaintPreview();
      renderCategory();
    });
  });
  $$('[data-swatch]',el.content).forEach(function(btn){
    btn.addEventListener('click',function(){
      state.color=btn.dataset.swatch;
      applyPaint();
      setPaintPreview();
      renderCategory();
    });
  });
  var picker=$('#colorPicker',el.content);
  if(picker){
    picker.addEventListener('input',function(){
      state.color=picker.value;
      applyPaint();
      setPaintPreview(false);
      var box=$('.color-preview-box',el.content);
      var code=box&&box.querySelector('code');
      if(box)box.style.setProperty('--selected-color',state.color);
      if(code)code.textContent=state.color.toUpperCase();
    });
    picker.addEventListener('change',function(){renderCategory()});
  }
  $$('[data-stance]',el.content).forEach(function(slider){
    slider.addEventListener('input',function(){
      var key=slider.dataset.stance;
      var value=Number(slider.value);
      state.stance[key]=value;
      var pct=((value-Number(slider.min))/(Number(slider.max)-Number(slider.min)))*100;
      slider.style.setProperty('--range',pct+'%');
      $('#out-'+key,el.content).textContent=value+(key==='camber'?'°':'mm');
      setStancePreview();
      updateCarStance();
    });
  });
}
function findOption(category,id){
  var arr;
  if(category==='neon'||category==='headlights'||category==='smoke')arr=lightOptions(category);
  else arr=optionByCategory(category);
  return arr.find(function(x){return x.id===id});
}
function selectItem(item){
  state.selected[state.category]=item;
  state.preview={category:state.category,item:item};
  applyVisualPreview(state.category,item);
  renderCategory();
  updateInspector();
  updateStats();
}
function setPaintPreview(showToast){
  if(showToast===undefined)showToast=true;
  var item={
    id:'paint-'+state.finish+'-'+state.color,
    name:cap(state.finish)+' · '+state.color.toUpperCase(),
    note:'Custom '+state.finish+' paint',
    price:finishPrices[state.finish],
    icon:'CLR',
    color:state.color,
    finish:state.finish,
    impact:{power:0,handling:0,style:18}
  };
  state.selected.paint=item;
  state.preview={category:'paint',item:item};
  applyPaint();
  updateInspector();
  updateStats();
  if(showToast)toast('Previewing <b>'+item.name+'</b>');
}
function setStancePreview(){
  var item={
    id:'stance-custom',
    name:'Custom Stance',
    note:'Height '+state.stance.height+'mm · Camber '+state.stance.camber+'° · Track '+state.stance.track+'mm',
    price:{cash:380000},
    icon:'ST',
    stance:Object.assign({},state.stance),
    impact:{power:0,handling:14,style:24}
  };
  state.selected.stance=item;
  state.preview={category:'stance',item:item};
  updateInspector();
  updateStats();
}
function applyVisualPreview(category,item){
  if(category==='paint'){state.color=item.color||state.color;applyPaint()}
  if(category==='neon'){
    state.neon=item.rainbow?'#73ff9d':item.color;
    document.documentElement.style.setProperty('--neon',state.neon);
    $('#neonPool').style.opacity='.82';
  }
  if(category==='headlights'){
    state.headlight=item.rainbow?'#a7f4ff':item.color;
    document.documentElement.style.setProperty('--headlight',state.headlight);
  }
  if(category==='windows'){
    var opacity=item.id==='tint-clear'?'.55':item.id==='tint-light'?'.43':item.id==='tint-medium'?'.32':item.id==='tint-dark'?'.22':item.id==='tint-blackout'?'.12':'.3';
    $$('.car-window').forEach(function(w){w.style.opacity=opacity});
  }
  if(category==='wheels'){
    $$('.rim').forEach(function(r){r.style.stroke=item.premium?'#bfefff':'#8b958f'});
  }
}
function applyPaint(){
  var c=state.color;
  document.documentElement.style.setProperty('--car-color',c);
  document.documentElement.style.setProperty('--car-highlight',mixColor(c,'#ffffff',.22));
  document.documentElement.style.setProperty('--car-shadow',mixColor(c,'#000000',.58));
}
function mixColor(a,b,t){
  function p(hex){hex=hex.replace('#','');if(hex.length===3)hex=hex.split('').map(function(x){return x+x}).join('');return [parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16)]}
  var x=p(a),y=p(b),z=x.map(function(v,i){return Math.round(v+(y[i]-v)*t)});
  return '#'+z.map(function(v){return v.toString(16).padStart(2,'0')}).join('');
}
function updateCarStance(){
  var h=state.stance.height;
  var y=14+(-h-12)*.22;
  el.demoCar.style.marginTop=y+'px';
  var camber=Math.abs(state.stance.camber);
  $$('.wheel',el.demoCar).forEach(function(w,i){
    w.style.transformOrigin=i===0?'244px 267px':'682px 267px';
    w.style.transform='rotate('+(i===0?camber:-camber)+'deg)';
  });
}
function updateInspector(){
  var p=state.preview;
  if(!p){
    el.inspectorTitle.textContent='Factory setup';
    el.inspectorSub.textContent='Select an item to preview its effect.';
    el.previewName.textContent='Nothing selected';
    el.previewPrice.textContent='—';
    el.previewIcon.innerHTML=ico('i-info');
    el.addSelected.disabled=true;
    setImpact({power:0,handling:0,style:0});
    return;
  }
  var c=categories.find(function(x){return x.id===p.category})||categories[0];
  var item=p.item;
  el.inspectorTitle.textContent=item.name;
  el.inspectorSub.textContent=item.note||c.desc;
  el.previewName.textContent=item.name;
  el.previewPrice.textContent=plainPrice(item.price);
  el.previewIcon.innerHTML=ico(c.icon);
  el.addSelected.disabled=false;
  setImpact(item.impact||{power:0,handling:0,style:0});
}
function setImpact(impact){
  ['Power','Handling','Style'].forEach(function(name){
    var k=name.toLowerCase(),v=clamp(Number(impact[k]||0),0,100);
    $('#impact'+name).style.width=v+'%';
    $('#impact'+name+'Text').textContent='+'+v+'%';
  });
}
function cartTotals(){
  var t={cash:0,diamonds:0,lei:0};
  state.cart.forEach(function(x){
    t.cash+=Number(x.price.cash||0);
    t.diamonds+=Number(x.price.diamonds||0);
    t.lei+=Number(x.price.lei||0);
  });
  return t;
}
function buildTotalText(){
  var t=cartTotals(),a=[];
  if(t.cash)a.push(t.cash>=1000000?kk(t.cash):money(t.cash));
  if(t.diamonds)a.push(t.diamonds+' ◆');
  if(t.lei)a.push(t.lei+' L');
  return a.join(' · ')||'No parts selected';
}
function addPreviewToBuild(){
  if(!state.preview)return;
  var key=state.preview.category;
  var item=state.preview.item;
  state.cart.set(key,{key:key,category:key,item:item,name:item.name,price:Object.assign({},item.price||{}),impact:Object.assign({},item.impact||{})});
  renderCart();
  updateStats();
  toast('Added <b>'+item.name+'</b> to your build');
}
function renderCart(){
  var items=Array.from(state.cart.values());
  var t=cartTotals();
  el.cartCount.textContent=items.length;
  $('#queuedCount').textContent=items.length+' ITEM'+(items.length===1?'':'S');
  el.buildTotal.textContent=buildTotalText();
  el.cartEmpty.classList.toggle('hidden',items.length>0);
  el.checkout.disabled=!items.length;

  el.cartItems.innerHTML=items.map(function(x){
    return '<div class="cart-item"><div><b>'+x.name+'</b><small>'+cap(x.category)+'</small></div><span class="cart-item-price">'+plainPrice(x.price)+'</span><button class="remove-item" data-remove="'+x.key+'">'+ico('i-close')+'</button></div>';
  }).join('');

  el.miniBuildList.innerHTML=items.length?items.slice(-5).map(function(x){
    return '<div class="mini-item"><span>'+x.name+'</span><span>'+plainPrice(x.price)+'</span></div>';
  }).join(''):'<div class="mini-empty">Your build is empty.</div>';

  $('#totalCash').textContent=money(t.cash);
  $('#totalDiamonds').textContent=t.diamonds+' ◆';
  $('#totalLei').textContent=t.lei+' L';

  $$('[data-remove]',el.cartItems).forEach(function(btn){
    btn.addEventListener('click',function(){
      state.cart.delete(btn.dataset.remove);
      renderCart();
      updateStats();
    });
  });
}
function combinedImpact(){
  var p={power:0,handling:0,style:0,speedGain:0};
  state.cart.forEach(function(x){
    p.power+=Number(x.impact.power||0);
    p.handling+=Number(x.impact.handling||0);
    p.style+=Number(x.impact.style||0);
    p.speedGain+=Number(x.item.speedGain||0);
  });
  if(state.preview&&!state.cart.has(state.preview.category)){
    p.power+=Number(state.preview.item.impact&&state.preview.item.impact.power||0);
    p.handling+=Number(state.preview.item.impact&&state.preview.item.impact.handling||0);
    p.style+=Number(state.preview.item.impact&&state.preview.item.impact.style||0);
    p.speedGain+=Number(state.preview.item.speedGain||0);
  }
  return p;
}
function updateStats(){
  var p=combinedImpact();
  var power=Math.round(state.vehicle.basePower*(1+clamp(p.power,0,120)/180));
  var torque=Math.round(state.vehicle.baseTorque*(1+clamp(p.power,0,120)/210));
  var speed=Math.round(state.vehicle.baseSpeed*(1+clamp(p.speedGain,0,100)/100));
  var accel=Math.max(2.1,state.vehicle.baseAccel-(clamp(p.power,0,100)/100)*1.15-(clamp(p.handling,0,60)/60)*.2);

  $('#powerValue').textContent=power;
  $('#torqueValue').textContent=torque;
  $('#speedValue').textContent=speed;
  $('#accelValue').textContent=accel.toFixed(1);

  $('#powerBar').style.width=clamp((power-450)/5,18,100)+'%';
  $('#torqueBar').style.width=clamp((torque-520)/5,18,100)+'%';
  $('#speedBar').style.width=clamp((speed-150)/2,18,100)+'%';
  $('#accelBar').style.width=clamp(100-(accel-2)*35,18,100)+'%';
}
function toast(html){
  var n=document.createElement('div');
  n.className='toast';
  n.innerHTML=html;
  $('#toastStack').appendChild(n);
  setTimeout(function(){
    n.style.opacity='0';
    n.style.transform='translateX(12px)';
    setTimeout(function(){n.remove()},260);
  },2300);
}
function renderWallet(){
  $('#cashBalance').textContent=money(state.balances.cash);
  $('#bankBalance').textContent=money(state.balances.bank);
  $('#diamondBalance').textContent=Number(state.balances.diamonds).toLocaleString('de-DE');
  $('#leiBalance').textContent=Number(state.balances.lei).toLocaleString('de-DE');
}
function resetCategory(){
  delete state.selected[state.category];
  if(state.preview&&state.preview.category===state.category)state.preview=null;
  if(state.category==='paint'){state.finish='normal';state.color='#181c19';applyPaint()}
  if(state.category==='stance'){state.stance={height:-12,camber:-2.5,track:8};updateCarStance()}
  if(state.category==='neon'){$('#neonPool').style.opacity='.25';document.documentElement.style.setProperty('--neon','#66ff9b')}
  if(state.category==='headlights')document.documentElement.style.setProperty('--headlight','#f7ffff');
  if(state.category==='windows')$$('.car-window').forEach(function(w){w.style.opacity='1'});
  renderCategory();
  updateInspector();
  updateStats();
}
function updateNavIndicator(){
  var nav=$('#mainNav'),active=$('.main-nav button.active');
  if(!active)return;
  var r=active.getBoundingClientRect(),nr=nav.getBoundingClientRect(),indicator=$('.nav-indicator');
  indicator.style.width=(r.width-24)+'px';
  indicator.style.left=(r.left-nr.left+12)+'px';
}
function openTopView(view,button){
  $$('.main-nav button').forEach(function(b){b.classList.toggle('active',b===button)});
  updateNavIndicator();
  if(view==='tuning'){el.overlay.classList.remove('show');return}
  var html='';
  if(view==='overview'){
    html='<div class="overlay-hero"><div><span class="big-icon">'+ico('i-body')+'</span><span class="eyebrow">PROJECT OVERVIEW</span><h2>OBEY 10F / RED 013</h2><p>Your complete browser-only tuning prototype. Every visual choice is previewed live on the center vehicle and can be queued into one checkout build.</p><div class="overlay-grid"><div class="overlay-tile"><small>POWER</small><b>'+$('#powerValue').textContent+' HP</b></div><div class="overlay-tile"><small>TOP SPEED</small><b>'+$('#speedValue').textContent+' KM/H</b></div><div class="overlay-tile"><small>QUEUED PARTS</small><b>'+state.cart.size+'</b></div></div></div></div>';
  }else if(view==='dyno'){
    html='<div class="overlay-hero"><div><span class="big-icon">'+ico('i-speed')+'</span><span class="eyebrow">DYNO ROOM</span><h2>Estimated power curve</h2><p>The dyno preview updates from your queued performance upgrades. Current output is '+$('#powerValue').textContent+' HP and '+$('#torqueValue').textContent+' Nm.</p><div class="overlay-grid"><div class="overlay-tile"><small>BASE POWER</small><b>620 HP</b></div><div class="overlay-tile"><small>CURRENT POWER</small><b>'+$('#powerValue').textContent+' HP</b></div><div class="overlay-tile"><small>CURRENT TORQUE</small><b>'+$('#torqueValue').textContent+' NM</b></div></div></div></div>';
  }else if(view==='offer'){
    html='<div class="overlay-hero offer-card"><div><span class="big-icon">'+ico('i-diamond')+'</span><span class="eyebrow">LIMITED BUILD</span><h2>Prismatic Performance Pack</h2><p>A premium demo bundle combining Stage 4 Turbo, chameleon paint, forged wheels and animated lighting. This is only a visual showcase in the browser prototype.</p><div class="overlay-grid"><div class="overlay-tile"><small>ENGINE</small><b>Stage 4 Turbo</b></div><div class="overlay-tile"><small>FINISH</small><b>Chameleon</b></div><div class="overlay-tile"><small>LIGHTING</small><b>Rainbow</b></div></div></div></div>';
  }else{
    html='<div class="overlay-hero"><div><span class="big-icon">'+ico('i-info')+'</span><span class="eyebrow">CONTROLS</span><h2>Browser demo controls</h2><p>Expand the left rail for category labels, click any option to preview it, add selections to the build from the right panel, drag the vehicle to rotate it and use the mouse wheel to zoom.</p><div class="overlay-grid"><div class="overlay-tile"><small>ROTATE</small><b>Mouse drag</b></div><div class="overlay-tile"><small>ZOOM</small><b>Mouse wheel</b></div><div class="overlay-tile"><small>RESET CAMERA</small><b>R key</b></div></div></div></div>';
  }
  el.overlayContent.innerHTML=html;
  el.overlay.classList.add('show');
}
function closeTopView(){
  el.overlay.classList.remove('show');
  $$('.main-nav button').forEach(function(b){b.classList.toggle('active',b.dataset.view==='tuning')});
  updateNavIndicator();
}
function checkoutModal(){
  var t=cartTotals();
  el.modalTotals.innerHTML=(t.cash?'<span class="modal-total">'+money(t.cash)+' cash</span>':'')+(t.diamonds?'<span class="modal-total">'+t.diamonds+' ◆ Diamante</span>':'')+(t.lei?'<span class="modal-total">'+t.lei+' Lei</span>':'');
  el.modal.classList.add('show');
}
function confirmCheckout(){
  var count=state.cart.size;
  state.cart.clear();
  renderCart();
  updateStats();
  el.modal.classList.remove('show');
  el.cartDrawer.classList.remove('open');
  toast('<b>'+count+' upgrade'+(count===1?'':'s')+' installed.</b> Demo purchase complete.');
}
function bindGlobal(){
  $('#dockToggle').addEventListener('click',function(){
    state.dockExpanded=!state.dockExpanded;
    el.app.classList.toggle('dock-expanded',state.dockExpanded);
  });
  el.search.addEventListener('input',function(e){state.search=e.target.value.trim();renderCategory()});
  $('#resetCategory').addEventListener('click',resetCategory);
  el.addSelected.addEventListener('click',addPreviewToBuild);
  $('#undoPreview').addEventListener('click',resetCategory);
  $('#openCart').addEventListener('click',function(){el.cartDrawer.classList.add('open')});
  $('#closeCart').addEventListener('click',function(){el.cartDrawer.classList.remove('open')});
  $('#clearBuild').addEventListener('click',function(){state.cart.clear();renderCart();updateStats();toast('Build cleared')});
  el.checkout.addEventListener('click',checkoutModal);
  $('#cancelCheckout').addEventListener('click',function(){el.modal.classList.remove('show')});
  $('#confirmCheckout').addEventListener('click',confirmCheckout);
  $('#closeOverlay').addEventListener('click',closeTopView);

  $$('.main-nav button').forEach(function(btn){
    btn.addEventListener('click',function(){openTopView(btn.dataset.view,btn)});
  });

  window.addEventListener('resize',updateNavIndicator);
  document.addEventListener('pointermove',function(e){
    el.app.style.setProperty('--mx',(e.clientX/window.innerWidth*100)+'%');
    el.app.style.setProperty('--my',(e.clientY/window.innerHeight*100)+'%');
  });

  document.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();el.search.focus()}
    if(e.key.toLowerCase()==='r'){state.carRotate=0;state.carScale=1;applyCarTransform()}
    if(e.key==='Escape'){
      if(el.modal.classList.contains('show'))el.modal.classList.remove('show');
      else if(el.cartDrawer.classList.contains('open'))el.cartDrawer.classList.remove('open');
      else if(el.overlay.classList.contains('show'))closeTopView();
    }
  });

  var dragging=false,startX=0,startRot=0;
  el.stage.addEventListener('pointerdown',function(e){
    if(e.target.closest('button,input'))return;
    dragging=true;startX=e.clientX;startRot=state.carRotate;
    el.stage.setPointerCapture(e.pointerId);
  });
  el.stage.addEventListener('pointermove',function(e){
    if(!dragging)return;
    state.carRotate=clamp(startRot+(e.clientX-startX)*.08,-22,22);
    applyCarTransform();
  });
  el.stage.addEventListener('pointerup',function(){dragging=false});
  el.stage.addEventListener('wheel',function(e){
    e.preventDefault();
    state.carScale=clamp(state.carScale+(e.deltaY>0?-.04:.04),.84,1.16);
    applyCarTransform();
  },{passive:false});
}
function applyCarTransform(){
  el.demoCar.style.setProperty('--car-rotate',state.carRotate+'deg');
  el.demoCar.style.setProperty('--car-scale',state.carScale);
}

state.search='';
renderWallet();
renderRail();
renderCategory();
renderCart();
applyPaint();
updateCarStance();
updateInspector();
updateStats();
bindGlobal();
setTimeout(updateNavIndicator,80);
