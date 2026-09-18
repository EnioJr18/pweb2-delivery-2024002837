class EntregasRepository {
  constructor(database) {
    this.db = database;
  }

  salvar(entrega) {
    entrega.id = this.db.currentId++;
    this.db.entregas.push(entrega);
    return entrega;
  }

  buscarTodas() {
    return this.db.entregas;
  }

  buscarPorId(id) {
    return this.db.entregas.find(e => e.id === Number(id));
  }

  atualizar(entregaAtualizada) {
    const index = this.db.entregas.findIndex(e => e.id === entregaAtualizada.id);
    if (index !== -1) {
      this.db.entregas[index] = entregaAtualizada;
    }
    return entregaAtualizada;
  }
}

export default EntregasRepository;