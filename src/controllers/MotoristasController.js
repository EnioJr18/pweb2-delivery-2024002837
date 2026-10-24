export default class MotoristasController {
  constructor(service) {
    this.service = service;
  }

criar = async (req, res) => {
    try {
      await this.service.criarMotorista(req.body);
      
      req.flash('success', 'Motorista cadastrado com sucesso!');
      res.redirect('/motoristas');
      
    } catch (error) {
      res.status(error.status || 400).render('motoristas/novo', { 
        error: error.message, 
        oldData: req.body 
      });
    }
  }

listar = async (req, res) => {
    try {
      const motoristas = await this.service.listarTodos();
      res.render('motoristas/index', { motoristas });
    } catch (error) {
      req.flash('error', 'Erro ao carregar a lista de motoristas.');
      res.redirect('/');
    }
  }

novo = (req, res) => {
    res.render('motoristas/novo');
  }

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
