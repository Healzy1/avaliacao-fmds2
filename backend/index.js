import express from 'express'
import cors from 'cors'
import { supabase } from './utils/supabase.js'

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(cors())

// --- ROTAS (CRUD) ---

// 1. GET - Listar Filmes
app.get('/filmes', async (req, res) => {
  const { data, error } = await supabase
    .from('filmes')
    .select('*')
    .order('id', { ascending: false })

  if (error) return res.status(500).json({ erro: error.message })
  res.json(data)
})

// 1.5. GET - Buscar APENAS UM filme pelo ID
app.get('/filmes/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('filmes')
    .select('*')
    .eq('id', id)
    .single() // <--- O PULO DO GATO: Retorna um objeto { }, não uma lista [ ]

  if (error) return res.status(500).json({ erro: error.message })
  
  // Se não achar nada (data vazio), retorna 404
  if (!data) return res.status(404).json({ erro: 'Filme não encontrado' })

  res.json(data)
})

// 2. POST - Criar Filme
app.post('/filmes', async (req, res) => {
  const { titulo, genero, ano, nota, status, capa_url } = req.body

  // Validação simples para garantir "Tratamento básico de erros" [cite: 79]
  if (!titulo) {
    return res.status(400).json({ erro: 'O título é obrigatório!' })
  }

  const { data, error } = await supabase
    .from('filmes')
    .insert([{ titulo, genero, ano, nota, status, capa_url }])
    .select()

  if (error) return res.status(500).json({ erro: error.message })
  res.status(201).json(data)
})

// 3. PUT - Atualizar Filme
app.put('/filmes/:id', async (req, res) => {
  const { id } = req.params
  const { titulo, genero, ano, nota, status, capa_url } = req.body

  const { error } = await supabase
    .from('filmes')
    .update({ titulo, genero, ano, nota, status, capa_url })
    .eq('id', id)

  if (error) return res.status(500).json({ erro: error.message })
  res.json({ message: 'Filme atualizado com sucesso!' })
})

// 4. DELETE - Deletar Filme
app.delete('/filmes/:id', async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('filmes')
    .delete()
    .eq('id', id)

  if (error) return res.status(500).json({ erro: error.message })
  res.json({ message: 'Filme removido!' })
})

// Iniciar
app.listen(port, () => {
  console.log(`🚀 Servidor rodando com Bun em http://localhost:${port}`)
})