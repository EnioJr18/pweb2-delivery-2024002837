/**
 * Contrato IMotoristasRepository
 * @interface IMotoristasRepository
 * @method listarTodos() => Motorista[]
 * @method buscarPorId(id: number) => Motorista | null
 * @method buscarPorCpf(cpf: string) => Motorista | null
 * @method criar(dados: Object) => Motorista
 */
export default class MotoristasRepository {
  constructor(database) {
    this.db = database;
  }

  listarTodos() {
    return this.db.motoristas;
  }

  buscarPorId(id) {
    return this.db.motoristas.find(m => m.id === Number(id)) || null;
  }

  buscarPorCpf(cpf) {
    return this.db.motoristas.find(m => m.cpf === cpf) || null;
  }

  criar(dados) {
    const motorista = {
      id: this.db.currentMotoristaId++,
      ...dados
    };
    this.db.motoristas.push(motorista);
    return motorista;
  }
}