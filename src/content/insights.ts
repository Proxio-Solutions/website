/**
 * Articles for /insights, in both site languages. Bodies are simple blocks (paragraph,
 * subheading, list) so no Markdown parser ships to the browser. Add an article by adding an
 * entry here; the list, the article page and the reading time all follow from it.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export interface ArticleCopy {
  title: string;
  excerpt: string;
  tag: string;
  body: Block[];
}

export interface Article {
  slug: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  pt: ArticleCopy;
  en: ArticleCopy;
}

export const ARTICLES: Article[] = [
  {
    slug: 'porque-se-perdem-as-ocorrencias',
    date: '2026-11-11',
    pt: {
      tag: 'Autarquias',
      title: 'Porque é que as ocorrências se perdem numa junta de freguesia',
      excerpt:
        'Um buraco na estrada pode entrar por telefone, email, balcão e Facebook no mesmo dia. O problema raramente é falta de vontade: é não haver um sítio único onde o pedido vive.',
      body: [
        {
          type: 'p',
          text: 'Quem trabalha numa junta de freguesia conhece o cenário. Um munícipe liga a avisar de um candeeiro apagado, outro escreve um email sobre o mesmo candeeiro, um terceiro publica uma fotografia nas redes sociais. Alguém aponta num papel, alguém reencaminha o email, alguém responde ao comentário. Três semanas depois, ninguém sabe ao certo se o candeeiro foi reparado, nem quem ficou de tratar disso.',
        },
        {
          type: 'p',
          text: 'Não é um problema de pessoas. As equipas das juntas fazem muito com poucos meios. É um problema de sistema: cada canal guarda o pedido à sua maneira, e nenhum deles foi pensado para acompanhar o pedido até ao fim.',
        },
        { type: 'h2', text: 'Os quatro sítios onde um pedido se perde' },
        {
          type: 'ul',
          items: [
            'Na entrada: o pedido chega por um canal que não deixa registo partilhado, como uma chamada ou uma conversa ao balcão.',
            'Na duplicação: o mesmo problema chega por três vias e conta como três pedidos, ou é confundido com outro parecido.',
            'Na passagem de mão: entre o atendimento e a equipa de rua, o pedido muda de formato e perde detalhe, a localização exata ou a fotografia.',
            'No fecho: o trabalho é feito, mas ninguém avisa quem reportou. Para o munícipe, o pedido continua por resolver.',
          ],
        },
        { type: 'h2', text: 'O que muda quando o pedido tem uma casa' },
        {
          type: 'p',
          text: 'A solução não passa por fechar canais. As pessoas vão continuar a telefonar e a ir ao balcão, e ainda bem. Passa por garantir que, entre por onde entrar, o pedido acaba no mesmo registo, com quatro coisas que nunca se perdem:',
        },
        {
          type: 'ul',
          items: [
            'Uma referência única, que o munícipe e a junta usam para falar do mesmo pedido.',
            'Um local preciso, de preferência marcado num mapa e não descrito por palavras.',
            'Um responsável, para que "alguém vai ver isso" passe a ter nome.',
            'Um estado visível, de "submetida" a "concluída", que qualquer pessoa da equipa consegue consultar.',
          ],
        },
        {
          type: 'p',
          text: 'Com isto, os duplicados tornam-se fáceis de detetar (o mesmo assunto, no mesmo sítio, nos mesmos dias), a passagem para o terreno leva toda a informação, e o fecho deixa de depender da memória de alguém.',
        },
        { type: 'h2', text: 'Por onde começar' },
        {
          type: 'p',
          text: 'Mesmo sem software novo, há um passo que qualquer junta pode dar amanhã: escolher um único registo onde todos os pedidos são anotados, com referência e estado, e combinar que nenhum pedido fica fora dele. É exatamente esse princípio que está na base do Urbi, a plataforma que estamos a desenvolver para juntas de freguesia, mas o princípio vale por si.',
        },
      ],
    },
    en: {
      tag: 'Local government',
      title: 'Why reports get lost at a parish council',
      excerpt:
        'A pothole can arrive by phone, email, front desk and Facebook on the same day. The problem is rarely a lack of will: it is having no single place where the request lives.',
      body: [
        {
          type: 'p',
          text: 'Anyone who works at a parish council knows the scene. One resident calls about a street lamp that is out, another emails about the same lamp, a third posts a photo on social media. Someone jots it down on paper, someone forwards the email, someone replies to the comment. Three weeks later, nobody is quite sure whether the lamp was fixed, or who was meant to handle it.',
        },
        {
          type: 'p',
          text: 'This is not a people problem. Council teams do a lot with very little. It is a system problem: each channel stores the request its own way, and none of them was designed to follow it through to the end.',
        },
        { type: 'h2', text: 'The four places a request gets lost' },
        {
          type: 'ul',
          items: [
            'At the door: the request arrives through a channel that leaves no shared record, like a phone call or a chat at the front desk.',
            'In duplicates: the same problem arrives three ways and counts as three requests, or gets mixed up with a similar one.',
            'In the handover: between the front office and the field team, the request changes format and loses detail, the exact location or the photo.',
            'At closing: the work gets done, but nobody tells the person who reported it. For the resident, it is still unresolved.',
          ],
        },
        { type: 'h2', text: 'What changes when the request has a home' },
        {
          type: 'p',
          text: 'The answer is not to close channels. People will keep calling and walking in, and that is a good thing. It is to make sure that, whichever way it comes in, the request ends up in the same record, with four things that never get lost:',
        },
        {
          type: 'ul',
          items: [
            'A unique reference that the resident and the council both use to talk about the same request.',
            'A precise location, ideally pinned on a map rather than described in words.',
            'An owner, so that "someone will look into it" has a name.',
            'A visible status, from "submitted" to "resolved", that anyone on the team can check.',
          ],
        },
        {
          type: 'p',
          text: 'With that in place, duplicates become easy to spot (same subject, same place, same days), the handover to the field carries all the information, and closing a request no longer depends on someone remembering.',
        },
        { type: 'h2', text: 'Where to start' },
        {
          type: 'p',
          text: 'Even without new software, there is a step any council can take tomorrow: pick one single record where every request is logged, with a reference and a status, and agree that no request stays outside it. That is exactly the principle behind Urbi, the platform we are building for parish councils, but the principle stands on its own.',
        },
      ],
    },
  },
  {
    slug: 'avisar-antes-de-perguntarem',
    date: '2026-11-11',
    pt: {
      tag: 'Autarquias',
      title: 'Avisar o munícipe antes de ele perguntar',
      excerpt:
        'Muitos dos contactos que chegam a uma junta são pessoas a perguntar como está um pedido que já fizeram. A melhor forma de os reduzir é responder antes.',
      body: [
        {
          type: 'p',
          text: 'Quando alguém reporta um problema na rua, a pergunta seguinte é sempre a mesma: "e então?". Sem resposta, a pessoa volta a ligar, volta a escrever, ou desiste e conclui que não vale a pena reportar. Nenhum destes desfechos é bom para a junta.',
        },
        {
          type: 'p',
          text: 'O curioso é que, muitas vezes, o trabalho até foi feito. O que faltou foi fechar o ciclo: dizer a quem reportou que o pedido foi visto, que está a ser tratado e que ficou resolvido.',
        },
        { type: 'h2', text: 'Poucos estados, bem escolhidos' },
        {
          type: 'p',
          text: 'Não é preciso um relatório detalhado. Basta que cada pedido passe por um pequeno número de estados que façam sentido para quem está de fora, e que cada mudança gere um aviso automático. No Urbi usamos quatro:',
        },
        {
          type: 'ul',
          items: [
            'Submetida: o pedido entrou e tem uma referência.',
            'Em análise: alguém da junta já o viu e está a decidir o que fazer.',
            'Em curso: há uma equipa ou um responsável a tratar.',
            'Concluída: o problema foi resolvido, de preferência com uma fotografia como prova.',
          ],
        },
        {
          type: 'p',
          text: 'Quatro mensagens curtas valem mais do que uma resposta longa três semanas depois. E têm um efeito secundário importante: a equipa deixa de gastar tempo a responder a "como está o meu pedido?".',
        },
        { type: 'h2', text: 'A prova de que ficou feito' },
        {
          type: 'p',
          text: 'Uma fotografia do antes e do depois diz mais do que qualquer texto. Quando a equipa de rua fecha um pedido com uma fotografia, o munícipe vê o resultado sem ter de ir ao local, e a junta fica com um histórico do trabalho feito que pode usar mais tarde, por exemplo para mostrar o que foi resolvido num mês.',
        },
        { type: 'h2', text: 'Também quando a resposta é "não"' },
        {
          type: 'p',
          text: 'Nem todos os pedidos são da responsabilidade da junta, e nem todos têm solução imediata. Avisar também conta nesses casos: explicar que o assunto foi encaminhado para a câmara municipal, ou que fica agendado para uma intervenção maior, é muito melhor do que o silêncio. A transparência não é só mostrar o que correu bem.',
        },
      ],
    },
    en: {
      tag: 'Local government',
      title: 'Tell residents before they have to ask',
      excerpt:
        'Many of the contacts that reach a parish council are people asking how a request they already made is going. The best way to cut that down is to answer first.',
      body: [
        {
          type: 'p',
          text: 'When someone reports a problem on their street, the next question is always the same: "so what happened?". Without an answer, they call again, write again, or give up and decide reporting is not worth it. None of those outcomes is good for the council.',
        },
        {
          type: 'p',
          text: 'The odd thing is that, more often than not, the work actually got done. What was missing was closing the loop: telling the person who reported it that the request was seen, that it is being handled, and that it is resolved.',
        },
        { type: 'h2', text: 'A few statuses, well chosen' },
        {
          type: 'p',
          text: 'There is no need for a detailed report. Each request just needs to move through a small number of statuses that make sense to an outsider, with every change sending an automatic update. In Urbi we use four:',
        },
        {
          type: 'ul',
          items: [
            'Submitted: the request is in and has a reference.',
            'Under review: someone at the council has seen it and is deciding what to do.',
            'In progress: a team or a named person is on it.',
            'Resolved: the problem is fixed, ideally with a photo as proof.',
          ],
        },
        {
          type: 'p',
          text: 'Four short messages are worth more than one long reply three weeks later. And they have an important side effect: the team stops spending time answering "what is happening with my request?".',
        },
        { type: 'h2', text: 'Proof that it is done' },
        {
          type: 'p',
          text: 'A before-and-after photo says more than any text. When the field team closes a request with a photo, the resident sees the result without going back to the spot, and the council builds a history of the work done that it can use later, for instance to show what was resolved in a month.',
        },
        { type: 'h2', text: 'Even when the answer is "no"' },
        {
          type: 'p',
          text: 'Not every request is the parish council’s responsibility, and not every one has an immediate fix. Keeping people informed matters in those cases too: explaining that the matter was passed on to the municipality, or scheduled for larger works, is far better than silence. Transparency is not only about showing what went well.',
        },
      ],
    },
  },
  {
    slug: 'software-a-medida-por-onde-comecar',
    date: '2026-11-11',
    pt: {
      tag: 'Produto',
      title: 'Software à medida: o que pensar antes de pedir um orçamento',
      excerpt:
        'Um bom projeto começa antes da primeira linha de código. Cinco perguntas que ajudam a chegar a uma conversa útil, e a um orçamento que faz sentido.',
      body: [
        {
          type: 'p',
          text: 'Pedir um orçamento para uma aplicação é um pouco como pedir o preço de uma casa: depende de quase tudo. Quanto mais clara for a ideia à partida, mais útil é a primeira conversa e mais realista é a estimativa. Estas são as perguntas que fazemos sempre no início de um projeto.',
        },
        { type: 'h2', text: '1. Que problema resolve, e para quem?' },
        {
          type: 'p',
          text: 'Antes das funcionalidades, o problema. "Queremos uma app" não é um ponto de partida; "os nossos clientes perdem tempo a marcar por telefone" já é. Saber quem vai usar o produto, e em que momento do dia, muda decisões tão básicas como se deve ser uma app mobile ou uma aplicação web.',
        },
        { type: 'h2', text: '2. O que tem de existir no primeiro dia?' },
        {
          type: 'p',
          text: 'Quase todas as ideias têm um núcleo indispensável e uma longa lista de "seria bom ter". Separar as duas coisas é a forma mais eficaz de reduzir prazo e custo, e de pôr o produto nas mãos de pessoas reais mais cedo. O resto vem a seguir, já com o que se aprendeu com o uso.',
        },
        { type: 'h2', text: '3. Com o que é que tem de falar?' },
        {
          type: 'p',
          text: 'Integrações com sistemas que já existem, como faturação, ERP, pagamentos ou autenticação, são muitas vezes a parte menos visível e a mais trabalhosa de um projeto. Identificá-las cedo evita surpresas a meio.',
        },
        { type: 'h2', text: '4. Quem vai gerir o conteúdo e os dados?' },
        {
          type: 'p',
          text: 'Se alguém da equipa vai precisar de editar textos, aprovar pedidos ou consultar relatórios, isso é um produto à parte: um painel de gestão. Vale a pena pensar nele desde o início, em vez de o descobrir quando o site já está no ar.',
        },
        { type: 'h2', text: '5. Que prazo e que orçamento são realistas?' },
        {
          type: 'p',
          text: 'Não é preciso ter números exatos, mas uma ordem de grandeza ajuda a desenhar a solução certa. Com o mesmo problema, um orçamento curto pede uma primeira versão focada; um prazo apertado pede menos funcionalidades, não menos qualidade.',
        },
        {
          type: 'p',
          text: 'Foi a pensar nestas perguntas que montámos o formulário da nossa página de contactos: em poucos passos ficas com uma ideia da duração do projeto, e nós ficamos com o que precisamos para te dar uma resposta concreta.',
        },
      ],
    },
    en: {
      tag: 'Product',
      title: 'Custom software: what to think about before asking for a quote',
      excerpt:
        'A good project starts before the first line of code. Five questions that lead to a useful conversation, and to a quote that makes sense.',
      body: [
        {
          type: 'p',
          text: 'Asking for a quote for an app is a bit like asking the price of a house: it depends on almost everything. The clearer the idea at the start, the more useful the first conversation and the more realistic the estimate. These are the questions we always ask at the start of a project.',
        },
        { type: 'h2', text: '1. What problem does it solve, and for whom?' },
        {
          type: 'p',
          text: 'Before the features, the problem. "We want an app" is not a starting point; "our customers waste time booking by phone" is. Knowing who will use the product, and at what moment of their day, changes decisions as basic as whether it should be a mobile app or a web application.',
        },
        { type: 'h2', text: '2. What must exist on day one?' },
        {
          type: 'p',
          text: 'Almost every idea has an essential core and a long list of nice-to-haves. Separating the two is the most effective way to cut time and cost, and to get the product into real people’s hands sooner. The rest comes next, informed by how people actually use it.',
        },
        { type: 'h2', text: '3. What does it need to talk to?' },
        {
          type: 'p',
          text: 'Integrations with systems that already exist, such as invoicing, ERP, payments or sign-in, are often the least visible and most demanding part of a project. Spotting them early avoids surprises halfway through.',
        },
        { type: 'h2', text: '4. Who will manage the content and the data?' },
        {
          type: 'p',
          text: 'If someone on your team will need to edit text, approve requests or check reports, that is a product of its own: an admin panel. It is worth planning for from the start, rather than discovering it once the site is live.',
        },
        { type: 'h2', text: '5. What timeline and budget are realistic?' },
        {
          type: 'p',
          text: 'Exact figures are not needed, but an order of magnitude helps shape the right solution. For the same problem, a tight budget calls for a focused first version; a tight deadline calls for fewer features, not lower quality.',
        },
        {
          type: 'p',
          text: 'We built the form on our contact page around these questions: in a few steps you get a sense of how long the project might take, and we get what we need to give you a concrete answer.',
        },
      ],
    },
  },
];

/** Reading time at ~200 words a minute. */
export function readingMinutes(copy: ArticleCopy): number {
  const words = [
    copy.title,
    copy.excerpt,
    ...copy.body.flatMap((block) => (block.type === 'ul' ? block.items : [block.text])),
  ]
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getArticle(slug: string | undefined): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}
