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
    constructor(ability_pcnt, element, gauge, start_time, gauget) {
        this.ability_pcnt = ability_pcnt;
        this.element = element;
        this.gauge = gauge;
        this.start_time = start_time;
        this.gauget = gauget;
    }
}

class element {
    static anemo = new element("anemo");
    static pyro = new element("pyro");
    static electro = new element("electro");
    static hydro = new element("hydro");
    static cryo = new element("cryo");
    static frozen = new element("frozen");
    static phys = new element("phys");
    static geo = new element("geo");
    constructor(elem) {
        this.elem = elem;
    }
}           

class reaction {
    static refresh = new reaction("refresh");
    static none = new reaction("none");
    static vaporized = new reaction("vaporized");
    static melt = new reaction("melt");
    static frozen = new reaction("frozen");
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
    constructor(level, res_bases, res_bnses, res_dbffs, def, def_reduct, dmg_reduct, aura, gauge, aura1, gauge1, gauge0t, guage1t) {
        this.level = level;
        this.res_bases = res_bases;
        this.res_bnses = res_bnses;
        this.res_dbffs = res_dbffs;
        this.def = def;
        this.def_reduct = def_reduct;
        this.dmg_reduct = dmg_reduct; // xingqiu
        this.aura0 = aura;
        this.gauge0 = gauge;
        this.gauge0t = gauge0t;
        this.aura1 = aura1;
        this.gauge1 = gauge1;
        this.gauge1t = guage1t;
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

function reaction_manager(damage_taker, ability, raw_dmg) {
    const res_matrix = 
    [[reaction.swirl, reaction.refresh, reaction.overloaded, reaction.vaporized, reaction.melt, reaction.none, reaction.none],
     [reaction.swirl, reaction.overloaded, reaction.refresh, reaction.electrocharged, reaction.superconduct, reaction.none, reaction.none],
     [reaction.swirl, reaction.vaporized, reaction.electrocharged, reaction.refresh, reaction.frozen, reaction.none, reaction.none],
     [reaction.swirl, reaction.melt, reaction.superconduct, reaction.frozen, reaction.refresh, reaction.none, reaction.none],
     [reaction.swirl, reaction.melt, reaction.superconduct, reaction.refresh, reaction.refresh, reaction.none, reaction.none]
     [reaction.none, reaction.none, reaction.none, reaction.none, reaction.none, reaction.none],
     [reaction.none, reaction.none, reaction.none, reaction.none, reaction.none, reaction.none]];
    switch(damage_taker.aura0) {
        case element.pyro:
            var index0 = 0;
            break;
        case element.electro:
            var index0 = 1;
            break;
        case element.hydro:
            var index0 = 2;
            break;
        case element.cryo:
            var index0 = 3;
            break;
        case element.frozen:
            var index0 = 4;
            break;
        case element.phys:
            var index0 = 5;
            break;
        case element.geo:
            var index0 = 6;
            break;
        case _:
            var index0 = -1;
    }
    switch(damage_taker.aura1) {
        case element.pyro:
            var index1 = 0;
            break;
        case element.electro:
            var index1 = 1;
            break;
        case element.hydro:
            var index1 = 2;
            break;
        case element.cryo:
            var index1 = 3;
            break;
        case element.frozen:
            var index1 = 4;
            break;
        case element.phys:
            var index1 = 5;
            break;
        case element.geo:
            var index1 = 6;
            break;
        case _:
            var index1 = -1;
    }
    switch(ability.aura) {
        case element.anemo:
            var index2 = 0;
            break;
        case element.pyro:
            var index2 = 1;
            break;
        case element.electro:
            var index2 = 2;
            break;
        case element.hydro:
            var index2 = 3;
            break;
        case element.cryo:
            var index2 = 4;
            break;
        case element.phys:
            var index2 = 5;
            break;
        case element.geo:
            var index2 = 6;
            break;
        case _:
            var index2 = -1;
            break;
    }
    if (index0 > 0 && index2 > 0) { //if gauge one exists
        var res_reaction0 = res_matrix[index0, index1];
    }
    if (index1 > 0 && index2 > 0) { //if gauge two exists a reaction
        var res_reaction1 = res_matrix[index0, index1];
    }
    var reactions = [res_reaction0, res_reaction1];
    // solve potential guage conflicts (i.e. melt and vaporize)
    // manage gauge if refresh:
    
    //
    if (res_reaction == reaction.superconduct || res_reaction == reaction.overloaded || res_reaction == reaction.shattered || res_reaction == reaction.swirl || res_reaction == reaction.electrocharged) {
        return raw_dmg + transdmg(source, taker, res_reaction, rxnbns);
    } else {
        return raw_dmg * reaction_bonus(damage_taker.aura, ability.aura, source, rxnbns);
    }
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