/**
 * 图片懒加载工具
 * 用于优化页面加载性能，只在图片即将进入视口时才加载
 */

/**
 * 初始化图片懒加载
 */
export function initLazyLoad() {
  // 检查浏览器是否支持IntersectionObserver
  if ('IntersectionObserver' in window) {
    // 创建观察者实例
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // 当图片进入视口时
        if (entry.isIntersecting) {
          const img = entry.target;
          // 获取原始图片URL
          const dataSrc = img.getAttribute('data-src');
          
          if (dataSrc) {
            // 设置图片源
            img.src = dataSrc;
            // 移除data-src属性
            img.removeAttribute('data-src');
            // 给图片添加加载完成的类
            img.classList.add('lazy-loaded');
            // 停止观察当前图片
            observer.unobserve(img);
          }
        }
      });
    }, {
      // 设置根边距，让图片在距离视口100px时就开始加载
      rootMargin: '0px 0px 100px 0px',
      threshold: 0.1
    });

    // 获取所有需要懒加载的图片
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // 为每个图片添加观察
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });

    console.log('图片懒加载初始化完成，共观察', lazyImages.length, '张图片');
  } else {
    // 降级处理：如果浏览器不支持IntersectionObserver，则立即加载所有图片
    loadAllImagesFallback();
  }
}

/**
 * 降级方案：当IntersectionObserver不支持时，立即加载所有图片
 */
function loadAllImagesFallback() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  lazyImages.forEach(img => {
    const dataSrc = img.getAttribute('data-src');
    if (dataSrc) {
      img.src = dataSrc;
      img.removeAttribute('data-src');
      img.classList.add('lazy-loaded');
    }
  });

  console.log('使用降级方案加载所有图片，共加载', lazyImages.length, '张图片');
}

/**
 * 为页面动态添加的图片添加懒加载
 * @param {NodeList|Array} images - 要添加懒加载的图片元素列表
 */
export function addLazyLoadToImages(images) {
  if (!images || !images.length) return;

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const dataSrc = img.getAttribute('data-src');
          
          if (dataSrc) {
            img.src = dataSrc;
            img.removeAttribute('data-src');
            img.classList.add('lazy-loaded');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '0px 0px 100px 0px',
      threshold: 0.1
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // 降级处理
    images.forEach(img => {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        img.src = dataSrc;
        img.removeAttribute('data-src');
        img.classList.add('lazy-loaded');
      }
    });
  }
}

/**
 * 为图片元素设置懒加载属性
 * @param {HTMLImageElement} imgElement - 图片元素
 * @param {string} src - 图片实际地址
 * @param {string} placeholderSrc - 占位图地址
 */
export function setLazyLoadImage(imgElement, src, placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmMGYwZjAiPjwvcmVjdD4KICA8cGF0aCBkPSJNMzAgMTUwTDI3MCAxNTBNMzAgMTAwTDI3MCAxMDBNMzAgNTBMMjcwIDUwIiBzdHJva2U9IiNmMGYwZjAiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=') {
  if (imgElement) {
    // 设置占位图
    imgElement.src = placeholderSrc;
    // 设置实际图片地址到data-src属性
    imgElement.setAttribute('data-src', src);
    // 添加懒加载类
    imgElement.classList.add('lazy-load');
  }
}