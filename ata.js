

var board = {
    whos_turn: 0,// 0 or 1
    prepared: 0,
    last_update : -1,
    sleep :2,
    decks: [[], []],
};


var PCs = {
    "FAL":{
    "name": "Food Addict Leela",
    "original_atk": 27,
    "original_hp": 98,
    "motivate": 15,
    "crippleall": 10,
    "shieldall": 10,
    }
};

var HConsuela = {
    "name": "Consuela",
    "original_atk": 0,
    "original_hp": 97,
    "healall": 4,
    "crippleall": 3,
}

var HLeela = {
    "name": "Leela",
    "original_atk": 0,
    "original_hp": 95,
    "shield": 5,
    "cheerall": 4,
};

var items = {
    "Monkey": {
        "name": "Monkey",
        "original_atk": 20,
        "original_hp": 35,
        "sturdy": 11,
        "leech": 13,
    },
    "Hank": {
        "name": "Hank",
        "original_atk": 15,
        "original_hp": 36,
    },
    "Peggy": {
        "name": "Peggy",
        "original_atk": 13,
        "original_hp": 53,
        "healall": 3,
        "payback": 8,
        "gas": 10,
    },
    "Hypnotoad": {
        "name": "Hypnotoad",
        "original_atk": 14,
        "original_hp": 65,
        "heal": 14,
        "hijack": 6,
        "cripple": 10,
    },
    "MPeggy20": {
        "name": "MPeggy20",
        "original_atk": 18,
        "original_hp": 70,
        "payback": 16,
        "healall": 8,
        "gas": 17,
    }
}

var combos = {
    "Monkey+Peggy": {
        "name": "Ciggy",
        "original_atk": 32,
        "original_hp": 92,
        "leech": 37,
        "gas": 37,
        "craze": 21,
    },
    "Peggy+Monkey": {
        "name": "Ciggy",
        "original_atk": 32,
        "original_hp": 92,
        "leech": 37,
        "gas": 37,
        "craze": 21,
    },
    "Hypnotoad+Hank": {
        "name": "Ciggy",
        "original_atk": 26,
        "original_hp": 92,
        "leech": 32,
        "gas": 32,
        "craze": 18,
    },
    "Monkey+Hank":{
        "name": "Ciggy",
        "original_atk": 34,
        "original_hp": 74,
        "leech": 35,
        "gas":35,
        "craze":17,
    },
    "Hypnotoad+Peggy":{
        "name": "Ciggy",
        "original_atk": 24,
        "original_hp": 109,
        "leech": 35,
        "gas":35,
        "craze":20,
    },
    "Hypnotoad+MPeggy20":{
        "name": "Ciggy",
        "original_atk": 29,
        "original_hp": 127,
        "leech": 42,
        "gas":42,
        "crazed":23,
    }
}

var find_slot = (who, position)=>{
    let found = -1;
    for (let i = 0; i < board.decks[who].length; i++){
        if (board.decks[who][i]["pos"] == position){
            found = i;
            break;
        }
    }
    return found;
};

var motivate = (who, position, val, where)=>{
    let opp_slot = find_slot(1 - who, position);
    let tar_slot = find_slot(who, position);
    let tar_card = board.decks[who][tar_slot];
    if (opp_slot >= 0){
        let opp_card = board.decks[1 - who][opp_slot];
        if ("hijack" in opp_card){
            let hijacked = Math.min(val, get_val(opp_card, "hijack"));
            opp_card["hijacked_from_" + where] = hijacked;
            tar_card["motivated_from_" + where] = val - hijacked;
            tar_card["atk"] += (val - hijacked);
        }
        else{
            tar_card["motivated_from_" + where] = val;
            tar_card["atk"] += (val);
        }
    }
    else{
        tar_card["motivated_from_" + where] = val;
        tar_card["atk"] += (val);
    }
};

var cripple = (card, val)=>{
    if (!("crippled" in card)) card["crippled"] = 0;
    card["crippled"] += val;
    if (card["crippled"] > card["atk"]){
        card["crippled"] = card["atk"];
    }
};

var shield = (card, val)=>{
    console.log(card);
    console.log("SHIELD0", val, card["shielded"]);
    if (!("shielded" in card)) card["shielded"] = 0;
    console.log("SHIELD", val, card["shielded"]);
    card["shielded"] += val;
};

var print_card = (cd, color)=>{
    cd["displayed_atk"] = cd["atk"] - get_val(cd, "crippled") + get_val(cd, "hijacked_from_left") + get_val(cd, "hijacked_from_right") + get_val(cd, "hijacked_from_craze") + get_val(cd, "hijacked_from_cheer");
    let output = `<table style='border:1px black solid;' bgcolor='${color}'>`;
    let skillset = ["motivate", "shield", "crippleall", "shieldall", "cheerall", "cheer", "leech", "gas", "craze", "sturdy", "payback", "hijack"];
    let effectset = ["gassed", "crippled", "motivated_from_left", "motivated_from_right", "shielded", "gased", "crazed", "hijacked_from_left", "hijacked_from_right", "hijacked_from_craze", "hijacked_from_cheer"];
    output += ("<tr ><td style='border:1px black solid;'>" + (`<span style="width:30px;height:15px">Name</span></td><td> ${cd["name"]}`) + "</td></tr>");
    for (let x in cd){
        if (skillset.includes(x)){
            output += ("<tr ><td style='border:1px black solid;'>" + (`<img style="width:16px;height:15px" src="img/skill_${x}.png" alt="${x}"></img></td><td> ${cd[x]}`) + "</td></tr>");
        }
        else if (["hp", "displayed_atk"].includes(x)){
            if (cd["pos"] == 0){
                if (x == "displayed_atk")
                    continue;
            }
            let old_val = get_val(cd, "old_"+x);
            let changes = cd[x]-old_val;
            if (color != "white"){
            if (changes > 0.1){
                output += ("<tr ><td style='border:1px black solid;'>" + (`<img style="width:16px;height:15px" src="img/skill_${x}.png" alt="${x}"></img></td><td> ${cd[x]}=${old_val}<span style="color:green">+${changes}</span>`) + "</td></tr>");
            }
            else if (changes < -0.1){
                output += ("<tr ><td style='border:1px black solid;'>" + (`<img style="width:16px;height:15px" src="img/skill_${x}.png" alt="${x}"></img></td><td> ${cd[x]}=${old_val}<span style="color:red">${changes}</span>`) + "</td></tr>");
            }
            else{
                output += ("<tr ><td style='border:1px black solid;'>" + (`<img style="width:16px;height:15px" src="img/skill_${x}.png" alt="${x}"></img></td><td> ${old_val}<span style="color:yellow">-</span>`) + "</td></tr>");
            }
            }
            else{
                output += ("<tr ><td style='border:1px black solid;'>" + (`<img style="width:16px;height:15px" src="img/skill_${x}.png" alt="${x}"></img></td><td> ${cd[x]}</span>`) + "</td></tr>");
            }
        }
    }
    if (cd["pos"] == 0) return output + "</table>";
    output += "<tr><td>Status</td></tr>";
    for (let x in cd){
        if ((cd[x] > -0.1) && (cd[x] < 0.1)) continue;
        if (x.includes("motivated_from") || x.includes("hijacked_from"))
            output += ("<tr ><td style='border:1px black solid;'>" + (`<img style="width:32px;height:15px" src="img/effect_${x}.png" alt="${x}"></img></td><td> ${cd[x]}`) + "</td></tr>");
        else if (effectset.includes(x)){
            output += ("<tr ><td style='border:1px black solid;'>" + (`<img style="width:16px;height:15px" src="img/effect_${x}.png" alt="${x}"></img></td><td> ${cd[x]}`) + "</td></tr>");
        }
    }
    output += "</table>";
    return output;
}

var get_val = (cd, key)=>{
    if (key in cd) return cd[key];
    else return 0;
};

var kill = (who, pos)=>{
    let left_slot = find_slot(who, pos-1);
    if (left_slot != -1){
        let left_card = board.decks[who][left_slot];
        if ("motivated_from_right" in left_card) {
            left_card["motivated_from_right"] = 0;
            let opp_slot = find_slot(1-who, pos - 1);
            if (opp_slot != -1)
                board.decks[1-who][opp_slot]["hijacked_from_right"] = 0;
        }
    }
    let right_slot = find_slot(who, pos+1);
    if (right_slot != -1){
        let right_card = board.decks[who][right_slot];
        if ("motivated_from_left" in right_card) {
            right_card["motivated_from_left"] = 0;
            let opp_slot = find_slot(1-who, pos + 1);
            if (opp_slot != -1)
                board.decks[1-who][opp_slot]["hijacked_from_left"] = 0;
        }
    }
    let slot = find_slot(who, pos);
    board.decks[who][slot]["hp"] = 0;
}

var payback = (who, val, pos) => {
    let slot = find_slot(who, pos);
    let card = board.decks[who][slot];
    if (!("shielded" in card)) card["shielded"] = 0;
    let shielded = get_val(card, "shielded");
    if (val > shielded){
        if ("shielded" in card) card["shielded"] = 0;
        val -= shielded;
        if (card["hp"] < val+0.1){
            kill(who, pos);
            val -= card["hp"];
            board.decks[who][0]["hp"] -= val;
        }
        else{
            card["hp"] -= val;
        }
    }
    else{
        card["shielded"] -= val;
    }
    return payback;
};

var physical = (who, val, pos) => {
    let slot = find_slot(who, pos);
    let payback = 0;
    if (slot === -1){
        board.decks[who][0]["hp"] -= val;
    }
    else{
        let card = board.decks[who][slot];
        payback = get_val(card, "payback");
        let sturdy = get_val(card, "sturdy");
        val -= sturdy;
        if (val < 0.1) return;
        let shielded = get_val(card, "shielded");
        if (!("shielded" in card)) card["shielded"] = 0;
        if (val > shielded){
            if ("shielded" in card) card["shielded"] = 0;
            val -= shielded;
            if (card["hp"] < val+0.1){
                kill(who, pos);
                val -= card["hp"];
                board.decks[who][0]["hp"] -= val;
            }
            else{
                card["hp"] -= val;
            }
        }
        else{
            console.log("YYY",val);
            card["shielded"] -= val;
        }
    }
    return payback;
};

var leech = (who, val, pos) => {
    let opp_slot = find_slot(1-who, pos);
    if (opp_slot < 0) return;
    if (board.decks[1-who][opp_slot]["hp"] < 0.1) return;

    let slot = find_slot(who, pos);
    board.decks[who][slot]["hp"] += val;
    board.decks[who][slot]["hp"] = Math.min(board.decks[who][slot]["hp"], board.decks[who][slot]["original_hp"]);
};

var gas = (who, val, pos) => {
    let opp_slot = find_slot(who, pos);
    if (opp_slot < 0) return;
    if (board.decks[who][opp_slot]["hp"] < 0.1) return;
    let opp_card = board.decks[who][opp_slot];
    opp_card["gased"] = Math.max(val, get_val(opp_card, "gased"));
};


var animate = (who, pos, start, color) =>{
    let slot = find_slot(who, pos);
    if (slot == -1) return;
    let this_card = board.decks[who][slot];

    setTimeout(()=>{
        document.getElementById(`slot-${who}-${pos}`).innerHTML = print_card(this_card, color);
    }, start);
};

var check_through = (who, atk, pos) =>{
    let slot = find_slot(who, pos);
    if (slot == -1) return false;
    let cd = board.decks[who][slot];
    let barrier = get_val(cd, "shielded") + get_val(cd, "sturdy");
    return atk > 0.1 + barrier;
};

var place = (card, position, sleep = 1, animation_interval = 1000) => {
    let found = find_slot(board.whos_turn, position);
    let animation_time = 0.0;
    if (found === -1){
        let card_copy = Object.assign({}, card);
        let this_slot = board.decks[board.whos_turn].length;
        board.decks[board.whos_turn].push(card_copy);
        let this_card = board.decks[board.whos_turn][this_slot];
        this_card["pos"] = position;
        this_card["sleep"] = sleep;
        this_card["atk"] = this_card["original_atk"];
        this_card["hp"] = this_card["original_hp"];
        this_card["displayed_atk"] = this_card["atk"];
        this_card["shielded"] = 0;
        let left_slot = find_slot(board.whos_turn, position - 1);
        if (left_slot >= 0) {
            let left_card = board.decks[board.whos_turn][left_slot];
            if ("motivate" in card){
                motivate(board.whos_turn, position - 1, card["motivate"], "right");
            }
            if ("motivate" in left_card){
                motivate(board.whos_turn, position, left_card["motivate"], "left");
            }
        }
        animate(board.whos_turn, position, animation_time, "orange");
        animation_time += animation_interval;
        animate(board.whos_turn, position, animation_time, "white");

    }
    else{
        let old_card = board.decks[board.whos_turn][found];
        let atk_change = old_card["atk"] - old_card["original_atk"];
        let hp_change = old_card["hp"] - old_card["original_hp"];
        let new_card = {};
        for (let x in old_card) {
            if (!(x in items[old_card["name"]])){
                new_card[x] = old_card[x];
            }
        }
        for (let x in combos[old_card["name"]+"+"+card["name"]]){
            new_card[x] = combos[old_card["name"]+"+"+card["name"]][x];
        }
        for (let x in old_card) delete old_card[x];
        for (let x in new_card) old_card[x] = new_card[x];
        old_card["atk"] = old_card["original_atk"] + atk_change;
        old_card["hp"] = old_card["original_hp"] + hp_change;
        old_card["sleep"] = 0;
        animate(board.whos_turn, position, animation_time, "orange");
        animation_time += animation_interval;
        animate(board.whos_turn, position, animation_time, "white");
    }
    board.decks[board.whos_turn].sort((k)=>{return k["pos"]});



    for (let cd of board.decks[1-board.whos_turn]){
        if ("crippled" in cd) cd["crippled"] = 0;
        animate(1-board.whos_turn, cd["pos"], animation_time, "white");
        cd["atk"] -= get_val(cd, "hijacked_from_cheer");
        cd["hijacked_from_cheer"] = 0;
    }
    for (let cd of board.decks[board.whos_turn]){
        if ("shielded" in cd) cd["shielded"] = 0;
        cd["old_hp"] = cd["hp"];
        cd["old_displayed_atk"] = cd["displayed_atk"];
        cd["atk"] -= get_val(cd, "motivated_from_cheer");
        cd["motivated_from_cheer"] = 0;
        animate(board.whos_turn, cd["pos"], animation_time, "white");
    }
    for (let cd of board.decks[board.whos_turn]){
        if (cd["sleep"] > 0.1) {
            cd["sleep"] -= 1;
            continue;
        }
        if ("crippleall" in cd){
            for (let ocd of board.decks[1- board.whos_turn]){
                cripple(ocd, cd["crippleall"]);
            }
        }
        if ("shieldall" in cd){
            for (let ocd of board.decks[board.whos_turn]){
                if (ocd["pos"] != cd["pos"])
                    shield(ocd, cd["shieldall"]);
            }
        }
        if ("cheerall" in cd){
            for (let ocd of board.decks[board.whos_turn]){
                if ((ocd["pos"] > cd["pos"]) && (ocd["sleep"] < 0.1))
                    motivate(board.whos_turn, ocd["pos"], cd["cheerall"], "cheer");
            }
        }
        
        if ("shield" in cd){
            let candid = [];
            for (let ocd of board.decks[board.whos_turn]){
                if ((ocd["pos"] > cd["pos"]) && (ocd["hp"]>0.1))
                    candid.push(ocd);
            }
            if (candid.length > 0)
                shield(candid[Math.floor(Math.random() * candid.length)], cd["shield"]); 
        }


        let atk = cd["atk"] - get_val(cd, "crippled") + get_val(cd, "hijacked_from_left") + get_val(cd, "hijacked_from_right") + get_val(cd, "hijacked_from_craze") + get_val(cd, "hijacked_from_cheer");
        if (cd["pos"]>0.1){
            if (check_through(1-board.whos_turn, atk, cd["pos"])){
                if ("gas" in cd){
                    gas(1-board.whos_turn, cd["gas"], cd["pos"]);
                }
                if ("leech" in cd){
                    leech(board.whos_turn, cd["leech"], cd["pos"]);
                }
                if ("craze" in cd){
                    motivate(board.whos_turn, cd["pos"], cd["craze"], "craze");
                }
            }
            let payb = physical(1-board.whos_turn, atk, cd["pos"]);
            if (payb != undefined)
                payback(board.whos_turn, payb, cd["pos"]);
            animate(1-board.whos_turn, cd["pos"], animation_time, "pink");
            animate(board.whos_turn, cd["pos"], animation_time, "pink");
            animation_time += animation_interval;
            cd["hijacked_from_cheer"] = 0;
            cd["hijacked_from_craze"] = 0;
            animate(1-board.whos_turn, cd["pos"], animation_time, "white");
            animate(board.whos_turn, cd["pos"], animation_time, "white");
        }
    }

    for (let cd of board.decks[board.whos_turn]){
        cd["hp"] -= get_val(cd, "gased");
    }
    let new_deck = [];
    for (let cd of board.decks[1-board.whos_turn]){
        if (cd["hp"] > 0.1) new_deck.push(cd);
    }
    board.decks[1-board.whos_turn] = new_deck;
    new_deck = []
    for (let cd of board.decks[board.whos_turn]){
        if (cd["hp"] > 0.1) new_deck.push(cd);
    }
    board.decks[board.whos_turn] = new_deck;


    board.whos_turn = 1 - board.whos_turn;
    let output = "<table>";
    for (let i in [0, 1]){
        output += "<tr>";
        for (let j = 0; j < 26; j++) {
            let slot = find_slot(i, j);
            if (slot == -1) output += `<td><div id="slot-${i}-${j}"></div></td>`;
            else {
                let div_html = print_card(board.decks[i][slot], "white");
                output += `<td><div id='slot-${i}-${j}'>${div_html}</div></td>`;
            }
        }
        output += "</tr>";
    }
    output += "</table>";
    //animation_time -= animation_interval;
    setTimeout( ()=>{document.getElementById("div-display").innerHTML = output;}, animation_time);
    animation_time += animation_interval;
    let hero_slot = find_slot(board.whos_turn, 0);
    if ((hero_slot == -1)&&(board.prepared)) {
        vex.dialog.alert({message: `Player #${1-board.whos_turn} wins!`});
        board.prepared = -1;
        return -1;
    }
    return animation_time;
};

var reprom = (value) => {
    setTimeout( ()=>{
    vex.dialog.alert({
        message: "Invalid input",
        callback: ()=>{
            setTimeout(()=>{prom(value);}, 100);
        }
    });}, 100
    )
};



var prom = (old_val) => {
    vex.dialog.prompt({
        message: `What card to place for Player #${board.whos_turn}? and which slot? (Format: card-slot)`,
        placeholder: old_val,
        callback: function (value) {
            if (value === false){
                reprom(value);
                return;
            }
            if (!value.includes("-")){
                reprom(value);
                return;
            }
            let pr = value.split("-");
            if (pr.length != 2){
                reprom(value);
                return;
            }
            let name = pr[0];
            let pos = parseInt(pr[1]);
            if (pos == NaN){
                reprom(value);
                return;
            }
            document.getElementById("log").innerHTML += `<span>What card to place for Player #${board.whos_turn}?  --${pr[0]} at ${pr[1]}.</span><br>`;
            used = {}
            for (let i = 0; i < 26; i++){
                used[i] = false;
            }
            let comboq = false;
            for (let cd of board.decks[board.whos_turn]){
                used[cd["pos"]] = true;
                if (cd["pos"] == pos){
                    if ((!(name in items)) || (!(cd["name"]+"+"+name)in combos)){
                        reprom(value);
                        return;
                    }
                    comboq = true;
                }
            }
            let smallest = 25;
            for (let i = 0; i < 26; i++){
                if (!used[i]) {
                    smallest = i;
                    break;
                }
            }
            if (!comboq && (pos != smallest)){
                reprom(value);
                return;
            }
            let card = {"name":"invalid"};
            if (name in PCs){
                card = PCs[name];
            }
            else if (name in items){
                card = items[name];
            }
            let sleep = place(card, pos, board.sleep);
            if (board.sleep === 2) board.sleep = 1;
            if (sleep > 0){
                setTimeout(prom, sleep);
            }

       }
    })
};

var find_first_unused_slot = () =>{
    used = {}
    for (let i = 0; i < 26; i++){
        used[i] = false;
    }
    for (let cd of board.decks[board.whos_turn]){
        used[cd["pos"]] = true;
    }
    let smallest = 25;
    for (let i = 0; i < 26; i++){
        if (!used[i]) {
            smallest = i;
            break;
        }
    }
    return smallest;
};

var find_first_combo_slot = (name) =>{
    let smallest = 26;
    for (let cd of board.decks[board.whos_turn]){
        if (cd["name"]+"+"+name in combos){
            smallest = Math.min(smallest, cd["pos"]);
        }
    }
    if (smallest == 26)
        return find_first_unused_slot();
    else 
        return smallest;
};

var seq_place = (que, ith, start, animation_interval) =>{
    setTimeout(
        ()=>{
            if (ith>= que.length) return;
            if (board.prepared != 1) return;

            let slot = find_first_combo_slot(que[ith]);
            let card = PCs["FAL"];
            if (que[ith] in PCs) card = PCs[que[ith]];
            if (que[ith] in items) card = items[que[ith]];
            let sleep = place(card, slot, board.sleep, animation_interval);
            if (board.sleep === 2) board.sleep = 1;
            if (sleep > 0){
                document.getElementById("log").innerHTML += `<span>What card to place for Player #${board.whos_turn}?  --${que[ith]} at ${slot}.</span><br>`;
                seq_place(que, ith+1, sleep, animation_interval);
            }
        }, start
    );
};

var check_seq = (st) => {
    if (!((typeof st) == "string"))
        return false;
    for (let i = 0; i < st.length - 1; i++){
        if (!("PCI".includes(st[i]))){
            return false;
        }
    }
    if (st.length === 0) return false;
    return (st[st.length-1]) == '+';
};

var make_que = (st, item, chr, pc) => {
    if (check_seq(st)){
        let que = [];
        let dict = {"P":pc, "I":item, "C":chr};
        for (let i = 0; i < st.length - 1; i++){
            que.push(dict[st[i]]);
        }
        while (que.length < 25) que.push(pc);
        return que;
    }
    return [];
};

var autoplay = (seq0, seq1, item, chr, pc, animation_interval = 200) =>{
    if (check_seq(seq0) && check_seq(seq1)){
        let que0 = make_que(seq0, item, chr, pc);
        let que1 = make_que(seq1, item, chr, pc);
        let merge = [];
        for (let i = 0; i < 25; i++){
            merge.push(que0[i]);
            merge.push(que1[i]);
        }
        seq_place(merge, 0, 0, animation_interval);
    }
};


var rewind = ()=>{
    board = {
        whos_turn: 0,// 0 or 1
        prepared: 0,
        last_update : -1,
        sleep :2,
        decks: [[], []],
    }
    init(HLeela, HConsuela);
    document.getElementById("seq0").value = "P+";
    document.getElementById("seq1").value = "PIPCP+";
    document.getElementById("int").value = "200";
    document.getElementById("item").value = "Hypnotoad";
    document.getElementById("char").value = "Hank";
}

var init = (Hero0, Hero1)=>{
    let output = "<table>";
    for (let i in [0, 1]){
        output += "<tr>";//<td>" + (`Player ${i} HP = ${board.hps[i]}`) + "</td>";
        for (let j = 0; j < 26; j++) {
            output += `<td><div id="slot-${i}-${j}"></div></td>`;
        }
        output += "</tr>";
    }
    output += "</table>";
    document.getElementById("div-display").innerHTML = output;
    board.whos_turn = 0;
    board.prepared = 0;
    place(Hero0, 0, 0, 0);
    place(Hero1, 0, 0, 0);
    board.prepared = 1;
    board.sleep = 2;
};

