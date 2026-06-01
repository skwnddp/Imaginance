const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  // 1. 다운로드 경로 설정 및 폴더 생성
  const downloadDir = 'C:\\Users\\kmj\\Downloads\\imaginance_screenshots';
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
    console.log(`폴더 생성 완료: ${downloadDir}`);
  }

  // 2. 브라우저 실행 및 페이지 설정
  console.log('브라우저 실행 중...');
  const browser = await puppeteer.launch({ 
    headless: "new",
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // 모바일 화면 크기에 맞춘 뷰포트 설정
  await page.setViewport({ width: 450, height: 920 });

  // 3. 페이지 접속 (로컬 index.html 파일 주소 자동 빌드)
  const localFilePath = path.resolve(__dirname, 'index.html');
  console.log(`페이지 로딩 중... (${localFilePath})`);
  await page.goto(`file://${localFilePath}`);
  
  // 스플래시 화면 및 웹 폰트 로드 대기 (충분하게 3초)
  await page.waitForTimeout(3000); 

  // 임시 프리미엄 강제 적용 (상세 모션/잠금 기능 해제용)
  await page.evaluate(() => {
    if (typeof IS_PREMIUM !== 'undefined') {
      IS_PREMIUM = true;
      if (typeof removePremiumLocks === 'function') removePremiumLocks();
    }
  });

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // --- A. 일반 탭 순회 및 캡처 ---
  const tabs = [
    { name: '1_home_curation', selector: '[data-tab="tab-home"]' },
    { name: '2_mirror_reels', selector: '[data-tab="tab-reels"]' },
    { name: '3_body_ranking', selector: '[data-tab="tab-ranking"]' },
    { name: '4_shopping_cart', selector: '[data-tab="tab-cart"]' },
    { name: '5_my_page', selector: '[data-tab="tab-mypage"]' }
  ];

  for (const tab of tabs) {
    console.log(`[이동 및 캡처] 탭: ${tab.name}`);
    await page.click(tab.selector);
    await delay(1500); // 탭 로딩 대기시간 (늘림)

    // 스마트폰 프레임 영역만 정밀 스크린샷 저장
    const container = await page.$('#phoneContainer');
    if (container) {
      await container.screenshot({ path: path.join(downloadDir, `screenshot_${tab.name}.png`) });
    } else {
      await page.screenshot({ path: path.join(downloadDir, `screenshot_${tab.name}.png`) });
    }
  }

  // --- B. 모달창 오픈, 대기 및 캡처 ---
  const modals = [
    {
      name: '6_product_detail_modal',
      open: async () => {
        await page.evaluate(() => {
          if (typeof openProductDetailModal === 'function') openProductDetailModal(1);
        });
      },
      close: async () => {
        await page.click('.detail-modal-close-btn');
      }
    },
    {
      name: '7_ugc_upload_modal',
      open: async () => {
        await page.evaluate(() => {
          if (typeof openUgcUploadModal === 'function') openUgcUploadModal();
        });
      },
      close: async () => {
        await page.click('#ugcUploadModal .premium-modal-close');
      }
    },
    {
      name: '8_premium_subscription_modal',
      open: async () => {
        await page.evaluate(() => {
          if (typeof openPremiumModal === 'function') openPremiumModal();
        });
      },
      close: async () => {
        await page.click('#premiumModal .premium-modal-close');
      }
    },
    {
      name: '9_checkout_success_modal',
      open: async () => {
        // 장바구니에 아이템이 없으면 강제 주입
        await page.evaluate(() => {
          document.querySelector('[data-tab="tab-cart"]').click();
          if (typeof CART_DATA !== 'undefined' && CART_DATA.length === 0) {
            CART_DATA.push({ id: 999, productId: 1, size: 'M', checked: true, fitVerified: true });
            if (typeof initCartView === 'function') initCartView();
          }
        });
        await delay(500);

        // 주문완료 시뮬레이션
        await page.evaluate(() => {
          if (typeof handleOrderCheckout === 'function') handleOrderCheckout();
        });
        await delay(800); // 컨펌 다이얼로그 노출 대기

        // 컨펌 창의 '확인' 버튼 클릭
        await page.click('#btnConfirmOk');
      },
      close: async () => {
        await page.click('#checkoutCancelBtn');
      }
    },
    {
      name: '10_welcome_kit_modal',
      open: async () => {
        await page.evaluate(() => {
          if (typeof openPremiumKitModal === 'function') openPremiumKitModal();
        });
      },
      close: async () => {
        await page.click('#premiumKitModal button');
      }
    }
  ];

  for (const modal of modals) {
    console.log(`[모달 오픈 및 캡처] 모달: ${modal.name}`);
    await modal.open();
    await delay(2000); // 모달 애니메이션 대기시간 (늘림)

    // 스마트폰 프레임 영역 스크린샷 저장
    const container = await page.$('#phoneContainer');
    if (container) {
      await container.screenshot({ path: path.join(downloadDir, `screenshot_${modal.name}.png`) });
    } else {
      await page.screenshot({ path: path.join(downloadDir, `screenshot_${modal.name}.png`) });
    }

    console.log(`[모달 닫기] 모달: ${modal.name}`);
    await modal.close();
    await delay(1000); // 닫힘 모션 대기시간 (늘림)
  }

  console.log(`🎉 모든 캡처 파일이 다음 경로에 정상 저장되었습니다:\n👉 ${downloadDir}`);
  await browser.close();
})();
