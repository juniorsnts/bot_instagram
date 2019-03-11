const ig = require('./instagram');

(async () => {
    await ig.initialize(); // inicializar para abrir a pagina de login

    await ig.login('username', 'senha'); // substituir por seus dados de acesso no instagram

    await ig.curtirFotos(['junior.santosxp']); // array com nomes das pessoas que vc quer curtir. obs: colocar o nome de usuario

})()