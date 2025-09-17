// Form.test.js
// Form组件的单元测试

import { Form } from '../components/Form.js';

// Mock document.createElement
global.document.createElement = jest.fn().mockImplementation(() => ({
  className: '',
  innerHTML: '',
  setAttribute: jest.fn(),
  appendChild: jest.fn(),
  querySelector: jest.fn().mockReturnValue(null),
  addEventListener: jest.fn(),
  style: {},
  value: '',
  checked: false,
  disabled: false,
  focus: jest.fn()
}));

// Mock document.querySelector
global.document.querySelector = jest.fn().mockReturnValue({
  appendChild: jest.fn()
});

describe('Form组件测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('构造函数', () => {
    it('should create Form instance with default options', () => {
      const form = new Form();

      expect(form).toBeInstanceOf(Form);
      expect(form.element.className).toContain('form');
    });

    it('should create Form instance with custom options', () => {
      const options = {
        id: 'test-form',
        className: 'custom-form',
        onSubmit: jest.fn()
      };
      
      const form = new Form(options);

      expect(form.element.id).toBe('test-form');
      expect(form.element.className).toContain('custom-form');
    });

    it('should create Form with submit button option', () => {
      const options = {
        submitButton: true,
        submitButtonText: '提交表单'
      };
      
      const form = new Form(options);

      expect(form.submitButton).toBe(true);
      expect(form.submitButtonText).toBe('提交表单');
    });

    it('should create Form with reset button option', () => {
      const options = {
        resetButton: true,
        resetButtonText: '重置表单'
      };
      
      const form = new Form(options);

      expect(form.resetButton).toBe(true);
      expect(form.resetButtonText).toBe('重置表单');
    });
  });

  describe('表单字段配置', () => {
    it('should add form fields correctly', () => {
      const fields = [
        {
          name: 'username',
          type: 'text',
          label: '用户名',
          placeholder: '请输入用户名'
        },
        {
          name: 'password',
          type: 'password',
          label: '密码',
          placeholder: '请输入密码'
        }
      ];
      
      const form = new Form({ fields: fields });
      
      expect(form.fields).toEqual(fields);
    });

    it('should add form field with validation rules', () => {
      const field = {
        name: 'email',
        type: 'email',
        label: '邮箱',
        validation: {
          required: true,
          email: true,
          message: '请输入有效的邮箱地址'
        }
      };
      
      const form = new Form({ fields: [field] });
      
      expect(form.fields[0].validation).toEqual(field.validation);
    });

    it('should add form field with default value', () => {
      const field = {
        name: 'gender',
        type: 'select',
        label: '性别',
        options: [
          { value: 'male', label: '男' },
          { value: 'female', label: '女' }
        ],
        defaultValue: 'male'
      };
      
      const form = new Form({ fields: [field] });
      
      expect(form.fields[0].defaultValue).toBe('male');
    });

    it('should add form field with custom className', () => {
      const field = {
        name: 'phone',
        type: 'tel',
        label: '手机号',
        className: 'custom-input-field'
      };
      
      const form = new Form({ fields: [field] });
      
      expect(form.fields[0].className).toBe('custom-input-field');
    });
  });

  describe('render方法', () => {
    it('should render form to container when container is provided', () => {
      const container = {
        appendChild: jest.fn()
      };
      const options = {
        container: container
      };
      
      const form = new Form(options);
      form.render();

      expect(container.appendChild).toHaveBeenCalledWith(form.element);
    });

    it('should render form to container specified by containerId', () => {
      const form = new Form({ containerId: 'test-container' });
      form.render();

      expect(global.document.querySelector).toHaveBeenCalledWith('#test-container');
      const container = global.document.querySelector.mock.results[0].value;
      expect(container.appendChild).toHaveBeenCalledWith(form.element);
    });

    it('should render form with fields', () => {
      const fields = [
        {
          name: 'username',
          type: 'text',
          label: '用户名'
        }
      ];
      
      const form = new Form({ fields: fields });
      form.render();

      expect(global.document.createElement).toHaveBeenCalled();
    });
  });

  describe('表单值操作', () => {
    it('should get form values correctly', () => {
      const fields = [
        {
          name: 'username',
          type: 'text',
          defaultValue: 'admin'
        },
        {
          name: 'password',
          type: 'password',
          defaultValue: '123456'
        }
      ];
      
      const form = new Form({ fields: fields });
      
      // Mock formValues
      form.formValues = {
        username: 'admin',
        password: '123456'
      };
      
      const values = form.getFormValues();
      
      expect(values).toEqual({
        username: 'admin',
        password: '123456'
      });
    });

    it('should set form values correctly', () => {
      const fields = [
        {
          name: 'username',
          type: 'text'
        },
        {
          name: 'email',
          type: 'email'
        }
      ];
      
      const form = new Form({ fields: fields });
      
      const values = {
        username: 'testuser',
        email: 'test@example.com'
      };
      
      form.setFormValues(values);
      
      expect(form.formValues).toEqual(values);
    });

    it('should get single field value correctly', () => {
      const fields = [
        {
          name: 'username',
          type: 'text'
        }
      ];
      
      const form = new Form({ fields: fields });
      
      // Mock formValues
      form.formValues = {
        username: 'testuser'
      };
      
      const value = form.getFieldValue('username');
      
      expect(value).toBe('testuser');
    });

    it('should set single field value correctly', () => {
      const fields = [
        {
          name: 'username',
          type: 'text'
        }
      ];
      
      const form = new Form({ fields: fields });
      
      form.setFieldValue('username', 'newuser');
      
      expect(form.formValues.username).toBe('newuser');
    });
  });

  describe('表单验证', () => {
    it('should validate required field correctly', () => {
      const fields = [
        {
          name: 'username',
          type: 'text',
          validation: {
            required: true,
            message: '用户名不能为空'
          }
        }
      ];
      
      const form = new Form({ fields: fields });
      
      // 设置空值
      form.setFieldValue('username', '');
      
      // 验证
      const isValid = form.validate();
      
      expect(isValid).toBe(false);
      expect(form.errors.username).toBe('用户名不能为空');
    });

    it('should validate email field correctly', () => {
      const fields = [
        {
          name: 'email',
          type: 'email',
          validation: {
            email: true,
            message: '请输入有效的邮箱地址'
          }
        }
      ];
      
      const form = new Form({ fields: fields });
      
      // 设置无效邮箱
      form.setFieldValue('email', 'invalid-email');
      
      // 验证
      const isValid = form.validate();
      
      expect(isValid).toBe(false);
      expect(form.errors.email).toBe('请输入有效的邮箱地址');
    });

    it('should validate form with custom validation function', () => {
      const fields = [
        {
          name: 'password',
          type: 'password',
          validation: {
            validate: (value) => value.length >= 6,
            message: '密码长度至少为6位'
          }
        }
      ];
      
      const form = new Form({ fields: fields });
      
      // 设置短密码
      form.setFieldValue('password', '123');
      
      // 验证
      const isValid = form.validate();
      
      expect(isValid).toBe(false);
      expect(form.errors.password).toBe('密码长度至少为6位');
    });

    it('should validate form with multiple validation rules', () => {
      const fields = [
        {
          name: 'username',
          type: 'text',
          validation: {
            required: true,
            minLength: 3,
            maxLength: 20,
            messages: {
              required: '用户名不能为空',
              minLength: '用户名长度不能少于3位',
              maxLength: '用户名长度不能超过20位'
            }
          }
        }
      ];
      
      const form = new Form({ fields: fields });
      
      // 设置太短的用户名
      form.setFieldValue('username', 'ab');
      
      // 验证
      const isValid = form.validate();
      
      expect(isValid).toBe(false);
      expect(form.errors.username).toBe('用户名长度不能少于3位');
    });

    it('should return true for valid form', () => {
      const fields = [
        {
          name: 'username',
          type: 'text',
          validation: {
            required: true,
            message: '用户名不能为空'
          }
        }
      ];
      
      const form = new Form({ fields: fields });
      
      // 设置有效值
      form.setFieldValue('username', 'validuser');
      
      // 验证
      const isValid = form.validate();
      
      expect(isValid).toBe(true);
      expect(form.errors.username).toBeUndefined();
    });
  });

  describe('表单事件处理', () => {
    it('should handle form submit event correctly', () => {
      const onSubmitMock = jest.fn();
      const form = new Form({ onSubmit: onSubmitMock });
      
      // Mock formValues
      form.formValues = {
        username: 'testuser'
      };
      
      // Mock validate method
      form.validate = jest.fn().mockReturnValue(true);
      
      // 模拟提交事件
      const event = {
        preventDefault: jest.fn()
      };
      
      form.handleSubmit(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(form.validate).toHaveBeenCalled();
      expect(onSubmitMock).toHaveBeenCalledWith(form.formValues);
    });

    it('should not call onSubmit when form validation fails', () => {
      const onSubmitMock = jest.fn();
      const form = new Form({ onSubmit: onSubmitMock });
      
      // Mock validate method
      form.validate = jest.fn().mockReturnValue(false);
      
      // 模拟提交事件
      const event = {
        preventDefault: jest.fn()
      };
      
      form.handleSubmit(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(form.validate).toHaveBeenCalled();
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('should handle form reset event correctly', () => {
      const onResetMock = jest.fn();
      const form = new Form({ onReset: onResetMock });
      
      // 模拟重置事件
      const event = {
        preventDefault: jest.fn()
      };
      
      form.handleReset(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(onResetMock).toHaveBeenCalled();
    });

    it('should reset form values correctly', () => {
      const fields = [
        {
          name: 'username',
          type: 'text',
          defaultValue: 'default'
        }
      ];
      
      const form = new Form({ fields: fields });
      
      // 设置自定义值
      form.setFieldValue('username', 'custom');
      
      // 重置表单
      form.resetForm();
      
      expect(form.formValues.username).toBe('default');
    });
  });

  describe('表单方法的链式调用', () => {
    it('should support method chaining for setting properties', () => {
      const form = new Form();
      
      // 测试链式调用
      const result = form.addField({
                          name: 'username',
                          type: 'text',
                          label: '用户名'
                        })
                        .setFormValues({ username: 'test' })
                        .setValidationRules('username', {
                          required: true,
                          message: '用户名不能为空'
                        });
      
      expect(result).toBe(form); // 确保返回的是form实例本身
      expect(form.fields.length).toBe(1);
      expect(form.formValues.username).toBe('test');
    });
  });

  describe('表单辅助方法', () => {
    it('should add new field to form correctly', () => {
      const form = new Form();
      const field = {
        name: 'newfield',
        type: 'text',
        label: '新字段'
      };
      
      form.addField(field);
      
      expect(form.fields.length).toBe(1);
      expect(form.fields[0]).toEqual(field);
    });

    it('should remove field from form correctly', () => {
      const fields = [
        {
          name: 'field1',
          type: 'text',
          label: '字段1'
        },
        {
          name: 'field2',
          type: 'text',
          label: '字段2'
        }
      ];
      
      const form = new Form({ fields: fields });
      
      form.removeField('field1');
      
      expect(form.fields.length).toBe(1);
      expect(form.fields[0].name).toBe('field2');
    });

    it('should update field in form correctly', () => {
      const fields = [
        {
          name: 'username',
          type: 'text',
          label: '用户名'
        }
      ];
      
      const form = new Form({ fields: fields });
      const updatedField = {
        name: 'username',
        type: 'text',
        label: '用户名称',
        placeholder: '请输入用户名称'
      };
      
      form.updateField('username', updatedField);
      
      expect(form.fields[0].label).toBe('用户名称');
      expect(form.fields[0].placeholder).toBe('请输入用户名称');
    });

    it('should set validation rules for field correctly', () => {
      const fields = [
        {
          name: 'email',
          type: 'email',
          label: '邮箱'
        }
      ];
      
      const form = new Form({ fields: fields });
      const validationRules = {
        required: true,
        email: true,
        message: '请输入有效的邮箱地址'
      };
      
      form.setValidationRules('email', validationRules);
      
      expect(form.fields[0].validation).toEqual(validationRules);
    });
  });

  describe('表单状态管理', () => {
    it('should disable form correctly', () => {
      const form = new Form();
      form.disable();
      expect(form.disabled).toBe(true);
    });

    it('should enable form correctly', () => {
      const form = new Form({ disabled: true });
      form.enable();
      expect(form.disabled).toBe(false);
    });

    it('should toggle form disabled state correctly', () => {
      const form = new Form();
      form.toggleDisabled(true);
      expect(form.disabled).toBe(true);
      
      form.toggleDisabled(false);
      expect(form.disabled).toBe(false);
    });

    it('should clear form errors correctly', () => {
      const form = new Form();
      form.errors = {
        username: '用户名不能为空',
        email: '请输入有效的邮箱地址'
      };
      
      form.clearErrors();
      
      expect(Object.keys(form.errors)).toHaveLength(0);
    });
  });
});