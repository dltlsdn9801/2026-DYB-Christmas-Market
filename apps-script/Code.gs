/* ===== DYB Christmas Market — shared rules (used by the website preview AND the Google Apps Script) ===== */
var HEADERS = {
  items:  ['ID','카테고리','이름','가격','재고','1인최대','이미지','판매'],
  users:  ['이름','비밀번호','포인트','학년','담임'],
  orders: ['시간','주문번호','이름','상품ID','상품명','수량','단가','금액','주문후포인트','학생코드'],
  box:    ['등급','상품명','이미지','가중치','남은수량'],
  roul:   ['칸','상품명','이미지','남은수량'],
  wins:   ['시간','이름','게임','등급','상품명','이미지','학생코드']
};
var TAB_NAMES = {items:'물품',users:'학생',orders:'주문',box:'랜덤박스',roul:'룰렛',wins:'당첨기록'};

var SEED = {
  items: [
    ['ticket_box','참가권','랜덤박스 참가권',1000,100,3,'ticket_box','Y'],
    ['ticket_roul','참가권','룰렛 게임 참가권',1000,100,3,'ticket_roul','Y'],
    ['c1','쿠폰','단어커트 +5',2500,100,'','c1','Y'],
    ['c2','쿠폰','구두 면제권',3000,100,'','c2','Y'],
    ['c3','쿠폰','온라인 숙제 면제권',3500,100,'','c3','Y'],
    ['c4','쿠폰','한과목 숙제 면제권',4000,100,'','c4','Y'],
    ['c5','쿠폰','재시험 면제권',4500,100,'','c5','Y'],
    ['c6','쿠폰','전체 숙제 면제권',5000,100,'','c6','Y'],
    ['tteok','스페셜','떡볶이',3000,100,'','tteok','Y'],
    ['roulette','스페셜','돌려돌려 랜덤 룰렛',1500,100,'','roulette','Y'],
    ['damla','간식','다믈라 젤리',500,100,'','damla','Y'],
    ['jam_straw','간식','재미스 딸기쿠키',2000,100,'','jam_straw','Y'],
    ['jam_apple','간식','재미스 사과쿠키',2000,100,'','jam_apple','Y'],
    ['nemo','간식','네모스낵',3000,100,'','nemo','Y'],
    ['apple_juice','간식','과수원 사과주스',3000,100,'','apple_juice','Y'],
    ['potato','간식','감자알칩',5000,100,'','potato','Y'],
    ['chocochip','간식','초코칩 미니',5000,100,'','chocochip','Y'],
    ['lollipop','간식','크리스마스 젤리 롤리팝',8000,100,'','lollipop','Y'],
    ['hotpack','문구','핫팩',2500,100,'','hotpack','Y'],
    ['pen','문구','볼펜',2500,100,'','pen','Y'],
    ['note','문구','귀여운 노트',3000,100,'','note','Y'],
    ['highlighter','문구','형광펜',3000,100,'','highlighter','Y'],
    ['pencil','문구','크리스마스 연필',3000,100,'','pencil','Y'],
    ['pouch','문구','수정테이프',4500,100,'','pouch','Y'],
    ['keyring','문구','크리스마스 키링',4500,100,'','keyring','Y'],
    ['santa_set','문구','산타 문구 세트',5000,100,'','santa_set','Y'],
    ['ring','문구','크리스마스 불빛반지',5000,100,'','ring','Y'],
    ['charpen','문구','크리스마스 4색 볼펜',5000,100,'','charpen','Y']
  ],
  users: [
    ['김민준','1234',10000,'샘플',''],['이서연','1234',10000,'샘플',''],['박지호','1234',10000,'샘플',''],['최하은','1234',10000,'샘플',''],['정도윤','1234',10000,'샘플',''],
    ['강서윤','1234',10000,'샘플',''],['조예준','1234',10000,'샘플',''],['윤지우','1234',10000,'샘플',''],['장시우','1234',10000,'샘플',''],['임하린','1234',10000,'샘플','']
  ],
  box: [
    ['1등','배달의민족 3만원권','baemin',1,1],
    ['2등','크리스마스 젤리 롤리팝','lollipop',4,100],
    ['2등','크리스마스 불빛반지','ring',5,100],
    ['3등','초코칩 미니','chocochip',15,100],
    ['3등','크리스마스 연필','pencil',15,100],
    ['3등','재미스 딸기쿠키','jam_straw',20,100],
    ['4등','다믈라 젤리','damla',40,100]
  ],
  roul: [
    [1,'떡볶이','tteok',100],[2,'다믈라 젤리','damla',100],[3,'크리스마스 연필','pencil',100],
    [4,'크리스마스 불빛반지','ring',100],[5,'초코칩 미니','chocochip',100],[6,'단어커트 +5','c1',100]
  ]
};

function E_num(v){ var n = Number(v); return isNaN(n) ? 0 : n; }
function E_str(v){ return v === null || v === undefined ? '' : String(v).trim(); }
function E_mark(o,k){ (o._dirty = o._dirty || []).indexOf(k) < 0 && o._dirty.push(k); }
function E_onSale(i){ return E_str(i['판매']).toUpperCase() !== 'N' && E_str(i['ID']) !== ''; }

function E_pw(v){ return E_str(v).replace(/\s/g,'').toUpperCase(); }
function E_key(u){ return E_str(u['이름']) + '|' + E_pw(u['비밀번호']); }
function E_isMe(row, u){ var c = E_str(row['학생코드']); return c ? c === E_key(u) : E_str(row['이름']) === E_str(u['이름']); }
function E_findUser(db, name, pw){
  name = E_str(name); pw = E_pw(pw);
  if (!name) throw new Error('이름을 적어 줘!');
  var same = db.users.filter(function(x){ return E_str(x['이름']) === name; });
  if (!same.length) throw new Error('명단에 없는 이름이에요. 선생님께 확인해 주세요!');
  var u = same.filter(function(x){ return E_pw(x['비밀번호']) === pw; })[0];
  if (!u) throw new Error('초대장 번호가 틀렸어요!');
  return u;
}
function E_bought(db, u, id){
  return db.orders.reduce(function(s,o){ return (E_isMe(o,u) && E_str(o['상품ID'])===id) ? s + E_num(o['수량']) : s; }, 0);
}
function E_used(db, u, game){
  return db.wins.filter(function(w){ return E_isMe(w,u) && E_str(w['게임'])===game; }).length;
}
function E_tickets(db, u){
  return { box: E_bought(db,u,'ticket_box') - E_used(db,u,'랜덤박스'),
           roul: E_bought(db,u,'ticket_roul') - E_used(db,u,'룰렛') };
}
function E_state(db, u){
  var name = E_str(u['이름']);
  return {
    user: { name: name, points: E_num(u['포인트']), tickets: E_tickets(db,u) },
    items: db.items.filter(E_onSale).map(function(i){ var id=E_str(i['ID']); return {
      id:id, cat:E_str(i['카테고리']), name:E_str(i['이름']), price:E_num(i['가격']), stock:E_num(i['재고']),
      limit:E_num(i['1인최대']), img:E_str(i['이미지']), mine:E_bought(db,u,id) }; }),
    box: db.box.filter(function(b){ return E_str(b['상품명']); }).map(function(b){ return {grade:E_str(b['등급']), name:E_str(b['상품명']), img:E_str(b['이미지']), left:E_num(b['남은수량'])}; }),
    roul: db.roul.filter(function(r){ return E_str(r['상품명']); }).map(function(r){ return {name:E_str(r['상품명']), img:E_str(r['이미지']), left:E_num(r['남은수량'])}; }),
    wins: db.wins.slice(-40).reverse().map(function(w){ return {t:E_str(w['시간']), name:E_str(w['이름']), game:E_str(w['게임']), grade:E_str(w['등급']), prize:E_str(w['상품명']), img:E_str(w['이미지'])}; }),
    myOrders: db.orders.filter(function(o){ return E_isMe(o,u); }).slice(-30).reverse().map(function(o){ return {t:E_str(o['시간']), no:E_str(o['주문번호']), name:E_str(o['상품명']), qty:E_num(o['수량']), sum:E_num(o['금액'])}; })
  };
}
function E_order(db, req, now){
  var u = E_findUser(db, req.name, req.pw), name = E_str(u['이름']);
  var cart = (req.cart || []).filter(function(c){ return c && E_num(c.qty) > 0; });
  if (!cart.length) throw new Error('장바구니가 비어 있어요!');
  var total = 0, lines = [];
  cart.forEach(function(c){
    var it = db.items.filter(function(i){ return E_str(i['ID']) === E_str(c.id) && E_onSale(i); })[0];
    if (!it) throw new Error('지금 팔지 않는 물건이 장바구니에 있어요.');
    var q = Math.floor(E_num(c.qty)), stock = E_num(it['재고']), lim = E_num(it['1인최대']);
    if (stock < q) throw new Error(E_str(it['이름']) + ' 재고가 부족해요! (남은 수량 ' + stock + '개)');
    if (lim > 0 && E_bought(db,u,E_str(it['ID'])) + q > lim) throw new Error(E_str(it['이름']) + '은(는) 한 사람당 ' + lim + '개까지만 살 수 있어요!');
    total += E_num(it['가격']) * q; lines.push({it:it, q:q});
  });
  if (total > E_num(u['포인트'])) throw new Error('포인트가 부족해요! (필요 ' + total.toLocaleString() + ' / 내 포인트 ' + E_num(u['포인트']).toLocaleString() + ')');
  var no = 'D' + String(Date.now()).slice(-6) + Math.floor(Math.random()*90+10);
  u['포인트'] = E_num(u['포인트']) - total; E_mark(u,'포인트');
  lines.forEach(function(l){
    l.it['재고'] = E_num(l.it['재고']) - l.q; E_mark(l.it,'재고');
    var o = {'시간':now,'주문번호':no,'이름':name,'상품ID':E_str(l.it['ID']),'상품명':E_str(l.it['이름']),'수량':l.q,'단가':E_num(l.it['가격']),'금액':E_num(l.it['가격'])*l.q,'주문후포인트':u['포인트'],'학생코드':E_key(u)};
    db.orders.push(o); (db.newOrders = db.newOrders || []).push(o);
  });
  return { orderNo: no, total: total, lines: lines.map(function(l){ return {name:E_str(l.it['이름']), qty:l.q, img:E_str(l.it['이미지'])}; }) };
}
function E_play(db, req, now, rand){
  var u = E_findUser(db, req.name, req.pw), name = E_str(u['이름']);
  var isRoul = req.game === 'roul', game = isRoul ? '룰렛' : '랜덤박스';
  var t = E_tickets(db, u);
  if ((isRoul ? t.roul : t.box) < 1) throw new Error(game + ' 참가권이 없어요! 마켓에서 참가권을 먼저 사 주세요 🎟️');
  var list = isRoul ? db.roul.filter(function(r){ return E_str(r['상품명']); }) : db.box.filter(function(b){ return E_str(b['상품명']); });
  var cand = [];
  list.forEach(function(r,i){ if (E_num(r['남은수량']) > 0 && (isRoul || E_num(r['가중치']) > 0)) cand.push(i); });
  if (!cand.length) throw new Error('상품이 모두 소진되었어요. 선생님께 알려 주세요!');
  var idx;
  if (isRoul) idx = cand[Math.floor(rand() * cand.length)];
  else {
    var tw = cand.reduce(function(s,i){ return s + E_num(list[i]['가중치']); }, 0), x = rand() * tw;
    idx = cand[cand.length-1];
    for (var k = 0; k < cand.length; k++){ x -= E_num(list[cand[k]]['가중치']); if (x < 0){ idx = cand[k]; break; } }
  }
  var row = list[idx];
  row['남은수량'] = E_num(row['남은수량']) - 1; E_mark(row,'남은수량');
  var w = {'시간':now,'이름':name,'게임':game,'등급':E_str(row['등급']),'상품명':E_str(row['상품명']),'이미지':E_str(row['이미지']),'학생코드':E_key(u)};
  db.wins.push(w); (db.newWins = db.newWins || []).push(w);
  return { index: idx, prize: { grade: E_str(row['등급']), name: E_str(row['상품명']), img: E_str(row['이미지']) } };
}

/* ===== Google Apps Script 부분 (시트와 연결) ===== */

/** 처음 한 번만 실행: 탭과 샘플 데이터를 만들어요. 이미 내용이 있는 탭은 건드리지 않아요. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var seedFor = { items: SEED.items, users: SEED.users, orders: [], box: SEED.box, roul: SEED.roul, wins: [] };
  var colors = { items:'#e5403a', users:'#1f7a4d', orders:'#b50005', box:'#ffc83d', roul:'#2fa36b', wins:'#7cc8ff' };
  Object.keys(TAB_NAMES).forEach(function(k){
    var sh = ss.getSheetByName(TAB_NAMES[k]) || ss.insertSheet(TAB_NAMES[k]);
    if (sh.getLastRow() > 0) { ensureCols_(sh, HEADERS[k]); return; }
    var h = HEADERS[k];
    sh.getRange(1,1,1,h.length).setValues([h]).setFontWeight('bold').setBackground(colors[k]).setFontColor(k==='box'?'#3a2420':'#ffffff');
    sh.setFrozenRows(1);
    if (k === 'users') sh.getRange('B:B').setNumberFormat('@');
    var rows = seedFor[k];
    if (rows.length) sh.getRange(2,1,rows.length,h.length).setValues(rows.map(function(r){ return r.map(function(v){ return v===''?'':v; }); }));
    sh.autoResizeColumns(1, h.length);
  });
  setupRosters_();
  var first = ss.getSheetByName('시트1') || ss.getSheetByName('Sheet1');
  if (first && first.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(first);
  SpreadsheetApp.getUi && SpreadsheetApp.flush();
}

function loadDB_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), db = { _sh:{}, _hdr:{}, newOrders:[], newWins:[] };
  Object.keys(TAB_NAMES).forEach(function(k){
    var sh = ss.getSheetByName(TAB_NAMES[k]);
    if (!sh) throw new Error('"' + TAB_NAMES[k] + '" 탭이 없어요. setup을 먼저 실행해 주세요.');
    var vals = sh.getDataRange().getValues(), h = vals[0].map(function(x){ return String(x).trim(); });
    db._sh[k] = sh; db._hdr[k] = h;
    db[k] = vals.slice(1).map(function(r, i){
      var o = { _r: i + 2 }; h.forEach(function(name, j){ o[name] = r[j]; }); return o;
    }).filter(function(o){ return h.some(function(name){ return o[name] !== '' && o[name] !== null; }); });
  });
  return db;
}

function saveDB_(db) {
  ['items','users','box','roul'].forEach(function(k){
    db[k].forEach(function(o){
      (o._dirty || []).forEach(function(name){
        var c = db._hdr[k].indexOf(name) + 1;
        if (c > 0) db._sh[k].getRange(o._r, c).setValue(o[name]);
      });
    });
  });
  [['orders', db.newOrders], ['wins', db.newWins]].forEach(function(p){
    var k = p[0], rows = p[1] || [];
    if (!rows.length) return;
    var h = db._hdr[k], sh = db._sh[k];
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, h.length).setValues(rows.map(function(o){ return h.map(function(name){ return o[name] === undefined ? '' : o[name]; }); }));
  });
  SpreadsheetApp.flush();
}

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet() { return json_({ ok: true, msg: 'DYB Christmas Market 연결 성공! 🎄' }); }

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (x) { return json_({ ok:false, err:'잘못된 요청이에요.' }); }
  var write = req.action === 'order' || req.action === 'play';
  var lock = LockService.getScriptLock();
  try {
    if (write) lock.waitLock(25000);
    var db = loadDB_(), now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'MM/dd HH:mm:ss'), res = { ok: true };
    if (req.action === 'login' || req.action === 'state') {
      res.state = E_state(db, E_findUser(db, req.name, req.pw));
    } else if (req.action === 'order') {
      res.result = E_order(db, req, now); saveDB_(db);
      res.state = E_state(db, E_findUser(db, req.name, req.pw));
    } else if (req.action === 'play') {
      res.result = E_play(db, req, now, Math.random); saveDB_(db);
      res.state = E_state(db, E_findUser(db, req.name, req.pw));
    } else throw new Error('알 수 없는 요청이에요.');
    return json_(res);
  } catch (err) {
    return json_({ ok:false, err: String(err && err.message || err) });
  } finally {
    if (write) { try { lock.releaseLock(); } catch (x) {} }
  }
}

/** 기존 탭에 새 제목 칸이 없으면 맨 오른쪽에 추가해요 (데이터는 그대로). */
function ensureCols_(sh, want) {
  var lc = Math.max(sh.getLastColumn(), 1);
  var h = sh.getRange(1,1,1,lc).getValues()[0].map(function(x){ return String(x).trim(); });
  want.forEach(function(name){
    if (h.indexOf(name) < 0) { h.push(name); sh.getRange(1, h.length).setValue(name).setFontWeight('bold'); }
  });
  return h;
}

/* ===== 학년 명단 (다른 선생님들이 입력) → 학생 탭 자동 반영 ===== */
var ROSTERS = [{tab:'4학년 명단', grade:'4학년', color:'#ff8a65'}, {tab:'5학년 명단', grade:'5학년', color:'#4fc3f7'}, {tab:'6학년 명단', grade:'6학년', color:'#ba68c8'}];
var R_HDR = ['담임선생님','이름','포인트','초대장 번호','남은 포인트','상태','반영포인트'];
var R_IN = 3;   // A~C: 선생님이 입력하는 칸

function setupRosters_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ROSTERS.forEach(function(R){
    var sh = ss.getSheetByName(R.tab);
    if (!sh) sh = ss.insertSheet(R.tab);
    if (sh.getLastRow() === 0) sh.getRange(1,1,1,R_HDR.length).setValues([R_HDR]);
    styleRoster_(sh, R);
  });
}

function styleRoster_(sh, R) {
  var rows = Math.max(sh.getMaxRows() - 1, 1);
  if (sh.getMaxRows() < 101) sh.insertRowsAfter(sh.getMaxRows(), 101 - sh.getMaxRows());
  rows = sh.getMaxRows() - 1;
  sh.setTabColor(R.color); sh.setFrozenRows(1);
  sh.getRange(1,1,1,R_IN).setBackground(R.color).setFontColor('#ffffff');
  sh.getRange(1,R_IN+1,1,R_HDR.length-R_IN).setBackground('#9e9e9e').setFontColor('#ffffff');
  sh.getRange(1,1,1,R_HDR.length).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 34);
  [130,120,100,120,110,170,90].forEach(function(w,i){ sh.setColumnWidth(i+1, w); });
  sh.getRange(2,1,rows,R_HDR.length).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.getRange(2,R_IN+1,rows,R_HDR.length-R_IN).setBackground('#f3f3f3').setFontColor('#555555');
  sh.getRange(2,3,rows,1).setNumberFormat('#,##0').setDataValidation(
    SpreadsheetApp.newDataValidation().requireNumberGreaterThanOrEqualTo(0).setAllowInvalid(false).setHelpText('포인트는 숫자만 넣어 주세요').build());
  sh.getRange(2,4,rows,1).setNumberFormat('@').setFontWeight('bold').setFontColor('#b50005');
  sh.getRange(2,5,rows,1).setNumberFormat('#,##0');
  var notes = ['담임선생님 이름','학생 이름 (같은 반에 같은 이름이 있으면 김민준A 처럼 구분해 주세요)',
    '줄 포인트. 나중에 숫자를 올리면 그만큼 추가로 지급돼요 (내리면 그만큼 빠져요)',
    '자동으로 만들어져요 (DYB+숫자 5자리). 학생에게 알려 주세요!','학생이 지금 가지고 있는 포인트 (자동)','자동','자동 (건드리지 마세요)'];
  notes.forEach(function(n,i){ sh.getRange(1,i+1).setNote(n); });
  sh.hideColumns(7);
  if (!sh.getFilter()) sh.getRange(1,1,sh.getMaxRows(),R_HDR.length-1).createFilter();
  sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function(p){ if (p.getDescription()==='자동 칸') p.remove(); });
  sh.getRange(1,R_IN+1,sh.getMaxRows(),R_HDR.length-R_IN).protect().setDescription('자동 칸').setWarningOnly(true);
  sh.getRange(1,1,1,R_IN).protect().setDescription('자동 칸').setWarningOnly(true);
}

function newCode_(used) {
  var c;
  do { c = 'DYB' + ('0000' + Math.floor(Math.random() * 100000)).slice(-5); } while (used[c]);
  used[c] = true; return c;
}

/** 4·5·6학년 명단을 학생 탭에 반영해요. 명단을 고치면 자동으로 실행돼요. */
function 명단반영() {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(25000); } catch (x) { return; }
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var us = ss.getSheetByName(TAB_NAMES.users); if (!us) { setup(); us = ss.getSheetByName(TAB_NAMES.users); }
    var uh = ensureCols_(us, HEADERS.users);
    var ci = function(n){ return uh.indexOf(n); };
    var uv = us.getLastRow() > 1 ? us.getRange(2,1,us.getLastRow()-1,uh.length).getValues() : [];
    var used = {}, byCode = {};
    uv.forEach(function(r,i){ var c = E_pw(r[ci('비밀번호')]); if (c) { used[c] = true; byCode[c] = i; } });
    var added = [], usersChanged = false;

    ROSTERS.forEach(function(R){
      var sh = ss.getSheetByName(R.tab); if (!sh || sh.getLastRow() < 2) return;
      var n = sh.getLastRow() - 1, vals = sh.getRange(2,1,n,R_HDR.length).getValues(), out = [];
      vals.forEach(function(r){
        var teacher = E_str(r[0]), name = E_str(r[1]), ptsRaw = r[2], code = E_pw(r[3]), applied = r[6];
        if (!name) { out.push([code || '', code ? r[4] : '', (teacher || ptsRaw !== '') ? '⏳ 이름을 넣어 주세요' : '', applied]); return; }
        if (ptsRaw !== '' && isNaN(Number(ptsRaw))) { out.push([code, r[4], '⚠️ 포인트는 숫자만!', applied]); return; }
        var pts = E_num(ptsRaw), row;
        if (code && byCode[code] !== undefined) {
          row = uv[byCode[code]];
          if (E_str(row[ci('이름')]) !== name) { row[ci('이름')] = name; usersChanged = true; }
          if (E_str(row[ci('학년')]) !== R.grade) { row[ci('학년')] = R.grade; usersChanged = true; }
          if (E_str(row[ci('담임')]) !== teacher) { row[ci('담임')] = teacher; usersChanged = true; }
          var delta = pts - E_num(applied);
          if (applied !== '' && delta !== 0) { row[ci('포인트')] = E_num(row[ci('포인트')]) + delta; usersChanged = true; }
          if (applied === '') { /* 예전에 이어진 줄: 지금 값을 기준으로 삼아요 */ }
          out.push([code, E_num(row[ci('포인트')]), '✅ 등록됨', pts]);
        } else {
          if (!code) code = newCode_(used); else used[code] = true;
          row = uh.map(function(){ return ''; });
          row[ci('이름')] = name; row[ci('비밀번호')] = code; row[ci('포인트')] = pts; row[ci('학년')] = R.grade; row[ci('담임')] = teacher;
          uv.push(row); byCode[code] = uv.length - 1; added.push(row); usersChanged = true;
          out.push([code, pts, '✅ 등록됨', pts]);
        }
      });
      sh.getRange(2, R_IN+1, n, R_HDR.length-R_IN).setValues(out);
    });

    if (usersChanged && uv.length) {
      us.getRange(2,1,uv.length,uh.length).setValues(uv);
      us.getRange(2, ci('비밀번호')+1, uv.length, 1).setNumberFormat('@');
    }
    SpreadsheetApp.flush();
    return added.length;
  } finally { try { lock.releaseLock(); } catch (x) {} }
}

/** 명단 탭에서 이름·포인트를 고치면 자동 반영 */
function onEdit(e) {
  try {
    var sh = e && e.range && e.range.getSheet(); if (!sh) return;
    var isRoster = ROSTERS.some(function(R){ return R.tab === sh.getName(); });
    if (isRoster && e.range.getColumn() <= R_IN) 명단반영();
  } catch (x) {}
}

/** 시트를 열면 위쪽에 '🎄 마켓 관리' 메뉴가 생겨요 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🎄 마켓 관리')
    .addItem('명단 → 학생 탭 반영하기 (남은 포인트 새로고침)', '명단반영')
    .addSeparator()
    .addItem('지금 탭: 이름순 정렬 (가나다)', '이름순정렬')
    .addItem('지금 탭: 담임선생님 → 이름순 정렬', '담임순정렬')
    .addItem('지금 탭: 포인트 많은 순 정렬', '포인트순정렬')
    .addSeparator()
    .addItem('시트 꾸미기', '꾸미기')
    .addToUi();
}
function sortActive_(spec) {
  var sh = SpreadsheetApp.getActiveSheet(), name = sh.getName();
  var h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(x){ return String(x).trim(); });
  if (sh.getLastRow() < 3) return;
  var cols = spec.map(function(s){ var c = h.indexOf(s[0]) + 1; return c ? {column:c, ascending:s[1]} : null; }).filter(Boolean);
  if (!cols.length) { SpreadsheetApp.getUi().alert('"' + name + '" 탭에는 정렬할 칸이 없어요.'); return; }
  sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).sort(cols);
}
function 이름순정렬() { sortActive_([['이름',true]]); }
function 담임순정렬() { sortActive_([['담임선생님',true],['담임',true],['이름',true]]); }
function 포인트순정렬() { sortActive_([['남은 포인트',false],['포인트',false]]); }

/* ===== 시트 꾸미기: 데이터는 그대로 두고 모양·입력 규칙만 정리해요. 여러 번 실행해도 괜찮아요. ===== */
function 꾸미기() {
  setup();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var NOTES = {
    items: {'ID':'사이트가 물건을 구분하는 이름표예요. 이미 팔린 물건은 바꾸지 마세요!','카테고리':'참가권 / 쿠폰 / 스페셜 / 간식 / 문구 중 하나','이름':'사이트에 보이는 물건 이름','가격':'숫자만 (예: 3000)','재고':'남은 수량. 주문되면 자동으로 줄어요','1인최대':'한 사람이 살 수 있는 최대 개수. 비워 두면 제한 없음','이미지':'사진 파일 이름 (보통 ID와 같아요)','판매':'Y = 판매 / N = 사이트에서 숨기기'},
    users: {'이름':'학생이 입장할 때 쓰는 이름. 같은 이름 두 명은 안 돼요!','비밀번호':'초대장 번호','포인트':'남은 포인트. 주문하면 자동으로 줄어요'},
    box:   {'등급':'1등, 2등 …','가중치':'숫자가 클수록 잘 나와요 (확률)','남은수량':'0이 되면 더 이상 안 나와요'},
    roul:  {'칸':'룰렛 칸 번호 (순서)','남은수량':'0이 되면 회색 칸이 되고 안 나와요'},
    orders:{'주문번호':'학생이 선생님께 보여주는 번호'},
    wins:  {}
  };
  var THEME = {
    items:{head:'#e5403a',band:'#fff1ef',tab:'#e5403a'}, users:{head:'#1f7a4d',band:'#eefbf2',tab:'#1f7a4d'},
    orders:{head:'#b50005',band:'#fff6f0',tab:'#b50005'}, box:{head:'#ffc83d',band:'#fff9e3',tab:'#ffc83d'},
    roul:{head:'#2fa36b',band:'#effaf3',tab:'#2fa36b'}, wins:{head:'#3a8dde',band:'#eef6ff',tab:'#3a8dde'}
  };
  var WIDTH = {'ID':110,'카테고리':80,'이름':170,'가격':90,'재고':70,'1인최대':70,'이미지':100,'판매':60,'비밀번호':90,'포인트':100,
    '시간':120,'주문번호':100,'상품ID':100,'상품명':170,'수량':60,'단가':80,'금액':90,'주문후포인트':110,'등급':60,'가중치':70,'남은수량':80,'칸':50,'게임':80};
  var money = '#,##0"원"', count = '#,##0"개"';

  Object.keys(TAB_NAMES).forEach(function(k){
    var sh = ss.getSheetByName(TAB_NAMES[k]); if (!sh) return;
    var h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(x){ return String(x).trim(); });
    var n = h.length, rows = Math.max(sh.getMaxRows()-1, 1), t = THEME[k];
    var col = function(name){ return h.indexOf(name) + 1; };
    var body = function(name){ var c = col(name); return c ? sh.getRange(2, c, rows, 1) : null; };

    sh.setTabColor(t.tab);
    sh.setFrozenRows(1);
    if (k === 'users' || k === 'items') sh.setFrozenColumns(k === 'items' ? 3 : 1);
    var head = sh.getRange(1,1,1,n);
    head.setBackground(t.head).setFontColor(k==='box' ? '#3a2420' : '#ffffff').setFontWeight('bold')
        .setHorizontalAlignment('center').setVerticalAlignment('middle').setFontSize(11);
    sh.setRowHeight(1, 34);
    sh.getRange(2,1,rows,n).setVerticalAlignment('middle').setFontSize(11);
    h.forEach(function(name, i){
      if (WIDTH[name]) sh.setColumnWidth(i+1, WIDTH[name]);
      var note = (NOTES[k]||{})[name]; if (note) sh.getRange(1,i+1).setNote(note);
      if (['이름','상품명'].indexOf(name) < 0) sh.getRange(2,i+1,rows,1).setHorizontalAlignment('center');
    });

    // banding
    sh.getBandings().forEach(function(b){ b.remove(); });
    sh.getRange(1,1,sh.getMaxRows(),n).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false)
      .setHeaderRowColor(t.head).setFirstRowColor('#ffffff').setSecondRowColor(t.band);

    // number formats
    ['가격','포인트','단가','금액','주문후포인트'].forEach(function(nm){ var r = body(nm); if (r) r.setNumberFormat(money); });
    ['재고','남은수량'].forEach(function(nm){ var r = body(nm); if (r) r.setNumberFormat(count); });
    if (k === 'users') { var pw = body('비밀번호'); if (pw) pw.setNumberFormat('@'); }

    // input rules (stop text in number cells)
    var num = SpreadsheetApp.newDataValidation().requireNumberGreaterThanOrEqualTo(0).setAllowInvalid(false)
      .setHelpText('숫자만 넣어 주세요 (0 이상)').build();
    ['가격','재고','1인최대','포인트','가중치','남은수량'].forEach(function(nm){
      if (k==='orders'||k==='wins') return; var r = body(nm); if (r) r.setDataValidation(num);
    });
    if (k === 'items') {
      var yn = body('판매'); if (yn) yn.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Y','N'], true).setAllowInvalid(false).build());
      var cat = body('카테고리'); if (cat) cat.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['참가권','쿠폰','스페셜','간식','문구'], true).setAllowInvalid(true).build());
    }
    if (k === 'box') {
      var gr = body('등급'); if (gr) gr.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['1등','2등','3등','4등','5등'], true).setAllowInvalid(true).build());
    }

    // colour rules
    var rules = [];
    var stockCol = col('재고') || col('남은수량');
    if (stockCol && (k==='items'||k==='box'||k==='roul')) {
      var L = String.fromCharCode(64 + stockCol), whole = sh.getRange(2,1,rows,n);
      rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($'+L+'2<>"",$'+L+'2<=0)').setBackground('#d9d9d9').setFontColor('#888888').setStrikethrough(true).setRanges([whole]).build());
      rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($'+L+'2<>"",$'+L+'2<=10)').setBackground('#ffd6d3').setFontColor('#b50005').setBold(true).setRanges([sh.getRange(2,stockCol,rows,1)]).build());
    }
    if (k === 'items') {
      var sc = col('판매'); if (sc) { var Ls = String.fromCharCode(64+sc);
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$'+Ls+'2="N"').setFontColor('#aaaaaa').setItalic(true).setRanges([sh.getRange(2,1,rows,n)]).build()); }
    }
    if (k === 'users') {
      var pc = col('포인트'); if (pc) rules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(1000).setBackground('#fff3b0').setRanges([sh.getRange(2,pc,rows,1)]).build());
    }
    if (k === 'box' || k === 'wins') {
      var gc = col('등급'); if (gc) { var Lg = String.fromCharCode(64+gc);
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$'+Lg+'2="1등"').setBackground('#ffe066').setBold(true).setRanges([sh.getRange(2,1,rows,n)]).build()); }
    }
    sh.setConditionalFormatRules(rules);

    // warn before editing the header row
    sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function(p){ if (p.getDescription()==='제목줄') p.remove(); });
    head.protect().setDescription('제목줄').setWarningOnly(true);
  });

  // 안내 tab
  var g = ss.getSheetByName('안내') || ss.insertSheet('안내', 0);
  g.clear(); g.setTabColor('#ffc83d'); g.setHiddenGridlines(true);
  var lines = [
    ['🎄 DYB 크리스마스 마켓 관리 시트'],[''],
    ['📦 물품','가격·재고·1인최대·판매(Y/N)를 바꾸면 20초 안에 사이트에 반영돼요. 재고 10개 이하는 빨강, 0개는 회색이에요.'],
    ['📝 학년 명단','4·5·6학년 명단 탭에 담임선생님·이름·포인트만 넣으면 학생 탭에 자동으로 들어가고 초대장 번호(DYB+숫자 5자리)가 만들어져요.'],
    ['','포인트 숫자를 나중에 올리면 그만큼 추가 지급돼요. 정렬은 제목줄의 ▼(필터) 또는 위쪽 [🎄 마켓 관리] 메뉴에서!'],
    ['🧒 학생','명단에서 자동으로 채워져요. 샘플 학생(비밀번호 1234)은 연습용이니 행사 전에 지워도 돼요.'],
    ['🧾 주문','사이트에서 주문하면 자동으로 쌓여요. 학생이 보여주는 주문번호로 확인하세요.'],
    ['🎁 랜덤박스','가중치가 클수록 잘 나와요. 남은수량이 0이면 안 나와요. 1등은 노란 줄이에요.'],
    ['🎡 룰렛','칸을 추가·삭제하면 룰렛 칸 수가 자동으로 바뀌어요.'],
    ['🏆 당첨기록','룰렛·랜덤박스 결과가 자동으로 쌓여요.'],[''],
    ['⚠️ 주의','탭 이름과 1행 제목은 바꾸지 마세요. 물품 ID와 학생 이름도 행사 중에는 바꾸지 마세요.'],
    ['⚠️ 주의','주문·당첨기록 줄을 지우면 참가권이 되살아날 수 있어요. 연습 기록 정리할 때만 지우세요.'],
    ['💡 팁','칸 위 제목에 마우스를 올리면 설명이 나와요. 행사 전에 [파일 → 사본 만들기]로 백업해 두세요.']
  ];
  lines.forEach(function(r,i){ g.getRange(i+1,1,1,r.length).setValues([r]); });
  g.getRange('A1').setFontSize(20).setFontWeight('bold').setFontColor('#b50005');
  g.getRange(3,1,lines.length-2,1).setFontWeight('bold').setFontSize(12);
  g.getRange(3,2,lines.length-2,1).setFontSize(12).setWrap(true);
  g.getRange('A12:B13').setBackground('#ffe9e7'); g.getRange('A14:B14').setBackground('#fff6d6'); g.getRange('A5:B6').setBackground('#eef6ff');
  g.setColumnWidth(1,120); g.setColumnWidth(2,620);
  ss.setActiveSheet(g); ss.moveActiveSheet(1);
  SpreadsheetApp.flush();
}
