export const HSK2_WORDS = [

  // ─── Hobbies / Activities ────────────────────────────────────────────────────

  // Level 1 — both components are HSK 1 words
  { h: '看书', p: 'kàn shū', m: 'To read books', cat: 'hobbies', level: 1,
    tip: '看 has a hand 手 shielding an eye 目 — squinting to read closely. 书 has strokes like the spine and pages of a book.',
    wtip: '"Kan" = look/watch. "Shu" = book. Watch a book = read books!' },

  { h: '听音乐', p: 'tīng yīn yuè', m: 'To listen to music', cat: 'hobbies', level: 1,
    tip: '音 has a mouth 口 inside — sound coming out. 乐 looks like a stringed instrument laid flat.',
    wtip: '"Ting" = listen. "Yin yue" = music (sound + joy). Listen to joyful sounds = listen to music!' },

  { h: '开车', p: 'kāi chē', m: 'To drive a car', cat: 'hobbies', level: 1,
    tip: '开 shows two hands lifting a bar — opening or starting something. 车 is a top-down view of a cart with wheels and axle.',
    wtip: '"Kai" = to open/start. "Che" = vehicle. Start the vehicle and go = drive a car!' },

  // Level 2 — key component is HSK 2 (做, 打) or confirmed HSK 2
  { h: '做饭', p: 'zuò fàn', m: 'To cook meals', cat: 'hobbies', level: 2,
    tip: '做 has a person 亻 on the left — someone actively doing. 饭 has the food radical 饣— something involving food.',
    wtip: '"Zuo" = to do/make. "Fan" = rice/food. Make food = cook meals!' },

  { h: '旅游', p: 'lǚ yóu', m: 'To travel', cat: 'hobbies', level: 2,
    tip: '旅 has a flag 方 and people under it — a group on the move. 游 has water 氵on the left — flowing and wandering.',
    wtip: '"Lv" sounds like "leave" — you leave home. "You" = roam/wander. Leave and roam = travel!' },

  { h: '游泳', p: 'yóu yǒng', m: 'To swim', cat: 'hobbies', level: 2,
    tip: '游 has water 氵and means to move through water. 泳 also has water 氵— double water, very wet!',
    wtip: '"You" = float/swim. "Yong" = swim strokes. Two water-related characters — you are swimming hard!' },

  { h: '打球', p: 'dǎ qiú', m: 'To play a ball game', cat: 'hobbies', level: 2,
    tip: '打 has the hand radical 扌— hitting with your hand. 球 has the jade radical 王 — a precious round thing.',
    wtip: '"Da" = to hit/strike. "Qiu" = ball. Hit the ball = play ball games. Add a sport: 打篮球 (basketball)!' },

  // ─── Family / Relationships ──────────────────────────────────────────────────

  // Level 1 — confirmed HSK 1
  { h: '朋友', p: 'péng yǒu', m: 'Friend', cat: 'family', level: 1,
    tip: '朋 is two moon-like shapes side by side — two things that belong together. 友 has two hands reaching toward each other.',
    wtip: '"Peng" = companion (classical). "You" = friend. Double friendship word = definitely your friend!' },

  { h: '男朋友', p: 'nán péng yǒu', m: 'Boyfriend', cat: 'family', level: 1,
    tip: '男 has a rice field 田 and strength 力 — a man working the fields. 朋友 = two linked companions.',
    wtip: '"Nan" = male. "Peng you" = friend. Male friend = boyfriend. Literally just "male friend"!' },

  { h: '女朋友', p: 'nǚ péng yǒu', m: 'Girlfriend', cat: 'family', level: 1,
    tip: '女 has graceful arms extended — the woman character. 朋友 = two linked companions.',
    wtip: '"Nv" = female. "Peng you" = friend. Female friend = girlfriend. Beautifully simple!' },

  // Level 3 — confirmed HSK 3 or conversational equivalents
  { h: '结婚了', p: 'jié hūn le', m: 'Married', cat: 'family', level: 3,
    tip: '结 has silk thread 纟— tying together. 婚 has woman 女 and dusk 昏 — traditionally wed at dusk.',
    wtip: '"Jie" = to tie/knot. "Hun" = marriage. Tie the knot — literally in Chinese! "Le" = it happened.' },

  { h: '前男友', p: 'qián nán yǒu', m: 'Ex-boyfriend', cat: 'family', level: 3,
    tip: '前 has a boat with a knife cutting forward — leaving the past behind as you move on.',
    wtip: '"Qian" = before/previous. He was your "nan peng you" — but now he is firmly in the PAST!' },

  { h: '前女友', p: 'qián nǚ yǒu', m: 'Ex-girlfriend', cat: 'family', level: 3,
    tip: '前 shows a blade cutting forward — something that has been left behind.',
    wtip: '"Qian" = former/previous. Your "nv peng you" who is now history. Qian cuts her to the past!' },

  { h: '单身', p: 'dān shēn', m: 'Single', cat: 'family', level: 3,
    tip: '单 has repeated crosses on top — alone, uncoupled. 身 is a pregnant figure — just your own body/self.',
    wtip: '"Dan" = single/alone. "Shen" = body/self. Just your own self = single!' },

  { h: '订婚', p: 'dìng hūn', m: 'Engaged', cat: 'family', level: 3,
    tip: '订 has speech radical 讠and a nail — fixing something with words. 婚 = marriage.',
    wtip: '"Ding" = to fix/set firmly. "Hun" = marriage. Fix the marriage in place = engaged!' },

  // Level 4 — advanced family terms, not in HSK official list
  { h: '岳父', p: 'yuè fù', m: "Wife's father (father-in-law)", cat: 'family', level: 4,
    tip: '岳 has a mountain 山 on top — a tall, towering figure of authority. 父 shows two hands above — a fatherly gesture.',
    wtip: '"Yue fu" is specifically the WIFE\'s father. Mountains are tall like a father-in-law\'s authority!' },

  { h: '公公', p: 'gōng gong', m: "Husband's father (father-in-law)", cat: 'family', level: 4,
    tip: '公 is two hands sharing something in a box — public and shared. Repeated for family warmth.',
    wtip: '"Gong gong" is the HUSBAND\'s father. Reduplicated sounds are used for family terms — soft and affectionate!' },

  { h: '岳母', p: 'yuè mǔ', m: "Wife's mother (mother-in-law)", cat: 'family', level: 4,
    tip: '岳 is the mountain — towering presence. 母 is a woman with two dots — nurturing like a mother.',
    wtip: '"Yue mu" is the WIFE\'s mother. Same 岳 as 岳父 — the 岳 family is always the wife\'s side!' },

  { h: '婆婆', p: 'pó po', m: "Husband's mother (mother-in-law)", cat: 'family', level: 4,
    tip: '婆 has woman 女 at the bottom — a senior female figure. Repeated for endearment, like calling grandma.',
    wtip: '"Po po" is the HUSBAND\'s mother. The soft repeated sound feels warm and affectionate!' },

  { h: '女婿', p: 'nǚ xù', m: 'Son-in-law', cat: 'family', level: 4,
    tip: '女 is the woman character — this person entered the family through your daughter. 婿 has woman 女 inside too.',
    wtip: '"Nv" = female/daughter. "Xu" = son-in-law. The son who came through your daughter!' },

  { h: '儿媳', p: 'ér xí', m: 'Daughter-in-law', cat: 'family', level: 4,
    tip: '儿 is a person with spread legs — a child figure. 媳 has woman 女 on the left — a woman who joined the family.',
    wtip: '"Er" = son/child. "Xi" = daughter-in-law. The woman who married your child!' },

  // Level 5 — confirmed HSK 5
  { h: '家庭', p: 'jiā tíng', m: 'Family / Household', cat: 'family', level: 5,
    tip: '家 has a pig under a roof — in ancient China this meant you had a proper home. 庭 = an open courtyard inside the home.',
    wtip: '"Jia" = home. "Ting" = courtyard/hall. Your home court = your whole household family!' },

  // Level 6 — confirmed HSK 6
  { h: '双胞胎', p: 'shuāng bāo tāi', m: 'Twins', cat: 'family', level: 6,
    tip: '双 has two hands — a matching pair. 胞 has flesh 月 — same womb. 胎 = fetus inside the body.',
    wtip: '"Shuang" = double. "Bao" = womb-sibling. "Tai" = fetus. Double womb babies = twins!' },

  // ─── Social / Work ───────────────────────────────────────────────────────────

  // Level 3 — confirmed HSK 3 or work/social conversational level
  { h: '同事', p: 'tóng shì', m: 'Colleague', cat: 'words', level: 3,
    tip: '同 has a shared space with a mouth 口 inside — people sharing the same environment. 事 is layered work tasks.',
    wtip: '"Tong" = same/together. "Shi" = matter/work. Same work matters = colleague!' },

  { h: '室友', p: 'shì yǒu', m: 'Flatmate / Roommate', cat: 'words', level: 3,
    tip: '室 has a roof and an arrow pointing inward — shooting yourself home. 友 has two hands reaching out.',
    wtip: '"Shi" = room. "You" = friend. Room friend = flatmate. The person sharing your four walls!' },

  { h: '上司', p: 'shàng si', m: 'Boss', cat: 'words', level: 3,
    tip: '上 is a short line rising ABOVE a longer line — going up, higher than you. 司 has a mouth directing inward.',
    wtip: '"Shang" = above/upper. "Si" = to manage/direct. The person above who manages = boss!' },

  { h: '职员', p: 'zhí yuán', m: 'Employee', cat: 'words', level: 3,
    tip: '职 has an ear 耳 — listening to instructions at work. 员 has a mouth and a circle — a person with a role.',
    wtip: '"Zhi" = post/duty. "Yuan" = member/person. A person with a work duty = employee!' },

  // ─── Phrases / Making Plans ──────────────────────────────────────────────────

  // Level 1 — confirmed HSK 1
  { h: '怎么样？', p: 'zěn me yàng', m: 'How about...?', cat: 'phrases', level: 1,
    tip: '怎 has a heart 心 below — feeling out the situation. 样 has wood 木 and a sheep 羊 — different appearances.',
    wtip: '"Zen me" = how/why. "Yang" = appearance/way. How does it seem? = How about it? Great for suggestions!' },

  // Level 2 — key component confirmed HSK 2 (告诉, 懂) or component-based
  { h: '听不懂', p: 'tīng bù dǒng', m: 'To not understand (what you hear)', cat: 'phrases', level: 2,
    tip: '听 has an ear 耳 — you are listening. 不 is a horizontal line with a drop — negation. 懂 has heart 忄— understanding in your heart.',
    wtip: '"Ting" = listen. "Bu" = not. "Dong" = understand. Listening but NOT getting it. Say this to any fast talker!' },

  { h: '有空', p: 'yǒu kòng', m: 'To be free / available', cat: 'phrases', level: 2,
    tip: '有 has a hand holding meat 月 — having something in hand. 空 has a cave 穴 — an empty hollow space.',
    wtip: '"You" = to have. "Kong" = empty/free. Have empty space in your schedule = to be free!' },

  { h: '告诉我…', p: 'gào su wǒ', m: 'Let me know...', cat: 'phrases', level: 2,
    tip: '告 has a cow 牛 below and a mouth 口 above — loudly announcing something. 诉 has speech radical — telling.',
    wtip: '"Gao" = to announce/declare. "Su" = to tell. "Wo" = me. Announce and tell me = let me know!' },

  { h: '你想…？', p: 'nǐ xiǎng', m: 'Do you fancy...?', cat: 'phrases', level: 2,
    tip: '想 has a heart 心 at the bottom with thoughts swirling above — your heart contemplating something.',
    wtip: '"Xiang" = think/want/miss. "Ni xiang" = you want? A gentle invitation to do something together!' },

  { h: '给我打个电话', p: 'gěi wǒ dǎ gè diàn huà', m: 'Give me a call', cat: 'phrases', level: 2,
    tip: '电话 has lightning 电 and speech 话 — electric speech. A phone is literally electric speech!',
    wtip: '"Gei wo" = give me. "Da" = hit/make. "Dian hua" = phone (electric speech). Make me an electric speech = call me!' },

  { h: '我很想…', p: 'wǒ hěn xiǎng', m: "I'd love to...", cat: 'phrases', level: 2,
    tip: '很 has a step radical 彳— moving with intensity. The heart 心 in 想 is longing intensely to go somewhere.',
    wtip: '"Wo" = I. "Hen" = very. "Xiang" = want/long for. I very much want = I\'d love to. Enthusiastic yes!' },

  // Level 3 — confirmed HSK 3 (应该) or conversational equivalents
  { h: '应该', p: 'yīng gāi', m: 'Should / Shall', cat: 'phrases', level: 3,
    tip: '应 has a heart 心 responding — something that resonates as right. 该 has speech radical — what ought to be said.',
    wtip: '"Ying" = to respond/ought to. "Gai" = should. Two words both meaning obligation = definitely SHOULD!' },

  // Level 4 — confirmed HSK 4 (计划) or advanced expressions
  { h: '计划', p: 'jì huà', m: 'Plans', cat: 'phrases', level: 4,
    tip: '计 has speech radical 讠and tally marks — counting with words. 划 has a knife cutting — cutting out sections of time.',
    wtip: '"Ji" = count/calculate. "Hua" = to divide. Count and divide your time = plans!' },

  { h: '你介意…？', p: 'nǐ jiè yì', m: 'Do you mind...?', cat: 'phrases', level: 4,
    tip: '介 has a person standing between two lines — carefully between boundaries. 意 has heart 心 below — what sits on your heart.',
    wtip: '"Jie yi" = to mind/care about. "Ni jie yi" = does it bother you? Polite way to ask permission!' },

  { h: '很抱歉，我不行。', p: 'hěn bào qiàn, wǒ bù xíng', m: "Sorry, I can't", cat: 'phrases', level: 4,
    tip: '抱 has arms 扌— holding with regret. 歉 has a harvest feeling and emotion — a harvest of sorry feelings.',
    wtip: '"Bao qian" = to hold regret/apologize. "Bu xing" = not possible/can\'t. Holding regret, it is impossible!' },

  // ─── Food & Meals ────────────────────────────────────────────────────────────

  { h: '饭', p: 'fàn', m: 'Meal / rice', cat: 'food', level: 1,
    tip: '饣food radical on the left + 反 (reverse/return) — food you return to every day.',
    wtip: '"Fan" sounds like FUN — meals are FUN! Every day you return to the FAN-tastic food.' },
  { h: '早饭', p: 'zǎofàn', m: 'Breakfast', cat: 'food', level: 1,
    tip: '早 = early/morning (sun above the horizon) + 饭 = meal. The morning meal.',
    wtip: '"Zao fan" — ZOW FUN! Breakfast is the EARLY FUN meal. Zao = early like an alarm ZAO!' },
  { h: '午饭', p: 'wǔfàn', m: 'Lunch', cat: 'food', level: 2,
    tip: '午 = noon (midday) + 饭 = meal. The midday meal.',
    wtip: '"Wu fan" — WOOH FUN at noon! The middle-of-the-day fun break. Lunch!' },
  { h: '晚饭', p: 'wǎnfàn', m: 'Dinner', cat: 'food', level: 2,
    tip: '晚 = evening (tired sun with extra strokes) + 饭 = meal. The waning day\'s meal.',
    wtip: '"Wan fan" — WANING FUN. The day is waning so you eat dinner. Evening = waning.' },
  { h: '菜', p: 'cài', m: 'Dish / vegetable', cat: 'food', level: 1,
    tip: '艹 plant/grass radical on top + 采 (to pick) — picking plant-based food.',
    wtip: '"Tsai" sounds like THAI — like Thai food, it\'s all about the dish! Cai = the dish.' },
  { h: '肉', p: 'ròu', m: 'Meat', cat: 'food', level: 1,
    tip: 'The character shows layers of muscle tissue — actual meat fibers visible in the strokes.',
    wtip: '"Rou" sounds like ROW — row upon row of meat at the market. Row = rou = meat!' },
  { h: '汤', p: 'tāng', m: 'Soup', cat: 'food', level: 1,
    tip: '氵water radical on the left + 昜 (sun rising with rays) — hot steaming liquid.',
    wtip: '"Tang" sounds like TANG the drink — liquid in a cup. Hot liquid = soup!' },
  { h: '面', p: 'miàn', m: 'Noodles / face', cat: 'food', level: 2,
    tip: '麦 wheat radical and strokes — wheat stretched into long thin noodle forms.',
    wtip: '"Mian" sounds like MY-AN — my noodles! This is MY comfort food. Mine!' },
  { h: '好吃', p: 'hǎochī', m: 'Delicious (food)', cat: 'food', level: 1,
    tip: '好 good + 吃 eat — something good to eat. The simplest compliment to a cook.',
    wtip: '"Hao chi" — HOW CHEEESE! It\'s so good you open wide and say CHEESE! Delicious!' },
  { h: '好喝', p: 'hǎohē', m: 'Delicious (drink)', cat: 'food', level: 2,
    tip: '好 good + 喝 drink — something good to drink. A compliment for any beverage.',
    wtip: '"Hao he" — HOW HEY! It\'s so good you shout HEY that\'s delicious! For drinks.' },
  { h: '牛奶', p: 'niúnǎi', m: 'Milk', cat: 'food', level: 1,
    tip: '牛 cow + 奶 (woman 女 + milk symbol 乃) — cow\'s nourishing liquid.',
    wtip: '"Niu nai" — NEW NYE! New Year\'s milk toast? Cow (niu) + nourishment (nai) = milk!' },
  { h: '饭店', p: 'fàndiàn', m: 'Restaurant', cat: 'food', level: 2,
    tip: '饭 meal + 店 shop/store — a shop that sells meals.',
    wtip: '"Fan dian" — FUN DINER! A fun place to eat = restaurant. Meal shop = where you go!' },
  { h: '中国菜', p: 'zhōngguó cài', m: 'Chinese food', cat: 'food', level: 1,
    tip: '中国 China + 菜 dish — the food of China. The cuisine of the Middle Kingdom.',
    wtip: '"Jong-gwoh tsai" — ZHONG-country DISH. Middle Kingdom food = Chinese cuisine!' },

  // ─── Daily Activities ────────────────────────────────────────────────────────

  { h: '起床', p: 'qǐchuáng', m: 'To get up', cat: 'words', level: 2,
    tip: '起 = rise (run/walk 走 + self 己) + 床 = bed (roof + wood). Rise from the bed.',
    wtip: '"Qi chuang" — CHEE CHOONG! The alarm goes CHEE CHOONG and you get up. RISE!' },
  { h: '工作', p: 'gōngzuò', m: 'To work', cat: 'words', level: 2,
    tip: '工 = a carpenter\'s ruler (work tool) + 作 = person creating things. A person with tools making things.',
    wtip: '"Gong zuo" — GONG ZOO! Work is like a gong zoo — noisy, structured, everyone doing things!' },
  { h: '睡觉', p: 'shuìjiào', m: 'To sleep', cat: 'words', level: 2,
    tip: '睡 = eye 目 drooping (垂) + 觉 = sense/feel. An eye drooping down into unconscious feeling.',
    wtip: '"Shway jiao" — SHWAY-JOY. Sleeping is the shway joy of the day. Eyes drooping with bliss.' },
  { h: '健身', p: 'jiànshēn', m: 'To work out', cat: 'hobbies', level: 3,
    tip: '健 = strong/healthy (person 亻+ build 建) + 身 = body. Building your body.',
    wtip: '"Jian shen" — GAIN SHEN(ness)! Working out = gaining body strength and presence.' },
  { h: '见朋友', p: 'jiàn péngyou', m: 'To meet friends', cat: 'words', level: 2,
    tip: '见 = see/meet (an eye 目 on legs — walking toward and seeing) + 朋友 = friends.',
    wtip: '"Jyen peng-you" — JEAN\'S FRIENDS! Meeting your mates. Jean always sees her friends!' },

  // ─── School ──────────────────────────────────────────────────────────────────

  { h: '学校', p: 'xuéxiào', m: 'School', cat: 'words', level: 1,
    tip: '学 = study (hands over child) + 校 = school grounds (wood 木 + compare 交). Learning place.',
    wtip: '"Xue xiao" — SHWAY SHOW! The school SHOWS you things and you SHWAY-learn them!' },
  { h: '学生', p: 'xuésheng', m: 'Student', cat: 'words', level: 1,
    tip: '学 = study/learn + 生 = life/birth. Someone born into learning — a student.',
    wtip: '"Xue sheng" — SHWAY SHENG! A student is someone SHENG-ing (born) into learning!' },
  { h: '同学', p: 'tóngxué', m: 'Classmate', cat: 'words', level: 1,
    tip: '同 = same/together (shared space with mouth) + 学 = study. Studying together.',
    wtip: '"Tong xue" — TONG-studying. TOGETHER-learning. The people learning the same things!' },
  { h: '课', p: 'kè', m: 'Class / lesson', cat: 'words', level: 2,
    tip: '讠speech radical + 果 (result/fruit) — speech that produces fruit, a lesson with results.',
    wtip: '"Ke" sounds like CLASS — KE = class/lesson. One ke = one class period.' },
  { h: '教室', p: 'jiàoshì', m: 'Classroom', cat: 'words', level: 2,
    tip: '教 = teach (strike/whip + child + father) + 室 = room (roof + arrived). Teaching room.',
    wtip: '"Jiao shi" — JOW SURE! The room where learning happens for SURE. Teaching room!' },
  { h: '考试', p: 'kǎoshì', m: 'Exam', cat: 'words', level: 2,
    tip: '考 = examine (老 old + stroke of testing) + 试 = try/test. An old-fashioned rigorous test.',
    wtip: '"Kao shi" — COW SHI(vering)! The exam makes even cows shiver. Test anxiety!' },
  { h: '成绩', p: 'chéngjì', m: 'Results / grades', cat: 'words', level: 3,
    tip: '成 = accomplish/achieve + 绩 = silk thread achievements. The fine thread of accumulated results.',
    wtip: '"Cheng ji" — CHENG-ACHIEVEMENT! Your results show what you\'ve CHENG-accomplished.' },

  // ─── Language ────────────────────────────────────────────────────────────────

  { h: '中文', p: 'zhōngwén', m: 'Chinese language', cat: 'words', level: 1,
    tip: '中 = middle/China + 文 = culture/writing. The writing of the Middle Kingdom.',
    wtip: '"Zhong wen" — JONG-WEN. WEN = writing/language. Middle-Kingdom language = Chinese!' },
  { h: '英语', p: 'yīngyǔ', m: 'English language', cat: 'words', level: 2,
    tip: '英 = hero/brilliant (the sound of England) + 语 = language. The heroic/brilliant language.',
    wtip: '"Ying yu" — YING language. 英 was chosen to represent England by sound. Brilliant!' },
  { h: '法语', p: 'fǎyǔ', m: 'French language', cat: 'words', level: 3,
    tip: '法 = law/method (France by sound) + 语 = language. The lawful/methodical language.',
    wtip: '"Fa yu" — FA language. 法 chosen for France by sound. Ooh la la — FA-rench!' },
  { h: '普通话', p: 'pǔtōnghuà', m: 'Mandarin (standard Chinese)', cat: 'words', level: 2,
    tip: '普通 = common/ordinary + 话 = speech. The common everyday speech — standard Mandarin.',
    wtip: '"Pu tong hua" — PURE TONG-speech. The pure standard speech, the common tongue!' },
  { h: '公司', p: 'gōngsī', m: 'Company / office', cat: 'words', level: 2,
    tip: '公 = public/shared + 司 = manage/direct. A shared place of directed management.',
    wtip: '"Gong si" — GONG CEO! The place where the CEO gongs to get everyone\'s attention. Work!' },
  { h: '火车', p: 'huǒchē', m: 'Train', cat: 'words', level: 1,
    tip: '火 = fire + 车 = vehicle. A fire-powered vehicle — the original steam train!',
    wtip: '"Huo che" — WHOA CHEH! Fire car goes WHOA! A fire vehicle = steam train = train!' },
]
