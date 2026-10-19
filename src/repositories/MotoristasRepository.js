import { prisma } from '../database/prisma.js';

/**
 * Contrato IMotoristasRepository
 * @interface IMotoristasRepository
 * @method listarTodos() => Promise<Motorista[]>
 * @method buscarPorId(id: number) => Promise<Motorista | null>
 * @method buscarPorCpf(cpf: string) => Promise<Motorista | null>
 * @method criar(dados: Object) => Promise<Motorista>
 */
export default class MotoristasRepository {
  async listarTodos() {
    return await prisma.motorista.findMany();
  }

  async buscarPorId(id) {
    return await prisma.motorista.findUnique({ 
      where: { id: Number(id) } 
    });
  }

  async buscarPorCpf(cpf) {
    return await prisma.motorista.findUnique({ 
      where: { cpf } 
    });
  }

  async criar(dados) {
    return await prisma.motorista.create({ 
      data: dados 
    });
  }
}