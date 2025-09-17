// 模拟数据工具函数，供所有模拟数据文件复用

/**
 * 生成随机ID
 * @param {string} prefix - ID前缀
 * @returns {string} 随机ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 生成随机数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机整数
 */
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成随机百分比
 * @param {number} min - 最小百分比
 * @param {number} max - 最大百分比
 * @param {number} decimals - 小数位数
 * @returns {number} 随机百分比
 */
export function getRandomPercentage(min, max, decimals = 2) {
  const num = Math.random() * (max - min) + min;
  return Number(num.toFixed(decimals));
}

/**
 * 生成随机日期
 * @param {Date} start - 开始日期
 * @param {Date} end - 结束日期
 * @returns {Date} 随机日期
 */
export function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * 生成随机日期字符串
 * @param {Date} start - 开始日期
 * @param {Date} end - 结束日期
 * @param {boolean} includeTime - 是否包含时间
 * @returns {string} 日期字符串
 */
export function getRandomDateString(start, end, includeTime = false) {
  const date = getRandomDate(start, end);
  if (includeTime) {
    return date.toISOString();
  }
  return date.toISOString().split('T')[0];
}

/**
 * 从数组中随机选择一个元素
 * @param {Array} arr - 源数组
 * @returns {*} 随机元素
 */
export function getRandomElement(arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
}

/**
 * 从数组中随机选择多个元素
 * @param {Array} arr - 源数组
 * @param {number} count - 选择数量
 * @returns {Array} 选择的元素数组
 */
export function getRandomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * 生成随机手机号
 * @returns {string} 随机手机号
 */
export function generatePhoneNumber() {
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '170', '171', '173', '176', '177', '178', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
  const prefix = getRandomElement(prefixes);
  const suffix = Math.random().toString().substr(2, 8);
  return prefix + suffix;
}

/**
 * 生成随机邮箱
 * @returns {string} 随机邮箱
 */
export function generateEmail() {
  const domains = ['gmail.com', 'qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'outlook.com', 'hotmail.com'];
  const username = Math.random().toString(36).substring(2, 10);
  const domain = getRandomElement(domains);
  return username + '@' + domain;
}

/**
 * 生成随机金额
 * @param {number} min - 最小金额
 * @param {number} max - 最大金额
 * @param {number} decimals - 小数位数
 * @returns {number} 随机金额
 */
export function getRandomAmount(min, max, decimals = 2) {
  const num = Math.random() * (max - min) + min;
  return Number(num.toFixed(decimals));
}

/**
 * 生成随机中文姓名
 * @returns {string} 随机中文姓名
 */
export function generateChineseName() {
  const firstNames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
  const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '强', '磊', '军', '洋', '勇', '杰', '丽', '涛', '艳', '辉', '刚', '明', '佳', '俊'];
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  return firstName + lastName;
}

/**
 * 生成随机地址
 * @returns {string} 随机地址
 */
export function generateAddress() {
  const provinces = ['北京', '上海', '广东', '江苏', '浙江', '山东', '河南', '四川', '湖北', '湖南'];
  const cities = ['市辖区', '朝阳区', '海淀区', '浦东新区', '黄浦区', '天河区', '福田区', '南山区', '西湖区', '江干区'];
  const streets = ['大街', '路', '道', '巷', '胡同', '里弄'];
  const province = getRandomElement(provinces);
  const city = getRandomElement(cities);
  const street = getRandomElement(streets);
  const streetNumber = getRandomNumber(1, 999);
  const buildingNumber = getRandomNumber(1, 99);
  const roomNumber = getRandomNumber(101, 9999);
  return `${province}${city}${streetNumber}号${buildingNumber}栋${roomNumber}室`;
}