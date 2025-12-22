import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada' }, { status: 400 })
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Arquivo deve ser uma imagem' },
        { status: 400 }
      )
    }

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Imagem muito grande (máximo 10MB)' },
        { status: 400 }
      )
    }

    // Converter para buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Comprimir e redimensionar imagem
    const processedImage = await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer()

    // Gerar nome único
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`

    // Verificar se o bucket existe e criar se necessário
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === 'timeline-images')
    
    if (!bucketExists) {
      // Criar bucket se não existir
      const { error: createError } = await supabaseAdmin.storage.createBucket('timeline-images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })
      
      if (createError && !createError.message.includes('already exists')) {
        console.error('Erro ao criar bucket:', createError)
        return NextResponse.json(
          { error: 'Erro ao configurar armazenamento. Verifique as configurações do Supabase.' },
          { status: 500 }
        )
      }
    }

    // Upload para Supabase Storage
    let uploadData, uploadError
    try {
      const result = await supabaseAdmin.storage
        .from('timeline-images')
        .upload(fileName, processedImage, {
          contentType: 'image/jpeg',
          upsert: false,
          cacheControl: '3600',
        })
      uploadData = result.data
      uploadError = result.error
    } catch (uploadException: any) {
      console.error('Exceção no upload:', uploadException)
      uploadError = uploadException
    }

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      
      // Se o erro for de bucket não encontrado
      const errorMessage = uploadError.message || uploadError.toString() || ''
      if (errorMessage.includes('not found') || errorMessage.includes('Bucket') || errorMessage.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Bucket de armazenamento não configurado. Por favor, crie o bucket "timeline-images" no Supabase Storage (público).',
            details: 'Acesse Supabase > Storage > Create bucket > Nome: timeline-images > Público: Sim'
          },
          { status: 500 }
        )
      }
      
      // Se o erro for de JSON parsing (resposta vazia ou inválida)
      if (errorMessage.includes('JSON') || errorMessage.includes('Unexpected end')) {
        return NextResponse.json(
          { 
            error: 'Erro de comunicação com o armazenamento. Verifique se o bucket "timeline-images" existe e está configurado como público no Supabase.',
            details: 'Acesse Supabase > Storage e verifique se o bucket existe'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: `Erro ao fazer upload: ${errorMessage}`,
          details: 'Verifique as configurações do Supabase Storage'
        },
        { status: 500 }
      )
    }

    // Obter URL pública
    if (!uploadData || !uploadData.path) {
      return NextResponse.json(
        { error: 'Upload realizado mas não foi possível obter a URL da imagem' },
        { status: 500 }
      )
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('timeline-images').getPublicUrl(uploadData.path)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Erro na API de upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

