// Table组件
/**
 * 创建表格组件
 * @param {Object} options - 表格配置选项
 * @param {Array} options.columns - 列配置
 * @param {Array} options.data - 表格数据
 * @param {boolean} options.striped - 是否显示斑马纹
 * @param {boolean} options.bordered - 是否显示边框
 * @param {boolean} options.hoverable - 是否有悬停效果
 * @param {boolean} options.compact - 是否紧凑模式
 * @param {Function} options.onRowClick - 行点击回调
 * @param {Object} options.pagination - 分页配置
 * @param {string} options.className - 额外的CSS类名
 * @returns {Object} 包含table元素和辅助方法的对象
 */
export function createTable({ 
  columns, 
  data = [], 
  striped = false, 
  bordered = false, 
  hoverable = false, 
  compact = false, 
  onRowClick = null, 
  pagination = null, 
  className = '' 
}) {
  // 创建表格容器
  const tableContainer = document.createElement('div');
  tableContainer.className = `relative overflow-x-auto ${className}`;
  
  // 创建表格元素
  const table = document.createElement('table');
  
  // 设置表格基础样式
  let tableClasses = 'min-w-full divide-y divide-gray-200';
  
  // 添加配置的样式类
  if (striped) tableClasses += ' table-striped';
  if (bordered) tableClasses += ' table-bordered';
  if (hoverable) tableClasses += ' table-hover';
  if (compact) tableClasses += ' table-compact';
  
  table.className = tableClasses;
  
  // 创建表头
  const thead = document.createElement('thead');
  thead.className = 'bg-gray-50';
  
  const trHead = document.createElement('tr');
  
  columns.forEach(column => {
    const th = document.createElement('th');
    
    // 设置表头样式
    let thClasses = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
    
    // 添加自定义类名
    if (column.className) {
      thClasses += ' ' + column.className;
    }
    
    th.className = thClasses;
    
    // 设置表头内容
    th.textContent = column.title || '';
    
    trHead.appendChild(th);
  });
  
  thead.appendChild(trHead);
  table.appendChild(thead);
  
  // 创建表体
  const tbody = document.createElement('tbody');
  tbody.className = 'bg-white divide-y divide-gray-200';
  
  // 添加数据行
  function renderRows(dataToRender) {
    tbody.innerHTML = '';
    
    dataToRender.forEach((rowData, rowIndex) => {
      const tr = document.createElement('tr');
      
      // 设置行样式
      let trClasses = '';
      
      // 斑马纹效果
      if (striped && rowIndex % 2 !== 0) {
        trClasses += ' bg-gray-50';
      }
      
      // 悬停效果
      if (hoverable) {
        trClasses += ' hover:bg-gray-50 transition-colors';
      }
      
      tr.className = trClasses;
      
      // 行点击事件
      if (onRowClick && typeof onRowClick === 'function') {
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', (e) => {
          onRowClick(rowData, rowIndex, e);
        });
      }
      
      // 添加单元格
      columns.forEach(column => {
        const td = document.createElement('td');
        
        // 设置单元格样式
        let tdClasses = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
        
        // 添加自定义类名
        if (column.className) {
          tdClasses += ' ' + column.className;
        }
        
        td.className = tdClasses;
        
        // 设置单元格内容
        if (column.render && typeof column.render === 'function') {
          // 自定义渲染函数
          const renderResult = column.render(rowData, rowIndex);
          
          if (typeof renderResult === 'string') {
            td.innerHTML = renderResult;
          } else if (renderResult instanceof HTMLElement) {
            td.appendChild(renderResult);
          }
        } else if (column.key) {
          // 从数据中获取值
          const value = getNestedValue(rowData, column.key);
          
          // 格式化值
          if (column.format && typeof column.format === 'function') {
            td.textContent = column.format(value, rowData, rowIndex);
          } else {
            td.textContent = value !== undefined && value !== null ? value : '';
          }
        }
        
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
  }
  
  // 渲染初始数据
  renderRows(data);
  
  table.appendChild(tbody);
  tableContainer.appendChild(table);
  
  // 处理分页
  let paginationContainer = null;
  let currentPage = 1;
  let itemsPerPage = 10;
  
  if (pagination && data.length > 0) {
    itemsPerPage = pagination.itemsPerPage || itemsPerPage;
    currentPage = pagination.currentPage || currentPage;
    
    paginationContainer = createPagination();
    tableContainer.appendChild(paginationContainer);
    
    // 初始分页渲染
    renderPagedData();
  }
  
  // 创建分页组件
  function createPagination() {
    const paginationEl = document.createElement('div');
    paginationEl.className = 'flex justify-between items-center mt-4 px-4';
    
    const pageInfo = document.createElement('div');
    pageInfo.className = 'text-sm text-gray-500';
    
    const pageControls = document.createElement('div');
    pageControls.className = 'flex space-x-2';
    
    const prevButton = createPaginationButton('上一页', true);
    const nextButton = createPaginationButton('下一页', false);
    
    pageControls.appendChild(prevButton);
    pageControls.appendChild(nextButton);
    
    paginationEl.appendChild(pageInfo);
    paginationEl.appendChild(pageControls);
    
    // 更新分页信息
    function updatePaginationInfo() {
      const totalPages = Math.ceil(data.length / itemsPerPage);
      const startItem = (currentPage - 1) * itemsPerPage + 1;
      const endItem = Math.min(currentPage * itemsPerPage, data.length);
      
      pageInfo.textContent = `显示 ${startItem}-${endItem} 条，共 ${data.length} 条`;
      
      // 禁用/启用按钮
      prevButton.disabled = currentPage <= 1;
      nextButton.disabled = currentPage >= totalPages;
    }
    
    // 上一页点击事件
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPagedData();
      }
    });
    
    // 下一页点击事件
    nextButton.addEventListener('click', () => {
      const totalPages = Math.ceil(data.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderPagedData();
      }
    });
    
    return { 
      element: paginationEl, 
      updateInfo: updatePaginationInfo 
    };
  }
  
  // 创建分页按钮
  function createPaginationButton(label, isPrev) {
    const button = document.createElement('button');
    button.className = `px-3 py-1 border rounded-md text-sm font-medium transition-colors ${isPrev ? 'mr-2' : 'ml-2'}`;
    button.textContent = label;
    
    // 默认样式
    button.classList.add('bg-white', 'border-gray-300', 'text-gray-700', 'hover:bg-gray-50');
    
    // 禁用状态样式
    button.disabled = false;
    
    // 监听禁用状态变化
    Object.defineProperty(button, 'disabled', {
      set: function(value) {
        this.setAttribute('disabled', value);
        if (value) {
          this.classList.add('opacity-50', 'cursor-not-allowed');
          this.classList.remove('hover:bg-gray-50');
        } else {
          this.classList.remove('opacity-50', 'cursor-not-allowed');
          this.classList.add('hover:bg-gray-50');
        }
      },
      get: function() {
        return this.hasAttribute('disabled');
      }
    });
    
    return button;
  }
  
  // 渲染分页数据
  function renderPagedData() {
    if (!paginationContainer) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagedData = data.slice(startIndex, endIndex);
    
    renderRows(pagedData);
    paginationContainer.updateInfo();
  }
  
  // 获取嵌套对象的值
  function getNestedValue(obj, path) {
    if (!obj || !path) return null;
    
    const keys = path.split('.');
    let value = obj;
    
    for (let key of keys) {
      if (value === undefined || value === null) {
        return null;
      }
      value = value[key];
    }
    
    return value;
  }
  
  // 更新表格数据
  function updateData(newData) {
    data = newData || [];
    
    if (paginationContainer) {
      currentPage = 1; // 重置到第一页
      renderPagedData();
    } else {
      renderRows(data);
    }
  }
  
  // 更新列配置
  function updateColumns(newColumns) {
    columns = newColumns || [];
    
    // 重新创建表头
    thead.innerHTML = '';
    const newTrHead = document.createElement('tr');
    
    columns.forEach(column => {
      const th = document.createElement('th');
      
      let thClasses = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
      
      if (column.className) {
        thClasses += ' ' + column.className;
      }
      
      th.className = thClasses;
      th.textContent = column.title || '';
      
      newTrHead.appendChild(th);
    });
    
    thead.appendChild(newTrHead);
    
    // 重新渲染行
    if (paginationContainer) {
      renderPagedData();
    } else {
      renderRows(data);
    }
  }
  
  // 搜索表格数据
  function searchTable(query, searchFields = null) {
    if (!query || query.trim() === '') {
      updateData(data); // 如果查询为空，显示所有数据
      return;
    }
    
    query = query.toLowerCase();
    
    const filteredData = data.filter(row => {
      if (searchFields && Array.isArray(searchFields)) {
        // 按指定字段搜索
        return searchFields.some(field => {
          const value = getNestedValue(row, field);
          return value && value.toString().toLowerCase().includes(query);
        });
      } else {
        // 按所有字段搜索
        return Object.values(row).some(value => {
          if (value === null || value === undefined) return false;
          return value.toString().toLowerCase().includes(query);
        });
      }
    });
    
    // 使用过滤后的数据更新表格
    if (paginationContainer) {
      const tempData = data;
      data = filteredData;
      currentPage = 1;
      renderPagedData();
      data = tempData; // 恢复原始数据
    } else {
      renderRows(filteredData);
    }
  }
  
  // 清空表格
  function clearTable() {
    tbody.innerHTML = '';
    
    // 如果有分页，更新信息
    if (paginationContainer) {
      paginationContainer.updateInfo();
    }
  }
  
  // 销毁表格
  function destroy() {
    if (tableContainer && tableContainer.parentNode) {
      tableContainer.parentNode.removeChild(tableContainer);
    }
  }
  
  return {
    table: tableContainer,
    updateData,
    updateColumns,
    searchTable,
    clearTable,
    destroy
  };
}