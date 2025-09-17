// Modal.test.js
// Modal组件的单元测试

import { Modal } from '../components/Modal.js';

// Mock document.createElement
global.document.createElement = jest.fn().mockImplementation(() => ({
  className: '',
  innerHTML: '',
  setAttribute: jest.fn(),
  appendChild: jest.fn(),
  querySelector: jest.fn().mockReturnValue(null),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  style: {},
  textContent: ''
}));

// Mock document.querySelector
global.document.querySelector = jest.fn().mockReturnValue({
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn()
  }
});

// Mock document.body
global.document.body = {
  appendChild: jest.fn(),
  removeChild: jest.fn()
};

// Mock document.addEventListener
global.document.addEventListener = jest.fn();
// Mock document.removeEventListener
global.document.removeEventListener = jest.fn();

describe('Modal组件测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('构造函数', () => {
    it('should create Modal instance with default options', () => {
      const modal = new Modal();

      expect(modal).toBeInstanceOf(Modal);
      expect(modal.element.className).toContain('modal');
    });

    it('should create Modal instance with custom options', () => {
      const options = {
        id: 'test-modal',
        className: 'custom-modal',
        title: '测试模态框',
        content: '这是模态框内容',
        size: 'lg'
      };
      
      const modal = new Modal(options);

      expect(modal.element.id).toBe('test-modal');
      expect(modal.element.className).toContain('custom-modal');
      expect(modal.title).toBe('测试模态框');
      expect(modal.content).toBe('这是模态框内容');
      expect(modal.size).toBe('lg');
    });

    it('should create Modal with footer options', () => {
      const options = {
        footer: '这是模态框底部',
        footerClass: 'custom-footer'
      };
      
      const modal = new Modal(options);

      expect(modal.footer).toBe('这是模态框底部');
      expect(modal.footerClass).toBe('custom-footer');
    });

    it('should create Modal with animation options', () => {
      const options = {
        animation: true,
        animationType: 'fade'
      };
      
      const modal = new Modal(options);

      expect(modal.animation).toBe(true);
      expect(modal.animationType).toBe('fade');
    });
  });

  describe('模态框状态控制', () => {
    it('should open modal correctly', () => {
      const modal = new Modal();
      modal.open();
      
      expect(modal.isOpen).toBe(true);
      expect(global.document.body.appendChild).toHaveBeenCalledWith(modal.element);
    });

    it('should close modal correctly', () => {
      const modal = new Modal();
      modal.isOpen = true;
      modal.element = { className: 'modal' };
      
      modal.close();
      
      expect(modal.isOpen).toBe(false);
      expect(global.document.body.removeChild).toHaveBeenCalledWith(modal.element);
    });

    it('should toggle modal visibility correctly', () => {
      const modal = new Modal();
      
      // 从关闭状态切换到打开状态
      modal.toggle();
      expect(modal.isOpen).toBe(true);
      
      // 从打开状态切换到关闭状态
      modal.toggle();
      expect(modal.isOpen).toBe(false);
    });

    it('should show modal correctly', () => {
      const modal = new Modal();
      modal.show();
      
      expect(modal.isOpen).toBe(true);
    });

    it('should hide modal correctly', () => {
      const modal = new Modal();
      modal.isOpen = true;
      modal.hide();
      
      expect(modal.isOpen).toBe(false);
    });
  });

  describe('模态框内容设置', () => {
    it('should update modal content correctly', () => {
      const modal = new Modal();
      modal.updateContent('新的模态框内容');
      
      expect(modal.content).toBe('新的模态框内容');
    });

    it('should update modal title correctly', () => {
      const modal = new Modal();
      modal.updateTitle('新的模态框标题');
      
      expect(modal.title).toBe('新的模态框标题');
    });

    it('should update modal footer correctly', () => {
      const modal = new Modal();
      modal.updateFooter('新的模态框底部');
      
      expect(modal.footer).toBe('新的模态框底部');
    });

    it('should set modal body correctly', () => {
      const modal = new Modal();
      modal.setBody('新的模态框主体内容');
      
      expect(modal.content).toBe('新的模态框主体内容');
    });
  });

  describe('模态框尺寸设置', () => {
    it('should set modal size to small correctly', () => {
      const modal = new Modal();
      modal.setSize('sm');
      
      expect(modal.size).toBe('sm');
      // 检查是否添加了对应的CSS类
      expect(modal.element.className).toContain('modal-sm');
    });

    it('should set modal size to medium correctly', () => {
      const modal = new Modal();
      modal.setSize('md');
      
      expect(modal.size).toBe('md');
      expect(modal.element.className).toContain('modal-md');
    });

    it('should set modal size to large correctly', () => {
      const modal = new Modal();
      modal.setSize('lg');
      
      expect(modal.size).toBe('lg');
      expect(modal.element.className).toContain('modal-lg');
    });

    it('should set modal size to extra large correctly', () => {
      const modal = new Modal();
      modal.setSize('xl');
      
      expect(modal.size).toBe('xl');
      expect(modal.element.className).toContain('modal-xl');
    });

    it('should set modal size to fullscreen correctly', () => {
      const modal = new Modal();
      modal.setSize('fullscreen');
      
      expect(modal.size).toBe('fullscreen');
      expect(modal.element.className).toContain('modal-fullscreen');
    });
  });

  describe('模态框样式设置', () => {
    it('should set modal width correctly', () => {
      const modal = new Modal();
      modal.setWidth('500px');
      
      expect(modal.width).toBe('500px');
      expect(modal.element.style.width).toBe('500px');
    });

    it('should set modal height correctly', () => {
      const modal = new Modal();
      modal.setHeight('400px');
      
      expect(modal.height).toBe('400px');
      expect(modal.element.style.height).toBe('400px');
    });

    it('should set modal max width correctly', () => {
      const modal = new Modal();
      modal.setMaxWidth('90vw');
      
      expect(modal.maxWidth).toBe('90vw');
      expect(modal.element.style.maxWidth).toBe('90vw');
    });

    it('should set modal max height correctly', () => {
      const modal = new Modal();
      modal.setMaxHeight('90vh');
      
      expect(modal.maxHeight).toBe('90vh');
      expect(modal.element.style.maxHeight).toBe('90vh');
    });

    it('should set modal background color correctly', () => {
      const modal = new Modal();
      modal.setBackground('rgba(0, 0, 0, 0.8)');
      
      expect(modal.background).toBe('rgba(0, 0, 0, 0.8)');
    });
  });

  describe('模态框事件处理', () => {
    it('should handle close event correctly', () => {
      const onCloseMock = jest.fn();
      const modal = new Modal({ onClose: onCloseMock });
      
      // 模拟关闭事件
      modal.handleClose({ preventDefault: jest.fn() });
      
      expect(modal.isOpen).toBe(false);
      expect(onCloseMock).toHaveBeenCalled();
    });

    it('should handle confirm event correctly', () => {
      const onConfirmMock = jest.fn();
      const modal = new Modal({ onConfirm: onConfirmMock });
      
      // 模拟确认事件
      modal.handleConfirm({ preventDefault: jest.fn() });
      
      expect(onConfirmMock).toHaveBeenCalled();
    });

    it('should handle cancel event correctly', () => {
      const onCancelMock = jest.fn();
      const modal = new Modal({ onCancel: onCancelMock });
      
      // 模拟取消事件
      modal.handleCancel({ preventDefault: jest.fn() });
      
      expect(onCancelMock).toHaveBeenCalled();
    });

    it('should handle backdrop click event correctly', () => {
      const modal = new Modal({ closeOnBackdropClick: true });
      modal.close = jest.fn();
      
      // 模拟背景点击事件
      const event = {
        target: { className: 'modal-backdrop' },
        preventDefault: jest.fn()
      };
      
      modal.handleBackdropClick(event);
      
      expect(modal.close).toHaveBeenCalled();
    });

    it('should not close on backdrop click when disabled', () => {
      const modal = new Modal({ closeOnBackdropClick: false });
      modal.close = jest.fn();
      
      // 模拟背景点击事件
      const event = {
        target: { className: 'modal-backdrop' },
        preventDefault: jest.fn()
      };
      
      modal.handleBackdropClick(event);
      
      expect(modal.close).not.toHaveBeenCalled();
    });

    it('should handle ESC key event correctly', () => {
      const modal = new Modal({ closeOnEscape: true });
      modal.close = jest.fn();
      
      // 模拟ESC键事件
      const event = {
        key: 'Escape',
        preventDefault: jest.fn()
      };
      
      modal.handleKeyDown(event);
      
      expect(modal.close).toHaveBeenCalled();
    });

    it('should not close on ESC key when disabled', () => {
      const modal = new Modal({ closeOnEscape: false });
      modal.close = jest.fn();
      
      // 模拟ESC键事件
      const event = {
        key: 'Escape',
        preventDefault: jest.fn()
      };
      
      modal.handleKeyDown(event);
      
      expect(modal.close).not.toHaveBeenCalled();
    });

    it('should not close on non-ESC key events', () => {
      const modal = new Modal({ closeOnEscape: true });
      modal.close = jest.fn();
      
      // 模拟非ESC键事件
      const event = {
        key: 'Enter',
        preventDefault: jest.fn()
      };
      
      modal.handleKeyDown(event);
      
      expect(modal.close).not.toHaveBeenCalled();
    });
  });

  describe('模态框按钮配置', () => {
    it('should set confirm button text correctly', () => {
      const modal = new Modal();
      modal.setConfirmButtonText('确定');
      
      expect(modal.confirmButtonText).toBe('确定');
    });

    it('should set cancel button text correctly', () => {
      const modal = new Modal();
      modal.setCancelButtonText('取消');
      
      expect(modal.cancelButtonText).toBe('取消');
    });

    it('should set confirm button type correctly', () => {
      const modal = new Modal();
      modal.setConfirmButtonType('primary');
      
      expect(modal.confirmButtonType).toBe('primary');
    });

    it('should set cancel button type correctly', () => {
      const modal = new Modal();
      modal.setCancelButtonType('default');
      
      expect(modal.cancelButtonType).toBe('default');
    });

    it('should show confirm button correctly', () => {
      const modal = new Modal({ showConfirmButton: true });
      
      expect(modal.showConfirmButton).toBe(true);
    });

    it('should show cancel button correctly', () => {
      const modal = new Modal({ showCancelButton: true });
      
      expect(modal.showCancelButton).toBe(true);
    });
  });

  describe('模态框方法的链式调用', () => {
    it('should support method chaining for setting properties', () => {
      const modal = new Modal();
      
      // 测试链式调用
      const result = modal.setTitle('链式调用')
                        .setContent('这是通过链式调用设置的内容')
                        .setFooter('链式调用的底部')
                        .setSize('lg')
                        .setWidth('800px')
                        .setConfirmButtonText('确定')
                        .setCancelButtonText('取消');
      
      expect(result).toBe(modal); // 确保返回的是modal实例本身
      expect(modal.title).toBe('链式调用');
      expect(modal.content).toBe('这是通过链式调用设置的内容');
      expect(modal.footer).toBe('链式调用的底部');
      expect(modal.size).toBe('lg');
      expect(modal.width).toBe('800px');
      expect(modal.confirmButtonText).toBe('确定');
      expect(modal.cancelButtonText).toBe('取消');
    });
  });

  describe('模态框位置和对齐', () => {
    it('should set modal position to center correctly', () => {
      const modal = new Modal({ position: 'center' });
      
      expect(modal.position).toBe('center');
      expect(modal.element.className).toContain('modal-center');
    });

    it('should set modal position to top correctly', () => {
      const modal = new Modal({ position: 'top' });
      
      expect(modal.position).toBe('top');
      expect(modal.element.className).toContain('modal-top');
    });

    it('should set modal position to bottom correctly', () => {
      const modal = new Modal({ position: 'bottom' });
      
      expect(modal.position).toBe('bottom');
      expect(modal.element.className).toContain('modal-bottom');
    });
  });

  describe('模态框动画控制', () => {
    it('should enable animation correctly', () => {
      const modal = new Modal();
      modal.enableAnimation();
      
      expect(modal.animation).toBe(true);
    });

    it('should disable animation correctly', () => {
      const modal = new Modal({ animation: true });
      modal.disableAnimation();
      
      expect(modal.animation).toBe(false);
    });

    it('should set animation type correctly', () => {
      const modal = new Modal();
      modal.setAnimationType('slide-up');
      
      expect(modal.animationType).toBe('slide-up');
    });
  });

  describe('模态框辅助功能', () => {
    it('should set modal as draggable correctly', () => {
      const modal = new Modal({ draggable: true });
      
      expect(modal.draggable).toBe(true);
    });

    it('should set modal as resizable correctly', () => {
      const modal = new Modal({ resizable: true });
      
      expect(modal.resizable).toBe(true);
    });

    it('should set modal as fullscreen correctly', () => {
      const modal = new Modal();
      modal.setFullscreen(true);
      
      expect(modal.isFullscreen).toBe(true);
    });

    it('should toggle fullscreen mode correctly', () => {
      const modal = new Modal();
      
      // 切换到全屏模式
      modal.toggleFullscreen();
      expect(modal.isFullscreen).toBe(true);
      
      // 切换回普通模式
      modal.toggleFullscreen();
      expect(modal.isFullscreen).toBe(false);
    });
  });
});