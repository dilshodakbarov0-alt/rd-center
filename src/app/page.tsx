"use client";

import { useState, useEffect } from "react";

// ─────────────── Types ───────────────
type Step = "home" | "input" | "zone" | "method" | "loading" | "variants" | "report" | "complete";
type ReportTab = "overview" | "composition" | "business" | "lab" | "technology" | "testing";

interface Variant {
  name: string;
  tag: string;
  basis: string;
  emoji: string;
}

// ─────────────── Constants ───────────────
const CATEGORIES = [
  "Неорганические вяжущие",
  "Керамика и стекло",
  "Полимеры и пластики",
  "Металлы и сплавы",
  "Био-материалы и дерево",
  "Инфраструктура и дороги",
  "Отделочные материалы",
  "Композиты",
];

const ZONES = [
  { id: "foundation", label: "ФУНДАМЕНТ", sub: "СЕЙСМОСТОЙКОСТЬ" },
  { id: "walls", label: "СТЕНЫ", sub: "НЕСУЩИЕ КОНСТРУКЦИИ" },
  { id: "facade", label: "ФАСАД", sub: "ОТДЕЛКА И ЗАЩИТА" },
  { id: "floors", label: "ПОЛЫ", sub: "ИЗНОСОСТОЙКОСТЬ" },
  { id: "ceiling", label: "ПОТОЛОК", sub: "ОГНЕЗАЩИТА" },
  { id: "roads", label: "ДОРОГИ", sub: "ИНФРАСТРУКТУРА" },
];

const LOADING_STEPS = [
  "Глубокое сканирование молекулярной структуры",
  "Анализ межатомных связей и энергии решётки",
  "Симуляция сейсмических и термических нагрузок",
  "Верификация по стандартам ISO / ГОСТ / УЗДСТ",
  "Финальный синтез промышленного рецептора",
];

const REPORT_TABS: { id: ReportTab; label: string }[] = [
  { id: "overview", label: "ОБЗОР" },
  { id: "composition", label: "СОСТАВ" },
  { id: "business", label: "БИЗНЕС-КЕЙС" },
  { id: "lab", label: "ЛАБОРАТОРИЯ (R&D)" },
  { id: "technology", label: "ТЕХНОЛОГИЯ" },
  { id: "testing", label: "ИСПЫТАНИЯ (SIM)" },
];

// Generate variants based on category + materials input
function generateVariants(category: string, materials: string): Variant[] {
  const mat = materials.toUpperCase();
  const cat = category.toLowerCase();

  // Detect keywords
  const hasGypsum = mat.includes("ГИПС") || mat.includes("ГІПС");
  const hasBasalt = mat.includes("БАЗАЛЬТ");
  const hasClay = mat.includes("ГЛИН");
  const hasCement = mat.includes("ЦЕМЕНТ");
  const hasSand = mat.includes("ПЕСОК") || mat.includes("ПІСК");
  const hasPolymer = mat.includes("ПОЛИМЕР") || mat.includes("РДП") || mat.includes("RDP");
  const hasFiber = mat.includes("ВОЛОКН") || mat.includes("ФИБР");
  const hasLime = mat.includes("ИЗВЕСТЬ") || mat.includes("ВАПНО");
  const isCeramic = cat.includes("керам") || cat.includes("стекл");
  const isPolymer = cat.includes("полимер");
  const isMetal = cat.includes("металл");
  const isBio = cat.includes("био") || cat.includes("дерев");
  const isInfra = cat.includes("инфраструктур") || cat.includes("дорог");
  const isComposite = cat.includes("композит");
  const isFinish = cat.includes("отделоч");

  // Ceramic & glass
  if (isCeramic) {
    return [
      { emoji: "🏺", name: "Высокотемпературная керамическая матрица (HT-CERAMIC)", tag: "ENGINEERING_BASIS:", basis: "Спекание при 1200°C формирует плотную кристаллическую структуру с высокой термостойкостью и твёрдостью. Добавки оксида алюминия повышают механические характеристики." },
      { emoji: "🪟", name: "Боросиликатный конструкционный стеклокомпозит (BSG-PANEL)", tag: "ENGINEERING_BASIS:", basis: "Боросиликатная матрица обеспечивает низкий КТР и высокую химическую стойкость. Армирование стеклянными нитями увеличивает ударную вязкость." },
      { emoji: "🔷", name: "Глазурованный огнеупорный модуль (GFM-TILE)", tag: "ENGINEERING_BASIS:", basis: "Многослойная глазурь защищает от влаги и химических воздействий. Огнеупорная основа выдерживает до 1400°C без деформации." },
    ];
  }

  // Polymer
  if (isPolymer) {
    return [
      { emoji: "🧪", name: "Термопластичный армированный композит (TRP-COMPOSITE)", tag: "ENGINEERING_BASIS:", basis: "Полимерная матрица с коротким стекловолокном формирует лёгкую и прочную структуру. Высокая стойкость к коррозии и химическим веществам." },
      { emoji: "🔩", name: "Эпоксидный конструкционный профиль (ECP-SYSTEM)", tag: "ENGINEERING_BASIS:", basis: "Термореактивная эпоксидная матрица с углеволокном обеспечивает максимальный модуль упругости при минимальной массе." },
      { emoji: "🧱", name: "Пенополимерный теплоизоляционный блок (PPB-INSUL)", tag: "ENGINEERING_BASIS:", basis: "Закрытопористая структура вспененного полимера минимизирует теплопроводность. Модифицирование антипиренами обеспечивает класс горючести Г1." },
    ];
  }

  // Metal
  if (isMetal) {
    return [
      { emoji: "⚙️", name: "Высокопрочный алюминиевый сплав (HAS-ALLOY)", tag: "ENGINEERING_BASIS:", basis: "Легирование кремнием и магнием формирует дисперсионно-твердеющую структуру с высоким пределом текучести и коррозионной стойкостью." },
      { emoji: "🔧", name: "Антикоррозионный стальной профиль (ACS-PROFILE)", tag: "ENGINEERING_BASIS:", basis: "Термомеханическая обработка и цинкирование создают защитный барьер глубиной 80 мкм, обеспечивая ресурс 50+ лет в атмосферных условиях." },
      { emoji: "🏗️", name: "Биметаллический конструкционный элемент (BME-STRUCT)", tag: "ENGINEERING_BASIS:", basis: "Сочетание алюминиевого и стального слоёв обеспечивает оптимальный баланс жёсткости, массы и стоимости для несущих конструкций." },
    ];
  }

  // Bio / wood
  if (isBio) {
    return [
      { emoji: "🌳", name: "Модифицированный термодревесный панель (MTW-PANEL)", tag: "ENGINEERING_BASIS:", basis: "Термическая модификация при 180°C снижает гигроскопичность на 60%, повышает стабильность размеров и биостойкость без химических пропиток." },
      { emoji: "🌿", name: "Биокомпозит целлюлоза-полимер (BCP-COMPOSITE)", tag: "ENGINEERING_BASIS:", basis: "Целлюлозные нанокристаллы армируют биоразлагаемую полимерную матрицу, формируя экологичный материал с высокими механическими показателями." },
      { emoji: "🪵", name: "Клееный арболит с базальтовым армированием (ARBOLIT-B)", tag: "ENGINEERING_BASIS:", basis: "Органическое заполнение (щепа) в цементной матрице обеспечивает высокую теплоизоляцию. Базальтовое волокно компенсирует низкую прочность на изгиб." },
    ];
  }

  // Infrastructure / roads
  if (isInfra) {
    return [
      { emoji: "🛣️", name: "Высокомодульный асфальтобетон (HM-ASPHALT)", tag: "ENGINEERING_BASIS:", basis: "Полимер-битумное вяжущее с базальтовым щебнём фракции 5-20 мм формирует дорожное покрытие с повышенной усталостной прочностью и колееустойчивостью." },
      { emoji: "🏗️", name: "Дорожный цементобетон с фиброармированием (RFCP-ROAD)", tag: "ENGINEERING_BASIS:", basis: "Стальная фибра в цементной матрице увеличивает трещиностойкость при промерзании и нагружении. Срок службы 40+ лет без капремонта." },
      { emoji: "🔲", name: "Геополимерный стабилизатор грунта (GPS-STAB)", tag: "ENGINEERING_BASIS:", basis: "Щелочная активация алюмосиликатных пород формирует геополимерную матрицу, цементирующую грунт основания дороги без обжига и CO₂-эмиссии." },
    ];
  }

  // Composites
  if (isComposite) {
    return [
      { emoji: "🔬", name: "Углеволоконный ламинат высокой прочности (CFRP-LAMINAT)", tag: "ENGINEERING_BASIS:", basis: "Многослойная укладка углеродных тканей в эпоксидной матрице обеспечивает анизотропную прочность под оптимальными углами к нагрузке." },
      { emoji: "🧲", name: "Стекловолоконный конструкционный профиль (GFRP-STRUCT)", tag: "ENGINEERING_BASIS:", basis: "Пултрузионный профиль из стеклоровинга в полиэфирной матрице — лёгкая замена стальных конструкций с нулевой коррозией и диэлектрическими свойствами." },
      { emoji: "🌀", name: "Базальтоволоконный термостойкий композит (BFRC-THERMAL)", tag: "ENGINEERING_BASIS:", basis: "Базальтовое волокно при температуре плавления 1400°C не уступает огнестойкости стальной фибры, при этом на 30% легче и химически инертнее." },
    ];
  }

  // Finishing materials
  if (isFinish) {
    return [
      { emoji: "🎨", name: "Декоративная минеральная штукатурка (DMP-FINISH)", tag: "ENGINEERING_BASIS:", basis: hasGypsum ? "Гипсовая матрица с мраморной крошкой формирует паропроницаемое декоративное покрытие с высокой белизной и пластичностью нанесения." : "Минеральная матрица с цветными наполнителями обеспечивает паропроницаемость и долговечность фасадного покрытия." },
      { emoji: "🖼️", name: "Тонкослойная фасадная система (TFS-COAT)", tag: "ENGINEERING_BASIS:", basis: "Акрилатный слой толщиной 2-3 мм с мелким наполнителем образует гидрофобное, трещиностойкое и УФ-стойкое декоративное покрытие." },
      { emoji: "🪵", name: "Самонивелирующийся наливной пол (SLF-FLOOR)", tag: "ENGINEERING_BASIS:", basis: hasGypsum ? "Гипсоцементная смесь с модифицирующими добавками обеспечивает самовыравнивание при В/Т 0.25-0.30 без усадочных трещин." : "Цементная матрица с суперпластификатором обеспечивает растекаемость конуса >240 мм и прочность 30 МПа через 28 суток." },
    ];
  }

  // Default: Inorganic binders (most common case)
  // Check specific combinations
  if (hasGypsum && hasBasalt && hasClay) {
    return [
      { emoji: "🪨", name: "Базальто-армированный гипсобетон (BARG-PANEL)", tag: "ENGINEERING_BASIS:", basis: "Эффект микро-наполнителя: базальтовая мука (<50 мкм) служит центрами кристаллизации гипса и уплотняет матрицу. Глина регулирует реологию и снижает хрупкость." },
      { emoji: "🌿", name: "Сорбционно-минерализующий агро-пеллет (SMA-PELLET)", tag: "ENGINEERING_BASIS:", basis: "Синергия ионного обмена: гипс вытесняет натрий из засолённых почв, глинистые минералы удерживают влагу. Базальтовые частицы создают пористый каркас." },
      { emoji: "🔧", name: "Тиксотропная реставрационная паста (TRP-SYSTEM)", tag: "ENGINEERING_BASIS:", basis: "Глинистые частицы создают тиксотропную структуру геля. Базальт армирует матрицу, увеличивая трещиностойкость. Гипс обеспечивает быстрый набор прочности." },
    ];
  }

  if (hasCement && hasBasalt) {
    return [
      { emoji: "🏗️", name: "Базальтофибробетон высокой прочности (BFB-STRUCT)", tag: "ENGINEERING_BASIS:", basis: "Базальтовое волокно длиной 12-48 мм хаотично армирует цементную матрицу, повышая трещиностойкость на 60% и ударную вязкость на 80%." },
      { emoji: "🪨", name: "Базальтовый мелкозернистый бетон (BMC-FINE)", tag: "ENGINEERING_BASIS:", basis: "Базальтовый щебень в качестве заполнителя обеспечивает повышенную плотность (2400 кг/м³) и морозостойкость F200+ по сравнению с гравийным бетоном." },
      { emoji: "⚡", name: "Быстротвердеющий базальтоцементный состав (BCC-RAPID)", tag: "ENGINEERING_BASIS:", basis: "Ультратонкий базальт ускоряет нуклеацию C-S-H фаз цементного камня, обеспечивая набор 70% прочности за 8 часов вместо 28 суток." },
    ];
  }

  if (hasCement && hasSand) {
    return [
      { emoji: "🧱", name: "Цементно-песчаный раствор М200 (CPS-M200)", tag: "ENGINEERING_BASIS:", basis: "Оптимальное соотношение Ц:П=1:3 при В/Ц=0.45 обеспечивает прочность 20 МПа и удобоукладываемость ОК=6-8 см для кладочных работ." },
      { emoji: "🏠", name: "Штукатурная смесь с перлитовым наполнителем (PLS-PLAST)", tag: "ENGINEERING_BASIS:", basis: "Перлитовый наполнитель снижает теплопроводность штукатурки до 0.18 Вт/(м·К) при сохранении прочности сцепления с основанием >0.5 МПа." },
      { emoji: "🛠️", name: "Ремонтный тиксотропный состав (RTC-REPAIR)", tag: "ENGINEERING_BASIS:", basis: "Полимер-модифицированная цементная матрица с коллоидным кремнезёмом обеспечивает адгезию к бетону >2.5 МПа и усадку <0.1%." },
    ];
  }

  if (hasGypsum && hasPolymer) {
    return [
      { emoji: "🎨", name: "Полимер-гипсовая декоративная штукатурка (PGP-DECOR)", tag: "ENGINEERING_BASIS:", basis: "РДП-добавка в концентрации 1.5% повышает адгезию гипсовой матрицы до 0.8 МПа и обеспечивает эластичность покрытия при усадке основания." },
      { emoji: "🪞", name: "Высокопластичный гипсовый шпатлёвочный состав (HPS-FLEX)", tag: "ENGINEERING_BASIS:", basis: "Комбинация гипса Г-7 и редиспергируемого порошка формирует самовыравнивающееся покрытие с открытым временем 45 мин и финишной прочностью 12 МПа." },
      { emoji: "🏗️", name: "Гипсоцементный пазогребневый блок с РДП (GCB-PANEL)", tag: "ENGINEERING_BASIS:", basis: "Гипс обеспечивает быстрый набор прочности (демонтаж форм через 30 мин), цемент — долгосрочную прочность, РДП — трещиностойкость при монтаже." },
    ];
  }

  if (hasGypsum) {
    return [
      { emoji: "🪨", name: "Модифицированный гипсовый вяжущий состав (MGP-BIND)", tag: "ENGINEERING_BASIS:", basis: "Полуводный гипс Г-5Б с регулятором схватывания обеспечивает время начала схватывания 10-15 мин и конечную прочность 5-7 МПа." },
      { emoji: "🏠", name: "Гипсовая пазогребневая плита (GPP-PARTITION)", tag: "ENGINEERING_BASIS:", basis: "Уплотнённая гипсовая матрица с минеральными добавками формирует плиту плотностью 1200 кг/м³ для межкомнатных перегородок высотой до 4 м." },
      { emoji: "🎨", name: "Гипсовая финишная шпатлёвка (GFS-FINISH)", tag: "ENGINEERING_BASIS:", basis: "Тонкомолотый гипс Г-10 с суперпластификатором обеспечивает жизнеспособность смеси 60 мин и нанесение слоем 0.5-3 мм с минимальным шлифованием." },
    ];
  }

  if (hasLime && hasCement) {
    return [
      { emoji: "🏛️", name: "Известково-цементная штукатурка (LCS-PLAST)", tag: "ENGINEERING_BASIS:", basis: "Известь обеспечивает пластичность и паропроницаемость, цемент — раннюю прочность. Соотношение Ц:И:П=1:1:6 — оптимум для фасадных работ." },
      { emoji: "🧱", name: "Реставрационный известковый раствор (RLM-HERITAGE)", tag: "ENGINEERING_BASIS:", basis: "Гашёная известь в смеси с гидравлическим известняком имитирует исторические растворы — совместима со старой кладкой, не создаёт солевых высолов." },
      { emoji: "🌿", name: "Известковый биоцидный штукатурный состав (LBS-ANTIFUNG)", tag: "ENGINEERING_BASIS:", basis: "Высокощелочная среда извести (pH 12.4) подавляет рост грибков и водорослей без химических биоцидов — экологичное решение для влажных помещений." },
    ];
  }

  // Fallback for any inorganic binder
  return [
    { emoji: "🪨", name: "Минеральный композит высокой прочности (MCP-STRUCT)", tag: "ENGINEERING_BASIS:", basis: "Синергия компонентов формирует плотную матрицу с оптимизированной зерновой упаковкой. Химическая инертность обеспечивает долговечность в агрессивных средах." },
    { emoji: "⚗️", name: "Полиминеральный вяжущий комплекс (PMB-SYSTEM)", tag: "ENGINEERING_BASIS:", basis: "Многокомпонентная система с регулируемым временем схватывания и адаптивной реологией — подходит для механизированного и ручного нанесения." },
    { emoji: "🔬", name: "Геополимерный конструкционный материал (GPM-GEO)", tag: "ENGINEERING_BASIS:", basis: "Щелочная активация алюмосиликатов формирует трёхмерную полимерную сеть без CO₂-эмиссии. Прочность на сжатие 40-60 МПа при нулевом клинкере." },
  ];
}

// ─────────────── UI helpers ───────────────
const CY = { color: "#0ff" };
const ST = { fontSize: 10, letterSpacing: "0.18em", color: "#555", textTransform: "uppercase" as const, marginBottom: 4 };

function SL({ children }: { children: React.ReactNode }) {
  return <p style={ST}>{children}</p>;
}

// ─────────────── Header ───────────────
function Header({ onNew, showNew }: { onNew: () => void; showNew: boolean }) {
  return (
    <header
      className="no-print"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        borderBottom: "1px solid #111",
        position: "sticky",
        top: 0,
        background: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(10px)",
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: "1.5px solid #0ff4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0ff08",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#0ff" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="2.5" fill="#0ff" fillOpacity="0.7" />
          </svg>
        </div>
        <span style={{ fontWeight: 800, letterSpacing: "0.1em", fontSize: 13 }}>STROYGEN CORE</span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" strokeLinecap="round" />
          </svg>
        </button>
        {showNew && (
          <button
            onClick={onNew}
            style={{
              background: "none",
              border: "1px solid #222",
              color: "#fff",
              cursor: "pointer",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            НОВЫЙ ПРОЕКТ
          </button>
        )}
      </div>
    </header>
  );
}

// ─────────────── HOME ───────────────
function HomeStep({ selected, onSelect }: { selected: string | null; onSelect: (c: string) => void }) {
  return (
    <div className="anim-fade-in" style={{ minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 80 }}>
      <h1 style={{ fontSize: "clamp(56px,10vw,100px)", fontWeight: 900, letterSpacing: "-0.02em", textAlign: "center", lineHeight: 0.92 }}>
        СИНТЕЗ<br /><span style={CY}>МАТЕРИИ</span>
      </h1>
      <p style={{ marginTop: 18, fontSize: 10, letterSpacing: "0.35em", color: "#444", textTransform: "uppercase" }}>
        Laboratory_of_Autonomous_Engineering
      </p>
      <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(4, minmax(150px, 210px))", gap: 10, justifyContent: "center", padding: "0 20px", maxWidth: 940 }}>
        {CATEGORIES.map((cat) => {
          const active = selected === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              style={{
                background: active ? "#0ff" : "transparent",
                color: active ? "#000" : "#999",
                border: `1.5px solid ${active ? "#0ff" : "#222"}`,
                borderRadius: 14,
                padding: "18px 12px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.18s",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────── INPUT ───────────────
function InputStep({ category, value, onChange, onNext, onBack }: { category: string | null; value: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="anim-fade-in" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        {category && (
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={onBack} style={{ background: "none", border: "1px solid #1a1a1a", color: "#555", borderRadius: 50, padding: "8px 16px", fontSize: 11, cursor: "pointer", letterSpacing: "0.08em" }}>← НАЗАД</button>
            <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "#0ff", textTransform: "uppercase", fontWeight: 700 }}>
              {category}
            </span>
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="MOLECULAR_INPUT_ACTIVE"
          autoFocus
          style={{
            width: "100%",
            minHeight: 180,
            background: "#080808",
            border: "1px solid #1a1a1a",
            borderRadius: 16,
            padding: "24px 26px",
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            resize: "vertical",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: 1.6,
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#0ff3"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; }}
        />
        {value.trim() && (
          <p style={{ fontSize: 10, color: "#333", textAlign: "right", marginTop: 6, letterSpacing: "0.12em" }}>
            КОМПОНЕНТЫ ОБНАРУЖЕНЫ: {value.trim().split(/\s+/).length}
          </p>
        )}
        <button
          onClick={onNext}
          disabled={!value.trim()}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "20px",
            background: value.trim() ? "#0ff" : "#0a0a0a",
            color: value.trim() ? "#000" : "#333",
            border: "none",
            borderRadius: 50,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: value.trim() ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          ЗАПУСТИТЬ R&D_CORE
        </button>
      </div>
    </div>
  );
}

// ─────────────── ZONE ───────────────
function ZoneStep({ onSelect, onSkip, onBack }: { onSelect: (z: string) => void; onSkip: () => void; onBack: () => void }) {
  return (
    <div className="anim-fade-in" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 24px" }}>
      <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 900, textAlign: "center" }}>
        УТОЧНЕНИЕ <span style={CY}>ЗОНЫ</span>
      </h1>
      <p style={{ color: "#444", letterSpacing: "0.2em", fontSize: 10, marginTop: 12, textTransform: "uppercase" }}>
        Для каких конструкций адаптировать состав?
      </p>
      <button onClick={onBack} style={{ marginTop: 28, background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#777", borderRadius: 50, padding: "10px 20px", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: "0.1em" }}>
        ← НАЗАД
      </button>
      <div style={{ marginTop: 44, display: "grid", gridTemplateColumns: "repeat(3, minmax(150px, 200px))", gap: 14, justifyContent: "center" }}>
        {ZONES.map((z) => (
          <button
            key={z.id}
            onClick={() => onSelect(z.id)}
            style={{ background: "#080808", border: "1px solid #1a1a1a", borderRadius: 20, padding: "28px 18px", cursor: "pointer", textAlign: "center", transition: "border-color 0.18s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0ff5"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a1a1a"; }}
          >
            <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.1em" }}>{z.label}</p>
            <p style={{ marginTop: 8, fontSize: 9, letterSpacing: "0.15em", color: "#0ff" }}>{z.sub}</p>
            <div style={{ marginTop: 10, width: 20, height: 2, background: "#0ff3", margin: "10px auto 0" }} />
          </button>
        ))}
      </div>
      <button onClick={onSkip} style={{ marginTop: 36, background: "none", border: "1px solid #1a1a1a", color: "#555", borderRadius: 50, padding: "14px 32px", fontSize: 11, fontWeight: 600, cursor: "pointer", letterSpacing: "0.1em" }}>
        ПРОПУСТИТЬ (УНИВЕРСАЛЬНОЕ РЕШЕНИЕ)
      </button>
    </div>
  );
}

// ─────────────── METHOD ───────────────
function MethodStep({ onSelect, onBack }: { onSelect: (m: string) => void; onBack: () => void }) {
  return (
    <div className="anim-fade-in" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 24px" }}>
      <h1 style={{ fontSize: "clamp(28px,5vw,60px)", fontWeight: 900, textAlign: "center" }}>МЕТОДОЛОГИЯ СИНТЕЗА</h1>
      <p style={{ color: "#444", letterSpacing: "0.2em", fontSize: 10, marginTop: 12, textTransform: "uppercase" }}>Выберите технологическую глубину</p>
      <div style={{ display: "flex", gap: 20, marginTop: 56, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { id: "conventional", icon: "▦", title: "ОБЫЧНЫЙ МЕТОД", desc: "Традиционное сырьё и стандартные процессы.", tag: "ИНЖЕНЕРНЫЙ БАЗИС", color: "#888" },
          { id: "nano", icon: "◎", title: "НАНО-МЕТОД", desc: "Квантовое армирование и модификация решётки.", tag: "НАУКОЁМКИЙ БАЗИС", color: "#0ff" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{ background: "#080808", border: "1px solid #1a1a1a", borderRadius: 24, padding: "44px 44px", cursor: "pointer", textAlign: "center", width: 270, transition: "border-color 0.18s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0ff4"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a1a1a"; }}
          >
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: m.id === "nano" ? "#0a1a1a" : "#111", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: m.color }}>
              {m.icon}
            </div>
            <p style={{ fontWeight: 900, fontSize: 15, letterSpacing: "0.04em" }}>{m.title}</p>
            <p style={{ marginTop: 10, fontSize: 11, color: "#555", lineHeight: 1.6 }}>{m.desc}</p>
            <p style={{ marginTop: 14, fontSize: 9, letterSpacing: "0.15em", color: "#0ff" }}>{m.tag}</p>
          </button>
        ))}
      </div>
      <button onClick={onBack} style={{ marginTop: 36, background: "none", border: "1px solid #1a1a1a", color: "#555", borderRadius: 50, padding: "12px 28px", fontSize: 11, fontWeight: 600, cursor: "pointer", letterSpacing: "0.1em" }}>
        ← НАЗАД
      </button>
    </div>
  );
}

// ─────────────── LOADING ───────────────
function LoadingStep({ progress }: { progress: number }) {
  return (
    <div className="anim-fade-in" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36, padding: "40px 24px" }}>
      <div style={{ position: "relative", width: 110, height: 110 }}>
        <div className="anim-spin-slow" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#0ff", borderLeftColor: "#0ff4" }} />
        <div className="anim-spin-reverse" style={{ position: "absolute", inset: 14, borderRadius: "50%", border: "1px solid transparent", borderTopColor: "#0084ff", borderRightColor: "#0084ff3" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="anim-pulse-glow" style={{ width: 28, height: 28, borderRadius: "50%", background: "#0ff3", border: "1.5px solid #0ff" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 480 }}>
        {LOADING_STEPS.map((label, i) => {
          const done = i < progress;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderLeft: `3px solid ${done ? "#0ff" : "#1a1a1a"}`, background: "#060606", borderRadius: "0 8px 8px 0", opacity: done ? 1 : i === progress ? 0.7 : 0.3, transition: "all 0.4s" }}>
              <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: done ? "#fff" : "#555", fontWeight: done ? 600 : 400 }}>{label}</span>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: done ? "#0ff" : "#1a1a1a", transition: "all 0.4s" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────── VARIANTS ───────────────
function VariantsStep({ variants, zone, method, onSelect, favorites, onFavorite }: { variants: Variant[]; zone: string | null; method: string | null; onSelect: (i: number) => void; favorites: boolean[]; onFavorite: (i: number) => void }) {
  const zoneLabel = zone ? ZONES.find((z) => z.id === zone)?.label ?? zone : "УНИВЕРСАЛЬНОЕ ПРИМЕНЕНИЕ";
  const methodLabel = method === "nano" ? "NANO" : "CONVENTIONAL";
  return (
    <div className="anim-fade-in" style={{ padding: "56px 24px", maxWidth: 1060, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <h1 style={{ fontSize: "clamp(28px,5vw,56px)", fontWeight: 900, letterSpacing: "-0.02em" }}>ВАРИАНТЫ ПРОДУКТА</h1>
        <button style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 22 }}>♥</button>
      </div>
      <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", marginBottom: 44 }}>
        ЗОНА: {zoneLabel} // МЕТОД: {methodLabel}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
        {variants.map((v, i) => (
          <div key={i} style={{ background: "#060606", border: "1px solid #141414", borderRadius: 20, overflow: "hidden", transition: "border-color 0.18s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#0ff3"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#141414"; }}
          >
            <div style={{ height: 150, background: "linear-gradient(135deg,#111,#0a0a0a)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <span style={{ fontSize: 44 }}>{v.emoji}</span>
              <button onClick={(e) => { e.stopPropagation(); onFavorite(i); }} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", cursor: "pointer", color: favorites[i] ? "#f55" : "#333", fontSize: 18 }}>♥</button>
            </div>
            <div style={{ padding: "18px 18px 0" }}>
              <p style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.35, color: "#fff", marginBottom: 10 }}>{v.name}</p>
              <p style={{ fontSize: 9, color: "#0ff", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 6 }}>{v.tag}</p>
              <p style={{ fontSize: 11, color: "#555", lineHeight: 1.6 }}>{v.basis}</p>
            </div>
            <button
              onClick={() => onSelect(i)}
              style={{ display: "block", width: "100%", padding: "16px", background: "#0a0a0a", border: "none", borderTop: "1px solid #141414", color: "#888", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginTop: 16, transition: "all 0.18s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#0ff"; (e.currentTarget as HTMLButtonElement).style.color = "#000"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#0a0a0a"; (e.currentTarget as HTMLButtonElement).style.color = "#888"; }}
            >
              ПОЛНЫЙ ИНЖЕНЕРНЫЙ ОТЧЁТ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────── REPORT ───────────────
function ReportStep({ variant, category, materials, zone, method, tab, onTabChange, onBack, onExport, onComplete }: {
  variant: Variant; category: string | null; materials: string; zone: string | null; method: string | null;
  tab: ReportTab; onTabChange: (t: ReportTab) => void; onBack: () => void; onExport: () => void; onComplete: () => void;
}) {
  const zoneLabel = zone ? ZONES.find((z) => z.id === zone)?.label ?? zone : "Универсальное применение";
  const methodLabel = method === "nano" ? "Nano" : "Conventional";

  // Parse materials for composition
  const matList = materials.trim().split(/[\s,;]+/).filter(Boolean);

  return (
    <div className="anim-fade-in" style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <button onClick={onBack} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#888", borderRadius: 50, padding: "10px 18px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>← НАЗАД</button>
          <div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0ff", marginBottom: 8 }} />
            <h1 style={{ fontWeight: 900, fontSize: "clamp(18px,2.5vw,28px)", lineHeight: 1.2 }}>{variant.name}</h1>
            <p style={{ fontSize: 9, color: "#444", letterSpacing: "0.14em", marginTop: 6, textTransform: "uppercase" }}>
              Sector: {category} // Method: <span style={{ color: "#0ff" }}>{methodLabel} (с элементами микро-модификации)</span>
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 20 }}>♥</button>
          <button onClick={onExport} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#fff", borderRadius: 10, padding: "11px 18px", fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em" }}>↓ ЭКСПОРТ ОТЧЁТА</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, marginBottom: 28, overflowX: "auto", paddingBottom: 2 }}>
        {REPORT_TABS.map((t) => (
          <button key={t.id} onClick={() => onTabChange(t.id)}
            style={{ background: tab === t.id ? "#0ff" : "transparent", color: tab === t.id ? "#000" : "#555", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em", whiteSpace: "nowrap", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="anim-fade-in" key={tab}>
        {tab === "overview" && <OverviewContent category={category} zone={zoneLabel} method={methodLabel} variant={variant} />}
        {tab === "composition" && <CompositionContent matList={matList} />}
        {tab === "business" && <BusinessContent />}
        {tab === "lab" && <LabContent />}
        {tab === "technology" && <TechContent />}
        {tab === "testing" && <TestingContent onComplete={onComplete} />}
      </div>

      <div style={{ marginTop: 36, paddingTop: 16, borderTop: "1px solid #0a0a0a", display: "flex", justifyContent: "space-between", fontSize: 8, color: "#222", letterSpacing: "0.14em", textTransform: "uppercase" }}>
        <span>© 2024 STROYGEN OMNI-MIND // ENGINEER_SYNTHESIS_REPORT</span>
        <span>CERTIFICATION: ISO_9001_READY</span>
        <span>GENERATED: {new Date().toLocaleString("ru-RU")}</span>
      </div>
    </div>
  );
}

// ─── Tab content ───
function card(extra?: React.CSSProperties): React.CSSProperties {
  return { background: "#070707", border: "1px solid #141414", borderRadius: 16, padding: 22, ...extra };
}

function OverviewContent({ category, zone, method, variant }: { category: string | null; zone: string; method: string; variant: Variant }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <div style={card()}>
        <h2 style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>Executive Summary</h2>
        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.7 }}>
          Проект разработан для категории <strong style={{ color: "#fff" }}>{category}</strong> с адаптацией
          под зону <strong style={{ color: "#fff" }}>{zone}</strong> методом{" "}
          <strong style={{ color: "#0ff" }}>{method}</strong>. Синтез произведён на основе локального сырья
          Узбекистана с учётом экономической доступности и масштабируемости производства.
        </p>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <SL>Цели синтеза</SL>
            <p style={{ fontSize: 11, color: "#bbb", lineHeight: 1.6 }}>Создать материал с себестоимостью на 20% ниже аналогов при повышенных механических характеристиках.</p>
          </div>
          <div>
            <SL>Локальный базис</SL>
            <p style={{ fontSize: 11, color: "#bbb", lineHeight: 1.6 }}>Месторождения Бухарской, Самаркандской и Навоийской областей. Отходы промышленных производств.</p>
          </div>
        </div>
      </div>
      <div style={card({ background: "#060d0d" })}>
        <SL>Уникальность продукта</SL>
        <p style={{ fontSize: 13, color: "#ddd", fontStyle: "italic", lineHeight: 1.6, marginBottom: 22 }}>
          {variant.basis}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "#0a0a0a", borderRadius: 12, padding: 14 }}>
            <p style={{ fontSize: 26, fontWeight: 900, color: "#0ff" }}>250%</p>
            <SL>Прогноз ROI</SL>
            <p style={{ fontSize: 10, color: "#555" }}>при полной загрузке линии</p>
          </div>
          <div style={{ background: "#0a0a0a", borderRadius: 12, padding: 14 }}>
            <p style={{ fontSize: 26, fontWeight: 900 }}>8–12</p>
            <SL>Окупаемость</SL>
            <p style={{ fontSize: 10, color: "#555" }}>месяцев</p>
          </div>
        </div>
      </div>
      <div style={card({ gridColumn: "1 / -1" })}>
        <h2 style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", marginBottom: 18 }}>ОБЛАСТИ ПРИМЕНЕНИЯ</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { t: "Межкомнатные перегородки в ЖК", d: "Идеальный баланс цена/качество, высокая скорость монтажа (паз-гребень), не требует штукатурки." },
            { t: "Огнезащитная облицовка", d: "Базальт плавится при >1100°C. Гипс содержит кристаллизационную воду. Отличный огнеупорный барьер." },
            { t: "Вентиляционные короба", d: "Негорючесть и достаточная прочность для формирования технических шахт." },
          ].map((a) => (
            <div key={a.t} style={{ borderLeft: "2px solid #0ff4", paddingLeft: 14 }}>
              <p style={{ fontWeight: 700, fontSize: 11, marginBottom: 5 }}><span style={{ color: "#0ff" }}>∿</span> {a.t}</p>
              <p style={{ fontSize: 10, color: "#555", lineHeight: 1.6 }}>{a.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompositionContent({ matList }: { matList: string[] }) {
  // Build component table from actual input
  const pcts = matList.length === 1 ? [100] : matList.length === 2 ? [65, 35] : matList.length === 3 ? [65, 25, 10] : matList.map((_, i) => Math.round(100 / matList.length));
  const roles: Record<string, string> = {
    гипс: "Основное вяжущее вещество, формирующее матрицу.",
    базальт: "Микро-армирующий наполнитель, уплотнитель структуры.",
    глина: "Пластификатор, регулятор сроков схватывания.",
    цемент: "Вяжущее длительного твердения, основная прочность.",
    песок: "Инертный заполнитель, формирующий скелет.",
    полимер: "Модификатор адгезии и трещиностойкости.",
    "рдп": "Редиспергируемый порошок, повышает адгезию.",
    волокно: "Армирующий компонент, повышает вязкость разрушения.",
    известь: "Пластификатор, обеспечивает паропроницаемость.",
  };
  function getRole(mat: string): string {
    const m = mat.toLowerCase();
    for (const key of Object.keys(roles)) { if (m.includes(key)) return roles[key]; }
    return "Компонент смеси, выполняет технологическую функцию.";
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <div style={card()}>
        <h2 style={{ color: "#0ff", fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", marginBottom: 18 }}>АНАЛИЗ РЕЦЕПТУРЫ</h2>
        {matList.map((mat, i) => (
          <div key={i} style={{ borderBottom: "1px solid #0f0f0f", paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>{mat}</p>
                <p style={{ fontSize: 10, color: "#444", marginTop: 4, lineHeight: 1.5 }}>{getRole(mat)}</p>
              </div>
              <span style={{ fontWeight: 800, fontSize: 15, color: "#0ff", marginLeft: 14 }}>{pcts[i] ?? Math.round(100 / matList.length)}%</span>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px dashed #1a1a1a", paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 12 }}>Вода затворения</p>
              <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>Реагент для гидратации.</p>
            </div>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#0ff" }}>В/Т = 0.5–0.7</span>
          </div>
        </div>
      </div>
      <div style={card()}>
        <h2 style={{ color: "#0ff", fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", marginBottom: 18 }}>ХИМИЧЕСКАЯ СОВМЕСТИМОСТЬ</h2>
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 9, color: "#0ff", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 8 }}>СИНЕРГИЯ КОМПОНЕНТОВ:</p>
          <p style={{ fontSize: 11, color: "#888", lineHeight: 1.8, fontFamily: "monospace" }}>
            {matList[0]?.toUpperCase()} + H₂O → гидратация → набор прочности.<br />
            Наполнители уплотняют матрицу и снижают хрупкость.<br />
            Взаимодействие компонентов — физическое и химическое.
          </p>
        </div>
        <div style={{ background: "#040404", borderRadius: 10, padding: 14 }}>
          <SL>Теоретический инсайт</SL>
          <p style={{ fontSize: 11, color: "#888", lineHeight: 1.7, fontStyle: "italic", marginTop: 8 }}>
            Оптимальная зерновая упаковка с наполнителями разных фракций минимизирует пористость матрицы,
            повышая прочность и долговечность без увеличения расхода вяжущего.
          </p>
        </div>
      </div>
    </div>
  );
}

function BusinessContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={card()}>
        <h2 style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", marginBottom: 18 }}>UZBEKISTAN MARKET INTELLIGENCE</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { name: "Базальт (Навоийское месторождение)", src: "Navoi Mining & Metallurgical Combinat", price: "450 000", region: "Навоийская область" },
            { name: "Бентонитовая глина (Навбахор)", src: "UzBentonite Corp", price: "320 000", region: "Навоийская область" },
          ].map((m) => (
            <div key={m.name} style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 12, padding: 18 }}>
              <p style={{ fontWeight: 700, fontSize: 12 }}>{m.name}</p>
              <p style={{ fontSize: 9, color: "#444", marginTop: 4 }}>{m.src}</p>
              <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 18, fontWeight: 900, color: "#0ff" }}>{m.price} <span style={{ fontSize: 10, color: "#444" }}>UZS/тонна</span></p>
                <p style={{ fontSize: 8, color: "#444", letterSpacing: "0.15em", marginTop: 4 }}>STOCK: HIGH</p>
              </div>
              <p style={{ fontSize: 9, color: "#444", marginTop: 8 }}>Регион: {m.region} | Обновлено: 2026-01-28</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 9, color: "#222", marginTop: 10 }}>* Данные синхронизированы с реестром сырьевых ресурсов РУз.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={card()}>
          <h3 style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", marginBottom: 12 }}>ЭКОНОМИЧЕСКИЙ ПОТЕНЦИАЛ</h3>
          <p style={{ fontSize: 12, color: "#777", lineHeight: 1.7 }}>Высокий. Рынок Ташкента потребляет &gt;1 млн м² перегородок в год. Продукт конкурирует с кирпичом (дешевле работа) и ГКЛ (выше прочность).</p>
          <div style={{ marginTop: 14, borderLeft: "2px solid #0ff2", paddingLeft: 14 }}>
            <SL>Анализ себестоимости</SL>
            <p style={{ fontSize: 11, color: "#bbb", lineHeight: 1.6, fontWeight: 600 }}>Сырьевая себестоимость крайне низкая. Основные затраты — электроэнергия на помол и сушку.</p>
          </div>
        </div>
        <div style={card()}>
          <h3 style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.1em", marginBottom: 12 }}>МАСШТАБИРОВАНИЕ</h3>
          <p style={{ fontSize: 12, color: "#777", lineHeight: 1.7 }}>Масштабируется установкой дополнительных кассетных форм. Возможны мобильные мини-заводы на стройплощадках.</p>
          <p style={{ marginTop: 18, fontSize: 22, fontWeight: 900, color: "#0ff" }}>B2B / Gov</p>
          <SL>Целевой сектор</SL>
        </div>
      </div>
    </div>
  );
}

function LabContent() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <div style={card()}>
        <h2 style={{ fontWeight: 800, fontSize: 13, marginBottom: 18 }}>ВИЗУАЛИЗАЦИЯ МИКРОСТРУКТУРЫ</h2>
        <div style={{ height: 190, background: "#030b0b", borderRadius: 12, overflow: "hidden", position: "relative", marginBottom: 14 }}>
          {[[55,55],[115,38],[78,108],[158,78],[38,145],[138,145],[195,48],[188,125],[90,175],[160,165]].map(([x,y],i)=>(
            <div key={i} className="anim-pulse-glow" style={{ position:"absolute", left:x, top:y, width:9, height:9, borderRadius:"50%", background:"#0ff", boxShadow:"0 0 10px #0ff", animationDelay:`${i*0.28}s` }} />
          ))}
          <div style={{ position:"absolute", bottom:10, left:10, background:"#0ff2", border:"1px solid #0ff4", borderRadius:6, padding:"3px 8px", fontSize:8, letterSpacing:"0.12em" }}>LIVE_STREAM</div>
          <div style={{ position:"absolute", top:10, left:10, fontSize:9, color:"#0ff8" }}>ЗУМ: 1.0X</div>
        </div>
        <p style={{ fontSize: 9, color:"#444", lineHeight:1.6, letterSpacing:"0.08em", textTransform:"uppercase" }}>
          Игольчатые кристаллы дигидрата сульфата кальция обволакивают частицы наполнителя. STRUCTURAL_REFINEMENT_ACTIVE
        </p>
        <div style={{ display:"flex", gap:8, marginTop:14 }}>
          {["Футуристик","Термальный","Электронный","Атомный"].map((t,i)=>(
            <button key={t} style={{ background:i===0?"#141414":"none", border:"none", color:i===0?"#fff":"#333", fontSize:9, padding:"4px 10px", borderRadius:6, cursor:"pointer", fontWeight:600 }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={card()}>
        <h2 style={{ fontWeight:800, fontSize:13, letterSpacing:"0.1em", marginBottom:22 }}>MOLECULAR_LAB_ANALYSIS</h2>
        <div style={{ marginBottom:18 }}>
          <p style={{ fontSize:9, color:"#0ff", letterSpacing:"0.15em", fontWeight:700, marginBottom:8 }}>АТОМНАЯ СТРУКТУРА</p>
          <p style={{ fontSize:11, color:"#777", lineHeight:1.7 }}>Кристаллы вяжущего плотно обволакивают угловатые частицы наполнителя. Отсутствие химической связи компенсируется высокой шероховатостью поверхности.</p>
        </div>
        <div style={{ marginBottom:18 }}>
          <p style={{ fontSize:9, color:"#0ff", letterSpacing:"0.15em", fontWeight:700, marginBottom:8 }}>ДАННЫЕ СИМУЛЯЦИИ</p>
          <p style={{ fontSize:11, color:"#777", lineHeight:1.7 }}>МКЭ-моделирование показывает: трещина при нагрузке огибает частицы наполнителя, увеличивая путь разрушения (tortuosity) на 45%, что повышает вязкость разрушения.</p>
        </div>
        <div style={{ background:"#040404", borderRadius:10, padding:14 }}>
          <h3 style={{ fontWeight:700, fontSize:12, marginBottom:8 }}>ГИПОТЕЗЫ R&D</h3>
          <p style={{ fontSize:11, color:"#666", lineHeight:1.7, fontStyle:"italic" }}>Чистое вяжущее обладает низкой прочностью на изгиб и высокой хрупкостью. Традиционные наполнители (песок) снижают прочность сцепления матрицы. Микронаполнители решают эту проблему.</p>
        </div>
      </div>
    </div>
  );
}

function TechContent() {
  const steps = [
    { n:1, t:"Подготовка сырья", d:"Помол до фракции муки (<0.063 мм). Сушка компонентов.", c:"Контроль: Влажность наполнителей < 1%." },
    { n:2, t:"Сухое смешивание", d:"Смешивание компонентов в лопастном смесителе.", c:"Контроль: Гомогенность (коэффициент вариации < 5%)." },
    { n:3, t:"Затворение и литьё", d:"Добавление воды, перемешивание ≤2 мин, заливка в формы.", c:"Контроль: Начало схватывания 4–6 мин." },
    { n:4, t:"Виброуплотнение", d:"Кратковременная вибрация для удаления воздуха.", c:"Контроль: Не допустить расслоения." },
    { n:5, t:"Сушка", d:"Естественная или камерная сушка изделий.", c:"Контроль: Температура ≤60°C (риск дегидратации)." },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={card()}>
        <h2 style={{ fontWeight:800, fontSize:15, marginBottom:6 }}>ПРОМЫШЛЕННЫЙ РЕГЛАМЕНТ</h2>
        <SL>Технологическая цепочка синтеза</SL>
        <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:14 }}>
          {steps.map((s)=>(
            <div key={s.n} style={{ display:"flex", gap:18 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #0ff", color:"#0ff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, flexShrink:0 }}>{s.n}</div>
              <div style={{ flex:1, background:"#050505", borderRadius:10, padding:"12px 16px" }}>
                <p style={{ fontWeight:700, fontSize:12, marginBottom:5 }}>{s.t}</p>
                <p style={{ fontSize:10, color:"#666", marginBottom:8, lineHeight:1.6 }}>{s.d}</p>
                <span style={{ background:"#0ff1", border:"1px solid #0ff3", borderRadius:6, padding:"2px 8px", fontSize:9, color:"#0ff", letterSpacing:"0.1em", fontWeight:600, textTransform:"uppercase" }}>{s.c}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        <div style={card()}>
          <h3 style={{ fontWeight:800, fontSize:13, letterSpacing:"0.1em", marginBottom:14 }}>КАРТА ОБОРУДОВАНИЯ</h3>
          {[["Шаровая мельница","Производительность 2 т/ч, помол наполнителей."],["Смеситель принудительного действия","Двухвальный, объём 0.5 м³."],["Кассетная формовочная установка","Точность геометрии пазогребневых плит."],["Вибростол","50 Гц, амплитуда 0.5 мм."]].map(([n,d])=>(
            <div key={n} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 0", borderBottom:"1px solid #0a0a0a" }}>
              <span style={{ color:"#ff0", fontSize:14 }}>⚡</span>
              <div><p style={{ fontWeight:700, fontSize:11 }}>{n}</p><p style={{ fontSize:10, color:"#444" }}>{d}</p></div>
            </div>
          ))}
        </div>
        <div style={card()}>
          <h3 style={{ fontWeight:800, fontSize:13, letterSpacing:"0.1em", marginBottom:14 }}>ФИЗИКА СИНТЕЗА</h3>
          <p style={{ fontSize:11, color:"#777", lineHeight:1.8 }}>Растворение вяжущего → пересыщенный раствор → нуклеация на частицах наполнителя → рост кристаллов → срастание в монолит.</p>
          <div style={{ marginTop:18, background:"#040404", borderRadius:10, padding:14 }}>
            <SL>Суть процесса:</SL>
            <p style={{ fontSize:11, color:"#bbb", lineHeight:1.7, fontStyle:"italic", marginTop:8 }}>Ключ к успеху — гомогенное распределение тяжёлого наполнителя в лёгком вяжущем до начала схватывания.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestingContent({ onComplete }: { onComplete: () => void }) {
  const props = [
    { name:"Прочность при сжатии", gost:5, synth:11, range:"10–12 МПа", note:"Выше чистого вяжущего за счёт плотной упаковки.", impact:"Самонесущие перегородки до 4 м.", color:"#ff0" },
    { name:"Прочность при изгибе", gost:3, synth:5, range:"4.5–5.5 МПа", note:"Армирующий эффект наполнителя.", impact:"Транспортировка и монтаж без боя.", color:"#ff0" },
    { name:"Плотность", gost:900, synth:1300, range:"1250–1350 кг/м³", note:"Плюс для акустики, минус для логистики.", impact:"Звукоизоляция Rw > 43 дБ.", color:"#ff0" },
    { name:"Водопоглощение", gost:20, synth:13, range:"12–15 %", note:"Ниже за счёт заполнения пор.", impact:"Требует гидрофобизации для влажных зон.", color:"#ff0" },
  ];
  const max = 1400;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={card()}>
        <h2 style={{ fontWeight:800, fontSize:13, display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
          <span style={{ color:"#0ff" }}>∿</span> ПРОГНОЗ ФИЗИКО-МЕХАНИЧЕСКИХ СВОЙСТВ
        </h2>
        <div style={{ display:"flex", alignItems:"flex-end", gap:20, height:190, padding:"0 12px" }}>
          {props.map((p)=>{
            const gH=Math.max((p.gost/max)*170,4);
            const sH=Math.max((p.synth/max)*170,4);
            return (
              <div key={p.name} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1, gap:4 }}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:170 }}>
                  <div className="anim-bar-grow" style={{ width:26, height:gH, background:"#282828", borderRadius:"4px 4px 0 0" }} />
                  <div className="anim-bar-grow" style={{ width:26, height:sH, background:"#0ff", borderRadius:"4px 4px 0 0" }} />
                </div>
                <p style={{ fontSize:8, color:"#444", textAlign:"center", maxWidth:70, lineHeight:1.4 }}>{p.name}</p>
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:18, marginTop:12, paddingLeft:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ width:14, height:7, background:"#282828", borderRadius:2 }} /><span style={{ fontSize:9, color:"#444" }}>ГОСТ / СТАНДАРТ РУЗ</span></div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ width:14, height:7, background:"#0ff", borderRadius:2 }} /><span style={{ fontSize:9, color:"#0ff", fontWeight:700 }}>СИНТЕЗИРОВАННЫЙ ПОКАЗАТЕЛЬ</span></div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
        {props.map((p)=>(
          <div key={p.name} style={card()}>
            <span style={{ background:"#ff01", border:"1px solid #ff04", borderRadius:6, padding:"2px 8px", fontSize:8, color:"#ff0", letterSpacing:"0.1em", fontWeight:700, textTransform:"uppercase" }}>{p.impact}</span>
            <SL>{p.name}</SL>
            <p style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:4 }}>{p.range}</p>
            <p style={{ fontSize:10, color:"#444", lineHeight:1.6 }}>{p.note}</p>
          </div>
        ))}
      </div>
      <div style={{ background:"#070500", border:"1px solid #ff03", borderRadius:16, padding:22 }}>
        <h2 style={{ fontWeight:800, fontSize:13, letterSpacing:"0.1em", marginBottom:18, color:"#ff0", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:"#0ff" }}>∿</span> АНАЛИЗ ТЕХНОГЕННЫХ РИСКОВ
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:16 }}>
          <div><SL>Технические риски:</SL><p style={{ fontSize:11, color:"#777", lineHeight:1.7 }}>Нестабильность состава наполнителя может замедлять схватывание вяжущего.</p></div>
          <div><SL>Экологические риски:</SL><p style={{ fontSize:11, color:"#777", lineHeight:1.7 }}>Пыление при помоле мелких фракций. Необходимы средства защиты органов дыхания.</p></div>
        </div>
        <div style={{ background:"#ff01", border:"1px solid #ff03", borderRadius:10, padding:14 }}>
          <p style={{ fontSize:9, color:"#ff0", letterSpacing:"0.15em", fontWeight:700, marginBottom:8 }}>СТРАТЕГИЯ МИНИМИЗАЦИИ:</p>
          <p style={{ fontSize:11, color:"#ccc", lineHeight:1.7, fontStyle:"italic" }}>Входной контроль каждой партии (лабораторные пробы). Установка аспирационных систем и циклонов.</p>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"center", paddingTop:8 }}>
        <button onClick={onComplete} style={{ background:"#0ff", color:"#000", border:"none", borderRadius:50, padding:"18px 52px", fontSize:13, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
          ЗАВЕРШИТЬ СИНТЕЗ →
        </button>
      </div>
    </div>
  );
}

// ─────────────── COMPLETE ───────────────
function CompleteStep({ variant, category, materials, zone, method, onNewProject, onExport }: {
  variant: Variant; category: string | null; materials: string; zone: string | null; method: string | null;
  onNewProject: () => void; onExport: () => void;
}) {
  const zoneLabel = zone ? ZONES.find((z) => z.id === zone)?.label ?? zone : "Универсальное применение";
  return (
    <div className="anim-fade-in" style={{ maxWidth:860, margin:"0 auto", padding:"64px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:32 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:76, height:76, borderRadius:"50%", border:"2px solid #0ff", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", background:"#0ff08" }}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path d="M7 17l7 7 13-13" stroke="#0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 style={{ fontSize:"clamp(44px,8vw,84px)", fontWeight:900, letterSpacing:"-0.02em", lineHeight:0.92 }}>
          СИНТЕЗ<br /><span style={CY}>ЗАВЕРШЁН</span>
        </h1>
        <p style={{ color:"#444", letterSpacing:"0.2em", fontSize:10, marginTop:18, textTransform:"uppercase" }}>
          Molecular Engineering Core V2.4 // Production Ready
        </p>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:8, background:"#0ff1", border:"1px solid #0ff3", borderRadius:50, padding:"10px 24px" }}>
        <div className="anim-pulse-glow" style={{ width:8, height:8, borderRadius:"50%", background:"#0ff" }} />
        <span style={{ fontSize:12, fontWeight:800, letterSpacing:"0.15em", color:"#0ff" }}>ГОТОВ К ПРОИЗВОДСТВУ</span>
      </div>

      <div style={{ width:"100%", background:"#070707", border:"1px solid #141414", borderRadius:20, padding:26, display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        <div>
          <h2 style={{ fontWeight:800, fontSize:13, letterSpacing:"0.1em", marginBottom:18, color:"#0ff" }}>ПАРАМЕТРЫ СИНТЕЗА</h2>
          {[
            ["Категория", category ?? "—"],
            ["Компоненты", materials || "—"],
            ["Зона применения", zoneLabel],
            ["Метод синтеза", method === "nano" ? "Нано-метод" : "Обычный метод"],
          ].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #0f0f0f" }}>
              <span style={{ fontSize:10, color:"#444", letterSpacing:"0.1em", textTransform:"uppercase" }}>{l}</span>
              <span style={{ fontSize:11, color:"#fff", fontWeight:600, maxWidth:"55%", textAlign:"right" }}>{v}</span>
            </div>
          ))}
        </div>
        <div>
          <h2 style={{ fontWeight:800, fontSize:13, letterSpacing:"0.1em", marginBottom:18, color:"#0ff" }}>РЕКОМЕНДОВАННЫЙ ПРОДУКТ</h2>
          <div style={{ background:"#0f0f0f", borderRadius:12, padding:14, marginBottom:14 }}>
            <p style={{ fontWeight:800, fontSize:12, lineHeight:1.4 }}>{variant.name}</p>
          </div>
          {[
            ["Прогноз ROI","250%"],["Окупаемость","8–12 мес."],["Прочность при сжатии","10–12 МПа"],
            ["Прочность при изгибе","4.5–5.5 МПа"],["Плотность","1250–1350 кг/м³"],["Сертификация","ISO 9001 Ready"],
          ].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #0a0a0a" }}>
              <span style={{ fontSize:10, color:"#444" }}>{l}</span>
              <span style={{ fontSize:11, color:"#0ff", fontWeight:700 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width:"100%", background:"#050505", border:"1px solid #0f0f0f", borderRadius:16, padding:22 }}>
        <h2 style={{ fontWeight:800, fontSize:12, letterSpacing:"0.15em", marginBottom:18, textTransform:"uppercase" }}>Рекомендуемые следующие шаги</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {[
            { n:"01", t:"Лабораторный образец", d:"Изготовить пробную партию 50 кг согласно промышленному регламенту для физических испытаний." },
            { n:"02", t:"Сертификация", d:"Подать заявку в УЗДСТ для испытаний по ГОСТ и получения сертификата соответствия." },
            { n:"03", t:"Пилотное производство", d:"Запустить мини-линию мощностью 10 м²/смена для тестирования рынка Ташкента." },
          ].map((s)=>(
            <div key={s.n} style={{ padding:16, background:"#080808", borderRadius:12, borderTop:"2px solid #0ff2" }}>
              <p style={{ color:"#0ff", fontWeight:900, fontSize:18, marginBottom:6 }}>{s.n}</p>
              <p style={{ fontWeight:700, fontSize:11, marginBottom:6 }}>{s.t}</p>
              <p style={{ fontSize:10, color:"#444", lineHeight:1.6 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
        <button onClick={onExport} style={{ background:"#0ff", color:"#000", border:"none", borderRadius:50, padding:"16px 36px", fontSize:11, fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer" }}>
          ↓ ЭКСПОРТИРОВАТЬ PDF
        </button>
        <button onClick={()=>{ alert("Сохранено в архив. (Подключите Supabase для полноценного хранилища)"); }} style={{ background:"none", color:"#fff", border:"1px solid #222", borderRadius:50, padding:"16px 36px", fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer" }}>
          СОХРАНИТЬ В АРХИВ
        </button>
        <button onClick={onNewProject} style={{ background:"none", color:"#444", border:"1px solid #111", borderRadius:50, padding:"16px 36px", fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer" }}>
          НОВЫЙ СИНТЕЗ
        </button>
      </div>

      <p style={{ fontSize:8, color:"#1a1a1a", letterSpacing:"0.2em", textTransform:"uppercase", textAlign:"center" }}>
        STROYGEN R&D PLATFORM // MOLECULAR ENGINEERING CORE V2.4 // {new Date().toLocaleDateString("ru-RU")}
      </p>
    </div>
  );
}

// ─────────────── PRINT content ───────────────
function PrintContent({ variant, category, materials, zone, method }: { variant: Variant | null; category: string | null; materials: string; zone: string | null; method: string | null }) {
  if (!variant) return null;
  const zoneLabel = zone ? ZONES.find((z) => z.id === zone)?.label ?? zone : "Универсальное применение";
  return (
    <div id="print-content" className="print-only" style={{ fontFamily:"Arial,sans-serif", padding:40, color:"#000", background:"#fff" }}>
      <div style={{ borderBottom:"3px solid #000", paddingBottom:14, marginBottom:22 }}>
        <h1 style={{ fontSize:26, fontWeight:900, margin:0 }}>STROYGEN CORE</h1>
        <p style={{ color:"#666", fontSize:10, letterSpacing:"0.15em", margin:"4px 0 0" }}>ИНЖЕНЕРНЫЙ СИНТЕЗ-ОТЧЁТ // ISO_9001_READY</p>
      </div>
      <h2 style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>{variant.name}</h2>
      <p style={{ fontSize:11, color:"#666", marginBottom:22 }}>
        Категория: {category} | Метод: {method==="nano"?"Нано-метод":"Обычный метод"} | Зона: {zoneLabel}
      </p>
      <h3 style={{ fontSize:13, borderBottom:"1px solid #ccc", paddingBottom:5, marginBottom:10 }}>Исходные компоненты</h3>
      <p style={{ fontSize:12, marginBottom:20 }}>{materials || "—"}</p>
      <h3 style={{ fontSize:13, borderBottom:"1px solid #ccc", paddingBottom:5, marginBottom:10 }}>Физико-механические свойства</h3>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, marginBottom:20 }}>
        <thead><tr style={{ background:"#f5f5f5" }}>
          <th style={{ padding:"7px 10px", textAlign:"left", border:"1px solid #ddd" }}>Показатель</th>
          <th style={{ padding:"7px 10px", textAlign:"right", border:"1px solid #ddd" }}>ГОСТ</th>
          <th style={{ padding:"7px 10px", textAlign:"right", border:"1px solid #ddd" }}>Синтезировано</th>
        </tr></thead>
        <tbody>
          {[["Прочность при сжатии","5 МПа","10–12 МПа"],["Прочность при изгибе","3.15 МПа","4.5–5.5 МПа"],["Плотность","900 кг/м³","1250–1350 кг/м³"],["Водопоглощение","20%","12–15%"]].map(([n,g,s])=>(
            <tr key={n}><td style={{ padding:"7px 10px", border:"1px solid #ddd" }}>{n}</td><td style={{ padding:"7px 10px", border:"1px solid #ddd", textAlign:"right", color:"#666" }}>{g}</td><td style={{ padding:"7px 10px", border:"1px solid #ddd", textAlign:"right", fontWeight:700 }}>{s}</td></tr>
          ))}
        </tbody>
      </table>
      <h3 style={{ fontSize:13, borderBottom:"1px solid #ccc", paddingBottom:5, marginBottom:10 }}>Экономика</h3>
      <p style={{ fontSize:12, marginBottom:6 }}>Прогноз ROI: <strong>250%</strong></p>
      <p style={{ fontSize:12, marginBottom:22 }}>Срок окупаемости: <strong>8–12 месяцев</strong></p>
      <div style={{ borderTop:"2px solid #000", paddingTop:14, display:"flex", justifyContent:"space-between", fontSize:9, color:"#999" }}>
        <span>© 2024 STROYGEN OMNI-MIND</span>
        <span>CERTIFICATION: ISO_9001_READY</span>
        <span>Сгенерировано: {new Date().toLocaleString("ru-RU")}</span>
      </div>
    </div>
  );
}

// ─────────────── MAIN ───────────────
export default function Page() {
  const [step, setStep] = useState<Step>("home");
  const [category, setCategory] = useState<string | null>(null);
  const [materials, setMaterials] = useState("");
  const [zone, setZone] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [reportTab, setReportTab] = useState<ReportTab>("overview");
  const [favorites, setFavorites] = useState([false, false, false]);

  // Loading animation → auto-advance to variants
  useEffect(() => {
    if (step !== "loading") return;
    setProgress(0);
    let n = 0;
    const t = setInterval(() => {
      n++;
      setProgress(n);
      if (n >= LOADING_STEPS.length) {
        clearInterval(t);
        // Generate variants based on inputs
        const generated = generateVariants(category ?? "", materials);
        setVariants(generated);
        setFavorites(generated.map(() => false));
        setTimeout(() => setStep("variants"), 500);
      }
    }, 900);
    return () => clearInterval(t);
  }, [step, category, materials]);

  const reset = () => {
    setStep("home");
    setCategory(null);
    setMaterials("");
    setZone(null);
    setMethod(null);
    setProgress(0);
    setVariants([]);
    setSelectedIdx(0);
    setReportTab("overview");
  };

  const handleExport = () => window.print();

  const showNew = step !== "home" && step !== "input";

  return (
    <>
      <PrintContent variant={variants[selectedIdx] ?? null} category={category} materials={materials} zone={zone} method={method} />
      <div className="no-print" style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        <Header onNew={reset} showNew={showNew} />
        <main style={{ flex:1 }}>
          {step === "home" && <HomeStep selected={category} onSelect={(c) => { setCategory(c); setStep("input"); }} />}
          {step === "input" && <InputStep category={category} value={materials} onChange={setMaterials} onNext={() => setStep("zone")} onBack={() => setStep("home")} />}
          {step === "zone" && <ZoneStep onSelect={(z) => { setZone(z); setStep("method"); }} onSkip={() => { setZone(null); setStep("method"); }} onBack={() => setStep("input")} />}
          {step === "method" && <MethodStep onSelect={(m) => { setMethod(m); setStep("loading"); }} onBack={() => setStep("zone")} />}
          {step === "loading" && <LoadingStep progress={progress} />}
          {step === "variants" && <VariantsStep variants={variants} zone={zone} method={method} onSelect={(i) => { setSelectedIdx(i); setReportTab("overview"); setStep("report"); }} favorites={favorites} onFavorite={(i) => setFavorites((f) => f.map((v,j)=>j===i?!v:v))} />}
          {step === "report" && variants[selectedIdx] && (
            <ReportStep variant={variants[selectedIdx]} category={category} materials={materials} zone={zone} method={method} tab={reportTab} onTabChange={setReportTab} onBack={() => setStep("variants")} onExport={handleExport} onComplete={() => setStep("complete")} />
          )}
          {step === "complete" && variants[selectedIdx] && (
            <CompleteStep variant={variants[selectedIdx]} category={category} materials={materials} zone={zone} method={method} onNewProject={reset} onExport={handleExport} />
          )}
        </main>
      </div>
    </>
  );
}
