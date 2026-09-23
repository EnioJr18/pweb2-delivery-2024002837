export default class MotoristasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res) => {
    try {
      const motorista = this.service.criarMotorista(req.body);
      res.status(201).json(motorista);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  listar = (req, res) => {
    try {
      res.status(200).json(this.service.listarTodos());
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  buscarPorId = (req, res) => {
    try {
      res.status(200).json(this.service.buscarPorId(req.params.id));
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  listarEntregas = (req, res) => {
    try {
      const { status } = req.query;
      const entregas = this.service.listarEntregasDoMotorista(req.params.id, status);
      res.status(200).json(entregas);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }
}