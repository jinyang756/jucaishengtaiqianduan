// 组件索引文件 - 导出所有UI组件

// 基础按钮组件
export { createButton } from './Button.js';

// 基础卡片组件
export { createCard } from './Card.js';

// 表单组件
export { createForm } from './Form.js';

// 表格组件
export { createTable } from './Table.js';

// 模态框组件
export { createModal } from './Modal.js';

// 提示框组件
export { createAlert, Alert } from './Alert.js';

// 导出所有组件的便捷对象
export const components = {
  createButton,
  createCard,
  createForm,
  createTable,
  createModal,
  createAlert,
  Alert
};

// 默认导出
export default components;