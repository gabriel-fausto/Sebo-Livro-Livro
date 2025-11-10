const url = `https://6tq0bqkysh.execute-api.sa-east-1.amazonaws.com/dev/`;

/**
 * Consulta todos os livros disponíveis para troca / doacao
 * @param {Number} quantidade - quantidade de livros a consultar
 * @returns {object} books - Lista de livros disponíveis
 */
export async function consultaLivros() {
    // Faz a chamada na API
    const resposta = await fetch(`${url}books/`);
    const dados = await resposta.json();
    return dados;
}

/**
 * Cria um novo livro associado ao email do usuário
 * @param {string} email - Email do usuário que está cadastrando o livro
 * @param {object} bookData - Dados do livro a ser criado
 * @returns {object} book - Livro criado com ID gerado
 */
export async function createBook(email, bookData) {
    const resposta = await fetch(`${url}books/${email}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    });

    if (resposta.status === 201) {
        return await resposta.json();
    } else {
        throw new Error('Erro ao cadastrar livro');
    }
}

/**
 * Consulta todos os livros (alias para consultaLivros)
 * @returns {array} books - Lista de todos os livros
 */
export async function getAllBooks() {
    return await consultaLivros();
}

/**
 * Busca um livro específico pelo ID
 * @param {string} idLivro - ID do livro
 * @returns {object} book - Livro encontrado
 */
export async function getBookById(idLivro) {
    const resposta = await fetch(`${url}books/${idLivro}`);
    
    if (resposta.status === 200) {
        return await resposta.json();
    } else {
        throw new Error('Livro não encontrado');
    }
}

/**
 * Atualiza um livro existente
 * @param {string} idLivro - ID do livro a ser atualizado
 * @param {object} bookData - Dados atualizados do livro
 * @returns {object} book - Livro atualizado
 */
export async function updateBook(idLivro, bookData) {
    const resposta = await fetch(`${url}books/${idLivro}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    });

    if (resposta.status === 200) {
        return await resposta.json();
    } else {
        throw new Error('Erro ao atualizar livro');
    }
}

/**
 * Exclui um livro
 * @param {string} idLivro - ID do livro a ser excluído
 * @returns {boolean} - true se exclusão bem sucedida
 */
export async function deleteBook(idLivro) {
    const resposta = await fetch(`${url}books/${idLivro}`, {
        method: 'DELETE'
    });

    if (resposta.status === 204) {
        return true;
    } else {
        throw new Error('Erro ao excluir livro');
    }
}