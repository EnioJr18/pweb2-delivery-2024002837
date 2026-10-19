export default class MotoristasController {
  constructor(service) {
    this.service = service;
  }

  criar = async (req, res) => {
    try {
      const motorista = await this.service.criarMotorista(req.body);
      res.status(201).json(motorista);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  };

  listar = async (req, res) => {
    try {
      res.status(200).json(await this.service.listarTodos());
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      res.status(200).json(await this.service.buscarPorId(req.params.id));
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  };

  listarEntregas = async (req, res) => {
    try {
      const { status } = req.query;
      const entregas = await this.service.listarEntregasDoMotorista(
        req.params.id,
        status,
      );
      res.status(200).json(entregas);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  };
}
