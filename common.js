// メニューボタンとナビゲーション機能
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const menuButtonWrapper = document.querySelector('.menu-button-wrapper');
  const spNav = document.querySelector('.sp-nav');

  // メニューボタンのクリックイベント
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      menuButtonWrapper?.classList.toggle('menu-open');
      spNav?.classList.toggle('menu-open');
      document.documentElement.classList.toggle('menu-open-fixed');
      document.body.classList.toggle('menu-open-fixed');
    });
  }

  // スクロール時のヘッダーのクラス変更
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop === 0) {
          document.documentElement.classList.remove('header-scrolled');
        } else {
          document.documentElement.classList.add('header-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // PC用のドロップダウンメニューのクリックイベント（アニメーション対応）
  document.querySelectorAll('.pc-nav .has-child').forEach((item) => {
    const link = item.querySelector('a');
    const childMenu = link.nextElementSibling;
    const arrowIcon = link.querySelector('.js-plusIcon');
    let isHovered = false; // hover状態の管理
    const openMenu = () => {
      if (childMenu) {
        childMenu.style.display = 'block';
        requestAnimationFrame(() => {
          childMenu.classList.add('show');
        });
      }
      if (arrowIcon) {
        arrowIcon.classList.add('open');
      }
    };
    const closeMenu = () => {
      if (childMenu) {
        childMenu.classList.remove('show');
        setTimeout(() => {
          if (!childMenu.classList.contains('show')) {
            childMenu.style.display = 'none';
          }
        }, 300);
      }
      if (arrowIcon) {
        arrowIcon.classList.remove('open');
      }
    };
    // 親リンクまたは子メニューにマウスが入ったとき
    item.addEventListener('mouseenter', () => {
      isHovered = true;
      openMenu();
    });
    // 親リンクまたは子メニューからマウスが離れたとき
    item.addEventListener('mouseleave', () => {
      isHovered = false;
      // 少し遅延させて、すぐに子に入った場合は閉じないように
      setTimeout(() => {
        if (!isHovered) {
          closeMenu();
        }
      }, 50);
    });
  });

  // --- スマホ用ナビゲーション制御（イベントデリゲーション方式） ---
  const handleSpNavClick = (e) => {
    // 1. アコーディオン（親メニュー）の処理
    const accordionLink = e.target.closest('.sp-nav li.has-child > a');
    if (accordionLink) {
      e.preventDefault();
      e.stopImmediatePropagation();

      const parentLi = accordionLink.closest('li');
      const childMenu = accordionLink.nextElementSibling;
      const arrowIcon = accordionLink.querySelector('.js-plusIcon');
      if (!parentLi || !childMenu) return;

      if (parentLi.classList.contains('open')) {
        // 閉じる
        childMenu.style.maxHeight = childMenu.scrollHeight + 'px';
        requestAnimationFrame(() => {
          parentLi.classList.remove('open');
          childMenu.style.maxHeight = '0px';
          if (arrowIcon) arrowIcon.classList.remove('open');
        });
      } else {
        // 他を閉じて自分を開く
        const siblings = parentLi.parentElement.children;
        for (let sibling of siblings) {
          if (sibling !== parentLi && sibling.classList.contains('open')) {
            const openMenu = sibling.querySelector('ul.nav-child');
            const openArrow = sibling.querySelector('.js-plusIcon');
            sibling.classList.remove('open');
            if (openMenu) openMenu.style.maxHeight = '0px';
            if (openArrow) openArrow.classList.remove('open');
          }
        }
        parentLi.classList.add('open');
        childMenu.style.maxHeight = childMenu.scrollHeight + 'px';
        if (arrowIcon) arrowIcon.classList.add('open');
        
        // アニメーション完了後にmax-heightを解除
        setTimeout(() => {
          if (parentLi.classList.contains('open')) {
            childMenu.style.maxHeight = 'none';
          }
        }, 400);
      }
      return;
    }

    // 2. ページ内リンク（#）でメニューを閉じる処理
    const fragmentLink = e.target.closest('.sp-nav nav ul li a');
    if (fragmentLink) {
      const href = fragmentLink.getAttribute('href');
      if (href && (href.includes('#') || href.startsWith('#'))) {
        // 少し遅らせて閉じる（スクロール開始時間を確保）
        setTimeout(() => {
          menuButtonWrapper?.classList.remove('menu-open');
          spNav?.classList.remove('menu-open');
          document.documentElement.classList.remove('menu-open-fixed');
          document.body.classList.remove('menu-open-fixed');
          
          // 全てのアコーディオンを閉じる
          document.querySelectorAll('.sp-nav li.has-child').forEach(li => {
            li.classList.remove('open');
            const ul = li.querySelector('ul.nav-child');
            if (ul) ul.style.maxHeight = '0px';
            const icon = li.querySelector('.js-plusIcon');
            if (icon) icon.classList.remove('open');
          });
        }, 300);
      }
    }
  };

  if (spNav) {
    spNav.addEventListener('click', handleSpNavClick);
  }

  // 外部クリックでPCドロップダウンメニューを閉じる
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.pc-nav .has-child')) {
      document.querySelectorAll('.pc-nav .nav-child').forEach((menu) => {
        if (menu.classList.contains('show')) {
          menu.classList.remove('show');
          setTimeout(() => {
            if (!menu.classList.contains('show')) {
              menu.style.display = 'none';
            }
          }, 300);
        }
      });
      document.querySelectorAll('.pc-nav .arrow-icon').forEach((icon) => {
        icon.classList.remove('open');
      });
    }
  });

});

// ページトップボタン
document.addEventListener('DOMContentLoaded', () => {
  const topBtn = document.getElementById('page-top');
  if (!topBtn) return;

  topBtn.style.display = 'none';

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100) {
          topBtn.style.display = 'block';
          topBtn.style.opacity = '1';
        } else {
          topBtn.style.opacity = '0';
          setTimeout(() => {
            if (window.pageYOffset <= 100) {
              topBtn.style.display = 'none';
            }
          }, 300);
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  topBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
});

// デバイス判定とクラス付与（現代的なアプローチ）
document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;

  // タッチデバイス判定
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  html.classList.add(isTouchDevice ? 'ua-touch' : 'ua-nontouch');

  // 高解像度ディスプレイ判定
  if (window.devicePixelRatio > 1) {
    html.classList.add('ua-retina');
  }

  // デバイスサイズ判定（CSS Media Queriesの方が推奨だが、JSで必要な場合）
  const updateDeviceClass = () => {
    const width = window.innerWidth;
    html.classList.remove('ua-phone', 'ua-tablet', 'ua-desktop');

    if (width < 768) {
      html.classList.add('ua-phone');
    } else if (width < 1024) {
      html.classList.add('ua-tablet');
    } else {
      html.classList.add('ua-desktop');
    }
  };

  updateDeviceClass();
  window.addEventListener('resize', updateDeviceClass);

  // OS判定（必要最小限）
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('windows')) html.classList.add('ua-windows');
  if (userAgent.includes('mac')) html.classList.add('ua-mac');
  if (userAgent.includes('iphone')) html.classList.add('ua-iphone');
  if (userAgent.includes('ipad')) html.classList.add('ua-ipad');
  if (userAgent.includes('android')) html.classList.add('ua-android');
});

// ウィンドウサイズ取得（現代的なアプローチ）
let windowWidth = window.innerWidth;

const updateWindowSize = () => {
  windowWidth = window.innerWidth;
};

window.addEventListener('resize', updateWindowSize);
window.addEventListener('orientationchange', updateWindowSize);

/*▼スクロールアニメーション（現代的なアプローチ） ▼*/
// スクロール判定とアニメーション実行
const handleScrollAnimations = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;

  // .scroll-anim 要素の処理
  document.querySelectorAll('.scroll-anim').forEach((element) => {
    const elementTop = element.getBoundingClientRect().top + scrollTop;
    if (scrollTop > elementTop - windowHeight + 150) {
      element.classList.add('scrollin');
    }
  });

  // .anim 要素の処理
  document.querySelectorAll('.anim').forEach((element) => {
    const elementTop = element.getBoundingClientRect().top + scrollTop;
    if (scrollTop > elementTop - windowHeight + 200) {
      element.classList.add('is-animated');
    }
  });
};

// パフォーマンスを考慮したスクロールイベント
let scrollAnimationFrame = null;
const optimizedScrollHandler = () => {
  if (scrollAnimationFrame) return;
  scrollAnimationFrame = requestAnimationFrame(() => {
    handleScrollAnimations();
    scrollAnimationFrame = null;
  });
};

// イベントリスナーの設定
window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// 初回実行
document.addEventListener('DOMContentLoaded', () => {
  handleScrollAnimations();
});
/*▲スクロールアニメーション▲*/

window.addEventListener("scroll", function () {
  const header = document.querySelector("#my-header");
  
  // スクロール量が0より大きければ 'is-scrolled' クラスを付ける
  if (window.scrollY > 0) {
    header.classList.add("is-scrolled");
  } else {
    // 一番上に戻ったらクラスを外す（元に戻る）
    header.classList.remove("is-scrolled");
  }
});

