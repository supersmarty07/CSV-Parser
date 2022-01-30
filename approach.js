//Class Row that takes in the columns as its arguments
class Row{
    constructor(date, transactionCode, cNumber, reference, amount, validity){
        this.date = date;
        this.transactionCode = transactionCode;
        this.validity = validity;
        this.cNumber = cNumber;
        this.reference = reference;
        this.amount = amount;
    }
}
//Algorithm to check validity of the code
let validChars = ['2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C',  'D', 'E', 'F', 'G', 'H', 'J', 'K','L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T',  'U', 'V', 'W', 'X', 'Y', 'Z']; 
function verifyKey(key) 
{ 
if (key.length != 10) 
return false; 
let checkDigit = generateCheckCharacter(key.toUpperCase().substring(0,  9));
return key[9] == checkDigit;
} 
// Implementation of algorithm for check digit. 
function generateCheckCharacter(input) 
{ 
let factor = 2; 
let sum = 0; 
let n = validChars.length; 
let codePoint; let addend;
 // Starting from the right and working leftwards is easier since  // the initial "factor" will always be "2" 
for (let i = input.length - 1; i >= 0; i--) 
{ 
    codePoint = validChars.indexOf(input[i]);   
    addend = factor * codePoint; 
 // Alternate the "factor" that each "codePoint" is multiplied by  
    factor = (factor == 2) ? 1 : 2; 
 // Sum the digits of the "addend" as expressed in base "n"  
    addend = (addend / n) + (addend % n); 
    sum += addend; 
} 
 // Calculate the number that must be added to the "sum"  // to make it divisible by "n" 
    let remainder = sum % n; 
    let checkCodePoint = (n - remainder) % n; 
    return validChars[Math.ceil(checkCodePoint)];
} 

//function to open the csv file
function uploadDealcsv () {}; 

uploadDealcsv.prototype.getCsv = function(e) {
    
    let input = document.getElementById('dealCsv');
    input.addEventListener('change', function() {

    if (this.files && this.files[0]) {

    var myFile = this.files[0];
        var reader = new FileReader();
        
        reader.addEventListener('load', function (e) {
            
            let csvdata = e.target.result; 
              parseCsv.getParsecsvdata(csvdata); // calling function for parse csv data 
        });
        
        reader.readAsBinaryString(myFile);
    }
    });
}
//Method for parse csv data and display
uploadDealcsv.prototype.getParsecsvdata = function(data) {

    let parsedata = [];
    let obj = {};
    let headingColumns = ['Date', 'Transaction Code', 'Customer Number', 'Reference', 'Amount', 'Validity'];
    let heading = new Row(...headingColumns);
    let keys = [];

    let newLinebrk = data.split("\n");
    for(let i = 0; i < newLinebrk.length; i++) {
        parsedata.push(newLinebrk[i].split(","))
    }
    array = parsedata.splice(1);
    for(let i =0; i<array.length; i++){
        keys.push(i);
    }
    obj = keys.reduce(function(acc, curr, i) {
        acc[curr] = new Row(...array[i]);
        return acc;
    }, {});

    //sorting date
    let rows = Object.values(obj);
    rows.sort(function compare(a, b) {
        var dateA = new Date((a.date).slice(0, 14));
        var dateB = new Date((b.date).slice(0, 14));
        return dateA - dateB;
    });
    rows.unshift(heading);
    for(let i = 0; i < rows.length; i++){
        rows[i].validity = verifyKey(rows[i].transactionCode);
    }
//function to create table
function createTable(data){
    
    let table = document.getElementById('table');
    let tr = document.createElement('tr');
    
    for (i = 0; i < headingColumns.length; i++) { 
        tr.appendChild(document.createElement('td'));
    }
    
    for (i = 0; i < data.length - 1; i++) { 
        table.appendChild(tr.cloneNode(true));
    }
    cells = table.getElementsByTagName('td');
    table.appendChild(tr);
    let a = 0;
    for(j = 0; j < headingColumns.length * data.length; j += 6){
        cells[0 + j].innerHTML = data[a].date;
        cells[1 + j].innerHTML = data[a].transactionCode;
        j < 1 ? cells[2 + j].innerHTML = "Validity" : cells[2 + j].innerHTML =  data[a].validity;
        cells[3 + j].innerHTML = data[a].cNumber;
        cells[4 + j].innerHTML = data[a].reference;
        cells[5 + j].innerHTML = data[a].amount/100 ? data[a].amount/100 : "Amount";
        a++;
    }
}
    createTable(rows);
}
//running the function
var parseCsv = new uploadDealcsv();
parseCsv.getCsv();  
