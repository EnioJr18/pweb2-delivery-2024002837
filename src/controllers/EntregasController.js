export default class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = async (req, res) => {
    try {
      const novaEntrega = await this.service.criarEntrega(req.body);
      res.status(201).json(novaEntrega);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  listar = async (req, res) => {
    try {
      const statusFiltro = req.query.status;
      const entregas = await this.service.buscarTodas(statusFiltro);
      res.status(200).json(entregas);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  buscarPorId = async (req, res) => {
    try {
      const entrega = await this.service.buscarPorId(req.params.id);
      res.status(200).json(entrega);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  avancar = async (req, res) => {
    try {
      const entrega = await this.service.avancarStatus(req.params.id);
      res.status(200).json(entrega);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  cancelar = async (req, res) => {
    try {
      const entrega = await this.service.cancelar(req.params.id);
      res.status(200).json(entrega);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  historico = async (req, res) => {
    try {
      const entrega = await this.service.buscarPorId(req.params.id);
      res.status(200).json(entrega.historico);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }

  atribuir = async (req, res) => {
    try {
      const payload = req.body || {};
      const motoristaId = payload.motoristaId || payload.motoristald || payload.id || Object.values(payload)[0];
      
      const entrega = await this.service.atribuirMotorista(req.params.id, motoristaId);
      res.status(200).json(entrega);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  }
}