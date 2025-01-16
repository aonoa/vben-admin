export const omit = (obj: any, keysToOmit: string[]) => {
  // 如果 obj 不是对象或者 keysToOmit 不是数组，则直接返回 obj
  if (typeof obj !== 'object' || !Array.isArray(keysToOmit)) {
    return obj;
  }

  // 创建一个新的对象，避免修改原始对象
  const result = {} as any;

  // 遍历 obj 的所有键值对
  for (const key in obj) {
    // 如果当前键不在要忽略的键列表中，则复制到新对象
    if (!keysToOmit.includes(key)) {
      result[key] = obj[key];
    }
  }

  return result;
};
