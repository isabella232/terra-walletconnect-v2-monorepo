import config from "./config";
import { HttpService } from "./http";

const { app } = new HttpService();

app.listen(+config.port, config.host, (err, address) => {
  if (!config.debug) app.log.info(`Server listening on ${address}`);
  if (err) throw err;
});
