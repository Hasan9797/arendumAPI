import ClientSocketHandler from './namespaces/client.namespace..js';
import DriverSocketHandler from './namespaces/driver.namespace.js';

const socketHandler = (io) => {
  new ClientSocketHandler(io);
  new DriverSocketHandler(io);
};

export default socketHandler;
