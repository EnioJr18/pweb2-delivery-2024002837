export default class MotoristasService {
  constructor(motoristasRepo, entregasRepo) {
    this.motoristasRepo = motoristasRepo;
    this.entregasRepo = entregasRepo;
  }

  criarMotorista(dados) {
    const { nome, cpf, placaVeiculo } = dados;

    if (!nome || !cpf) {
      throw { status: 400, message: "Nome e CPF são obrigatórios." };
    }

    const existe = this.motoristasRepo.buscarPorCpf(cpf);
    if (existe) {
      throw { status: 409, message: "CPF já cadastrado." };
    }

    const novoMotorista = {
      nome,
      cpf,
      placaVeiculo: placaVeiculo || null,
      status: 'ATIVO'
    };

    return this.motoristasRepo.criar(novoMotorista);
  }

  listarTodos() {
    return this.motoristasRepo.listarTodos();
  }

  buscarPorId(id) {
    const motorista = this.motoristasRepo.buscarPorId(id);
    if (!motorista) throw { status: 404, message: "Motorista não encontrado." };
    return motorista;
  }

  listarEntregasDoMotorista(motoristaId, status) {
    this.buscarPorId(motoristaId); 
    
    const filtro = status ? { status } : undefined;
    const entregas = this.entregasRepo.listarTodos(filtro);
    
    return entregas.filter(e => e.motoristaId === Number(motoristaId) || e.motoristald === Number(motoristaId));
  }
}