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

/**
 * Consulta todos os livros disponíveis para troca / doacao
 * @param {email} email - email de login
 * @param {senha} senha
 * @returns {boolean} books - Lista de livros disponíveis
 */
export async function login(email, senha) {
    // Cria o objeto JSON com email e password
    const payload = {
        email: email,
        password: senha
    };

    // Faz a chamada na API enviando o objeto no corpo da requisição
    const resposta = await fetch(`${url}/auth/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    // Retorna true se o status for 200, senão retorna false
    return resposta.status === 200;
}