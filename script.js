const players = ["邊荷律", "李丹妃", "金渡兒", "JJUBI", "李雅英", "李珠珢", "南珉貞", "廉世彬", "禹洙漢", "河智媛", "安芝儇", "Mingo", "趙娟週", "文慧真", "安惠志", "李多慧", "金娜妍", "權喜原", "李素泳", "朴恩惠", "金世星", "金佳垠", "朴昭映", "朴星垠", "高佳彬", "金吉娜", "吳瑞律", "金裕娜", "李晧禎", "睦那京", "李素敏", "崔洪邏", "朴淡備", "徐賢淑", "金賢姈", "海莉", "鄭熙靜", "李藝斌", "金海莉"];

let scores = {}; let history = {}; let currentMatch = []; let round = 1; const totalRounds = 6;
let matchesPlayed = 0;

function init() {
    scores = {}; history = {};
    players.forEach(p => { scores[p] = 0; history[p] = []; });
    nextMatch();
}

function nextMatch() {
    const groups = {};
    players.forEach(p => {
        const key = scores[p];
        if (!groups[key]) groups[key] = [];
        groups[key].push(p);
    });
    let found = false;
    Object.keys(groups).sort((a,b)=>b-a).forEach(score => {  // 高分組優先
        let group = groups[score];
        if (group.length >= 2) {
            shuffle(group);
            let p1 = group.pop(), p2 = group.pop();
            currentMatch = [p1, p2];
            document.getElementById('player1').textContent = p1;
            document.getElementById('player2').textContent = p2;
            document.getElementById('round').textContent = round;
            found = true;
            return;
        }
    });
    if (!found && round < totalRounds) {
        round++;
        nextMatch();
        return;
    }
    if (!found) showResults();
}

function choosePlayer(choice) {
    const winner = currentMatch[choice - 1];
    const loser = currentMatch[1 - (choice - 1)];
    scores[winner]++;
    history[winner].push(loser);
    history[loser].push(winner);
    document.getElementById('choose1').disabled = true;
    document.getElementById('choose2').disabled = true;
    setTimeout(() => {
        document.getElementById('choose1').disabled = false;
        document.getElementById('choose2').disabled = false;
        nextMatch();
    }, 1000);
}

function showResults() {
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('progress').style.display = 'none';
    const ranked = rankPlayers();
    const top3 = document.getElementById('top3');
    const top10 = document.getElementById('top10');
    top3.innerHTML = '';
    ranked.slice(0,3).forEach((p, i) => {
        const li = document.createElement('li');
        li.textContent = `${i+1}. ${p} (${scores[p]}勝)`;
        top3.appendChild(li);
    });
    top10.innerHTML = '';
    ranked.slice(0,10).forEach((p, i) => {
        const li = document.createElement('li');
        li.textContent = `${i+1}. ${p} (${scores[p]}勝)`;
        top10.appendChild(li);
    });
    document.getElementById('results').style.display = 'block';
    document.getElementById('restart').style.display = 'block';
}

function rankPlayers() {
    return players.slice().sort((a, b) => {
        if (scores[a] !== scores[b]) return scores[b] - scores[a];
        const buchholzA = history[a].reduce((sum, opp) => sum + scores[opp], 0);
        const buchholzB = history[b].reduce((sum, opp) => sum + scores[opp], 0);
        return buchholzB - buchholzA;
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function restart() {
    document.getElementById('game-area').style.display = 'block';
    document.getElementById('progress').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    round = 1;
    init();
}

init();
