const url = `https://6tq0bqkysh.execute-api.sa-east-1.amazonaws.com/dev/`;

function arrayToDateString(arr) {
    const [year, month, day] = arr;
    // Garantindo dois dígitos para mês e dia
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}

/**
 * Realiza o login do usuário
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
    const resposta = await fetch(`${url}auth/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

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

/**
 * Realiza o cadastro do usuário
 * @param {nome} nome - nome do usuário
 * @param {email} email - email de login
 * @param {senha} senha
 * @returns {boolean} - true se cadastro for bem sucedido, senão false
 */
export async function register(nome, email, senha) {
    // Cria o objeto JSON com email e password
    const payload = {
        nome: nome,
        email: email,
        password: senha
    };

    // Faz a chamada na API enviando o objeto no corpo da requisição
    const resposta = await fetch(`${url}auth/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    // Retorna true se o status for 200, senão retorna false
    return resposta.status === 200;
}

/**
 * Realiza update do usuário
 * @param {object} user - objeto usuário
 * @returns {object} user - objeto usuário atualizado
 */
export async function updateUser(user) {
    // Faz a chamada na API enviando o objeto no corpo da requisição
    const resposta = await fetch(`${url}user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

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

/**
 * Realiza update do usuário
 * @param {object} email - email do usuário
 * @returns {boolean} - true se email disponível, senão false
 */
export async function isEmailAvailable(email) {
    try {
        const resposta = await fetch(`${url}user/${email}`, {
            method: 'GET'
        });
        // Retorna true se status 202 (disponível), false se 406 (já existe)
        return resposta.status === 202;
    } catch (error) {
        // Se houver erro de rede ou CORS, trate como indisponível
        return false;
    }
}