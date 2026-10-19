import { prisma } from "../database/prisma.js";

/**
 * Contrato IEntregasRepository
 * @interface IEntregasRepository
 * @method listarTodos(filtros?: Object) => Promise<Entrega[]>
 * @method buscarPorId(id: number) => Promise<Entrega | null>
 * @method criar(dados: Object) => Promise<Entrega>
 * @method atualizar(id: number, dados: Object) => Promise<Entrega>
 */
export default class EntregasRepository {
  async listarTodos(filtros) {
    const where = filtros && filtros.status ? { status: filtros.status } : {};
    return await prisma.entrega.findMany({
      where,
    });
  }

  async buscarPorId(id) {
    return await prisma.entrega.findUnique({
      where: { id: Number(id) },
      include: { historico: true },
    });
  }

  async criar(dados) {
    const { historico, ...entregaData } = dados;

    return await prisma.entrega.create({
      data: {
        ...entregaData,
        historico: {
          create: historico,
        },
      },
      include: { historico: true },
    });
  }

  async atualizar(id, dados) {
    const { historico, ...entregaData } = dados;

    const novosEventos = historico
      ? historico
          .filter((h) => !h.id)
          .map((h) => ({ data: h.data, descricao: h.descricao }))
      : [];

    return await prisma.entrega.update({
      where: { id: Number(id) },
      data: {
        descricao: entregaData.descricao,
        origem: entregaData.origem,
        destino: entregaData.destino,
        status: entregaData.status,
        motoristaId: entregaData.motoristaId,
        historico: {
          create: novosEventos,
        },
      },
      include: { historico: true },
    });
  }
}
