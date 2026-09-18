export default class EntregasService {
  constructor(repository) {
    this.repository = repository;
  }

  criarEntrega(dados) {
    const { descricao, origem, destino } = dados;

    if (!descricao || !origem || !destino) {
      throw { status: 400, message: "Campos obrigatórios (descricao, origem, destino) faltando." };
    }
    if (origem === destino) {
      throw { status: 400, message: "Origem e destino não podem ser iguais." };
    }

    const entregas = this.repository.buscarTodas();
    const duplicataAtiva = entregas.find(e => 
      e.descricao === descricao && 
      e.origem === origem && 
      e.destino === destino &&
      e.status !== 'ENTREGUE' && 
      e.status !== 'CANCELADA'
    );

    if (duplicataAtiva) {
      throw { status: 409, message: "Entrega duplicada ativa já existe." };
    }

    const novaEntrega = {
      descricao,
      origem,
      destino,
      status: 'CRIADA',
      motoristaId: null,
      historico: [{
        data: new Date().toISOString(),
        descricao: "Entrega criada"
      }]
    };

    return this.repository.salvar(novaEntrega);
  }

  buscarTodas(statusFiltro) {
    let entregas = this.repository.buscarTodas();
    if (statusFiltro) {
      entregas = entregas.filter(e => e.status === statusFiltro);
    }
    return entregas;
  }

  buscarPorId(id) {
    const entrega = this.repository.buscarPorId(id);
    if (!entrega) throw { status: 404, message: "Entrega não encontrada." };
    return entrega;
  }

  avancarStatus(id) {
    const entrega = this.buscarPorId(id);

    if (entrega.status === 'CRIADA') {
      entrega.status = 'EM_TRANSITO';
      entrega.historico.push({ data: new Date().toISOString(), descricao: "Status atualizado para EM_TRANSITO" });
    } else if (entrega.status === 'EM_TRANSITO') {
      entrega.status = 'ENTREGUE';
      entrega.historico.push({ data: new Date().toISOString(), descricao: "Status atualizado para ENTREGUE" });
    } else {
      throw { status: 422, message: "Transição de status inválida." };
    }

    return this.repository.atualizar(entrega);
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);

    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      throw { status: 422, message: "Não é possível cancelar uma entrega finalizada ou já cancelada." };
    }

    entrega.status = 'CANCELADA';
    entrega.historico.push({ data: new Date().toISOString(), descricao: "Entrega cancelada" });
    return this.repository.atualizar(entrega);
  }
}