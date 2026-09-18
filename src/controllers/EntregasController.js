export default class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res) => {
    try {
      const novaEntrega = this.service.criarEntrega(req.body);
      res.status(201).json(novaEntrega);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  listar = (req, res) => {
    try {
      const statusFiltro = req.query.status;
      const entregas = this.service.buscarTodas(statusFiltro);
      res.status(200).json(entregas);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  buscarPorId = (req, res) => {
    try {
      const entrega = this.service.buscarPorId(req.params.id);
      res.status(200).json(entrega);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  avancar = (req, res) => {
    try {
      const entrega = this.service.avancarStatus(req.params.id);
      res.status(200).json(entrega);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  cancelar = (req, res) => {
    try {
      const entrega = this.service.cancelar(req.params.id);
      res.status(200).json(entrega);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  historico = (req, res) => {
    try {
      const entrega = this.service.buscarPorId(req.params.id);
      res.status(200).json(entrega.historico);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }
}