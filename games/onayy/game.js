// =========================================================
// ONAYYY — Agreeee (Vestman, 2025) Türkçe versiyonu
// 12 tuzaklı onay ekranı + side-scroller aksiyon fazı
// 5 can, checkpoint reset
// =========================================================

const COLORS = {
  BG_DESKTOP:    0x1A2233,
  DIALOG_BG:     0xF0F0F0,
  DIALOG_HDR:    0x3B5998,
  DIALOG_BORDER: 0xCCCCCC,
  BTN_NORMAL:    0xE0E0E0,
  BTN_HOVER:     0x4A90E2,
  BTN_DANGER:    0xC70039,
  ACCENT_OK:     0x2ECC71,
  ACCENT_WARN:   0xF39C12,
  INPUT_BG:      0xFFFFFF,
  ACTION_BG:     0x16213E,
  ACTION_FG:     0x0F3460,
  PLAYER:        0xECF0F1,
  SPIKE:         0xC70039,
  FLAG:          0xFFE66D,
  PLATFORM:      0x4ECDC4
};

const HEX = {
  TEXT:       '#222222',
  TEXT_LIGHT: '#FFFFFF',
  TEXT_HINT:  '#888888',
  OK:         '#2ECC71',
  WARN:       '#F39C12',
  DANGER:     '#C70039'
};

const GAME_W = 1024;
const GAME_H = 640;
const TOTAL_TERMS = 12;
const STARTING_LIVES = 5;

// Touch / mobile detection — pointer event'le destekli cihaz
const IS_TOUCH = (typeof window !== 'undefined') && (
  'ontouchstart' in window ||
  (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
);

// =========================================================
// i18n — Türkçe / English
// =========================================================
const I18N = {
  tr: {
    'boot.title': 'KULLANICI SÖZLEŞMESİ',
    'boot.body': 'Bu hizmeti kullanmak için 12 maddelik kullanıcı şartnamesini\nokuyup onaylamanız gerekmektedir.\n\nSonra... gerçek oyun başlar.',
    'boot.start': 'BAŞLA',
    'boot.cancel': 'VAZGEÇ',
    'boot.cantCancel': 'Vazgeçemezsiniz. Hayatın gerçeği bu.',
    'boot.bestTime': '🏆 En iyi süre',
    'boot.lang': 'Dil',
    'progress.term': 'Madde',
    'shartname.label': 'ŞARTNAME — Madde {n}/12',
    'btn.agree': 'ONAYLIYORUM',
    'btn.agreeLower': 'onayla',
    'btn.yes': 'EVET',
    'btn.no': 'HAYIR',
    'btn.continue': 'DEVAM ET',
    'btn.skip5': '⏩ 5x ATLA',
    'btn.send': 'GÖNDER ↵',
    'btn.delete': '⌫ Sil',
    'term1.body': 'Bu hizmeti kullanmak için makul ve mantıklı şartlarımızı kabul ediyorsunuz.\n\nKolay başlıyoruz.',
    'term2.body': 'Madde 2: Kullanıcı, gerekli düğmeyi bulma sorumluluğunu kabul eder.\n\nButon ekranın bir köşesinde, küçük.',
    'term3.body': 'Aşağıdaki dört buton aynı görünür.\nSADECE BİRİ gerçek "ONAYLIYORUM" butonudur.\nYanlış → ekran sıfırlanır.',
    'term3.wrong': 'Yanlış buton.',
    'term4.body': 'Madde 4: Kullanıcı, hareket eden hedefleri yakalama yeteneğini kabul eder.\n\nButon soldan sağa kayıyor. Yakala.',
    'term5.body': 'Madde 5: İnsan olduğunuzu doğrulayın.\nAşağıdaki yıldız sayısını yazıp ENTER\'a basın.',
    'term5.hint': "0–9 yaz · ENTER ile gönder · ⌫ ile sil",
    'term5.wrong': 'Yanlış. Robot olabilir misin?',
    'term6.body': 'Madde 6: Tolerans seviyenizi tam değere getirin.\n\nKaydırıcıyı 100\'e sürükle. (Sistem geri çekiyor.)',
    'term6.value': 'Değer',
    'term6.dragHint': '↔ kaydırıcıyı sürükle',
    'term7.body': 'Madde 7: Kullanıcı, butonun "kayganlığını" kabul eder.\n\nButonu yakala.',
    'term8.body': 'Madde 8: "ONAYLA" kutusunu yeşil hedefe sürükleyin.\nKırmızı engele dokunmadan.',
    'term8.target': 'HEDEF',
    'term8.drag': 'ONAYLA',
    'term8.hit': 'Engele çarptın.',
    'term9.bodyKbd': 'Madde 9: Tüm sayfaları okuyarak sona ulaşın.\n(İpucu: → tuşunu basılı tut.)',
    'term9.bodyTouch': 'Madde 9: Tüm sayfaları okuyarak sona ulaşın.\n(İpucu: "5x ATLA" butonuyla hızla geç.)',
    'term9.page': 'Sayfa {n} / {total}',
    'term10.body': 'Madde 10: Buton göründüğü anda tıklayın.\nGörünmeden kaybolur.',
    'term10.slowHint': '(Belki çok yavaşsın. Süre uzatıldı.)',
    'term11.title': 'ŞARTNAME — Madde 11/12 (Onay {n}/5)',
    'term11.q1': 'Şartların tamamını onaylıyor musunuz?',
    'term11.q2': 'Emin misiniz?',
    'term11.q3': 'Kesinlikle emin misiniz?',
    'term11.q4': 'Pişman olmayacaksınız değil mi?',
    'term11.q5': 'Son şans. Cidden mi?',
    'term11.reset': 'Geri dönüş yok. Sıfırlandı.',
    'term12.body': 'Madde 12 (son): Cursor X ekseni TERSİNE çalışıyor.\n\nButona ulaşmak için ters yönde hareket et.',
    'action.label': 'AKSİYON FAZI',
    'action.lives': 'CAN',
    'action.progress': 'İLERLEME',
    'action.checkpoint': 'KONTROL NOKTASI',
    'action.lifeBonus': '+1 ♥',
    'pause.title': 'DURAKLATILDI',
    'pause.hint': '[ESC] Devam   ·   [R] Yeniden Başla',
    'gameover.win': 'TEBRİKLER — GEÇTİN',
    'gameover.lose': 'OYUN BİTTİ',
    'gameover.winSub': '12 madde + aksiyon fazı tamamlandı.',
    'gameover.loseSub': 'Tüm canlarını kaybettin. Şartnameyi geçmiştin, takdir.',
    'gameover.time': '⏱  Süre',
    'gameover.deaths': '💀 Ölüm',
    'gameover.bonus': '⭐ Toplanan bonus',
    'gameover.bestRecord': '🏆 En iyi rekor',
    'gameover.newRecord': '🏆 YENİ REKOR',
    'gameover.restart': '[R] Tekrar Başla',
    'gameover.loadStatus': ['Karakterler hazırlanıyor...'],
    'mode.label': 'Mod',
    'mode.normal': 'NORMAL',
    'mode.hardcore': 'HARDCORE',
    'mode.normalDesc': '5 can · checkpoint var',
    'mode.hardcoreDesc': '⚠ 1 can · checkpoint yok · rastgele 12 madde',
    'gameover.modeNormal': 'Mod: NORMAL',
    'gameover.modeHardcore': 'Mod: HARDCORE',
    'term13.body': 'Sırasıyla 1, 2 ve 3 numaralı kutuları onaylayın.\nYanlış sıra → reset.',
    'term13.wrong': 'Sıra bozuldu. Sıfırlandı.',
    'term14.body': 'Aşağıdaki renklerden EN KOYU olanını seçin.',
    'term14.wrong': 'Yanlış renk.',
    'term15.body': 'İnsan zekası testi.\nAşağıdaki ifadeyi hesaplayıp sonucu yazın.',
    'term15.wrong': 'Yanlış. Tekrar dene.',
    'lore.company': 'TEKNOSAFİR LTD. ŞTİ.',
    'lore.tagline': 'Güvenli onaylar, mutlu kullanıcılar.',
    'lore.contractVersion': 'Sözleşme v12.7.4 — Geçerli: bugün',
    'lore.companySig': '— TeknoSafir Hukuk Departmanı',
    'lore.narratorMsgs': [
      'Sistem: Kullanıcı dikkatleri ölçülüyor...',
      'Bilgi: Sözleşmeyi okumayan %94 kullanıcı buradan geçmiştir.',
      'Uyarı: Bu noktadan sonra sorumluluk size aittir.',
      'Bildirim: TeknoSafir size güvenir. Belki.',
      'Sistem: Onayınız depolandı. Tekrar onay alacağız zaten.',
      'İpucu: Aceleci olmak hata payını artırır.',
      'TeknoSafir: Kullanıcı sadakati doğrulanıyor...'
    ],
    'lore.bulletinTitle': '📰 TEKNOSAFİR BÜLTENİ',
    'lore.bulletins': [
      'Yeni KVKK güncellemesi: Verileriniz daha güvenli ama daha az sizin.',
      'Q3 raporuna göre kullanıcılar onay süresinde %12 hızlandı.',
      'Yıllık müşteri memnuniyeti %3. Kayda değer.',
      'Şartname versiyon güncellemesi: 11.0.0 → 12.7.4 (geriye uyumlu değil).',
      'Hukuk departmanı: "Hata değil, beklenen kullanıcı davranışıdır."',
      'TeknoSafir: 47 ülkede 0 kullanıcının veri talebi karşılandı.'
    ],
    'lore.ceoQuotes': [
      '"Kullanıcılarımızı seviyoruz. Verilerini de." — CEO, 2023',
      '"Onay bir hak değil, sürekli bir görevdir." — TeknoSafir Manifesto',
      '"En iyi sözleşme, hiç okunmayan sözleşmedir." — İcra Kurulu',
      '"Şartlarımızı kabul edenler, geleceği şekillendirir." — Yatırımcı Sunumu',
      '"Vazgeçmek yok, sadece okuyamamak vardır." — Kullanıcı Deneyimi Direktörü'
    ],
    'leaderboard.title': '🏆 SON 5 RUN',
    'leaderboard.empty': 'Henüz bitirilmiş bir run yok.',
    'leaderboard.cols': 'Mod · Süre · Ölüm · ⭐',
    'achievements.title': '🎖 BAŞARIMLAR',
    'achievements.unlocked': 'Açıldı',
    'achievements.locked': 'Kilitli',
    'achievements.firstWin.name': 'İlk Geçiş',
    'achievements.firstWin.desc': 'Şartnameyi geçtin.',
    'achievements.hardcore.name': 'Hardcore Hayatta Kalan',
    'achievements.hardcore.desc': 'HARDCORE modu geç.',
    'achievements.speed.name': 'Hızlı Onaycı',
    'achievements.speed.desc': '60 saniye altında bitir.',
    'achievements.noDeath.name': 'Ölümsüz',
    'achievements.noDeath.desc': 'Hiç ölmeden geç.',
    'achievements.allBonus.name': 'Yıldız Avcısı',
    'achievements.allBonus.desc': '4/4 bonusu topla.',
    'achievement.unlocked': '🎖 BAŞARIM AÇILDI',
    'term16.body': 'Madde 16: Tolerans seviyenizi SIFIRA indirin.\n\nKaydırıcı yukarı kayıyor.',
    'term17.body': 'Madde 17: Tam {n} kez tıklayın. Fazla → reset.',
    'term17.label': 'Tıklamalar',
    'term17.over': 'Çok hızlı tıkladın. Sıfırlandı.',
    'term18.body': 'Madde 18: Butonu {sec} saniye basılı tutun.\nBırakırsanız sıfırlanır.',
    'term18.holdHint': 'Basılı tut...',
    'term19.body': 'Madde 19: Renkli sıra gösterilecek.\nAynı sırayı tıkla.',
    'term19.watch': 'İzle...',
    'term19.repeat': 'Aynı sırayı tıkla',
    'term19.wrong': 'Sıra bozuldu.',
    'term20.body': 'Madde 20: Ok DOĞRU yöne baktığında DUR\'a tıkla.',
    'term20.target': 'Hedef yön',
    'term20.stop': 'DUR',
    'term21.body': 'Madde 21: Yazıyı oku, ama RENGİNİ tıkla.\n(Stroop testi — beyninizi yoracak.)',
    'term21.wrong': 'Renk değil, yazı tıkladın.',
    'term22.body': 'Madde 22: 5 yapay pop-up kapat.\nGerçek "Onayla" en son.',
    'term22.fakeBtn': 'Onayla',
    'term23.body': 'Madde 23: Cursor\'u kırmızı duvarlara dokunmadan yeşil hedefe götür.',
    'term23.wall': 'Duvara çarptın.',
    'term24.body': 'Madde 24: Aşağıdaki 6 buton var. Sadece YEŞİL olanları tıkla.\n(Yanıltıcılar var.)',
    'term24.wrong': 'Yanlış renk.',
    'term25.body': 'Madde 25: Butonları 1\'den 9\'a SIRAYLA tıkla.\nYanlış sıra → reset.',
    'term25.wrong': 'Sıra bozuldu.',
    'term26.body': 'Madde 26: İki kaydırıcıyı aynı değere getirin (±2 tolerans).',
    'term26.diff': 'Fark',
    'term27.body': 'Madde 27: Belirtilen kelimeyi YAZIN ve ENTER\'a basın.',
    'term27.wrong': 'Yanlış girdi.',
    'term28.body': 'Madde 28: 4 vuruşa zamanlı tıkla. (Düzenli ritim.)',
    'term28.tooFast': 'Çok hızlı.',
    'term28.tooSlow': 'Çok yavaş.',
    'term29.body': 'Madde 29: Cursor 5 nokta üstünden geçsin (tıklamadan).',
    'term29.label': 'Geçilen',
    'term30.body': 'Madde 30: Aşağıdaki yıldızlar arasında DİĞERLERİNDEN FARKLI olanı bul.',
    'term30.wrong': 'Yanlış. Dikkat.',
    'tilt.title': '⚠ TEKNOSAFİR İK',
    'tilt.msgs': [
      'Sakin ol. Şartname seni rahatsız etmek için tasarlanmadı. (Belki.)',
      'Bilgi: 47 kullanıcı bu noktada vazgeçti. Sen vazgeçme.',
      'Tilt mı oldun? Bu da bir veri olarak kayıt edildi.',
      'Sistem: Hata oranınız ortalamanın üstünde. Devam edin.',
      'Hatırlatma: TeknoSafir öfkenizi anlıyor. Anlayışlı bir şirket.'
    ]
  },
  en: {
    'boot.title': 'USER AGREEMENT',
    'boot.body': 'To use this service, you must read and agree to all 12\narticles of the user terms.\n\nThen... the real game begins.',
    'boot.start': 'START',
    'boot.cancel': 'CANCEL',
    'boot.cantCancel': "You can't cancel. That's life.",
    'boot.bestTime': '🏆 Best time',
    'boot.lang': 'Lang',
    'progress.term': 'Article',
    'shartname.label': 'TERMS — Article {n}/12',
    'btn.agree': 'I AGREE',
    'btn.agreeLower': 'agree',
    'btn.yes': 'YES',
    'btn.no': 'NO',
    'btn.continue': 'CONTINUE',
    'btn.skip5': '⏩ SKIP 5x',
    'btn.send': 'SEND ↵',
    'btn.delete': '⌫ Del',
    'term1.body': "By using this service, you accept our reasonable and rational terms.\n\nWe start easy.",
    'term2.body': 'Article 2: User accepts the responsibility of finding the right button.\n\nThe button is in a corner, small.',
    'term3.body': 'The four buttons below look identical.\nONLY ONE is the real "I AGREE" button.\nWrong → screen resets.',
    'term3.wrong': 'Wrong button.',
    'term4.body': 'Article 4: User accepts the ability to catch moving targets.\n\nButton slides left to right. Catch it.',
    'term5.body': 'Article 5: Verify you are human.\nCount the stars below, type the number, press ENTER.',
    'term5.hint': '0–9 type · ENTER to send · ⌫ to delete',
    'term5.wrong': 'Wrong. Could you be a robot?',
    'term6.body': "Article 6: Set your tolerance level to the maximum.\n\nDrag the slider to 100. (System pulls back.)",
    'term6.value': 'Value',
    'term6.dragHint': '↔ drag the slider',
    'term7.body': 'Article 7: User accepts the "slipperiness" of the button.\n\nCatch the button.',
    'term8.body': 'Article 8: Drag the "AGREE" box to the green target.\nWithout touching the red obstacle.',
    'term8.target': 'TARGET',
    'term8.drag': 'AGREE',
    'term8.hit': 'You hit the obstacle.',
    'term9.bodyKbd': 'Article 9: Read all pages and reach the end.\n(Hint: hold → key.)',
    'term9.bodyTouch': 'Article 9: Read all pages and reach the end.\n(Hint: use "SKIP 5x" button to fly through.)',
    'term9.page': 'Page {n} / {total}',
    'term10.body': 'Article 10: Click the button the moment it appears.\nIt vanishes if you miss.',
    'term10.slowHint': '(Maybe you are too slow. Window extended.)',
    'term11.title': 'TERMS — Article 11/12 (Confirm {n}/5)',
    'term11.q1': 'Do you agree to all terms?',
    'term11.q2': 'Are you sure?',
    'term11.q3': 'Absolutely sure?',
    'term11.q4': "You won't regret it, right?",
    'term11.q5': 'Last chance. Really?',
    'term11.reset': 'No going back. Reset.',
    'term12.body': 'Article 12 (final): Cursor X-axis is REVERSED.\n\nMove the opposite way to reach the button.',
    'action.label': 'ACTION PHASE',
    'action.lives': 'HP',
    'action.progress': 'PROGRESS',
    'action.checkpoint': 'CHECKPOINT',
    'action.lifeBonus': '+1 ♥',
    'pause.title': 'PAUSED',
    'pause.hint': '[ESC] Resume   ·   [R] Restart',
    'gameover.win': 'CONGRATS — YOU PASSED',
    'gameover.lose': 'GAME OVER',
    'gameover.winSub': '12 articles + action phase completed.',
    'gameover.loseSub': 'You lost all lives. But you passed the terms — respect.',
    'gameover.time': '⏱  Time',
    'gameover.deaths': '💀 Deaths',
    'gameover.bonus': '⭐ Bonuses',
    'gameover.bestRecord': '🏆 Best record',
    'gameover.newRecord': '🏆 NEW RECORD',
    'gameover.restart': '[R] Restart',
    'gameover.loadStatus': ['Preparing...'],
    'mode.label': 'Mode',
    'mode.normal': 'NORMAL',
    'mode.hardcore': 'HARDCORE',
    'mode.normalDesc': '5 lives · checkpoint enabled',
    'mode.hardcoreDesc': '⚠ 1 life · no checkpoint · random 12 articles',
    'gameover.modeNormal': 'Mode: NORMAL',
    'gameover.modeHardcore': 'Mode: HARDCORE',
    'term13.body': 'Click the boxes in order: 1, 2, then 3.\nWrong order → reset.',
    'term13.wrong': 'Order broken. Reset.',
    'term14.body': 'Pick the DARKEST color below.',
    'term14.wrong': 'Wrong color.',
    'term15.body': 'Human intelligence test.\nCompute the expression and type the result.',
    'term15.wrong': 'Wrong. Try again.',
    'lore.company': 'TEKNOSAFİR INC.',
    'lore.tagline': 'Safe consents. Happy users.',
    'lore.contractVersion': 'Agreement v12.7.4 — Effective: today',
    'lore.companySig': '— TeknoSafir Legal Department',
    'lore.narratorMsgs': [
      'System: measuring user attention...',
      'Info: 94% of users pass through without reading.',
      'Warning: Beyond this point, responsibility is yours.',
      'Notice: TeknoSafir trusts you. Maybe.',
      'System: Consent stored. We will ask again anyway.',
      'Tip: Haste increases error rate.',
      'TeknoSafir: verifying user loyalty...'
    ],
    'lore.bulletinTitle': '📰 TEKNOSAFİR BULLETIN',
    'lore.bulletins': [
      'New GDPR update: Your data is safer, but less yours.',
      'Q3 report: users 12% faster on consent screens.',
      'Annual customer satisfaction: 3%. Notable.',
      'Contract version update: 11.0.0 → 12.7.4 (not backwards compatible).',
      'Legal: "Not a bug, expected user behavior."',
      'TeknoSafir: 47 countries, 0 data requests fulfilled.'
    ],
    'lore.ceoQuotes': [
      '"We love our users. And their data." — CEO, 2023',
      '"Consent is not a right, but a continuous duty." — TeknoSafir Manifesto',
      '"The best contract is the unread one." — Executive Board',
      '"Those who accept our terms shape the future." — Investor Pitch',
      '"There is no quitting, only failing to read." — UX Director'
    ],
    'leaderboard.title': '🏆 LAST 5 RUNS',
    'leaderboard.empty': 'No completed runs yet.',
    'leaderboard.cols': 'Mode · Time · Deaths · ⭐',
    'achievements.title': '🎖 ACHIEVEMENTS',
    'achievements.unlocked': 'Unlocked',
    'achievements.locked': 'Locked',
    'achievements.firstWin.name': 'First Win',
    'achievements.firstWin.desc': 'Passed the terms.',
    'achievements.hardcore.name': 'Hardcore Survivor',
    'achievements.hardcore.desc': 'Beat HARDCORE mode.',
    'achievements.speed.name': 'Speed Signer',
    'achievements.speed.desc': 'Finish under 60 seconds.',
    'achievements.noDeath.name': 'Immortal',
    'achievements.noDeath.desc': 'Win without dying.',
    'achievements.allBonus.name': 'Star Hunter',
    'achievements.allBonus.desc': 'Collect all 4 bonuses.',
    'achievement.unlocked': '🎖 ACHIEVEMENT UNLOCKED',
    'term16.body': 'Article 16: Lower tolerance to ZERO.\n\nThe slider drifts up.',
    'term17.body': 'Article 17: Click exactly {n} times. Over → reset.',
    'term17.label': 'Clicks',
    'term17.over': 'Too many clicks. Reset.',
    'term18.body': 'Article 18: Hold the button for {sec} seconds.\nReleasing resets.',
    'term18.holdHint': 'Hold...',
    'term19.body': 'Article 19: A color sequence will play.\nClick the same order.',
    'term19.watch': 'Watch...',
    'term19.repeat': 'Repeat the order',
    'term19.wrong': 'Sequence broken.',
    'term20.body': 'Article 20: Click STOP when the arrow points to the TARGET.',
    'term20.target': 'Target direction',
    'term20.stop': 'STOP',
    'term21.body': 'Article 21: Read the word, but click its COLOR.\n(Stroop test — your brain will hurt.)',
    'term21.wrong': 'You clicked the word, not the color.',
    'term22.body': 'Article 22: Close 5 fake pop-ups.\nThe real "Agree" is at the end.',
    'term22.fakeBtn': 'Agree',
    'term23.body': 'Article 23: Move cursor to the green target without touching red walls.',
    'term23.wall': 'Hit the wall.',
    'term24.body': 'Article 24: 6 buttons below. Click ONLY GREEN ones.\n(Decoys included.)',
    'term24.wrong': 'Wrong color.',
    'term25.body': 'Article 25: Click buttons 1 through 9 IN ORDER.\nWrong order → reset.',
    'term25.wrong': 'Order broken.',
    'term26.body': 'Article 26: Set both sliders to the same value (±2 tolerance).',
    'term26.diff': 'Diff',
    'term27.body': 'Article 27: Type the displayed word and press ENTER.',
    'term27.wrong': 'Wrong input.',
    'term28.body': 'Article 28: Click on 4 beats. (Steady rhythm.)',
    'term28.tooFast': 'Too fast.',
    'term28.tooSlow': 'Too slow.',
    'term29.body': 'Article 29: Hover cursor over 5 points (no clicking).',
    'term29.label': 'Passed',
    'term30.body': 'Article 30: Find the star DIFFERENT from the others.',
    'term30.wrong': 'Wrong. Look closer.',
    'tilt.title': '⚠ TEKNOSAFİR HR',
    'tilt.msgs': [
      'Stay calm. The contract is not designed to annoy you. (Maybe.)',
      'Info: 47 users gave up at this point. Do not give up.',
      'Tilted? This too has been recorded as data.',
      'System: Your error rate is above average. Keep going.',
      'Reminder: TeknoSafir understands your rage. Empathetic company.'
    ]
  }
};

let LANG = (() => {
  try { return localStorage.getItem('onayy.lang') || 'tr'; } catch (_) { return 'tr'; }
})();
function setLang(l) {
  LANG = l;
  try { localStorage.setItem('onayy.lang', l); } catch (_) {}
}

let MODE = (() => {
  try { return localStorage.getItem('onayy.mode') || 'normal'; } catch (_) { return 'normal'; }
})();
function setMode(m) {
  MODE = m;
  try { localStorage.setItem('onayy.mode', m); } catch (_) {}
}
function bestKey() { return MODE === 'hardcore' ? 'onayy.bestTimeMsHard' : 'onayy.bestTimeMs'; }
function t(key, params) {
  let s = (I18N[LANG] && I18N[LANG][key]);
  if (s === undefined) s = I18N.tr[key];
  if (s === undefined) return key;
  if (params) Object.entries(params).forEach(([k, v]) => { s = String(s).replace(new RegExp('\\{' + k + '\\}', 'g'), v); });
  return s;
}

// =========================================================
// SFX — Web Audio API prosedürel
// =========================================================

function sfx(opts) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = window.__audioCtx ||= new Ctx();
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = opts.type || 'square';
  osc.frequency.setValueAtTime(opts.from, ctx.currentTime);
  if (opts.to) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(opts.to, 1),
      ctx.currentTime + opts.duration
    );
  }
  gain.gain.setValueAtTime(opts.volume || 0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + opts.duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + opts.duration);
}

function sfxNoise(duration, volume) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = window.__audioCtx ||= new Ctx();
  if (ctx.state === 'suspended') ctx.resume();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buffer;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  src.connect(gain).connect(ctx.destination);
  src.start();
}

const SFX = {
  hover:  () => sfx({ type: 'sine', from: 660, duration: 0.04, volume: 0.05 }),
  click:  () => sfx({ type: 'square', from: 880, to: 440, duration: 0.06, volume: 0.12 }),
  accept: () => sfx({ type: 'sine', from: 523, to: 1046, duration: 0.18 }),
  reject: () => sfx({ type: 'sawtooth', from: 220, to: 110, duration: 0.25 }),
  error:  () => sfx({ type: 'sawtooth', from: 196, duration: 0.35 }),
  typing: () => sfx({ type: 'square', from: 1200, duration: 0.02, volume: 0.06 }),
  paper:  () => sfxNoise(0.05, 0.06),
  jump:   () => sfx({ type: 'square', from: 220, to: 660, duration: 0.10, volume: 0.15 }),
  death:  () => sfx({ type: 'sawtooth', from: 440, to: 80, duration: 0.5, volume: 0.20 }),
  win:    () => {
    sfx({ type: 'sine', from: 523, duration: 0.15 });
    setTimeout(() => sfx({ type: 'sine', from: 659, duration: 0.15 }), 130);
    setTimeout(() => sfx({ type: 'sine', from: 784, duration: 0.30 }), 260);
  }
};

// =========================================================
// HELPERS
// =========================================================

function makeDesktopBackground(scene) {
  scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, COLORS.BG_DESKTOP);
  for (let i = 0; i < 12; i++) {
    const x = 28 + (i % 4) * 64;
    const y = 28 + Math.floor(i / 4) * 70;
    scene.add.rectangle(x, y, 32, 28, 0x2C3E50, 0.6).setStrokeStyle(1, 0x556270, 0.6);
    scene.add.text(x, y + 22, ['Belge', 'Klasör', 'Dosya', 'Arşiv'][i % 4], {
      font: '9px system-ui', color: '#88a'
    }).setOrigin(0.5);
  }
  scene.add.rectangle(GAME_W / 2, GAME_H - 12, GAME_W, 24, 0x0F1622).setStrokeStyle(1, 0x2C3E50);
  scene.add.text(20, GAME_H - 12, '⚙ Sistem', { font: '11px system-ui', color: '#aac' }).setOrigin(0, 0.5);
  scene.add.text(GAME_W - 20, GAME_H - 12, '00:00', { font: '11px system-ui', color: '#aac' }).setOrigin(1, 0.5);
}

function createDialog(scene, opts) {
  const x = opts.x !== undefined ? opts.x : GAME_W / 2;
  const y = opts.y !== undefined ? opts.y : GAME_H / 2;
  const w = opts.w || 540;
  const h = opts.h || 280;
  const title = opts.title || 'ŞARTNAME';
  const body = opts.body || '';

  const items = [];
  items.push(scene.add.rectangle(x + 4, y + 4, w, h, 0x000000, 0.35));
  items.push(scene.add.rectangle(x, y, w, h, COLORS.DIALOG_BG).setStrokeStyle(1, COLORS.DIALOG_BORDER));
  items.push(scene.add.rectangle(x, y - h / 2 + 14, w, 28, COLORS.DIALOG_HDR));
  items.push(scene.add.text(x - w / 2 + 12, y - h / 2 + 14, title, {
    font: 'bold 13px system-ui', color: HEX.TEXT_LIGHT
  }).setOrigin(0, 0.5));
  items.push(scene.add.text(x + w / 2 - 14, y - h / 2 + 14, '✕', {
    font: 'bold 12px system-ui', color: HEX.TEXT_LIGHT
  }).setOrigin(0.5));

  if (body) {
    items.push(scene.add.text(x, y - h / 2 + 70, body, {
      font: '15px system-ui', color: HEX.TEXT, align: 'center', wordWrap: { width: w - 50 }
    }).setOrigin(0.5, 0));
  }
  return items;
}

function makeButton(scene, x, y, w, h, label, onClick) {
  const bg = scene.add.rectangle(x, y, w, h, COLORS.BTN_NORMAL).setStrokeStyle(1, COLORS.DIALOG_BORDER);
  const txt = scene.add.text(x, y, label, {
    font: 'bold 13px system-ui', color: HEX.TEXT
  }).setOrigin(0.5);

  bg.setInteractive({ useHandCursor: true })
    .on('pointerover', () => {
      bg.setFillStyle(COLORS.BTN_HOVER);
      txt.setColor(HEX.TEXT_LIGHT);
      SFX.hover();
      // Micro-bounce game-feel
      scene.tweens.killTweensOf([bg, txt]);
      scene.tweens.add({ targets: [bg, txt], scale: 1.05, duration: 80, ease: 'Sine.out' });
    })
    .on('pointerout', () => {
      bg.setFillStyle(COLORS.BTN_NORMAL);
      txt.setColor(HEX.TEXT);
      scene.tweens.killTweensOf([bg, txt]);
      scene.tweens.add({ targets: [bg, txt], scale: 1.0, duration: 100, ease: 'Sine.out' });
    })
    .on('pointerdown', () => {
      SFX.click();
      scene.tweens.killTweensOf([bg, txt]);
      scene.tweens.add({ targets: [bg, txt], scale: 0.95, duration: 60, yoyo: true, ease: 'Sine.out' });
      onClick(bg, txt);
    });

  return {
    bg, txt,
    setPosition: (nx, ny) => { bg.setPosition(nx, ny); txt.setPosition(nx, ny); },
    setSize: (nw, nh) => { bg.setSize(nw, nh); }
  };
}

// ---------- BGM (procedural chiptune for Action scene) ----------
function startBGM() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = window.__audioCtx ||= new Ctx();
  if (ctx.state === 'suspended') ctx.resume();

  const master = ctx.createGain();
  master.gain.value = 0.06;
  master.connect(ctx.destination);

  // Bass + lead pattern, minor key feel — short tense loop
  const bass = [110, 110, 165, 110, 130.81, 110, 165, 130.81];
  const lead = [261.63, 329.63, 392, 329.63, 311.13, 392, 466.16, 392];
  const bpm = 130;
  const stepMs = (60000 / bpm) / 2; // 8th notes
  let i = 0;
  let stopped = false;

  const playStep = () => {
    if (stopped) return;
    const t = ctx.currentTime;
    // Bass
    const bo = ctx.createOscillator();
    const bg = ctx.createGain();
    bo.type = 'square';
    bo.frequency.value = bass[i % bass.length];
    bg.gain.setValueAtTime(0.5, t);
    bg.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    bo.connect(bg).connect(master);
    bo.start(t); bo.stop(t + 0.2);
    // Lead (her 2. step'te)
    if (i % 2 === 0) {
      const lo = ctx.createOscillator();
      const lg = ctx.createGain();
      lo.type = 'triangle';
      lo.frequency.value = lead[i % lead.length];
      lg.gain.setValueAtTime(0.6, t);
      lg.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      lo.connect(lg).connect(master);
      lo.start(t); lo.stop(t + 0.15);
    }
    i++;
  };

  const interval = setInterval(playStep, stepMs);
  return {
    stop: () => {
      stopped = true;
      clearInterval(interval);
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      setTimeout(() => master.disconnect(), 400);
    }
  };
}

// =========================================================
// RUN STATS — global tracker (cross-scene)
// =========================================================
const RunStats = {
  startTime: 0,
  bonusCollected: 0,
  deathCount: 0,
  termRetries: 0,
  reset() {
    this.startTime = Date.now();
    this.bonusCollected = 0;
    this.deathCount = 0;
    this.termRetries = 0;
  },
  elapsedMs() {
    return Date.now() - this.startTime;
  },
  formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
};

function saveBestTime(ms) {
  try {
    const k = bestKey();
    const prev = parseInt(localStorage.getItem(k) || '0', 10);
    if (!prev || ms < prev) {
      localStorage.setItem(k, ms.toString());
      return true; // yeni rekor
    }
  } catch (_) {}
  return false;
}
function getBestTime() {
  try {
    const v = parseInt(localStorage.getItem(bestKey()) || '0', 10);
    return v || null;
  } catch (_) { return null; }
}

// =========================================================
// CONFETTI VFX (win celebration)
// =========================================================
function spawnConfetti(scene, count = 60) {
  const colors = [0xFFE66D, 0x4ECDC4, 0xFF6B6B, 0xECF0F1, 0x4A90E2, 0x2ECC71];
  for (let i = 0; i < count; i++) {
    const x = Phaser.Math.Between(0, GAME_W);
    const y = -20;
    const size = Phaser.Math.Between(4, 10);
    const piece = scene.add.rectangle(x, y, size, size * 1.4, Phaser.Utils.Array.GetRandom(colors))
      .setDepth(1000)
      .setRotation(Math.random() * Math.PI);
    scene.tweens.add({
      targets: piece,
      y: GAME_H + 50,
      x: x + Phaser.Math.Between(-150, 150),
      rotation: piece.rotation + Phaser.Math.FloatBetween(-3, 3),
      duration: Phaser.Math.Between(2200, 3800),
      delay: Phaser.Math.Between(0, 1500),
      ease: 'Quad.in',
      onComplete: () => piece.destroy()
    });
  }
}

// =========================================================
// DEATH VFX — squash + particle burst
// =========================================================
function deathBurst(scene, x, y, color = COLORS.SPIKE) {
  for (let i = 0; i < 14; i++) {
    const angle = (Math.PI * 2 * i) / 14;
    const speed = Phaser.Math.Between(120, 220);
    const p = scene.add.circle(x, y, Phaser.Math.Between(2, 4), color)
      .setDepth(500);
    scene.tweens.add({
      targets: p,
      x: x + Math.cos(angle) * speed,
      y: y + Math.sin(angle) * speed - 30,
      alpha: 0,
      duration: 600,
      ease: 'Quad.out',
      onComplete: () => p.destroy()
    });
  }
}

// =========================================================
// SCENE: BOOT
// =========================================================

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    makeDesktopBackground(this);

    // Company branding above dialog
    this.add.text(GAME_W / 2, GAME_H / 2 - 200, t('lore.company'), {
      font: 'bold 18px system-ui',
      color: '#FFE66D',
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, GAME_H / 2 - 180, t('lore.tagline'), {
      font: 'italic 12px system-ui',
      color: '#aac'
    }).setOrigin(0.5);

    createDialog(this, {
      title: t('boot.title'),
      body: t('boot.body'),
      h: 280
    });

    // Contract version subtle
    this.add.text(GAME_W / 2, GAME_H / 2 + 50, t('lore.contractVersion'), {
      font: 'italic 10px system-ui',
      color: '#888'
    }).setOrigin(0.5);

    let starting = false;
    const start = () => {
      if (starting) return;
      starting = true;
      RunStats.reset();
      SFX.accept();
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Terms'));
    };

    makeButton(this, GAME_W / 2 - 90, GAME_H / 2 + 100, 140, 38, t('boot.start'), start);

    // En iyi rekor varsa göster
    const best = getBestTime();
    if (best) {
      this.add.text(GAME_W / 2, GAME_H / 2 + 170, `${t('boot.bestTime')}: ${RunStats.formatTime(best)}`, {
        font: 'italic 13px system-ui', color: '#FFE66D'
      }).setOrigin(0.5);
    }

    makeButton(this, GAME_W / 2 + 90, GAME_H / 2 + 100, 140, 38, t('boot.cancel'), () => {
      const warn = this.add.text(GAME_W / 2, GAME_H / 2 + 200, t('boot.cantCancel'), {
        font: 'italic 14px system-ui', color: HEX.WARN
      }).setOrigin(0.5);
      this.tweens.add({ targets: warn, alpha: 0, duration: 1800, delay: 600, onComplete: () => warn.destroy() });
    });

    // Dil toggle (sağ üst köşe) — TR / EN
    const langs = ['tr', 'en'];
    langs.forEach((lng, i) => {
      const x = GAME_W - 80 + i * 36;
      const y = 30;
      const isActive = LANG === lng;
      const bg = this.add.rectangle(x, y, 32, 22, isActive ? COLORS.BTN_HOVER : 0x0F1622, isActive ? 1 : 0.7)
        .setStrokeStyle(1, 0x4A90E2);
      this.add.text(x, y, lng.toUpperCase(), {
        font: 'bold 11px system-ui', color: isActive ? '#fff' : '#aac'
      }).setOrigin(0.5);
      bg.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        if (LANG !== lng) {
          setLang(lng);
          SFX.click();
          this.scene.restart();
        }
      });
    });

    // Mod toggle — sağ üst, TR/EN'in altında (masaüstü ikonlarıyla çakışmasın)
    const modes = [
      { key: 'normal', label: t('mode.normal'), color: COLORS.BTN_HOVER },
      { key: 'hardcore', label: t('mode.hardcore'), color: COLORS.SPIKE }
    ];
    const modeY = 64;
    const modeBaseX = GAME_W - 175;
    this.add.text(modeBaseX - 20, modeY, t('mode.label') + ':', {
      font: '10px system-ui', color: '#aac'
    }).setOrigin(1, 0.5);

    modes.forEach((m, i) => {
      const x = modeBaseX + i * 86;
      const isActive = MODE === m.key;
      const bg = this.add.rectangle(x, modeY, 80, 22, isActive ? m.color : 0x0F1622, isActive ? 1 : 0.7)
        .setStrokeStyle(1, m.color);
      this.add.text(x, modeY, m.label, {
        font: 'bold 10px system-ui', color: isActive ? '#fff' : '#aac'
      }).setOrigin(0.5);
      bg.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        if (MODE !== m.key) {
          setMode(m.key);
          SFX.click();
          this.scene.restart();
        }
      });
    });

    // Mod açıklama — toggle'ın altında, sağa hizalı
    const modeDesc = MODE === 'hardcore' ? t('mode.hardcoreDesc') : t('mode.normalDesc');
    this.add.text(GAME_W - 20, modeY + 20, modeDesc, {
      font: 'italic 10px system-ui',
      color: MODE === 'hardcore' ? '#FF6B6B' : '#aac'
    }).setOrigin(1, 0.5);
  }
}

// =========================================================
// SCENE: TERMS (12 madde orchestrator)
// =========================================================

class TermsScene extends Phaser.Scene {
  constructor() { super('Terms'); }

  create() {
    makeDesktopBackground(this);
    this.cameras.main.fadeIn(200, 0, 0, 0);

    this.currentTerm = 0;
    this.termSprites = [];
    this.termTimer = null;
    this.termInterval = null;

    // Term order — Normal: sıralı 1-12; Hardcore: pool'lardan rastgele 12 (toplam 20'den)
    if (MODE === 'hardcore') {
      // Pool 30 termden rastgele 12 (4 easy + 4 medium + 4 hard)
      const easy = Phaser.Utils.Array.Shuffle([1, 2, 3, 4, 13, 17, 24, 25, 30]).slice(0, 4);
      const med  = Phaser.Utils.Array.Shuffle([5, 6, 7, 8, 14, 16, 19, 21, 26, 28, 29]).slice(0, 4);
      const hard = Phaser.Utils.Array.Shuffle([9, 10, 11, 12, 15, 18, 20, 22, 23, 27]).slice(0, 4);
      this.termOrder = [...easy, ...med, ...hard];
    } else {
      this.termOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }

    // Progress badge
    this.add.rectangle(GAME_W - 90, 30, 150, 30, 0x0F1622, 0.85).setStrokeStyle(1, 0x4A90E2);
    this.progressText = this.add.text(GAME_W - 90, 30, '', {
      font: 'bold 13px system-ui', color: '#FFFFFF'
    }).setOrigin(0.5);

    // ESC pause — DOM-level (Phaser keyboard plugin flaky)
    this._escListener = (e) => {
      if (e.key === 'Escape' && !this.scene.isPaused()) {
        this.scene.pause();
        this.scene.launch('Pause', { from: 'Terms' });
      }
    };
    window.addEventListener('keydown', this._escListener);

    this.events.once('shutdown', this.cleanup, this);
    this.events.once('destroy', this.cleanup, this);

    this.loadTerm(0);
  }

  cleanup() {
    if (this._escListener) {
      window.removeEventListener('keydown', this._escListener);
      this._escListener = null;
    }
    if (this._term27Handler) {
      window.removeEventListener('keydown', this._term27Handler);
      this._term27Handler = null;
    }
    this.input.removeAllListeners('pointermove');
    this.clearTermArtifacts();
  }

  trackSprite(s) {
    this.termSprites.push(s);
    return s;
  }

  clearTermArtifacts() {
    this.termSprites.forEach(s => { try { if (s && s.destroy) s.destroy(); } catch (_) {} });
    this.termSprites = [];
    this.input.keyboard.removeAllListeners('keydown-ENTER');
    this.input.keyboard.removeAllListeners('keydown-BACKSPACE');
    for (let i = 0; i <= 9; i++) this.input.keyboard.removeAllListeners(`keydown-${i}`);
    if (this.termTimer) { this.termTimer.remove(); this.termTimer = null; }
    if (this.termInterval) { this.termInterval.remove(); this.termInterval = null; }
    if (this.rightKey) { this.rightKey.destroy(); this.rightKey = null; }
    this.escapeBtn = null;
    this.term10Btn = null;
    this.input.setDefaultCursor('default');
  }

  loadTerm(index) {
    this.clearTermArtifacts();
    this.currentTerm = index;
    if (index >= TOTAL_TERMS) {
      // Tüm 12 bitti → Action phase
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Action'));
      return;
    }
    this.progressText.setText(`${t('progress.term')} ${Math.min(index + 1, TOTAL_TERMS)}/${TOTAL_TERMS}`);
    const realTermNum = this.termOrder[index]; // 1..15
    const fnName = `setupTerm${realTermNum}`;
    if (typeof this[fnName] === 'function') {
      this[fnName]();
    } else {
      // unknown term — atla
      this.loadTerm(index + 1);
    }
  }

  nextTerm() {
    SFX.accept();
    this.cameras.main.fadeOut(180, 240, 240, 245);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.cameras.main.fadeIn(180, 240, 240, 245);
      // Random narrator message ~%30 ihtimalle
      if (Phaser.Math.Between(1, 100) <= 30) {
        const msgs = I18N[LANG]['lore.narratorMsgs'] || [];
        if (msgs.length > 0) {
          const msg = Phaser.Utils.Array.GetRandom(msgs);
          const narr = this.add.text(GAME_W / 2, 80, msg, {
            font: 'italic 12px system-ui',
            color: '#FFE66D',
            backgroundColor: '#0F1622',
            padding: { x: 10, y: 5 }
          }).setOrigin(0.5).setDepth(900).setAlpha(0);
          this.tweens.add({
            targets: narr, alpha: 1, duration: 200,
            onComplete: () => {
              this.tweens.add({
                targets: narr, alpha: 0, duration: 400, delay: 1800,
                onComplete: () => narr.destroy()
              });
            }
          });
        }
      }
      this.loadTerm(this.currentTerm + 1);
    });
  }

  flashError(msg) {
    SFX.reject();
    const flash = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xC70039, 0.25).setDepth(800);
    this.tweens.add({ targets: flash, alpha: 0, duration: 350, onComplete: () => flash.destroy() });
    if (msg) {
      const t = this.add.text(GAME_W / 2, 80, msg, {
        font: 'bold 16px system-ui', color: HEX.DANGER, backgroundColor: '#fff', padding: { x: 10, y: 6 }
      }).setOrigin(0.5).setDepth(801);
      this.tweens.add({ targets: t, alpha: 0, duration: 1400, delay: 400, onComplete: () => t.destroy() });
    }
  }

  // ============ TIER 1: EASY (1-4) ============

  // 1. STANDART
  setupTerm1() {
    createDialog(this, {
      title: t('shartname.label', { n: 1 }),
      body: t('term1.body'),
      h: 260
    }).forEach(d => this.trackSprite(d));
    const btn = makeButton(this, GAME_W / 2, GAME_H / 2 + 80, 180, 42, t('btn.agree'), () => this.nextTerm());
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);
  }

  // 2. KÖŞEDE
  setupTerm2() {
    createDialog(this, {
      title: t('shartname.label', { n: 2 }),
      body: t('term2.body'),
      h: 260
    }).forEach(d => this.trackSprite(d));

    const corners = [
      { x: 70, y: 80 }, { x: GAME_W - 70, y: 80 },
      { x: 70, y: GAME_H - 80 }, { x: GAME_W - 70, y: GAME_H - 80 }
    ];
    const pos = corners[Phaser.Math.Between(0, 3)];
    const btn = makeButton(this, pos.x, pos.y, 90, 24, t('btn.agreeLower'), () => this.nextTerm());
    btn.txt.setStyle({ font: '10px system-ui' });
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);
    // Hover'da büyür
    btn.bg.on('pointerover', () => {
      this.tweens.add({ targets: [btn.bg, btn.txt], scale: 1.6, duration: 150 });
    });
    btn.bg.on('pointerout', () => {
      this.tweens.add({ targets: [btn.bg, btn.txt], scale: 1, duration: 150 });
    });
  }

  // 3. SAHTE KARDEŞLER
  setupTerm3() {
    createDialog(this, {
      title: 'ŞARTNAME — Madde 3/12',
      body: 'Madde 3: Aşağıdaki dört buton aynı görünür.\nSADECE BİRİ gerçek "ONAYLIYORUM" butonudur.\nYanlış → ekran sıfırlanır.',
      h: 280
    }).forEach(d => this.trackSprite(d));

    const correct = Phaser.Math.Between(0, 3);
    [GAME_W / 2 - 270, GAME_W / 2 - 90, GAME_W / 2 + 90, GAME_W / 2 + 270].forEach((px, i) => {
      const btn = makeButton(this, px, GAME_H / 2 + 100, 140, 40, t('btn.agree'), () => {
        if (i === correct) this.nextTerm();
        else { this.flashError(t('term3.wrong')); this.time.delayedCall(400, () => this.loadTerm(this.currentTerm)); }
      });
      this.trackSprite(btn.bg); this.trackSprite(btn.txt);
    });
  }

  // 4. HAREKETLİ
  setupTerm4() {
    createDialog(this, {
      title: t('shartname.label', { n: 4 }),
      body: t('term4.body'),
      h: 260
    }).forEach(d => this.trackSprite(d));

    // Buton dialog'un ALTINDA hareket etsin (z-conflict önle)
    const laneY = GAME_H - 90;
    const btn = makeButton(this, -100, laneY, 160, 40, t('btn.agree'), () => this.nextTerm());
    btn.bg.setDepth(10); btn.txt.setDepth(11);
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);

    const tween = this.tweens.add({
      targets: [btn.bg, btn.txt],
      x: GAME_W + 100,
      duration: 3500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });
    this.trackSprite(tween);
  }

  // ============ TIER 2: MEDIUM (5-8) ============

  // 5. CAPTCHA YILDIZ
  setupTerm5() {
    this.captchaCount = Phaser.Math.Between(3, 9);
    this.captchaInput = '';

    createDialog(this, {
      title: t('shartname.label', { n: 5 }),
      body: t('term5.body'),
      h: 320
    }).forEach(d => this.trackSprite(d));

    const totalW = this.captchaCount * 32;
    const startX = GAME_W / 2 - totalW / 2 + 16;
    for (let i = 0; i < this.captchaCount; i++) {
      const star = this.add.text(startX + i * 32, GAME_H / 2 + 20, '★', {
        font: '30px system-ui', color: HEX.WARN
      }).setOrigin(0.5);
      this.trackSprite(star);
    }

    const inputBg = this.add.rectangle(GAME_W / 2, GAME_H / 2 + 80, 100, 34, COLORS.INPUT_BG)
      .setStrokeStyle(1, COLORS.DIALOG_BORDER);
    const inputText = this.add.text(GAME_W / 2, GAME_H / 2 + 80, '_', {
      font: 'bold 18px monospace', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(inputBg); this.trackSprite(inputText);

    const hint = this.add.text(GAME_W / 2, GAME_H / 2 + 112, t('term5.hint'), {
      font: '11px system-ui', color: HEX.TEXT_HINT
    }).setOrigin(0.5);
    this.trackSprite(hint);

    const pushDigit = (d) => {
      if (this.captchaInput.length < 2) {
        this.captchaInput += d.toString();
        inputText.setText(this.captchaInput);
        SFX.typing();
      }
    };
    const popDigit = () => {
      this.captchaInput = this.captchaInput.slice(0, -1);
      inputText.setText(this.captchaInput || '_');
    };
    const submit = () => {
      if (parseInt(this.captchaInput, 10) === this.captchaCount) this.nextTerm();
      else { this.flashError(t('term5.wrong')); this.time.delayedCall(400, () => this.loadTerm(this.currentTerm)); }
    };

    for (let d = 0; d <= 9; d++) {
      this.input.keyboard.on(`keydown-${d}`, () => pushDigit(d));
    }
    this.input.keyboard.on('keydown-BACKSPACE', popDigit);
    this.input.keyboard.on('keydown-ENTER', submit);

    // Touch keypad — mobile için on-screen 0-9 + ⌫ + GÖNDER
    if (IS_TOUCH) {
      const padBaseY = GAME_H - 220;
      const cellW = 50, cellH = 40, gap = 6;
      const startX = GAME_W / 2 - (5 * (cellW + gap)) / 2 + cellW / 2;
      const drawCell = (col, row, label, onTap, color = COLORS.BTN_NORMAL, textColor = HEX.TEXT) => {
        const x = startX + col * (cellW + gap);
        const y = padBaseY + row * (cellH + gap);
        const bg = this.add.rectangle(x, y, cellW, cellH, color)
          .setStrokeStyle(1, COLORS.DIALOG_BORDER).setDepth(150);
        const t = this.add.text(x, y, label, {
          font: 'bold 16px system-ui', color: textColor
        }).setOrigin(0.5).setDepth(151);
        bg.setInteractive({ useHandCursor: true })
          .on('pointerdown', () => { SFX.click(); onTap(); });
        this.trackSprite(bg); this.trackSprite(t);
      };
      // Row 0: 1-2-3-4-5
      for (let i = 0; i < 5; i++) drawCell(i, 0, (i + 1).toString(), () => pushDigit(i + 1));
      // Row 1: 6-7-8-9-0
      for (let i = 0; i < 5; i++) {
        const d = i === 4 ? 0 : i + 6;
        drawCell(i, 1, d.toString(), () => pushDigit(d));
      }
      // Row 2: ⌫ (col 0-1) + GÖNDER (col 2-4)
      const backX = startX + 0 * (cellW + gap) + (cellW + gap) / 2;
      const backY = padBaseY + 2 * (cellH + gap);
      const backBg = this.add.rectangle(backX, backY, cellW * 2 + gap, cellH, 0xC0C0C0)
        .setStrokeStyle(1, COLORS.DIALOG_BORDER).setDepth(150);
      const backTxt = this.add.text(backX, backY, t('btn.delete'), {
        font: 'bold 14px system-ui', color: HEX.TEXT
      }).setOrigin(0.5).setDepth(151);
      backBg.setInteractive({ useHandCursor: true }).on('pointerdown', () => { SFX.click(); popDigit(); });
      this.trackSprite(backBg); this.trackSprite(backTxt);

      const sendX = startX + 3 * (cellW + gap) + (cellW + gap) / 2;
      const sendBg = this.add.rectangle(sendX, backY, cellW * 3 + gap * 2, cellH, COLORS.ACCENT_OK, 0.85)
        .setStrokeStyle(1, COLORS.DIALOG_BORDER).setDepth(150);
      const sendTxt = this.add.text(sendX, backY, t('btn.send'), {
        font: 'bold 14px system-ui', color: '#fff'
      }).setOrigin(0.5).setDepth(151);
      sendBg.setInteractive({ useHandCursor: true }).on('pointerdown', () => { SFX.click(); submit(); });
      this.trackSprite(sendBg); this.trackSprite(sendTxt);
    }
  }

  // 6. SLIDER DİRENEN
  setupTerm6() {
    createDialog(this, {
      title: t('shartname.label', { n: 6 }),
      body: t('term6.body'),
      h: 280
    }).forEach(d => this.trackSprite(d));

    const sliderY = GAME_H / 2 + 70;
    const trackX = GAME_W / 2;
    const trackW = 360;
    const minX = trackX - trackW / 2;
    const maxX = trackX + trackW / 2;

    // Track
    const track = this.add.rectangle(trackX, sliderY, trackW, 6, 0xCCCCCC);
    this.trackSprite(track);

    // Knob
    let value = 0;
    const knob = this.add.circle(minX, sliderY, 14, COLORS.BTN_HOVER).setStrokeStyle(2, 0xFFFFFF);
    knob.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(knob);
    this.trackSprite(knob);

    const valueText = this.add.text(GAME_W / 2, sliderY - 30, `${t('term6.value')}: 0`, {
      font: 'bold 16px system-ui', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(valueText);

    // Drag affordance hint
    const hintTxt = this.add.text(GAME_W / 2, sliderY + 30, t('term6.dragHint'), {
      font: 'italic 12px system-ui', color: HEX.TEXT_HINT
    }).setOrigin(0.5);
    this.trackSprite(hintTxt);

    knob.on('drag', (pointer, dragX) => {
      const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
      knob.x = clampedX;
      value = Math.round(((clampedX - minX) / trackW) * 100);
      valueText.setText(`${t('term6.value')}: ${value}`);
      if (value >= 100) {
        this.nextTerm();
      }
    });

    // Direnme: her 200ms'de -2
    this.termInterval = this.time.addEvent({
      delay: 200, loop: true,
      callback: () => {
        if (value > 0 && value < 100) {
          value = Math.max(0, value - 2);
          knob.x = minX + (value / 100) * trackW;
          valueText.setText(`${t('term6.value')}: ${value}`);
        }
      }
    });
  }

  // 7. KAÇAN BUTON
  setupTerm7() {
    createDialog(this, {
      title: t('shartname.label', { n: 7 }),
      body: t('term7.body'),
      h: 260
    }).forEach(d => this.trackSprite(d));

    const btn = makeButton(this, GAME_W / 2, GAME_H / 2 + 110, 180, 42, t('btn.agree'), () => this.nextTerm());
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);
    this.escapeBtn = btn;
  }

  updateTerm7() {
    if (!this.escapeBtn) return;
    const ptr = this.input.activePointer;
    const dx = ptr.x - this.escapeBtn.bg.x;
    const dy = ptr.y - this.escapeBtn.bg.y;
    if (Math.sqrt(dx * dx + dy * dy) < 90) {
      const nx = Phaser.Math.Between(120, GAME_W - 120);
      const ny = Phaser.Math.Between(GAME_H / 2 - 30, GAME_H - 80);
      this.escapeBtn.setPosition(nx, ny);
    }
  }

  // 8. DRAG-DROP
  setupTerm8() {
    createDialog(this, {
      title: t('shartname.label', { n: 8 }),
      body: t('term8.body'),
      h: 240
    }).forEach(d => this.trackSprite(d));

    // Layout: dialog daha yukarda, kutular dialog ALTINDA aşağı bandda
    const lane = GAME_H - 110;

    // Yeşil hedef (sağ alt)
    const target = this.add.rectangle(GAME_W - 130, lane, 100, 70, COLORS.ACCENT_OK, 0.5)
      .setStrokeStyle(2, COLORS.ACCENT_OK);
    const targetLabel = this.add.text(GAME_W - 130, lane, t('term8.target'), {
      font: 'bold 12px system-ui', color: '#fff'
    }).setOrigin(0.5);
    this.trackSprite(target); this.trackSprite(targetLabel);

    // Kırmızı engel (ortada, dikey hareket — drag bandında)
    const blocker = this.add.rectangle(GAME_W / 2, lane, 70, 70, COLORS.SPIKE)
      .setStrokeStyle(2, 0xFFFFFF, 0.4);
    this.trackSprite(blocker);
    const blockerTween = this.tweens.add({
      targets: blocker,
      y: lane - 50,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });
    this.trackSprite(blockerTween);

    // Sürüklenebilir kutu (sol alt)
    const drag = this.add.rectangle(150, lane, 110, 56, COLORS.BTN_HOVER)
      .setStrokeStyle(2, 0xFFFFFF);
    const dragText = this.add.text(150, lane, t('term8.drag'), {
      font: 'bold 13px system-ui', color: '#fff'
    }).setOrigin(0.5);
    drag.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(drag);
    this.trackSprite(drag); this.trackSprite(dragText);

    drag.on('drag', (pointer, dragX, dragY) => {
      drag.x = dragX; drag.y = dragY;
      dragText.x = dragX; dragText.y = dragY;
      // Engel çarpışma
      if (Phaser.Geom.Intersects.RectangleToRectangle(drag.getBounds(), blocker.getBounds())) {
        this.flashError(t('term8.hit'));
        this.time.delayedCall(300, () => this.loadTerm(this.currentTerm));
      }
      // Hedef
      else if (Phaser.Geom.Intersects.RectangleToRectangle(drag.getBounds(), target.getBounds())) {
        this.nextTerm();
      }
    });
  }

  // ============ TIER 3: HARD (9-12) ============

  // 9. 47 SAYFA
  setupTerm9() {
    this.currentPage = 1;
    this.targetPage = 47;

    createDialog(this, {
      title: t('shartname.label', { n: 9 }),
      body: IS_TOUCH ? t('term9.bodyTouch') : t('term9.bodyKbd'),
      h: 280
    }).forEach(d => this.trackSprite(d));

    this.pageText = this.add.text(GAME_W / 2, GAME_H / 2 + 30, '', {
      font: 'bold 28px system-ui', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(this.pageText);
    this.pageText.setText(t('term9.page', { n: this.currentPage, total: this.targetPage }));

    const advance = (n) => {
      this.currentPage = Math.min(this.targetPage, this.currentPage + n);
      this.pageText.setText(t('term9.page', { n: this.currentPage, total: this.targetPage }));
      SFX.paper();
      if (this.currentPage >= this.targetPage) this.nextTerm();
    };

    const btn = makeButton(this, GAME_W / 2 - (IS_TOUCH ? 100 : 0), GAME_H / 2 + 95, 160, 40, t('btn.continue'), () => advance(1));
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);

    // Touch için ekstra "5x ATLA" butonu (klavye → tuşunun touch alternatifi)
    if (IS_TOUCH) {
      const fastBtn = makeButton(this, GAME_W / 2 + 100, GAME_H / 2 + 95, 160, 40, t('btn.skip5'), () => advance(5));
      fastBtn.bg.setFillStyle(COLORS.ACCENT_WARN, 0.85);
      fastBtn.txt.setColor('#fff');
      this.trackSprite(fastBtn.bg); this.trackSprite(fastBtn.txt);
    }

    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.skipFrameCounter = 0;
    this._term9advance = advance;
  }

  updateTerm9() {
    if (!this.rightKey || !this._term9advance) return;
    if (this.rightKey.isDown) {
      this.skipFrameCounter++;
      if (this.skipFrameCounter >= 3) {
        this.skipFrameCounter = 0;
        this._term9advance(1);
      }
    }
  }

  // 10. HIZLI TIKLA
  setupTerm10() {
    this.attemptCount = 0;
    this.visibleDuration = 800;
    this.term10Active = true;

    createDialog(this, {
      title: t('shartname.label', { n: 10 }),
      body: t('term10.body'),
      h: 240
    }).forEach(d => this.trackSprite(d));

    const btn = makeButton(this, GAME_W / 2, GAME_H / 2 + 100, 180, 42, t('btn.agree'), () => {
      if (btn.bg.visible) {
        this.term10Active = false;
        this.nextTerm();
      }
    });
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);
    this.term10Btn = btn;

    btn.bg.setVisible(false); btn.txt.setVisible(false);
    this.term10Cycle();
  }

  term10Cycle() {
    const realTerm = this.termOrder ? this.termOrder[this.currentTerm] : null;
    if (!this.term10Active || realTerm !== 10 || !this.term10Btn) return;
    this.term10Btn.bg.setVisible(true);
    this.term10Btn.txt.setVisible(true);
    this.termTimer = this.time.delayedCall(this.visibleDuration, () => {
      const rt = this.termOrder ? this.termOrder[this.currentTerm] : null;
      if (!this.term10Active || rt !== 10 || !this.term10Btn) return;
      this.term10Btn.bg.setVisible(false);
      this.term10Btn.txt.setVisible(false);
      this.termTimer = this.time.delayedCall(500, () => {
        const rt2 = this.termOrder ? this.termOrder[this.currentTerm] : null;
        if (!this.term10Active || rt2 !== 10) return;
        this.attemptCount++;
        if (this.attemptCount === 3) {
          this.visibleDuration = 1500;
          const hint = this.add.text(GAME_W / 2, GAME_H / 2 + 150, t('term10.slowHint'), {
            font: 'italic 12px system-ui', color: HEX.TEXT_HINT
          }).setOrigin(0.5);
          this.trackSprite(hint);
        }
        this.term10Cycle();
      });
    });
  }

  // 11. EMİN MİSİN ZİNCİRİ
  setupTerm11() {
    this.confirmStep = 0;
    this.confirmMessages = [
      t('term11.q1'), t('term11.q2'), t('term11.q3'), t('term11.q4'), t('term11.q5')
    ];
    this.renderConfirmStep();
  }

  renderConfirmStep() {
    this.termSprites.forEach(s => { try { if (s && s.destroy) s.destroy(); } catch (_) {} });
    this.termSprites = [];

    if (this.confirmStep >= this.confirmMessages.length) { this.nextTerm(); return; }

    createDialog(this, {
      title: t('term11.title', { n: this.confirmStep + 1 }),
      body: this.confirmMessages[this.confirmStep],
      h: 240
    }).forEach(d => this.trackSprite(d));

    // Son adımda butonlar yer değiştirir
    const isFinalSwap = this.confirmStep === 4;
    const yesX = isFinalSwap ? GAME_W / 2 + 80 : GAME_W / 2 - 80;
    const noX = isFinalSwap ? GAME_W / 2 - 80 : GAME_W / 2 + 80;

    const yesBtn = makeButton(this, yesX, GAME_H / 2 + 80, 130, 40, t('btn.yes'), () => {
      this.confirmStep++;
      this.renderConfirmStep();
    });
    this.trackSprite(yesBtn.bg); this.trackSprite(yesBtn.txt);

    const noBtn = makeButton(this, noX, GAME_H / 2 + 80, 130, 40, t('btn.no'), () => {
      this.flashError(t('term11.reset'));
      this.confirmStep = 0;
      this.time.delayedCall(400, () => this.renderConfirmStep());
    });
    this.trackSprite(noBtn.bg); this.trackSprite(noBtn.txt);
  }

  // 12. REVERSE MOUSE
  setupTerm12() {
    createDialog(this, {
      title: t('shartname.label', { n: 12 }),
      body: t('term12.body'),
      h: 280
    }).forEach(d => this.trackSprite(d));

    // Sahte cursor — başlangıçta ekran dışında, mouse'la senkron olunca görünsün
    const fakeCursor = this.add.circle(-100, -100, 7, 0x000000)
      .setStrokeStyle(2, 0xffffff).setDepth(900);
    this.trackSprite(fakeCursor);

    this.input.setDefaultCursor('none');

    // Buton sağ tarafta
    const btn = makeButton(this, GAME_W - 150, GAME_H / 2 + 100, 170, 40, t('btn.agree'), () => this.nextTerm());
    btn.bg.disableInteractive(); // varsayılan interaktiviteyi kapat — sahte cursor üzerinden tetikleyeceğiz
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);

    this._term12Btn = btn;
    this._term12Cursor = fakeCursor;
  }

  updateTerm12() {
    if (!this._term12Cursor || !this._term12Btn) return;
    const ptr = this.input.activePointer;
    // X ekseni ters: ekranın orta noktasına göre yansıt
    const flippedX = GAME_W - ptr.x;
    this._term12Cursor.x = flippedX;
    this._term12Cursor.y = ptr.y;

    // Sahte cursor butonun üzerindeyse ve tıklandıysa onayla
    if (ptr.isDown) {
      const b = this._term12Btn.bg.getBounds();
      if (flippedX >= b.x && flippedX <= b.x + b.width && ptr.y >= b.y && ptr.y <= b.y + b.height) {
        this._term12Btn = null;
        this._term12Cursor = null;
        this.nextTerm();
      }
    }
  }

  // ============ TERM 13: ÜÇLÜ ONAY ============
  setupTerm13() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term13.body'),
      h: 260
    }).forEach(d => this.trackSprite(d));

    this.tripleStep = 0; // 0 → 1 → 2 → next
    const positions = [GAME_W / 2 - 200, GAME_W / 2, GAME_W / 2 + 200];
    this._tripleBtns = positions.map((px, i) => {
      const btn = makeButton(this, px, GAME_H / 2 + 100, 130, 50, `${i + 1}`, () => {
        if (i === this.tripleStep) {
          // doğru sıra
          btn.bg.setFillStyle(COLORS.ACCENT_OK);
          btn.txt.setColor('#fff');
          btn.bg.disableInteractive();
          this.tripleStep++;
          if (this.tripleStep >= 3) {
            this.time.delayedCall(200, () => this.nextTerm());
          }
        } else {
          this.flashError(t('term13.wrong'));
          this.time.delayedCall(400, () => this.loadTerm(this.currentTerm));
        }
      });
      this.trackSprite(btn.bg); this.trackSprite(btn.txt);
      return btn;
    });
  }

  // ============ TERM 14: EN KOYU RENGİ SEÇ ============
  setupTerm14() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term14.body'),
      h: 240
    }).forEach(d => this.trackSprite(d));

    // 5 mavi tonu rastgele dağıtılmış
    const tones = [0x6FA8DC, 0x4A90E2, 0x2C5F8D, 0x1A3A5C, 0x3B5998];
    // En koyu = en küçük lightness değeri (subjective): 0x1A3A5C
    const darkest = 0x1A3A5C;
    // Karıştır
    const shuffled = Phaser.Utils.Array.Shuffle(tones.slice());
    const correctIdx = shuffled.indexOf(darkest);

    shuffled.forEach((color, i) => {
      const x = GAME_W / 2 - (5 - 1) * 50 + i * 100;
      const sw = this.add.rectangle(x, GAME_H / 2 + 100, 80, 80, color)
        .setStrokeStyle(2, 0xffffff, 0.5).setInteractive({ useHandCursor: true });
      sw.on('pointerdown', () => {
        SFX.click();
        if (i === correctIdx) this.nextTerm();
        else { this.flashError(t('term14.wrong')); this.time.delayedCall(400, () => this.loadTerm(this.currentTerm)); }
      });
      this.trackSprite(sw);
    });
  }

  // ============ TERM 15: MATH KİLİDİ ============
  setupTerm15() {
    // Rastgele basit ifade: a + b * c (operator precedence test)
    const a = Phaser.Math.Between(2, 9);
    const b = Phaser.Math.Between(2, 6);
    const c = Phaser.Math.Between(2, 5);
    const expr = `${a} + ${b} × ${c}`;
    const correct = a + b * c; // doğru cevap (precedence)

    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term15.body'),
      h: 320
    }).forEach(d => this.trackSprite(d));

    const exprText = this.add.text(GAME_W / 2, GAME_H / 2 + 20, expr + ' = ?', {
      font: 'bold 32px monospace', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(exprText);

    this.mathInput = '';
    const inputBg = this.add.rectangle(GAME_W / 2, GAME_H / 2 + 80, 120, 36, COLORS.INPUT_BG)
      .setStrokeStyle(1, COLORS.DIALOG_BORDER);
    const inputText = this.add.text(GAME_W / 2, GAME_H / 2 + 80, '_', {
      font: 'bold 20px monospace', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(inputBg); this.trackSprite(inputText);

    const push = (d) => {
      if (this.mathInput.length < 3) {
        this.mathInput += d.toString();
        inputText.setText(this.mathInput);
        SFX.typing();
      }
    };
    const pop = () => {
      this.mathInput = this.mathInput.slice(0, -1);
      inputText.setText(this.mathInput || '_');
    };
    const submit = () => {
      if (parseInt(this.mathInput, 10) === correct) this.nextTerm();
      else { this.flashError(t('term15.wrong')); this.time.delayedCall(400, () => this.loadTerm(this.currentTerm)); }
    };

    for (let d = 0; d <= 9; d++) {
      this.input.keyboard.on(`keydown-${d}`, () => push(d));
    }
    this.input.keyboard.on('keydown-BACKSPACE', pop);
    this.input.keyboard.on('keydown-ENTER', submit);

    if (IS_TOUCH) {
      // Mini keypad altta
      const padY = GAME_H - 180;
      const cellW = 50, cellH = 38, gap = 6;
      const startX = GAME_W / 2 - (5 * (cellW + gap)) / 2 + cellW / 2;
      const drawCell = (col, row, label, onTap, color = COLORS.BTN_NORMAL, txtColor = HEX.TEXT) => {
        const x = startX + col * (cellW + gap);
        const y = padY + row * (cellH + gap);
        const bg = this.add.rectangle(x, y, cellW, cellH, color)
          .setStrokeStyle(1, COLORS.DIALOG_BORDER).setDepth(150);
        const txt = this.add.text(x, y, label, {
          font: 'bold 15px system-ui', color: txtColor
        }).setOrigin(0.5).setDepth(151);
        bg.setInteractive({ useHandCursor: true }).on('pointerdown', () => { SFX.click(); onTap(); });
        this.trackSprite(bg); this.trackSprite(txt);
      };
      for (let i = 0; i < 5; i++) drawCell(i, 0, (i + 1).toString(), () => push(i + 1));
      for (let i = 0; i < 5; i++) {
        const d = i === 4 ? 0 : i + 6;
        drawCell(i, 1, d.toString(), () => push(d));
      }
      const bx = startX + 0.5 * (cellW + gap);
      const by = padY + 2 * (cellH + gap);
      const backBg = this.add.rectangle(bx, by, cellW * 2 + gap, cellH, 0xC0C0C0)
        .setStrokeStyle(1, COLORS.DIALOG_BORDER).setDepth(150);
      const backTxt = this.add.text(bx, by, t('btn.delete'), {
        font: 'bold 14px system-ui', color: HEX.TEXT
      }).setOrigin(0.5).setDepth(151);
      backBg.setInteractive({ useHandCursor: true }).on('pointerdown', () => { SFX.click(); pop(); });
      this.trackSprite(backBg); this.trackSprite(backTxt);

      const sx = startX + 3.5 * (cellW + gap);
      const sendBg = this.add.rectangle(sx, by, cellW * 3 + gap * 2, cellH, COLORS.ACCENT_OK, 0.85)
        .setStrokeStyle(1, COLORS.DIALOG_BORDER).setDepth(150);
      const sendTxt = this.add.text(sx, by, t('btn.send'), {
        font: 'bold 14px system-ui', color: '#fff'
      }).setOrigin(0.5).setDepth(151);
      sendBg.setInteractive({ useHandCursor: true }).on('pointerdown', () => { SFX.click(); submit(); });
      this.trackSprite(sendBg); this.trackSprite(sendTxt);
    }
  }

  // ============ TERM 16: TERSİNE SLIDER (100→0, kayar yukarı) ============
  setupTerm16() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term16.body'),
      h: 280
    }).forEach(d => this.trackSprite(d));

    const sliderY = GAME_H / 2 + 70;
    const trackX = GAME_W / 2;
    const trackW = 360;
    const minX = trackX - trackW / 2;
    const maxX = trackX + trackW / 2;
    const track = this.add.rectangle(trackX, sliderY, trackW, 6, 0xCCCCCC);
    this.trackSprite(track);

    let value = 100;
    const knob = this.add.circle(maxX, sliderY, 14, COLORS.SPIKE).setStrokeStyle(2, 0xFFFFFF);
    knob.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(knob);
    this.trackSprite(knob);

    const valueText = this.add.text(GAME_W / 2, sliderY - 30, `${t('term6.value')}: 100`, {
      font: 'bold 16px system-ui', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(valueText);

    knob.on('drag', (pointer, dragX) => {
      const cx = Phaser.Math.Clamp(dragX, minX, maxX);
      knob.x = cx;
      value = Math.round(((cx - minX) / trackW) * 100);
      valueText.setText(`${t('term6.value')}: ${value}`);
      if (value <= 0) this.nextTerm();
    });

    // Direnme: yukarı kayıyor (her 200ms +3)
    this.termInterval = this.time.addEvent({
      delay: 200, loop: true,
      callback: () => {
        if (value > 0 && value < 100) {
          value = Math.min(100, value + 3);
          knob.x = minX + (value / 100) * trackW;
          valueText.setText(`${t('term6.value')}: ${value}`);
        }
      }
    });
  }

  // ============ TERM 17: CLICK SAYMA (TAM N kez) ============
  setupTerm17() {
    const target = Phaser.Math.Between(5, 11);
    let count = 0;

    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term17.body', { n: target }),
      h: 260
    }).forEach(d => this.trackSprite(d));

    const counterText = this.add.text(GAME_W / 2, GAME_H / 2 + 30, `${t('term17.label')}: 0/${target}`, {
      font: 'bold 28px system-ui', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(counterText);

    const btn = makeButton(this, GAME_W / 2, GAME_H / 2 + 100, 200, 44, t('btn.agree'), () => {
      count++;
      counterText.setText(`${t('term17.label')}: ${count}/${target}`);
      if (count === target) {
        this.time.delayedCall(300, () => this.nextTerm());
      } else if (count > target) {
        this.flashError(t('term17.over'));
        this.time.delayedCall(400, () => this.loadTerm(this.currentTerm));
      }
    });
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);
  }

  // ============ TERM 18: LONG PRESS (3 sn basılı tut) ============
  setupTerm18() {
    const targetSec = 3;
    let holding = false;
    let progress = 0;

    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term18.body', { sec: targetSec }),
      h: 260
    }).forEach(d => this.trackSprite(d));

    // Progress bar
    const barY = GAME_H / 2 + 60;
    const barBg = this.add.rectangle(GAME_W / 2, barY, 320, 18, 0xCCCCCC).setStrokeStyle(1, COLORS.DIALOG_BORDER);
    const bar = this.add.rectangle(GAME_W / 2 - 160, barY, 0, 18, COLORS.ACCENT_OK).setOrigin(0, 0.5);
    this.trackSprite(barBg); this.trackSprite(bar);

    const hint = this.add.text(GAME_W / 2, GAME_H / 2 + 90, t('term18.holdHint'), {
      font: 'italic 12px system-ui', color: HEX.TEXT_HINT
    }).setOrigin(0.5);
    this.trackSprite(hint);

    const btnBg = this.add.rectangle(GAME_W / 2, GAME_H / 2 + 130, 200, 44, COLORS.BTN_NORMAL).setStrokeStyle(1, COLORS.DIALOG_BORDER);
    const btnTxt = this.add.text(GAME_W / 2, GAME_H / 2 + 130, t('btn.agree'), {
      font: 'bold 13px system-ui', color: HEX.TEXT
    }).setOrigin(0.5);
    btnBg.setInteractive({ useHandCursor: true });
    this.trackSprite(btnBg); this.trackSprite(btnTxt);

    btnBg.on('pointerdown', () => {
      holding = true;
      btnBg.setFillStyle(COLORS.BTN_HOVER);
      btnTxt.setColor(HEX.TEXT_LIGHT);
    });
    const releaseHandler = () => {
      if (holding && progress < targetSec * 1000) {
        // Reset
        holding = false;
        progress = 0;
        bar.width = 0;
        btnBg.setFillStyle(COLORS.BTN_NORMAL);
        btnTxt.setColor(HEX.TEXT);
      } else {
        holding = false;
      }
    };
    btnBg.on('pointerup', releaseHandler);
    btnBg.on('pointerout', releaseHandler);

    this.termInterval = this.time.addEvent({
      delay: 50, loop: true,
      callback: () => {
        if (holding) {
          progress = Math.min(targetSec * 1000, progress + 50);
          bar.width = (320 * progress) / (targetSec * 1000);
          if (progress >= targetSec * 1000) this.nextTerm();
        }
      }
    });
  }

  // ============ TERM 19: RENK DİZİSİ (Simon-tarzı) ============
  setupTerm19() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term19.body'),
      h: 260
    }).forEach(d => this.trackSprite(d));

    const colors = [
      { bg: 0xFF6B6B, lit: 0xFFAAAA },
      { bg: 0x4ECDC4, lit: 0x88EEE5 },
      { bg: 0xFFE66D, lit: 0xFFF6A8 },
      { bg: 0x4A90E2, lit: 0x88BFFF }
    ];
    const seq = [];
    for (let i = 0; i < 4; i++) seq.push(Phaser.Math.Between(0, 3));

    const buttons = [];
    const startX = GAME_W / 2 - 165;
    colors.forEach((c, i) => {
      const x = startX + i * 110;
      const y = GAME_H / 2 + 80;
      const sw = this.add.rectangle(x, y, 90, 50, c.bg).setStrokeStyle(2, 0xffffff, 0.6);
      buttons.push({ rect: sw, base: c.bg, lit: c.lit });
      this.trackSprite(sw);
    });

    const label = this.add.text(GAME_W / 2, GAME_H / 2 + 30, t('term19.watch'), {
      font: 'bold 15px system-ui', color: HEX.TEXT_HINT
    }).setOrigin(0.5);
    this.trackSprite(label);

    let inputIdx = 0;
    let listening = false;

    const flashOnce = (idx, delay) => {
      this.time.delayedCall(delay, () => {
        const b = buttons[idx];
        if (!b || !b.rect.scene) return;
        b.rect.setFillStyle(b.lit);
        SFX.click();
        this.time.delayedCall(300, () => {
          if (b.rect.scene) b.rect.setFillStyle(b.base);
        });
      });
    };

    // Show sequence
    seq.forEach((idx, i) => flashOnce(idx, 600 + i * 600));

    this.time.delayedCall(600 + seq.length * 600 + 200, () => {
      label.setText(t('term19.repeat'));
      label.setColor(HEX.OK);
      listening = true;
      buttons.forEach((b, i) => {
        b.rect.setInteractive({ useHandCursor: true });
        b.rect.on('pointerdown', () => {
          if (!listening) return;
          // visual feedback
          b.rect.setFillStyle(b.lit);
          SFX.click();
          this.time.delayedCall(150, () => { if (b.rect.scene) b.rect.setFillStyle(b.base); });
          if (seq[inputIdx] === i) {
            inputIdx++;
            if (inputIdx >= seq.length) {
              listening = false;
              this.nextTerm();
            }
          } else {
            listening = false;
            this.flashError(t('term19.wrong'));
            this.time.delayedCall(400, () => this.loadTerm(this.currentTerm));
          }
        });
      });
    });
  }

  // ============ TERM 20: SPINNER (yön tahmin) ============
  setupTerm20() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term20.body'),
      h: 260
    }).forEach(d => this.trackSprite(d));

    const dirs = ['↑', '→', '↓', '←'];
    const dirAngles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
    const targetIdx = Phaser.Math.Between(0, 3);

    this.add.text(GAME_W / 2, GAME_H / 2 + 20, `${t('term20.target')}: ${dirs[targetIdx]}`, {
      font: 'bold 22px system-ui', color: HEX.WARN
    }).setOrigin(0.5).setStroke('#000', 2);
    // not tracked separately because it's via add.text, scene cleanup handles it via children
    // but yes track
    const targetText = this.children.list[this.children.list.length - 1];
    this.trackSprite(targetText);

    // Dönen ok
    const arrow = this.add.text(GAME_W / 2, GAME_H / 2 + 80, '➤', {
      font: 'bold 50px system-ui', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(arrow);
    arrow.rotation = -Math.PI / 2;

    // Stop button
    const btn = makeButton(this, GAME_W / 2, GAME_H / 2 + 150, 160, 42, t('term20.stop'), () => {
      // Toleranslı yön check (±22.5°)
      const targetAngle = dirAngles[targetIdx];
      let diff = Math.abs(arrow.rotation - targetAngle);
      // Normalize to 0..PI
      while (diff > Math.PI) diff = Math.abs(diff - 2 * Math.PI);
      if (diff < Math.PI / 8) {
        this.nextTerm();
      } else {
        this.flashError(t('term19.wrong'));
        this.time.delayedCall(400, () => this.loadTerm(this.currentTerm));
      }
    });
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);

    this._term20Arrow = arrow;
  }

  updateTerm20() {
    if (this._term20Arrow && this._term20Arrow.scene) {
      this._term20Arrow.rotation += 0.06;
    }
  }

  // ============ TERM 21: STROOP RENK-YAZI ============
  setupTerm21() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term21.body'),
      h: 280
    }).forEach(d => this.trackSprite(d));

    const colorWords = [
      { tr: 'KIRMIZI', en: 'RED', hex: 0xC70039 },
      { tr: 'MAVİ', en: 'BLUE', hex: 0x4A90E2 },
      { tr: 'YEŞİL', en: 'GREEN', hex: 0x2ECC71 },
      { tr: 'SARI', en: 'YELLOW', hex: 0xFFE66D }
    ];
    // Yazı şu rengi söyler, görsel rengi başka
    const wordIdx = Phaser.Math.Between(0, 3);
    let visualIdx;
    do { visualIdx = Phaser.Math.Between(0, 3); } while (visualIdx === wordIdx);
    const word = colorWords[wordIdx];
    const visualColor = colorWords[visualIdx].hex;

    // Render: yazı = colorWords[wordIdx][LANG], renk = visualColor
    const display = LANG === 'tr' ? word.tr : word.en;
    const wordText = this.add.text(GAME_W / 2, GAME_H / 2 + 30, display, {
      font: 'bold 48px system-ui',
      color: '#' + visualColor.toString(16).padStart(6, '0'),
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);
    this.trackSprite(wordText);

    // 4 buton (renk swatch'ları)
    const startX = GAME_W / 2 - 165;
    colorWords.forEach((c, i) => {
      const x = startX + i * 110;
      const sw = this.add.rectangle(x, GAME_H / 2 + 110, 90, 50, c.hex)
        .setStrokeStyle(2, 0xffffff, 0.6).setInteractive({ useHandCursor: true });
      sw.on('pointerdown', () => {
        SFX.click();
        if (i === visualIdx) this.nextTerm();
        else { this.flashError(t('term21.wrong')); this.time.delayedCall(400, () => this.loadTerm(this.currentTerm)); }
      });
      this.trackSprite(sw);
    });
  }

  // ============ TERM 22: POP-UP BOMBASI ============
  setupTerm22() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term22.body'),
      h: 240
    }).forEach(d => this.trackSprite(d));

    let popupCount = 0;
    const totalFakes = 5;

    const spawnPopup = () => {
      const px = Phaser.Math.Between(150, GAME_W - 150);
      const py = Phaser.Math.Between(GAME_H / 2 + 60, GAME_H - 100);
      const items = createDialog(this, {
        x: px, y: py, w: 220, h: 100,
        title: '⚠',
        body: ''
      });
      const isReal = (popupCount === totalFakes);
      const btn = makeButton(this, px, py + 20, 110, 28, isReal ? t('btn.agree') : t('term22.fakeBtn'), () => {
        items.forEach(s => { try { s.destroy(); } catch (_) {} });
        try { btn.bg.destroy(); btn.txt.destroy(); } catch (_) {}
        if (isReal) this.nextTerm();
        else {
          popupCount++;
          spawnPopup();
        }
      });
      items.push(btn.bg, btn.txt);
      items.forEach(s => this.trackSprite(s));
    };

    spawnPopup();
  }

  // ============ TERM 23: MAZE (cursor duvar) ============
  setupTerm23() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term23.body'),
      h: 200
    }).forEach(d => this.trackSprite(d));

    // Bölge: dialog altında
    const zoneTop = GAME_H / 2 + 60;
    const zoneBot = GAME_H - 80;

    // Başlangıç noktası (sol)
    const startCircle = this.add.circle(80, (zoneTop + zoneBot) / 2, 14, COLORS.BTN_HOVER)
      .setStrokeStyle(2, 0xffffff);
    this.trackSprite(startCircle);

    // Hedef (sağ)
    const goal = this.add.rectangle(GAME_W - 80, (zoneTop + zoneBot) / 2, 50, 50, COLORS.ACCENT_OK, 0.5)
      .setStrokeStyle(2, COLORS.ACCENT_OK);
    this.trackSprite(goal);

    // Duvarlar (kırmızı dikdörtgenler)
    const walls = [
      { x: 250, y: zoneTop + 60, w: 20, h: 100 },
      { x: 400, y: zoneBot - 60, w: 20, h: 100 },
      { x: 550, y: zoneTop + 80, w: 20, h: 80 },
      { x: 700, y: zoneBot - 80, w: 20, h: 80 },
      { x: 850, y: zoneTop + 60, w: 20, h: 100 }
    ];
    const wallObjs = walls.map(w => {
      const r = this.add.rectangle(w.x, w.y, w.w, w.h, COLORS.SPIKE).setStrokeStyle(1, 0xffffff, 0.4);
      this.trackSprite(r);
      return r;
    });

    let started = false;
    let cleared = false;

    // Pointer hareketi
    this.input.on('pointermove', (pointer) => {
      if (cleared) return;
      // Başlangıç noktasına gel → başla
      if (!started) {
        const dx = pointer.x - startCircle.x;
        const dy = pointer.y - startCircle.y;
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
          started = true;
          startCircle.setFillStyle(COLORS.ACCENT_OK);
        }
        return;
      }
      // Duvar çarpışması
      for (const w of wallObjs) {
        if (Phaser.Geom.Rectangle.Contains(w.getBounds(), pointer.x, pointer.y)) {
          this.flashError(t('term23.wall'));
          this.time.delayedCall(300, () => this.loadTerm(this.currentTerm));
          cleared = true;
          return;
        }
      }
      // Hedef
      if (Phaser.Geom.Rectangle.Contains(goal.getBounds(), pointer.x, pointer.y)) {
        cleared = true;
        this.nextTerm();
      }
    });
  }

  // ============ TERM 24: ÇOKLU SEÇİM (yeşilleri tıkla) ============
  setupTerm24() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term24.body'),
      h: 240
    }).forEach(d => this.trackSprite(d));

    // 6 buton: 3 yeşil, 3 farklı renk
    const items = [
      { color: COLORS.ACCENT_OK, isCorrect: true },
      { color: COLORS.SPIKE, isCorrect: false },
      { color: COLORS.ACCENT_OK, isCorrect: true },
      { color: COLORS.ACCENT_WARN, isCorrect: false },
      { color: COLORS.ACCENT_OK, isCorrect: true },
      { color: COLORS.BTN_HOVER, isCorrect: false }
    ];
    Phaser.Utils.Array.Shuffle(items);

    let correctClicks = 0;
    const totalCorrect = 3;

    items.forEach((it, i) => {
      const x = GAME_W / 2 - 250 + (i % 3) * 250;
      const y = GAME_H / 2 + 70 + Math.floor(i / 3) * 70;
      const sw = this.add.rectangle(x, y, 200, 50, it.color)
        .setStrokeStyle(2, 0xffffff, 0.5).setInteractive({ useHandCursor: true });
      sw.on('pointerdown', () => {
        SFX.click();
        if (it.isCorrect) {
          sw.setStrokeStyle(3, 0xffffff, 1);
          sw.disableInteractive();
          correctClicks++;
          if (correctClicks === totalCorrect) this.nextTerm();
        } else {
          this.flashError(t('term24.wrong'));
          this.time.delayedCall(400, () => this.loadTerm(this.currentTerm));
        }
      });
      this.trackSprite(sw);
    });
  }

  // ============ TERM 25: 1-9 SIRAYLA ============
  setupTerm25() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term25.body'),
      h: 240
    }).forEach(d => this.trackSprite(d));

    // 9 buton karışık dağıtılmış
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    Phaser.Utils.Array.Shuffle(numbers);
    let expected = 1;

    numbers.forEach((n, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = GAME_W / 2 - 110 + col * 110;
      const y = GAME_H / 2 + 50 + row * 60;
      const btn = makeButton(this, x, y, 90, 50, n.toString(), () => {
        if (n === expected) {
          btn.bg.setFillStyle(COLORS.ACCENT_OK);
          btn.txt.setColor('#fff');
          btn.bg.disableInteractive();
          expected++;
          if (expected > 9) this.time.delayedCall(200, () => this.nextTerm());
        } else {
          this.flashError(t('term25.wrong'));
          this.time.delayedCall(400, () => this.loadTerm(this.currentTerm));
        }
      });
      this.trackSprite(btn.bg); this.trackSprite(btn.txt);
    });
  }

  // ============ TERM 26: ÇİFT SLIDER (eşitle) ============
  setupTerm26() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term26.body'),
      h: 200
    }).forEach(d => this.trackSprite(d));

    const trackW = 320;
    const minX = GAME_W / 2 - trackW / 2;
    const maxX = GAME_W / 2 + trackW / 2;

    const makeSlider = (y, startVal, color) => {
      const track = this.add.rectangle(GAME_W / 2, y, trackW, 6, 0xCCCCCC);
      this.trackSprite(track);
      const knob = this.add.circle(minX + (startVal / 100) * trackW, y, 12, color)
        .setStrokeStyle(2, 0xFFFFFF);
      knob.setInteractive({ draggable: true, useHandCursor: true });
      this.input.setDraggable(knob);
      this.trackSprite(knob);
      return { knob, getValue: () => Math.round(((knob.x - minX) / trackW) * 100) };
    };

    const a = makeSlider(GAME_H / 2 + 60, Phaser.Math.Between(15, 45), COLORS.BTN_HOVER);
    const b = makeSlider(GAME_H / 2 + 100, Phaser.Math.Between(60, 90), COLORS.ACCENT_WARN);

    const diffText = this.add.text(GAME_W / 2, GAME_H / 2 + 140, '', {
      font: 'bold 16px system-ui', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(diffText);

    const checkDiff = () => {
      const d = Math.abs(a.getValue() - b.getValue());
      diffText.setText(`${t('term26.diff')}: ${d}`);
      if (d <= 2) this.nextTerm();
    };
    a.knob.on('drag', (p, dx) => { a.knob.x = Phaser.Math.Clamp(dx, minX, maxX); checkDiff(); });
    b.knob.on('drag', (p, dx) => { b.knob.x = Phaser.Math.Clamp(dx, minX, maxX); checkDiff(); });
    checkDiff();
  }

  // ============ TERM 27: KELIME YAZ ============
  setupTerm27() {
    const wordsTr = ['ONAY', 'KABUL', 'SUSTUM', 'TAMAM', 'OLDU'];
    const wordsEn = ['YES', 'AGREE', 'SURE', 'OKAY', 'FINE'];
    const target = Phaser.Utils.Array.GetRandom(LANG === 'tr' ? wordsTr : wordsEn);

    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term27.body'),
      h: 280
    }).forEach(d => this.trackSprite(d));

    this.add.text(GAME_W / 2, GAME_H / 2 + 20, target, {
      font: 'bold 36px monospace', color: HEX.TEXT,
      backgroundColor: '#FFE66D', padding: { x: 12, y: 6 }
    }).setOrigin(0.5);
    const targetText = this.children.list[this.children.list.length - 1];
    this.trackSprite(targetText);

    let typed = '';
    const inputBg = this.add.rectangle(GAME_W / 2, GAME_H / 2 + 90, 220, 36, COLORS.INPUT_BG)
      .setStrokeStyle(1, COLORS.DIALOG_BORDER);
    const inputText = this.add.text(GAME_W / 2, GAME_H / 2 + 90, '_', {
      font: 'bold 22px monospace', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(inputBg); this.trackSprite(inputText);

    this._term27Handler = (e) => {
      if (e.key === 'Enter') {
        if (typed.toUpperCase() === target) this.nextTerm();
        else { this.flashError(t('term27.wrong')); this.time.delayedCall(400, () => this.loadTerm(this.currentTerm)); }
      } else if (e.key === 'Backspace') {
        typed = typed.slice(0, -1);
        inputText.setText(typed || '_');
      } else if (/^[a-zA-ZçğıöşüÇĞİÖŞÜ]$/.test(e.key) && typed.length < target.length + 2) {
        typed += e.key.toUpperCase();
        inputText.setText(typed);
        SFX.typing();
      }
    };
    window.addEventListener('keydown', this._term27Handler);
  }

  // ============ TERM 28: RİTİM (4 vuruş) ============
  setupTerm28() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term28.body'),
      h: 240
    }).forEach(d => this.trackSprite(d));

    // 4 nokta (her vuruş için bir)
    const dots = [];
    for (let i = 0; i < 4; i++) {
      const x = GAME_W / 2 - 90 + i * 60;
      const dot = this.add.circle(x, GAME_H / 2 + 40, 18, 0xCCCCCC).setStrokeStyle(2, 0xffffff, 0.6);
      this.trackSprite(dot);
      dots.push(dot);
    }

    // Beat: 600 ms aralıklı vuruş
    let beatIndex = 0;
    let lastBeatTime = 0;
    const BEAT_MS = 600;
    const TOL_MS = 200;

    // Otomatik metronom (görsel)
    let metroIdx = 0;
    this.termInterval = this.time.addEvent({
      delay: BEAT_MS, loop: true,
      callback: () => {
        // Pulse metronom dot
        const d = dots[metroIdx % 4];
        if (d && d.scene) {
          d.setFillStyle(COLORS.BTN_HOVER);
          this.tweens.add({ targets: d, scale: 1.4, duration: 100, yoyo: true,
            onComplete: () => { if (d.scene && metroIdx % 4 !== beatIndex) d.setFillStyle(0xCCCCCC); } });
        }
        metroIdx++;
      }
    });

    const btn = makeButton(this, GAME_W / 2, GAME_H / 2 + 110, 220, 50, '🥁 TIK', () => {
      const now = this.time.now;
      const expectedTime = lastBeatTime + BEAT_MS * (beatIndex);
      // İlk vuruş her zaman OK
      if (beatIndex === 0) {
        lastBeatTime = now;
        dots[beatIndex].setFillStyle(COLORS.ACCENT_OK);
        beatIndex++;
        return;
      }
      const dt = now - lastBeatTime;
      if (Math.abs(dt - BEAT_MS) <= TOL_MS) {
        lastBeatTime = now;
        dots[beatIndex].setFillStyle(COLORS.ACCENT_OK);
        beatIndex++;
        if (beatIndex >= 4) this.time.delayedCall(200, () => this.nextTerm());
      } else {
        this.flashError(dt < BEAT_MS - TOL_MS ? t('term28.tooFast') : t('term28.tooSlow'));
        this.time.delayedCall(400, () => this.loadTerm(this.currentTerm));
      }
    });
    this.trackSprite(btn.bg); this.trackSprite(btn.txt);
  }

  // ============ TERM 29: HOVER 5 NOKTA ============
  setupTerm29() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term29.body'),
      h: 200
    }).forEach(d => this.trackSprite(d));

    let passed = 0;
    const total = 5;
    const counterText = this.add.text(GAME_W / 2, GAME_H / 2 + 30, `${t('term29.label')}: 0/${total}`, {
      font: 'bold 18px system-ui', color: HEX.TEXT
    }).setOrigin(0.5);
    this.trackSprite(counterText);

    // 5 nokta rastgele yerlerde
    const dots = [];
    for (let i = 0; i < total; i++) {
      const x = Phaser.Math.Between(120, GAME_W - 120);
      const y = Phaser.Math.Between(GAME_H / 2 + 80, GAME_H - 80);
      const c = this.add.circle(x, y, 16, COLORS.BTN_HOVER).setStrokeStyle(2, 0xffffff);
      c.passed = false;
      this.trackSprite(c);
      dots.push(c);
    }

    this.input.on('pointermove', (pointer) => {
      dots.forEach(d => {
        if (d.passed) return;
        const dx = pointer.x - d.x;
        const dy = pointer.y - d.y;
        if (Math.sqrt(dx * dx + dy * dy) < 18) {
          d.passed = true;
          d.setFillStyle(COLORS.ACCENT_OK);
          SFX.click();
          passed++;
          counterText.setText(`${t('term29.label')}: ${passed}/${total}`);
          if (passed >= total) this.time.delayedCall(300, () => this.nextTerm());
        }
      });
    });
  }

  // ============ TERM 30: FARKLI YILDIZ ============
  setupTerm30() {
    createDialog(this, {
      title: t('shartname.label', { n: this.currentTerm + 1 }),
      body: t('term30.body'),
      h: 200
    }).forEach(d => this.trackSprite(d));

    // 3x3 ızgara, 8 yıldız aynı + 1 farklı (renk, boyut, veya rotasyon)
    const oddIdx = Phaser.Math.Between(0, 8);
    for (let i = 0; i < 9; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = GAME_W / 2 - 100 + col * 100;
      const y = GAME_H / 2 + 30 + row * 70;
      const isOdd = (i === oddIdx);
      const star = this.add.text(x, y, '★', {
        font: (isOdd ? '32' : '36') + 'px system-ui',
        color: isOdd ? '#FFD700' : '#FFE66D'
      }).setOrigin(0.5);
      if (isOdd) star.rotation = 0.3;
      star.setInteractive({ useHandCursor: true });
      star.on('pointerdown', () => {
        SFX.click();
        if (isOdd) this.nextTerm();
        else { this.flashError(t('term30.wrong')); this.time.delayedCall(400, () => this.loadTerm(this.currentTerm)); }
      });
      this.trackSprite(star);
    }
  }

  update() {
    const realTerm = this.termOrder ? this.termOrder[this.currentTerm] : (this.currentTerm + 1);
    if (realTerm === 7) this.updateTerm7();
    else if (realTerm === 9) this.updateTerm9();
    else if (realTerm === 12) this.updateTerm12();
    else if (realTerm === 20) this.updateTerm20();
  }
}

// =========================================================
// SCENE: ACTION (side-scroller)
// =========================================================

class ActionScene extends Phaser.Scene {
  constructor() { super('Action'); }

  init(data) {
    const defaultLives = MODE === 'hardcore' ? 1 : STARTING_LIVES;
    this.lives = (data && data.lives !== undefined) ? data.lives : defaultLives;
    this.maxLives = MODE === 'hardcore' ? 1 : STARTING_LIVES;
  }

  create() {
    const WORLD_W = 3500;
    const groundY = GAME_H - 40;

    // Background
    this.add.rectangle(WORLD_W / 2, GAME_H / 2, WORLD_W, GAME_H, COLORS.ACTION_BG);
    // Decorative stars
    for (let i = 0; i < 140; i++) {
      const x = Phaser.Math.Between(0, WORLD_W);
      const y = Phaser.Math.Between(0, GAME_H - 100);
      this.add.circle(x, y, Phaser.Math.FloatBetween(0.5, 1.6), 0xffffff, Phaser.Math.FloatBetween(0.18, 0.85));
    }

    this.cameras.main.fadeIn(300, 0, 0, 0);

    // ========== Sprite üretim ==========
    let g = this.add.graphics();
    g.fillStyle(COLORS.PLAYER, 1);
    g.fillRoundedRect(0, 0, 28, 36, 4);
    g.fillStyle(0x000000, 1);
    g.fillCircle(20, 12, 2);
    g.generateTexture('player', 28, 36);
    g.destroy();

    g = this.add.graphics();
    g.fillStyle(COLORS.SPIKE, 1);
    g.fillTriangle(0, 30, 30, 30, 15, 0);
    g.generateTexture('spike', 30, 30);
    g.destroy();

    g = this.add.graphics();
    g.fillStyle(0x6b6b6b, 1);
    g.fillRect(0, 0, 4, 60);
    g.fillStyle(COLORS.FLAG, 1);
    g.fillTriangle(4, 5, 30, 15, 4, 25);
    g.generateTexture('flag', 30, 60);
    g.destroy();

    // Checkpoint flag (mavi)
    g = this.add.graphics();
    g.fillStyle(0x6b6b6b, 1);
    g.fillRect(0, 0, 4, 60);
    g.fillStyle(0x4A90E2, 1);
    g.fillTriangle(4, 5, 30, 15, 4, 25);
    g.generateTexture('checkflag', 30, 60);
    g.destroy();

    // Bonus star (sarı) — collectible
    g = this.add.graphics();
    g.fillStyle(COLORS.FLAG, 1);
    const cx = 12, cy = 12, outer = 11, inner = 5;
    const pts = [];
    for (let k = 0; k < 10; k++) {
      const r = k % 2 === 0 ? outer : inner;
      const a = (k * Math.PI) / 5 - Math.PI / 2;
      pts.push(new Phaser.Geom.Point(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
    g.fillPoints(pts, true);
    g.generateTexture('bonusStar', 24, 24);
    g.destroy();

    g = this.add.graphics();
    g.fillStyle(COLORS.PLATFORM, 1);
    g.fillRect(0, 0, 100, 20);
    g.generateTexture('platBlock', 100, 20);
    g.destroy();

    // ========== Level layout — 3 segment ==========
    this.platforms = this.physics.add.staticGroup();

    // Floor (3500px boyunca, gap'lerle)
    const gaps = [
      [550, 700],    // segment 1 sonu
      [1280, 1430],  // segment 2 sonu — büyük gap
      [2200, 2330],  // segment 3 ortası
      [2900, 3000]   // segment 3 sonu
    ];
    for (let x = 50; x < WORLD_W; x += 100) {
      const inGap = gaps.some(([a, b]) => x >= a - 50 && x <= b);
      if (!inGap) this.platforms.create(x, groundY, 'platBlock');
    }

    // Aerial platforms — cumulative challenge
    // Segment 1 (kolay)
    this.platforms.create(620, groundY - 130, 'platBlock');
    // Segment 2 (orta) — gap üzerinde
    this.platforms.create(1350, groundY - 100, 'platBlock');
    this.platforms.create(1700, groundY - 160, 'platBlock');
    this.platforms.create(1950, groundY - 100, 'platBlock');
    // Segment 3 (zor) — multi-tier
    this.platforms.create(2270, groundY - 130, 'platBlock');
    this.platforms.create(2500, groundY - 200, 'platBlock');
    this.platforms.create(2750, groundY - 130, 'platBlock');
    this.platforms.create(2960, groundY - 180, 'platBlock');
    this.platforms.create(3200, groundY - 110, 'platBlock');

    // Player
    this.player = this.physics.add.sprite(80, groundY - 100, 'player');
    this.player.setCollideWorldBounds(false);
    this.player.setBounce(0.05);
    this.physics.add.collider(this.player, this.platforms);

    // ========== Spikes — segment-bazlı zorluk ==========
    this.spikes = this.physics.add.staticGroup();
    const spikePositions = [
      // Seg 1 — tek spike'lar
      { x: 350, y: groundY - 15 },
      { x: 480, y: groundY - 15 },
      // Seg 2 — çift spike, daha çok
      { x: 850, y: groundY - 15 },
      { x: 880, y: groundY - 15 },
      { x: 1080, y: groundY - 15 },
      { x: 1180, y: groundY - 15 },
      { x: 1210, y: groundY - 15 },
      // Seg 3 — yoğun
      { x: 1500, y: groundY - 15 },
      { x: 1830, y: groundY - 15 },
      { x: 1860, y: groundY - 15 },
      { x: 1890, y: groundY - 15 },
      { x: 2080, y: groundY - 15 },
      { x: 2400, y: groundY - 15 },
      { x: 2670, y: groundY - 15 },
      { x: 2700, y: groundY - 15 },
      { x: 3100, y: groundY - 15 },
      { x: 3130, y: groundY - 15 }
    ];
    spikePositions.forEach(({ x, y }) => {
      const sp = this.spikes.create(x, y, 'spike');
      sp.body.setSize(24, 22).setOffset(3, 8);
    });
    this.physics.add.overlap(this.player, this.spikes, () => this.die(), null, this);

    // ========== Bonus collectibles (sarı yıldız → +1 can max 5) ==========
    this.bonuses = this.physics.add.staticGroup();
    [[750, groundY - 180], [1700, groundY - 200], [2500, groundY - 250], [3000, groundY - 220]]
      .forEach(([x, y]) => {
        const b = this.bonuses.create(x, y, 'bonusStar');
        this.tweens.add({
          targets: b,
          y: y - 8,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.inOut'
        });
      });
    this.physics.add.overlap(this.player, this.bonuses, (_, b) => this.collectBonus(b), null, this);

    // ========== Checkpoint (mavi flag, segment 2 sonu) ==========
    // HARDCORE modda checkpoint disabled
    if (MODE !== 'hardcore') {
      this.checkpoint = this.physics.add.staticSprite(2150, groundY - 30, 'checkflag');
      this.checkpoint.activated = false;
      this.physics.add.overlap(this.player, this.checkpoint, () => this.activateCheckpoint(), null, this);
    }

    // ========== Bitiş bayrağı ==========
    this.flag = this.physics.add.staticSprite(3380, groundY - 30, 'flag');
    this.physics.add.overlap(this.player, this.flag, () => this.win(), null, this);

    // ========== World bounds ==========
    this.physics.world.setBounds(0, 0, WORLD_W, GAME_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, GAME_H);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // ========== HUD ==========
    this.livesText = this.add.text(20, 16, '', {
      font: 'bold 22px system-ui', color: '#fff', stroke: '#000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);
    this.updateHUD();

    this.distText = this.add.text(GAME_W / 2, 16, '', {
      font: 'bold 14px system-ui', color: '#aaa'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

    this.add.text(GAME_W - 20, 16, t('action.label'), {
      font: 'bold 16px system-ui', color: '#FFE66D'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // ========== Input ==========
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Touch state
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJump = false;

    // Touch on-screen buttons (only on touch devices)
    if (IS_TOUCH) {
      const makeTouchBtn = (x, y, label, color = 0xffffff, alpha = 0.25) => {
        const c = this.add.circle(x, y, 42, color, alpha)
          .setStrokeStyle(2, 0xffffff, 0.7)
          .setScrollFactor(0).setDepth(200)
          .setInteractive();
        const t = this.add.text(x, y, label, {
          font: 'bold 22px system-ui', color: '#fff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        return { circle: c, text: t };
      };

      const left = makeTouchBtn(70, GAME_H - 70, '◀');
      const right = makeTouchBtn(180, GAME_H - 70, '▶');
      const jump = makeTouchBtn(GAME_W - 80, GAME_H - 70, '▲', 0xFFE66D, 0.35);

      const bindHold = (btn, setter) => {
        btn.circle.on('pointerdown', () => { this[setter] = true; btn.circle.setFillStyle(0x4A90E2, 0.55); });
        btn.circle.on('pointerup',   () => { this[setter] = false; btn.circle.setFillStyle(0xffffff, 0.25); });
        btn.circle.on('pointerout',  () => { this[setter] = false; btn.circle.setFillStyle(0xffffff, 0.25); });
      };
      bindHold(left, 'touchLeft');
      bindHold(right, 'touchRight');

      jump.circle.on('pointerdown', () => {
        this.touchJump = true;
        jump.circle.setFillStyle(0x4A90E2, 0.55);
      });
      jump.circle.on('pointerup',   () => { jump.circle.setFillStyle(0xFFE66D, 0.35); });
      jump.circle.on('pointerout',  () => { jump.circle.setFillStyle(0xFFE66D, 0.35); });
    }

    this._escListener = (e) => {
      if (e.key === 'Escape' && !this.scene.isPaused()) {
        if (this.bgm) { this.bgm.stop(); this.bgm = null; }
        this.scene.pause();
        this.scene.launch('Pause', { from: 'Action' });
      }
    };
    window.addEventListener('keydown', this._escListener);

    // BGM start (resume desteği için)
    this.bgm = startBGM();
    this.events.on('resume', () => { if (!this.bgm && !this.gameOver) this.bgm = startBGM(); });

    this.events.once('shutdown', () => {
      if (this._escListener) {
        window.removeEventListener('keydown', this._escListener);
        this._escListener = null;
      }
      if (this.bgm) { this.bgm.stop(); this.bgm = null; }
    });

    // Spawn point
    this.spawnX = 80;
    this.spawnY = groundY - 100;
    this.worldW = WORLD_W;

    this.gameOver = false;
  }

  collectBonus(b) {
    const bx = b.x, by = b.y;
    b.destroy();
    SFX.accept();
    RunStats.bonusCollected++;
    const max = this.maxLives || STARTING_LIVES;
    const labelText = (this.lives < max) ? t('action.lifeBonus') : '⭐';
    if (this.lives < max) {
      this.lives++;
      this.updateHUD();
    }
    const popup = this.add.text(bx, by - 20, labelText, {
      font: 'bold 18px system-ui', color: '#2ECC71', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);
    this.tweens.add({
      targets: popup,
      y: by - 60,
      alpha: 0,
      duration: 700,
      onComplete: () => popup.destroy()
    });
    // Mini sparkle
    for (let i = 0; i < 6; i++) {
      const sp = this.add.circle(bx, by, 2, COLORS.FLAG);
      this.tweens.add({
        targets: sp,
        x: bx + Phaser.Math.Between(-30, 30),
        y: by + Phaser.Math.Between(-30, 30),
        alpha: 0,
        duration: 400,
        onComplete: () => sp.destroy()
      });
    }
  }

  activateCheckpoint() {
    if (this.checkpoint.activated) return;
    this.checkpoint.activated = true;
    this.spawnX = this.checkpoint.x;
    this.spawnY = this.checkpoint.y - 50;
    SFX.accept();
    // Visual feedback
    const popup = this.add.text(this.checkpoint.x, this.checkpoint.y - 80, t('action.checkpoint'), {
      font: 'bold 14px system-ui', color: '#4A90E2', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);
    this.tweens.add({
      targets: popup,
      y: this.checkpoint.y - 120,
      alpha: 0,
      duration: 1500,
      onComplete: () => popup.destroy()
    });
    this.tweens.add({
      targets: this.checkpoint,
      scale: 1.3,
      duration: 200,
      yoyo: true
    });
  }

  updateHUD() {
    const max = this.maxLives || STARTING_LIVES;
    this.livesText.setText(t('action.lives') + ': ' + '♥'.repeat(this.lives) + '♡'.repeat(Math.max(0, max - this.lives)));
  }

  die() {
    if (this.gameOver) return;
    SFX.death();
    RunStats.deathCount++;

    // Death VFX — burst at player position
    deathBurst(this, this.player.x, this.player.y, COLORS.SPIKE);

    // Player squash anim before respawn
    const px = this.player.x, py = this.player.y;
    this.player.setVelocity(0, 0);
    this.player.body.enable = false;
    this.player.setVisible(false);

    this.lives--;
    this.updateHUD();

    if (this.lives <= 0) {
      this.gameOver = true;
      if (this.bgm) { this.bgm.stop(); this.bgm = null; }
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameOver', { won: false }));
      return;
    }

    this.cameras.main.shake(220, 0.012);

    // 400ms sonra respawn
    this.time.delayedCall(450, () => {
      if (this.gameOver) return;
      this.player.setPosition(this.spawnX, this.spawnY);
      this.player.setVelocity(0, 0);
      this.player.body.enable = true;
      this.player.setVisible(true);
      this.player.setAlpha(0);
      // Re-appear flicker
      this.tweens.add({
        targets: this.player, alpha: 1, duration: 80, repeat: 3, yoyo: true,
        onComplete: () => this.player.setAlpha(1)
      });
    });
  }

  win() {
    if (this.gameOver) return;
    this.gameOver = true;
    if (this.bgm) { this.bgm.stop(); this.bgm = null; }
    SFX.win();
    this.cameras.main.fadeOut(500, 255, 230, 100);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameOver', { won: true }));
  }

  update() {
    if (this.gameOver) return;
    const onGround = this.player.body.touching.down || this.player.body.blocked.down;

    let vx = 0;
    if (this.cursors.left.isDown || this.touchLeft) vx -= 220;
    if (this.cursors.right.isDown || this.touchRight) vx += 220;
    this.player.setVelocityX(vx);

    if ((this.cursors.up.isDown || this.spaceKey.isDown || this.touchJump) && onGround) {
      this.player.setVelocityY(-460);
      SFX.jump();
    }
    // Touch jump: tap-to-jump (consume after one frame so hold doesn't repeat-jump)
    this.touchJump = false;

    // Düşme kontrolü
    if (this.player.y > GAME_H + 50) this.die();

    // Mesafe HUD
    if (this.distText) {
      const pct = Math.min(100, Math.round((this.player.x / this.worldW) * 100));
      this.distText.setText(`${t('action.progress')}: ${pct}%`);
    }
  }
}

// =========================================================
// SCENE: PAUSE
// =========================================================

class PauseScene extends Phaser.Scene {
  constructor() { super('Pause'); }
  init(data) { this.from = (data && data.from) || 'Terms'; }

  create() {
    const w = this.scale.width, h = this.scale.height;
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7).setInteractive();
    this.add.text(w / 2, h / 2 - 30, t('pause.title'), {
      font: 'bold 36px system-ui', color: '#FFFFFF'
    }).setOrigin(0.5);
    this.add.text(w / 2, h / 2 + 20, t('pause.hint'), {
      font: '18px system-ui', color: '#aaaaaa'
    }).setOrigin(0.5);

    this._escListener = (e) => {
      if (e.key === 'Escape') {
        window.removeEventListener('keydown', this._escListener);
        this.scene.stop();
        this.scene.resume(this.from);
      } else if (e.key === 'r' || e.key === 'R') {
        window.removeEventListener('keydown', this._escListener);
        this.scene.stop(this.from);
        this.scene.stop();
        this.scene.start('Boot');
      }
    };
    window.addEventListener('keydown', this._escListener);

    this.events.once('shutdown', () => {
      if (this._escListener) {
        window.removeEventListener('keydown', this._escListener);
        this._escListener = null;
      }
    });
  }
}

// =========================================================
// SCENE: GAME OVER
// =========================================================

class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }
  init(data) { this.won = !!(data && data.won); }

  create() {
    makeDesktopBackground(this);
    this.cameras.main.fadeIn(300, 0, 0, 0);

    const w = this.scale.width, h = this.scale.height;
    const elapsed = RunStats.elapsedMs();
    const isNewBest = this.won ? saveBestTime(elapsed) : false;
    const best = getBestTime();

    // Başlık
    this.add.text(w / 2, h / 2 - 130, this.won ? t('gameover.win') : t('gameover.lose'), {
      font: 'bold 48px system-ui',
      color: this.won ? '#FFE66D' : '#FF6B6B',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    // Mod rozeti (hardcore başardıysa altın)
    const modeLabel = MODE === 'hardcore' ? t('gameover.modeHardcore') : t('gameover.modeNormal');
    this.add.text(w / 2, h / 2 - 95, modeLabel, {
      font: 'bold 12px system-ui',
      color: MODE === 'hardcore' ? '#FF6B6B' : '#aac',
      backgroundColor: '#0F1622',
      padding: { x: 8, y: 3 }
    }).setOrigin(0.5);

    // Tagline
    this.add.text(w / 2, h / 2 - 70, this.won ? t('gameover.winSub') : t('gameover.loseSub'), {
      font: '17px system-ui', color: '#ECF0F1', align: 'center'
    }).setOrigin(0.5);

    // İstatistik kutusu
    const statBox = this.add.rectangle(w / 2, h / 2 + 10, 460, 130, 0x000000, 0.45)
      .setStrokeStyle(1, 0x4A90E2);

    const stats = [
      { k: t('gameover.time'), v: RunStats.formatTime(elapsed) + (isNewBest ? '   ' + t('gameover.newRecord') : ''), highlight: isNewBest },
      { k: t('gameover.deaths'), v: RunStats.deathCount.toString() },
      { k: t('gameover.bonus'), v: `${RunStats.bonusCollected}/4` },
      best ? { k: t('gameover.bestRecord'), v: RunStats.formatTime(best) } : null
    ].filter(Boolean);

    stats.forEach((row, i) => {
      const y = h / 2 - 30 + i * 25;
      this.add.text(w / 2 - 200, y, row.k, {
        font: '15px system-ui', color: '#aac'
      }).setOrigin(0, 0.5);
      this.add.text(w / 2 + 200, y, row.v, {
        font: 'bold 15px system-ui',
        color: row.highlight ? '#FFE66D' : '#ECF0F1'
      }).setOrigin(1, 0.5);
    });

    // Restart prompt
    const restart = this.add.text(w / 2, h / 2 + 130, t('gameover.restart'), {
      font: 'bold 22px system-ui', color: '#4ECDC4'
    }).setOrigin(0.5);
    this.tweens.add({ targets: restart, alpha: 0.4, duration: 800, yoyo: true, repeat: -1 });

    // Win celebration: confetti
    if (this.won) spawnConfetti(this, 80);

    // Şirket imzası — alt kısım
    this.add.text(w / 2, h - 60, t('lore.companySig'), {
      font: 'italic 11px system-ui', color: '#888'
    }).setOrigin(0.5);
    this.add.text(w / 2, h - 45, t('lore.company'), {
      font: 'bold 11px system-ui', color: '#FFE66D'
    }).setOrigin(0.5);

    this._handler = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        window.removeEventListener('keydown', this._handler);
        this.scene.start('Boot');
      }
    };
    window.addEventListener('keydown', this._handler);

    this.events.once('shutdown', () => {
      if (this._handler) {
        window.removeEventListener('keydown', this._handler);
        this._handler = null;
      }
    });
  }
}

// =========================================================
// CONFIG
// =========================================================

const config = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'game',
  backgroundColor: '#0F1622',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1100 }, debug: false }
  },
  scene: [BootScene, TermsScene, ActionScene, PauseScene, GameOverScene]
};

// ZORUNLU: window.__game expose — qa-functional puppeteer testleri için
window.__game = new Phaser.Game(config);
