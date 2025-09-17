// Sentry错误监控配置

// 检查环境变量是否配置了Sentry DSN
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
let sentry = null;

/**
 * 初始化Sentry监控
 * 只有在配置了DSN时才会初始化
 */
export async function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN未配置，错误监控功能将不可用');
    return null;
  }

  try {
    // 动态导入Sentry SDK
    const { init, captureException, captureMessage } = await import('@sentry/browser');
    const { BrowserTracing } = await import('@sentry/tracing');
    
    // 初始化Sentry
    init({
      dsn: SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          // 用于跟踪性能的路由改变
          routingInstrumentation: Sentry.utils.createRoutingInstrumentation({
            routingHandlers: ['pushState', 'replaceState', 'popstate']
          })
        })
      ],
      
      // 设置采样率，生产环境使用低采样率
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      
      // 环境信息
      environment: import.meta.env.NODE_ENV || 'development',
      
      // 应用版本
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      
      // 不发送控制台警告和错误
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'requestAnimationFrame',
        'setTimeout',
        'XMLHttpRequest',
        'NetworkError',
        'AbortError'
      ]
    });

    console.log('Sentry错误监控已成功初始化');
    
    // 创建sentry对象
    sentry = {
      captureException,
      captureMessage,
      // 获取用户信息
      setUser(user) {
        if (window.Sentry && window.Sentry.setUser) {
          window.Sentry.setUser(user);
        }
      },
      // 设置标签
      setTag(key, value) {
        if (window.Sentry && window.Sentry.setTag) {
          window.Sentry.setTag(key, value);
        }
      },
      // 设置额外上下文
      setExtra(key, value) {
        if (window.Sentry && window.Sentry.setExtra) {
          window.Sentry.setExtra(key, value);
        }
      }
    };
    
    return sentry;
  } catch (error) {
    console.error('Sentry初始化失败:', error);
    return null;
  }
}

/**
 * 获取Sentry实例
 * @returns {Object|null} Sentry实例或null
 */
export function getSentry() {
  return sentry;
}

/**
 * 捕获错误并发送到Sentry
 * @param {Error} error - 错误对象
 * @param {Object} context - 上下文信息
 */
export function captureError(error, context = {}) {
  if (sentry && sentry.captureException) {
    // 如果有上下文信息，设置额外数据
    if (Object.keys(context).length > 0) {
      sentry.setExtra('context', context);
    }
    sentry.captureException(error);
  } else {
    console.error('捕获的错误:', error, '上下文:', context);
  }
}

/**
 * 捕获消息并发送到Sentry
 * @param {string} message - 消息内容
 * @param {string} level - 消息级别 ('debug', 'info', 'warning', 'error', 'fatal')
 */
export function captureLogMessage(message, level = 'info') {
  if (sentry && sentry.captureMessage) {
    sentry.captureMessage(message, level);
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}

export default { initSentry, getSentry, captureError, captureLogMessage };