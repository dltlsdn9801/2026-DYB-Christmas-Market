/* ===== DYB Christmas Market — shared rules (used by the website preview AND the Google Apps Script) ===== */
var HEADERS = {
  items:  ['ID','카테고리','이름','가격','재고','1인최대','이미지','판매'],
  users:  ['이름','비밀번호','포인트'],
  orders: ['시간','주문번호','이름','상품ID','상품명','수량','단가','금액','주문후포인트'],
  box:    ['등급','상품명','이미지','가중치','남은수량'],
  roul:   ['칸','상품명','이미지','남은수량'],
  wins:   ['시간','이름','게임','등급','상품명','이미지']
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
    ['김민준','1234',10000],['이서연','1234',10000],['박지호','1234',10000],['최하은','1234',10000],['정도윤','1234',10000],
    ['강서윤','1234',10000],['조예준','1234',10000],['윤지우','1234',10000],['장시우','1234',10000],['임하린','1234',10000]
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

function E_findUser(db, name, pw){
  name = E_str(name);
  var u = db.users.filter(function(x){ return E_str(x['이름']) === name; })[0];
  if (!name) throw new Error('이름을 적어 줘!');
  if (!u) throw new Error('명단에 없는 이름이에요. 선생님께 확인해 주세요!');
  if (E_str(u['비밀번호']) !== E_str(pw)) throw new Error('초대장 번호가 틀렸어요!');
  return u;
}
function E_bought(db, name, id){
  return db.orders.reduce(function(s,o){ return (E_str(o['이름'])===name && E_str(o['상품ID'])===id) ? s + E_num(o['수량']) : s; }, 0);
}
function E_used(db, name, game){
  return db.wins.filter(function(w){ return E_str(w['이름'])===name && E_str(w['게임'])===game; }).length;
}
function E_tickets(db, name){
  return { box: E_bought(db,name,'ticket_box') - E_used(db,name,'랜덤박스'),
           roul: E_bought(db,name,'ticket_roul') - E_used(db,name,'룰렛') };
}
function E_state(db, u){
  var name = E_str(u['이름']);
  return {
    user: { name: name, points: E_num(u['포인트']), tickets: E_tickets(db,name) },
    items: db.items.filter(E_onSale).map(function(i){ var id=E_str(i['ID']); return {
      id:id, cat:E_str(i['카테고리']), name:E_str(i['이름']), price:E_num(i['가격']), stock:E_num(i['재고']),
      limit:E_num(i['1인최대']), img:E_str(i['이미지']), mine:E_bought(db,name,id) }; }),
    box: db.box.filter(function(b){ return E_str(b['상품명']); }).map(function(b){ return {grade:E_str(b['등급']), name:E_str(b['상품명']), img:E_str(b['이미지']), left:E_num(b['남은수량'])}; }),
    roul: db.roul.filter(function(r){ return E_str(r['상품명']); }).map(function(r){ return {name:E_str(r['상품명']), img:E_str(r['이미지']), left:E_num(r['남은수량'])}; }),
    wins: db.wins.slice(-40).reverse().map(function(w){ return {t:E_str(w['시간']), name:E_str(w['이름']), game:E_str(w['게임']), grade:E_str(w['등급']), prize:E_str(w['상품명']), img:E_str(w['이미지'])}; }),
    myOrders: db.orders.filter(function(o){ return E_str(o['이름'])===name; }).slice(-30).reverse().map(function(o){ return {t:E_str(o['시간']), no:E_str(o['주문번호']), name:E_str(o['상품명']), qty:E_num(o['수량']), sum:E_num(o['금액'])}; })
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
    if (lim > 0 && E_bought(db,name,E_str(it['ID'])) + q > lim) throw new Error(E_str(it['이름']) + '은(는) 한 사람당 ' + lim + '개까지만 살 수 있어요!');
    total += E_num(it['가격']) * q; lines.push({it:it, q:q});
  });
  if (total > E_num(u['포인트'])) throw new Error('포인트가 부족해요! (필요 ' + total.toLocaleString() + ' / 내 포인트 ' + E_num(u['포인트']).toLocaleString() + ')');
  var no = 'D' + String(Date.now()).slice(-6) + Math.floor(Math.random()*90+10);
  u['포인트'] = E_num(u['포인트']) - total; E_mark(u,'포인트');
  lines.forEach(function(l){
    l.it['재고'] = E_num(l.it['재고']) - l.q; E_mark(l.it,'재고');
    var o = {'시간':now,'주문번호':no,'이름':name,'상품ID':E_str(l.it['ID']),'상품명':E_str(l.it['이름']),'수량':l.q,'단가':E_num(l.it['가격']),'금액':E_num(l.it['가격'])*l.q,'주문후포인트':u['포인트']};
    db.orders.push(o); (db.newOrders = db.newOrders || []).push(o);
  });
  return { orderNo: no, total: total, lines: lines.map(function(l){ return {name:E_str(l.it['이름']), qty:l.q, img:E_str(l.it['이미지'])}; }) };
}
function E_play(db, req, now, rand){
  var u = E_findUser(db, req.name, req.pw), name = E_str(u['이름']);
  var isRoul = req.game === 'roul', game = isRoul ? '룰렛' : '랜덤박스';
  var t = E_tickets(db, name);
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
  var w = {'시간':now,'이름':name,'게임':game,'등급':E_str(row['등급']),'상품명':E_str(row['상품명']),'이미지':E_str(row['이미지'])};
  db.wins.push(w); (db.newWins = db.newWins || []).push(w);
  return { index: idx, prize: { grade: E_str(row['등급']), name: E_str(row['상품명']), img: E_str(row['이미지']) } };
}
