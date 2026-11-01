// Gera data/readings.json com o texto completo (Almeida Corrigida Fiel, domínio público).
// Uso: node scripts/build-data.mjs caminho/para/acf.json
// Fonte: github.com/thiagobodruk/biblia (json/acf.json)
import fs from "node:fs";
const bible = JSON.parse(fs.readFileSync(process.argv[2] || "acf.json", "utf8").replace(/^\uFEFF/, ""));
const names = "Gênesis,Êxodo,Levítico,Números,Deuteronômio,Josué,Juízes,Rute,1 Samuel,2 Samuel,1 Reis,2 Reis,1 Crônicas,2 Crônicas,Esdras,Neemias,Ester,Jó,Salmo,Provérbios,Eclesiastes,Cantares,Isaías,Jeremias,Lamentações,Ezequiel,Daniel,Oséias,Joel,Amós,Obadias,Jonas,Miqueias,Naum,Habacuque,Sofonias,Ageu,Zacarias,Malaquias,Mateus,Marcos,Lucas,João,Atos,Romanos,1 Coríntios,2 Coríntios,Gálatas,Efésios,Filipenses,Colossenses,1 Tessalonicenses,2 Tessalonicenses,1 Timóteo,2 Timóteo,Tito,Filemom,Hebreus,Tiago,1 Pedro,2 Pedro,1 João,2 João,3 João,Judas,Apocalipse".split(",");
const RE = /^(?:(.+?) )?(\d+)(?::(\d+)(?:-(\d+))?)?$/;
function parse(label) {
  let last = "";
  return label.split(" e ").map((p) => {
    const [, b, c, f, t] = p.trim().match(RE);
    const book = b || last; last = book;
    const bi = names.indexOf(book);
    if (bi < 0) throw new Error("Livro desconhecido: " + book);
    const chap = bible[bi].chapters[+c - 1];
    const from = f ? +f : 1, to = t ? +t : f ? +f : chap.length;
    const v = []; for (let i = from; i <= to; i++) v.push([i, chap[i - 1].trim()]);
    return { t: `${book} ${c}${f ? ":" + f + (t ? "-" + t : "") : ""}`, v };
  });
}
const mk = (rows) => rows.map(([ref, focus]) => ({ ref, focus, parts: parse(ref) }));
const days = mk([
["Salmo 91","Refúgio em Deus"],["Efésios 6:10-18","Vestir a armadura de Deus"],["Salmo 121","Deus como guardião"],["Isaías 41:8-14","“Não temas, eu sou contigo”"],["Salmo 23","Confiar no Pastor"],["Salmo 27","Coragem diante do medo"],["Josué 1:1-9","Ser forte e corajoso"],
["Mateus 6:25-34","Largar a ansiedade, buscar primeiro o Reino"],["Filipenses 4:10-20","Contentamento e provisão"],["Provérbios 3:1-10","Confiar e honrar a Deus"],["Salmo 37:1-11","Entregar o caminho ao Senhor"],["Provérbios 10:1-5 e 22:29","Diligência e bênção no trabalho"],["Malaquias 3:6-12","Fidelidade e generosidade"],["Deuteronômio 8:1-18","Lembrar que tudo vem de Deus"],
["Filipenses 4:4-9","A paz que guarda coração e mente"],["Salmo 34","Deus perto dos quebrantados"],["Mateus 11:25-30","Descansar em Cristo"],["1 Pedro 5:5-11","Lançar sobre ele a ansiedade"],["Salmo 42","Esperança quando a alma está abatida"],["Salmo 62","Descansar somente em Deus"],["Romanos 8:18-39","Nada pode nos separar do amor de Deus"],
["Salmo 103","Não esquecer nenhum dos benefícios"],["Salmo 100","Entrar com ações de graças"],["1 Tessalonicenses 5:12-24","Gratidão em todas as circunstâncias"],["Salmo 136","A misericórdia que dura para sempre"],["Lamentações 3:19-26","Misericórdias renovadas a cada manhã"],["Salmo 116","Agradecer pelos livramentos"],["Colossenses 3:12-17","Viver com um coração grato"],
["João 15:1-11","Permanecer em Cristo como base de tudo"],["Números 6:22-27 e Salmo 150","Receber a bênção e louvar"],
]).map((d, i) => ({ n: i + 1, ...d }));
const lib = mk([
["Salmo 107:1-16","Deus quebra portas de bronze e cadeias"],["Isaías 61:1-3","Liberdade aos cativos, alegria no lugar do luto"],["Lucas 4:16-21","Jesus anuncia liberdade aos oprimidos"],["João 8:31-36","“Se o Filho vos libertar, sereis verdadeiramente livres”"],["Romanos 8:1-2","Nenhuma condenação para os que estão em Cristo"],["Gálatas 5:1","Permanecer firme na liberdade"],["Colossenses 2:13-15","Cristo cancelou a dívida e venceu na cruz"],["2 Coríntios 10:3-5","As armas espirituais e a destruição de fortalezas"],["Tiago 4:7-10","Submeter-se a Deus e resistir ao mal"],["1 João 4:1-4","Maior é aquele que está em vocês"],["Atos 16:25-34","Louvor que faz as correntes caírem"],["Salmo 40:1-3","Tirado do poço, com os pés firmados na rocha"],["Salmo 18:1-19","Livramento de quem é mais forte do que eu"],
]);
const pro = mk([
["Deuteronômio 8:11-18","É Deus quem dá o poder de adquirir riqueza"],["Isaías 45:1-3","Portas de bronze quebradas, tesouros revelados"],["Gênesis 26:12-14","Isaque semeou, colheu e prosperou"],["2 Reis 4:1-7","O azeite da viúva: de dívida para provisão"],["Salmo 112","A casa do que teme ao Senhor e age com generosidade"],["Provérbios 21:5 e 13:11","Planejamento e ganho constante"],["Provérbios 22:7 e Romanos 13:8","Sabedoria com dívidas"],["Lucas 14:28-30","Calcular o custo antes de construir"],["Mateus 25:14-30","Administrar bem o que foi confiado"],["Eclesiastes 11:1-6","Semear sem esperar condições perfeitas"],["Provérbios 11:24-25","Quem abençoa também é abençoado"],["Lucas 6:36-38","Dar e receber: a medida que usamos"],["2 Coríntios 9:6-11","Semear com alegria, Deus supre"],["3 João 1:2","Que tudo vá bem com você, e com sua saúde"],
]);
const rel = mk([
["Gênesis 2:18-24","Deus criou a pessoa para a companhia"],["Provérbios 17:17 e 18:24","Amigos que amam em todo tempo"],["Eclesiastes 4:9-12","Melhor dois do que um"],["Provérbios 27:17 e 13:20","Escolher bem as companhias"],["Provérbios 4:23","Guardar o coração"],["2 Coríntios 6:14","Cuidado com jugos desiguais"],["Romanos 12:9-18","Amor sem fingimento"],["1 Coríntios 13:1-13","O que é o amor de verdade"],["Efésios 4:25-32","Verdade, perdão e palavras que edificam"],["Tiago 1:19-20","Pronto para ouvir, tardio para falar"],["1 João 4:7-12","Amar porque Deus nos amou primeiro"],
]);
const ans = mk([
["Filipenses 4:6-7 e 4:19","Orar em vez de se afligir; Deus supre"],["1 Pedro 5:7","Lançar sobre Ele toda ansiedade"],["Salmo 55:22","Entregar o peso ao Senhor"],["Salmo 34:8-10","Nada falta aos que o temem"],["Salmo 37:23-25","O Senhor sustenta o justo"],["Hebreus 13:5-6","Contentamento: Deus nunca nos deixa"],["Provérbios 16:3","Entregar os planos ao Senhor"],["Salmo 46:1-3","Socorro bem presente na angústia"],["Isaías 41:10","Não temas, Eu te fortaleço"],["Mateus 6:19-21 e 6:31-33","Onde está o tesouro, está o coração"],["Salmo 127:1-2","Sem Deus o esforço é em vão; Ele dá descanso"],["2 Coríntios 12:9","A graça basta na fraqueza"],
]);
const cmp = mk([
["Gálatas 6:4-5","Examinar a própria obra, não a do outro"],["2 Coríntios 10:12","Não nos medimos pelos outros"],["Salmo 139:13-16","Feito de modo assombrosamente maravilhoso"],["João 21:20-22","“E a ti, que importa? Segue-me tu”"],["Provérbios 14:30","Um coração tranquilo dá vida; a inveja apodrece"],["Tiago 3:14-16","Inveja e ambição trazem desordem"],["Salmo 73:2-3 e 73:21-26","Invejar amargura a alma; Deus é a minha porção"],["1 Coríntios 12:14-26","Cada parte tem o seu valor"],["Efésios 2:10","Feitos por Deus para boas obras preparadas"],["Filipenses 4:11-13","Aprender o contentamento"],["Salmo 16:5-6","A minha herança é agradável"],["Mateus 20:1-16","Deus é generoso com todos"],
]);
fs.writeFileSync("data/readings.json", JSON.stringify({ versao: "Almeida Corrigida Fiel", days, extras: { lib, pro, rel, ans, cmp } }));
console.log(days.length, lib.length, pro.length);
