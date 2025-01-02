import clientNamespace from './namespaces/client.namespace..js';
import driverNamespace from './namespaces/driver.namespace.js';

const socketServer = (io) => {
  clientNamespace(io);
  driverNamespace(io);

  // adminNamespace(io);
  // chatNamespace(io);
};

export default socketServer;
