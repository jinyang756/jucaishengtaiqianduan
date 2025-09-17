// Alert.test.js
// Alert组件的单元测试

import { Alert } from '../components/Alert.js';

// Mock document.createElement
global.document.createElement = jest.fn().mockImplementation(() => ({
  className: '',
  innerHTML: '',
  setAttribute: jest.fn(),
  appendChild: jest.fn(),
  querySelector: jest.fn().mockReturnValue(null),
  style: {},
  textContent: ''
}));

// Mock document.querySelector
global.document.querySelector = jest.fn().mockReturnValue({
  appendChild: jest.fn(),
  removeChild: jest.fn()
});

// Mock document.body
global.document.body = {
  appendChild: jest.fn(),
  removeChild: jest.fn()
};

// Mock setTimeout
global.setTimeout = jest.fn((callback) => {
  callback(); // 立即执行回调以简化测试
  return 1; // 返回一个假的timerID
});

// Mock clearTimeout
global.clearTimeout = jest.fn();

describe('Alert组件测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('构造函数', () => {
    it('should create Alert instance with default options', () => {
      const alert = new Alert();

      expect(alert).toBeInstanceOf(Alert);
      expect(alert.element.className).toContain('alert');
    });

    it('should create Alert instance with custom options', () => {
      const options = {
        id: 'test-alert',
        className: 'custom-alert',
        message: '这是一条测试消息',
        type: 'success'
      };
      
      const alert = new Alert(options);

      expect(alert.element.id).toBe('test-alert');
      expect(alert.element.className).toContain('custom-alert');
      expect(alert.message).toBe('这是一条测试消息');
      expect(alert.type).toBe('success');
    });

    it('should create Alert with title option', () => {
      const options = {
        title: '提示',
        message: '这是一条带标题的提示消息'
      };
      
      const alert = new Alert(options);

      expect(alert.title).toBe('提示');
    });

    it('should create Alert with icon option', () => {
      const options = {
        message: '这是一条带图标的提示消息',
        icon: true
      };
      
      const alert = new Alert(options);

      expect(alert.icon).toBe(true);
    });
  });

  describe('Alert类型设置', () => {
    it('should set Alert type to success correctly', () => {
      const alert = new Alert();
      alert.setType('success');
      
      expect(alert.type).toBe('success');
      expect(alert.element.className).toContain('alert-success');
    });

    it('should set Alert type to error correctly', () => {
      const alert = new Alert();
      alert.setType('error');
      
      expect(alert.type).toBe('error');
      expect(alert.element.className).toContain('alert-error');
    });

    it('should set Alert type to warning correctly', () => {
      const alert = new Alert();
      alert.setType('warning');
      
      expect(alert.type).toBe('warning');
      expect(alert.element.className).toContain('alert-warning');
    });

    it('should set Alert type to info correctly', () => {
      const alert = new Alert();
      alert.setType('info');
      
      expect(alert.type).toBe('info');
      expect(alert.element.className).toContain('alert-info');
    });

    it('should set Alert type to primary correctly', () => {
      const alert = new Alert();
      alert.setType('primary');
      
      expect(alert.type).toBe('primary');
      expect(alert.element.className).toContain('alert-primary');
    });
  });

  describe('Alert尺寸设置', () => {
    it('should set Alert size to small correctly', () => {
      const alert = new Alert();
      alert.setSize('sm');
      
      expect(alert.size).toBe('sm');
      expect(alert.element.className).toContain('alert-sm');
    });

    it('should set Alert size to medium correctly', () => {
      const alert = new Alert();
      alert.setSize('md');
      
      expect(alert.size).toBe('md');
      expect(alert.element.className).toContain('alert-md');
    });

    it('should set Alert size to large correctly', () => {
      const alert = new Alert();
      alert.setSize('lg');
      
      expect(alert.size).toBe('lg');
      expect(alert.element.className).toContain('alert-lg');
    });

    it('should set Alert size to extra large correctly', () => {
      const alert = new Alert();
      alert.setSize('xl');
      
      expect(alert.size).toBe('xl');
      expect(alert.element.className).toContain('alert-xl');
    });
  });

  describe('Alert内容设置', () => {
    it('should update Alert message correctly', () => {
      const alert = new Alert();
      alert.updateMessage('新的提示消息');
      
      expect(alert.message).toBe('新的提示消息');
    });

    it('should update Alert title correctly', () => {
      const alert = new Alert();
      alert.updateTitle('新的提示标题');
      
      expect(alert.title).toBe('新的提示标题');
    });

    it('should set Alert content correctly', () => {
      const alert = new Alert();
      alert.setContent('新的提示内容');
      
      expect(alert.message).toBe('新的提示内容');
    });
  });

  describe('Alert显示和隐藏', () => {
    it('should show Alert correctly', () => {
      const alert = new Alert();
      alert.show();
      
      expect(alert.isVisible).toBe(true);
      expect(global.document.body.appendChild).toHaveBeenCalledWith(alert.element);
    });

    it('should hide Alert correctly', () => {
      const alert = new Alert();
      alert.isVisible = true;
      alert.element = { className: 'alert' };
      
      alert.hide();
      
      expect(alert.isVisible).toBe(false);
      expect(global.document.body.removeChild).toHaveBeenCalledWith(alert.element);
    });

    it('should toggle Alert visibility correctly', () => {
      const alert = new Alert();
      
      // 从隐藏状态切换到显示状态
      alert.toggle();
      expect(alert.isVisible).toBe(true);
      
      // 从显示状态切换到隐藏状态
      alert.toggle();
      expect(alert.isVisible).toBe(false);
    });

    it('should render Alert to container when container is provided', () => {
      const container = {
        appendChild: jest.fn()
      };
      const options = {
        container: container
      };
      
      const alert = new Alert(options);
      alert.render();

      expect(container.appendChild).toHaveBeenCalledWith(alert.element);
    });

    it('should render Alert to container specified by containerId', () => {
      const alert = new Alert({ containerId: 'test-container' });
      alert.render();

      expect(global.document.querySelector).toHaveBeenCalledWith('#test-container');
      const container = global.document.querySelector.mock.results[0].value;
      expect(container.appendChild).toHaveBeenCalledWith(alert.element);
    });
  });

  describe('Alert自动关闭功能', () => {
    it('should enable auto close correctly', () => {
      const alert = new Alert();
      alert.setAutoClose(true);
      
      expect(alert.autoClose).toBe(true);
    });

    it('should set auto close duration correctly', () => {
      const alert = new Alert();
      alert.setAutoCloseDuration(3000);
      
      expect(alert.autoCloseDuration).toBe(3000);
    });

    it('should start auto close timer when autoClose is enabled', () => {
      const alert = new Alert({ autoClose: true, autoCloseDuration: 3000 });
      alert.hide = jest.fn();
      alert.startAutoCloseTimer();
      
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
      // 由于我们在mock中立即执行了回调，hide方法应该被调用
      expect(alert.hide).toHaveBeenCalled();
    });

    it('should clear auto close timer correctly', () => {
      const alert = new Alert();
      alert.autoCloseTimer = 1; // 模拟一个timerID
      alert.clearAutoCloseTimer();
      
      expect(global.clearTimeout).toHaveBeenCalledWith(1);
    });
  });

  describe('Alert位置设置', () => {
    it('should set Alert position to top-right correctly', () => {
      const alert = new Alert({ position: 'top-right' });
      
      expect(alert.position).toBe('top-right');
      expect(alert.element.className).toContain('alert-top-right');
    });

    it('should set Alert position to top-left correctly', () => {
      const alert = new Alert({ position: 'top-left' });
      
      expect(alert.position).toBe('top-left');
      expect(alert.element.className).toContain('alert-top-left');
    });

    it('should set Alert position to bottom-right correctly', () => {
      const alert = new Alert({ position: 'bottom-right' });
      
      expect(alert.position).toBe('bottom-right');
      expect(alert.element.className).toContain('alert-bottom-right');
    });

    it('should set Alert position to bottom-left correctly', () => {
      const alert = new Alert({ position: 'bottom-left' });
      
      expect(alert.position).toBe('bottom-left');
      expect(alert.element.className).toContain('alert-bottom-left');
    });

    it('should set Alert position to top-center correctly', () => {
      const alert = new Alert({ position: 'top-center' });
      
      expect(alert.position).toBe('top-center');
      expect(alert.element.className).toContain('alert-top-center');
    });

    it('should set Alert position to bottom-center correctly', () => {
      const alert = new Alert({ position: 'bottom-center' });
      
      expect(alert.position).toBe('bottom-center');
      expect(alert.element.className).toContain('alert-bottom-center');
    });
  });

  describe('Alert事件处理', () => {
    it('should handle close event correctly', () => {
      const onCloseMock = jest.fn();
      const alert = new Alert({ onClose: onCloseMock });
      
      // 模拟关闭事件
      alert.handleClose({ preventDefault: jest.fn() });
      
      expect(alert.isVisible).toBe(false);
      expect(onCloseMock).toHaveBeenCalled();
    });

    it('should handle click event correctly', () => {
      const onClickMock = jest.fn();
      const alert = new Alert({ onClick: onClickMock });
      
      // 模拟点击事件
      const event = {
        preventDefault: jest.fn()
      };
      
      alert.handleClick(event);
      
      expect(onClickMock).toHaveBeenCalledWith(event);
    });

    it('should handle close button click event correctly', () => {
      const alert = new Alert();
      alert.hide = jest.fn();
      
      // 模拟关闭按钮点击事件
      const event = {
        preventDefault: jest.fn()
      };
      
      alert.handleCloseButtonClick(event);
      
      expect(alert.hide).toHaveBeenCalled();
    });
  });

  describe('Alert样式设置', () => {
    it('should set Alert width correctly', () => {
      const alert = new Alert();
      alert.setWidth('300px');
      
      expect(alert.width).toBe('300px');
      expect(alert.element.style.width).toBe('300px');
    });

    it('should set Alert height correctly', () => {
      const alert = new Alert();
      alert.setHeight('100px');
      
      expect(alert.height).toBe('100px');
      expect(alert.element.style.height).toBe('100px');
    });

    it('should set Alert padding correctly', () => {
      const alert = new Alert();
      alert.setPadding('p-4');
      
      expect(alert.padding).toBe('p-4');
      expect(alert.element.className).toContain('p-4');
    });

    it('should set Alert margin correctly', () => {
      const alert = new Alert();
      alert.setMargin('m-2');
      
      expect(alert.margin).toBe('m-2');
      expect(alert.element.className).toContain('m-2');
    });

    it('should set Alert z-index correctly', () => {
      const alert = new Alert();
      alert.setZIndex(1050);
      
      expect(alert.zIndex).toBe(1050);
      expect(alert.element.style.zIndex).toBe('1050');
    });
  });

  describe('Alert图标设置', () => {
    it('should enable icon correctly', () => {
      const alert = new Alert();
      alert.enableIcon();
      
      expect(alert.icon).toBe(true);
    });

    it('should disable icon correctly', () => {
      const alert = new Alert({ icon: true });
      alert.disableIcon();
      
      expect(alert.icon).toBe(false);
    });

    it('should set custom icon correctly', () => {
      const alert = new Alert();
      alert.setCustomIcon('custom-icon-class');
      
      expect(alert.customIcon).toBe('custom-icon-class');
    });
  });

  describe('Alert方法的链式调用', () => {
    it('should support method chaining for setting properties', () => {
      const alert = new Alert();
      
      // 测试链式调用
      const result = alert.setType('success')
                        .setMessage('操作成功')
                        .setTitle('成功')
                        .setSize('md')
                        .setPosition('top-right')
                        .setAutoClose(true)
                        .setAutoCloseDuration(3000)
                        .enableIcon();
      
      expect(result).toBe(alert); // 确保返回的是alert实例本身
      expect(alert.type).toBe('success');
      expect(alert.message).toBe('操作成功');
      expect(alert.title).toBe('成功');
      expect(alert.size).toBe('md');
      expect(alert.position).toBe('top-right');
      expect(alert.autoClose).toBe(true);
      expect(alert.autoCloseDuration).toBe(3000);
      expect(alert.icon).toBe(true);
    });
  });

  describe('Alert辅助方法', () => {
    it('should create success Alert correctly', () => {
      const alert = Alert.success('操作成功');
      
      expect(alert).toBeInstanceOf(Alert);
      expect(alert.type).toBe('success');
      expect(alert.message).toBe('操作成功');
    });

    it('should create error Alert correctly', () => {
      const alert = Alert.error('操作失败');
      
      expect(alert).toBeInstanceOf(Alert);
      expect(alert.type).toBe('error');
      expect(alert.message).toBe('操作失败');
    });

    it('should create warning Alert correctly', () => {
      const alert = Alert.warning('警告信息');
      
      expect(alert).toBeInstanceOf(Alert);
      expect(alert.type).toBe('warning');
      expect(alert.message).toBe('警告信息');
    });

    it('should create info Alert correctly', () => {
      const alert = Alert.info('提示信息');
      
      expect(alert).toBeInstanceOf(Alert);
      expect(alert.type).toBe('info');
      expect(alert.message).toBe('提示信息');
    });

    it('should create primary Alert correctly', () => {
      const alert = Alert.primary('重要提示');
      
      expect(alert).toBeInstanceOf(Alert);
      expect(alert.type).toBe('primary');
      expect(alert.message).toBe('重要提示');
    });
  });
});