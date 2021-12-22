class damage_source {
    constructor(level, atk_base, atk_pcnt, atk_flat, crit_rate, crit_dmg, em, dmg_flat, dmg_bnses) {
        this.level = level;
        this.atk_base = atk_base;
        this.atk_pcnt = atk_pcnt;
        this.atk_flat = atk_flat;
        this.crit_rate = crit_rate;
        this.crit_dmg = crit_dmg;
        this.em = em;
        this.dmg_flat = dmg_flat;
        this.dmg_bnses = dmg_bnses;
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

class reaction {
    static overloaded = new reaction("overloaded");
    static shattered = new reaction("shattered");
    static electrocharged = new reaction("electrocharged");
    static swirl = new reaction("swirl");
    static superconduct = new reaction("superconduct");
    constructor(rxn) {
        this.rxn = rxn;
    }
}

class damage_taker {
    constructor(level, res_bases, res_bnses, res_dbffs, def, def_reduct, dmg_reduct, aura, gauge) {
        this.level = level;
        this.res_bases = res_bases;
        this.res_bnses = res_bnses;
        this.res_dbffs = res_dbffs;
        this.def = def;
        this.def_reduct = def_reduct;
        this.dmg_reduct = dmg_reduct; // xingqiu
        this.aura = aura;
        this.gauge = gauge;
    }
}

function totres(taker, elem) {
    let res = taker.res_bases[elem] + taker.res_bonus[elem] - taker.res_debuff[elem];
    if (res < 0) {
        return 1 - (res / 2);
    } else if (res < 0.75) {
        return 1 - res;
    } else {
        return 1 / (4 * res + 1);
    }
}

// check reactions on ability type and target
function damage(source, abil, taker) {
    let e = abil.element;

    let atk = (source.atk_base * (1 + source.atk_pcnt) + source.atk_flat);
    let rawdmg = (atk * abil.ability_pcnt + source.dmg_flat) * (1 + source.dmg_bnses[e]);
    let defmult = (source.level + 100)/((1 - taker.def_reduct) * (taker.level + 100) + source.level + 100);

    let resmult = totres(taker, e);

    return {
        ability: rawdmg * defmult * resmult * (1 - taker.dmg_reduct),
        reaction: 0
    };

}

// at some point implement reactionbonus for CWOF and mona c1
function reaction_bonus(e1, e2, source, rxnbns) {
    let em = source.em;
    const mult = (1 + (2.78 * em) / (1400 + em));
    if (e1 == element.hydro && e2 == element.pyro || e1 == element.pyro && e2 == element.cryo) {
        return 2 * mult;
    } else if (e1 == element.pyro && e2 == element.hydro || e1 == element.cryo && e2 == element.pyro) {
        return 1.5 * mult;
    }
    return 1;
}

function transdmg(source, taker, reaction, rxnbns) {
    let em = source.em;
    let base = 0;
    switch (reaction) {
        case reaction.overloaded:
            base = 4;
            var elem = element.pyro;
            break;
        case reaction.shattered:
            base = 3;
            var elem = element.phys;
            break;
        case reaction.electrocharged:
            base = 2.4 // this can trigger multiple times
            var elem = element.electro;
            break;
        case reaction.swirl:
            base = 1.2;
            var elem = taker.aura;
            break;
        case reaction.superconduct:
            base = 1.0;
            var elem = element.cryo;
            break;
        default:
            return 0;
    }
    let k = 1 + ((16 * em) / (2000 + em)) + rxnbns;

    let lm = 0;
    const lvl = source.level;
    if (source.level < 60) {
        lm = 0.0002325 * lvl ** 3 + 0.05547 * lvl ** 2 - 0.2523 * lvl + 14.47;
    } else {
        lm = 0.00194 * lvl ** 3 - 0.319 * lvl ** 2 + 30.7 * lvl - 868;
    }

    return base * k * lm * totres(taker, elem);

}

bennett = new damage_source(80, 1273, 0, 0, 0, 0, 0, .466, 0);
hilichurl = new damage_taker(68, .10, 0, 0, 840, 0, 0);
eskill = new ability(1.82, 0, 0);
console.log(damage(bennett, eskill, hilichurl));