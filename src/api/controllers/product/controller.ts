import { Request, Response } from "express";
import express from "express";
import Crypto from "crypto-js";
import Axios from "../../services/axios-instance";
import { readFile } from "fs/promises";
import MongeVacancy from "./mongoDb";
import jsforce from "jsforce";

import ParseSalesforse from "./parserSalesforce";
import mongoose from "mongoose";
import { PollyCustomizations } from "aws-sdk/lib/services/polly";

const app = express();

const WS_SITE_KEY = process.env.WS_SITE_KEY;
const WS_BACK_URL = process.env.WS_BACK_URL;

const SF_LOGIN_URL = process.env.SF_LOGIN_URL || "";
const SF_USERNAME = process.env.SF_USERNAME || "";
const SF_PASSWORD = process.env.SF_PASSWORD || "";
const SF_TOKEN = process.env.SF_TOKEN || "";

const createSecure = (
  resume: boolean,
  key: string
): { method: string; gryzak: string; signature: string } => {
  const method = resume ? "applyAddResume" : "applyNoResume";
  const gryzak = `${new Date().getTime()}`;
  const solt = Crypto.HmacSHA1(`${gryzak}.${method}`, key);
  const signature = Crypto.enc.Base64.stringify(solt);

  return { method, gryzak, signature };
};

const parse = ParseSalesforse;

export interface CitiesVacancy {
  city_title: string;
  active: boolean;
  vacancies: {
    link_name: string;
    title: string;
  }[];
}

export interface SalesforceGetResponse {
  Name: string;
  VacancyTitle__c: string;
}

export class ProductController {
  public async getJeansMongoDb(req: Request, res: Response): Promise<void> {
    console.log("======================");
    console.log("Get Jeans from Salesforce with jsforce");
    console.log("======================");

    if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      return;
    }

    if (1 > 1999) {
      req.body;
    }

    try {
      await mongoose.connect(
        "mongodb+srv://dima:success1122@cluster0.t5xsk.mongodb.net/product",
        {
          useNewUrlParser: true,
          useFindAndModify: true,
          useUnifiedTopology: true,
        }
      );
      console.log("+++++++++ use mongoose++++++++++++++++++=");
      // take data from MongoDb
      try {
        const response = await MongeVacancy.find({});
        console.log(response);
        res.status(200).json(response);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async sendJeansMongoDb(req: Request, res: Response): Promise<void> {
    console.log("======================");
    console.log("Sending Vacancy to MongoDb");
    console.log("======================");

    if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      return;
    }
    const { category, color, price, size, fit } = req.body;
    const pushCityWithVacancies = async () => {
      try {
        const newItem = new MongeVacancy({
          category,
          color,
          price,
          size,
          fit,
        });

        await newItem.save();
        res.status(200).json(newItem);
      } catch (err) {
        console.log(err);
      }
    };

    // connect with MongoDB
    try {
      await mongoose.connect(
        "mongodb+srv://dima:success1122@cluster0.t5xsk.mongodb.net/product",
        {
          useNewUrlParser: true,
          useFindAndModify: true,
          useUnifiedTopology: true,
        }
      );
      app.use(express.urlencoded({ extended: true }));
      console.log("+++++++++ use mongoose++++++++++++++++++=");
      console.log(req.body);
      try {
        await pushCityWithVacancies();
      } catch (err) {
        console.log(err);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export class VacancyController {
  public async sendVacancySalesforce(
    req: Request,
    res: Response
  ): Promise<void> {
    console.log("======================");
    console.log("Send Vacancy to Salesforce with jsforce");
    console.log("======================");

    if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      return;
    }

    if (1 > 1000) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      req.url;
      return;
    }
    const cityName = req.body.city_title;
    let salesforceBody = parse.parseSalesforceRequest(req.body);

    // connectint with Salesforce
    try {
      const conn = new jsforce.Connection({
        loginUrl: SF_LOGIN_URL,
      });
      await conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, userInf) => {
        if (err) {
          console.log("Login error:", err);
        } else {
          console.log(userInf);
        }
      });

      const getDat = await conn
        .sobject("VacancyWithCity__c")
        .find<SalesforceGetResponse>(
          { Name: cityName },
          "Name, VacancyTitle__c"
        )
        .execute();

      const errorVacancy = [];
      getDat.map((item) => {
        console.log(item);
        salesforceBody = salesforceBody.filter((vacancy) => {
          if (vacancy.VacancyTitle__c !== item.VacancyTitle__c) {
            return vacancy;
          }
          errorVacancy.push(vacancy);
          return;
        });
      });

      // const response = await conn.query<SalesforceGetResponse>('SELECT Name, VacancyTitle__c FROM VacancyWithCity__c');
      const response = await conn
        .sobject("VacancyWithCity__c")
        .create([...salesforceBody], (err, ret) => {
          if (err) {
            return console.error("Error in post request:", err);
          }
          console.log(ret);
          if (errorVacancy.length > 0) {
            res
              .status(400)
              .json({ message: `These vacancies already exist: ` });
          } else {
            res.status(200).json({ ret });
          }
        });
    } catch (err) {
      console.log("Error connection:", err);
    }
  }

  public async getVacancySalesforceTooHard(
    req: Request,
    res: Response
  ): Promise<void> {
    // оставлю на память - суть мотода: Подключиться к Salesforse +, Получить массив городов +, у которого есть массив вакансий+, извлечь вакансии -,
    //  может еще придумаю как это можно сдеалть, но такая реализация слишком сложная(+ нужно подключать содаваемую вакансию(пользовательский объект) к городам)
    console.log("======================");
    console.log("Get Vacancy from Salesforce with jsforce");
    console.log("======================");

    if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      return;
    }

    if (1 > 1000) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      req.url;
      return;
    }

    // connectint with Salesforce
    try {
      const conn = new jsforce.Connection({
        loginUrl: SF_LOGIN_URL,
      });
      await conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, userInf) => {
        if (err) {
          console.log("Login error:", err);
        } else {
          console.log(userInf);
        }
      });

      conn
        .query(
          "SELECT Name, (SELECT CityOnly__c FROM VacancyOnly__r) FROM CityOnly__c"
        )
        .then((result) => {
          console.log("---------------");
          console.log(result.records);
          console.log("---------------");
          // console.log(result.records);
          console.log("---------------");
          res.status(200).json(result.records);
        })
        .catch((err) => {
          console.log("Get data:", err);
        });
    } catch (error) {
      console.log("Error conection with Salesforse:", error);
    }
  }

  public async getVacancySalesforce(
    req: Request,
    res: Response
  ): Promise<void> {
    // суть мотода: Подключиться к Salesforse +, Получить массив: {названиеГорода, названиеВакансии, idВаканси}, {следующая вакансия, возможно в том же городе},
    //  парсить это в [{название города, active: false, vacancies: [{названиеВакансии, idВакансии, линк}]}]
    // active and link --- глупые поля для бэка, но нужны для фронта, может их лучше сгенерировать на фронте... Но тогда придется с интерфейсом извращаться
    console.log("======================");
    console.log("Get Vacancy from Salesforce with jsforce");
    console.log("======================");

    if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      return;
    }

    if (1 > 1000) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      req.url;
      return;
    }

    // connectint with Salesforce
    try {
      const conn = new jsforce.Connection({
        loginUrl: SF_LOGIN_URL,
      });
      await conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, userInf) => {
        if (err) {
          console.log("Login error:", err);
        } else {
          console.log(userInf);
        }
      });
      const response = await conn.query<SalesforceGetResponse>(
        "SELECT Name, VacancyTitle__c FROM VacancyWithCity__c"
      );
      const record = response.records;
      const result = parse.parseResponse(record);
      res.status(200).json(result);
    } catch (err) {
      console.log("Error connection:", err);
    }
  }
  public async sendVacancyMongoDb(req: Request, res: Response): Promise<void> {
    console.log("======================");
    console.log("Sending Vacancy to MongoDb");
    console.log("======================");

    if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      return;
    }
    const {
      city_title,
      active,
      vacancies: [{ link_name, title, id }],
    } = req.body;
    const pushCityWithVacancies = async () => {
      try {
        const newCity = new MongeVacancy({
          city_title,
          active,
          vacancies: [{ link_name, title, id }],
        });

        await newCity.save();
        res.status(200).json(newCity);
      } catch (err) {
        console.log(err);
      }
    };

    // connect with MongoDB
    try {
      await mongoose.connect(
        "mongodb+srv://dima:success1122@cluster0.t5xsk.mongodb.net/vacancy",
        {
          useNewUrlParser: true,
          useFindAndModify: true,
          useUnifiedTopology: true,
        }
      );
      app.use(express.urlencoded({ extended: true }));
      console.log("+++++++++ use mongoose++++++++++++++++++=");
      // take data from MongoDb
      try {
        const response = await MongeVacancy.findOne({ city_title });
        console.log("in response");
        if (response) {
          if (response.city_title === city_title) {
            let counter = 0;
            response.vacancies.forEach(
              (responseVacancy: {
                link_name: string;
                title: string;
                id: string;
              }) => {
                if (responseVacancy.title === title) {
                  counter++;
                }
              }
            );
            if (counter > 0) {
              console.log("pos 3");
              res.status(400).json({ message: "This vacancy already exist" });
            } else {
              response.vacancies.push({ link_name, title, id });
              await response.save();
              res.send(response);
              res.status(200).json(response);
            }
          } else {
            pushCityWithVacancies().then;
          }
        } else {
          pushCityWithVacancies().then;
        }
      } catch (err) {
        console.log(err);
      }
    } catch (e) {
      console.log(e);
    }

    // try {
    //   const filePath = path.join(__dirname, './fakeDataBase.json');
    //   const data = await readFile(
    //     '/home/dimavab/dima/test/testVue/sc_craft_01.04/myProjectSC/html/sc-scr-website/webserver/src/api/controllers/vacancy/fakeDataBase.json'
    //   );
    //   const fileArray = JSON.parse(data.toString());

    //   // add check is iteam already exist in DataBase - only need if i use my fakeDataBase
    //   fileArray.push({
    //     city_title,
    //     active,
    //     vacancies: [
    //       {
    //         link_name,
    //         title,
    //         id,
    //       },
    //     ],
    //   });
    //   fs.writeFile(
    //     '/home/dimavab/dima/test/testVue/sc_craft_01.04/myProjectSC/html/sc-scr-website/webserver/src/api/controllers/vacancy/fakeDataBase.json',
    //     JSON.stringify(fileArray),
    //     err => console.log(err)
    //   );
    //   res.status(200).json({ fileArray });
    // } catch (error) {
    //   console.log(error);
    // }
  }

  public async getVacancyMongoDb(req: Request, res: Response): Promise<void> {
    console.log("======================");
    console.log("Get Vacancy from MongoDb.");
    console.log("======================");
    if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      return;
    }

    // connect with MongoDB
    try {
      await mongoose.connect(
        "mongodb+srv://dima:success1122@cluster0.t5xsk.mongodb.net/vacancy",
        {
          useNewUrlParser: true,
          useFindAndModify: true,
          useUnifiedTopology: true,
        }
      );
      console.log("+++++++++ use mongoose++++++++++++++++++=");
      // take data from MongoDb
      try {
        const response = await MongeVacancy.find({});
        console.log(response);
        res.status(200).json(response);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }

    // await Axios('https://jsonplaceholder.typicode.com/todos/1').then(() => console.log('response'));
    if (1 > 1000) {
      res.status(404).json({ message: `SITE KEY isn't availble!` });
      req.url;
      return;
    }
    // if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
    //   res.status(404).json({ message: `SITE KEY isn't availble!` });
    //   return;
    // }

    // if (!WS_BACK_URL || !WS_BACK_URL.length) {
    //   res.status(404).json({ message: `Backend URL isn't availble!` });
    //   return;
    // }

    // try {
    //   // let data: unknown;
    //   // setTimeout(() => {
    //   //   // data = dataFake;
    //   //   res.status(200).json(data);
    //   // }, 2000);
    //   const data = await readFile(
    //     '/home/dimavab/dima/test/testVue/sc_craft_01.04/myProjectSC/html/sc-scr-website/webserver/src/api/controllers/vacancy/fakeDataBase.json'
    //   );
    //   res.status(200).json(JSON.parse(data.toString()));
    // } catch (error) {
    //   res.status(404).json({ message: error.message || JSON.stringify(error), error });
    // }
  }
}

export default new ProductController();
// export default new VacancyController();
