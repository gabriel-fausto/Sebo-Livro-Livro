const url = `https://6tq0bqkysh.execute-api.sa-east-1.amazonaws.com/dev/`;

/**
 * Consulta todos os livros disponíveis para troca / doacao
 * @param {Number} quantidade - quantidade de livros a consultar
 * @returns {object} books - Lista de livros disponíveis
 */
export async function consultaLivros() {
    // Faz a chamada na API
    const resposta = await fetch(`${url}/books/`);
    const dados = await resposta.json();

    return dados;
}