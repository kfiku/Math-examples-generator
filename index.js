function getSettings() {
    const defaults = {
        examples: 1000,
        operations: ['+', '-', '*', ':'],
        maxEquals: 300,

        termOneMin: 1,
        termOneMax: 10,
        termTwoMin: 2,
        termTwoMax: 9,
    }

    const settings = JSON.parse(localStorage.getItem('settings'));

    return settings ?
        {...defaults, ...settings} :
        defaults;
}

function setSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
}

function randomize(props) {
    const {
        operations,
        maxEquals,
        termOneMin,
        termOneMax,
        termTwoMin,
        termTwoMax
    } = props
    const examples = 1000;
    const data = [];


    for (let index = 0; index < examples; index++) {
        const operationIndex = Math.floor(Math.random() * operations.length)
        const operation = operations[operationIndex];
        const termOne = operation === ':'
            ? (Math.round(Math.random() * (maxEquals - termOneMin)) + termOneMin)
            : (Math.round(Math.random() * (termOneMax - termOneMin)) + termOneMin)
        ;
        const termTwo = Math.round(Math.random() * (termTwoMax - termTwoMin)) + termTwoMin;
        const result = getResult(termOne, termTwo, operation)

        if (operation === '+' && termOne + termTwo > maxEquals) {
            continue;
        }

        if (operation === '*' && termOne * termTwo > maxEquals) {
            continue;
        }

        if (operation === ':' && !validateDivision(termOne, termTwo, termOneMax)) {
            continue;
        }

        if (operation === '-' && termOne - termTwo < 0) {
            continue;
        }

        const operationToPrint = operation === '*' ? "·" : operation;

        const operationString = `${termOne} ${operationToPrint} ${termTwo} = `
            // + `${result}`

        data.push(operationString);
    }

    const uniq = data
        .filter(onlyUnique)
        .filter((_, index) => index < 120)

    return uniq;
}

function validateDivision(termOne, termTwo, maxEquals) {
    if (termOne / termTwo === Math.round(termOne / termTwo)) {
        if (termOne / termTwo <= maxEquals) {
            return true
        }
    }

    return false;
}

function getResult(termOne, termTwo, operation) {
    switch (operation) {
        case '+':
            return termOne + termTwo;
        case '-':
            return termOne - termTwo;
        case '*':
            return termOne * termTwo;
        case ':':
            return termOne / termTwo;

        default:
            break;
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function chunk(arr, chunkSize) {
    var chunked = [];
    for (var i = 0; i < arr.length; i += chunkSize) {
        chunked.push(arr.slice(i, i + chunkSize));
    }
    return chunked;
}

function render({ data }) {
    const columnWidth = Math.round(10000 / data[0].length) / 100;

    let html = `<table>`;

    data.forEach(row => {
        html += `<tr>
            ${row.map(el => `
                <td style="width: ${columnWidth}%">
                    ${el}
                </td>
            `).join('')}
        </tr>`;
    });

    html += `<table>`

    const tableBox = document.getElementById('tableBox');

    tableBox.innerHTML = html;
}

function insertDefaults() {
    const maxEquals = document.getElementById('maxEquals');
    const operations = document.getElementById('operations');
    const termOneMin = document.getElementById('termOneMin');
    const termOneMax = document.getElementById('termOneMax');
    const termTwoMin = document.getElementById('termTwoMin');
    const termTwoMax = document.getElementById('termTwoMax');

    const settings = getSettings();

    maxEquals.value = settings.maxEquals;
    termOneMin.value = settings.termOneMin;
    termOneMax.value = settings.termOneMax;
    termTwoMin.value = settings.termTwoMin;
    termTwoMax.value = settings.termTwoMax;

    const optionsArray = Array.from(operations.options)
    optionsArray.forEach(option => { option.selected = false });

    settings.operations.forEach(operation => {
        optionsArray.find(option => option.value === operation).selected = true
    })
}

function getSelectedValues(select) {
    return Array.from(select.options)
        .map(option => option.selected ? option.value : null)
        .filter(Boolean)
}

function getSettingsFromForm() {
    const operations = getSelectedValues(document.getElementById('operations'));
    const maxEquals  = Number(document.getElementById('maxEquals').value);
    const termOneMin = Number(document.getElementById('termOneMin').value);
    const termOneMax = Number(document.getElementById('termOneMax').value);
    const termTwoMin = Number(document.getElementById('termTwoMin').value);
    const termTwoMax = Number(document.getElementById('termTwoMax').value);

    return {
        maxEquals,
        operations,
        termOneMin,
        termOneMax,
        termTwoMin,
        termTwoMax,
    }
}

function generate() {
    const settings = getSettingsFromForm();
    setSettings(settings);

    const randomData = randomize(settings);
    const chunked = chunk(randomData, 3);

    render({ data: chunked})
}

const generateBtn = document.getElementById('generate');

generateBtn.addEventListener('click', (event) => {
    event.preventDefault();

    generate();
})

insertDefaults();
generate();