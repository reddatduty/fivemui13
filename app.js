'use strict';

var $ = function(s, r){ return (r || document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var ico = function(id){ return '<svg><use href="#' + id + '"></use></svg>'; };
var money = function(n){ return '$ ' + Number(n || 0).toLocaleString('de-DE'); };
var kk = function(n){ return n >= 1000000 ? Math.round(n / 1000000) + 'kk' : money(n); };
var cap = function(s){ s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); };
var clamp = function(v,a,b){ return Math.max(a, Math.min(b,v)); };

var categories = [
  {id:'paint',label:'Colors',icon:'i-paint',title:'Paint & Finish',desc:'Normal, matte, metallic, chrome and chameleon finishes.'},
  {id:'engine',label:'Engine',icon:'i-engine',title:'Engine Stages',desc:'Stage 1–4 plus the premium Stage 4 Turbo package.'},
  {id:'suspension',label:'Suspension',icon:'i-suspension',title:'Suspension',desc:'All standard ride-height levels, purchased with cash.'},
  {id:'armor',label:'Armor',icon:'i-armor',title:'Vehicle Armor',desc:'Progressive protection levels from stock to 100% armor.'},
  {id:'body',label:'Body Parts',icon:'i-body',title:'Body Components',desc:'Vehicle body slots, exterior details and interior trim pieces.'},
  {id:'livery',label:'Liveries',icon:'i-livery',title:'Liveries',desc:'Vehicle-specific graphic packages purchased with Diamante.'},
  {id:'neon',label:'Neon',icon:'i-neon',title:'Underglow Neon',desc:'Custom neon colors plus a premium rainbow effect.'},
  {id:'headlights',label:'Headlights',icon:'i-headlight',title:'Headlight Color',desc:'Custom xenon colors plus a premium rainbow option.'},
  {id:'smoke',label:'Tire Smoke',icon:'i-smoke',title:'Tire Smoke',desc:'Custom smoke colors and a premium rainbow effect.'},
  {id:'wheels',label:'Wheels',icon:'i-wheel',title:'Wheel Collection',desc:'Street, sport, tuner, track, high-end and specialty wheels.'},
  {id:'sounds',label:'Engine Sounds',icon:'i-sound',title:'Engine Sound Library',desc:'30 profiles ranging from 12kk to 500kk.'}
];

var finishPrices = {
  normal:{cash:50000},
  matte:{cash:90000},
  metallic:{cash:125000},
  chrome:{diamonds:95},
  chameleon:{diamonds:180}
};

var swatches = [
  ['Obsidian','#050807'],['Graphite','#252b28'],['Silver','#9fa8a3'],['Ice White','#edf4f0'],
  ['Crimson','#d91836'],['Inferno','#ff4a21'],['Sunset','#ff8a1d'],['Gold','#d8a62a'],
  ['Lime','#5eff42'],['Emerald','#0fc86c'],['Forest','#0a5e38'],['Mint','#59f2b7'],
  ['Cyan','#2dd9ff'],['Electric Blue','#157dff'],['Royal Blue','#2836d8'],['Midnight','#10172f'],
  ['Violet','#7a42ff'],['Purple','#a32cff'],['Hot Pink','#ff3ea7'],['Rose','#d64f71'],
  ['Bronze','#9e633e'],['Sand','#c6ab75'],['Cream','#e4d8b4'],['Smoke','#4a5350']
];

var engineStages = [
  {id:'engine-stock',name:'Factory ECU',note:'Original engine calibration',price:{diamonds:0},icon:'OEM',impact:{power:0,handling:0,style:0},speedGain:0},
  {id:'engine-1',name:'Stage 1',note:'+15% maximum speed',price:{diamonds:95},icon:'S1',impact:{power:18,handling:0,style:0},speedGain:15},
  {id:'engine-2',name:'Stage 2',note:'+30% maximum speed',price:{diamonds:190},icon:'S2',impact:{power:34,handling:0,style:0},speedGain:30},
  {id:'engine-3',name:'Stage 3',note:'+45% maximum speed',price:{diamonds:310},icon:'S3',impact:{power:52,handling:0,style:0},speedGain:45},
  {id:'engine-4',name:'Stage 4',note:'+60% maximum speed',price:{diamonds:480},icon:'S4',impact:{power:70,handling:0,style:0},speedGain:60},
  {id:'engine-turbo',name:'Stage 4 Turbo',note:'Stage 4 + final 30% top-speed boost',price:{diamonds:650,lei:24},icon:'4T',impact:{power:100,handling:4,style:12},speedGain:90,premium:true}
];

var suspension = [
  {id:'susp-stock',name:'Stock Suspension',note:'Factory ride height',price:{cash:0},icon:'OEM',impact:{power:0,handling:0,style:0}},
  {id:'susp-street',name:'Street',note:'Subtle drop for daily use',price:{cash:85000},icon:'S1',impact:{power:0,handling:6,style:5}},
  {id:'susp-sport',name:'Sport',note:'Lower center of gravity',price:{cash:165000},icon:'S2',impact:{power:0,handling:11,style:9}},
  {id:'susp-competition',name:'Competition',note:'Aggressive track-biased setup',price:{cash:290000},icon:'S3',impact:{power:0,handling:17,style:12}},
  {id:'susp-ultra',name:'Ultra Low',note:'Maximum supported drop',price:{cash:425000},icon:'LOW',impact:{power:0,handling:13,style:20}}
];

var armor = [0,20,40,60,80,100].map(function(v,i){
  return {
    id:'armor-' + v,
    name:v ? 'Armor ' + v + '%' : 'No Armor',
    note:v ? 'Reinforcement level ' + v + '%' : 'Factory protection',
    price:{cash:[0,120000,250000,420000,680000,950000][i]},
    icon:v ? v + '%' : 'OEM',
    impact:{power:0,handling:Math.max(0,5-i),style:Math.round(v/12)},
    premium:v===100
  };
});

var bodyNames = [
  ['spoiler','Spoiler','SPL'],['front-bumper','Front Bumper','FB'],['rear-bumper','Rear Bumper','RB'],['side-skirts','Side Skirts','SK'],
  ['exhaust','Exhaust','EX'],['frame','Frame / Chassis','FR'],['grille','Grille','GR'],['hood','Hood','HD'],
  ['left-fender','Left Fender','LF'],['right-fender','Right Fender','RF'],['roof','Roof','RF'],['plate-holder','Plate Holder','PL'],
  ['vanity-plates','Vanity Plates','VP'],['trim','Interior Trim','TR'],['ornaments','Ornaments','OR'],['dashboard','Dashboard','DB'],
  ['dials','Dials','DL'],['door-speakers','Door Speakers','DS'],['seats','Seats','ST'],['steering-wheel','Steering Wheel','SW'],
  ['shifter','Shifter','SH'],['plaques','Plaques','PQ'],['speakers','Speakers','SP'],['trunk','Trunk','TK'],
  ['hydraulics','Hydraulics','HY'],['engine-block','Engine Block','EB'],['air-filter','Air Filter','AF'],['struts','Struts','SR'],
  ['arch-covers','Arch Covers','AC'],['aerials','Aerials','AR'],['secondary-trim','Secondary Trim','T2'],['fuel-tank','Fuel Tank','FT'],
  ['windows','Window Accessories','WN']
];
var bodyParts = bodyNames.map(function(x,i){
  return {
    id:'body-' + x[0],
    name:x[1] + ' 01',
    note:'Vehicle-specific ' + x[1].toLowerCase() + ' variant',
    price:{cash:85000 + i * 16000},
    icon:x[2],
    cartKey:'body:' + x[0],
    impact:{power:0,handling:i<10?3:0,style:7+(i%6)}
  };
});

var liveries = Array.from({length:14}, function(_,i){
  return {
    id:'livery-' + i,
    name:i ? 'Livery ' + String(i).padStart(2,'0') : 'Factory Clean',
    note:i ? ['Street graphic package','Motorsport graphic package','Limited design collection'][i%3] : 'No graphics applied',
    price:{diamonds:i ? 55 + i*12 : 0},
    icon:i ? 'L' + i : 'OEM',
    impact:{power:0,handling:0,style:i ? 12+(i%5)*3 : 0},
    premium:i>=10
  };
});

var lightColors = [
  ['White','#f7ffff'],['Ice Blue','#bfe9ff'],['Electric Blue','#177dff'],['Cyan','#23e5ff'],
  ['Mint','#6effc4'],['Lime','#72ff2f'],['Green','#13d964'],['Yellow','#ffe033'],
  ['Amber','#ffac22'],['Orange','#ff6a1e'],['Red','#ff293f'],['Pink','#ff48af'],
  ['Purple','#9d45ff'],['Violet','#653cff']
];

var wheelGroups = ['Street','Sport','Tuner','Track','High End','Muscle','Lowrider','Offroad'];
var wheels = [];
wheelGroups.forEach(function(group,g){
  for(var i=0;i<4;i++){
    var premium = g>=3 && i>=2;
    wheels.push({
      id:'wheel-' + g + '-' + i,
      name:group + ' ' + String(i+1).padStart(2,'0'),
      note:premium ? 'Premium forged collection' : 'Performance wheel design',
      price:premium ? {diamonds:105 + g*17 + i*11} : {cash:190000 + g*70000 + i*45000},
      icon:'W' + (i+1),
      impact:{power:0,handling:4+g,style:10+g*2},
      premium:premium
    });
  }
});

var soundNames = [
  'Compact I4','Street I4','Classic Inline-6','Modern V6','Sport V6','Touring V8','Muscle V8','Race V8','Flat-6 Sport','Twin-Turbo V6',
  'Twin-Turbo V8','Supercharged V8','V10 Road','V10 Race','V12 Grand Tourer','V12 Performance','Boxer Rally','Turbo Rally','Drift I6',
  'Street Racer V6','Street Racer V8','Track V8','Track V10','Hyper V8TT','Hyper V10','Hyper V12','Extreme I6','Extreme V8','Extreme V10','Apex Signature'
];
var soundPrices = [12,18,25,35,45,58,72,88,105,122,140,158,178,198,220,242,265,288,310,330,350,370,392,414,436,455,472,485,495,500];
var sounds = soundNames.map(function(name,i){
  return {
    id:'sound-' + i,
    name:name,
    note:i>22 ? 'Premium aggressive profile with pops' : i>16 ? 'Aggressive overrun / popping' : 'Street / performance profile',
    price:{cash:soundPrices[i]*1000000},
    icon:String(i+1).padStart(2,'0'),
    impact:{power:i>22?2:0,handling:0,style:5+Math.floor(i/3)},
    premium:i>=23,
    pops:i>=17
  };
});

function lightOptions(kind){
  var base = kind==='neon' ? 42 : kind==='headlights' ? 55 : 35;
  var rainbow = kind==='neon' ? 190 : kind==='headlights' ? 240 : 165;
  var arr = lightColors.map(function(x,i){
    return {
      id:kind + '-' + i,
      name:x[0],
      note:cap(kind) + ' · ' + x[1].toUpperCase(),
      color:x[1],
      price:{diamonds:base+i*2},
      icon:'CLR',
      impact:{power:0,handling:0,style:8+(i%4)}
    };
  });
  arr.push({
    id:kind + '-rainbow',
    name:'Rainbow',
    note:'Premium animated multicolor effect',
    rainbow:true,
    premium:true,
    price:{diamonds:rainbow},
    icon:'RGB',
    impact:{power:0,handling:0,style:28}
  });
  return arr;
}

var state = {
  category:'paint',
  selected:{},
  preview:null,
  cart:new Map(),
  finish:'normal',
  color:'#111714',
  balances:{cash:12650000,bank:287066000,diamonds:1844,lei:1250},
  search:'',
  adding:false,
  checkoutLocked:false
};

var el = {
  app:$('#app'),
  rail:$('#categoryRail'),
  catalog:$('#catalogContent'),
  scroll:$('#catalogScroll'),
  search:$('#searchInput'),
  add:$('#addToBuild'),
  selectedPreview:$('#selectedPreview'),
  mini:$('#miniBuild'),
  cartDrawer:$('#cartDrawer'),
  cartItems:$('#cartItems'),
  cartEmpty:$('#cartEmpty'),
  checkout:$('#checkoutButton'),
  payment:$('#paymentLayer'),
  close:$('#closeGui'),
  cartTarget:$('#cartTarget'),
  cartCanvas:$('#cartCanvas')
};

function category(){
  return categories.find(function(c){ return c.id===state.category; }) || categories[0];
}
function categoryIcon(id){
  var c = categories.find(function(x){ return x.id===id; });
  return c ? c.icon : 'i-star';
}
function dataForCategory(id){
  if(id==='engine') return engineStages;
  if(id==='suspension') return suspension;
  if(id==='armor') return armor;
  if(id==='body') return bodyParts;
  if(id==='livery') return liveries;
  if(id==='wheels') return wheels;
  if(id==='sounds') return sounds;
  if(id==='neon' || id==='headlights' || id==='smoke') return lightOptions(id);
  return [];
}
function plainPrice(p){
  p=p||{};
  var a=[];
  if(p.cash) a.push(p.cash>=1000000 ? kk(p.cash) : money(p.cash));
  if(p.diamonds) a.push(p.diamonds+' ◆');
  if(p.lei) a.push(p.lei+' L');
  return a.join(' + ') || 'FREE';
}
function priceHtml(p){
  p=p||{};
  var a=[];
  if(p.cash) a.push('<span class="price cash">'+ico('i-cash')+(p.cash>=1000000?kk(p.cash):money(p.cash))+'</span>');
  if(p.diamonds) a.push('<span class="price diamond">'+ico('i-diamond')+p.diamonds+'</span>');
  if(p.lei) a.push('<span class="price lei">'+ico('i-lei')+p.lei+'</span>');
  return a.length>1 ? '<div class="multi-price">'+a.join('')+'</div>' : (a[0] || '<span class="price cash">FREE</span>');
}
function goldRain(count){
  var s='<span class="gold-rain">';
  for(var i=0;i<count;i++){
    var x=5+((i*37)%90);
    var d=((i*17)%13)/10;
    var dur=1.75+((i*29)%14)/10;
    var rot=((i*43)%90)-45;
    s+='<i style="--x:'+x+'%;--delay:-'+d+'s;--dur:'+dur+'s;--rot:'+rot+'deg"></i>';
  }
  return s+'</span>';
}
function renderRail(){
  el.rail.innerHTML=categories.map(function(c,i){
    return '<button class="category-btn '+(state.category===c.id?'active':'')+'" data-category="'+c.id+'" data-label="'+c.label+'" title="'+c.label+'">'+ico(c.icon)+'</button>';
  }).join('');
  $$('[data-category]',el.rail).forEach(function(btn){
    btn.addEventListener('click',function(){
      setCategory(btn.dataset.category);
    });
  });
}
function setCategory(id){
  if(state.checkoutLocked || state.category===id) return;
  state.category=id;
  state.search='';
  el.search.value='';
  renderRail();
  el.catalog.animate([{opacity:.2,transform:'translateX(-8px)'},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.2,.8,.2,1)'});
  renderCatalog();
  el.scroll.scrollTop=0;
}
function optionCard(o){
  var selected=state.selected[state.category];
  var selectedClass=selected && selected.id===o.id ? ' selected' : '';
  var premiumClass=o.premium ? ' premium' : '';
  var badges=(o.premium?'<span class="badge gold">PREMIUM</span>':'')+(o.pops?'<span class="badge">POPS</span>':'');
  return '<article class="option-card'+selectedClass+premiumClass+'" data-option="'+o.id+'">'+
    (o.premium?goldRain(9):'')+
    '<div class="option-thumb text">'+o.icon+'</div>'+
    '<div class="option-copy"><b>'+o.name+' '+badges+'</b><small>'+o.note+'</small></div>'+
    '<div class="option-price">'+priceHtml(o.price)+'</div>'+
  '</article>';
}
function renderOptions(items){
  var q=state.search.toLowerCase();
  var filtered=items.filter(function(o){return !q || (o.name+' '+o.note).toLowerCase().indexOf(q)!==-1;});
  if(!filtered.length) return '<div class="empty-options"><b>No matching tuning parts</b>Try another search.</div>';
  return '<div class="option-list">'+filtered.map(optionCard).join('')+'</div>';
}
function renderPaint(){
  var names={normal:'Normal',matte:'Matte',metallic:'Metallic',chrome:'Chrome',chameleon:'Chameleon'};
  return '<div class="section-label"><span>Finish Type</span><span>5 MATERIALS</span></div>'+
    '<div class="finish-tabs">'+Object.keys(names).map(function(k){
      var premium=k==='chrome'||k==='chameleon';
      return '<button class="finish-tab '+(state.finish===k?'active ':'')+(premium?'premium':'')+'" data-finish="'+k+'">'+names[k]+'</button>';
    }).join('')+'</div>'+
    '<div class="section-label"><span>Custom Color</span><span>'+(state.finish==='chrome'||state.finish==='chameleon'?'DIAMANTE':'CASH')+'</span></div>'+
    '<div class="color-workbench"><div class="color-picker" style="--pick:'+state.color+'"><input id="nativeColor" type="color" value="'+state.color+'"></div><div class="color-value" style="--pick:'+state.color+'"><code>'+state.color.toUpperCase()+'</code></div></div>'+
    '<div class="section-label"><span>Palette</span><span>24 COLORS</span></div>'+
    '<div class="swatch-grid">'+swatches.map(function(x){return '<button class="swatch '+(state.color.toLowerCase()===x[1]?'active':'')+'" data-color="'+x[1]+'" style="--swatch:'+x[1]+'" title="'+x[0]+'"></button>';}).join('')+'</div>';
}
function renderEngine(){
  var selected=state.selected.engine||engineStages[0];
  return '<div class="section-label"><span>ECU Calibration</span><span>+15% PER STAGE</span></div>'+
    '<div class="stage-grid">'+engineStages.map(function(o){
      return '<article class="stage-card '+(selected.id===o.id?'selected ':'')+(o.premium?'premium':'')+'" data-option="'+o.id+'">'+
        (o.premium?goldRain(14):'')+
        '<small>'+(o.premium?'PREMIUM PERFORMANCE':'ENGINE CALIBRATION')+'</small>'+
        '<h3>'+o.name+(o.premium?' <span class="badge gold">TURBO</span>':'')+'</h3>'+
        '<p>'+o.note+'</p><div class="stage-price">'+priceHtml(o.price)+'</div>'+
      '</article>';
    }).join('')+'</div>';
}
function renderLights(kind){
  var items=lightOptions(kind);
  var selected=state.selected[kind];
  return '<div class="section-label"><span>Color Library</span><span>'+items.length+' COLORS</span></div>'+
    '<div class="swatch-grid">'+items.map(function(o){
      return '<button class="swatch '+(o.rainbow?'rainbow ':'')+(selected&&selected.id===o.id?'active':'')+'" data-light="'+o.id+'" style="'+(o.color?'--swatch:'+o.color:'')+'" title="'+o.name+'"></button>';
    }).join('')+'</div>'+
    renderOptions(items);
}
function renderCatalog(){
  var c=category();
  $('#categoryIndex').textContent=String(categories.indexOf(c)+1).padStart(2,'0')+' / '+c.label.toUpperCase();
  $('#categoryTitle').textContent=c.title;
  $('#categoryDescription').textContent=c.desc;

  if(c.id==='paint') el.catalog.innerHTML=renderPaint();
  else if(c.id==='engine') el.catalog.innerHTML=renderEngine();
  else if(c.id==='neon'||c.id==='headlights'||c.id==='smoke') el.catalog.innerHTML=renderLights(c.id);
  else {
    var items=dataForCategory(c.id);
    el.catalog.innerHTML='<div class="section-label"><span>Available '+c.label+'</span><span>'+items.length+' OPTIONS</span></div>'+renderOptions(items);
  }
  bindCatalog();
}
function bindCatalog(){
  $$('[data-option]',el.catalog).forEach(function(node){
    node.addEventListener('click',function(){
      var item=findOption(state.category,node.dataset.option);
      if(item) selectItem(item,node);
    });
  });
  $$('[data-finish]',el.catalog).forEach(function(btn){
    btn.addEventListener('click',function(){
      state.finish=btn.dataset.finish;
      previewPaint(btn);
      renderCatalog();
    });
  });
  $$('[data-color]',el.catalog).forEach(function(btn){
    btn.addEventListener('click',function(){
      state.color=btn.dataset.color;
      previewPaint(btn);
      renderCatalog();
    });
  });
  $$('[data-light]',el.catalog).forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=lightOptions(state.category).find(function(o){return o.id===btn.dataset.light;});
      if(item) selectItem(item,btn);
    });
  });
  var nativeColor=$('#nativeColor',el.catalog);
  if(nativeColor){
    nativeColor.addEventListener('input',function(){
      state.color=nativeColor.value;
      previewPaint(nativeColor,false);
      var picker=$('.color-picker',el.catalog),box=$('.color-value',el.catalog),code=$('.color-value code',el.catalog);
      if(picker) picker.style.setProperty('--pick',state.color);
      if(box) box.style.setProperty('--pick',state.color);
      if(code) code.textContent=state.color.toUpperCase();
    });
    nativeColor.addEventListener('change',function(){renderCatalog();});
  }
}
function findOption(categoryId,id){
  var arr=dataForCategory(categoryId);
  return arr.find(function(o){return o.id===id;});
}
function selectItem(item,sourceNode){
  state.selected[state.category]=item;
  state.preview={category:state.category,item:item,source:sourceNode||null};
  updateSelected();
  renderCatalog();
  if(item.premium) burstGold(sourceNode||$('.premium',el.catalog));
}
function previewPaint(sourceNode,toastIt){
  if(toastIt===undefined) toastIt=true;
  var premium=state.finish==='chrome'||state.finish==='chameleon';
  var item={
    id:'paint-'+state.finish+'-'+state.color,
    name:cap(state.finish)+' · '+state.color.toUpperCase(),
    note:'Custom '+state.finish+' finish',
    price:finishPrices[state.finish],
    icon:'CLR',
    color:state.color,
    premium:premium,
    impact:{power:0,handling:0,style:premium?24:18}
  };
  state.selected.paint=item;
  state.preview={category:'paint',item:item,source:sourceNode||null};
  updateSelected();
  if(premium) burstGold(sourceNode||$('.finish-tab.active',el.catalog));
  if(toastIt) toast('Previewing <b>'+item.name+'</b>');
}
function updateSelected(){
  var p=state.preview;
  el.selectedPreview.classList.toggle('premium',!!(p&&p.item.premium));
  $$('.gold-rain',el.selectedPreview).forEach(function(n){n.remove();});
  if(!p){
    $('#selectedTitle').textContent='Nothing selected';
    $('#selectedSubtitle').textContent='Choose a part to preview it.';
    $('#selectedName').textContent='Factory setup';
    $('#selectedPrice').textContent='—';
    $('.selected-icon').innerHTML=ico('i-star');
    el.add.disabled=true;
    setImpact({power:0,handling:0,style:0});
    return;
  }
  var c=categories.find(function(x){return x.id===p.category;})||category();
  $('#selectedTitle').textContent=p.item.name;
  $('#selectedSubtitle').textContent=p.item.note;
  $('#selectedName').textContent=p.item.name;
  $('#selectedPrice').textContent=plainPrice(p.item.price);
  $('.selected-icon').innerHTML=ico(c.icon);
  el.add.disabled=false;
  setImpact(p.item.impact||{power:0,handling:0,style:0});
  if(p.item.premium) el.selectedPreview.insertAdjacentHTML('afterbegin',goldRain(11));
}
function setImpact(impact){
  ['Power','Handling','Style'].forEach(function(name){
    var key=name.toLowerCase(),v=clamp(Number(impact[key]||0),0,100);
    $('#impact'+name).style.width=v+'%';
    $('#impact'+name+'Text').textContent='+'+v+'%';
  });
}
function cartKeyFor(categoryId,item){
  return item.cartKey || categoryId;
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
function totalText(){
  var t=cartTotals(),a=[];
  if(t.cash) a.push(t.cash>=1000000?kk(t.cash):money(t.cash));
  if(t.diamonds) a.push(t.diamonds+' ◆');
  if(t.lei) a.push(t.lei+' L');
  return a.join(' · ')||'No parts selected';
}
async function addPreviewToBuild(){
  if(!state.preview || state.adding || state.checkoutLocked) return;
  state.adding=true;
  var categoryId=state.preview.category;
  var item=state.preview.item;
  var key=cartKeyFor(categoryId,item);
  var source=state.preview.source || $('.option-card.selected,.stage-card.selected,.swatch.active,.finish-tab.active',el.catalog);
  await flyToCart(source,item.premium);
  state.cart.set(key,{key:key,category:categoryId,name:item.name,price:Object.assign({},item.price||{}),item:item});
  renderCart();
  cartRenderer.bump(item.premium);
  state.adding=false;
  toast('Added <b>'+item.name+'</b> to your build');
}
function renderCart(){
  var items=Array.from(state.cart.values()),t=cartTotals();
  $('#cartBadge').textContent=items.length;
  $('#cart3dCount').textContent=items.length;
  $('#buildCount').textContent=items.length+' ITEM'+(items.length===1?'':'S');
  $('#buildTotal').textContent=totalText();
  el.cartEmpty.classList.toggle('hidden',items.length>0);
  el.checkout.disabled=!items.length;
  $('#totalCash').textContent=money(t.cash);
  $('#totalDiamonds').textContent=t.diamonds+' ◆';
  $('#totalLei').textContent=t.lei+' L';

  el.cartItems.innerHTML=items.map(function(x){
    return '<div class="cart-item"><div class="cart-item-icon">'+ico(categoryIcon(x.category))+'</div><div><b>'+x.name+'</b><small>'+cap(x.category)+'</small></div><span class="cart-item-price">'+plainPrice(x.price)+'</span><button class="remove-item" data-remove="'+x.key+'">'+ico('i-close')+'</button></div>';
  }).join('');

  el.mini.innerHTML=items.length ? items.slice(-6).map(function(x){
    return '<div class="mini-item"><span>'+x.name+'</span><span>'+plainPrice(x.price)+'</span></div>';
  }).join('') : '<div class="mini-empty">No parts queued.</div>';

  $$('[data-remove]',el.cartItems).forEach(function(btn){
    btn.addEventListener('click',function(){
      state.cart.delete(btn.dataset.remove);
      renderCart();
      cartRenderer.bump(false);
    });
  });
}
function flyToCart(source,premium){
  return new Promise(function(resolve){
    if(!source){resolve();return;}
    var r=source.getBoundingClientRect();
    var d=el.cartTarget.getBoundingClientRect();
    var clone=source.cloneNode(true);
    clone.classList.add('fly-part');
    clone.style.left=r.left+'px';
    clone.style.top=r.top+'px';
    clone.style.width=r.width+'px';
    clone.style.height=r.height+'px';
    document.body.appendChild(clone);

    var dx=d.left+d.width*.50-(r.left+r.width*.50);
    var dy=d.top+d.height*.42-(r.top+r.height*.50);
    var arc=Math.min(120,Math.max(55,Math.abs(dx)*.12));
    var anim=clone.animate([
      {transform:'translate3d(0,0,0) scale(1) rotate(0deg)',opacity:1,filter:'blur(0px)'},
      {offset:.55,transform:'translate3d('+(dx*.52)+'px,'+(dy*.50-arc)+'px,0) scale(.68) rotate('+(premium?10:6)+'deg)',opacity:.96,filter:'blur(0px)'},
      {offset:.86,transform:'translate3d('+(dx*.88)+'px,'+(dy*.86-12)+'px,0) scale(.28) rotate(-10deg)',opacity:.72,filter:'blur(.2px)'},
      {transform:'translate3d('+dx+'px,'+dy+'px,0) scale(.04) rotate(-18deg)',opacity:0,filter:'blur(1px)'}
    ],{duration:760,easing:'cubic-bezier(.16,.8,.22,1)',fill:'forwards'});
    for(var i=0;i<9;i++){
      setTimeout(function(){sparkAt(d.left+d.width*.5,d.top+d.height*.45,premium);},500+i*22);
    }
    anim.onfinish=function(){clone.remove();resolve();};
  });
}
function sparkAt(x,y,gold){
  var s=document.createElement('i');
  s.className='fly-spark'+(gold?' gold':'');
  s.style.left=x+'px';s.style.top=y+'px';
  var a=Math.random()*Math.PI*2,dist=18+Math.random()*32;
  s.style.setProperty('--sx',(Math.cos(a)*dist)+'px');
  s.style.setProperty('--sy',(Math.sin(a)*dist)+'px');
  document.body.appendChild(s);
  setTimeout(function(){s.remove();},650);
}
function burstGold(node){
  if(!node)return;
  var r=node.getBoundingClientRect();
  for(var i=0;i<16;i++){
    setTimeout(function(){
      sparkAt(r.left+r.width*(.2+Math.random()*.6),r.top+r.height*(.2+Math.random()*.6),true);
    },i*28);
  }
}
function resetCategory(){
  if(state.checkoutLocked)return;
  delete state.selected[state.category];
  if(state.preview&&state.preview.category===state.category)state.preview=null;
  if(state.category==='paint'){state.finish='normal';state.color='#111714';}
  renderCatalog();
  updateSelected();
}
function toast(html){
  var n=document.createElement('div');
  n.className='toast';n.innerHTML=html;
  $('#toastStack').appendChild(n);
  setTimeout(function(){
    n.style.opacity='0';n.style.transform='translateX(12px)';
    setTimeout(function(){n.remove();},260);
  },2200);
}
function updateWallet(){
  $('#cashBalance').textContent=money(state.balances.cash);
  $('#bankBalance').textContent=money(state.balances.bank);
  $('#diamondBalance').textContent=Number(state.balances.diamonds).toLocaleString('de-DE');
  $('#leiBalance').textContent=Number(state.balances.lei).toLocaleString('de-DE');
}
function updateTabIndicator(){
  var nav=$('.top-tabs'),active=$('.top-tabs button.active'),bar=$('.top-tabs i');
  if(!nav||!active||!bar)return;
  var r=active.getBoundingClientRect(),nr=nav.getBoundingClientRect();
  bar.style.width=(r.width-22)+'px';
  bar.style.left=(r.left-nr.left+11)+'px';
}
function selectTopTab(btn){
  $$('.top-tabs button').forEach(function(b){b.classList.toggle('active',b===btn);});
  updateTabIndicator();
  var view=btn.dataset.top;
  if(view==='build')el.cartDrawer.classList.add('open');
  if(view==='info')toast('<b>Browser demo:</b> select a part, preview it, add it to the cart, then pay & install.');
}
function closeUiNormal(){
  if(state.checkoutLocked){toast('Purchase animation is still running.');return;}
  el.app.classList.add('closing-ui');
  setTimeout(function(){
    el.app.classList.remove('closing-ui');
    el.app.classList.add('ui-closed');
  },430);
}
function reopenUi(){
  el.app.classList.remove('ui-closed');
  requestAnimationFrame(function(){
    $('.topbar').animate([{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'none'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
    $('.left-shell').animate([{opacity:0,transform:'translateX(-10px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
    $('.right-shell').animate([{opacity:0,transform:'translateX(10px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
  });
}
function startPurchase(){
  if(!state.cart.size || state.checkoutLocked)return;
  state.checkoutLocked=true;
  el.app.classList.add('checkout-locked');
  el.close.classList.add('locked');
  el.cartDrawer.classList.remove('open');

  var modes=[
    {name:'insert',label:'CARD INSERT',duration:1750},
    {name:'swipe',label:'CARD SWIPE',duration:1720},
    {name:'tap',label:'CONTACTLESS TAP',duration:1780}
  ];
  var mode=modes[Math.floor(Math.random()*modes.length)];
  $('#paymentModeLabel').textContent=mode.label;
  el.payment.className='payment-layer show mode-'+mode.name;
  el.payment.setAttribute('aria-hidden','false');
  void el.payment.offsetWidth;
  el.payment.classList.add('playing');

  setTimeout(function(){
    el.payment.classList.add('complete');
  },Math.max(1000,mode.duration-600));

  setTimeout(function(){
    var count=state.cart.size;
    state.cart.clear();
    renderCart();
    el.payment.classList.remove('playing');
    toast('<b>'+count+' upgrade'+(count===1?'':'s')+' installed.</b>');
    setTimeout(function(){
      el.payment.className='payment-layer';
      el.payment.setAttribute('aria-hidden','true');
      el.app.classList.remove('checkout-locked');
      el.close.classList.remove('locked');
      state.checkoutLocked=false;
      closeUiNormal();
    },420);
  },mode.duration);
}

/* Exact geometry extracted from the uploaded model.gltf. */
var CART_POSITIONS=[0.3125,0.1875,0.5,-0.292969,0.1875,0.25,0.292969,0.1875,0.25,-0.3125,0.1875,0.5,-0.3125,0.4375,0.4375,0.3125,0.4375,0.4375,-0.3125,0.1875,0.5,0.3125,0.1875,0.5,-0.25,0.498134,-0.452658,0.25,0.498134,-0.452658,-0.3125,0.4375,0.4375,0.3125,0.4375,0.4375,-0.25,0.846131,-0.452514,0.25,0.846131,-0.452514,-0.25,0.498134,-0.452658,0.25,0.498134,-0.452658,-0.3125,0.935634,0.531717,0.3125,0.935634,0.531717,-0.3125,0.4375,0.4375,0.3125,0.4375,0.4375,-0.296875,0.685634,0.359842,0.296875,0.685634,0.359842,-0.3125,0.4375,0.4375,0.3125,0.4375,0.4375,-0.28125,0.964031,0.294299,0.28125,0.964031,0.294299,-0.296875,0.685634,0.359842,0.296875,0.685634,0.359842,-0.3125,0.682781,0.481799,0.3125,0.682781,0.481799,-0.296875,0.685634,0.359842,0.296875,0.685634,0.359842,-0.3125,0.4375,0.4375,-0.3125,0.935634,0.531717,-0.25,0.498134,-0.452658,-0.25,0.846131,-0.452514,0.3125,0.935634,0.531717,0.3125,0.4375,0.4375,0.25,0.846131,-0.452514,0.25,0.498134,-0.452658,-0.3125,0.997045,0.543332,0.3125,0.997045,0.543332,-0.3125,0.935634,0.531717,0.3125,0.935634,0.531717,-0.3125,1.058456,0.679947,0.3125,1.058456,0.679947,-0.3125,0.997045,0.543332,0.3125,0.997045,0.543332,0.273438,0.1875,0.0,-0.253906,0.1875,-0.25,0.253906,0.1875,-0.25,-0.273438,0.1875,0.0,-0.273438,0.1875,0.0,-0.292969,0.1875,0.25,0.292969,0.1875,0.25,0.273438,0.1875,0.0,-0.234375,0.1875,-0.5,-0.253906,0.1875,-0.25,0.253906,0.1875,-0.25,0.234375,0.1875,-0.5,-0.234375,0.002951,-0.506598,-0.253906,0.002951,-0.256598,-0.234375,0.1875,-0.5,-0.253906,0.1875,-0.25,-0.292969,0.002951,0.243402,-0.3125,0.002951,0.493402,-0.292969,0.1875,0.25,-0.3125,0.1875,0.5,0.253906,0.002951,-0.256598,0.234375,0.002951,-0.506598,0.253906,0.1875,-0.25,0.234375,0.1875,-0.5,0.3125,0.002951,0.493402,0.292969,0.002951,0.243402,0.3125,0.1875,0.5,0.292969,0.1875,0.25];
var CART_INDICES=[0,2,1,0,1,3,6,4,5,6,5,7,10,8,9,10,9,11,14,12,13,14,13,15,18,16,17,18,17,19,22,20,21,22,21,23,26,24,25,26,25,27,30,28,29,30,29,31,34,32,33,34,33,35,38,36,37,38,37,39,42,40,41,42,41,43,46,44,45,46,45,47,48,50,49,48,49,51,52,53,54,52,54,55,56,57,58,56,58,59,62,60,61,62,61,63,66,64,65,66,65,67,70,68,69,70,69,71,74,72,73,74,73,75];

function CartRenderer(canvas){
  this.canvas=canvas;
  this.ctx=canvas.getContext('2d');
  this.rot=.55;
  this.bumpStart=0;
  this.gold=false;
  this.last=performance.now();
  this.resize();
  var self=this;
  requestAnimationFrame(function(t){self.frame(t);});
}
CartRenderer.prototype.resize=function(){
  var dpr=Math.min(2,window.devicePixelRatio||1);
  var r=this.canvas.getBoundingClientRect();
  var w=Math.max(1,Math.round((r.width||180)*dpr)),h=Math.max(1,Math.round((r.height||150)*dpr));
  if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
  this.dpr=dpr;
};
CartRenderer.prototype.bump=function(gold){
  this.bumpStart=performance.now();
  this.gold=!!gold;
  el.cartTarget.classList.remove('bump');
  void el.cartTarget.offsetWidth;
  el.cartTarget.classList.add('bump');
  setTimeout(function(){el.cartTarget.classList.remove('bump');},680);
};
CartRenderer.prototype.frame=function(t){
  this.resize();
  var dt=t-this.last;this.last=t;
  this.rot+=dt*.00018;
  this.draw(t);
  var self=this;
  requestAnimationFrame(function(n){self.frame(n);});
};
CartRenderer.prototype.draw=function(t){
  var ctx=this.ctx,w=this.canvas.width,h=this.canvas.height,dpr=this.dpr;
  ctx.clearRect(0,0,w,h);
  var bumpAge=t-this.bumpStart;
  var bump=(bumpAge>0&&bumpAge<650)?Math.sin((bumpAge/650)*Math.PI)*.18:0;
  var ry=this.rot+bump*.8;
  var rx=-.22+bump*.35;
  var cy=.53,cz=.08;
  var crY=Math.cos(ry),srY=Math.sin(ry),crX=Math.cos(rx),srX=Math.sin(rx);
  var verts=[];
  var scale=Math.min(w,h)*1.38;

  for(var i=0;i<CART_POSITIONS.length;i+=3){
    var x=CART_POSITIONS[i],y=CART_POSITIONS[i+1]-cy,z=CART_POSITIONS[i+2]-cz;
    var x1=x*crY+z*srY;
    var z1=-x*srY+z*crY;
    var y2=y*crX-z1*srX;
    var z2=y*srX+z1*crX;
    var depth=2.55-z2;
    var p=1/depth;
    verts.push({
      x:w*.5+x1*scale*p,
      y:h*.58-y2*scale*p,
      z:z2,
      x3:x1,y3:y2,z3:z2
    });
  }

  var tris=[];
  for(var j=0;j<CART_INDICES.length;j+=3){
    var a=verts[CART_INDICES[j]],b=verts[CART_INDICES[j+1]],c=verts[CART_INDICES[j+2]];
    var ux=b.x3-a.x3,uy=b.y3-a.y3,uz=b.z3-a.z3;
    var vx=c.x3-a.x3,vy=c.y3-a.y3,vz=c.z3-a.z3;
    var nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
    var nl=Math.hypot(nx,ny,nz)||1;nx/=nl;ny/=nl;nz/=nl;
    var light=clamp(nx*.35+ny*.78+nz*.48,-.2,1);
    tris.push({a:a,b:b,c:c,z:(a.z+b.z+c.z)/3,light:light});
  }
  tris.sort(function(A,B){return A.z-B.z;});

  var hasItems=state.cart.size>0;
  tris.forEach(function(tr){
    var base=hasItems?[48,222,106]:[106,119,112];
    if(this.gold){base=[223,177,66];}
    var k=.48+tr.light*.42;
    var r=Math.round(base[0]*k),g=Math.round(base[1]*k),b=Math.round(base[2]*k);
    ctx.beginPath();ctx.moveTo(tr.a.x,tr.a.y);ctx.lineTo(tr.b.x,tr.b.y);ctx.lineTo(tr.c.x,tr.c.y);ctx.closePath();
    ctx.fillStyle='rgba('+r+','+g+','+b+',.92)';
    ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.12)';
    ctx.lineWidth=Math.max(1,dpr*.55);
    ctx.stroke();
  },this);

  ctx.save();
  ctx.globalCompositeOperation='destination-over';
  var grd=ctx.createRadialGradient(w*.5,h*.78,0,w*.5,h*.78,w*.34);
  grd.addColorStop(0,hasItems?'rgba(75,255,130,.16)':'rgba(255,255,255,.05)');
  grd.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=grd;
  ctx.fillRect(0,0,w,h);
  ctx.restore();
};

var cartRenderer=new CartRenderer(el.cartCanvas);

function bindGlobal(){
  el.search.addEventListener('input',function(e){state.search=e.target.value.trim();renderCatalog();});
  $('#resetCategory').addEventListener('click',resetCategory);
  el.add.addEventListener('click',addPreviewToBuild);
  $('#undoPreview').addEventListener('click',resetCategory);
  $('#openCart').addEventListener('click',function(){if(!state.checkoutLocked)el.cartDrawer.classList.add('open');});
  $('#closeCart').addEventListener('click',function(){if(!state.checkoutLocked)el.cartDrawer.classList.remove('open');});
  $('#clearCart').addEventListener('click',function(){
    if(state.checkoutLocked)return;
    state.cart.clear();renderCart();cartRenderer.bump(false);toast('Build cleared');
  });
  el.checkout.addEventListener('click',startPurchase);
  el.close.addEventListener('click',closeUiNormal);
  $('#reopenUi').addEventListener('click',reopenUi);

  $$('.top-tabs button').forEach(function(btn){
    btn.addEventListener('click',function(){if(!state.checkoutLocked)selectTopTab(btn);});
  });

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      if(state.checkoutLocked){toast('Purchase animation is still running.');return;}
      if(el.cartDrawer.classList.contains('open'))el.cartDrawer.classList.remove('open');
      else closeUiNormal();
    }
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();el.search.focus();}
  });
  window.addEventListener('resize',function(){updateTabIndicator();cartRenderer.resize();});
}

updateWallet();
renderRail();
renderCatalog();
renderCart();
updateSelected();
bindGlobal();
setTimeout(updateTabIndicator,60);
