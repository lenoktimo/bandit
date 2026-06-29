/* =====================================================================
   BANDIT — script.js (версия 5, с анимациями и плавным скроллом)
   ===================================================================== */
(function () {
  "use strict";
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  function init() {
    injectStyles();
    var views = document.querySelectorAll(".view-desktop, .view-tablet, .view-phone");
    if (views.length) views.forEach(setupView);
    else setupView(document.body);

    document.addEventListener("click", function (e) {
      var t = e.target;
      var link = (t && t.closest) ? t.closest(".bandit-link[data-go]") : null;
      if (!link) return;
      e.preventDefault();
      var root = link.closest(".view-desktop, .view-tablet, .view-phone") || document;
      smoothScrollToEl(resolveAnchor(root, link.getAttribute("data-go")));
    }, false);

    document.addEventListener("submit", function (e) {
      var form = e.target;
      if (!form || form.tagName !== "FORM") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      handleSubmit(form);
    }, true);

    /* Запасной обработчик клика по кнопкам Отправить —
       на случай если submit не всплывает из-за перекрытия элементов */
    document.addEventListener("click", function(e) {
      var btn = e.target && e.target.closest
        ? e.target.closest('.submit-button, .div-wrapper-3')
        : null;
      if (!btn) return;
      var form = btn.closest("form");
      if (!form) return;
      e.preventDefault();
      handleSubmit(form);
    }, true);
  }

  /* ====== СТИЛИ ====== */
  function injectStyles() {
    if (document.getElementById("bandit-js-styles")) return;
    var css = [
      /* Плавный скролл */
      'html{scroll-behavior:smooth;}',

      /* Навигационные ссылки */
      '.bandit-link{cursor:pointer;transition:color .2s ease;}',
      '.bandit-link:hover{color:#e2c730 !important;}',
      '.view-desktop nav, .view-tablet nav{position:relative;z-index:9000;}',
      '.view-desktop nav *, .view-tablet nav *{position:relative;z-index:9000;}',

      /* CTA кнопки */
      '.bandit-cta{cursor:pointer;transition:background-color .2s ease,color .2s ease;}',
      '.bandit-cta:hover{background-color:#fff !important;color:#000 !important;}',
      '.view-tablet .div-wrapper{border:none !important;outline:none;}',
      '.view-tablet .div-wrapper-2{background:transparent !important;border:1px solid #fff !important;border-radius:2px;}',

      /* ВРЕМЯ НАЧАТЬ ИГРАТЬ */
      '.view-tablet .div-2{left:-10px !important;width:360px !important;font-size:48px !important;}',
      /* view-phone .div-2 top управляется из style.css; left/width задаём здесь */
      '.view-phone .div-2{left:30px !important;width:260px !important;text-align:left;}',

      /* Адрес на телефоне — управляется из style.css финальный патч */

      '.view-desktop .text-wrapper-63{position:absolute !important;top:9605px !important;left:283px !important;}',
      '.view-phone .text-wrapper-63{position:absolute !important;top:4772px !important;}',

      /* Планшет: услуги */
      '.view-tablet .text-wrapper-51{top:5329px !important;}',
      '.view-tablet .text-wrapper-55{top:5328px !important;}',
      '.view-tablet .element-3{top:5382px !important;}',
      '.view-tablet .rectangle-21{top:5560px !important;}',
      '.view-tablet .text-wrapper-53{top:6022px !important;}',
      '.view-tablet .text-wrapper-56{top:6021px !important;}',
      '.view-tablet .text-wrapper-54{top:6083px !important;}',

      /* Планшет: адрес */
      /* Планшет: адрес и "как пройти" — позиции теперь управляются из style.css */
      '.view-tablet .text-wrapper-64{font-size:13px !important;}',

      /* Форма */
      '.view-tablet form input, .view-tablet form textarea,',
      '.view-phone form input, .view-phone form textarea,',
      '.view-desktop form input, .view-desktop form textarea{',
      '  position:absolute; background:transparent !important; border:none !important;',
      '  outline:none !important; color:#fff !important; z-index:9500 !important;',
      '  pointer-events:auto !important; padding:10px 2px !important; cursor:text;',
      '  min-height:34px !important; box-shadow:none !important; -webkit-appearance:none; appearance:none;',
      '}',
      '.view-tablet form input:focus, .view-tablet form textarea:focus,',
      '.view-phone form input:focus, .view-phone form textarea:focus,',
      '.view-desktop form input:focus, .view-desktop form textarea:focus{',
      '  outline:none !important; border:none !important; box-shadow:none !important;',
      '}',
      '.frame input:focus-visible, .frame textarea:focus-visible,',
      '.frame .form-input:focus-visible{',
      '  outline:none !important; outline-offset:0 !important; box-shadow:none !important;',
      '}',
      '.view-tablet .frame input:focus-visible, .view-tablet .frame textarea:focus-visible,',
      '.view-tablet input:focus-visible, .view-tablet textarea:focus-visible,',
      '.view-tablet input:focus, .view-tablet textarea:focus{',
      '  outline:0 !important; outline-style:none !important; outline-width:0 !important; box-shadow:none !important;',
      '}',
      /* Форма — НЕ меняем position чтобы не перекрывать footer.
         pointer-events:auto достаточно для кликабельности полей */
      '.view-tablet form, .view-phone form, .view-desktop form{pointer-events:auto;}',
      '.view-tablet .rectangle-2, .view-phone .rectangle-2, .view-desktop .rectangle-2{pointer-events:none !important;}',
      '.view-tablet .image, .view-phone .image, .view-desktop .image{pointer-events:none !important;}',
      '.view-tablet .img, .view-phone .img, .view-desktop .img{pointer-events:none !important;}',
      '.view-tablet .rectangle-4, .view-phone .rectangle-4, .view-desktop .rectangle-4{pointer-events:none !important;}',
      '.view-tablet .div-2, .view-phone .div-2, .view-desktop .div-2{pointer-events:none !important;}',
      '.view-tablet form img, .view-phone form img, .view-desktop form img{pointer-events:none !important;}',

      /* Hover на карточках */
      '.bandit-hover{transition:transform .3s cubic-bezier(.2,.8,.2,1), filter .3s ease, box-shadow .3s ease;}',
      '.bandit-hover:hover{transform:translateY(-6px) scale(1.03);filter:brightness(1.12);box-shadow:0 12px 30px rgba(0,0,0,.45);}',
      '.bandit-hover-title{transition:letter-spacing .3s ease,color .3s ease,text-shadow .3s ease;}',
      '.bandit-hover-title:hover{letter-spacing:3px;color:#e2c730;text-shadow:0 0 18px rgba(226,199,48,.5);}',

      /* Логотип BANDIT */
      '@keyframes banditGlow{0%,100%{text-shadow:0 0 6px rgba(226,199,48,.2);}50%{text-shadow:0 0 18px rgba(226,199,48,.65);}}',
      '.bandit-glow{animation:banditGlow 3s ease-in-out infinite;}',
      '.bandit-link[data-go]:hover{text-shadow:0 0 10px rgba(226,199,48,.4);}',

      /* ====== АНИМАЦИИ ПРАВИЛ — выезд слева/справа ====== */
      '.bandit-rule{transition:opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1);}',
      '.bandit-rule-left{opacity:0;transform:translateX(-80px);}',
      '.bandit-rule-right{opacity:0;transform:translateX(80px);}',
      '.bandit-rule-left.bandit-visible,.bandit-rule-right.bandit-visible{opacity:1;transform:translateX(0);}',

      /* ====== АНИМАЦИИ ПЕРСОНАЖЕЙ — появление снизу с opacity ====== */
      '.bandit-char{opacity:0;transform:translateY(30px) scale(0.95);transition:opacity .6s ease, transform .6s cubic-bezier(.2,.8,.2,1);}',
      '.bandit-char.bandit-visible{opacity:1;transform:translateY(0) scale(1);}',

      /* Отзывы лента */
      '.bandit-rev-track{position:absolute;display:flex;gap:20px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding:4px;z-index:56;cursor:grab;scrollbar-width:none;-ms-overflow-style:none;}',
      '.bandit-rev-track:active{cursor:grabbing;}',
      '.bandit-rev-track::-webkit-scrollbar{height:0;width:0;display:none;}',
      '.bandit-rev-card{flex:0 0 auto;scroll-snap-align:center;border:1px solid #fff;border-radius:2px;padding:24px;color:#fff;font-family:"Inter-Regular",Helvetica;font-size:18px;line-height:1.5;box-sizing:border-box;background:rgba(0,0,0,.2);}',

      /* Бургер */
      '.bandit-burger-menu{position:fixed;top:0;right:0;width:72%;max-width:320px;height:100%;background:#111;z-index:99999;transform:translateX(100%);transition:transform .3s ease;padding:80px 24px 24px;display:flex;flex-direction:column;gap:22px;box-shadow:-4px 0 24px rgba(0,0,0,.5);}',
      '.bandit-burger-menu.open{transform:translateX(0);}',
      '.bandit-burger-menu a{color:#fff;font-family:"Inter-Regular",Helvetica;font-size:20px;letter-spacing:1px;cursor:pointer;transition:color .2s ease;text-decoration:none;}',
      '.bandit-burger-menu a:hover{color:#e2c730;}',
      '.bandit-burger-close{position:absolute;top:22px;right:22px;font-size:34px;line-height:1;color:#fff;cursor:pointer;background:none;border:none;}',
      '.bandit-burger-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99998;opacity:0;pointer-events:none;transition:opacity .3s ease;}',
      '.bandit-burger-backdrop.open{opacity:1;pointer-events:auto;}',

      /* Валидация формы */
      '.bandit-field-error{border-bottom:2px solid #e25252 !important;}',
      '.bandit-form-msg{position:absolute;left:50%;transform:translateX(-50%);background:#1a1a1a;border:1px solid #e2c730;color:#fff;padding:12px 24px;border-radius:4px;font-family:"Inter-Regular",Helvetica;font-size:14px;z-index:99999;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .3s ease;}',
      '.bandit-form-msg.show{opacity:1;}',
      '.bandit-form-msg.error{border-color:#e25252;}'

    ].join("");
    var s = document.createElement("style");
    s.id = "bandit-js-styles";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function setupView(root) {
    setupNav(root);
    setupCTA(root);
    setupFooterSections(root);
    setupPolicyLinks(root);
    setupRoute(root);
    setupFloatingLabels(root);
    setupReviews(root);
    setupHoverMotion(root);
    setupBurger(root);
    setupRulesAnimation(root);
    setupCharactersAnimation(root);
  }

  /* ====== ПЛАВНЫЙ СКРОЛЛ (замедленный, пропорционален расстоянию) ====== */
  function smoothScrollToEl(el) {
    if (!el) return;
    var targetY = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - 20;
    targetY = Math.max(0, targetY);
    var startY = window.pageYOffset || document.documentElement.scrollTop;
    var diff = targetY - startY;
    var duration = Math.min(2400, Math.max(1400, Math.abs(diff) * 0.9)); // мс, медленнее и пропорционально расстоянию
    var startTime = null;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var ease = easeInOutCubic(progress);
      window.scrollTo(0, startY + diff * ease);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function resolveAnchor(root, key) {
    var byId = { games:['games-title','game-types-title'], rules:['rules-title'],
      characters:['characters-title'], reviews:['reviews-title'],
      services:['services-title'], contact:['contact-title'] };
    var byLabel = { games:['Виды игр'], rules:['Правила игры'], characters:['Персонажи'],
      reviews:['Отзывы'], services:['Услуги и тарифы','Услуги'],
      info:['Информация об обществе','Вступление','Описание клуба'],
      contact:['Форма обратной связи'] };
    var sec=null, i;
    if(byId[key]) for(i=0;i<byId[key].length;i++){ sec=root.querySelector('section[aria-labelledby="'+byId[key][i]+'"]'); if(sec)break; }
    if(!sec&&byLabel[key]) for(i=0;i<byLabel[key].length;i++){ sec=root.querySelector('section[aria-label="'+byLabel[key][i]+'"]'); if(sec)break; }
    if(!sec&&key==='info') sec=root.querySelector('section');
    if(sec){
      var cands=sec.querySelectorAll('h1,h2,h3,.div-2,.image-2,.image,img,p,div');
      for(i=0;i<cands.length;i++){
        var r=cands[i].getBoundingClientRect();
        if(r.height>2 && (r.top+window.pageYOffset)>2) return cands[i];
      }
      return sec.querySelector('h1,h2,h3')||sec;
    }
    if(key==='contact') return root.querySelector('.div-2')||root.querySelector('.image-2');
    return null;
  }

  /* ====== НАВИГАЦИЯ ====== */
  function setupNav(root) {
    var words=[["services",/УСЛУГИ/],["games",/ВИДЫ\s*ИГР/],["rules",/ПРАВИЛА/],
      ["info",/ИНФОРМАЦИЯ/],["reviews",/ОТЗЫВЫ/],["contact",/КОНТАКТЫ/]];
    var nav=root.querySelector("nav");
    if(!nav) return;
    nav.querySelectorAll("div").forEach(function(block){
      if(block.querySelector(".bandit-link")) return;
      var html=block.innerHTML;
      words.forEach(function(w){
        html=html.replace(w[1], function(m){ return '<span class="bandit-link" data-go="'+w[0]+'">'+m+'</span>'; });
      });
      block.innerHTML=html;
    });
  }

  /* ====== CTA кнопки ====== */
  function setupCTA(root) {
    [".my-new-button",".text-wrapper-16",".div-wrapper",".div-wrapper-2"].forEach(function(sel){
      root.querySelectorAll(sel).forEach(function(btn){
        if(btn.classList.contains("div-wrapper-3")) return;
        var txt=(btn.getAttribute("aria-label")||btn.textContent||"").toLowerCase();
        var isApply=txt.indexOf("заявку")!==-1||txt.indexOf("подать")!==-1||sel===".my-new-button"||sel===".text-wrapper-16";
        if(!isApply) return;
        btn.classList.add("bandit-cta");
        btn.style.zIndex="50";
        btn.addEventListener("click", function(e){ e.preventDefault(); smoothScrollToEl(resolveAnchor(root,"contact")); });
      });
    });
  }

  /* ====== ФУТЕР-РАЗДЕЛЫ ====== */
  function setupFooterSections(root) {
    var map={"Информация":"info","Услуги":"services","Отзывы":"reviews","Правила":"rules","Виды игр":"games"};
    root.querySelectorAll("div,p").forEach(function(block){
      if(block.querySelector(".bandit-link")) return;
      if(block.querySelector("section,header,footer,main,form,nav,h1,h2,img,input,button,textarea,label")) return;
      var txt=block.textContent.replace(/\s+/g," ").trim();
      if(txt.length<80 && /Информация/.test(txt)&&/Услуги/.test(txt)&&/Виды игр/.test(txt)&&/Правила/.test(txt)&&/Отзывы/.test(txt)){
        var parts=block.innerHTML.split(/(<br\s*\/?>)/i);
        block.innerHTML=parts.map(function(part){
          if(/^<br/i.test(part)) return part;
          var word=part.replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").trim();
          var key=map[word];
          return key ? '<span class="bandit-link" data-go="'+key+'" style="cursor:pointer">'+word+'</span>' : part;
        }).join("");
        block.style.position=block.style.position||"relative";
        block.style.zIndex="50";
      }
    });
  }

  /* ====== ПОЛИТИКА ====== */
  function setupPolicyLinks(root) {
    root.querySelectorAll("p,div").forEach(function(block){
      if(block.querySelector(".bandit-link")) return;
      if(block.children.length>0) return;
      var txt=block.textContent.replace(/\s+/g," ").trim();
      if(txt.length<120 && /Политика конфиденциальности/i.test(txt) && /бработк/i.test(txt)){
        var html=block.innerHTML;
        html=html.replace(/(Политика конфиденциальности)/i,'<span class="bandit-link" style="cursor:pointer">$1</span>');
        html=html.replace(/(Согласие на обработку ПДн)/i,'<span class="bandit-link" style="cursor:pointer">$1</span>');
        block.innerHTML=html;
        block.style.position=block.style.position||"relative";
        block.style.zIndex="50";
      }
    });
  }

  /* ====== КАК ПРОЙТИ? ====== */
  function setupRoute(root) {
    var url="https://yandex.ru/maps/?text="+encodeURIComponent("Москва, улица Льва Толстого, 23/7 ст3");
    root.querySelectorAll(".text-wrapper-69,.text-wrapper-68,a").forEach(function(el){
      var t=el.textContent.replace(/\s+/g," ").trim().toLowerCase();
      if(t.indexOf("как пройти")===-1) return;
      el.classList.add("bandit-link");
      el.style.cursor="pointer";
      el.addEventListener("click", function(e){ e.preventDefault(); window.open(url,"_blank","noopener"); });
    });

    /* ПДн — принудительно показываем по классу, не по тексту */
    var isPhone  = root.classList && root.classList.contains("view-phone");
    var isTablet = root.classList && root.classList.contains("view-tablet");

    function showPDn(el, size) {
      if (!el) return;
      el.style.setProperty('position',    'absolute',    'important');
      el.style.setProperty('display',     'block',       'important');
      el.style.setProperty('opacity',     '1',           'important');
      el.style.setProperty('visibility',  'visible',     'important');
      el.style.setProperty('white-space', 'normal',      'important');
      el.style.setProperty('overflow',    'visible',     'important');
      el.style.setProperty('word-break',  'break-word',  'important');
      el.style.setProperty('color',       '#ffffff99',   'important');
      el.style.setProperty('font-size',   size,          'important');
      el.style.setProperty('text-align',  'center',      'important');
      el.style.setProperty('line-height', '1.8',         'important');
      el.style.setProperty('z-index',     '9800',        'important');
    }

    if (isPhone) {
      /* Телефон: ПДн = .text-wrapper-59, размер как на фото 6 */
      showPDn(root.querySelector('.text-wrapper-59'), '9px');
    }
    if (isTablet) {
      /* Планшет: ПДн = .text-wrapper-19, размер как на фото 4 */
      showPDn(root.querySelector('.text-wrapper-19'), '16px');
    }
    if (!isPhone && !isTablet) {
      /* Десктоп: ПДн = .text-wrapper-63, размер как на фото 2 */
      showPDn(root.querySelector('.text-wrapper-63'), '18px');
    }
  }

  /* ====== ЛЕЙБЛЫ ФОРМЫ ====== */
  function setupFloatingLabels(root) {
    positionFieldsByLabels(root);
    root.querySelectorAll("form input, form textarea").forEach(function(field){
      if(field.type==="checkbox"||field.type==="submit"||field.type==="button") return;
      field.style.zIndex="40";
      var id=field.id; if(!id) return;
      var label=root.querySelector('label[for="'+id+'"]');
      if(!label) return;
      label.style.transition="opacity .15s ease";
      label.style.pointerEvents="none";
      function upd(){
        var active=(document.activeElement===field)||(field.value&&field.value.length>0);
        label.style.opacity=active?"0":"1";
      }
      field.addEventListener("focus",upd);
      field.addEventListener("blur",upd);
      field.addEventListener("input",upd);
      upd();
    });
  }

  function positionFieldsByLabels(root) {
    var lineFor={name:".line-6",email:".line-8",phone:".line-10",message:".line-7"};
    root.querySelectorAll("form input, form textarea").forEach(function(field){
      if(field.type==="checkbox"||field.type==="submit"||field.type==="button") return;
      if(field.className && /form-input/.test(field.className)) return;
      var id=field.id; if(!id) return;
      var label=root.querySelector('label[for="'+id+'"]');
      var fr=field.getBoundingClientRect();
      var collapsed=fr.width<5||fr.height<5||(label&&fr.top<label.getBoundingClientRect().top-5);
      if(!collapsed) return;
      var line=lineFor[id]?root.querySelector(lineFor[id]):null;
      if(line){
        var ls=getComputedStyle(line);
        var lineTop=parseInt(ls.top,10)||0;
        var lineLeft=parseInt(ls.left,10)||0;
        var lineW=parseInt(ls.width,10)||300;
        field.style.position="absolute";
        field.style.top=(lineTop-30)+"px";
        field.style.left=lineLeft+"px";
        field.style.width=lineW+"px";
        field.style.height="30px";
        field.style.background="transparent";
        field.style.border="none";
        field.style.outline="none";
        field.style.color="#fff";
        field.style.fontFamily='"Inter-Regular",Helvetica';
        field.style.fontSize="20px";
        field.style.padding="0 2px";
        field.style.zIndex="45";
        if(field.tagName==="TEXTAREA"){ field.style.resize="none"; }
      } else if(label){
        var ms=getComputedStyle(label);
        field.style.position="absolute";
        field.style.top=(parseInt(ms.top,10)+(parseInt(ms.fontSize,10)||16)+4)+"px";
        field.style.left=ms.left;
        field.style.width=(parseInt(ms.width,10)>140?parseInt(ms.width,10):240)+"px";
        field.style.background="transparent";
        field.style.border="none";
        field.style.outline="none";
        field.style.color="#fff";
        field.style.fontSize="18px";
        field.style.zIndex="45";
        if(field.tagName==="TEXTAREA"){ field.style.height="36px"; field.style.resize="none"; }
      }
    });
  }

  /* ====== ОТЗЫВЫ ====== */
  function setupReviews(root) {
    var sec=root.querySelector('section[aria-labelledby="reviews-title"], section[aria-label="Отзывы"]');
    if(!sec) return;
    if(sec.querySelector(".bandit-rev-track")) return;
    var boxes=Array.prototype.slice.call(sec.querySelectorAll('[class*="rectangle"]'));
    var texts=Array.prototype.slice.call(sec.querySelectorAll('p'));
    if(texts.length<1) return;
    function num(el,prop){ var v=parseInt(getComputedStyle(el)[prop],10); return isNaN(v)?0:v; }
    var refBox=boxes[0]||texts[0];
    var topPx=num(refBox,"top");
    var minLeft=99999;
    boxes.forEach(function(b){ var l=num(b,"left"); if(l>-50&&l<minLeft) minLeft=l; });
    if(minLeft===99999) minLeft=20;
    if(minLeft<0) minLeft=0;

    var isPhone=root.classList&&root.classList.contains("view-phone");
    var isTablet=root.classList&&root.classList.contains("view-tablet");
    var isDesktop=root.classList&&root.classList.contains("view-desktop");
    var frame=sec.closest(".frame")||sec.parentElement;
    var frameW=frame?parseInt(getComputedStyle(frame).width,10):1200;

    var cardW, trackLeft, trackW, maxH, fSize, padCard, minH, repeat;

    if(isPhone){
      /* Мобиле: карточка 280px с нормальными отступами */
      cardW=280; trackLeft=15; trackW=frameW-15;
      maxH=999; fSize=14; padCard="16px 16px"; minH=0; repeat=1;
    } else if(isTablet){
      /* Планшет: карточки видимы от края до края.
         frame имеет overflow:hidden — снимаем его только по X,
         чтобы трек мог прокручиваться за правый край frame.
         Ставим overflow:hidden на wrapper вместо frame. */
      if(frame){
        frame.style.overflowX="visible";
        frame.style.overflowY="hidden";
        /* wrapper вокруг frame */
        var wrapper=frame.parentElement;
        if(wrapper){ wrapper.style.overflowX="hidden"; }
      }
      cardW=440; trackLeft=minLeft; trackW=cardW*3+40;
      maxH=999; fSize=22; padCard="28px 26px"; minH=184; repeat=3;
    } else {
      /* Десктоп: ОРИГИНАЛЬНАЯ логика — работала до патчей */
      cardW=num(refBox,"width")||460;
      if(cardW<560) cardW=560;
      if(cardW>620) cardW=620;
      trackLeft=minLeft;
      /* trackW: достаточно для 3 карточек + gap, но не длиннее frameW-trackLeft */
      trackW=Math.max(cardW*2+60, frameW-trackLeft-40);
      maxH=360; fSize=26; padCard="32px 30px"; minH=200; repeat=3;
    }

    var track=document.createElement("div");
    track.className="bandit-rev-track";
    track.style.top=topPx+"px";
    track.style.left=trackLeft+"px";
    track.style.width=trackW+"px";
    track.style.boxSizing="border-box";

    function makeCard(t){
      var card=document.createElement("div");
      card.className="bandit-rev-card";
      card.style.width=cardW+"px";
      card.style.minWidth=cardW+"px";
      card.style.height="auto";
      card.style.maxHeight=maxH+"px";
      card.style.overflow="hidden";
      card.style.fontSize=fSize+"px";
      card.style.lineHeight="1.5";
      card.style.padding=padCard;
      card.style.minHeight=minH?minH+"px":"0";
      card.innerHTML=t.innerHTML;
      return card;
    }
    for(var rep=0;rep<repeat;rep++){
      texts.forEach(function(t){ track.appendChild(makeCard(t)); });
    }
    boxes.forEach(function(b){ b.style.display="none"; });
    texts.forEach(function(t){ t.style.display="none"; });
    sec.appendChild(track);
    var down=false,startX=0,startScroll=0;
    track.addEventListener("mousedown",function(e){ down=true; startX=e.pageX; startScroll=track.scrollLeft; e.preventDefault(); });
    window.addEventListener("mousemove",function(e){ if(!down) return; track.scrollLeft=startScroll-(e.pageX-startX); });
    window.addEventListener("mouseup",function(){ down=false; });
    track.addEventListener("wheel",function(e){
      if(Math.abs(e.deltaX)<Math.abs(e.deltaY)){ e.preventDefault(); track.scrollLeft+=e.deltaY; }
    },{passive:false});
  }
  /* ====== HOVER MOTION ====== */
  function setupHoverMotion(root) {
    var skip={"rectangle":1,"rectangle-2":1,"rectangle-3":1,"rectangle-4":1,"rectangle-5":1,"rectangle-6":1,"image":1,"element":1};
    root.querySelectorAll('img[class*="rectangle"]').forEach(function(el){
      var cls=el.getAttribute("class")||"";
      var bare=cls.split(/\s+/)[0];
      if(skip[bare]) return;
      var w=parseInt(getComputedStyle(el).width,10)||0;
      var h=parseInt(getComputedStyle(el).height,10)||0;
      if(w>=60&&h>=60&&w<=760&&h<=520){ el.classList.add("bandit-hover"); }
    });
    root.querySelectorAll("h1,h2,h3").forEach(function(h){ h.classList.add("bandit-hover-title"); });
    root.querySelectorAll(".text-wrapper-15,.text-wrapper-20,.text-wrapper").forEach(function(el){
      if(el.textContent.trim()==="BANDIT") el.classList.add("bandit-glow");
    });
  }

  /* ====== АНИМАЦИИ ПРАВИЛ (выезд слева/справа) ====== */
  function setupRulesAnimation(root) {
    var sec = root.querySelector('section[aria-labelledby="rules-title"], section[aria-label="Правила игры"]');
    if (!sec) return;

    // Группируем правила: ищем числа (1,2,3,4) + их тексты
    // В абсолютной вёрстке ищем пары "div с числом + параграф рядом"
    // Определяем элементы по классам из макета

    var ruleGroups = [];

    // Десктоп
    var deskPairs = [
      ['.text-wrapper-37', '.text-wrapper-36'],
      ['.text-wrapper-7',  '.text-wrapper-50'],
      ['.text-wrapper-38', '.text-wrapper-48'],
      ['.text-wrapper-8',  '.text-wrapper-49']
    ];
    deskPairs.forEach(function(pair) {
      var num = root.querySelector(pair[0]);
      var txt = root.querySelector(pair[1]);
      if (num || txt) {
        var group = [];
        if (num) group.push(num);
        if (txt) group.push(txt);
        ruleGroups.push(group);
      }
    });

    // Планшет — анимируем ТОЛЬКО тексты, цифры оставляем видимыми
    // (цифры text-wrapper-2/3/4/5 имеют opacity:0.22 — при анимации opacity:0 они пропадают)
    var tabTextOnly = [
      '.view-tablet .p',
      '.view-tablet .text-wrapper-17',
      '.view-tablet .text-wrapper-15',
      '.view-tablet .text-wrapper-16'
    ];
    // Цифры показываем сразу без анимации
    var tabNums = [
      '.view-tablet .text-wrapper-2',
      '.view-tablet .text-wrapper-3',
      '.view-tablet .text-wrapper-4',
      '.view-tablet .text-wrapper-5'
    ];
    if (root.classList && root.classList.contains('view-tablet')) {
      // Цифры сразу видимы — только повышаем opacity чуть больше
      tabNums.forEach(function(sel) {
        var el = document.querySelector(sel);
        if (el) { el.style.opacity = '0.4'; }
      });
      // Тексты — в анимацию
      tabTextOnly.forEach(function(sel) {
        var txt = document.querySelector(sel);
        if (txt) { ruleGroups.push([txt]); }
      });
    }

    // Телефон
    var phonePairs = [
      ['.view-phone .text-wrapper-20', '.view-phone .text-wrapper-19'],
      ['.view-phone .text-wrapper-21', '.view-phone .text-wrapper-26'],
      ['.view-phone .text-wrapper-22', '.view-phone .text-wrapper-24'],
      ['.view-phone .text-wrapper-23', '.view-phone .text-wrapper-25']
    ];
    if (root.classList && root.classList.contains('view-phone')) {
      phonePairs.forEach(function(pair) {
        var num = document.querySelector(pair[0]);
        var txt = document.querySelector(pair[1]);
        if (num || txt) {
          var group = [];
          if (num) group.push(num);
          if (txt) group.push(txt);
          ruleGroups.push(group);
        }
      });
    }

    // Если конкретные пары не нашлись, пробуем через параграфы
    if (ruleGroups.length === 0) {
      var nums = Array.prototype.slice.call(sec.querySelectorAll('div'));
      var txts = Array.prototype.slice.call(sec.querySelectorAll('p'));
      var count = Math.max(nums.length, txts.length);
      for (var i = 0; i < count; i++) {
        var group = [];
        if (nums[i]) group.push(nums[i]);
        if (txts[i]) group.push(txts[i]);
        if (group.length) ruleGroups.push(group);
      }
    }

    // Убираем дубли (если группы из разных источников)
    var seen = [];
    ruleGroups = ruleGroups.filter(function(g) {
      var key = g.map(function(el){ return el.className; }).join('|');
      if (seen.indexOf(key) !== -1) return false;
      seen.push(key);
      return true;
    });

    // Применяем классы левый/правый поочерёдно
    var directions = ['bandit-rule-left', 'bandit-rule-right'];
    ruleGroups.forEach(function(group, idx) {
      var dir = directions[idx % 2];
      group.forEach(function(el) {
        el.classList.add('bandit-rule', dir);
      });
    });

    // IntersectionObserver — триггер при появлении в зоне видимости
    if (!window.IntersectionObserver) {
      // Фолбэк: сразу показываем
      ruleGroups.forEach(function(group) {
        group.forEach(function(el) { el.classList.add('bandit-visible'); });
      });
      return;
    }

    ruleGroups.forEach(function(group, idx) {
      var delay = idx * 180; // задержка между правилами
      var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function() {
              el.classList.add('bandit-visible');
            }, delay);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.15 });
      group.forEach(function(el) { observer.observe(el); });
    });
  }

  /* ====== АНИМАЦИИ ПЕРСОНАЖЕЙ (появление с подъёмом) ====== */
  function setupCharactersAnimation(root) {
    var sec = root.querySelector('section[aria-labelledby="characters-title"], section[aria-label="Персонажи"]');
    if (!sec) return;

    // Персонажи: каждая пара img + label
    var imgs = Array.prototype.slice.call(sec.querySelectorAll('img[class*="rectangle"]'));
    var labels = Array.prototype.slice.call(sec.querySelectorAll('div[class*="text-wrapper"]'));

    // Строим группы пар (изображение + подпись)
    var charGroups = [];
    var maxLen = Math.max(imgs.length, labels.length);
    for (var i = 0; i < maxLen; i++) {
      var group = [];
      if (imgs[i]) group.push(imgs[i]);
      if (labels[i]) group.push(labels[i]);
      if (group.length) charGroups.push(group);
    }

    // Применяем класс анимации
    charGroups.forEach(function(group) {
      group.forEach(function(el) {
        el.classList.add('bandit-char');
      });
    });

    if (!window.IntersectionObserver) {
      charGroups.forEach(function(group) {
        group.forEach(function(el) { el.classList.add('bandit-visible'); });
      });
      return;
    }

    charGroups.forEach(function(group, idx) {
      var delay = idx * 130;
      var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function() {
              el.classList.add('bandit-visible');
            }, delay);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.1 });
      group.forEach(function(el) { observer.observe(el); });
    });
  }

  /* ====== БУРГЕР (телефон) ====== */
  function setupBurger(root) {
    if(!root.classList||!root.classList.contains("view-phone")) return;
    var burger=root.querySelector(".text-wrapper-5");
    if(!burger) return;
    burger.style.cursor="pointer"; burger.style.zIndex="100";
    burger.style.position=burger.style.position||"absolute";
    burger.setAttribute("aria-label","Меню");
    var backdrop=document.createElement("div"); backdrop.className="bandit-burger-backdrop";
    var menu=document.createElement("nav"); menu.className="bandit-burger-menu";
    var close=document.createElement("button"); close.className="bandit-burger-close"; close.innerHTML="&times;";
    menu.appendChild(close);
    [["Услуги","services"],["Виды игр","games"],["Правила","rules"],["Информация","info"],["Отзывы","reviews"],["Контакты","contact"]].forEach(function(it){
      var a=document.createElement("a"); a.textContent=it[0];
      a.addEventListener("click", function(){ closeMenu(); setTimeout(function(){ smoothScrollToEl(resolveAnchor(root,it[1])); },300); });
      menu.appendChild(a);
    });
    document.body.appendChild(backdrop); document.body.appendChild(menu);
    function openMenu(){ menu.classList.add("open"); backdrop.classList.add("open"); }
    function closeMenu(){ menu.classList.remove("open"); backdrop.classList.remove("open"); }
    burger.addEventListener("click", function(e){ e.preventDefault(); openMenu(); });
    close.addEventListener("click", closeMenu);
    backdrop.addEventListener("click", closeMenu);
  }

  /* ====== ФОРМА: ВАЛИДАЦИЯ ====== */

  /* Показываем сообщение как fixed overlay — НЕ вставляем в form/DOM страницы,
     чтобы не сдвигать абсолютно-позиционированные элементы */
  function showFormMessage(text, isError) {
    var existing = document.getElementById('bandit-msg-overlay');
    if (existing) existing.remove();

    var msg = document.createElement('div');
    msg.id = 'bandit-msg-overlay';
    msg.textContent = text;
    msg.style.cssText = [
      'position:fixed',
      'top:50%',
      'left:50%',
      'transform:translate(-50%,-50%)',
      'background:' + (isError ? '#1a0a0a' : '#0a1a0a'),
      'border:2px solid ' + (isError ? '#e25252' : '#e2c730'),
      'color:#fff',
      'padding:20px 36px',
      'border-radius:6px',
      'font-family:"Inter-Regular",Helvetica,sans-serif',
      'font-size:16px',
      'line-height:1.5',
      'z-index:999999',
      'pointer-events:none',
      'text-align:center',
      'max-width:360px',
      'box-shadow:0 8px 32px rgba(0,0,0,0.6)',
      'opacity:0',
      'transition:opacity 0.3s ease'
    ].join(';');

    document.body.appendChild(msg);
    requestAnimationFrame(function() { msg.style.opacity = '1'; });
    setTimeout(function() {
      msg.style.opacity = '0';
      setTimeout(function() { if (msg.parentNode) msg.remove(); }, 350);
    }, isError ? 3000 : 2500);
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function validatePhone(v) {
    var stripped = v.replace(/[\s\-\(\)\+]/g, '');
    return /^[78]\d{10}$/.test(stripped) || /^\d{7,15}$/.test(stripped);
  }

  function validateName(v) {
    return /^[а-яёА-ЯЁa-zA-Z\s\-]{2,}$/.test(v.trim());
  }

  var _submitting = false; /* защита от двойного вызова */

  function handleSubmit(form) {
    if (_submitting) return;
    _submitting = true;
    setTimeout(function() { _submitting = false; }, 500);

    var root = form.closest('.view-desktop,.view-tablet,.view-phone') || document.body;

    function getField(id) {
      return form.querySelector('#' + id) || root.querySelector('#' + id);
    }

    var nameEl  = getField('name');
    var emailEl = getField('email');
    var phoneEl = getField('phone');
    var consent = form.querySelector('#consent, #agreement')
               || root.querySelector('#consent, #agreement');

    /* Сброс подсветки ошибок */
    [nameEl, emailEl, phoneEl].forEach(function(el) {
      if (el) el.style.borderBottom = '';
    });

    var errors = [];

    /* Имя — обязательно, только буквы */
    if (!nameEl || !nameEl.value.trim()) {
      errors.push('Укажите имя');
      if (nameEl) nameEl.style.borderBottom = '2px solid #e25252';
    } else if (!validateName(nameEl.value)) {
      errors.push('Имя: только буквы (без цифр и символов)');
      nameEl.style.borderBottom = '2px solid #e25252';
    }

    /* Телефон — обязательно, только цифры */
    if (!phoneEl || !phoneEl.value.trim()) {
      errors.push('Укажите телефон');
      if (phoneEl) phoneEl.style.borderBottom = '2px solid #e25252';
    } else if (!validatePhone(phoneEl.value)) {
      errors.push('Телефон: только цифры, напр. +79001234567');
      phoneEl.style.borderBottom = '2px solid #e25252';
    }

    /* Email — если введён, проверяем формат */
    if (emailEl && emailEl.value.trim() && !validateEmail(emailEl.value)) {
      errors.push('Email: неверный формат, напр. name@mail.ru');
      emailEl.style.borderBottom = '2px solid #e25252';
    }

    /* Согласие */
    if (consent && !consent.checked) {
      errors.push('Отметьте согласие на обработку данных');
    }

    if (errors.length > 0) {
      showFormMessage(errors[0], true);
      return;
    }

    /* Успех — показываем сообщение и сбрасываем поля */
    showFormMessage('✓ Заявка отправлена!\nМы свяжемся с вами.', false);

    /* Сбрасываем поля вручную без form.reset() чтобы не сдвигать layout */
    [nameEl, emailEl, phoneEl, getField('message')].forEach(function(el) {
      if (el) { el.value = ''; el.style.borderBottom = ''; }
    });
    if (consent) consent.checked = false;

    /* Возвращаем лейблы */
    root.querySelectorAll('label[for]').forEach(function(l) { l.style.opacity = '1'; });
  }

})();
