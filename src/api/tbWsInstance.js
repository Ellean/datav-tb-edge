// tbWsInstance.js
// ThingsBoard Edge WebSocket instance for global use in Vue components

class TbWsInstance {
  constructor() {
    this.ws = null;
    this.listeners = [];
    this.connected = false;
    this.queue = [];
    this.connect();
  }

  connect() {
    // 请根据实际部署情况修改host和token获取方式
    const host = process.env.VUE_APP_TB_EDGE_HOST || "100.84.125.65:8080";
    const wsUrl = `ws://${host}/api/ws`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.connected = true;
      // 连接建立后，发送队列中的所有消息
      while (this.queue.length > 0) {
        console.log("Sending queued message");
        const msg = this.queue.shift();
        this.ws.send(JSON.stringify(msg));
      }
      this.listeners.forEach((l) => l.onopen && l.onopen());
    };
    this.ws.onclose = () => {
      this.connected = false;
      this.listeners.forEach((l) => l.onclose && l.onclose());
      // Auto-reconnect
      setTimeout(() => this.connect(), 10000);
    };
    this.ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        // 解析失败时，返回原始数据和异常
        data = { raw: event.data, error: e };
      }
      this.listeners.forEach((l) => l.onmessage && l.onmessage(data));
    };
    this.ws.onerror = (err) => {
      this.listeners.forEach((l) => l.onerror && l.onerror(err));
    };
  }

  send(msg) {
    if (this.connected) {
      console.log("WebSocket sending message", msg);
      this.ws.send(JSON.stringify(msg));
    } else {
      console.log("WebSocket not connected, queuing message", msg);
      this.queue.push(msg);
    }
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}

const tbWsInstance = new TbWsInstance();
export default tbWsInstance;
