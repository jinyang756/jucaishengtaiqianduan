// Table.test.js
// Table组件的单元测试

import { Table } from '../components/Table.js';

// Mock document.createElement
global.document.createElement = jest.fn().mockImplementation(() => ({
  className: '',
  innerHTML: '',
  setAttribute: jest.fn(),
  appendChild: jest.fn(),
  querySelector: jest.fn().mockReturnValue(null),
  addEventListener: jest.fn(),
  style: {},
  textContent: ''
}));

// Mock document.querySelector
global.document.querySelector = jest.fn().mockReturnValue({
  appendChild: jest.fn()
});

describe('Table组件测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('构造函数', () => {
    it('should create Table instance with default options', () => {
      const table = new Table();

      expect(table).toBeInstanceOf(Table);
      expect(table.element.className).toContain('table');
    });

    it('should create Table instance with custom options', () => {
      const options = {
        id: 'test-table',
        className: 'custom-table',
        striped: true,
        bordered: true
      };
      
      const table = new Table(options);

      expect(table.element.id).toBe('test-table');
      expect(table.element.className).toContain('custom-table');
      expect(table.striped).toBe(true);
      expect(table.bordered).toBe(true);
    });

    it('should create Table with hover effect option', () => {
      const table = new Table({ hover: true });

      expect(table.hover).toBe(true);
    });

    it('should create Table with responsive option', () => {
      const table = new Table({ responsive: true });

      expect(table.responsive).toBe(true);
    });
  });

  describe('表格列配置', () => {
    it('should set table columns correctly', () => {
      const columns = [
        {
          key: 'id',
          title: 'ID',
          width: '80px'
        },
        {
          key: 'name',
          title: '名称'
        },
        {
          key: 'age',
          title: '年龄'
        }
      ];
      
      const table = new Table({ columns: columns });
      
      expect(table.columns).toEqual(columns);
    });

    it('should set table column with custom className', () => {
      const columns = [
        {
          key: 'name',
          title: '名称',
          className: 'custom-column'
        }
      ];
      
      const table = new Table({ columns: columns });
      
      expect(table.columns[0].className).toBe('custom-column');
    });

    it('should set table column with render function', () => {
      const renderFunction = jest.fn().mockReturnValue('rendered content');
      const columns = [
        {
          key: 'actions',
          title: '操作',
          render: renderFunction
        }
      ];
      
      const table = new Table({ columns: columns });
      
      expect(table.columns[0].render).toBe(renderFunction);
    });

    it('should set table column with sortable option', () => {
      const columns = [
        {
          key: 'name',
          title: '名称',
          sortable: true
        }
      ];
      
      const table = new Table({ columns: columns });
      
      expect(table.columns[0].sortable).toBe(true);
    });
  });

  describe('表格数据操作', () => {
    it('should set table data correctly', () => {
      const data = [
        { id: 1, name: '张三', age: 25 },
        { id: 2, name: '李四', age: 30 }
      ];
      
      const table = new Table({ data: data });
      
      expect(table.data).toEqual(data);
    });

    it('should update table data correctly', () => {
      const initialData = [
        { id: 1, name: '张三', age: 25 }
      ];
      const updatedData = [
        { id: 1, name: '张三', age: 26 },
        { id: 2, name: '李四', age: 30 }
      ];
      
      const table = new Table({ data: initialData });
      table.updateData(updatedData);
      
      expect(table.data).toEqual(updatedData);
    });

    it('should add row to table correctly', () => {
      const initialData = [
        { id: 1, name: '张三', age: 25 }
      ];
      const newRow = { id: 2, name: '李四', age: 30 };
      
      const table = new Table({ data: initialData });
      table.addRow(newRow);
      
      expect(table.data).toContain(newRow);
      expect(table.data.length).toBe(2);
    });

    it('should remove row from table correctly', () => {
      const initialData = [
        { id: 1, name: '张三', age: 25 },
        { id: 2, name: '李四', age: 30 }
      ];
      
      const table = new Table({ data: initialData });
      table.removeRow(1); // 移除ID为1的行
      
      expect(table.data.length).toBe(1);
      expect(table.data[0].id).toBe(2);
    });

    it('should update row in table correctly', () => {
      const initialData = [
        { id: 1, name: '张三', age: 25 }
      ];
      const updatedRow = { id: 1, name: '张三', age: 26 };
      
      const table = new Table({ data: initialData });
      table.updateRow(1, updatedRow);
      
      expect(table.data[0].age).toBe(26);
    });
  });

  describe('render方法', () => {
    it('should render table to container when container is provided', () => {
      const container = {
        appendChild: jest.fn()
      };
      const options = {
        container: container
      };
      
      const table = new Table(options);
      table.render();

      expect(container.appendChild).toHaveBeenCalledWith(table.element);
    });

    it('should render table to container specified by containerId', () => {
      const table = new Table({ containerId: 'test-container' });
      table.render();

      expect(global.document.querySelector).toHaveBeenCalledWith('#test-container');
      const container = global.document.querySelector.mock.results[0].value;
      expect(container.appendChild).toHaveBeenCalledWith(table.element);
    });

    it('should render table with columns and data', () => {
      const columns = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: '名称' }
      ];
      const data = [
        { id: 1, name: '张三' }
      ];
      
      const table = new Table({ columns: columns, data: data });
      table.render();

      expect(global.document.createElement).toHaveBeenCalledWith('table');
      expect(global.document.createElement).toHaveBeenCalledWith('thead');
      expect(global.document.createElement).toHaveBeenCalledWith('tbody');
    });
  });

  describe('表格排序功能', () => {
    it('should sort table data by column correctly', () => {
      const columns = [
        { key: 'id', title: 'ID', sortable: true },
        { key: 'name', title: '名称', sortable: true }
      ];
      const data = [
        { id: 2, name: '李四' },
        { id: 1, name: '张三' }
      ];
      
      const table = new Table({ columns: columns, data: data });
      table.sortBy('id');
      
      expect(table.sortField).toBe('id');
      expect(table.sortOrder).toBe('asc');
    });

    it('should toggle sort order correctly', () => {
      const columns = [
        { key: 'id', title: 'ID', sortable: true }
      ];
      const data = [
        { id: 2, name: '李四' },
        { id: 1, name: '张三' }
      ];
      
      const table = new Table({ columns: columns, data: data });
      table.sortBy('id');
      expect(table.sortOrder).toBe('asc');
      
      table.sortBy('id');
      expect(table.sortOrder).toBe('desc');
    });

    it('should change sort field correctly', () => {
      const columns = [
        { key: 'id', title: 'ID', sortable: true },
        { key: 'name', title: '名称', sortable: true }
      ];
      const data = [
        { id: 2, name: '李四' },
        { id: 1, name: '张三' }
      ];
      
      const table = new Table({ columns: columns, data: data });
      table.sortBy('id');
      expect(table.sortField).toBe('id');
      
      table.sortBy('name');
      expect(table.sortField).toBe('name');
      expect(table.sortOrder).toBe('asc');
    });
  });

  describe('表格搜索和过滤', () => {
    it('should filter table data correctly', () => {
      const columns = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: '名称' }
      ];
      const data = [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '王五' }
      ];
      
      const table = new Table({ columns: columns, data: data });
      const filteredData = table.filterData((row) => row.id > 1);
      
      expect(filteredData.length).toBe(2);
      expect(filteredData[0].id).toBe(2);
      expect(filteredData[1].id).toBe(3);
    });

    it('should search table data by keyword correctly', () => {
      const columns = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: '名称' }
      ];
      const data = [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '张三丰' }
      ];
      
      const table = new Table({ columns: columns, data: data });
      const searchResult = table.searchData('张');
      
      expect(searchResult.length).toBe(2);
      expect(searchResult[0].name).toBe('张三');
      expect(searchResult[1].name).toBe('张三丰');
    });

    it('should search table data in specific columns correctly', () => {
      const columns = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: '名称' },
        { key: 'description', title: '描述' }
      ];
      const data = [
        { id: 1, name: '张三', description: '测试数据' },
        { id: 2, name: '李四', description: '张三的同事' }
      ];
      
      const table = new Table({ columns: columns, data: data });
      const searchResult = table.searchData('张三', ['name']);
      
      expect(searchResult.length).toBe(1);
      expect(searchResult[0].id).toBe(1);
    });
  });

  describe('表格分页功能', () => {
    it('should enable pagination correctly', () => {
      const table = new Table({ pagination: true });
      
      expect(table.pagination).toBe(true);
    });

    it('should set page size correctly', () => {
      const table = new Table({ pagination: true, pageSize: 20 });
      
      expect(table.pageSize).toBe(20);
    });

    it('should navigate to specific page correctly', () => {
      const table = new Table({ pagination: true });
      table.goToPage(3);
      
      expect(table.currentPage).toBe(3);
    });

    it('should go to next page correctly', () => {
      const table = new Table({ pagination: true });
      table.currentPage = 1;
      table.nextPage();
      
      expect(table.currentPage).toBe(2);
    });

    it('should go to previous page correctly', () => {
      const table = new Table({ pagination: true });
      table.currentPage = 3;
      table.prevPage();
      
      expect(table.currentPage).toBe(2);
    });

    it('should calculate total pages correctly', () => {
      const data = Array(50).fill({}).map((_, index) => ({ id: index + 1 }));
      const table = new Table({ 
        data: data, 
        pagination: true, 
        pageSize: 10 
      });
      
      const totalPages = table.getTotalPages();
      
      expect(totalPages).toBe(5);
    });

    it('should get current page data correctly', () => {
      const data = Array(25).fill({}).map((_, index) => ({ id: index + 1 }));
      const table = new Table({ 
        data: data, 
        pagination: true, 
        pageSize: 10 
      });
      
      // 第二页数据
      table.currentPage = 2;
      const pageData = table.getCurrentPageData();
      
      expect(pageData.length).toBe(10);
      expect(pageData[0].id).toBe(11);
      expect(pageData[9].id).toBe(20);
    });
  });

  describe('表格方法的链式调用', () => {
    it('should support method chaining for setting properties', () => {
      const table = new Table();
      
      // 测试链式调用
      const result = table.setColumns([
                          { key: 'id', title: 'ID' },
                          { key: 'name', title: '名称' }
                        ])
                        .setData([
                          { id: 1, name: '张三' },
                          { id: 2, name: '李四' }
                        ])
                        .setStriped(true)
                        .setBordered(true)
                        .setHover(true);
      
      expect(result).toBe(table); // 确保返回的是table实例本身
      expect(table.columns.length).toBe(2);
      expect(table.data.length).toBe(2);
      expect(table.striped).toBe(true);
      expect(table.bordered).toBe(true);
      expect(table.hover).toBe(true);
    });
  });

  describe('表格样式和布局', () => {
    it('should set table width correctly', () => {
      const table = new Table({ width: '100%' });
      
      expect(table.element.className).toContain('w-full');
    });

    it('should set table height correctly', () => {
      const table = new Table({ height: '400px' });
      
      expect(table.element.style.height).toBe('400px');
    });

    it('should set table header className correctly', () => {
      const table = new Table({ headerClass: 'bg-gray-100' });
      
      expect(table.headerClass).toBe('bg-gray-100');
    });

    it('should set table body className correctly', () => {
      const table = new Table({ bodyClass: 'overflow-y-auto' });
      
      expect(table.bodyClass).toBe('overflow-y-auto');
    });
  });

  describe('表格事件处理', () => {
    it('should handle row click event correctly', () => {
      const onRowClickMock = jest.fn();
      const data = [
        { id: 1, name: '张三' }
      ];
      
      const table = new Table({ 
        data: data, 
        onRowClick: onRowClickMock 
      });
      
      // 模拟行点击事件
      const rowData = data[0];
      table.handleRowClick(rowData, 0, { preventDefault: jest.fn() });
      
      expect(onRowClickMock).toHaveBeenCalledWith(rowData, 0);
    });

    it('should handle row double click event correctly', () => {
      const onRowDblClickMock = jest.fn();
      const data = [
        { id: 1, name: '张三' }
      ];
      
      const table = new Table({ 
        data: data, 
        onRowDblClick: onRowDblClickMock 
      });
      
      // 模拟行双击事件
      const rowData = data[0];
      table.handleRowDblClick(rowData, 0, { preventDefault: jest.fn() });
      
      expect(onRowDblClickMock).toHaveBeenCalledWith(rowData, 0);
    });

    it('should handle row context menu event correctly', () => {
      const onRowContextMenuMock = jest.fn();
      const data = [
        { id: 1, name: '张三' }
      ];
      
      const table = new Table({ 
        data: data, 
        onRowContextMenu: onRowContextMenuMock 
      });
      
      // 模拟行右键菜单事件
      const rowData = data[0];
      const event = { preventDefault: jest.fn() };
      table.handleRowContextMenu(rowData, 0, event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(onRowContextMenuMock).toHaveBeenCalledWith(rowData, 0);
    });
  });

  describe('表格辅助方法', () => {
    it('should update columns correctly', () => {
      const initialColumns = [
        { key: 'id', title: 'ID' }
      ];
      const updatedColumns = [
        { key: 'id', title: '编号' },
        { key: 'name', title: '名称' }
      ];
      
      const table = new Table({ columns: initialColumns });
      table.updateColumns(updatedColumns);
      
      expect(table.columns).toEqual(updatedColumns);
    });

    it('should clear table data correctly', () => {
      const data = [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' }
      ];
      
      const table = new Table({ data: data });
      table.clearData();
      
      expect(table.data).toEqual([]);
    });

    it('should refresh table correctly', () => {
      const table = new Table();
      table.render = jest.fn();
      
      table.refresh();
      
      expect(table.render).toHaveBeenCalled();
    });

    it('should get row by key correctly', () => {
      const data = [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' }
      ];
      
      const table = new Table({ data: data });
      const row = table.getRowByKey('id', 2);
      
      expect(row).toEqual(data[1]);
    });

    it('should get rows by condition correctly', () => {
      const data = [
        { id: 1, name: '张三', age: 25 },
        { id: 2, name: '李四', age: 30 },
        { id: 3, name: '王五', age: 25 }
      ];
      
      const table = new Table({ data: data });
      const rows = table.getRowsByCondition((row) => row.age === 25);
      
      expect(rows.length).toBe(2);
      expect(rows[0].name).toBe('张三');
      expect(rows[1].name).toBe('王五');
    });
  });
});