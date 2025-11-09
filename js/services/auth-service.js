const url = `https://6tq0bqkysh.execute-api.sa-east-1.amazonaws.com/dev/`;

function arrayToDateString(arr) {
    const [year, month, day] = arr;
    // Garantindo dois dígitos para mês e dia
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}

/**
 * Consulta todos os livros disponíveis para troca / doacao
 * @param {email} email - email de login
 * @param {senha} senha
 * @returns {object} user - dados do usuário logado
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
    if (resposta.status === 200) {
        let user = await resposta.json();
        // Converte birthDate de array para string no formato YYYY-MM-DD
        user.birthDate = arrayToDateString(user.birthDate);
        return user;
    }
    else {
        return null;
    }
}