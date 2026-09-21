/**
 * Contrato IEntregasRepository
 * @interface IEntregasRepository
 * @method listarTodos(filtros?: Object) => Entrega[]
 * @method buscarPorId(id: number) => Entrega | null
 * @method criar(dados: Object) => Entrega
 * @method atualizar(id: number, dados: Object) => Entrega
 */
export default class EntregasRepository {
  constructor(database) {
    this.db = database;
  }

  listarTodos(filtros) {
    let entregas = this.db.entregas;
    if (filtros && filtros.status) {
      entregas = entregas.filter(e => e.status === filtros.status);
    }
    return entregas;
  }

  buscarPorId(id) {
    return this.db.entregas.find(e => e.id === Number(id)) || null;
  }

  criar(dados) {
    dados.id = this.db.currentId++;
    this.db.entregas.push(dados);
    return dados;
  }

  atualizar(id, dados) {
    const index = this.db.entregas.findIndex(e => e.id === Number(id));
    if (index !== -1) {
      this.db.entregas[index] = dados;
    }
    return dados;
  }
}