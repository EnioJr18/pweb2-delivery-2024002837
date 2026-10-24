export default class EntregasController {
  constructor(service, motoristasService) {
    this.service = service;
    this.motoristasService = motoristasService;
  }

  criar = async (req, res) => {
    try {
      await this.service.criarEntrega(req.body);
      req.flash('success', 'Entrega criada com sucesso!');
      res.redirect('/entregas');
    } catch (error) {
      res.status(error.status || 400).render('entregas/nova', { 
        error: error.message, 
        oldData: req.body 
      });
    }
  }

  listar = async (req, res) => {
    try {
      const statusFiltro = req.query.status;
      const entregas = await this.service.buscarTodas(statusFiltro);
      res.render('entregas/index', { entregas, statusAtual: statusFiltro });
    } catch (error) {
      req.flash('error', 'Erro ao carregar as entregas.');
      res.redirect('/');
    }
  }

  buscarPorId = async (req, res) => {
    try {
      const entrega = await this.service.buscarPorId(req.params.id);
      let motoristas = [];
      
      if (entrega.status === 'CRIADA') {
        const todosMotoristas = await this.motoristasService.listarTodos();
        motoristas = todosMotoristas.filter(m => m.status === 'ATIVO');
      }
      
      res.render('entregas/detalhes', { entrega, motoristas });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('erros/404', { message: 'A entrega que procura não existe.' });
      }
      req.flash('error', error.message);
      res.redirect('/entregas');
    }
  }

  nova = (req, res) => {
    res.render('entregas/nova');
  }

  avancar = async (req, res) => {
    try {
      await this.service.avancarStatus(req.params.id);
      req.flash('success', 'Status da entrega avançado com sucesso!');
    } catch (error) {
      req.flash('error', error.message);
    }
    res.redirect(`/entregas/${req.params.id}`);
  }

  cancelar = async (req, res) => {
    try {
      await this.service.cancelar(req.params.id);
      req.flash('success', 'Entrega cancelada com sucesso!');
    } catch (error) {
      req.flash('error', error.message);
    }
    res.redirect(`/entregas/${req.params.id}`);
  }

  historico = async (req, res) => {
    try {
      const entrega = await this.service.buscarPorId(req.params.id);
      res.status(200).json(entrega.historico);
    } catch (error) {
      res.status(error.status || 500).json({ erro: error.message });
    }
  };

atribuir = async (req, res) => {
    try {
      await this.service.atribuirMotorista(req.params.id, req.body.motoristaId);
      req.flash('success', 'Motorista atribuído com sucesso!');
    } catch (error) {
      req.flash('error', error.message);
    }
    res.redirect(`/entregas/${req.params.id}`);
  }
}
