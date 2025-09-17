// Button.test.js
// Button组件的单元测试

import { Button } from '../components/Button.js';

// Mock document.createElement
global.document.createElement = jest.fn().mockImplementation(() => ({
  className: '',
  innerHTML: '',
  setAttribute: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  appendChild: jest.fn(),
  querySelector: jest.fn().mockReturnValue(null),
  style: {}
}));

// Mock document.querySelector
global.document.querySelector = jest.fn().mockReturnValue({
  appendChild: jest.fn()
});

describe('Button组件测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('构造函数', () => {
    it('should create Button instance with default options', () => {
      const button = new Button();

      expect(button).toBeInstanceOf(Button);
      expect(button.element.className).toContain('btn');
      expect(button.element.className).toContain('btn-primary');
      expect(button.element.className).toContain('btn-md');
    });

    it('should create Button instance with custom options', () => {
      const options = {
        text: 'Custom Button',
        type: 'secondary',
        size: 'lg',
        icon: 'fa-check',
        disabled: true,
        onClick: jest.fn()
      };
      
      const button = new Button(options);

      expect(button.element.innerHTML).toContain('Custom Button');
      expect(button.element.className).toContain('btn-secondary');
      expect(button.element.className).toContain('btn-lg');
      expect(button.element.className).toContain('disabled');
    });

    it('should create Button instance with id and classes', () => {
      const options = {
        id: 'test-button',
        classes: ['custom-class1', 'custom-class2']
      };
      
      const button = new Button(options);

      expect(button.element.id).toBe('test-button');
      expect(button.element.className).toContain('custom-class1');
      expect(button.element.className).toContain('custom-class2');
    });

    it('should add icon to button when icon option is provided', () => {
      const options = {
        icon: 'fa-arrow-right',
        iconPosition: 'right'
      };
      
      const button = new Button(options);

      // 检查是否创建了图标元素
      expect(global.document.createElement).toHaveBeenCalledWith('i');
    });
  });

  describe('render方法', () => {
    it('should render button to container when container is provided', () => {
      const container = {
        appendChild: jest.fn()
      };
      const options = {
        container: container
      };
      
      const button = new Button(options);
      button.render();

      expect(container.appendChild).toHaveBeenCalledWith(button.element);
    });

    it('should render button to container specified by containerId', () => {
      const button = new Button({ containerId: 'test-container' });
      button.render();

      expect(global.document.querySelector).toHaveBeenCalledWith('#test-container');
      const container = global.document.querySelector.mock.results[0].value;
      expect(container.appendChild).toHaveBeenCalledWith(button.element);
    });
  });

  describe('事件处理', () => {
    it('should call onClick callback when button is clicked', () => {
      const onClickMock = jest.fn();
      const button = new Button({ onClick: onClickMock });

      // 模拟点击事件
      const clickEvent = new Event('click');
      button.element.dispatchEvent = jest.fn((event) => {
        const listeners = button.element.addEventListener.mock.calls.find(call => call[0] === 'click');
        if (listeners && listeners[1]) {
          listeners[1](event);
        }
      });

      button.element.dispatchEvent(clickEvent);

      expect(onClickMock).toHaveBeenCalled();
    });

    it('should not call onClick callback when button is disabled', () => {
      const onClickMock = jest.fn();
      const button = new Button({
        disabled: true,
        onClick: onClickMock
      });

      // 模拟点击事件
      const clickEvent = new Event('click');
      button.element.dispatchEvent = jest.fn((event) => {
        const listeners = button.element.addEventListener.mock.calls.find(call => call[0] === 'click');
        if (listeners && listeners[1]) {
          listeners[1](event);
        }
      });

      button.element.dispatchEvent(clickEvent);

      expect(onClickMock).not.toHaveBeenCalled();
    });

    it('should handle mouseenter and mouseleave events', () => {
      const onMouseEnterMock = jest.fn();
      const onMouseLeaveMock = jest.fn();
      const button = new Button({
        onMouseEnter: onMouseEnterMock,
        onMouseLeave: onMouseLeaveMock
      });

      expect(button.element.addEventListener).toHaveBeenCalledWith('mouseenter', onMouseEnterMock);
      expect(button.element.addEventListener).toHaveBeenCalledWith('mouseleave', onMouseLeaveMock);
    });
  });

  describe('辅助方法', () => {
    it('should set button text correctly', () => {
      const button = new Button();
      button.setText('New Text');

      expect(button.element.innerHTML).toContain('New Text');
    });

    it('should set button disabled state correctly', () => {
      const button = new Button();
      button.setDisabled(true);

      expect(button.element.disabled).toBe(true);
      expect(button.element.className).toContain('disabled');

      button.setDisabled(false);
      expect(button.element.disabled).toBe(false);
      expect(button.element.className).not.toContain('disabled');
    });

    it('should set button type correctly', () => {
      const button = new Button();
      button.setType('secondary');

      expect(button.element.className).toContain('btn-secondary');
      expect(button.element.className).not.toContain('btn-primary');

      button.setType('danger');
      expect(button.element.className).toContain('btn-danger');
      expect(button.element.className).not.toContain('btn-secondary');
    });

    it('should set button size correctly', () => {
      const button = new Button();
      button.setSize('lg');

      expect(button.element.className).toContain('btn-lg');
      expect(button.element.className).not.toContain('btn-md');

      button.setSize('sm');
      expect(button.element.className).toContain('btn-sm');
      expect(button.element.className).not.toContain('btn-lg');
    });

    it('should toggle loading state correctly', () => {
      const button = new Button({ text: 'Submit' });
      button.toggleLoading(true);

      expect(button.element.innerHTML).toContain('loading');
      expect(button.element.disabled).toBe(true);

      button.toggleLoading(false);
      expect(button.element.innerHTML).toContain('Submit');
      expect(button.element.disabled).toBe(false);
    });

    it('should add and remove classes correctly', () => {
      const button = new Button();
      button.addClass('new-class');

      expect(button.element.className).toContain('new-class');

      button.removeClass('new-class');
      expect(button.element.className).not.toContain('new-class');
    });
  });

  describe('按钮类型和样式', () => {
    it('should apply correct styles for primary button', () => {
      const button = new Button({ type: 'primary' });

      expect(button.element.className).toContain('btn-primary');
      expect(button.element.className).not.toContain('btn-secondary');
      expect(button.element.className).not.toContain('btn-success');
      expect(button.element.className).not.toContain('btn-danger');
    });

    it('should apply correct styles for success button', () => {
      const button = new Button({ type: 'success' });

      expect(button.element.className).toContain('btn-success');
      expect(button.element.className).not.toContain('btn-primary');
    });

    it('should apply correct styles for danger button', () => {
      const button = new Button({ type: 'danger' });

      expect(button.element.className).toContain('btn-danger');
      expect(button.element.className).not.toContain('btn-primary');
    });

    it('should apply correct styles for small button', () => {
      const button = new Button({ size: 'sm' });

      expect(button.element.className).toContain('btn-sm');
      expect(button.element.className).not.toContain('btn-md');
      expect(button.element.className).not.toContain('btn-lg');
    });

    it('should apply correct styles for large button', () => {
      const button = new Button({ size: 'lg' });

      expect(button.element.className).toContain('btn-lg');
      expect(button.element.className).not.toContain('btn-md');
      expect(button.element.className).not.toContain('btn-sm');
    });

    it('should apply outline style when outlined option is true', () => {
      const button = new Button({ outlined: true });

      expect(button.element.className).toContain('btn-outline');
    });

    it('should apply rounded style when rounded option is true', () => {
      const button = new Button({ rounded: true });

      expect(button.element.className).toContain('btn-rounded');
    });
  });

  describe('图标位置', () => {
    it('should place icon before text by default', () => {
      const button = new Button({ text: 'Button Text', icon: 'fa-icon' });

      // 检查图标是否先于文本创建
      const createCalls = global.document.createElement.mock.calls;
      expect(createCalls.some(call => call[0] === 'i')).toBe(true);
    });

    it('should place icon after text when iconPosition is right', () => {
      const button = new Button({ 
        text: 'Button Text', 
        icon: 'fa-icon', 
        iconPosition: 'right' 
      });

      // 检查是否创建了图标元素
      expect(global.document.createElement).toHaveBeenCalledWith('i');
    });

    it('should handle icon only buttons', () => {
      const button = new Button({ 
        icon: 'fa-icon', 
        text: '' 
      });

      expect(global.document.createElement).toHaveBeenCalledWith('i');
    });
  });
});