import express from 'express'
import { FilmeController } from '../controllers/FilmeController.js'

const router = express.Router()

// Definição das rotas
router.get('/', FilmeController.listar)
router.get('/:id', FilmeController.buscarPorId)
router.post('/', FilmeController.criar)
router.put('/:id', FilmeController.atualizar)
router.delete('/:id', FilmeController.deletar)

export default router