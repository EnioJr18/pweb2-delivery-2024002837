import express from "express";
import EntregasRepository from "../repositories/EntregasRepository.js";
import MotoristasRepository from "../repositories/MotoristasRepository.js";
import EntregasService from "../services/EntregasServices.js";
import MotoristasService from "../services/MotoristasServices.js";
import EntregasController from "../controllers/EntregasController.js";
import MotoristasController from "../controllers/MotoristasController.js";

export function criarRotas() {
  const router = express.Router();
  router.get('/', (req, res) => {
      res.redirect('/entregas');
    });

  const entregasRepo = new EntregasRepository();
  const motoristasRepo = new MotoristasRepository();

  const entregasService = new EntregasService(entregasRepo, motoristasRepo);
  const motoristasService = new MotoristasService(motoristasRepo, entregasRepo);

  const entregasController = new EntregasController(entregasService, motoristasService);
  const motoristasController = new MotoristasController(motoristasService);

  router.post("/entregas", entregasController.criar);
  router.get("/entregas", entregasController.listar);
  router.get('/entregas/nova', entregasController.nova);
  router.get("/entregas/:id", entregasController.buscarPorId);
  router.patch("/entregas/:id/avancar", entregasController.avancar);
  router.patch("/entregas/:id/cancelar", entregasController.cancelar);
  router.get("/entregas/:id/historico", entregasController.historico);
  router.patch("/entregas/:id/atribuir", entregasController.atribuir);

  router.post("/motoristas", motoristasController.criar);
  router.get("/motoristas", motoristasController.listar);
  router.get('/motoristas/novo', motoristasController.novo);
  router.get("/motoristas/:id", motoristasController.buscarPorId);
  router.get("/motoristas/:id/entregas", motoristasController.listarEntregas);

  return router;
}
