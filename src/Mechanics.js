class damage_source {
    constructor(atk_base, atk_pcnt, atk_flat, crit_rate, crit_dmg, em) {
        this.atk_base = atk_base;
        this.atk_pcnt = atk_pcnt;
        this.atk_flat = atk_flat;
        this.crit_rate = crit_rate;
        this.crit_dmg = crit_dmg;
        this.em = em;
    }
}

class ability {
    constructor(ability_pcnt, element) {
        this.ability_pcnt = ability_pcnt;
        this.element = element;
    }
}