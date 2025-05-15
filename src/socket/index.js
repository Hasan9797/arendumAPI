// socket/index.js
import ClientSocketHandler from './namespaces/client.namespace..js';
import DriverSocketHandler from './namespaces/driver.namespace.js';

class SocketService {
  static instance = null; // Singleton instansi
  static io = null; // io obyektini saqlash uchun

  constructor(io) {
    if (SocketService.instance) {
      return SocketService.instance; // Agar instans mavjud bo‘lsa, qaytaradi
    }

    SocketService.io = io; // io ni statik saqlaymiz
    this.clientHandler = new ClientSocketHandler(io); // Client namespace
    this.driverHandler = new DriverSocketHandler(io); // Driver namespace

    SocketService.instance = this; // Instansni saqlaymiz
  }

  // Statik metod: Namespace’ga kirish uchun
  static getSocket(namespace) {
    if (!SocketService.io) {
      throw new Error(
        'SocketService hali ishga tushmagan. Server.js’da initialize qiling!'
      );
    }

    switch (namespace) {
      case 'client':
        return SocketService.io.of('/client');
      case 'driver':
        return SocketService.io.of('/driver');
      default:
        SocketService.io
    }
  }

  // Agar instans metodlari kerak bo‘lsa qo‘shish mumkin
  getClientHandler() {
    return this.clientHandler;
  }

  getDriverHandler() {
    return this.driverHandler;
  }
}

export default SocketService;
