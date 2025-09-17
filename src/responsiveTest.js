// 响应式布局测试工具

/**
 * 响应式布局测试类
 * 用于测试不同屏幕尺寸下的布局表现
 */
class ResponsiveTester {
  constructor() {
    this.breakpoints = {
      xs: 360, // 小型手机
      sm: 480, // 中型手机
      md: 768, // 平板
      lg: 1024, // 小型桌面
      xl: 1280, // 中型桌面
      '2xl': 1536 // 大型桌面
    };
    
    this.testResults = {};
  }

  /**
   * 运行响应式布局测试
   */
  runTests() {
    console.log('开始响应式布局测试...');
    
    // 测试当前窗口大小
    this.testCurrentSize();
    
    // 测试预设的断点
    this.testBreakpoints();
    
    // 测试触摸设备支持
    this.testTouchSupport();
    
    // 生成测试报告
    this.generateReport();
  }

  /**
   * 测试当前窗口大小
   */
  testCurrentSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    console.log(`当前窗口尺寸: ${width}x${height}`);
    
    // 检测当前设备类型
    let deviceType = 'unknown';
    if (width < this.breakpoints.sm) {
      deviceType = '小型手机';
    } else if (width < this.breakpoints.md) {
      deviceType = '中型手机';
    } else if (width < this.breakpoints.lg) {
      deviceType = '平板';
    } else if (width < this.breakpoints.xl) {
      deviceType = '小型桌面';
    } else {
      deviceType = '大型桌面';
    }
    
    console.log(`当前设备类型: ${deviceType}`);
    
    this.testResults.currentSize = {
      width,
      height,
      deviceType
    };
  }

  /**
   * 测试所有断点
   */
  testBreakpoints() {
    console.log('\n测试断点适配:');
    
    const results = {};
    
    Object.entries(this.breakpoints).forEach(([key, value]) => {
      // 检查当前断点的样式是否生效
      const isActive = this.checkBreakpointActive(key);
      
      results[key] = {
        width: value,
        isActive
      };
      
      console.log(`- ${key} (${value}px): ${isActive ? '✅ 生效' : '❌ 未生效'}`);
    });
    
    this.testResults.breakpoints = results;
  }

  /**
   * 检查指定断点的样式是否生效
   * @param {string} breakpoint - 断点名称
   * @returns {boolean} 是否生效
   */
  checkBreakpointActive(breakpoint) {
    // 创建一个测试元素
    const testElement = document.createElement('div');
    testElement.style.position = 'absolute';
    testElement.style.width = '1px';
    testElement.style.height = '1px';
    testElement.style.opacity = '0';
    
    // 设置Tailwind的断点测试类
    let testClass = '';
    switch (breakpoint) {
      case 'xs':
        testClass = 'block';
        break;
      case 'sm':
        testClass = 'hidden sm:block';
        break;
      case 'md':
        testClass = 'hidden md:block';
        break;
      case 'lg':
        testClass = 'hidden lg:block';
        break;
      case 'xl':
        testClass = 'hidden xl:block';
        break;
      case '2xl':
        testClass = 'hidden 2xl:block';
        break;
      default:
        testClass = 'block';
    }
    
    testElement.className = testClass;
    document.body.appendChild(testElement);
    
    // 获取计算样式
    const computedStyle = window.getComputedStyle(testElement);
    const isActive = computedStyle.display !== 'none';
    
    // 移除测试元素
    document.body.removeChild(testElement);
    
    return isActive;
  }

  /**
   * 测试触摸设备支持
   */
  testTouchSupport() {
    console.log('\n测试触摸设备支持:');
    
    const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const pointerEventsSupported = 'PointerEvent' in window;
    
    console.log(`- 触摸支持: ${hasTouchSupport ? '✅ 支持' : '❌ 不支持'}`);
    console.log(`- Pointer Events: ${pointerEventsSupported ? '✅ 支持' : '❌ 不支持'}`);
    
    this.testResults.touchSupport = {
      hasTouchSupport,
      pointerEventsSupported
    };
  }

  /**
   * 生成测试报告
   */
  generateReport() {
    console.log('\n响应式布局测试报告');
    console.log('==================');
    console.log('\n建议:');
    
    const { currentSize } = this.testResults;
    
    // 移动设备优化建议
    if (currentSize.width < this.breakpoints.md) {
      console.log('1. 确保导航菜单在移动设备上可折叠');
      console.log('2. 检查表格内容在小屏幕上是否可滚动');
      console.log('3. 确保按钮和交互元素足够大，适合触摸操作');
      console.log('4. 验证字体大小在小屏幕上仍然清晰可读');
    } else {
      console.log('1. 在大屏幕上利用空间展示更多内容');
      console.log('2. 确保布局不会过度拉伸或变形');
      console.log('3. 验证多列布局在不同桌面尺寸上的表现');
    }
    
    // 触摸设备建议
    if (this.testResults.touchSupport.hasTouchSupport) {
      console.log('4. 优化触摸反馈和交互体验');
      console.log('5. 考虑添加手势支持增强用户体验');
    }
    
    console.log('\n测试完成！按F12打开开发者工具，使用设备模拟功能可以测试更多设备尺寸。');
  }

  /**
   * 添加响应式布局测试按钮到页面
   */
  addTestButton() {
    const button = document.createElement('button');
    button.id = 'responsive-test-button';
    button.textContent = '测试响应式布局';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#10B981';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    
    button.addEventListener('click', () => {
      this.runTests();
      alert('响应式布局测试已开始，请查看浏览器控制台获取详细结果。\n(按F12或右键->检查打开控制台)');
    });
    
    document.body.appendChild(button);
  }
}

/**
 * 创建并导出响应式测试实例
 */
const responsiveTester = new ResponsiveTester();

export default responsiveTester;

export { ResponsiveTester };