import fs from 'fs';

const esperData = JSON.parse(fs.readFileSync('esperBoards.json', 'utf8'));

const esperNames = Object.keys(esperData);

// Format for espers.json
/*{
    "id":"",
    "name":"",
    "maxLevel":,
    "hp":,
    "mp":,
    "atk":,
    "def":,
    "mag":,
    "spr":,
    "killers":[
        {
            "name":"",
            "physical":, 
            "magical":
        }
    ],
    "resist":[
        {
            "name":"",
            "percent":-50
        },
        {
            "name":"",
            "percent":
        },
        {
            "name":""
            ,
            "percent":
        }
    ]
}, */


// Stats are formated as follows:
// "stats": {
//     "1": {
//         "HP": [1500, 2000],
//         "MP": [1800, 2500],
//         "ATK": [1000, 1300],
//         "DEF": [1200, 1500],
//         "MAG": [1500, 2500],
//         "SPR": [1500, 2500]
//     },
//     "2": {
//         "HP": [2500, 3000],
//         "MP": [2700, 3400],
//         "ATK": [1500, 1800],
//         "DEF": [1600, 1900],
//         "MAG": [2600, 3600],
//         "SPR": [2600, 3600]
//     },
//     "3": {
//         "HP": [4500, 6000],
//         "MP": [5400, 6800],
//         "ATK": [3000, 5000],
//         "DEF": [3600, 5400],
//         "MAG": [4500, 7200],
//         "SPR": [4500, 7200]
//     }
// },

const espers = [];

console.log(esperNames);

for (let i = 0; i < esperNames.length; i++) {
    const esper = esperData[esperNames[i]];
    console.log(esper);

    // find the largest level in stats, it will be three or less.
    const maxLevel = Math.max(...Object.keys(esper.stats).map(key => parseInt(key, 10)));
    const esperObject = {
        id: esperNames[i],
        name: esperNames[i],
        maxLevel: maxLevel,
        hp: esper.stats[maxLevel]["HP"][1],
        mp: esper.stats[maxLevel]["MP"][1],
        atk: esper.stats[maxLevel]["ATK"][1],
        def: esper.stats[maxLevel]["DEF"][1],
        mag: esper.stats[maxLevel]["MAG"][1],
        spr: esper.stats[maxLevel]["SPR"][1],
        killers: getEsperKillers(esper),
        resist: getresists(esper)
    };
    espers.push(esperObject);
}

fs.writeFileSync('espers.json', JSON.stringify(espers, null, 2));

//resists are formated as follows:
// "resist": {
//     "1": [{
//         "name": "lightning",
//         "percent": -50
//     }, {
//         "name": "water",
//         "percent": 50
//     }],
//     "2": [{
//         "name": "lightning",
//         "percent": -50
//     }, {
//         "name": "water",
//         "percent": 50
//     }],
//     "3": [{
//         "name": "lightning",
//         "percent": -50
//     }, {
//         "name": "water",
//         "percent": 50
//     }, {
//         "name": "sleep",
//         "percent": 100
//     }]
// },

// BUT there are also resists that need to be included that are in the nodes of the esper board
// "nodes": [{
//     "children": [{
//         "children": [{
//             "children": [{
//                 "children": [{
//                     "children": [{
//                         "children": [{
//                             "children": [{
//                                 "children": [],
//                                 "cost": {
//                                     "SP": 350,
//                                     "Galvanite": 1
//                                 },
//                                 "position": [-5, -4],
//                                 "special": ["[Bird Killer [Stat Break I]|ability_79.png]:Increase physical and magic damage against Avians by 10% [Ignore parameter limit]"]
//                             }],
//                             "cost": {
//                                 "SP": 100
//                             },
//                             "position": [-4, -4],
//                             "special": ["[Hero's Rime|ability_100.png]:Increase all stats by 150% for 3 turns to all allies while singing"]
//                         }],
//                         "cost": {
//                             "SP": 80
//                         },
//                         "position": [-3, -4],
//                         "atk": 100
//                     }],
//                     "cost": {
//                         "SP": 30
//                     },
//                     "position": [-2, -3],
//                     "atk": 65
//                 }],
//                 "cost": {
//                     "SP": 30
//                 },
//                 "position": [-3, -3],
//                 "atk": 55
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [-3, -2],
//             "atk": 45
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [-2, -2],
//         "special": ["[Alluring Air|ability_100.png]:Inflict Confusion (80%) on all enemies"]
//     }],
//     "cost": {
//         "SP": 5
//     },
//     "position": [-1, -1],
//     "atk": 35
// }, {
//     "children": [{
//         "children": [{
//             "children": [{
//                 "children": [],
//                 "cost": {
//                     "SP": 80
//                 },
//                 "position": [-2, -4],
//                 "special": ["[Camouflage|ability_84.png]:Reduce chance of being targeted by 50%"]
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [-1, -3],
//             "special": ["[Attack Song|ability_100.png]:Increase ATK by 230% for 3 turns to all allies while singing"]
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [-1, -2],
//         "special": ["[Analyze|ability_2.png]:Allows you to view info on an enemy"]
//     }, {
//         "children": [{
//             "children": [{
//                 "children": [{
//                     "children": [{
//                         "children": [],
//                         "cost": {
//                             "SP": 100
//                         },
//                         "position": [1, -3],
//                         "special": ["[Bewitching Evocation|ability_77.png]:Increase summoning damage of Siren by 50%"]
//                     }, {
//                         "children": [],
//                         "cost": {
//                             "SP": 350,
//                             "Galvanite": 2
//                         },
//                         "position": [1, -4],
//                         "special": ["[Bird Killer [Stat Break II]|ability_79.png]:Increase physical and magic damage against Avians by 20% [Ignore parameter limit]"]
//                     }],
//                     "cost": {
//                         "SP": 90
//                     },
//                     "position": [0, -4],
//                     "special": ["[Bewitching Evocation|ability_77.png]:Increase summoning damage of Siren by 50%"]
//                 }],
//                 "cost": {
//                     "SP": 80
//                 },
//                 "position": [-1, -4],
//                 "mag": 100
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [0, -3],
//             "mag": 40
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [0, -2],
//         "mag": 30
//     }],
//     "cost": {
//         "SP": 5
//     },
//     "position": [0, -1],
//     "mag": 25
// }, {
//     "children": [{
//         "children": [{
//             "children": [{
//                 "children": [{
//                     "children": [],
//                     "cost": {
//                         "SP": 90
//                     },
//                     "position": [-4, -3],
//                     "esperStatsBonus": {
//                         "hp": 20,
//                         "mp": 20,
//                         "atk": 20,
//                         "def": 20,
//                         "mag": 20,
//                         "spr": 20
//                     }
//                 }],
//                 "cost": {
//                     "SP": 80
//                 },
//                 "position": [-4, -2],
//                 "hp": 400
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [-3, -1],
//             "special": ["[Defense Song|ability_100.png]:Increase DEF by 230% for 3 turns to all allies while singing"]
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [-2, -1],
//         "special": ["[Lullaby|ability_100.png]:Inflict Sleep (80%) on all enemies"]
//     }, {
//         "children": [{
//             "children": [{
//                 "children": [{
//                     "children": [],
//                     "cost": {
//                         "SP": 90
//                     },
//                     "position": [-4, -1],
//                     "esperStatsBonus": {
//                         "hp": 20,
//                         "mp": 20,
//                         "atk": 20,
//                         "def": 20,
//                         "mag": 20,
//                         "spr": 20
//                     }
//                 }, {
//                     "children": [{
//                         "children": [],
//                         "cost": {
//                             "SP": 50
//                         },
//                         "position": [-5, -2],
//                         "mag": 500
//                     }],
//                     "cost": {
//                         "SP": 50
//                     },
//                     "position": [-5, -1],
//                     "def": 500
//                 }, {
//                     "children": [{
//                         "children": [],
//                         "cost": {
//                             "SP": 50
//                         },
//                         "position": [-3, 2],
//                         "mag": 500
//                     }],
//                     "cost": {
//                         "SP": 50
//                     },
//                     "position": [-4, 1],
//                     "mag": 500
//                 }],
//                 "cost": {
//                     "SP": 80
//                 },
//                 "position": [-4, 0],
//                 "hp": 400
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [-3, 0],
//             "hp": 175
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [-2, 0],
//         "hp": 150
//     }],
//     "cost": {
//         "SP": 5
//     },
//     "position": [-1, 0],
//     "hp": 125
// }, {
//     "children": [{
//         "children": [{
//             "children": [{
//                 "children": [],
//                 "cost": {
//                     "SP": 80
//                 },
//                 "position": [2, -2],
//                 "special": ["[Imperil|ability_39.png]:Reduce resistance to all elements by 100% for 4 turns to one enemy"]
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [1, -2],
//             "special": ["[Deshell|ability_39.png]:Reduce SPR by 75% for 4 turns to one enemy"]
//         }, {
//             "children": [{
//                 "children": [],
//                 "cost": {
//                     "SP": 80
//                 },
//                 "position": [3, -1],
//                 "special": ["[Watera|ability_23.png]:Magic water damage (10x, MAG) to all enemies"]
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [2, -1],
//             "special": ["[Water|ability_23.png]:Magic water damage (1.2x, MAG) to one enemy", "[Water|ability_23.png]:Reduce resistance to Water by 100% for 5 turns to one enemy"],
//             "lbPerUse": {
//                 "min": 400,
//                 "max": 400
//             }
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [1, -1],
//         "special": ["[Blind|ability_14.png]:Inflict Blind (100%) on one enemy"]
//     }, {
//         "children": [{
//             "children": [{
//                 "children": [{
//                     "children": [],
//                     "cost": {
//                         "SP": 100
//                     },
//                     "position": [4, 1],
//                     "special": ["[Vigor Voice|ability_100.png]:Reduce MP consumed by songs by 25%"]
//                 }, {
//                     "children": [{
//                         "children": [],
//                         "cost": {
//                             "SP": 50
//                         },
//                         "position": [3, -2],
//                         "spr": 750
//                     }],
//                     "cost": {
//                         "SP": 50
//                     },
//                     "position": [4, -1],
//                     "spr": 750
//                 }, {
//                     "children": [{
//                         "children": [],
//                         "cost": {
//                             "SP": 50
//                         },
//                         "position": [5, 2],
//                         "spr": 750
//                     }],
//                     "cost": {
//                         "SP": 50
//                     },
//                     "position": [5, 1],
//                     "spr": 750
//                 }],
//                 "cost": {
//                     "SP": 80
//                 },
//                 "position": [4, 0],
//                 "mp": 125
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [3, 0],
//             "mp": 30
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [2, 0],
//         "mp": 25
//     }],
//     "cost": {
//         "SP": 5
//     },
//     "position": [1, 0],
//     "mp": 20
// }, {
//     "children": [{
//         "children": [{
//             "children": [{
//                 "children": [],
//                 "cost": {
//                     "SP": 80
//                 },
//                 "position": [-3, 1],
//                 "def": 100
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [-2, 1],
//             "def": 55
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [-1, 1],
//         "def": 45
//     }, {
//         "children": [{
//             "children": [{
//                 "children": [],
//                 "cost": {
//                     "SP": 80
//                 },
//                 "position": [-2, 2],
//                 "spr": 100
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [-1, 2],
//             "special": ["[Shell|ability_77.png]:Increase SPR by 100% for 4 turns to one ally", "[Shell|ability_77.png]:Reduce damage taken by magic attacks by 30% to one ally for 4 turns"]
//         }, {
//             "children": [{
//                 "children": [{
//                     "children": [{
//                         "children": [],
//                         "cost": {
//                             "SP": 90
//                         },
//                         "position": [1, 4],
//                         "special": ["[Angel Song|ability_100.png]:Restore 300 (+0.9x, Heal) MP split over 3 turns to all allies while singing"]
//                     }, {
//                         "children": [],
//                         "cost": {
//                             "SP": 350,
//                             "Galvanite": 1
//                         },
//                         "position": [-1, 4],
//                         "special": ["[Bird Killer [Stat Break I]|ability_79.png]:Increase physical and magic damage against Avians by 10% [Ignore parameter limit]"]
//                     }],
//                     "cost": {
//                         "SP": 80
//                     },
//                     "position": [0, 4],
//                     "mp": 100
//                 }],
//                 "cost": {
//                     "SP": 80
//                 },
//                 "position": [-1, 3],
//                 "hp": 350
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [0, 3],
//             "special": ["[Paean|ability_100.png]:Restore 3000 (+10.2x, Heal) HP split over 3 turns to all allies while singing"]
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [0, 2],
//         "special": ["[Cure|ability_4.png]:Restore 150 (+3x, Heal) HP to target"]
//     }],
//     "cost": {
//         "SP": 5
//     },
//     "position": [0, 1],
//     "def": 35
// }, {
//     "children": [{
//         "children": [{
//             "children": [],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [3, 1],
//             "special": ["[Dispel|ability_3.png]:Remove all buffs and debuffs from one enemy"]
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [2, 1],
//         "special": ["[Silence|ability_14.png]:Inflict Silence (100%) on one enemy"]
//     }, {
//         "children": [{
//             "children": [{
//                 "children": [{
//                     "children": [{
//                         "children": [{
//                             "children": [{
//                                 "children": [],
//                                 "cost": {
//                                     "SP": 350,
//                                     "Galvanite": 1
//                                 },
//                                 "position": [5, 4],
//                                 "special": ["[Bird Killer [Stat Break I]|ability_79.png]:Increase physical and magic damage against Avians by 10% [Ignore parameter limit]"]
//                             }],
//                             "cost": {
//                                 "SP": 90
//                             },
//                             "position": [4, 4],
//                             "resist": [{
//                                 "name": "water",
//                                 "percent": 10
//                             }]
//                         }],
//                         "cost": {
//                             "SP": 90
//                         },
//                         "position": [4, 3],
//                         "resist": [{
//                             "name": "water",
//                             "percent": 10
//                         }]
//                     }],
//                     "cost": {
//                         "SP": 80
//                     },
//                     "position": [4, 2],
//                     "special": ["[Barwatera|ability_18.png]:Increase resistance to Water by 60% for 4 turns to all allies"]
//                 }],
//                 "cost": {
//                     "SP": 30
//                 },
//                 "position": [3, 2],
//                 "special": ["[Barwater|ability_18.png]:Increase resistance to Water by 60% for 4 turns to one ally"]
//             }],
//             "cost": {
//                 "SP": 10
//             },
//             "position": [2, 2],
//             "special": ["[Cleanse|ability_3.png]:Cure Disease for one ally"]
//         }, {
//             "children": [{
//                 "children": [{
//                     "children": [{
//                         "children": [{
//                             "children": [],
//                             "cost": {
//                                 "SP": 80
//                             },
//                             "position": [2, 4],
//                             "special": ["[Chant|ability_100.png]:Increase DEF and SPR by 200% for 3 turns to all allies while singing"]
//                         }],
//                         "cost": {
//                             "SP": 80
//                         },
//                         "position": [3, 4],
//                         "spr": 100
//                     }],
//                     "cost": {
//                         "SP": 30
//                     },
//                     "position": [3, 3],
//                     "spr": 45
//                 }],
//                 "cost": {
//                     "SP": 30
//                 },
//                 "position": [2, 3],
//                 "spr": 40
//             }],
//             "cost": {
//                 "SP": 30
//             },
//             "position": [1, 3],
//             "spr": 35
//         }],
//         "cost": {
//             "SP": 10
//         },
//         "position": [1, 2],
//         "spr": 30
//     }],
//     "cost": {
//         "SP": 5
//     },
//     "position": [1, 1],
//     "spr": 25
// }],

function getresists(esper) {
    const resists = [];
    // consider the esper.resists object and the esper.nodes object
    // for each node, check if it has a resist
    // if it does, add it to the resists array
    // if it doesn't, move on to the next node
    // if it has children, check those children for resists
    for (let i = 0; i < esper.resist.length; i++) {
        const resist = {
            name: esper.resist[i].name,
            percent: esper.resist[i].percent
        };
        resists.push(resist);
    }

    for (let i = 0; i < esper.nodes.length; i++) {
        const node = esper.nodes[i];
        if (node.resist) {
            for (let j = 0; j < node.resist.length; j++) {
                const resist = {
                    name: node.resist[j].name,
                    percent: node.resist[j].percent
                };
                resists.push(resist);
            }
        }
        if (node.children) {
            for (let j = 0; j < node.children.length; j++) {
                const child = node.children[j];
                if (child.resist) {
                    for (let k = 0; k < child.resist.length; k++) {
                        const resist = {
                            name: child.resist[k].name,
                            percent: child.resist[k].percent
                        };
                        resists.push(resist);
                    }
                }
            }
        }
    }

    // total resists
    const totalResists = [];
    for (let i = 0; i < resists.length; i++) {
        let resist = resists[i];
        let found = false;
        for (let j = 0; j < totalResists.length; j++) {
            if (totalResists[j].name === resist.name) {
                totalResists[j].percent += resist.percent;
                found = true;
                break;
            }
        }
        if (!found) {
            totalResists.push(resist);
        }
    }
}

function getEsperKillers(esper) {
    const killers = [];
    for (let i = 0; i < esper.nodes.length; i++) {
        const node = esper.nodes[i];
        if (node.children) {
            for (let j = 0; j < node.children.length; j++) {
                const child = node.children[j];
                if (child.children) {
                    for (let k = 0; k < child.children.length; k++) {
                        const grandchild = child.children[k];
                        if (grandchild.killers) {
                            for (let l = 0; l < grandchild.killers.length; l++) {
                                const killer = grandchild.killers[l];
                                killers.push(killer);
                            }
                        }
                    }
                }
            }
        }
    }
    return killers;
}
