import express from 'express';
import controller from './controller';

export default express
  .Router()
  // .get('/s', controller.getVacancySalesforce)
  // .post('/s', controller.sendVacancySalesforce)
  // .get('/m', controller.getVacancyMongoDb)
  // .post('/m', controller.sendVacancyMongoDb);
  // .get('/jeans', controller.getJeansSalesforce)
  // .post('/jeans', controller.sendJeansSalesforce)
  .get('/jeans', controller.getJeansMongoDb)
  .post('/jeans', controller.sendJeansMongoDb);
  // .get('/shoes', controller.getShoesSalesforce)
  // .post('/shoes', controller.sendShoesSalesforce)
  // .get('/shoes', controller.getShoesMongoDb)
  // .post('/shoes', controller.sendShoesMongoDb);
  // .get('/jacket', controller.getJacketSalesforce)
  // .post('/jacket', controller.sendJacketSalesforce)
  // .get('/jacket', controller.getJacketMongoDb)
  // .post('/jacket', controller.sendJacketMongoDb);
  // .get('/shirt', controller.getShirtSalesforce)
  // .post('/shirt', controller.sendShirtSalesforce)
  // .get('/shirt', controller.getShirtMongoDb)
  // .post('/shirt', controller.sendShirtMongoDb);