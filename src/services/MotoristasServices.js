export default class MotoristasService {
  constructor(motoristasRepo, entregasRepo) {
    this.motoristasRepo = motoristasRepo;
    this.entregasRepo = entregasRepo;
  }

  async criarMotorista(dados) {
    const { nome, cpf, placaVeiculo } = dados;

    if (!nome || !cpf) throw { status: 400, message: "Nome e CPF são obrigatórios." };

    const existe = await this.motoristasRepo.buscarPorCpf(cpf);
    if (existe) throw { status: 409, message: "CPF já cadastrado." };

    const novoMotorista = {
      nome,
      cpf,
      placaVeiculo: placaVeiculo || null,
      status: 'ATIVO'
    };

    return await this.motoristasRepo.criar(novoMotorista);
  }

  async listarTodos() {
    return await this.motoristasRepo.listarTodos();
  }

  async buscarPorId(id) {
    const motorista = await this.motoristasRepo.buscarPorId(id);
    if (!motorista) throw { status: 404, message: "Motorista não encontrado." };
    return motorista;
  }

  async listarEntregasDoMotorista(motoristaId, status) {
    const filtro = status ? { status } : undefined;
    const entregas = await this.entregasRepo.listarTodos(filtro);
    
    return entregas.filter(e => e.motoristaId === Number(motoristaId) || e.motoristald === Number(motoristaId));
  }
}