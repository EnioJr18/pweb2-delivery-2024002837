import express from 'express';
import Database from '../database/Database.js';
import EntregasRepository from '../repositories/EntregasRepository.js';
import EntregasService from '../services/EntregasService.js';
import EntregasController from '../controllers/EntregasController.js';


export function criarRotas() {
  const router = express.Router();

  const database = new Database(); 
  const repository = new EntregasRepository(database); 
  const service = new EntregasService(repository); 
  const controller = new EntregasController(service); 

  router.post('/entregas', controller.criar);
  router.get('/entregas', controller.listar);
  router.get('/entregas/:id', controller.buscarPorId);
  router.patch('/entregas/:id/avancar', controller.avancar);
  router.patch('/entregas/:id/cancelar', controller.cancelar);
  router.get('/entregas/:id/historico', controller.historico);

  return router;
}