import { Request, Response } from 'express';
// import CryptoJS from 'crypto-js';

import Axios from '../../services/axios-instance';

const WS_SITE_KEY = process.env.WS_SITE_KEY;
const WS_BACK_URL = process.env.WS_BACK_URL;

export class PingController {
  public async pingSF(req: Request, res: Response): Promise<void> {
    console.log('======================');
    console.log('Ping SF org requested.');
    console.log('======================');

    if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      return;
    }

    if (!WS_BACK_URL || !WS_BACK_URL.length) {
      res.status(404).json({ message: `Backend URL isn't availble!` });
      return;
    }

    const { ping } = req.query;
    const method = 'pingPong';

    if (!ping || !ping.length) {
      res.status(404).json({ message: 'Wrong request params', ping: ping || null });
      return;
    }

    const sfPing = `?method=${method}&gryzak=zhopaTEST&ping=${ping}`;

    try {
      const { data } = await Axios.get(`${WS_BACK_URL}/${sfPing}`);

      console.log('SF Ping: ');
      console.log(data);
      console.log('======================');

      res.status(200).json({ message: JSON.parse(data) });
    } catch (error) {
      console.log('PingController pingSF ERROR: ', error);
      res.status(404).json({ message: error.message || JSON.stringify(error), error });
    }
  }
}

export default new PingController();
