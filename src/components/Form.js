// Form组件
/**
 * 创建表单组件
 * @param {Object} options - 表单配置选项
 * @param {Array} options.fields - 表单字段配置
 * @param {Function} options.onSubmit - 表单提交回调函数
 * @param {Object} options.initialValues - 初始值
 * @param {string} options.className - 额外的CSS类名
 * @param {boolean} options.disabled - 是否禁用表单
 * @returns {Object} 包含form元素和辅助方法的对象
 */
export function createForm({ 
  fields, 
  onSubmit = () => {}, 
  initialValues = {}, 
  className = '', 
  disabled = false 
}) {
  // 创建表单元素
  const form = document.createElement('form');
  form.className = `space-y-4 ${className}`;
  
  // 存储表单字段元素
  const fieldElements = {};
  
  // 存储验证规则
  const validationRules = {};
  
  // 创建表单字段
  fields.forEach(field => {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'mb-4';
    
    // 创建标签
    if (field.label) {
      const label = document.createElement('label');
      label.className = 'block text-sm font-medium text-gray-700 mb-1';
      label.textContent = field.label;
      
      if (field.required) {
        const requiredMark = document.createElement('span');
        requiredMark.className = 'text-danger ml-1';
        requiredMark.textContent = '*';
        label.appendChild(requiredMark);
      }
      
      fieldContainer.appendChild(label);
    }
    
    // 创建输入控件
    let input;
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
        input = document.createElement('input');
        input.type = field.type;
        break;
      case 'textarea':
        input = document.createElement('textarea');
        break;
      case 'select':
        input = document.createElement('select');
        
        // 添加选项
        if (field.options && Array.isArray(field.options)) {
          field.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value || option;
            optionElement.textContent = option.label || option;
            input.appendChild(optionElement);
          });
        }
        break;
      case 'checkbox':
        input = document.createElement('input');
        input.type = 'checkbox';
        
        // 处理复选框标签
        if (field.label) {
          const checkboxLabel = document.createElement('label');
          checkboxLabel.className = 'inline-flex items-center';
          checkboxLabel.appendChild(input);
          checkboxLabel.appendChild(document.createTextNode(' ' + field.label));
          fieldContainer.innerHTML = ''; // 清空容器，因为标签已经包含在checkboxLabel中
          fieldContainer.appendChild(checkboxLabel);
        }
        break;
      case 'radio':
        input = document.createElement('div');
        input.className = 'space-y-2';
        
        // 添加单选按钮选项
        if (field.options && Array.isArray(field.options)) {
          field.options.forEach(option => {
            const radioContainer = document.createElement('label');
            radioContainer.className = 'inline-flex items-center';
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = field.name;
            radioInput.value = option.value || option;
            
            radioContainer.appendChild(radioInput);
            radioContainer.appendChild(document.createTextNode(' ' + (option.label || option)));
            input.appendChild(radioContainer);
          });
        }
        break;
      default:
        input = document.createElement('input');
        input.type = 'text';
    }
    
    // 如果不是容器类型，设置类名和属性
    if (input.tagName && input.tagName !== 'DIV') {
      // 设置基础类名
      let inputClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200';
      
      // 添加自定义类名
      if (field.className) {
        inputClasses += ' ' + field.className;
      }
      
      input.className = inputClasses;
      
      // 设置其他属性
      if (field.name) {
        input.name = field.name;
        fieldElements[field.name] = input;
      }
      
      if (field.placeholder) {
        input.placeholder = field.placeholder;
      }
      
      if (field.value !== undefined || initialValues[field.name] !== undefined) {
        input.value = field.value !== undefined ? field.value : initialValues[field.name] || '';
      }
      
      if (field.disabled || disabled) {
        input.disabled = true;
      }
      
      if (field.required) {
        input.required = true;
      }
      
      if (field.readOnly) {
        input.readOnly = true;
      }
      
      if (field.maxLength) {
        input.maxLength = field.maxLength;
      }
      
      if (field.minLength) {
        input.minLength = field.minLength;
      }
      
      if (field.pattern) {
        input.pattern = field.pattern;
      }
    }
    
    // 添加描述文本
    if (field.description) {
      const description = document.createElement('p');
      description.className = 'mt-1 text-xs text-gray-500';
      description.textContent = field.description;
      fieldContainer.appendChild(description);
    }
    
    // 存储验证规则
    if (field.name && field.validate) {
      validationRules[field.name] = field.validate;
    }
    
    // 将输入控件添加到容器
    if (input.tagName && input.tagName !== 'DIV') {
      fieldContainer.appendChild(input);
    } else if (input.tagName === 'DIV') {
      // 单选按钮组已经添加了所有内容
      fieldContainer.appendChild(input);
    }
    
    // 添加错误信息容器
    if (field.name) {
      const errorContainer = document.createElement('p');
      errorContainer.className = 'mt-1 text-xs text-danger hidden';
      errorContainer.id = `error-${field.name}`;
      fieldContainer.appendChild(errorContainer);
    }
    
    // 添加到表单
    form.appendChild(fieldContainer);
  });
  
  // 添加提交按钮
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2';
  submitButton.textContent = '提交';
  
  if (disabled) {
    submitButton.disabled = true;
  }
  
  form.appendChild(submitButton);
  
  // 表单提交处理
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(getFormValues());
    }
  });
  
  // 验证表单
  function validateForm() {
    let isValid = true;
    
    Object.keys(validationRules).forEach(fieldName => {
      const rules = validationRules[fieldName];
      const value = getFieldValue(fieldName);
      const errorContainer = document.getElementById(`error-${fieldName}`);
      
      if (errorContainer) {
        errorContainer.textContent = '';
        errorContainer.classList.add('hidden');
      }
      
      // 检查必填项
      if (rules.required && (!value || value.trim() === '')) {
        isValid = false;
        if (errorContainer) {
          errorContainer.textContent = rules.requiredMessage || '此字段为必填项';
          errorContainer.classList.remove('hidden');
        }
        return;
      }
      
      // 检查最小长度
      if (rules.minLength && value && value.length < rules.minLength) {
        isValid = false;
        if (errorContainer) {
          errorContainer.textContent = rules.minLengthMessage || `最少需要${rules.minLength}个字符`;
          errorContainer.classList.remove('hidden');
        }
        return;
      }
      
      // 检查最大长度
      if (rules.maxLength && value && value.length > rules.maxLength) {
        isValid = false;
        if (errorContainer) {
          errorContainer.textContent = rules.maxLengthMessage || `最多只能输入${rules.maxLength}个字符`;
          errorContainer.classList.remove('hidden');
        }
        return;
      }
      
      // 检查正则表达式
      if (rules.pattern && value && !rules.pattern.test(value)) {
        isValid = false;
        if (errorContainer) {
          errorContainer.textContent = rules.patternMessage || '输入格式不正确';
          errorContainer.classList.remove('hidden');
        }
        return;
      }
      
      // 自定义验证函数
      if (rules.custom && typeof rules.custom === 'function') {
        const customError = rules.custom(value, getFormValues());
        if (customError) {
          isValid = false;
          if (errorContainer) {
            errorContainer.textContent = customError;
            errorContainer.classList.remove('hidden');
          }
          return;
        }
      }
    });
    
    return isValid;
  }
  
  // 获取表单值
  function getFormValues() {
    const values = {};
    
    Object.keys(fieldElements).forEach(fieldName => {
      const field = fieldElements[fieldName];
      
      if (field.type === 'checkbox') {
        values[fieldName] = field.checked;
      } else if (field.type === 'radio') {
        // 单选按钮需要特殊处理
        const radioButtons = form.querySelectorAll(`input[name="${fieldName}"][type="radio"]:checked`);
        if (radioButtons.length > 0) {
          values[fieldName] = radioButtons[0].value;
        }
      } else {
        values[fieldName] = field.value;
      }
    });
    
    return values;
  }
  
  // 获取单个字段值
  function getFieldValue(fieldName) {
    const field = fieldElements[fieldName];
    if (!field) return null;
    
    if (field.type === 'checkbox') {
      return field.checked;
    } else if (field.type === 'radio') {
      const radioButton = form.querySelector(`input[name="${fieldName}"][type="radio"]:checked`);
      return radioButton ? radioButton.value : null;
    }
    
    return field.value;
  }
  
  // 设置表单值
  function setFormValues(values) {
    Object.keys(values).forEach(fieldName => {
      const field = fieldElements[fieldName];
      if (!field) return;
      
      if (field.type === 'checkbox') {
        field.checked = !!values[fieldName];
      } else if (field.type === 'radio') {
        const radioButtons = form.querySelectorAll(`input[name="${fieldName}"][type="radio"]`);
        radioButtons.forEach(radio => {
          radio.checked = radio.value === values[fieldName];
        });
      } else {
        field.value = values[fieldName] || '';
      }
    });
  }
  
  // 设置字段禁用状态
  function setFieldDisabled(fieldName, isDisabled) {
    const field = fieldElements[fieldName];
    if (field) {
      field.disabled = isDisabled;
    }
  }
  
  // 重置表单
  function resetForm() {
    form.reset();
    
    // 清除所有错误信息
    const errorContainers = form.querySelectorAll('[id^="error-"]');
    errorContainers.forEach(container => {
      container.textContent = '';
      container.classList.add('hidden');
    });
  }
  
  return {
    form,
    getFormValues,
    setFormValues,
    getFieldValue,
    setFieldDisabled,
    validateForm,
    resetForm
  };
}