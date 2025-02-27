import {
  ApiPromise,
  WsProvider,
} from '@polkadot/api';
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from '@polkadot/extension-dapp';

async function connectToSubstrate() {
  // 1. Habilitar a extensão informando o nome da sua aplicação
  const extensions = await web3Enable('MeuAppSubstrate');
  if (extensions.length === 0) {
    console.error('Nenhuma extensão detectada. Por favor, instale a Polkadot.js Extension.');
    return;
  }

  // 2. Obter as contas disponíveis na extensão
  const accounts = await web3Accounts();
  if (accounts.length === 0) {
    console.error('Nenhuma conta encontrada na extensão.');
    return;
  }
  console.log('Contas encontradas:', accounts);

  // 3. Conectar a um nó Substrate (ex.: nó da Polkadot ou seu nó local)
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });
  console.log('Conectado ao nó Substrate com sucesso.');

  // 4. Configurar o signer para que transações possam ser assinadas pela carteira
  const account = accounts[0]; // Escolhe a primeira conta disponível (você pode permitir a seleção do usuário)
  const injector = await web3FromSource(account.meta.source);
  api.setSigner(injector.signer);

  console.log(`Utilizando a conta: ${account.address}`);

  return { api, account };
}

// Executa a função de conexão
connectToSubstrate()
  .then(() => {
    console.log('Conexão estabelecida. Pronto para interagir com a blockchain.');
  })
  .catch((error) => {
    console.error('Erro ao conectar com a blockchain:', error);
  });
