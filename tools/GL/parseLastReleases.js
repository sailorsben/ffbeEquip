import fs from 'fs';

console.log("Starting...");

function getTodaysDateFormatted() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const nth = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
        }
    };
    const currentDate = new Date();
    const day = currentDate.getDate();
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();

    return `${months[monthIndex]} ${day}${nth(day)}, ${year}`;
}

function readDataJson() {
    const dataContent = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(dataContent);
}

function filterItems(items, data) {
    return items.filter(item => {
        const itemData = data[item];
        return !(itemData && (itemData.tmrUnit || itemData.stmrUnit));
    });
}

function parseNewContent(content, data) {
    const sections = content.split('Starting').slice(1);
    const rawItems = sections[0] ? sections[0].trim().split('\n') : [];
    const units = sections[1] ? sections[1].trim().split('\n') : [];

    // Filter and remove duplicates
    const uniqueUnits = Array.from(new Set(units.map(line => line.match(/\d+/)[0]))).filter(id => !units.includes(id.replace(/07$/, '17')));
    let uniqueItems = Array.from(new Set(rawItems.map(line => line.match(/\d+/)[0])));

    // Filter out items based on data.json
    uniqueItems = filterItems(uniqueItems, data);

    return {
        date: getTodaysDateFormatted(),
        sources: [
            { type: "banner", units: uniqueUnits },
            { type: "storyPart", name: "Items", ids: uniqueItems }
        ]
    };
}

// This function takes the new release object and returns a string with the desired formatting
function serializeReleaseObjectForPrepend(releaseObject) {
    const sourcesFormatted = releaseObject.sources.map(source => {
        const type = `"type": "${source.type}"`;
        const unitsOrIdsKey = source.units ? 'units' : 'ids';
        const name = source.name ? `"name": "${source.name}", ` : '';
        const unitsOrIdsValue = source[unitsOrIdsKey].map(id => `"${id}"`).join(', ');
        const unitsOrIds = `"${unitsOrIdsKey}": [${unitsOrIdsValue}]`;

        if (name) {
            return `\t\t\t{${type}, ${name}${unitsOrIds}}`;
        } else {
            return `\t\t\t{${type}, ${unitsOrIds}}`;
        }
    }).join(',\n');

    // Adjusting the final line to not include a newline character before the closing brace
    return `{\n\t\t"date": "${releaseObject.date}",\n\t\t"sources": [\n${sourcesFormatted}\n\t\t]\n\t}`;
}

function prependNewReleaseToExistingData(filePath, newReleaseObject) {
    const existingContent = fs.readFileSync(filePath, 'utf-8');
    const newReleaseString = serializeReleaseObjectForPrepend(newReleaseObject);
    // Correctly format the insertion of the newReleaseString to ensure no extra newlines are introduced
    // Adjusted to remove the initial newline character that leads to the empty line issue
    const updatedContent = `[\n\t${newReleaseString},` + existingContent.slice(1);

    fs.writeFileSync(filePath, updatedContent);
}


// Assuming these functions are defined correctly in your script
const data = readDataJson(); // Reads additional data for item filtering
const newContent = fs.readFileSync('newItems.txt', 'utf-8');
const newRelease = parseNewContent(newContent, data); // Parses newItems.txt and applies any necessary filtering

// File path to the existing releases JSON
const filePath = '../../static/GL/lastItemReleases.json';
// Prepend the new release to the existing data
prependNewReleaseToExistingData(filePath, newRelease);

console.log("Done.");