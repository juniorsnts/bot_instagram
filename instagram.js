const puppeter = require('puppeteer');

const BASE_URL = 'https://instagram.com/';

const INSTA = (nome) => `https://instagram.com/${nome}`;

const instagram = {
    browser: null,
    page: null,

    initialize: async () => { // metodo para abrir pagina de login

        // headless é o modo sem cabeça, com ele o chrome é aberto atras da path definida
        // substituir executablePath pelo diretorio do seu chrome, sem espaçoes no diretorio
        instagram.browser = await puppeter.launch({ headless: false, executablePath: 'D:/Application/chrome' });

        // abrindo uma pagina em branco
        instagram.page = await instagram.browser.newPage();

        // o goto abre a pagina que queremos, e waitUntil espera ela carregar completamente.
        await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    },

    login: async (username, password) => { // metodo para efetuar login

        await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

        // o $x nos permite localizar um queryselector passando como parametro o que queremos localizar no html
        let loginButton = await instagram.page.$x('//a[contains(text(), "Conecte-se")]');

        // aciona o botao conecte-se
        await loginButton[0].click();

        // waitFor é dado em milisecundos, utilizado para dar um tempo de espera para ir para a proxima instrução
        await instagram.page.waitFor(1000);

        //escrever usuario e senha
        await instagram.page.type('input[name=username]', username, { delay: 50 });
        await instagram.page.type('input[name=password]', password, { delay: 50 });

        loginButton = await instagram.page.$x('//div[contains(text(), "Entrar")]');

        await loginButton[0].click();

        await instagram.page.waitFor(4000);

        await instagram.page.waitFor('a > span[aria-label="Perfil"]'); // espera o perfil se carregado

    },
    
    // Recebe um array com nomes das pessoas
    curtirFotos: async (nomes = []) => {

        for (let nome of nomes) {
            
            await instagram.page.goto(INSTA(nome), { waitUntil: 'networkidle2' });
            
            // salvamos todas as fotos nessa variavel
            let fotos = await instagram.page.$$('article > div img[decoding="auto"]');

            await instagram.page.waitFor(3000);

            for (let i = 0; i < fotos.length; i++) {

                let foto = fotos[i];
                
                //Abre o modal de cada foto
                await foto.click();

                //Espera 1 segundo
                await instagram.page.waitFor(1000);

                //Salvamos o html de dar like
                let curtir = await instagram.page.$('span[aria-label="Curtir"][class="glyphsSpriteHeart__outline__24__grey_9 u-__7"]');
                
                // verificamos se o html estiver no modal da foto entao ele curte a foto
                if (curtir) {
                    await instagram.page.click('span[aria-label="Curtir"][class="glyphsSpriteHeart__outline__24__grey_9 u-__7"]');
                }

                //Depois espera 1 segundo
                await instagram.page.waitFor(2000);

                // e fecha o modal e continua o laço de repeticao
                let closeModalButton = await instagram.page.$x('//button[contains(text(), "Fechar")]')
                await closeModalButton[0].click();

            }
        }
    }
}

module.exports = instagram;
