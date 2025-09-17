// Card.test.js
// Card组件的单元测试

import { Card } from '../components/Card.js';

// Mock document.createElement
global.document.createElement = jest.fn().mockImplementation(() => ({
  className: '',
  innerHTML: '',
  setAttribute: jest.fn(),
  appendChild: jest.fn(),
  querySelector: jest.fn().mockReturnValue(null),
  style: {}
}));

// Mock document.querySelector
global.document.querySelector = jest.fn().mockReturnValue({
  appendChild: jest.fn()
});

describe('Card组件测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('构造函数', () => {
    it('should create Card instance with default options', () => {
      const card = new Card();

      expect(card).toBeInstanceOf(Card);
      expect(card.element.className).toContain('card');
    });

    it('should create Card instance with custom options', () => {
      const options = {
        title: '测试卡片',
        content: '这是卡片内容',
        footer: '这是卡片底部',
        className: 'custom-card',
        id: 'test-card'
      };
      
      const card = new Card(options);

      expect(card.element.id).toBe('test-card');
      expect(card.element.className).toContain('custom-card');
    });

    it('should create Card with shadow option', () => {
      const card = new Card({ shadow: 'lg' });

      expect(card.element.className).toContain('card-shadow-lg');
    });

    it('should create Card with border option', () => {
      const card = new Card({ border: true, borderColor: 'border-blue-500' });

      expect(card.element.className).toContain('card-border');
      expect(card.element.className).toContain('border-blue-500');
    });

    it('should create Card with hover effect', () => {
      const card = new Card({ hoverEffect: true });

      expect(card.element.className).toContain('card-hover');
    });
  });

  describe('render方法', () => {
    it('should render card to container when container is provided', () => {
      const container = {
        appendChild: jest.fn()
      };
      const options = {
        container: container
      };
      
      const card = new Card(options);
      card.render();

      expect(container.appendChild).toHaveBeenCalledWith(card.element);
    });

    it('should render card to container specified by containerId', () => {
      const card = new Card({ containerId: 'test-container' });
      card.render();

      expect(global.document.querySelector).toHaveBeenCalledWith('#test-container');
      const container = global.document.querySelector.mock.results[0].value;
      expect(container.appendChild).toHaveBeenCalledWith(card.element);
    });

    it('should render card with title, content and footer', () => {
      const options = {
        title: '测试标题',
        content: '测试内容',
        footer: '测试底部'
      };
      
      const card = new Card(options);
      card.render();

      // 检查是否创建了卡片结构元素
      expect(global.document.createElement).toHaveBeenCalledWith('div');
      expect(global.document.createElement).toHaveBeenCalledWith('div');
      expect(global.document.createElement).toHaveBeenCalledWith('div');
    });
  });

  describe('内容设置方法', () => {
    it('should set card header correctly', () => {
      const card = new Card();
      card.setHeader('新的头部内容');

      // 检查是否正确设置了头部
      expect(card.header).toBe('新的头部内容');
    });

    it('should set card content correctly', () => {
      const card = new Card();
      card.setContent('新的卡片内容');

      expect(card.content).toBe('新的卡片内容');
    });

    it('should set card footer correctly', () => {
      const card = new Card();
      card.setFooter('新的底部内容');

      expect(card.footer).toBe('新的底部内容');
    });

    it('should update card title correctly', () => {
      const card = new Card({ title: '初始标题' });
      card.setTitle('更新后的标题');

      expect(card.title).toBe('更新后的标题');
    });

    it('should set card body correctly', () => {
      const card = new Card();
      card.setBody('新的主体内容');

      expect(card.content).toBe('新的主体内容');
    });
  });

  describe('样式和选项设置', () => {
    it('should set card shadow correctly', () => {
      const card = new Card();
      card.setShadow('md');

      expect(card.shadow).toBe('md');
    });

    it('should set card border correctly', () => {
      const card = new Card();
      card.setBorder(true, 'border-green-500');

      expect(card.border).toBe(true);
      expect(card.borderColor).toBe('border-green-500');
    });

    it('should toggle hover effect correctly', () => {
      const card = new Card();
      card.setHoverEffect(true);

      expect(card.hoverEffect).toBe(true);

      card.setHoverEffect(false);
      expect(card.hoverEffect).toBe(false);
    });

    it('should set card padding correctly', () => {
      const card = new Card();
      card.setPadding('p-6');

      expect(card.padding).toBe('p-6');
    });

    it('should set card margin correctly', () => {
      const card = new Card();
      card.setMargin('m-4');

      expect(card.margin).toBe('m-4');
    });
  });

  describe('卡片布局和结构', () => {
    it('should create card with header, body and footer sections', () => {
      const options = {
        title: '标题',
        content: '内容',
        footer: '底部'
      };
      
      const card = new Card(options);

      // 检查卡片是否创建了所有必要的部分
      expect(card.hasHeader).toBe(true);
      expect(card.hasContent).toBe(true);
      expect(card.hasFooter).toBe(true);
    });

    it('should create card without header when title is not provided', () => {
      const card = new Card({ content: '只有内容的卡片' });

      expect(card.hasHeader).toBe(false);
      expect(card.hasContent).toBe(true);
      expect(card.hasFooter).toBe(false);
    });

    it('should create card without footer when footer is not provided', () => {
      const card = new Card({ title: '只有标题的卡片' });

      expect(card.hasHeader).toBe(true);
      expect(card.hasContent).toBe(false);
      expect(card.hasFooter).toBe(false);
    });

    it('should create card with only content', () => {
      const card = new Card({ content: '简单卡片' });

      expect(card.hasHeader).toBe(false);
      expect(card.hasContent).toBe(true);
      expect(card.hasFooter).toBe(false);
    });
  });

  describe('卡片尺寸和响应式', () => {
    it('should set card width correctly', () => {
      const card = new Card({ width: 'w-full' });

      expect(card.element.className).toContain('w-full');
    });

    it('should set card height correctly', () => {
      const card = new Card({ height: 'h-64' });

      expect(card.element.className).toContain('h-64');
    });

    it('should apply responsive classes correctly', () => {
      const options = {
        responsiveClasses: ['md:w-1/2', 'lg:w-1/3']
      };
      
      const card = new Card(options);

      expect(card.element.className).toContain('md:w-1/2');
      expect(card.element.className).toContain('lg:w-1/3');
    });
  });

  describe('自定义类和属性', () => {
    it('should add multiple custom classes correctly', () => {
      const options = {
        className: 'class1 class2 class3'
      };
      
      const card = new Card(options);

      expect(card.element.className).toContain('class1');
      expect(card.element.className).toContain('class2');
      expect(card.element.className).toContain('class3');
    });

    it('should add custom attributes correctly', () => {
      const options = {
        attributes: {
          'data-card-type': 'info',
          'data-id': 'card-001'
        }
      };
      
      const card = new Card(options);

      // 检查是否设置了自定义属性
      const setAttributeCalls = global.document.createElement.mock.results[0].value.setAttribute.mock.calls;
      const hasCardType = setAttributeCalls.some(call => call[0] === 'data-card-type' && call[1] === 'info');
      const hasCardId = setAttributeCalls.some(call => call[0] === 'data-id' && call[1] === 'card-001');
      
      expect(hasCardType).toBe(true);
      expect(hasCardId).toBe(true);
    });

    it('should add header and footer classes correctly', () => {
      const options = {
        headerClass: 'bg-blue-50',
        footerClass: 'bg-gray-50'
      };
      
      const card = new Card(options);

      expect(card.headerClass).toBe('bg-blue-50');
      expect(card.footerClass).toBe('bg-gray-50');
    });
  });

  describe('卡片方法的链式调用', () => {
    it('should support method chaining for setting properties', () => {
      const card = new Card();
      
      // 测试链式调用
      const result = card.setTitle('链式调用')
                       .setContent('这是通过链式调用设置的内容')
                       .setFooter('链式调用的底部')
                       .setShadow('lg')
                       .setBorder(true);
      
      expect(result).toBe(card); // 确保返回的是card实例本身
      expect(card.title).toBe('链式调用');
      expect(card.content).toBe('这是通过链式调用设置的内容');
      expect(card.footer).toBe('链式调用的底部');
      expect(card.shadow).toBe('lg');
      expect(card.border).toBe(true);
    });
  });
});