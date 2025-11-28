import { supabase } from '../utils/supabase.js'

export const FilmeController = {
  // 1. LISTAR (GET /)
  async listar(req, res) {
    const { data, error } = await supabase
      .from('filmes')
      .select('*')
      .order('id', { ascending: false })

    if (error) return res.status(500).json({ erro: error.message })
    return res.json(data)
  },

  // 2. BUSCAR POR ID (GET /:id)
  async buscarPorId(req, res) {
    const { id } = req.params
    const { data, error } = await supabase
      .from('filmes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return res.status(500).json({ erro: error.message })
    if (!data) return res.status(404).json({ erro: 'Filme não encontrado' })
    
    return res.json(data)
  },

  // 3. CRIAR (POST /)
  async criar(req, res) {
    const { titulo, genero, ano, nota, status, capa_url } = req.body

    // Validação básica
    if (!titulo) {
      return res.status(400).json({ erro: 'O título é obrigatório!' })
    }

    const { data, error } = await supabase
      .from('filmes')
      .insert([{ titulo, genero, ano, nota, status, capa_url }])
      .select()

    if (error) return res.status(500).json({ erro: error.message })
    return res.status(201).json(data)
  },

  // 4. ATUALIZAR (PUT /:id)
  async atualizar(req, res) {
    const { id } = req.params
    const { titulo, genero, ano, nota, status, capa_url } = req.body

    const { error } = await supabase
      .from('filmes')
      .update({ titulo, genero, ano, nota, status, capa_url })
      .eq('id', id)

    if (error) return res.status(500).json({ erro: error.message })
    return res.json({ message: 'Filme atualizado com sucesso!' })
  },

  // 5. DELETAR (DELETE /:id)
  async deletar(req, res) {
    const { id } = req.params

    const { error } = await supabase
      .from('filmes')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json({ erro: error.message })
    return res.json({ message: 'Filme removido!' })
  }
}