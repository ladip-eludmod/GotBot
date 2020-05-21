var board = {
    whos_turn: 0,// 0 or 1
    prepared: 0,
    last_update : -1,
    sleep :3,
    anim_int : 5,
    decks: [[], []],
    skill_arr: [[], []],
    stat_arr: [[], []],
};

var animations = [];

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
    "Armed": {
        "name": "Armed",
        "original_atk":12,
        "original_hp": 54,
    },
    "Langley": {
        "name": "Langley",
        "original_atk": 12,
        "original_hp": 60,
        "hijack": 7,
        "craze": 6, 
    },
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
    },
    "Zapp": {
        "name": "Zapp",
        "original_atk": 14,
        "hijack": 11,
        "original_hp": 77,
    },
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
    "Langley+Peggy":{
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
        "craze":22,
    },
    "Zapp+Armed1":{
        "name": "Unsharp",
        "original_atk": 29,
        "punch": 33,
        "jab": 36,
        "craze": 17,
        "original_hp": 148,
    },
    "Zapp+Armed":{
        "name": "Unsharp",
        "original_atk": 32,
        "punch": 29,
        "jab": 32,
        "craze": 15,
        "original_hp": 148,
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

var anime_queue = [];

var play_anime = ()=>{
    if (anime_queue.length == 0) return;
    let head = anime_queue.shift();
    setTimeout(
        ()=>{
            head[1]();
            play_anime();
        },
        head[0]
    );
}

var trigger_anime = (who, pos, effect, tar_who, tar_pos, tar_effect, eff_val, old_val, new_val) => {
    let anim_int = board.anim_int;
    let sknode = document.getElementById(`slot-${who}-${pos}-sk${board.skill_arr[who][pos].indexOf(effect)+1}`);
    let tarnode = null;
    if (tar_effect == "atk"){
        tarnode = document.getElementById(`slot-${tar_who}-${tar_pos}-atk`);
        if (tarnode == null) return;
        let clr = "blue";
        if (old_val > new_val) clr = "red";
        anime_queue.push([0, ()=>{
            tarnode.innerHTML = `<img style="width:16px;height:15px" src="img/skill_atk.png" alt="atk"></img><span style="color:${clr}"><img style="width:16px;height:15px" src="img/${clr}.png"></img>`;
        }]);
        anime_queue.push([anim_int*100, ()=>{
            tarnode.innerHTML = `<img style="width:16px;height:15px" src="img/skill_atk.png" alt="atk"></img>${new_val}`;
        }]);
    }
    if (tar_effect == "hp"){
        tarnode = document.getElementById(`slot-${tar_who}-${tar_pos}-hp`);
        if (tarnode == null) return;
        let clr = "blue";
        if (old_val > new_val) clr = "red";
        anime_queue.push([0, ()=>{
            tarnode.innerHTML = `<img style="width:16px;height:15px" src="img/skill_hp.png" alt="hp"></img><span style="color:${clr}"><img style="width:16px;height:15px" src="img/${clr}.png"></img>`;
        }]);
        anime_queue.push([anim_int*100, ()=>{
            tarnode.innerHTML = `<img style="width:16px;height:15px" src="img/skill_hp.png" alt="hp"></img>${new_val}`;
        }]);
    }
    if (sknode == null) {
        return;
    }
    if (!board.stat_arr[tar_who][tar_pos].includes(tar_effect)){
        board.stat_arr[tar_who][tar_pos].push(tar_effect);
    }
    tarnode = document.getElementById(`slot-${tar_who}-${tar_pos}-st${board.stat_arr[tar_who][tar_pos].indexOf(tar_effect)+1}`);
    if (tarnode == null) return;
    
    let tp = parseInt(sknode.parentElement.style.top.slice(0,-2));
    let lp = parseInt(sknode.parentElement.style.left.slice(0,-2));
    let top0 = parseInt(sknode.style.top.slice(0,-2));
    let left0 = parseInt(sknode.style.left.slice(0,-2));
    let tp1 = parseInt(tarnode.parentElement.style.top.slice(0,-2));
    let lp1 = parseInt(tarnode.parentElement.style.left.slice(0,-2));
    let top1 = parseInt(tarnode.style.top.slice(0,-2));
    let left1 = parseInt(tarnode.style.left.slice(0,-2));
    let t0 = top0+tp;
    let l0 = left0+lp;
    let t1 = top1+tp1;
    let l1 = left1+lp1;

    let w0 = parseInt(sknode.style.width.slice(0,-2));
    let h0 = parseInt(sknode.style.height.slice(0,-2));

    anime_queue.push([0, ()=>{ 
        sknode.parentElement.parentElement.appendChild(sknode);
        sknode.style.top = (tp+top0)+"px";
        sknode.style.left = (lp+left0)+"px";
        sknode.innerHTML = `<img style="width:16px;height:15px" src="img/skill_${effect}.png" alt="${effect}"></img>`;
        tarnode.style["background-color"] = "pink";
        tarnode.innerHTML = `<img style="width:16px;height:15px" src="img/effect_${tar_effect}.png" alt="${tar_effect}"></img>${new_val}`;
    }]);
    let N = 100;
    for (let i = 0; i < N; i++){
        anime_queue.push([anim_int, ()=>{
            sknode.style.transform = `scale(${(N+1*i)/N})`;
            sknode.style.top = (t0 * (N-i) + t1 * i)/N + "px";
            sknode.style.left = (l0 * (N-i) + l1 * i)/N + "px";
            sknode.style.width = (w0 * (N-i) + 2*w0 * i)/N + "px";
            sknode.style.height = (h0 * (N-i) + 2*h0 * i)/N + "px";
        }
        ]);
    }
    anime_queue.push([anim_int, ()=>{
        document.getElementById(`slot-${who}-${pos}`).appendChild(sknode);
        sknode.style.top = top0 + "px";
        sknode.style.left = left0 + "px";
        sknode.style.width = w0 + "px";
        sknode.style.height = h0 + "px";
        sknode.style.transform = "scale(1)";
        sknode.innerHTML = `<img style="width:16px;height:15px" src="img/skill_${effect}.png" alt="${effect}"></img>${eff_val}`;
        tarnode.style["background-color"] = "white";
    }
    ]);
};

var trigger = (who, pos, effect, change_foo)=>{
    let slot = find_slot(who, pos);
    if (slot == -1) return [0,0];
    let hp = board.decks[who][slot]["hp"];
    if ((hp > -0.1) && (hp < 0.1)) return [0,0];

    let num_old = 0;

    if (effect in board.decks[who][slot]){
        num_old = board.decks[who][slot][effect];
        board.decks[who][slot][effect]= change_foo(board.decks[who][slot][effect]);
    }
    else{
        board.decks[who][slot][effect] = change_foo(0);
    }
    let diff = board.decks[who][slot][effect] - num_old;
    if ((!force_triggers.includes(effect)) && (diff > -0.1) && (diff < 0.1)) return [num_old,num_old];

    for (let e of trigger_dict[effect](who, pos, num_old, board.decks[who][slot][effect])){
        if (e[1] < 0) continue;
        let pr = trigger(e[0], e[1], e[2], e[3]);
        trigger_anime(who, pos, effect, e[0], e[1], e[2], board.decks[who][slot][effect], pr[0], pr[1]);
    }
    return [num_old, diff + num_old];
};

var force_triggers = ["special", "name", "motivate", "cheerall", "craze", "cripple", "crippleall", "leech", "gas", "payback", "punch", "bomb", "healall", "heal", "cheer", "shield", "shieldall", "jab", "sturdy"];


var trigger_dict = {
    "motivate": (who, pos, num_old, num_new) =>{ 
        return [
            [who, pos - 1,  "motivated_from_right", (x)=>{return num_new;}],
            [who, pos + 1,  "motivated_from_left", (x)=>{return num_new;}],
        ]; 
    },
    "motivated_from_right": (who, pos, num_old, num_new) =>{
        if (num_new < num_old) return [
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
        return [
            [1-who, pos, "hijacked_from_right", (x)=>{
                let slot = find_slot(1-who, pos);
                let hij = get_val(board.decks[1-who][slot], "hijack");
                return Math.min(hij, num_new);
            }],
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
    },
    "hijacked_from_right": (who, pos, num_old, num_new) =>{
        return [
            [1-who, pos, "motivated_from_right", (x)=>{return x-num_new;}],
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
    },
    "motivated_from_left": (who, pos, num_old, num_new) =>{
        if (num_new < num_old) return [
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
        return [
            [1-who, pos, "hijacked_from_left", (x)=>{
                let slot = find_slot(1-who, pos);
                let hij = get_val(board.decks[1-who][slot], "hijack");
                return Math.min(hij, num_new);
            }],
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
    },
    "hijacked_from_left": (who, pos, num_old, num_new) =>{
        return [
            [1-who, pos, "motivated_from_left", (x)=>{return x-num_new;}],
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
    },
    "atk": (who, pos, num_old, num_new) =>{return [];},
    "hp": (who, pos, num_old, num_new) =>{
        if (num_new > 0.1) return [];
        let arr = [];

        let left_slot = find_slot(who, pos-1);
        if (left_slot != -1){
            let left_card = board.decks[who][left_slot];
            if ("motivated_from_right" in left_card) {
                left_card["atk"] -= left_card["motivated_from_right"];
                left_card["motivated_from_right"] = 0;
            }
        }
        let left_opp_slot = find_slot(1-who, pos-1);
        if (left_opp_slot != -1){
            let left_card = board.decks[1-who][left_opp_slot];
            if ("hijacked_from_right" in left_card) {
                left_card["atk"] -= left_card["hijacked_from_right"];
                left_card["hijacked_from_right"] = 0;
            }
        }
        let right_slot = find_slot(who, pos+1);
        if (right_slot != -1){
            let right_card = board.decks[who][right_slot];
            if ("motivated_from_left" in right_card) {
                right_card["atk"] -= right_card["motivated_from_left"];
                right_card["motivated_from_left"] = 0;
            }
        }
        let right_opp_slot = find_slot(1-who, pos+1);
        if (right_opp_slot != -1){
            let right_card = board.decks[1-who][right_opp_slot];
            if ("hijacked_from_left" in right_card) {
                right_card["atk"] -= right_card["hijacked_from_left"];
                right_card["hijacked_from_left"] = 0;
            }
        }

        if ((num_new < -0.1) && (pos > 0)){
            return [[
                who, 0, "hp", (x)=>{ return x + num_new;}
            ]];
        }
        return [];
    },
    "cheerall": (who, pos, num_old, num_new) =>{
        let arr = [];
        for (let cd of board.decks[who]){
            if ((cd["sleep"] < 0.1) && (cd["pos"] > pos)){
                arr.push([who, cd["pos"], "motivated_from_cheer", (x)=>{ return x+num_new;}]);
            }
        }
        return arr;
    },
    "hijacked_from_cheer": (who, pos, num_old, num_new) =>{
        return [
            [1-who, pos, "motivated_from_cheer", (x)=>{return x-(num_new-num_old);}],
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
    },
    "motivated_from_cheer": (who, pos, num_old, num_new) =>{
        if (num_new < num_old) return [
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
        return [
            [1-who, pos, "hijacked_from_cheer", (x)=>{
                let slot = find_slot(1-who, pos);
                let hij = get_val(board.decks[1-who][slot], "hijack");
                return Math.min(hij, num_new);
            }],
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
    },
    "craze": (who, pos, num_old, num_new) =>{
        return [[who, pos, "motivated_from_crazed", (x)=>{return x + num_new}]];
    },
    "hijacked_from_crazed": (who, pos, num_old, num_new) =>{
        return [
            [1-who, pos, "motivated_from_crazed", (x)=>{return x-(num_new-num_old);}],
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
    },
    "motivated_from_crazed": (who, pos, num_old, num_new) =>{
        if (num_new < num_old) return [
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
        return [
            [1-who, pos, "hijacked_from_crazed", (x)=>{
                let slot = find_slot(1-who, pos);
                let hij = get_val(board.decks[1-who][slot], "hijack");
                return Math.min(hij, num_new-num_old);
            }],
            [who, pos, "atk", (x)=>{return x + num_new-num_old;}]
        ];
    },
    "crippleall": (who, pos, num_old, num_new) =>{
        let arr = [];
        for (let cd of board.decks[1-who]){
            let atk = cd["atk"];
            if ((cd["hp"] > 0.1)){
                arr.push(
                    [1-who, cd["pos"], "crippled", (x)=>{
                        return x+Math.min(num_new, atk);
                    }],
                );
            }
        }
        return arr;
    },
    "crippled": (who, pos, num_old, num_new) =>{
        return [
            [who, pos, "atk", (x)=>{
                console.log("Cripple", x, x-(num_new-num_old));
                return x - (num_new-num_old);
            }],
        ];
    },
    "leech": (who, pos, num_old, num_new) =>{
        return [
            [who, pos, "hp", (x)=>{
                let slot = find_slot(who, pos);
                return Math.min(board.decks[who][slot]["original_hp"], x + num_new);
            }]
        ];
    },
    "shieldall": (who, pos, num_old, num_new) =>{
        let arr = [];
        for (let cd of board.decks[who]){
            if ( (cd["pos"] != pos) && (cd["pos"] > 0.1)){
                arr.push([who, cd["pos"], "shielded", (x)=>{ return x+num_new;}]);
            }
        }
        return arr;
    },
    "shielded": (who, pos, num_old, num_new) =>{ return []; },
    "shield": (who, pos, num_old, num_new) =>{ 
        let candid = [];
        for (let ocd of board.decks[who]){
            if ((ocd["pos"] != pos) && (ocd["pos"] > 0) && (ocd["hp"]>0.1))
                candid.push(ocd["pos"]);
        }
        if (candid.length > 0)
            return [[who, candid[Math.floor(Math.random() * candid.length)], "shielded", (x)=>{return x+num_new;}]];
        else
            return []; 
    },
    "healall": (who, pos, num_old, num_new) =>{
        let arr = [];
        for (let cd of board.decks[who]){
            let ohp = cd["original_hp"];
            if ( (cd["pos"] != pos) && (cd["pos"] > 0.1) && (cd["hp"] + 0.1 < ohp)){
                arr.push([who, cd["pos"], "hp", (x)=>{ return Math.min(x+num_new, ohp);}]);
            }
        }
        return arr;
    },
    "heal": (who, pos, num_old, num_new) =>{ 
        let candid = [];
        for (let ocd of board.decks[who]){
            let ohp = ocd["original_hp"];
            if ((ocd["pos"] != pos) && (ocd["pos"] > 0.1) && (ocd["hp"]>0.1) && (ocd["hp"]+0.1 < ohp))
                candid.push(ocd);
        }
        if (candid.length > 0){
            let ocd = candid[Math.floor(Math.random() * candid.length)];
            let ohp = ocd["original_hp"];
            return [[who, ocd["pos"], "hp", (x)=>{return Math.min(x+num_new, ohp);}]];
        }
        else
            return []; 
    },
    "cripple": (who, pos, num_old, num_new) =>{ 
        let candid = [];
        for (let ocd of board.decks[1-who]){
            if ((ocd["pos"] != pos) && (ocd["pos"] > 0.1) && (ocd["hp"]>0.1) && (ocd["sleep"] > 1.1))
                candid.push(ocd);
        }
        if (candid.length > 0){
            let ocd = candid[Math.floor(Math.random() * candid.length)];
            let atk = ocd["atk"];
            return [[1-who, ocd["pos"], "crippled", (x)=>{return x+Math.min(num_new, atk);}]];
        }else
            return []; 
    },
    "punch": (who, pos, num_old, num_new) =>{ 
        return [];
        let candid = [];
        for (let ocd of board.decks[1-who]){
            if ((ocd["pos"] != pos) && (ocd["pos"] > 0.1) && (ocd["hp"]>0.1))
                candid.push(ocd);
        }
        if (candid.length > 0){
            let opos = candid[Math.floor(Math.random() * candid.length)];
            return [[1-who, opos, "special", (x)=>{return num_new;}]];
        }else
            return []; 
    },
    "jab": (who, pos, num_old, num_new) =>{ 
        let opp_slot = find_slot(1-who, pos);
        if (opp_slot < 0) return [];
        let opp_card = board.decks[1-who][opp_slot];
        if (opp_card["hp"] < 0.1) return [];
        let arr = [];
        let val = num_new;
        if ("sturdyd" in opp_card){
            arr.push([1-who, pos, "sturdyd", (x)=>{return Math.max(0, x-val);}]);
            val -= Math.min(val, opp_card["sturdyd"]);
        }
        arr.push(
            [1-who, pos, "shielded", (x)=>{return Math.max(0, x-val);}]
        );
        return arr;
    },
    "sturdy": (who, pos, num_old, num_new) =>{ 
        return [[
            who, pos, "sturdyd", (x)=>{return num_new}
        ]];
    },
    "sturdyd": (who, pos, num_old, num_new) =>{ return [];},
    "gassed": (who, pos, num_old, num_new) =>{ return [];},
    "gas": (who, pos, num_old, num_new) =>{
        return [[1-who, pos, "gassed", (x)=>{
            return Math.max(x, num_new);
        }]];
    },
    "payback": (who, pos, num_old, num_new) =>{
        let slot = find_slot(1-who, pos);
        let card = board.decks[1-who][slot];
        let shielded = get_val(card, "shielded");
        if (num_new > shielded){
            return [
                [1-who, pos, "shielded", (x)=>{ return 0;}],
                [1-who, pos, "hp", (x)=>{return x-(num_new-shielded);}]
            ];
        }
        else{
            return [[1-who, pos, "shielded", (x)=>{return x-num_new;}]];
        }
    },
    "bomb": (who, pos, num_old, num_new) =>{
        return [
            [who, pos - 1, "special", (x)=>{return num_new}],
            [who, pos + 1, "special", (x)=>{return num_new}],
        ];
    },
    "special": (who, pos, num_old, num_new) =>{
        let bg = Math.max(get_pos_val(who, pos - 1, "bodyguard"), get_pos_val(who, pos, "bodyguard"), get_pos_val(who, pos + 1, "bodyguard"));
        let shielded = get_pos_val(who, pos, "shielded");
        if (shielded > num_new){
            return [[
                who, pos, "shielded", (x) => {return x - num_new;}
            ]];
        }
        else{
            let arr = [];
            arr.push([who, pos, "shielded", (x)=>{return 0;}]);
            let val  = max(0, num_new - shielded - bg);
            arr.push([who, pos, "hp", (x)=>{return x - val;}]);
            return arr;
        }
    },
    "name": (who, pos, num_old, num_new) =>{
        let opp_slot = find_slot(1-who, pos);
        let slot = find_slot(who, pos);
        let card = board.decks[who][pos];
        let atk = card["atk"];
        if (opp_slot === -1){
            return [[1-who, 0, "hp", (x)=>{return x-atk;}]];
        }
        else{
            let arr = [];
            let opp_card = board.decks[1-who][opp_slot];
            if ("bomb" in card){
                arr.push([who, pos, "bomb", (x)=>{return x;}]);
            }
            if ("payback" in opp_card){
                arr.push([1-who, pos, "payback", (x)=>{return x;}]);
            }
            let sturdyd = get_val(opp_card, "sturdyd");
            atk -= sturdyd;
            let shielded = get_val(opp_card, "shielded");

            if (atk > shielded){
                arr.push([1-who, pos, "shielded", (x)=>{return 0;}]);
                arr.push([1-who, pos, "hp", (x)=>{return x-(atk-shielded);}]);
            }
            else{
                arr.push([1-who, pos, "shielded", (x)=>{return x-atk;}]);
            }
            if ("leech" in card){
                arr.push([who, pos, "leech", (x)=>{return x;}]);
            }
            if ("gas" in card){
                arr.push([who, pos, "gas", (x)=>{return x;}]);
            }
            if ("craze" in card){
                arr.push([who, pos, "craze", (x)=>{return x;}]);
            }
            return arr;
        }
    },
};


var print_card = (who, pos, color)=>{
    let skillset = ["motivate", "shield", "crippleall", "shieldall", "cheerall", "cheer", "leech", "gas", "craze", "sturdy", "payback", "hijack", "jab", "bomb", "punch"];
    let effectset = ["gassed", "crippled", "motivated_from_left", "motivated_from_right", "shielded", "gased", "crazed", "hijacked_from_left", "hijacked_from_right", "hijacked_from_craze", "hijacked_from_cheer"];

    let arr = [];

    let slot = find_slot(who, pos);
    let cd = board.decks[who][slot];
    if (!("name" in cd)) return;
    arr.push([`slot-${who}-${pos}-name`, `<div>${cd["name"]}</div>`]);
    if (pos > 0.1){
        arr.push([`slot-${who}-${pos}-atk`, `<img style="width:16px;height:15px" src="img/skill_atk.png" alt="atk"></img>${cd["atk"]}`]);
    }
    arr.push([`slot-${who}-${pos}-hp`, `<img style="width:16px;height:15px" src="img/skill_hp.png" alt="hp"></img>${cd["hp"]}`]);
    for (let x in cd){
        if ((cd[x] > -0.1) && (cd[x] < 0.1)) continue;
        if (skillset.includes(x)){
            if (!board.skill_arr[who][pos].includes(x))
                board.skill_arr[who][pos].push(x);
            arr.push([`slot-${who}-${pos}-sk${board.skill_arr[who][pos].indexOf(x)+1}`, `<img style="width:16px;height:15px" src="img/skill_${x}.png" alt="${x}"></img>${cd[x]}`]);
        }
    }
    for (let x in cd){
        if ((cd[x] > -0.1) && (cd[x] < 0.1)) continue;
        if (effectset.includes(x)){
            if (!board.stat_arr[who][pos].includes(x))
                board.stat_arr[who][pos].push(x);
            arr.push([`slot-${who}-${pos}-st${board.stat_arr[who][pos].indexOf(x)+1}`, `<img style="width:16px;height:15px" src="img/effect_${x}.png" alt="${x}"></img>${cd[x]}`]);
        }
    }
    
    document.getElementById(`slot-${who}-${pos}`).style["background-color"] = color;
    document.getElementById(`slot-${who}-${pos}`).style["display"] = "block";
    for (let pr of arr){
        let node = document.getElementById(pr[0]);

        if (node != null)
            node.innerHTML = pr[1];
    }
}

var get_val = (cd, key)=>{
    if (key in cd) return cd[key];
    else return 0;
};


var get_pos_val = (who, pos, key)=>{
    let slot = find_slot(who, pos);
    if (slot == -1) return 0;
    let cd = board.decks[who][slot];
    if (key in cd) return cd[key];
    else return 0;
};




var animate = (who, pos, start, color) =>{
    let slot = find_slot(who, pos);
    if (slot == -1) return;
    let this_card = board.decks[who][slot];

    setTimeout(()=>{
        print_card(who, pos, color);
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
    for (let cd of board.decks[1-board.whos_turn]){
        cd["old_hp"] = cd["hp"];
        cd["old_atk"] = cd["atk"];
        cd["atk"] += get_val(cd, "crippled");
        //board.stat_arr[1-board.whos_turn][cd["pos"]] = [];
        //board.skill_arr[1-board.whos_turn][cd["pos"]] = [];
        if ("crippled" in cd) cd["crippled"] = 0;
        print_card(1-board.whos_turn, cd["pos"], "white");
    }
    for (let cd of board.decks[board.whos_turn]){
        if ("shielded" in cd) cd["shielded"] = 0;
        cd["old_hp"] = cd["hp"];
        cd["old_atk"] = cd["atk"];
        cd["atk"] -= get_val(cd, "motivated_from_cheer");
        cd["motivated_from_cheer"] = 0;
        //board.stat_arr[board.whos_turn][cd["pos"]] = [];
        //board.skill_arr[board.whos_turn][cd["pos"]] = [];
        print_card(board.whos_turn, cd["pos"], "white");
    }
    if (found === -1){
        let card_copy = Object.assign({}, card);
        let this_slot = board.decks[board.whos_turn].length;
        board.decks[board.whos_turn].push(card_copy);
        let this_card = board.decks[board.whos_turn][this_slot];
        this_card["pos"] = position;
        this_card["sleep"] = sleep;
        this_card["atk"] = this_card["original_atk"];
        this_card["hp"] = this_card["original_hp"];
        this_card["shielded"] = 0;
        trigger(board.whos_turn, position, "motivate", (x)=>{return x});

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
    }
    board.stat_arr[board.whos_turn][position] = [];
    board.skill_arr[board.whos_turn][position] = [];
    print_card(board.whos_turn,position,"orange");
    board.decks[board.whos_turn].sort((k)=>{return k["pos"]});
    new_card = board.decks[board.whos_turn][find_slot(board.whos_turn, position)];
    new_card["old_atk"] = new_card["atk"];
    new_card["old_hp"] = new_card["hp"];



    for (let cd of board.decks[board.whos_turn]){
        if ("motivate" in cd){
            if (cd["pos"] != position)
                trigger(board.whos_turn, cd["pos"], "motivate", (x)=>{return x;});
        }
        if ("sturdy" in cd){
            trigger(board.whos_turn, cd["pos"], "sturdy", (x)=>{return x;});
        }
        if (cd["sleep"] > 0.1) {
            cd["sleep"] -= 1;
            continue;
        }
        if ("crippleall" in cd){
            trigger(board.whos_turn, cd["pos"], "crippleall", (x)=>{return x;});
        }
        if ("cripple" in cd){
            trigger(board.whos_turn, cd["pos"], "cripple", (x)=>{return x;});
        }
        if ("shieldall" in cd){
            trigger(board.whos_turn, cd["pos"], "shieldall", (x)=>{return x;});
        }
        if ("shield" in cd){
            trigger(board.whos_turn, cd["pos"], "shield", (x)=>{return x;});
        }
        if ("cheerall" in cd){
            trigger(board.whos_turn, cd["pos"], "cheerall", (x)=>{return x;});
        }
        if ("cheer" in cd){
            trigger(board.whos_turn, cd["pos"], "cheer", (x)=>{return x;});
        }
        if ("healall" in cd){
            trigger(board.whos_turn, cd["pos"], "healall", (x)=>{return x;});
        }
        if ("heal" in cd){
            trigger(board.whos_turn, cd["pos"], "heal", (x)=>{return x;});
        }
        if ("punch" in cd){
            trigger(board.whos_turn, cd["pos"], "punch", (x)=>{return x;});
        }


        let atk = cd["atk"];
        if (cd["pos"]>0.1){
            if (("jab" in cd) && (atk > 0.1)){
                trigger(board.whos_turn, cd["pos"], "jab", (x)=>{return x;})
            }
            trigger(board.whos_turn, cd["pos"], "name", (x)=>{return x;});
        }
    }

    for (let cd of board.decks[board.whos_turn]){
        cd["atk"] -= get_val(cd, "hijacked_from_cheer");
        cd["hijacked_from_cheer"] = 0;
        cd["atk"] -= get_val(cd, "hijacked_from_crazed");
        cd["hijacked_from_craze"] = 0;
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


    play_anime();
    board.whos_turn = 1 - board.whos_turn;
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

var seq_place = (que, ith, wait_interval) =>{
    setTimeout(
        ()=>{
            if (ith>= que.length) return;
            if (board.prepared != 1) return;
            if (anime_queue.length > 0.1) {
                seq_place(que, ith, wait_interval);
                return;
            }

            let slot = find_first_combo_slot(que[ith]);
            let card = PCs["FAL"];
            if (que[ith] in PCs) card = PCs[que[ith]];
            if (que[ith] in items) card = items[que[ith]];
            let sleep = place(card, slot, board.sleep);
            if (board.sleep === 3) board.sleep = 1;
            if (sleep > 0){
                document.getElementById("log").innerHTML += `<span>What card to place for Player #${board.whos_turn}?  --${que[ith]} at ${slot}.</span><br>`;
                seq_place(que, ith+1, wait_interval);
            }
        },wait_interval 
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

var autoplay = (seq0, seq1, item, chr, pc, wait_interval = 50) =>{
    board.anim_int = parseInt(document.getElementById("int").value);
    combos["Hypnotoad+MPeggy20"]["gas"] = parseInt(document.getElementById("gas").value);
    combos["Hypnotoad+MPeggy20"]["leech"] = parseInt(document.getElementById("leech").value);
    combos["Hypnotoad+MPeggy20"]["craze"] = parseInt(document.getElementById("craze").value);
    combos["Hypnotoad+MPeggy20"]["original_atk"] = parseInt(document.getElementById("atk").value);
    combos["Hypnotoad+MPeggy20"]["original_hp"] = parseInt(document.getElementById("hp").value);
    combos["Langley+MPeggy20"] = Object.assign({},combos["Hypnotoad+MPeggy20"]);
    if (check_seq(seq0) && check_seq(seq1)){
        let que0 = make_que(seq0, item, chr, pc);
        let que1 = make_que(seq1, item, chr, pc);
        let merge = [];
        for (let i = 0; i < 25; i++){
            merge.push(que0[i]);
            merge.push(que1[i]);
        }
        seq_place(merge, 0, wait_interval);
    }
};


var rewind = ()=>{
    anime_queue = [];
    board = {
        whos_turn: 0,// 0 or 1
        prepared: 0,
        last_update : -1,
        sleep :3,
        anim_int : 5,
        decks: [[], []],
        skill_arr: [[], []],
        stat_arr: [[], []],
    }
    for (let i = 0; i < 26; i++) board.skill_arr[0].push([]);
    for (let i = 0; i < 26; i++) board.skill_arr[1].push([]);
    for (let i = 0; i < 26; i++) board.stat_arr[0].push([]);
    for (let i = 0; i < 26; i++) board.stat_arr[1].push([]);
    init(HLeela, HConsuela);
    document.getElementById("seq0").value = "P+";
    document.getElementById("seq1").value = "PCPIP+";
    document.getElementById("int").value = "5";
    //document.getElementById("item").value = "Hypnotoad";
    //document.getElementById("char").value = "MPeggy20";
    document.getElementById("item").value = "Armed";
    document.getElementById("char").value = "Zapp";
    document.getElementById("gas").value = 37;
    document.getElementById("leech").value = 37;
    document.getElementById("craze").value = 20;
    document.getElementById("atk").value = 28;
    document.getElementById("hp").value = 90;
    combos["Hypnotoad+MPeggy20"]["gas"] = parseInt(document.getElementById("gas").value);
    combos["Hypnotoad+MPeggy20"]["leech"] = parseInt(document.getElementById("leech").value);
    combos["Hypnotoad+MPeggy20"]["craze"] = parseInt(document.getElementById("craze").value);
    combos["Hypnotoad+MPeggy20"]["original_atk"] = parseInt(document.getElementById("atk").value);
    combos["Hypnotoad+MPeggy20"]["original_hp"] = parseInt(document.getElementById("hp").value);
}


var init = (Hero0, Hero1)=>{
    let output = "";
    let wid = 120;
    let ht = 200;
    for (let i in [0, 1]){
        for (let j = 0; j < 26; j++) {
            if (j == 0){
            output += `<div id="slot-${i}-0" style="background-color:white;position:absolute;top:${i*ht*1.2}px;left:0px;height:${ht}px;width:${wid}px;">
                <div id="slot-${i}-0-name" style="background-color:lightgrey;position:absolute;top:${0.3*ht};left:${wid/10}px;height:${ht/10}px;width:${wid*0.85}px"></div>
                <div id="slot-${i}-0-sk1" style="position:absolute;top:${0.5*ht}px;left:${0.05*wid}px;height:${ht*0.1}px;width:${0.38*wid}px"></div>
                <div id="slot-${i}-0-sk2" style="position:absolute;top:${0.6*ht}px;left:${0.05*wid}px;height:${ht*0.1}px;width:${0.38*wid}px"></div>
                <div id="slot-${i}-0-sk3" style="position:absolute;top:${0.7*ht}px;left:${0.05*wid}px;height:${ht*0.1}px;width:${0.38*wid}px"></div>
                <div id="slot-${i}-0-hp" style="position:absolute;top:${0.9*ht}px;left:${0.05*wid}px;height:${ht*0.1}px;width:${0.38*wid}px"></div>
                </div>`;
            }
            else{
                output += `<div id="slot-${i}-${j}" style="display:none;border-style:outset;background-color:white;position:absolute;top:${i*ht*1.2}px;left:${j*wid*1.1}px;height:${ht}px;width:${wid}px;">
                <div id="slot-${i}-${j}-name" style="display:grid;grid-template-columns: fit-content(300px) 1fr;background-color:lightgrey;position:absolute;top:0;left:${wid/10}px;height:${ht*0.2}px;width:${wid*0.85}px"></div>
                <div id="slot-${i}-${j}-atk" style="position:absolute;top:${0.8*ht}px;left:${0.6*wid}px;height:${ht*0.1}px;width:${0.38*wid}px"></div>
                <div id="slot-${i}-${j}-hp" style="position:absolute;top:${0.9*ht}px;left:${0.6*wid}px;height:${ht*0.1}px;width:${0.38*wid}px"></div>
                <div id="slot-${i}-${j}-sk1" style="position:absolute;top:${0.7*ht}px;left:${0.05*wid}px;height:${ht*0.1}px;width:${0.38*wid}px"></div>
                <div id="slot-${i}-${j}-sk2" style="position:absolute;top:${0.8*ht}px;left:${0.05*wid}px;height:${ht*0.1}px;width:${0.38*wid}px"></div>
                <div id="slot-${i}-${j}-sk3" style="position:absolute;top:${0.9*ht}px;left:${0.05*wid}px;height:${ht*0.1}px;width:${0.38*wid}px"></div>
                <div id="slot-${i}-${j}-st1" style="position:absolute;top:${0.23*ht}px;left:${0.05*wid}px;height:${ht*0.2}px;width:${0.25*wid}px"></div>
                <div id="slot-${i}-${j}-st2" style="position:absolute;top:${0.23*ht}px;left:${0.3*wid}px;height:${ht*0.2}px;width:${0.25*wid}px"></div>
                <div id="slot-${i}-${j}-st3" style="position:absolute;top:${0.23*ht}px;left:${0.55*wid}px;height:${ht*0.2}px;width:${0.25*wid}px"></div>
                <div id="slot-${i}-${j}-st4" style="position:absolute;top:${0.46*ht}px;left:${0.05*wid}px;height:${ht*0.2}px;width:${0.25*wid}px"></div>
                <div id="slot-${i}-${j}-st5" style="position:absolute;top:${0.46*ht}px;left:${0.3*wid}px;height:${ht*0.2}px;width:${0.25*wid}px"></div>
                <div id="slot-${i}-${j}-st6" style="position:absolute;top:${0.46*ht}px;left:${0.55*wid}px;height:${ht*0.2}px;width:${0.25*wid}px"></div>
                </div>`;
            }
        }
    }
    document.getElementById("div-display").innerHTML = output;
    board.whos_turn = 0;
    board.prepared = 0;
    place(Hero0, 0, 0, 0);
    place(Hero1, 0, 0, 0);
    board.prepared = 1;
    board.sleep = 3;
};

