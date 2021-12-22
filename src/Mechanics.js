class damage_source {
    constructor(level, atk_base, atk_pcnt, atk_flat, crit_rate, crit_dmg, em, dmg_bns, dmg_flat) {
        this.level = level;
        this.atk_base = atk_base;
        this.atk_pcnt = atk_pcnt;
        this.atk_flat = atk_flat;
        this.crit_rate = crit_rate;
        this.crit_dmg = crit_dmg;
        this.em = em;
        this.dmg_bns = dmg_bns; //change to dictionary.
        this.dmg_flat = dmg_flat;
    }
}

class ability {
    constructor(ability_pcnt, element, gauge) {
        this.ability_pcnt = ability_pcnt;
        this.element = element;
        this.gauge = gauge;
    }
}

class element {
    static pyro = new element("pyro");
    static electro = new element("electro");
    static hydro = new element("hydro");
    static cryo = new element("cryo");
    static phys = new element("phys");
    static geo = new element("geo");
    constructor(elem) {
        this.elem = elem;
    }
}           

class damage_taker {
    constructor(level, res_base, res_bonus, res_debuff, def, def_reduct, dmg_reduct) {
        this.level = level;
        this.res_base = res_base;
        this.res_bonus = res_bonus;
        this.res_debuff = res_debuff;
        this.def = def;
        this.def_reduct = def_reduct;
        this.dmg_reduct = dmg_reduct; // xingqiu
    }
}

function damage(source, abil, taker) {
    let atk = (source.atk_base * (1 + source.atk_pcnt) + source.atk_flat);
    let rawdmg = (atk * abil.ability_pcnt + source.dmg_flat) * (1 + source.dmg_bns);
    let defmult = (source.level + 100)/((1 - taker.def_reduct) * (taker.level + 100) + source.level + 100);

    let res = taker.res_base + taker.res_bonus - taker.res_debuff;
    if (res < 0) {
        var resmult = 1 - (res / 2);
    } else if (res < 0.75) {
        var resmult = 1 - res;
    } else {
        var resmult =  1 / (4 * res + 1);
    }

    return rawdmg * defmult * resmult * (1 - taker.dmg_reduct);

}

bennett = new damage_source(80, 1273, 0, 0, 0, 0, 0, .466, 0);
hilichurl = new damage_taker(68, .10, 0, 0, 840, 0, 0);
eskill = new ability(1.82, 0, 0);
console.log(damage(bennett, eskill, hilichurl));