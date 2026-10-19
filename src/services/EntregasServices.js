export default class EntregasService {
  constructor(entregasRepo, motoristasRepo) {
    this.repository = entregasRepo;
    this.motoristasRepo = motoristasRepo;
  }

  async criarEntrega(dados) {
    const { descricao, origem, destino } = dados;

    if (!descricao || !origem || !destino) throw { status: 400, message: "Campos obrigatórios (descricao, origem, destino) faltando." };
    if (origem === destino) throw { status: 400, message: "Origem e destino não podem ser iguais." };

    const entregas = await this.repository.listarTodos();
    const duplicataAtiva = entregas.find(e => 
      e.descricao === descricao && e.origem === origem && e.destino === destino &&
      e.status !== 'ENTREGUE' && e.status !== 'CANCELADA'
    );

    if (duplicataAtiva) throw { status: 409, message: "Entrega duplicada ativa já existe." };

    const novaEntrega = {
      descricao, 
      origem, 
      destino, 
      status: 'CRIADA', 
      motoristaId: null,
      historico: [{ data: new Date().toISOString(), descricao: "Entrega criada" }]
    };

    return await this.repository.criar(novaEntrega);
  }

  async buscarTodas(statusFiltro) {
    const filtro = statusFiltro ? { status: statusFiltro } : undefined;
    return await this.repository.listarTodos(filtro);
  }

  async buscarPorId(id) {
    const entrega = await this.repository.buscarPorId(id);
    if (!entrega) throw { status: 404, message: "Entrega não encontrada." };
    return entrega;
  }

  async avancarStatus(id) {
    const entrega = await this.buscarPorId(id);

    if (entrega.status === 'CRIADA') {
      entrega.status = 'EM_TRANSITO';
      entrega.historico.push({ data: new Date().toISOString(), descricao: "Status atualizado para EM_TRANSITO" });
    } else if (entrega.status === 'EM_TRANSITO') {
      entrega.status = 'ENTREGUE';
      entrega.historico.push({ data: new Date().toISOString(), descricao: "Status atualizado para ENTREGUE" });
    } else {
      throw { status: 422, message: "Transição de status inválida." };
    }

    return await this.repository.atualizar(entrega.id, entrega);
  }

  async cancelar(id) {
    const entrega = await this.buscarPorId(id);

    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      throw { status: 422, message: "Não é possível cancelar uma entrega finalizada ou já cancelada." };
    }

    entrega.status = 'CANCELADA';
    entrega.historico.push({ data: new Date().toISOString(), descricao: "Entrega cancelada" });
    
    return await this.repository.atualizar(entrega.id, entrega);
  }

  async atribuirMotorista(id, motoristaId) {
    const entrega = await this.buscarPorId(id);
    
    if (entrega.status !== 'CRIADA') throw { status: 422, message: "Só é possível atribuir motorista se a entrega estiver CRIADA." };

    const motorista = await this.motoristasRepo.buscarPorId(motoristaId);
    if (!motorista) throw { status: 404, message: "Motorista não encontrado." };
    if (motorista.status !== 'ATIVO') throw { status: 422, message: "Motorista INATIVO não pode ser atribuído." };

    entrega.motoristaId = motorista.id;
    entrega.historico.push({ data: new Date().toISOString(), descricao: "Motorista atribuído" });
    
    return await this.repository.atualizar(entrega.id, entrega);
  }
}