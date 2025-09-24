// API配置管理模块
// 用于安全存储和管理API密钥

const CONFIG_KEYS = {
  OPENROUTER_API_KEY: 'ai-notes-openrouter-key'
};

// 预配置的OpenRouter API密钥
const OPENROUTER_API_KEY = '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';

/**
 * 获取OpenRouter API密钥
 * @returns {string} API密钥
 */
export const getOpenRouterApiKey = (): string => {
  // 优先从localStorage获取用户自定义的密钥
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem(CONFIG_KEYS.OPENROUTER_API_KEY);
    if (storedKey) {
      return storedKey;
    }
  }
  
  // 如果没有存储的密钥，返回预配置的密钥
  return OPENROUTER_API_KEY;
};

/**
 * 设置OpenRouter API密钥
 * @param {string} apiKey - 新的API密钥
 */
export const setOpenRouterApiKey = (apiKey: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG_KEYS.OPENROUTER_API_KEY, apiKey);
  }
};

/**
 * 清除存储的API密钥，恢复使用预配置密钥
 */
export const clearOpenRouterApiKey = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CONFIG_KEYS.OPENROUTER_API_KEY);
  }
};

/**
 * 检查是否有有效的API密钥
 * @returns {boolean} 是否有有效密钥
 */
export const hasValidApiKey = (): boolean => {
  const key = getOpenRouterApiKey();
  return key && key.length > 0;
};

/**
 * 获取脱敏的API密钥显示（用于UI显示）
 * @returns {string} 脱敏后的密钥
 */
export const getMaskedApiKey = (): string => {
  const key = getOpenRouterApiKey();
  if (!key) return '';
  
  // 只显示前8位和后4位，中间用*替代
  if (key.length <= 12) {
    return '*'.repeat(key.length);
  }
  
  return key.substring(0, 8) + '*'.repeat(key.length - 12) + key.substring(key.length - 4);
};