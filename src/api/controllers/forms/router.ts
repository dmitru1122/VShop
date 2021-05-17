import express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/with-resume', controller.sendWithResumeForm)
  .post('/without-resume', controller.sendWithoutResumeForm)
  .get('/without-resume', controller.getWithoutResumeForm);
