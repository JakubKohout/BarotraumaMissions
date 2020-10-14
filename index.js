const fs = require('fs').promises,
    xml2js = require('xml2js'),
    xpath = require("xml2js-xpath"),
    path = require('path');

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const parseEventSets = (root) => {
    const matches = xpath.find(root, '//EventSet');
    matches.forEach((eventSet)=> {
        if (eventSet.$.chooserandom === 'true' && eventSet.MonsterEvent != null) {
            eventSet.MonsterEvent = shuffle(eventSet.MonsterEvent);
        }
        if (eventSet.$.chooserandom === 'true' && eventSet.EventSet != null) {
            eventSet.EventSet = shuffle(eventSet.EventSet);
        }
        parseEventSets(eventSet);
    });
};

const run = async () => {
    const data = await fs.readFile(path.join(__dirname, '/randomEventsOriginal.xml'));
    const result = await parser.parseStringPromise(data);
    parseEventSets(result);

    const xml = builder.buildObject(result);
    await fs.writeFile(path.join(__dirname, '/shuffled.xml'), xml);
};

run().catch(function (e){
    console.error(e);
});