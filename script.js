// Celedo Core Interactive Application Logic

// Premium subscription state
let IS_PREMIUM = false;
let selectedPremiumPlan = "monthly";
let freeFitUsageCount = parseInt(
  localStorage.getItem("celedo-free-fit-usage-count") || "0",
);
const FREE_FIT_LIMIT = 3;

// Applied Credit/Points tracking
let APPLIED_CREDIT_USED = 0;
let APPLIED_CREDIT_DISCOUNT = 0;
let LAST_ORDER_CREDIT_USED = 0;
let LAST_ORDER_CREDIT_DISCOUNT = 0;

try {
  const savedPremium = localStorage.getItem("celedo-is-premium");
  if (savedPremium === "true") {
    IS_PREMIUM = true;
  }
} catch (e) {
  console.error("Failed to load premium state:", e);
}

// Global user profile state (My Size)
let USER_MY_FIT = {
  name: "김민수",
  gender: "male",
  height: 178,
  weight: 68,
  shoulder: 49.0,
  chest: 57.0,
  sleeve: 61.5,
  length: 68.0,
  face: 22.0,
  upperBody: 65.0,
  lowerBody: 95.0,
};
try {
  const savedSpecs = localStorage.getItem("celedo-user-fit");
  if (savedSpecs) {
    USER_MY_FIT = JSON.parse(savedSpecs);
  }
} catch (e) {
  console.error("Failed to load user fit specs from localStorage:", e);
}
// Global Shopping Cart State
let CART_DATA = [
  {
    id: 1,
    productId: 1, // 그레이 오버핏 미니멀 블루종
    size: "S",
    checked: true,
    fitVerified: true,
  },
  {
    id: 2,
    productId: 2, // 다크그레이 실켓 부클 가디건
    size: "M",
    checked: true,
    fitVerified: false,
  },
];

// Product and Creator Integrated Database
const MIRROR_FEED_DATA = [
  {
    id: 1,
    gender: "male",
    tpo: ["work", "date"],
    style: "minimal",
    title: "그레이 오버핏 미니멀 블루종",
    brand: "Celedo Premium",
    price: 89000,
    creator: "@Creator_MinSu",
    matchRate: 96,
    height: 178,
    weight: 68,
    bone: "웨이브 체형",
    img: "assets/Celedo_creator_1.png",
    caption:
      "콘크리트 배경에서 회색 유틸리티 재킷과 차콜 슬랙스, 투박한 스니커즈를 매치해 차분하고 현대적인 미니멀리즘을 보여줍니다.",
    fabric: "면 100% 프리미엄 테리 코튼",
    care: "찬물 단독 손세탁, 건조기 사용 금지",
    sizeSpec: {
      S: { shoulder: 47.0, chest: 54.0, sleeve: 59.5, length: 66.0 },
      M: { shoulder: 49.0, chest: 56.5, sleeve: 61.0, length: 68.0 },
      L: { shoulder: 51.0, chest: 59.0, sleeve: 62.5, length: 70.0 },
      XL: { shoulder: 53.0, chest: 61.5, sleeve: 64.0, length: 72.0 },
    },
    shrinkage: -1.2,
  },
  {
    id: 2,
    gender: "female",
    tpo: ["wedding", "date"],
    style: "cityboy",
    title: "어반 시티 터틀넥 니트",
    brand: "Aesthetic Atelier",
    price: 79000,
    creator: "@Aesthetic_Yoon",
    matchRate: 94,
    height: 165,
    weight: 50,
    bone: "스트레이트 체형",
    img: "assets/Celedo_creator_2.png",
    caption:
      "도시의 석양을 배경으로 아늑한 짙은 녹색 터틀넥 니트와 대조되는 시원한 남색 와이드 팬츠로 세련된 시티뷰 가든 룩을 연출했습니다.",
    fabric: "울 70%, 아크릴 30% 소프트 부클",
    care: "드라이클리닝 전용, 절대로 물세탁 금지",
    sizeSpec: {
      S: { shoulder: 43.0, chest: 50.0, sleeve: 58.0, length: 63.0 },
      M: { shoulder: 45.0, chest: 52.5, sleeve: 59.5, length: 65.0 },
      L: { shoulder: 47.0, chest: 55.0, sleeve: 61.0, length: 67.0 },
      XL: { shoulder: 49.0, chest: 57.5, sleeve: 62.5, length: 69.0 },
    },
    shrinkage: -3.2,
  },
  {
    id: 3,
    gender: "male",
    tpo: ["outdoor"],
    style: "street",
    title: "카키 스트링 나일론 오버 아노락",
    brand: "Outdoor Tech",
    price: 98000,
    creator: "@SangHoon",
    matchRate: 92,
    height: 178,
    weight: 68,
    bone: "웨이브 체형",
    img: "assets/Celedo_creator_3.png",
    caption:
      "현대적인 거리 배경에서 머리부터 발끝까지 짙은 올리브 그린 톤의 실용적인 테크웨어와 크로스바디백으로 현대적인 스트릿 스타일을 표현했습니다.",
    fabric: "나일론 100% 방풍 테크 원사",
    care: "찬물 표준 기계 세탁 가능, 저온 건조기 사용 권장",
    sizeSpec: {
      S: { shoulder: 49.0, chest: 57.0, sleeve: 60.0, length: 67.0 },
      M: { shoulder: 51.5, chest: 59.5, sleeve: 61.5, length: 69.0 },
      L: { shoulder: 54.0, chest: 62.0, sleeve: 63.0, length: 71.0 },
      XL: { shoulder: 56.5, chest: 64.5, sleeve: 64.5, length: 73.0 },
    },
    shrinkage: -0.1,
  },
  {
    id: 4,
    gender: "male",
    tpo: ["wedding", "work"],
    style: "dandy",
    title: "클래식 링클프리 싱글 코트",
    brand: "Credo Tailor",
    price: 189000,
    creator: "@Modern_JaeWook",
    // premium: true,
    matchRate: 95,
    height: 181,
    weight: 73,
    bone: "내추럴 체형",
    img: "assets/Celedo_creator_4.png",
    caption:
      "따뜻한 지중해 가든 배경에서 고급스러운 네이비 롱 코트, 카멜 터틀넥, 어두운 그레이 슬랙스로 클래식하고 우아한 분위기를 자아냅니다.",
    fabric: "울 50%, 폴리에스터 50% 프리미엄 방모사",
    care: "드라이클리닝 전용, 손세탁 금지",
    sizeSpec: {
      S: { shoulder: 48.0, chest: 56.0, sleeve: 61.0, length: 82.0 },
      M: { shoulder: 50.0, chest: 58.5, sleeve: 62.5, length: 84.0 },
      L: { shoulder: 52.0, chest: 61.0, sleeve: 64.0, length: 86.0 },
      XL: { shoulder: 54.0, chest: 63.5, sleeve: 65.5, length: 88.0 },
    },
    shrinkage: -0.5,
  },
  {
    id: 5,
    gender: "female",
    tpo: ["work", "wedding"],
    style: "minimal",
    title: "클래식 네이비 롱 코트",
    brand: "Celedo Premium",
    price: 195000,
    creator: "@Fall_In_City",
    // premium: true,
    matchRate: 95,
    height: 176,
    weight: 65,
    bone: "웨이브 체형",
    img: "assets/Celedo_creator_5.png",
    caption:
      "다채로운 단풍 거리에서 아이보리 니트, 네이비 롱 코트, 그레이 슬랙스, 블랙 가방을 매치해 완벽한 가을 데일리 룩을 선보입니다.",
    fabric: "울 80%, 나일론 20% 프리미엄 더블 블렌드",
    care: "드라이클리닝 전용, 물세탁 금지",
    sizeSpec: {
      S: { shoulder: 46.0, chest: 54.0, sleeve: 60.0, length: 84.0 },
      M: { shoulder: 48.0, chest: 56.5, sleeve: 61.5, length: 86.0 },
      L: { shoulder: 50.0, chest: 59.0, sleeve: 63.0, length: 88.0 },
      XL: { shoulder: 52.0, chest: 61.5, sleeve: 64.5, length: 90.0 },
    },
    shrinkage: -0.4,
  },
  {
    id: 6,
    gender: "female",
    tpo: ["date", "work"],
    style: "preppy",
    title: "코발트 블루 케이블 니트",
    brand: "Celedo Premium",
    price: 58000,
    creator: "@Campus_Life",
    matchRate: 93,
    height: 172,
    weight: 60,
    bone: "스트레이트 체형",
    img: "assets/Celedo_creator_6.png",
    caption:
      "유서 깊은 캠퍼스 배경에서 생기 넘치는 파란색 케이블 니트와 밝은 데님, 캔버스 백으로 활기찬 대학생 룩을 완성했습니다.",
    fabric: "면 60%, 아크릴 40% 부드러운 케이블사",
    care: "찬물 단독 손세탁, 평평하게 뉘어서 건조",
    sizeSpec: {
      S: { shoulder: 46.0, chest: 53.0, sleeve: 59.0, length: 64.0 },
      M: { shoulder: 48.0, chest: 55.5, sleeve: 60.5, length: 66.0 },
      L: { shoulder: 50.0, chest: 58.0, sleeve: 62.0, length: 68.0 },
      XL: { shoulder: 52.0, chest: 60.5, sleeve: 63.5, length: 70.0 },
    },
    shrinkage: -2.5,
  },
  {
    id: 7,
    gender: "male",
    tpo: ["work", "date"],
    style: "street",
    title: "오버핏 크로스오버 블레이저 자켓",
    brand: "Celedo Premium",
    price: 128000,
    creator: "@Hiphop_Office",
    premium: true,
    matchRate: 94,
    height: 179,
    weight: 71,
    bone: "스트레이트 체형",
    img: "assets/Celedo_creator_7.png",
    caption:
      "모던한 오피스 복도 배경에서 포멀한 수트 블레이저 자켓과 루즈한 힙합 카고 팬츠, 크로스백을 매치해 위트 있는 오피스 힙합 크로스오버 룩을 보여줍니다.",
    fabric: "폴리에스터 70%, 울 30% 방직 원단",
    care: "드라이클리닝 전용, 물세탁 금지",
    sizeSpec: {
      S: { shoulder: 48.0, chest: 56.0, sleeve: 60.5, length: 74.0 },
      M: { shoulder: 50.0, chest: 58.5, sleeve: 62.0, length: 76.0 },
      L: { shoulder: 52.0, chest: 61.0, sleeve: 63.5, length: 78.0 },
      XL: { shoulder: 54.0, chest: 63.5, sleeve: 65.0, length: 80.0 },
    },
    shrinkage: -0.4,
  },
  {
    id: 8,
    gender: "male",
    tpo: ["work", "wedding"],
    style: "minimal",
    title: "클래식 네이비 수트 자켓",
    brand: "Credo Tailor",
    price: 154000,
    creator: "@Professional_Kim",
    matchRate: 92,
    height: 180,
    weight: 72,
    bone: "내추럴 체형",
    img: "assets/Celedo_creator_8.png",
    caption:
      "모던한 오피스 로비에서 깔끔한 흰색 셔츠와 네이비 수트로 세련되고 프로페셔널한 비즈니스 룩을 보여줍니다.",
    fabric: "폴리에스터 65%, 레이온 30%, 스판 5%",
    care: "드라이클리닝 권장, 저온 스팀 스티칭 가능",
    sizeSpec: {
      S: { shoulder: 45.0, chest: 52.0, sleeve: 61.0, length: 72.0 },
      M: { shoulder: 47.0, chest: 54.5, sleeve: 62.5, length: 74.0 },
      L: { shoulder: 49.0, chest: 57.0, sleeve: 64.0, length: 76.0 },
      XL: { shoulder: 51.0, chest: 59.5, sleeve: 65.5, length: 78.0 },
    },
    shrinkage: -0.4,
  },
  {
    id: 9,
    gender: "female",
    tpo: ["date", "outdoor"],
    style: "casual",
    title: "라이트 블루 프리미엄 리넨 셔츠",
    brand: "Celedo Premium",
    price: 64000,
    creator: "@Summer_Comfort",
    matchRate: 94,
    height: 175,
    weight: 63,
    bone: "스트레이트 체형",
    img: "assets/Celedo_creator_9.png",
    caption:
      "따뜻한 분위기의 지중해 스타일 배경에서 밝은 하늘색 리넨 셔츠와 흰색 반바지, 브라운 샌들로 시원하고 편안한 여름 스타일을 연출했습니다.",
    fabric: "리넨 100% 천연 리넨 원사",
    care: "찬물 단독 손세탁, 건조기 사용 절대 금지",
    sizeSpec: {
      S: { shoulder: 44.0, chest: 51.0, sleeve: 58.5, length: 66.0 },
      M: { shoulder: 46.0, chest: 53.5, sleeve: 60.0, length: 68.0 },
      L: { shoulder: 48.0, chest: 56.0, sleeve: 61.5, length: 70.0 },
      XL: { shoulder: 50.0, chest: 58.5, sleeve: 63.0, length: 72.0 },
    },
    shrinkage: -2.8,
  },
  {
    id: 10,
    gender: "male",
    tpo: ["work", "date"],
    style: "amekaji",
    title: "헤비 캔버스 베이지 워크 재킷",
    brand: "Celedo Premium",
    price: 115000,
    creator: "@Amekaji_Boy",
    matchRate: 93,
    height: 176,
    weight: 66,
    bone: "내추럴 체형",
    img: "assets/Celedo_creator_10.png",
    caption:
      "고풍스러운 벽돌 골목길을 배경으로 빈티지한 베이지 워크웨어 재킷과 타탄 체크 셔츠, 와이드 네이비 팬츠를 매치해 차분하고 내추럴한 아메카지 감성을 연출했습니다.",
    fabric: "면 100% 헤비 캔버스 원단",
    care: "단독 손세탁 권장, 자연 건조",
    sizeSpec: {
      S: { shoulder: 48.0, chest: 56.0, sleeve: 60.0, length: 68.0 },
      M: { shoulder: 50.0, chest: 58.5, sleeve: 61.5, length: 70.0 },
      L: { shoulder: 52.0, chest: 61.0, sleeve: 63.0, length: 72.0 },
      XL: { shoulder: 54.0, chest: 63.5, sleeve: 64.5, length: 74.0 },
    },
    shrinkage: -1.0,
  },
  {
    id: 11,
    gender: "female",
    tpo: ["date"],
    style: "highteen",
    title: "크롭 파스텔 가디건 & 체크 스커트 세트",
    brand: "Aesthetic Atelier",
    price: 69000,
    creator: "@HighTeen_Idol",
    premium: true,
    matchRate: 95,
    height: 163,
    weight: 47,
    bone: "웨이브 체형",
    img: "assets/Celedo_creator_11.png",
    caption:
      "비비드한 컬러풀 락커룸 앞에서 파스텔 옐로우 크롭 가디건과 블루 체크 미니스커트를 매치해 발랄하고 상큼한 K-POP 하이틴 룩을 완성했습니다.",
    fabric: "아크릴 80%, 폴리에스터 20% 소프트 니트",
    care: "중성세제 찬물 세탁, 비틀어 짜기 금지",
    sizeSpec: {
      S: { shoulder: 38.0, chest: 44.0, sleeve: 57.0, length: 42.0 },
      M: { shoulder: 40.0, chest: 46.5, sleeve: 58.5, length: 44.0 },
      L: { shoulder: 42.0, chest: 49.0, sleeve: 60.0, length: 46.0 },
      XL: { shoulder: 44.0, chest: 51.5, sleeve: 61.5, length: 48.0 },
    },
    shrinkage: -2.1,
  },
  {
    id: 12,
    gender: "male",
    tpo: ["outdoor"],
    style: "gorpcore",
    title: "올리브 그린 멀티포켓 테크니컬 재킷",
    brand: "Outdoor Tech",
    price: 145000,
    creator: "@Mountain_Gorp",
    matchRate: 91,
    height: 182,
    weight: 75,
    bone: "스트레이트 체형",
    img: "assets/Celedo_creator_12.png",
    caption:
      "노을 지는 운치 있는 산 정상에서 짙은 올리브 그린 테크니컬 재킷과 스트랩 카고 팬츠를 매치해 남성적이고 강인한 정통 고프코어 스타일을 보여줍니다.",
    fabric: "나일론 100% 기능성 방수 원사",
    care: "기계 세탁 가능, 섬유유연제 사용 금지",
    sizeSpec: {
      S: { shoulder: 50.0, chest: 58.0, sleeve: 61.0, length: 70.0 },
      M: { shoulder: 52.0, chest: 60.5, sleeve: 62.5, length: 72.0 },
      L: { shoulder: 54.0, chest: 63.0, sleeve: 64.0, length: 74.0 },
      XL: { shoulder: 56.0, chest: 65.5, sleeve: 65.5, length: 76.0 },
    },
    shrinkage: -0.2,
  },
  {
    id: 13,
    gender: "female",
    tpo: ["date", "work"],
    style: "amekaji",
    title: "오버핏 인디고 데념 오버셔츠",
    brand: "Celedo Premium",
    price: 79000,
    creator: "@Amekaji_Girl",
    matchRate: 94,
    height: 167,
    weight: 52,
    bone: "내추럴 체형",
    img: "assets/Celedo_creator_13.png",
    caption:
      "친근하고 정겨운 동네 길거리를 배경으로 짙은 인디고 데님 오버셔츠와 머스터드 셔츠, 브라운 코듀로이 와이드 팬츠를 단정하게 매치하여 서정적이고 감성적인 아메카지 스타일을 보여줍니다.",
    fabric: "헤비 인디고 데님 면 100%",
    care: "이염 방지를 위한 단독 세탁 필수",
    sizeSpec: {
      S: { shoulder: 46.0, chest: 52.0, sleeve: 58.0, length: 71.0 },
      M: { shoulder: 48.0, chest: 54.5, sleeve: 59.5, length: 73.0 },
      L: { shoulder: 50.0, chest: 57.0, sleeve: 61.0, length: 75.0 },
      XL: { shoulder: 52.0, chest: 59.5, sleeve: 62.5, length: 77.0 },
    },
    shrinkage: -1.5,
  },
  {
    id: 14,
    gender: "male",
    tpo: ["outdoor", "date"],
    style: "highteen",
    title: "지오메트릭 컬러블록 테크 트랙 재킷",
    brand: "Aesthetic Atelier",
    price: 92000,
    creator: "@Retro_Hype",
    matchRate: 92,
    height: 179,
    weight: 70,
    bone: "스트레이트 체형",
    img: "assets/Celedo_creator_14.png",
    caption:
      "화려한 밤거리를 배경으로 청록색과 오렌지색 배색이 돋보이는 테크니컬 트랙 재킷과 블랙 메쉬 레이어드 톱을 활용해 트렌디하고 카리스마 넘치는 하이틴 스트릿 스타일을 제안합니다.",
    fabric: "나일론 100% 고밀도 타슬란 원단",
    care: "찬물 전용 가벼운 기계 세탁 가능",
    sizeSpec: {
      S: { shoulder: 52.0, chest: 59.0, sleeve: 59.5, length: 66.0 },
      M: { shoulder: 54.0, chest: 61.5, sleeve: 61.0, length: 68.0 },
      L: { shoulder: 56.0, chest: 64.0, sleeve: 62.5, length: 70.0 },
      XL: { shoulder: 58.0, chest: 66.5, sleeve: 64.0, length: 72.0 },
    },
    shrinkage: -0.5,
  },
  {
    id: 15,
    gender: "female",
    tpo: ["outdoor"],
    style: "gorpcore",
    title: "올블랙 아티큘레이티드 모듈러 재킷",
    brand: "Outdoor Tech",
    price: 168000,
    creator: "@River_Tech",
    matchRate: 96,
    height: 168,
    weight: 54,
    bone: "스트레이트 체형",
    img: "assets/Celedo_creator_15.png",
    caption:
      "탁 트인 현대적인 한강 도로변을 배경으로 올블랙 멀티 포켓 모듈러 재킷과 기능성 테크 하이킹 팬츠를 착용해, 도심 속 일상에서도 자연스럽고 세련되게 어우러지는 고프코어 스타일을 밝은 표정으로 선보입니다.",
    fabric: "폴리에스터 100% 방수 및 발수 특수 가공 원단",
    care: "찬물 울코스 전용 세탁 및 그늘 건조",
    sizeSpec: {
      S: { shoulder: 45.0, chest: 53.0, sleeve: 59.5, length: 67.0 },
      M: { shoulder: 47.0, chest: 55.5, sleeve: 61.0, length: 69.0 },
      L: { shoulder: 49.0, chest: 58.0, sleeve: 62.5, length: 71.0 },
      XL: { shoulder: 51.0, chest: 60.5, sleeve: 64.0, length: 73.0 },
    },
    shrinkage: -0.3,
  },
];

// Active State Variables
let activeTPO = "work";
let activeStyle = "casual";
let activeProductDetail = null; // Stores current product object in modal
let activeSelectedSize = "M";
let rankingFilterMode = "all"; // 'all' or 'mybody'
let reelsFilterMode = "mygender"; // 'all' or 'mygender'

// Theme Toggle Handler
function toggleTheme() {
  const body = document.body;
  const container = document.getElementById("phoneContainer");
  const toggleBtn = document.getElementById("themeToggleBtn");
  const sunIcon = toggleBtn.querySelector(".sun-icon");
  const moonIcon = toggleBtn.querySelector(".moon-icon");

  body.classList.toggle("light-theme");
  container.classList.toggle("light-theme");

  const isLight = container.classList.contains("light-theme");
  localStorage.setItem("celedo-theme", isLight ? "light" : "dark");

  if (isLight) {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  } else {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  }
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("celedo-theme");
  const container = document.getElementById("phoneContainer");
  if (!container) return;
  const toggleBtn = document.getElementById("themeToggleBtn");
  if (!toggleBtn) return;
  const sunIcon = toggleBtn.querySelector(".sun-icon");
  const moonIcon = toggleBtn.querySelector(".moon-icon");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    container.classList.add("light-theme");
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  } else {
    document.body.classList.remove("light-theme");
    container.classList.remove("light-theme");
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  }
}

// Live Time Synchronizer
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("liveTime").textContent = hours + ":" + minutes;
}
setInterval(updateClock, 1000);
updateClock();

// Tab Switcher with Real-time Data Initialization
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-bar .nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      const targetTabId = item.getAttribute("data-tab");
      document.querySelectorAll(".section-tab").forEach((tab) => {
        tab.classList.remove("active");
      });

      const targetTab = document.getElementById(targetTabId);
      if (targetTab) {
        targetTab.classList.add("active");
      }

      // Live populate data per active tab
      if (targetTabId === "tab-home") {
        initMirrorViewGrid();
      } else if (targetTabId === "tab-reels") {
        initReelsFeed();
      } else if (targetTabId === "tab-ranking") {
        initRankingList();
      } else if (targetTabId === "tab-cart") {
        initCartView();
      }
    });
  });
}

// ---------------- TAB 1: HOME (MIRROR VIEW GRID) ----------------
const STYLE_NAMES = {
  casual: "캐주얼",
  minimal: "미니멀",
  dandy: "댄디",
  street: "스트릿",
  amekaji: "아메카지",
  preppy: "프레피",
  highteen: "하이틴",
  gorpcore: "고프코어",
  cityboy: "시티보이",
};

function updateStyleToggles() {
  const container = document.querySelector(".style-toggle-container");
  if (!container) return;

  // Find unique styles available for current activeTPO (supports array of TPOs)
  let availableStyles = Array.from(
    new Set(
      MIRROR_FEED_DATA.filter((item) =>
        Array.isArray(item.tpo)
          ? item.tpo.includes(activeTPO)
          : item.tpo === activeTPO,
      ).map((item) => item.style),
    ),
  );

  if (availableStyles.length === 0) {
    availableStyles = Object.keys(STYLE_NAMES);
  }

  container.innerHTML = "";

  // If the activeStyle is not among available ones, reset to first available
  if (!availableStyles.includes(activeStyle)) {
    activeStyle = availableStyles[0];
  }

  availableStyles.forEach((styleKey) => {
    const btn = document.createElement("button");
    const isActive = activeStyle === styleKey;
    btn.className = `style-toggle-btn ${isActive ? "active" : ""}`;
    btn.onclick = () => selectStyle(styleKey, btn);
    btn.textContent = STYLE_NAMES[styleKey] || styleKey;
    container.appendChild(btn);
  });
}

function selectTPO(tpoKey, el) {
  document.querySelectorAll("#tarotCardPack .tarot-card").forEach((card) => {
    card.classList.remove("selected");
  });
  el.classList.add("selected");
  activeTPO = tpoKey;
  updateStyleToggles();
  initMirrorViewGrid();
}

function selectStyle(styleKey, el) {
  document
    .querySelectorAll(".style-toggle-container .style-toggle-btn")
    .forEach((btn) => {
      btn.classList.remove("active");
    });
  el.classList.add("active");
  activeStyle = styleKey;
  initMirrorViewGrid();
}

function initMirrorViewGrid() {
  const grid = document.getElementById("mirrorViewGrid");
  if (!grid) return;
  grid.innerHTML = "";

  // Filter by style and TPO across all genders (strict AND, supports TPO array)
  let filtered = MIRROR_FEED_DATA.filter(
    (item) =>
      item.style === activeStyle &&
      (Array.isArray(item.tpo)
        ? item.tpo.includes(activeTPO)
        : item.tpo === activeTPO),
  );
  if (filtered.length === 0) {
    // Fallback to OR if no exact intersection matches
    filtered = MIRROR_FEED_DATA.filter(
      (item) =>
        item.style === activeStyle ||
        (Array.isArray(item.tpo)
          ? item.tpo.includes(activeTPO)
          : item.tpo === activeTPO),
    );
  }
  if (filtered.length === 0) {
    filtered = MIRROR_FEED_DATA; // absolute fallback
  }

  // Sort so that items matching the user's gender come first
  filtered.sort((a, b) => {
    const aMatch = a.gender === USER_MY_FIT.gender ? 1 : 0;
    const bMatch = b.gender === USER_MY_FIT.gender ? 1 : 0;
    return bMatch - aMatch;
  });

  filtered.forEach((item, index) => {
    // Calculate custom matching score dynamically based on user's current specs
    const match = calculateBodyMatchRate(item.sizeSpec.M);

    const card = document.createElement("div");
    card.className = "mirror-card";
    const isLocked = item.premium && !IS_PREMIUM;
    card.onclick = () => openProductDetailModal(item.id);

    const genderMatchHtml =
      item.gender === USER_MY_FIT.gender
        ? `<span class="gender-match-tag match">성별 매칭 ✓</span>`
        : `<span class="gender-match-tag">${item.gender === "male" ? "남성용" : "여성용"}</span>`;

    const lockBadgeHtml = isLocked
      ? `<span class="gender-match-tag" style="background-color: var(--accent-red); color: #fff; margin-left: 4px;">🔒 PREMIUM</span>`
      : "";

    card.innerHTML = `
      <div class="mirror-img-wrapper">
        <img class="mirror-card-img" src="${item.img}" alt="${item.title}">
        <span class="mirror-card-badge">싱크율 ${match}%</span>
      </div>
      <div class="mirror-card-info">
        <span class="mirror-card-title">${item.title}</span>
        <div style="margin: 2px 0 4px;">${genderMatchHtml}${lockBadgeHtml}</div>
        <div class="mirror-user-stats">
          <span>키 ${item.height}cm · ${item.weight}kg</span>
          <span style="color:var(--accent-primary); font-weight:800;">${item.creator}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Inject Sponsored Platform Ads at the very bottom
  if (!IS_PREMIUM) {
    // Musinsa Ad
    const ad1 = document.createElement("div");
    ad1.className = "sponsor-ad-card musinsa";
    ad1.style.gridColumn = "span 2";
    ad1.onclick = () => window.open("https://www.musinsa.com", "_blank");
    ad1.innerHTML = `
      <div class="sponsor-ad-header">
        <span class="sponsor-ad-platform">Musinsa</span>
        <span class="sponsor-ad-badge">SPONSOR AD</span>
      </div>
      <span class="sponsor-ad-title">무신사 현대카드 발급 시 2만 원 즉시 할인!</span>
      <span class="sponsor-ad-desc">무신사 첫 결제 혜택과 5% 상시 적립 및 무제한 추가 쿠폰팩 혜택을 제공합니다.</span>
    `;
    grid.appendChild(ad1);

    // Zigzag Ad
    const ad2 = document.createElement("div");
    ad2.className = "sponsor-ad-card zigzag";
    ad2.style.gridColumn = "span 2";
    ad2.onclick = () => window.open("https://zigzag.kr", "_blank");
    ad2.innerHTML = `
      <div class="sponsor-ad-header">
        <span class="sponsor-ad-platform">Zigzag</span>
        <span class="sponsor-ad-badge">SPONSOR AD</span>
      </div>
      <span class="sponsor-ad-title">지그재그 첫 구매 15% 웰컴 쿠폰팩</span>
      <span class="sponsor-ad-desc">오늘 주문 내일 도착 직진배송 무료배송 및 뷰티 스킨케어 최대 50% 세일!</span>
    `;
    grid.appendChild(ad2);
  }
}

// ---------------- TAB 2: MIRROR REELS (SNAP VERTICAL FEED) ----------------
function toggleReelsFilter(mode) {
  reelsFilterMode = mode;
  document
    .getElementById("reelsFilterAll")
    .classList.toggle("active", mode === "all");
  document
    .getElementById("reelsFilterMyGender")
    .classList.toggle("active", mode === "mygender");
  initReelsFeed();
}

function initReelsFeed() {
  const container = document.getElementById("reelsContainer");
  if (!container) return;
  container.innerHTML = "";

  let filteredReels =
    reelsFilterMode === "mygender"
      ? MIRROR_FEED_DATA.filter((item) => item.gender === USER_MY_FIT.gender)
      : MIRROR_FEED_DATA;
  if (filteredReels.length === 0) filteredReels = MIRROR_FEED_DATA;

  filteredReels.forEach((item, index) => {
    const match = calculateBodyMatchRate(item.sizeSpec.M);

    // Inject Coupang Sponsored Ad in Reels Feed
    if (!IS_PREMIUM && index === 1) {
      const adSlide = document.createElement("div");
      adSlide.className = "reels-slide";
      adSlide.innerHTML = `
        <div class="sponsor-ad-card coupang" style="width: 100%; height: 100%; justify-content: center; margin: 0; border-radius: 0; border: none; padding: 24px; text-align: center;">
          <div class="sponsor-ad-header" style="justify-content: center; gap: 8px;">
            <span class="sponsor-ad-platform" style="font-size: 14px;">Coupang Rocket</span>
            <span class="sponsor-ad-badge">SPONSOR AD</span>
          </div>
          <span class="sponsor-ad-title" style="font-size: 16px; margin-top: 20px;">로켓배송 특별 콜라보 핏 검증 세일!</span>
          <p class="sponsor-ad-desc" style="font-size: 11px; margin-top: 10px; line-height: 1.5;">
            쿠팡 와우 회원 전용 무제한 무료 로켓배송 & 30일 무료 반품 서비스.<br>
            지금 Celedo 연동 3D 데이터로 완벽 매칭 검증된 핏을 최저가에 쇼핑해보세요.
          </p>
          <button class="btn btn-primary" style="margin-top: 30px; width: auto; align-self: center;" onclick="window.open('https://coupang.com', '_blank')">쿠팡 로켓 배송 보러가기</button>
        </div>
      `;
      container.appendChild(adSlide);
    }

    const slide = document.createElement("div");
    slide.className = "reels-slide";
    const isLocked = item.premium && !IS_PREMIUM;
    slide.innerHTML = `
      <img class="reels-slide-media" src="${item.img}" alt="${item.title}">
      <div class="reels-slide-overlay">
        <div class="reels-slide-creator" style="display:flex; flex-direction:row; align-items:center; gap:8px;">
          <div class="reels-avatar-circle">${item.creator[1].toUpperCase()}</div>
          <div style="display:flex; flex-direction:column;">
            <span class="reels-creator-handle">${item.creator}</span>
            <span class="reels-creator-stats">키 ${item.height}cm · ${item.weight}kg · ${item.bone}</span>
          </div>
          <span class="title-verified-badge" style="margin-left:auto; background:var(--accent-primary); color:#fff;">매칭율 ${match}%</span>
        </div>
        <p class="reels-slide-caption">"${item.caption}"</p>
        <button class="reels-tag-btn" onclick="openProductDetailModal(${item.id})">
          <span>${isLocked ? "🔒 " : "👕 "}착용한 옷: ${item.title}</span>
          <span style="color:${isLocked ? "var(--accent-red)" : "var(--accent-blue)"}; font-weight:800;">
            ${isLocked ? "프리미엄 전용 멤버십 가입 〉" : "데이터 핏 보기 〉"}
          </span>
        </button>
      </div>
    `;
    container.appendChild(slide);
  });
}

// ---------------- TAB 3: MUSINSA RANKING ----------------
function toggleRankingFilter(mode) {
  rankingFilterMode = mode;
  document
    .getElementById("rankFilterAll")
    .classList.toggle("active", mode === "all");
  document
    .getElementById("rankFilterMyBody")
    .classList.toggle("active", mode === "mybody");
  initRankingList();
}

function initRankingList() {
  const listContainer = document.getElementById("rankingListContainer");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  let items = [...MIRROR_FEED_DATA];

  if (rankingFilterMode === "mybody") {
    // Sort by dynamic match rate descending
    items.sort((a, b) => {
      const matchA = calculateBodyMatchRate(a.sizeSpec.M);
      const matchB = calculateBodyMatchRate(b.sizeSpec.M);
      return matchB - matchA;
    });
  }

  items.forEach((item, index) => {
    const match = calculateBodyMatchRate(item.sizeSpec.M);
    const row = document.createElement("div");
    row.className = "rank-item";
    row.onclick = () => openProductDetailModal(item.id);

    let rightSideHtml = "";
    if (rankingFilterMode === "all") {
      rightSideHtml = `<span class="rank-score" style="color:var(--text-primary); font-size:12px;">₩${item.price.toLocaleString()}</span>`;
    } else {
      rightSideHtml = `<span class="rank-score">${match}% 매칭</span>`;
    }

    row.innerHTML = `
      <div class="rank-info-left">
        <span class="rank-num">${index + 1}</span>
        <img class="rank-item-img" src="${item.img}" alt="${item.title}">
        <div class="rank-details">
          <span class="rank-brand">${item.brand}</span>
          <span class="rank-product">${item.title}</span>
          ${rankingFilterMode === "all" ? "" : `<span class="rank-price">₩${item.price.toLocaleString()}</span>`}
        </div>
      </div>
      ${rightSideHtml}
    `;
    listContainer.appendChild(row);
  });
}

// Dynamically calculate matching score percentage
function calculateBodyMatchRate(specs) {
  // specs: { shoulder, chest, sleeve, length }
  // Compare with USER_MY_FIT
  const shDiff = Math.abs(specs.shoulder - USER_MY_FIT.shoulder);
  const chDiff = Math.abs(specs.chest - USER_MY_FIT.chest);
  const slDiff = Math.abs(specs.sleeve - USER_MY_FIT.sleeve);
  const lgDiff = Math.abs(specs.length - USER_MY_FIT.length);

  // Custom weight deduction
  const shDeduct = shDiff > 1.5 ? shDiff * 3.5 : shDiff * 1.5;
  const chDeduct = chDiff > 2.0 ? chDiff * 4.0 : chDiff * 2.0;
  const slDeduct = slDiff * 1.5;
  const lgDeduct = lgDiff > 3.0 ? lgDiff * 2.5 : lgDiff * 1.0;

  const totalDeduction = shDeduct + chDeduct + slDeduct + lgDeduct;
  let match = Math.round(100 - totalDeduction);
  if (match > 100) match = 100;
  if (match < 45) match = 45;
  return match;
}

// ---------------- TAB 4: SHOPPING CART (COUPANG STYLE) ----------------
function initCartView() {
  const container = document.getElementById("cartItemsContainer");
  if (!container) return;
  container.innerHTML = "";

  if (CART_DATA.length === 0) {
    container.innerHTML = `<div style="padding: 30px; text-align: center; color: var(--text-tertiary); font-size:11px;">장바구니가 비어 있습니다.</div>`;
    updateCartCalculations();
    return;
  }

  CART_DATA.forEach((cartItem) => {
    const product = MIRROR_FEED_DATA.find((p) => p.id === cartItem.productId);
    if (!product) return;

    const sizeVals = product.sizeSpec[cartItem.size];
    const match = calculateBodyMatchRate(sizeVals);

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <div class="cart-item-left">
        <input type="checkbox" class="cart-item-checkbox" ${cartItem.checked ? "checked" : ""} onchange="toggleCartItem(${cartItem.id})">
        <img class="cart-item-img" src="${product.img}" alt="${product.title}">
        <div class="cart-item-info">
          <span class="cart-item-name">${product.title}</span>
          <span class="cart-item-price">₩${product.price.toLocaleString()} / 사이즈 [${cartItem.size}] (매칭율: ${match}%)</span>
          <span class="cart-discount-tag ${cartItem.fitVerified ? "active" : "inactive"}" onclick="toggle3DFitVerification(${cartItem.id})">
            ${cartItem.fitVerified ? "✓ 3D 데이터 대조 완료 (-1,000원)" : "❓ 3D 데이터 매칭 확인하기"}
          </span>
        </div>
      </div>
    `;
    container.appendChild(itemDiv);
  });

  updateCartCalculations();
}

function toggleCartItem(id) {
  const item = CART_DATA.find((c) => c.id === id);
  if (item) {
    item.checked = !item.checked;
    initCartView();
  }
}

function toggleSelectAllCart() {
  const masterCheck = document.getElementById("selectAllCart").checked;
  CART_DATA.forEach((item) => {
    item.checked = masterCheck;
  });
  initCartView();
}

function deleteSelectedCart() {
  CART_DATA = CART_DATA.filter((item) => !item.checked);
  initCartView();
}

function toggle3DFitVerification(id) {
  const item = CART_DATA.find((c) => c.id === id);
  if (item) {
    item.fitVerified = !item.fitVerified;
    initCartView();
  }
}

function updateCartCalculations() {
  let originalTotal = 0;
  let verificationDiscount = 0;
  let checkedCount = 0;
  let verifiedCheckedCount = 0;

  CART_DATA.forEach((item) => {
    if (item.checked) {
      checkedCount++;
      const prod = MIRROR_FEED_DATA.find((p) => p.id === item.productId);
      if (prod) {
        originalTotal += prod.price;
        if (item.fitVerified) {
          verifiedCheckedCount++;
          verificationDiscount += 1000; // 1,000 KRW off per verified item
        }
      }
    }
  });

  // Rocket bonus calculation (If all checked items have verified 3D fit data)
  let extraBonusDiscount = 0;
  if (checkedCount > 0 && verifiedCheckedCount === checkedCount) {
    extraBonusDiscount = 1000; // All checked items match bonus
    verificationDiscount += extraBonusDiscount;
  }

  // Update Coupang-style Rocket Progress Gauge
  const fill = document.getElementById("cartProgressFill");
  const tip = document.getElementById("cartProgressTip");
  const text = document.getElementById("cartDiscountText");

  if (fill && tip && text) {
    if (checkedCount === 0) {
      fill.style.width = "0%";
      text.textContent = "추가 할인 없음";
      tip.innerHTML = "선택된 상품이 없습니다.";
    } else {
      const pct = Math.round((verifiedCheckedCount / checkedCount) * 100);
      fill.style.width = `${pct}%`;
      text.textContent = `추가 ${verificationDiscount.toLocaleString()}원 할인 적용 중`;

      if (pct === 100) {
        tip.innerHTML =
          "🎉 축하합니다! 모든 상품 3D 매치 완료 보너스 <strong>3,000원 즉시 할인 적용!</strong>";
      } else {
        const remaining = checkedCount - verifiedCheckedCount;
        tip.innerHTML = `모든 상품 3D 데이터 확인 완료 시 <strong>추가 3,000원 즉시 할인!</strong> (남은 상품: ${remaining}개)`;
      }
    }
  }

  const tempPrice = Math.max(0, originalTotal - verificationDiscount);

  // --- CREDIT DISCOUNT LOGIC ---
  const userCredits = parseInt(
    localStorage.getItem("celedo-user-credits") || "12500",
  );
  const availCreditsEl = document.getElementById("checkoutAvailableCredits");
  if (availCreditsEl) {
    availCreditsEl.textContent = userCredits.toLocaleString();
  }

  const creditUseBox = document.getElementById("checkoutCreditUseBox");
  const creditBadge = document.getElementById("checkoutCreditBadge");
  const creditDesc = document.getElementById("checkoutCreditDesc");
  const creditInput = document.getElementById("checkoutCreditInput");

  if (creditUseBox) {
    if (IS_PREMIUM) {
      creditUseBox.className = "credit-use-box premium";
      if (creditBadge) creditBadge.style.display = "inline-block";
      if (creditDesc) {
        creditDesc.innerHTML = `🌟 프리미엄 혜택: <strong>1.5배 효율</strong>로 최대 30% 결제 금액 할인 가능 (1C = 1.5원)`;
      }
    } else {
      creditUseBox.className = "credit-use-box general";
      if (creditBadge) creditBadge.style.display = "none";
      if (creditDesc) {
        creditDesc.innerHTML = `일반 회원은 최대 10% 결제 금액 할인 가능 (1C = 1원)`;
      }
    }
  }

  let creditUsed = 0;
  if (creditInput) {
    creditUsed = parseInt(creditInput.value) || 0;
    if (creditUsed < 0) {
      creditUsed = 0;
      creditInput.value = 0;
    }

    // Limit checks
    let maxAllowedCredits = 0;
    if (IS_PREMIUM) {
      const maxDiscount = tempPrice * 0.3;
      maxAllowedCredits = Math.min(userCredits, Math.floor(maxDiscount / 1.5));
    } else {
      const maxDiscount = tempPrice * 0.1;
      maxAllowedCredits = Math.min(userCredits, Math.floor(maxDiscount / 1.0));
    }

    if (creditUsed > maxAllowedCredits) {
      creditUsed = maxAllowedCredits;
      creditInput.value = creditUsed;
    }
  }

  APPLIED_CREDIT_USED = creditUsed;
  APPLIED_CREDIT_DISCOUNT = IS_PREMIUM
    ? Math.floor(creditUsed * 1.5)
    : creditUsed;

  const creditDiscountRow = document.getElementById(
    "checkoutCreditDiscountRow",
  );
  const creditDiscountPriceEl = document.getElementById(
    "checkoutCreditDiscountPrice",
  );

  if (creditDiscountRow && creditDiscountPriceEl) {
    if (APPLIED_CREDIT_DISCOUNT > 0) {
      creditDiscountRow.style.display = "flex";
      creditDiscountPriceEl.textContent = `-₩${APPLIED_CREDIT_DISCOUNT.toLocaleString()}`;
    } else {
      creditDiscountRow.style.display = "none";
    }
  }

  // Update final summary box
  const finalTotal = Math.max(0, tempPrice - APPLIED_CREDIT_DISCOUNT);

  const originalPriceEl = document.getElementById("checkoutOriginalPrice");
  const discountPriceEl = document.getElementById("checkoutDiscountPrice");
  const finalPriceEl = document.getElementById("checkoutFinalPrice");

  if (originalPriceEl)
    originalPriceEl.textContent = `₩${originalTotal.toLocaleString()}`;
  if (discountPriceEl)
    discountPriceEl.textContent = `-₩${verificationDiscount.toLocaleString()}`;
  if (finalPriceEl)
    finalPriceEl.textContent = `₩${finalTotal.toLocaleString()}`;
}

let confettiActive = false;
let confettiAnimationId = null;

function handleCreditInputChange() {
  updateCartCalculations();
}

function useAllCredits() {
  const userCredits = parseInt(
    localStorage.getItem("celedo-user-credits") || "12500",
  );

  // Calculate tempPrice (original total - verification discount)
  let originalTotal = 0;
  let verificationDiscount = 0;
  let checkedCount = 0;

  CART_DATA.forEach((item) => {
    if (item.checked) {
      checkedCount++;
      const prod = MIRROR_FEED_DATA.find((p) => p.id === item.productId);
      if (prod) {
        originalTotal += prod.price;
        if (item.fitVerified) {
          verificationDiscount += 1000;
        }
      }
    }
  });

  if (
    checkedCount > 0 &&
    CART_DATA.filter((c) => c.checked && c.fitVerified).length === checkedCount
  ) {
    verificationDiscount += 1000;
  }

  const tempPrice = Math.max(0, originalTotal - verificationDiscount);

  let maxAllowedCredits = 0;
  if (IS_PREMIUM) {
    const maxDiscount = tempPrice * 0.3;
    maxAllowedCredits = Math.min(userCredits, Math.floor(maxDiscount / 1.5));
  } else {
    const maxDiscount = tempPrice * 0.1;
    maxAllowedCredits = Math.min(userCredits, Math.floor(maxDiscount / 1.0));
  }

  const inputEl = document.getElementById("checkoutCreditInput");
  if (inputEl) {
    inputEl.value = maxAllowedCredits;
  }
  updateCartCalculations();
}

function handleOrderCheckout() {
  if (CART_DATA.filter((item) => item.checked).length === 0) {
    showToast("주문할 상품을 선택해주세요.", "warning");
    return;
  }

  showConfirm("주문 결제 확인", "정말로 이 주문을 완료하시겠습니까?", () => {
    // Capture the applied values
    LAST_ORDER_CREDIT_USED = APPLIED_CREDIT_USED;
    LAST_ORDER_CREDIT_DISCOUNT = APPLIED_CREDIT_DISCOUNT;

    // Deduct credits from local storage
    let userCredits = parseInt(
      localStorage.getItem("celedo-user-credits") || "12500",
    );
    userCredits = Math.max(0, userCredits - LAST_ORDER_CREDIT_USED);
    localStorage.setItem("celedo-user-credits", userCredits.toString());

    // Update UI credits elements
    const creditsEl = document.getElementById("userCreditsVal");
    if (creditsEl) {
      creditsEl.textContent = `${userCredits.toLocaleString()} C`;
    }

    // --- Order History database save ---
    const orderId = Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleString("ko-KR", { hour12: false });
    const orderedItems = [];
    let originalTotal = 0;
    let verificationDiscount = 0;
    let checkedCount = 0;

    CART_DATA.forEach((item) => {
      if (item.checked) {
        checkedCount++;
        const prod = MIRROR_FEED_DATA.find((p) => p.id === item.productId);
        if (prod) {
          originalTotal += prod.price;
          orderedItems.push({
            title: prod.title,
            img: prod.img,
            price: prod.price,
            size: item.size,
          });
          if (item.fitVerified) {
            verificationDiscount += 1000;
          }
        }
      }
    });

    if (
      checkedCount > 0 &&
      CART_DATA.filter((c) => c.checked && c.fitVerified).length ===
        checkedCount
    ) {
      verificationDiscount += 1000;
    }
    const tempPrice = Math.max(0, originalTotal - verificationDiscount);
    const finalTotal = Math.max(0, tempPrice - LAST_ORDER_CREDIT_DISCOUNT);

    addOrderToHistory({
      orderId: orderId,
      date: dateStr,
      items: orderedItems,
      total: finalTotal,
      creditUsed: LAST_ORDER_CREDIT_USED,
    });

    const modal = document.getElementById("checkoutSuccessModal");
    if (modal) {
      // Show summary details in success modal
      const summaryBox = document.getElementById("checkoutSuccessOrderSummary");
      const finalPriceSpan = document.getElementById("successOrderFinalPrice");
      const creditsSpan = document.getElementById("successOrderCreditsUsed");

      if (summaryBox) {
        summaryBox.style.display = "flex";
      }
      if (finalPriceSpan) {
        finalPriceSpan.textContent = `₩${finalTotal.toLocaleString()}`;
      }
      if (creditsSpan) {
        creditsSpan.textContent = `${LAST_ORDER_CREDIT_USED.toLocaleString()} C`;
      }

      // Dynamic text changes based on user subscription state
      const descEl = document.getElementById("checkoutPromoDescription");
      const btnEl = document.getElementById("checkoutPromoBtn");
      const cancelBtn = document.getElementById("checkoutCancelBtn");
      const wrapperEl = document.getElementById("checkoutPromoBtnWrapper");

      if (IS_PREMIUM) {
        if (descEl) {
          descEl.innerHTML = `이미 <strong>CELEDO Premium 패스</strong>를 이용 중이시므로 모든 혜택이 자동 적용됩니다.<br>보너스 크레딧이 내 자산에 추가로 합산되었습니다.`;
        }
        if (cancelBtn) {
          cancelBtn.textContent = "주문 내역 바로가기";
          cancelBtn.style.display = "block";
          cancelBtn.onclick = function () {
            closeCheckoutSuccessModal(true);
          };
        }
        if (wrapperEl) {
          wrapperEl.style.gridTemplateColumns = "1fr 1fr";
        }
        if (btnEl) {
          btnEl.innerHTML = `✨ 주문 완료 및 닫기`;
          btnEl.onclick = function () {
            closeCheckoutSuccessModal(false);
          };
        }
      } else {
        if (descEl) {
          descEl.innerHTML = `지금 <strong>7일간 무료 체험</strong>을 신청하고 모든 혜택을 이용하세요.<br>(체험 기간 종료 전 언제든 간편 해지가 가능합니다)`;
        }
        if (cancelBtn) {
          cancelBtn.textContent = "주문 내역 바로가기";
          cancelBtn.style.display = "block";
          cancelBtn.onclick = function () {
            closeCheckoutSuccessModal(true);
          };
        }
        if (wrapperEl) {
          wrapperEl.style.gridTemplateColumns = "1fr 1.3fr";
        }
        if (btnEl) {
          btnEl.innerHTML = `⚡ 7일 무료체험 시작`;
          btnEl.onclick = function () {
            acceptCheckoutPremium();
          };
        }
      }

      modal.style.display = "flex";
      startConfettiRain();
    }
  });
}

function closeCheckoutSuccessModal(goToOrderHistory = false) {
  const modal = document.getElementById("checkoutSuccessModal");
  if (modal) modal.style.display = "none";
  stopConfettiRain();

  if (LAST_ORDER_CREDIT_USED > 0) {
    showToast(
      `📸 <strong>주문 결제 완료!</strong><br>크레딧 <strong>${LAST_ORDER_CREDIT_USED.toLocaleString()} C</strong> 사용 및 <strong>${LAST_ORDER_CREDIT_DISCOUNT.toLocaleString()}원</strong> 할인이 적용되었습니다.`,
      "success",
    );
  } else {
    showToast("주문 결제 처리가 완료되었습니다.", "success");
  }

  // Clear inputs
  const creditInput = document.getElementById("checkoutCreditInput");
  if (creditInput) {
    creditInput.value = "";
  }

  // Clear ordered items from cart
  CART_DATA = CART_DATA.filter((item) => !item.checked);
  initCartView();

  if (goToOrderHistory) {
    // Navigate to My Page
    const mypageTabBtn = document.querySelector(
      '.nav-bar .nav-item[data-tab="tab-mypage"]',
    );
    if (mypageTabBtn) {
      mypageTabBtn.click();

      // Scroll to order history card
      setTimeout(() => {
        const orderHistoryCard = document.getElementById(
          "myPageOrderHistoryCard",
        );
        if (orderHistoryCard) {
          // orderHistoryCard.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    }
  }
}

function acceptCheckoutPremium() {
  const modal = document.getElementById("checkoutSuccessModal");
  if (modal) modal.style.display = "none";
  stopConfettiRain();

  // Activate premium
  activatePremiumSubscription();

  // Redirect to mypage to see assets
  const mypageTabBtn = document.querySelector(
    '.nav-bar .nav-item[data-tab="tab-mypage"]',
  );
  if (mypageTabBtn) mypageTabBtn.click();
}

function startConfettiRain() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;

  // Set canvas size to cover the modal overlay container
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;

  window.addEventListener("resize", () => {
    if (confettiActive) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
  });

  const colors = [
    "#3b82f6",
    "#60a5fa",
    "#f59e0b",
    "#d97706",
    "#f43f5e",
    "#10b981",
    "#8b5cf6",
  ];
  const particleCount = 100;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * particleCount,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
    });
  }

  confettiActive = true;

  function draw() {
    if (!confettiActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, idx) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

      if (p.y > canvas.height) {
        particles[idx] = {
          x: Math.random() * canvas.width,
          y: -20,
          r: p.r,
          d: p.d,
          color: p.color,
          tilt: p.tilt,
          tiltAngleIncremental: p.tiltAngleIncremental,
          tiltAngle: p.tiltAngle,
        };
      }

      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });

    confettiAnimationId = requestAnimationFrame(draw);
  }

  draw();
}

function stopConfettiRain() {
  confettiActive = false;
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }
  const canvas = document.getElementById("confettiCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------------- TAB 5: MY PAGE SPEC SAVE ----------------
function saveUserSpecs() {
  const genderEl = document.getElementById("input-gender");
  if (genderEl) {
    USER_MY_FIT.gender = genderEl.value;
  }

  const heightVal =
    parseFloat(document.getElementById("input-height").value) || 178;
  const weightVal =
    parseFloat(document.getElementById("input-weight").value) || 68;

  USER_MY_FIT.height = heightVal;
  USER_MY_FIT.weight = weightVal;
  USER_MY_FIT.shoulder =
    parseFloat(document.getElementById("input-shoulder").value) || 49.0;
  USER_MY_FIT.chest =
    parseFloat(document.getElementById("input-chest").value) || 57.0;
  USER_MY_FIT.sleeve =
    parseFloat(document.getElementById("input-sleeve").value) || 61.5;
  USER_MY_FIT.length =
    parseFloat(document.getElementById("input-length").value) || 68.0;
  USER_MY_FIT.face =
    parseFloat(document.getElementById("input-face").value) || 22.0;
  USER_MY_FIT.upperBody =
    parseFloat(document.getElementById("input-upperBody").value) || 65.0;
  USER_MY_FIT.lowerBody =
    parseFloat(document.getElementById("input-lowerBody").value) || 95.0;

  try {
    localStorage.setItem("celedo-user-fit", JSON.stringify(USER_MY_FIT));
  } catch (e) {
    console.error("Failed to save user fit specs to localStorage:", e);
  }

  // Active sync dynamic bubble in phone status notch (Dynamic Island)
  const island = document.getElementById("dynamicIsland");
  if (island) {
    island.style.width = "180px";
    island.innerHTML = `<span style="color:var(--accent-blue); font-size:8.5px; font-weight:800; animation: pulse 0.5s ease-out;">SIZE PROFILE SYNCED</span>`;
    setTimeout(() => {
      island.style.width = "110px";
      island.innerHTML = "";
    }, 1200);
  }

  // Trigger dynamic thin gradient border animation around the phone viewport
  const borderEffect = document.getElementById("sizeChangeBorderEffect");
  if (borderEffect) {
    borderEffect.classList.add("active");
    setTimeout(() => {
      borderEffect.classList.remove("active");
    }, 1600);
  }

  initMirrorViewGrid();
  initReelsFeed();
  initRankingList();
}

// ---------------- 3-PANEL DETAIL MODAL CONTROLS ----------------
function openProductDetailModal(productId) {
  const product = MIRROR_FEED_DATA.find((p) => p.id === productId);
  if (!product) return;

  if (product.premium && !IS_PREMIUM) {
    openPremiumModal();
    return;
  }

  // Clear any existing locks on open
  removePremiumLocks();

  activeProductDetail = product;
  activeSelectedSize = "M"; // default center sizes

  document.getElementById("modal-product-brand").textContent = product.brand;
  document.getElementById("modal-product-title").textContent = product.title;
  document.getElementById("modal-product-img").src = product.img;
  document.getElementById("modal-product-price").textContent =
    `₩${product.price.toLocaleString()}`;
  document.getElementById("modal-product-desc").textContent = product.caption;

  // Setup Center Panel (Spec Map)
  document.getElementById("blueprint-compare-toggle").checked = true;
  drawSizingBlueprint();

  // Setup Right Panel (Wash Fit)
  document.getElementById("modal-fabric-composition").textContent =
    product.fabric;
  document.getElementById("modal-fabric-care").textContent = product.care;

  const slider = document.getElementById("shrinkageSlider");
  if (slider) {
    slider.value = 0;
    handleShrinkSlider(0);
  }

  // Check if limit is already hit
  checkAndApplyPremiumLocks();

  // Show modal
  document.getElementById("wornModalOverlay").style.display = "flex";
}

function closeWornModal() {
  document.getElementById("wornModalOverlay").style.display = "none";
  activeProductDetail = null;
}

// SVG Blueprint path generator (Draws detailed shirt polygon vector)
function buildShirtPath(specs) {
  const sh = specs.shoulder * 1.15; // scale width
  const ch = specs.chest * 1.15; // body width
  const sl = specs.sleeve * 0.9; // sleeve length
  const lg = specs.length * 1.15; // length height

  const neckW = 20;
  const shoulderY = 22;
  const chestY = 48;
  const hemY = 15 + lg;

  // Custom precise coordinate points
  const p1 = [100 - neckW, 15];
  const p2 = [100 + neckW, 15];
  const p3 = [100 + sh, shoulderY];
  const p4 = [100 + sh + sl * 0.5, shoulderY + sl * 0.86];
  const p5 = [100 + sh + sl * 0.5 - 7, shoulderY + sl * 0.86 + 3];
  const p6 = [100 + ch, chestY];
  const p7 = [100 + ch, hemY];
  const p8 = [100 - ch, hemY];
  const p9 = [100 - ch, chestY];
  const p10 = [100 - sh - sl * 0.5 + 7, shoulderY + sl * 0.86 + 3];
  const p11 = [100 - sh - sl * 0.5, shoulderY + sl * 0.86];
  const p12 = [100 - sh, shoulderY];

  return `M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} L ${p4[0]} ${p4[1]} L ${p5[0]} ${p5[1]} L ${p6[0]} ${p6[1]} L ${p7[0]} ${p7[1]} L ${p8[0]} ${p8[1]} L ${p9[0]} ${p9[1]} L ${p10[0]} ${p10[1]} L ${p11[0]} ${p11[1]} L ${p12[0]} ${p12[1]} Z`;
}

function drawSizingBlueprint() {
  if (!activeProductDetail) return;

  const compareActive = document.getElementById(
    "blueprint-compare-toggle",
  ).checked;
  const myPath = document.getElementById("blueprint-my-clothes");
  const itemPath = document.getElementById("blueprint-new-product");

  const productSpecs = activeProductDetail.sizeSpec[activeSelectedSize];

  // Draw user's clothes comparison blueprint
  if (compareActive) {
    myPath.setAttribute("d", buildShirtPath(USER_MY_FIT));
    myPath.style.display = "block";
  } else {
    myPath.style.display = "none";
  }

  // Draw target purchase product specs
  itemPath.setAttribute("d", buildShirtPath(productSpecs));

  // Sync measurements texts within SVG
  document.getElementById("svg-text-shoulder").textContent =
    `${productSpecs.shoulder}cm`;
  document.getElementById("svg-text-chest").textContent =
    `${productSpecs.chest}cm`;
  document.getElementById("svg-text-sleeve").textContent =
    `${productSpecs.sleeve}cm`;
  document.getElementById("svg-text-length").textContent =
    `${productSpecs.length}cm`;

  // Draw specs alignment table
  const tbody = document.getElementById("blueprint-table-body");
  if (tbody) {
    tbody.innerHTML = "";

    const metrics = [
      {
        key: "shoulder",
        label: "어깨너비",
        my: USER_MY_FIT.shoulder,
        item: productSpecs.shoulder,
      },
      {
        key: "chest",
        label: "가슴단면",
        my: USER_MY_FIT.chest,
        item: productSpecs.chest,
      },
      {
        key: "sleeve",
        label: "소매길이",
        my: USER_MY_FIT.sleeve,
        item: productSpecs.sleeve,
      },
      {
        key: "length",
        label: "총장",
        my: USER_MY_FIT.length,
        item: productSpecs.length,
      },
    ];

    metrics.forEach((m) => {
      const diff = (m.item - m.my).toFixed(1);
      const diffVal = parseFloat(diff);
      let diffStr = "";
      let diffColor = "var(--text-primary)";

      if (diffVal > 0) {
        diffStr = `+${diffVal}cm (여유)`;
        diffColor = "var(--accent-blue)";
      } else if (diffVal < 0) {
        diffStr = `${diffVal}cm (작음)`;
        diffColor = "var(--accent-red)";
      } else {
        diffStr = "일치";
        diffColor = "var(--accent-primary)";
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="font-weight:700;">${m.label}</td>
        <td style="color:var(--text-secondary);">${m.my}cm</td>
        <td style="font-weight:700; color:var(--accent-primary);">${m.item}cm</td>
        <td style="font-weight:800; color:${diffColor};">${diffStr}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function toggleBlueprintCompare() {
  drawSizingBlueprint();
}

// ---------------- RIGHT PANEL: WASH FIT SIMULATOR ----------------
function handleShrinkSlider(value) {
  if (!activeProductDetail) return;

  const count = parseInt(value);

  const baseShrinkage = activeProductDetail.shrinkage; // e.g. -1.2
  const washProgress = Math.min(5, count) / 5;
  const currentShrink = baseShrinkage * washProgress;

  const badge = document.getElementById("sim-shrinkage-badge");
  if (badge) {
    badge.textContent = `누적 ${count}회: ${currentShrink.toFixed(2)}% 수축 예측`;
    // highlight badge warning color when shrinking exceeds threshold
    if (Math.abs(currentShrink) > 2.0) {
      badge.style.backgroundColor = "rgba(244, 63, 94, 0.25)";
    } else {
      badge.style.backgroundColor = "rgba(244, 63, 94, 0.08)";
    }
  }

  // Apply visual transformation scale to the shirt SVG path vector
  const shirt = document.getElementById("simShirtPath");
  if (shirt) {
    const scaleFactor = 1 + currentShrink / 100;
    shirt.style.transform = `scale(${scaleFactor})`;
  }
}

// ---------------- ADD CART LOGIC ----------------
function addActiveProductToCart() {
  if (!activeProductDetail) return;

  // Add item
  const newCartId =
    CART_DATA.length > 0 ? Math.max(...CART_DATA.map((c) => c.id)) + 1 : 1;
  CART_DATA.push({
    id: newCartId,
    productId: activeProductDetail.id,
    size: activeSelectedSize,
    checked: true,
    fitVerified: true, // defaulted since they viewed the 3D spec map
  });

  showToast(
    `[${activeProductDetail.title}] (${activeSelectedSize} 사이즈) 장바구니 추가!`,
    "success",
  );
  closeWornModal();

  // Navigate to Cart Tab
  const cartTabBtn = document.querySelector(
    '.nav-bar .nav-item[data-tab="tab-cart"]',
  );
  if (cartTabBtn) {
    cartTabBtn.click();
  }
}

// ---------------- TOP FIX BAR: SEARCH SYSTEM ----------------
function handleTopSearch() {
  const query = document
    .getElementById("topSearchInput")
    .value.trim()
    .toLowerCase();
  const dropdown = document.getElementById("searchResultsDropdown");
  const clearBtn = document.getElementById("searchClearBtn");

  if (!query) {
    dropdown.style.display = "none";
    clearBtn.style.display = "none";
    return;
  }

  clearBtn.style.display = "block";
  dropdown.innerHTML = "";

  // Filter Matching Products
  const matches = MIRROR_FEED_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.fabric.toLowerCase().includes(query),
  );

  if (matches.length === 0) {
    dropdown.innerHTML = `<div style="padding: 12px; text-align: center; font-size: 11px; color: var(--text-tertiary);">검색 결과가 없습니다.</div>`;
    dropdown.style.display = "block";
    return;
  }

  matches.forEach((item) => {
    const div = document.createElement("div");
    div.className = "search-result-item";
    div.onclick = () => {
      dropdown.style.display = "none";
      document.getElementById("topSearchInput").value = item.title;
      openProductDetailModal(item.id);
    };
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="result-info">
        <span class="result-title">${item.title}</span>
        <span class="result-type">👕 실측 매칭 및 수축률 정보 보기</span>
      </div>
    `;
    dropdown.appendChild(div);
  });

  dropdown.style.display = "block";
}

function clearTopSearch() {
  document.getElementById("topSearchInput").value = "";
  document.getElementById("searchResultsDropdown").style.display = "none";
  document.getElementById("searchClearBtn").style.display = "none";
}

// Mock-up frame toggler
function toggleMockupFrame(source) {
  const container = document.getElementById("phoneContainer");
  const headerBtn = document.getElementById("frameToggleBtn");
  const tabCheckbox = document.getElementById("toggle-mockup-frame");
  const statusText = document.getElementById("mockup-status");

  let active;
  if (source === "header") {
    active = container.classList.contains("no-frame");
  } else {
    active = tabCheckbox.checked;
  }

  if (active) {
    container.classList.remove("no-frame");
    if (headerBtn) headerBtn.style.opacity = "1";
    if (tabCheckbox) tabCheckbox.checked = true;
    if (statusText)
      statusText.textContent = "테두리가 켜진 데스크톱 프레임 모드";
  } else {
    container.classList.add("no-frame");
    if (headerBtn) headerBtn.style.opacity = "0.5";
    if (tabCheckbox) tabCheckbox.checked = false;
    if (statusText) statusText.textContent = "테두리가 제거된 전체 화면 모드";
  }
}

// ---------------- FULLSCREEN API HANDLER ----------------
function toggleFullscreen() {
  const docEl = document.documentElement;

  if (
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function handleFullscreenChange() {
  const btn = document.querySelector(
    "#tab-mypage button[onclick='toggleFullscreen()']",
  );
  const statusText = document.getElementById("fullscreen-status");
  if (!btn || !statusText) return;

  const isFullscreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

  if (isFullscreen) {
    btn.textContent = "전체화면 끄기";
    btn.style.backgroundColor = "var(--accent-red)";
    statusText.textContent =
      "현재 브라우저 전체화면(앱 몰입 모드)이 켜져 있습니다.";
  } else {
    btn.textContent = "전체화면 켜기";
    btn.style.backgroundColor = "var(--btn-primary-bg)";
    statusText.textContent = "브라우저 주소창과 네비게이션 바를 숨깁니다.";
  }
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("msfullscreenchange", handleFullscreenChange);

function closeFullscreenPrompt(enable) {
  const fsModal = document.getElementById("fullscreenPromptModal");
  if (fsModal) {
    fsModal.style.display = "none";
  }
  localStorage.setItem("celedo-fullscreen-prompt-shown", "true");
  if (enable) {
    const isAlreadyFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;
    if (!isAlreadyFullscreen) {
      toggleFullscreen();
    }
  }
}

function editUserName() {
  const currentName = USER_MY_FIT.name || "김민수";
  showPrompt(
    "이름 수정",
    "변경할 이름을 입력해주세요:",
    currentName,
    (newName) => {
      if (newName && newName.trim()) {
        USER_MY_FIT.name = newName.trim();
        const nameDisplay = document.getElementById("profileNameDisplay");
        if (nameDisplay) {
          nameDisplay.textContent = `${USER_MY_FIT.name} 님`;
        }
        const avatar = document.querySelector(".profile-avatar");
        if (avatar) {
          avatar.textContent = USER_MY_FIT.name.charAt(0).toUpperCase();
        }
        try {
          localStorage.setItem("celedo-user-fit", JSON.stringify(USER_MY_FIT));
        } catch (e) {
          console.error(e);
        }
        showToast("이름이 정상적으로 변경되었습니다.", "success");
      }
    },
  );
}

function syncUIWithSpecs() {
  const genderEl = document.getElementById("input-gender");
  if (genderEl) genderEl.value = USER_MY_FIT.gender;

  const heightEl = document.getElementById("input-height");
  if (heightEl) heightEl.value = USER_MY_FIT.height;

  const weightEl = document.getElementById("input-weight");
  if (weightEl) weightEl.value = USER_MY_FIT.weight;

  const shoulderEl = document.getElementById("input-shoulder");
  if (shoulderEl) shoulderEl.value = USER_MY_FIT.shoulder;

  const chestEl = document.getElementById("input-chest");
  if (chestEl) chestEl.value = USER_MY_FIT.chest;

  const sleeveEl = document.getElementById("input-sleeve");
  if (sleeveEl) sleeveEl.value = USER_MY_FIT.sleeve;

  const lengthEl = document.getElementById("input-length");
  if (lengthEl) lengthEl.value = USER_MY_FIT.length;

  const faceEl = document.getElementById("input-face");
  if (faceEl) faceEl.value = USER_MY_FIT.face || 22.0;

  const upperBodyEl = document.getElementById("input-upperBody");
  if (upperBodyEl) upperBodyEl.value = USER_MY_FIT.upperBody || 65.0;

  const lowerBodyEl = document.getElementById("input-lowerBody");
  if (lowerBodyEl) lowerBodyEl.value = USER_MY_FIT.lowerBody || 95.0;

  const nameDisplay = document.getElementById("profileNameDisplay");
  if (nameDisplay) {
    nameDisplay.textContent = `${USER_MY_FIT.name || "김민수"} 님`;
  }
  const avatar = document.querySelector(".profile-avatar");
  if (avatar && USER_MY_FIT.name) {
    avatar.textContent = USER_MY_FIT.name.charAt(0).toUpperCase();
  }
}

// ---------------- BOOTSTRAP INITIALIZER ----------------
document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  syncUIWithSpecs();
  initNavigation();
  updateStyleToggles();
  initMirrorViewGrid(); // Draw first Home tab values on load

  // Load user credits
  const credits = localStorage.getItem("celedo-user-credits") || "12500";
  const creditsEl = document.getElementById("userCreditsVal");
  if (creditsEl) {
    creditsEl.textContent = `${parseInt(credits).toLocaleString()} C`;
  }

  // PC drag & wheel scroll enhancement for product detail panel
  const detailPanelsContainer = document.querySelector(
    ".detail-three-panels-container",
  );
  if (detailPanelsContainer) {
    // 1) Horizontal wheel scrolling
    detailPanelsContainer.addEventListener(
      "wheel",
      (evt) => {
        if (evt.deltaY !== 0) {
          evt.preventDefault();
          detailPanelsContainer.scrollLeft += evt.deltaY * 0.8;
        }
      },
      { passive: false },
    );

    // 2) Horizontal drag scrolling
    let isDown = false;
    let startX;
    let scrollLeft;

    detailPanelsContainer.addEventListener("mousedown", (e) => {
      isDown = true;
      detailPanelsContainer.classList.add("dragging");
      startX = e.pageX - detailPanelsContainer.offsetLeft;
      scrollLeft = detailPanelsContainer.scrollLeft;
    });

    detailPanelsContainer.addEventListener("mouseleave", () => {
      isDown = false;
      detailPanelsContainer.classList.remove("dragging");
    });

    detailPanelsContainer.addEventListener("mouseup", () => {
      isDown = false;
      detailPanelsContainer.classList.remove("dragging");
    });

    detailPanelsContainer.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - detailPanelsContainer.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed
      detailPanelsContainer.scrollLeft = scrollLeft - walk;
    });
  }

  if (IS_PREMIUM) {
    const nameDisplay = document.getElementById("profileNameDisplay");
    if (nameDisplay && !nameDisplay.querySelector(".badge-premium-user")) {
      const badge = document.createElement("span");
      badge.className = "badge-premium-user";
      badge.textContent = "PREMIUM";
      nameDisplay.appendChild(badge);
    }
  }
  updateMyPagePremiumCard();
  initOrderHistoryView();

  // Close search dropdown on click outside
  document.addEventListener("click", (e) => {
    const searchWrapper = document.querySelector(".top-search-bar-container");
    if (searchWrapper && !searchWrapper.contains(e.target)) {
      const dropdown = document.getElementById("searchResultsDropdown");
      if (dropdown) dropdown.style.display = "none";
    }
  });

  // Splash Screen Fade After 1 Second
  setTimeout(() => {
    const splash = document.getElementById("splashScreen");
    if (splash) {
      splash.style.opacity = "0";
      setTimeout(() => {
        splash.style.visibility = "hidden";

        // Show fullscreen prompt modal if not shown before
        const promptShown = localStorage.getItem(
          "celedo-fullscreen-prompt-shown",
        );
        if (!promptShown) {
          const fsModal = document.getElementById("fullscreenPromptModal");
          if (fsModal) {
            fsModal.style.display = "flex";
          }
        }
      }, 500);
    }
  }, 1000);
});

// Premium Mode Functions
function openPremiumModal() {
  const modal = document.getElementById("premiumModal");
  if (modal) modal.style.display = "flex";
}

function closePremiumModal() {
  const modal = document.getElementById("premiumModal");
  if (modal) modal.style.display = "none";
}

function selectPremiumPlan(plan, el) {
  selectedPremiumPlan = plan;
  document.querySelectorAll(".premium-plan-option").forEach((opt) => {
    opt.classList.remove("selected");
  });
  el.classList.add("selected");
  const btn = document.querySelector(".btn-subscribe");
  if (btn) {
    btn.textContent =
      plan === "monthly"
        ? "🚀 프리미엄 무제한 시작하기 (7일 무료)"
        : "🚀 연간 멤버십 시작하기 (38% 특별 할인)";
  }
}

function activatePremiumSubscription() {
  IS_PREMIUM = true;
  localStorage.setItem("celedo-is-premium", "true");
  showToast("Celedo 프리미엄 구독이 활성화되었습니다!", "success");

  // Update Profile Name with Premium Badge
  const nameDisplay = document.getElementById("profileNameDisplay");
  if (nameDisplay && !nameDisplay.querySelector(".badge-premium-user")) {
    const badge = document.createElement("span");
    badge.className = "badge-premium-user";
    badge.textContent = "PREMIUM";
    nameDisplay.appendChild(badge);
  }

  // Update My Page premium info card
  updateMyPagePremiumCard();

  // Remove locks if open
  closePremiumModal();
  removePremiumLocks();

  // Re-init tabs to clear ads and update premium state
  initMirrorViewGrid();
  initReelsFeed();
  initRankingList();
  updateCartCalculations();

  // Sync Dynamic Island
  const island = document.getElementById("dynamicIsland");
  if (island) {
    island.style.width = "180px";
    island.innerHTML = `<span style="color:#f59e0b; font-size:8.5px; font-weight:800;">PREMIUM UNLOCKED</span>`;
    setTimeout(() => {
      island.style.width = "110px";
      island.innerHTML = "";
    }, 2500);
  }
}

// UGC Upload Functions
function openUgcUploadModal() {
  const modal = document.getElementById("ugcUploadModal");
  if (modal) {
    modal.style.display = "flex";
    // Pre-populate with current specs
    document.getElementById("ugc-height-input").value = USER_MY_FIT.height;
    document.getElementById("ugc-weight-input").value = USER_MY_FIT.weight;
  }
}

function closeUgcUploadModal() {
  const modal = document.getElementById("ugcUploadModal");
  if (modal) modal.style.display = "none";

  // Reset form
  document.getElementById("ugc-upload-form").reset();
  document.getElementById("ugc-preview-img").style.display = "none";
  document.getElementById("ugc-upload-icon").style.display = "block";
  document.getElementById("ugc-upload-text").textContent =
    "탭하여 영상/사진 찾아보기 (모의 업로드)";
}

function handleUgcFileChange(input) {
  const file = input.files[0];
  const preview = document.getElementById("ugc-preview-img");
  const icon = document.getElementById("ugc-upload-icon");
  const text = document.getElementById("ugc-upload-text");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
      icon.style.display = "none";
      text.textContent = `선택된 파일: ${file.name} (변경하려면 클릭)`;
    };
    reader.readAsDataURL(file);
  }
}

function handleUgcUploadSubmit(event) {
  event.preventDefault();

  // Close upload modal immediately
  closeUgcUploadModal();

  const title = "미러 릴스 업로드 확인";
  const message = `정말로 릴스를 등록하시겠습니까?<br><br>
    <strong>[주요 안내 사항]</strong><br>
    • 실착 리뷰 업로드 시 <strong>즉시 1,500C</strong>가 선지급됩니다.<br>
    • 등록 후 운영팀에서 실착 여부, 이미지 도용, 부적절성 등을 정밀 검토합니다.<br><br>
    <span style="color: var(--accent-red); font-weight: 800;">⚠️ 부적합 이미지 판정 시, 선지급된 1,500C 크레딧은 즉시 전액 회수(소멸)되며 서비스 이용이 제한될 수 있습니다.</span>`;

  showConfirm(title, message, () => {
    // 1. Add credit to state (Upfront credits)
    let credits = parseInt(
      localStorage.getItem("celedo-user-credits") || "12500",
    );
    credits += 1500;
    localStorage.setItem("celedo-user-credits", credits.toString());

    // Update UI values
    const creditsEl = document.getElementById("userCreditsVal");
    if (creditsEl) {
      creditsEl.textContent = `${credits.toLocaleString()} C`;
    }

    // Toast Notification indicating review is in progress and warning about reclamation
    showToast(
      "📸 <strong>릴스 업로드 완료!</strong><br><br>선지급 혜택으로 <strong>1,500C 크레딧</strong>이 즉시 지급 및 적립되었습니다.<br><br>",
      "success",
    );

    // Sync Dynamic Island
    const island = document.getElementById("dynamicIsland");
    if (island) {
      island.style.width = "190px";
      island.innerHTML = `<span style="color:var(--accent-blue); font-size:8px; font-weight:800;">+1,500C CREDIT ADDED</span>`;
      setTimeout(() => {
        island.style.width = "110px";
        island.innerHTML = "";
      }, 3500);
    }
  });
}

// Swatch welcome kit modals
function openPremiumKitModal() {
  const modal = document.getElementById("premiumKitModal");
  if (modal) modal.style.display = "flex";
}

// Global function to update the My Page subscription status card dynamically
function updateMyPagePremiumCard() {
  const mypageStatus = document.getElementById("mypagePremiumStatus");
  const mypageBtn = document.getElementById("mypagePremiumActionBtn");
  const mypageDetails = document.getElementById("mypagePremiumDetails");

  if (IS_PREMIUM) {
    if (mypageStatus) {
      mypageStatus.textContent = "구독 중 (프리미엄 회원)";
      mypageStatus.style.color = "#f59e0b";
    }
    if (mypageBtn) {
      mypageBtn.textContent = "구독 관리";
      mypageBtn.onclick = () => {
        showConfirm(
          "구독 해제 확인",
          "현재 구독을 해제하고 일반 회원(광고 노출, 피팅 횟수제한) 상태로 복구하시겠습니까?",
          () => {
            deactivatePremiumSubscription();
          },
        );
      };
    }
    if (mypageDetails) {
      const kitApplied =
        localStorage.getItem("celedo-washkit-applied") === "true";
      let kitHtml = "";
      if (kitApplied) {
        kitHtml = `<br><span style="color: var(--accent-primary); font-weight: 700;">• 웰컴 기프트: 배송 준비 중 📦</span>`;
      } else {
        kitHtml = `<br><button class="btn btn-primary" onclick="openPremiumKitModal()" style="width: auto; padding: 4px 10px; font-size: 10px; height: auto; margin-top: 6px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: none;">🎁 웰컴 기프트 신청하기</button>`;
      }

      mypageDetails.innerHTML = `
        <span style="color: var(--accent-blue); font-weight: 800;">✨ 멤버십 혜택 적용 중</span><br>
        • 가상 피팅 무제한 패스 사용 중<br>
        • 제휴몰(무신사, 지그재그, 쿠팡) 할인 및 무료배송 혜택 적용 중
        ${kitHtml}
      `;
    }
  } else {
    if (mypageStatus) {
      mypageStatus.textContent = "미구독 (일반 회원)";
      mypageStatus.style.color = "var(--text-secondary)";
    }
    if (mypageBtn) {
      mypageBtn.textContent = "구독하기 ⚡";
      mypageBtn.onclick = () => openPremiumModal();
    }
    if (mypageDetails) {
      mypageDetails.innerHTML = `
        <span style="color: var(--accent-red); font-weight: 800;">🔒 무료 체험 혜택이 남아있습니다.</span><br>
        • 3D 가상 피팅 및 수축률 시뮬레이터 무제한 패스<br>
        • ₩4,900/월 (월간 Pass) 또는 ₩29,900/년 (연간 Pass, 38% 할인)
      `;
    }
  }
}

function closePremiumKitModal() {
  const modal = document.getElementById("premiumKitModal");
  if (modal) modal.style.display = "none";
}

function submitPremiumKitAddress() {
  const name = document.getElementById("kitReceiverName").value.trim();
  const address = document.getElementById("kitAddress").value.trim();

  if (!name || !address) {
    showToast("이름과 주소를 입력해주세요.", "warning");
    return;
  }

  closePremiumKitModal();
  localStorage.setItem("celedo-washkit-applied", "true");
  updateMyPagePremiumCard();
  showToast("친환경 워시 키트 배송 신청 완료! 📦", "success");

  // Sync Dynamic Island
  const island = document.getElementById("dynamicIsland");
  if (island) {
    island.style.width = "190px";
    island.innerHTML = `<span style="color:#f59e0b; font-size:8px; font-weight:800;">WASH KIT DISPATCHED 📦</span>`;
    setTimeout(() => {
      island.style.width = "110px";
      island.innerHTML = "";
    }, 2500);
  }
}

// Toggle premium simulation previews dynamically
function togglePremiumViewToggle() {
  const btn = document.getElementById("viewToggleBtn");
  if (!btn) return;

  if (!IS_PREMIUM) {
    // Try to activate premium view simulation
    activatePremiumSubscription();
    btn.textContent = "프리미엄 👑";
    btn.style.color = "#f59e0b";
    btn.style.borderColor = "#f59e0b";
  } else {
    // Revert to general view simulation
    deactivatePremiumSubscription();
    btn.textContent = "일반 모드 🔍";
    btn.style.color = "var(--accent-blue)";
    btn.style.borderColor = "var(--accent-blue)";
  }
}

function removePremiumLocks() {
  document
    .querySelectorAll(".premium-lock-overlay")
    .forEach((overlay) => overlay.remove());
  document
    .querySelectorAll(".blur-premium")
    .forEach((el) => el.classList.remove("blur-premium"));
}

function checkAndApplyPremiumLocks() {
  if (IS_PREMIUM) {
    removePremiumLocks();
    return false;
  }

  if (!activeProductDetail) return false;
  const productId = activeProductDetail.id;
  const unlockedProducts = JSON.parse(
    localStorage.getItem("celedo-unlocked-products") || "[]",
  );

  // If already unlocked
  if (unlockedProducts.includes(productId)) {
    removePremiumLocks();
    return false;
  }

  const blueprintPanel = document.querySelector(".blueprint-canvas-box");
  const washPanel = document.querySelector(".shrinkage-simulator-box");

  removePremiumLocks(); // Clear to prevent duplicates

  const isLimitHit = freeFitUsageCount >= FREE_FIT_LIMIT;
  const remainCount = Math.max(0, FREE_FIT_LIMIT - freeFitUsageCount);

  // Both panels get blurred
  if (blueprintPanel) {
    blueprintPanel.classList.add("blur-premium");
  }
  if (washPanel) {
    washPanel.classList.add("blur-premium");
  }

  // Single representative overlay is added only to blueprintPanel (Center Panel)
  if (blueprintPanel) {
    const overlay = createLockOverlay(
      "스펙 맵 & 워시 핏 잠김",
      isLimitHit
        ? "무료 피팅 횟수를 초과했습니다 (3/3회)."
        : `이 옷의 스펙 맵 & 워시 핏 시뮬레이션을 체크해 보시겠습니까?<br>(남은 무료 횟수: ${remainCount}/3회)`,
      isLimitHit,
      productId,
    );
    blueprintPanel.parentElement.style.position = "relative";
    blueprintPanel.parentElement.appendChild(overlay);
  }

  return true;
}

function createLockOverlay(title, desc, isLimitHit, productId) {
  const overlay = document.createElement("div");
  overlay.className = "premium-lock-overlay";

  let actionButton = "";
  if (isLimitHit) {
    actionButton = `<button class="btn-premium-unlock" onclick="openPremiumModal()">프리미엄 해제하여 무제한 확인</button>`;
  } else {
    actionButton = `<button class="btn-premium-unlock" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);" onclick="unlockProductForFree(${productId})">1회 차감하고 잠금 해제 🔓</button>`;
  }

  overlay.innerHTML = `
    <div class="lock-icon-wrapper">🔒</div>
    <div class="lock-title">${title}</div>
    <div class="lock-desc" style="line-height: 1.4; margin-bottom: 8px;">${desc}</div>
    ${actionButton}
  `;
  return overlay;
}

function unlockProductForFree(productId) {
  if (freeFitUsageCount >= FREE_FIT_LIMIT) {
    openPremiumModal();
    return;
  }

  freeFitUsageCount++;
  localStorage.setItem("celedo-free-fit-usage-count", freeFitUsageCount);

  let unlockedProducts = JSON.parse(
    localStorage.getItem("celedo-unlocked-products") || "[]",
  );
  if (!unlockedProducts.includes(productId)) {
    unlockedProducts.push(productId);
    localStorage.setItem(
      "celedo-unlocked-products",
      JSON.stringify(unlockedProducts),
    );
  }

  removePremiumLocks();
  showToast(
    `잠금이 해제되었습니다! (남은 무료 횟수: ${FREE_FIT_LIMIT - freeFitUsageCount}/${FREE_FIT_LIMIT}회)`,
    "success",
  );

  updateMyPagePremiumCard();
}

function deactivatePremiumSubscription() {
  IS_PREMIUM = false;
  localStorage.setItem("celedo-is-premium", "false");
  localStorage.removeItem("celedo-washkit-applied");
  // Reset usage count so they can experience limits again
  freeFitUsageCount = 0;
  localStorage.removeItem("celedo-free-fit-usage-count");
  localStorage.removeItem("celedo-unlocked-products");
  showToast("정상적으로 구독이 해제되었습니다.", "warning");

  // Remove premium badge next to profile name
  const badge = document.querySelector(".badge-premium-user");
  if (badge) badge.remove();

  // Update My Page status card
  updateMyPagePremiumCard();

  // Re-init tabs to show Ads again!
  initMirrorViewGrid();
  initReelsFeed();
  initRankingList();
  updateCartCalculations();

  // Sync Dynamic Island
  const island = document.getElementById("dynamicIsland");
  if (island) {
    island.style.width = "180px";
    island.innerHTML = `<span style="color:var(--accent-red); font-size:8.5px; font-weight:800;">PREMIUM DEACTIVATED</span>`;
    setTimeout(() => {
      island.style.width = "110px";
      island.innerHTML = "";
    }, 2500);
  }
}

// Custom Toast System
function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.cssText = `
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 90%;
      max-width: 360px;
      pointer-events: none;
    `;
    document.getElementById("phoneContainer").appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `custom-toast ${type}`;

  let emoji = "ℹ️";
  if (type === "success") {
    emoji = "✨";
  } else if (type === "warning") {
    emoji = "⚠️";
  }

  toast.innerHTML = `<span>${emoji}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    toast.style.transform = "translateY(-10px)";
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Custom Confirm Modal Dialog
function showConfirm(title, message, onConfirm, onCancel = null) {
  let modal = document.getElementById("customConfirmModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "customConfirmModal";
    modal.className = "premium-modal-overlay";
    modal.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 6000;
      display: none;
      justify-content: center;
      align-items: center;
      padding: 20px;
    `;
    modal.innerHTML = `
      <div class="premium-modal-content" style="max-width: 320px; text-align: center;">
        <h4 id="confirmTitle" style="font-size: 14px; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">확인</h4>
        <p id="confirmMessage" style="font-size: 11px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 20px;"></p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <button id="btnConfirmCancel" class="btn" style="height: 36px; padding: 0;">취소</button>
          <button id="btnConfirmOk" class="btn btn-primary" style="height: 36px; padding: 0;">확인</button>
        </div>
      </div>
    `;
    document.getElementById("phoneContainer").appendChild(modal);
  }

  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMessage").innerHTML = message.replace(
    /\n/g,
    "<br>",
  );

  const okBtn = document.getElementById("btnConfirmOk");
  const cancelBtn = document.getElementById("btnConfirmCancel");

  modal.style.display = "flex";

  okBtn.onclick = () => {
    modal.style.display = "none";
    if (onConfirm) onConfirm();
  };

  cancelBtn.onclick = () => {
    modal.style.display = "none";
    if (onCancel) onCancel();
  };
}

// Custom Prompt Modal Dialog
function showPrompt(title, message, defaultValue, onConfirm) {
  let modal = document.getElementById("customPromptModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "customPromptModal";
    modal.className = "premium-modal-overlay";
    modal.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 6000;
      display: none;
      justify-content: center;
      align-items: center;
      padding: 20px;
    `;
    modal.innerHTML = `
      <div class="premium-modal-content" style="max-width: 320px; text-align: center;">
        <h4 id="promptTitle" style="font-size: 14px; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">입력</h4>
        <p id="promptMessage" style="font-size: 11px; color: var(--text-secondary); margin-bottom: 12px;"></p>
        <input type="text" id="promptInput" style="
          width: 100%;
          height: 36px;
          padding: 0 12px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 16px;
          outline: none;
        " />
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <button id="btnPromptCancel" class="btn" style="height: 36px; padding: 0;">취소</button>
          <button id="btnPromptOk" class="btn btn-primary" style="height: 36px; padding: 0;">확인</button>
        </div>
      </div>
    `;
    document.getElementById("phoneContainer").appendChild(modal);
  }

  document.getElementById("promptTitle").textContent = title;
  document.getElementById("promptMessage").textContent = message;
  const input = document.getElementById("promptInput");
  input.value = defaultValue;

  const okBtn = document.getElementById("btnPromptOk");
  const cancelBtn = document.getElementById("btnPromptCancel");

  modal.style.display = "flex";
  setTimeout(() => input.focus(), 50);

  okBtn.onclick = () => {
    modal.style.display = "none";
    if (onConfirm) onConfirm(input.value);
  };

  cancelBtn.onclick = () => {
    modal.style.display = "none";
  };

  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      okBtn.click();
    }
  };
}

function openAiOutfitModal() {
  const modal = document.getElementById("aiOutfitModal");
  if (modal) modal.style.display = "flex";
}

function closeAiOutfitModal() {
  const modal = document.getElementById("aiOutfitModal");
  if (modal) modal.style.display = "none";
}

// ---------------- MY SIZE PROFILE INPUT MODE TABS & AR SCANNER ----------------
function switchSizeInputMode(mode) {
  const manualForm = document.getElementById("mypage-size-form");
  const arScanner = document.getElementById("mypage-ar-scanner");
  const tabManual = document.getElementById("btnSizeModeManual");
  const tabAr = document.getElementById("btnSizeModeAr");
  const subtitle = document.getElementById("sizingTabSubtitle");

  if (mode === "manual") {
    if (manualForm) manualForm.style.display = "flex";
    if (arScanner) arScanner.style.display = "none";
    if (tabManual) tabManual.classList.add("active");
    if (tabAr) tabAr.classList.remove("active");
    if (subtitle) {
      subtitle.textContent =
        "입력된 수치를 기준으로 3D 대조 및 사이즈 매칭 점수가 실시간 반영됩니다.";
    }
  } else if (mode === "ar") {
    if (manualForm) manualForm.style.display = "none";
    if (arScanner) arScanner.style.display = "flex";
    if (tabManual) tabManual.classList.remove("active");
    if (tabAr) tabAr.classList.add("active");
    if (subtitle) {
      subtitle.textContent =
        "가상 카메라 프리뷰 및 사각 라인 정렬 후 AR 스캐너 시뮬레이션을 시작하세요.";
    }
  }
}

function startArSizeScan() {
  const startBtn = document.getElementById("btnArStartScan");
  const statusText = document.getElementById("arScanStatus");
  const laser = document.getElementById("arScannerLaser");
  const silhouette = document.getElementById("arSilhouette");
  const resultBox = document.getElementById("arResultBox");
  const viewfinder = document.querySelector(".ar-viewfinder");

  if (!startBtn || !statusText || !laser) return;

  // Reset & Disable
  startBtn.disabled = true;
  startBtn.style.opacity = "0.6";
  startBtn.textContent = "스캐닝 분석 진행 중...";
  if (resultBox) resultBox.style.display = "none";

  // Show laser scanning line & active scanning borders & pulse silhouette
  laser.style.display = "block";
  laser.classList.add("scanning");
  if (viewfinder) viewfinder.classList.add("active-scan");
  if (silhouette) {
    silhouette.style.stroke = "#10b981";
    silhouette.style.opacity = "0.75";
  }

  // Animation timeline Simulation
  statusText.textContent = "신체 윤곽선 감지 중... 🔍";

  setTimeout(() => {
    statusText.textContent = "관절 위치 및 어깨너비 정밀 연산 중... 📐";
  }, 1000);

  setTimeout(() => {
    statusText.textContent = "가슴둘레 및 소매단 측정치 계산 중... 📏";
  }, 2000);

  setTimeout(() => {
    // Finish scan
    laser.style.display = "none";
    laser.classList.remove("scanning");
    if (viewfinder) viewfinder.classList.remove("active-scan");
    if (silhouette) {
      silhouette.style.stroke = "#fff";
      silhouette.style.opacity = "0.25";
    }
    statusText.textContent = "AR 신체 스캔 분석 완료! ✨";

    startBtn.disabled = false;
    startBtn.style.opacity = "1";
    startBtn.textContent = "📷 AR 재촬영 시작";

    if (resultBox) {
      resultBox.style.display = "block";
    }
    showToast("신체 정밀 측정이 완료되었습니다! 값을 적용해보세요.", "success");
  }, 3000);
}

function applyArSpecs() {
  // Mock measurements (Matching VIP default profile metrics)
  const arHeight = 178;
  const arWeight = 68;
  const arShoulder = 49.0;
  const arChest = 57.0;
  const arSleeve = 61.5;
  const arLength = 68.0;
  const arFace = 22.0;
  const arUpper = 65.0;
  const arLower = 95.0;

  // Autofill form fields
  const heightEl = document.getElementById("input-height");
  if (heightEl) heightEl.value = arHeight;
  const weightEl = document.getElementById("input-weight");
  if (weightEl) weightEl.value = arWeight;
  const shoulderEl = document.getElementById("input-shoulder");
  if (shoulderEl) shoulderEl.value = arShoulder;
  const chestEl = document.getElementById("input-chest");
  if (chestEl) chestEl.value = arChest;
  const sleeveEl = document.getElementById("input-sleeve");
  if (sleeveEl) sleeveEl.value = arSleeve;
  const lengthEl = document.getElementById("input-length");
  if (lengthEl) lengthEl.value = arLength;
  const faceEl = document.getElementById("input-face");
  if (faceEl) faceEl.value = arFace;
  const upperEl = document.getElementById("input-upperBody");
  if (upperEl) upperEl.value = arUpper;
  const lowerEl = document.getElementById("input-lowerBody");
  if (lowerEl) lowerEl.value = arLower;

  // Trigger Save specs to register data globally & update 3D maps
  saveUserSpecs();

  // Return to manual view to check specifications
  switchSizeInputMode("manual");

  // Hide result box for next scan
  const resultBox = document.getElementById("arResultBox");
  if (resultBox) resultBox.style.display = "none";

  showToast("AR 측정 스펙이 프로필에 자동 반영되었습니다!", "success");
}

// ---------------- ORDER HISTORY DATABASE (LOCALSTORAGE) ----------------
function switchOrderView(view) {
  const mainView = document.getElementById("mypage-main-view");
  const detailView = document.getElementById("mypage-order-detail-view");

  if (view === "main") {
    if (mainView) mainView.style.display = "flex";
    if (detailView) detailView.style.display = "none";
  } else if (view === "detail") {
    if (mainView) mainView.style.display = "none";
    if (detailView) detailView.style.display = "flex";
  }
}

function addOrderToHistory(orderData) {
  try {
    let history = JSON.parse(
      localStorage.getItem("celedo-order-history") || "[]",
    );
    history.unshift(orderData); // Add new order to top
    localStorage.setItem("celedo-order-history", JSON.stringify(history));
    initOrderHistoryView();
  } catch (e) {
    console.error("Failed to add order history:", e);
  }
}

function initOrderHistoryView() {
  const listContainer = document.getElementById("orderHistoryList");
  const slimContainer = document.getElementById("orderHistorySlimList");

  if (listContainer) listContainer.innerHTML = "";
  if (slimContainer) slimContainer.innerHTML = "";

  try {
    const history = JSON.parse(
      localStorage.getItem("celedo-order-history") || "[]",
    );

    // --- 1. RENDER SLIM HISTORY ON MAIN MYPAGE (MAX 3 ITEMS) ---
    if (slimContainer) {
      if (history.length === 0) {
        slimContainer.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); padding: 4px 0;">주문 내역이 없습니다.</div>`;
      } else {
        history.slice(0, 3).forEach((order) => {
          const firstItemTitle = order.items[0] ? order.items[0].title : "상품";
          const extraCount = order.items.length - 1;
          const titleText =
            extraCount > 0
              ? `${firstItemTitle} 외 ${extraCount}건`
              : firstItemTitle;
          const shortDate = order.date.substring(5, 16); // e.g. "05-30 11:20" or similar

          const slimRow = document.createElement("div");
          slimRow.style.cssText =
            "display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed var(--border-color);";
          slimRow.innerHTML = `
            <span style="color: var(--text-primary); font-weight: 700; max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              [${shortDate}] ${titleText}
            </span>
            <span style="font-weight: 800; color: var(--accent-primary);">
              ₩${order.total.toLocaleString()}
            </span>
          `;
          slimContainer.appendChild(slimRow);
        });
      }
    }

    // --- 2. RENDER FULL DETAILED HISTORY ON DETAIL PAGE ---
    if (listContainer) {
      if (history.length === 0) {
        listContainer.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-tertiary); font-size: 11px;">결제 완료된 주문 내역이 없습니다.</div>`;
        return;
      }

      history.forEach((order) => {
        const orderCard = document.createElement("div");
        orderCard.className = "order-history-item";

        let itemsHtml = "";
        order.items.forEach((item) => {
          itemsHtml += `
            <div class="order-item-prod">
              <img src="${item.img}" alt="${item.title}" class="order-item-prod-img" />
              <span class="order-item-prod-name">${item.title}</span>
              <span class="order-item-prod-price">[${item.size}] ₩${item.price.toLocaleString()}</span>
            </div>
          `;
        });

        orderCard.innerHTML = `
          <div class="order-item-header">
            <span>주문번호: #${order.orderId}</span>
            <span>${order.date}</span>
          </div>
          <div class="order-item-prods">
            ${itemsHtml}
          </div>
          <div class="order-item-summary">
            <span>최종 결제 금액</span>
            <div style="text-align: right;">
              <div style="font-size: 11.5px; color: var(--accent-primary); font-weight: 800;">₩${order.total.toLocaleString()}</div>
              ${order.creditUsed > 0 ? `<div style="font-size: 8px; color: var(--accent-blue);">크레딧 사용: -${order.creditUsed.toLocaleString()} C</div>` : ""}
            </div>
          </div>
        `;

        listContainer.appendChild(orderCard);
      });
    }
  } catch (e) {
    console.error("Failed to render order history:", e);
  }
}

function clearOrderHistory() {
  showConfirm("내역 삭제", "정말로 주문 내역을 모두 지우시겠습니까?", () => {
    localStorage.removeItem("celedo-order-history");
    initOrderHistoryView();
    showToast("주문 내역이 모두 초기화되었습니다.", "warning");
  });
}

// Expose functions to window so inline onclick handlers in index.html work in Vite module scope
if (typeof window !== "undefined") {
  if (typeof toggleTheme !== "undefined") window.toggleTheme = toggleTheme;
  if (typeof selectTPO !== "undefined") window.selectTPO = selectTPO;
  if (typeof selectStyle !== "undefined") window.selectStyle = selectStyle;
  if (typeof openProductDetailModal !== "undefined") window.openProductDetailModal = openProductDetailModal;
  if (typeof toggleReelsFilter !== "undefined") window.toggleReelsFilter = toggleReelsFilter;
  if (typeof toggleMockupFrame !== "undefined") window.toggleMockupFrame = toggleMockupFrame;
  if (typeof toggleFullscreen !== "undefined") window.toggleFullscreen = toggleFullscreen;
  if (typeof switchOrderView !== "undefined") window.switchOrderView = switchOrderView;
  if (typeof clearOrderHistory !== "undefined") window.clearOrderHistory = clearOrderHistory;
  if (typeof closeWornModal !== "undefined") window.closeWornModal = closeWornModal;
  if (typeof toggleBlueprintCompare !== "undefined") window.toggleBlueprintCompare = toggleBlueprintCompare;
  if (typeof handleShrinkSlider !== "undefined") window.handleShrinkSlider = handleShrinkSlider;
  if (typeof addActiveProductToCart !== "undefined") window.addActiveProductToCart = addActiveProductToCart;
  if (typeof closePremiumModal !== "undefined") window.closePremiumModal = closePremiumModal;
  if (typeof selectPremiumPlan !== "undefined") window.selectPremiumPlan = selectPremiumPlan;
  if (typeof activatePremiumSubscription !== "undefined") window.activatePremiumSubscription = activatePremiumSubscription;
  if (typeof closeUgcUploadModal !== "undefined") window.closeUgcUploadModal = closeUgcUploadModal;
  if (typeof handleUgcUploadSubmit !== "undefined") window.handleUgcUploadSubmit = handleUgcUploadSubmit;
  if (typeof handleUgcFileChange !== "undefined") window.handleUgcFileChange = handleUgcFileChange;
  if (typeof closeCheckoutSuccessModal !== "undefined") window.closeCheckoutSuccessModal = closeCheckoutSuccessModal;
  if (typeof acceptCheckoutPremium !== "undefined") window.acceptCheckoutPremium = acceptCheckoutPremium;
  if (typeof closeAiOutfitModal !== "undefined") window.closeAiOutfitModal = closeAiOutfitModal;
  if (typeof closePremiumKitModal !== "undefined") window.closePremiumKitModal = closePremiumKitModal;
  if (typeof submitPremiumKitAddress !== "undefined") window.submitPremiumKitAddress = submitPremiumKitAddress;
  if (typeof closeFullscreenPrompt !== "undefined") window.closeFullscreenPrompt = closeFullscreenPrompt;
  if (typeof openAiOutfitModal !== "undefined") window.openAiOutfitModal = openAiOutfitModal;
  if (typeof openPremiumModal !== "undefined") window.openPremiumModal = openPremiumModal;
  if (typeof openUgcUploadModal !== "undefined") window.openUgcUploadModal = openUgcUploadModal;
  if (typeof openPremiumKitModal !== "undefined") window.openPremiumKitModal = openPremiumKitModal;
  if (typeof toggleRankingFilter !== "undefined") window.toggleRankingFilter = toggleRankingFilter;
  if (typeof selectTarotCard !== "undefined") window.selectTarotCard = selectTarotCard;
  if (typeof applySizeInputMode !== "undefined") window.applySizeInputMode = applySizeInputMode;
  if (typeof applyUserSpecs !== "undefined") window.applyUserSpecs = applyUserSpecs;
  if (typeof applyAutoMatchingSpecs !== "undefined") window.applyAutoMatchingSpecs = applyAutoMatchingSpecs;
  if (typeof verifySizeBeforeCart !== "undefined") window.verifySizeBeforeCart = verifySizeBeforeCart;
  if (typeof removeCartItem !== "undefined") window.removeCartItem = removeCartItem;
  if (typeof toggleCartItem !== "undefined") window.toggleCartItem = toggleCartItem;
  if (typeof checkoutSelectedItems !== "undefined") window.checkoutSelectedItems = checkoutSelectedItems;
  if (typeof switchSizeInputMode !== "undefined") window.switchSizeInputMode = switchSizeInputMode;
  if (typeof saveUserSpecs !== "undefined") window.saveUserSpecs = saveUserSpecs;
  if (typeof toggle3DFitVerification !== "undefined") window.toggle3DFitVerification = toggle3DFitVerification;
  if (typeof toggleSelectAllCart !== "undefined") window.toggleSelectAllCart = toggleSelectAllCart;
  if (typeof deleteSelectedCart !== "undefined") window.deleteSelectedCart = deleteSelectedCart;
  if (typeof handleCreditInputChange !== "undefined") window.handleCreditInputChange = handleCreditInputChange;
  if (typeof useAllCredits !== "undefined") window.useAllCredits = useAllCredits;
  if (typeof handleOrderCheckout !== "undefined") window.handleOrderCheckout = handleOrderCheckout;
}
