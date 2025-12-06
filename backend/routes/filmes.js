import { Router } from 'express'
import { FilmeController } from '../controllers/FilmeController.js'

const router = Router()

/**
 * @swagger
 * /filmes:
 *   get:
 *     summary: Retorna a lista todos os filmes
 *     tags:
 *       - Filmes
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso
 */
router.get('/', FilmeController.listar)

/**
 * @swagger
 * /filmes/{id}:
 *   get:
 *     summary: Busca um filme pelo ID
 *     tags:
 *       - Filmes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme a ser buscado
 *     responses:
 *       200:
 *         description: Filme encontrado com sucesso
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', FilmeController.buscarPorId)

/**
 * @swagger
 * /filmes:
 *   post:
 *     summary: Cria um novo filme
 *     tags:
 *       - Filmes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               genero:
 *                 type: string
 *               ano:
 *                 type: integer
 *               nota:
 *                 type: number
 *               status:
 *                 type: string
 *               capa_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Filme criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/', FilmeController.criar)

/**
 * @swagger
 * /filmes/{id}:
 *   put:
 *     summary: Atualiza um filme existente pelo ID
 *     tags:
 *       - Filmes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               genero:
 *                 type: string
 *               ano:
 *                 type: integer
 *               nota:
 *                 type: number
 *               status:
 *                 type: string
 *               capa_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id', FilmeController.atualizar)

/**
 * @swagger
 * /filmes/{id}:
 *   delete:
 *     summary: Exclui um filme pelo ID
 *     tags:
 *       - Filmes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme a ser excluído
 *     responses:
 *       200:
 *         description: Filme excluído com sucesso
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', FilmeController.deletar)

export default router