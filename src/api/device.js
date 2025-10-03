// 用于更新ThingsBoard设备属性的API
import tbInstance from "./tbInstance";

/**
 * 更新设备属性
 * @param {string} deviceId - 设备ID
 * @param {object} attributes - 属性对象，如 { attr1: value1, attr2: value2 }
 * @returns {Promise}
 * @returns {Promise}
 */
export function updateDeviceAttributes(deviceId, attributes) {
  const url = `/api/plugins/telemetry/${deviceId}/SERVER_SCOPE`;
  return tbInstance.post(url, attributes);
}
