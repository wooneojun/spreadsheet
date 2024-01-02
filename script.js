//스프레드 시트의 몸통을 만드는 스크립트
const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphapets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T","U","V","W","X","Y","Z"];

//각 셀마다의 데이터를 담는 클래스
class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false){
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.rowName = rowName;
        this.columnName = columnName;
        this.column = column;
        this.active = active;
    }
}

exportBtn.onclick = function(e){
    //csv 파일로 변환
    let csv = "";
    for (let i = 0; i < spreadsheet.length; i++){
        //첫 번째 행 무시
        if(i === 0){continue;}
        csv +=
            spreadsheet[i]
                .filter(item => !item.isHeader)
                .map(item => item.data)
                .join(",") + "\r\n";
    }
    //csv 파일 다운로드
    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csv', csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = "Spreadsheet File Name.csv";
    a.click();
}


//기본 데이터 생성
function initSpreadsheet() {
    for (let i = 0; i < COLS; i++){
        let spreadsheetRow = [];
        for(let j = 0; j < ROWS; j++){
            // 0번째 행과 열은 헤더로 사용
            let cellData = "";
            let isHeader = false;
            let disabled = false;
            // 모든 row 첫번째 column 은 헤더로 사용
            if(j === 0){
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            if(i === 0){
                isHeader = true;
                cellData = alphapets[j - 1];
                disabled = true;
            }
            //첫 번째 row는 빈칸으로 사용
            if(!cellData){
                cellData = "";
            }

            const rowName = i;
            const columnName = alphapets[j - 1];

            // 각 데이터를 담는 셀을 생성
            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    console.log(spreadsheet);
}

//셀 생성하는 함수
function createCellEl(cell){
    const cellEl = document.createElement("input");
    cellEl.className = "cell";
    cellEl.id = "cell_" + cell.row  + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;
    //헤더인지 아닌지 확인하는 데이터
    if (cell.isHeader){
        cellEl.classList.add("header");
    }

    //셀이 클릭되었을 때 헤더 색상 변경
    cellEl.onclick = () => handleCellClick(cell);
    //셀이 변경되었을 때 데이터 변경
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

    return cellEl;
}

//셀이 변경되었을 때 데이터 변경
function handleOnChange(data, cell){
    cell.data = data;
}

//셀이 클릭되었을 때 헤더 색상 변경
function handleCellClick(cell){
    clearHeaderActiveStates();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderEl = getElfromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElfromRowCol(rowHeader.row, rowHeader.column);
    columnHeaderEl.classList.add("active");
    rowHeaderEl.classList.add("active");
    document.querySelector("#cell-status").innerHTML = cell.columnName + cell.rowName;
}

function clearHeaderActiveStates(){
    const headers = document.querySelectorAll(".header");
    headers.forEach((header) => {
        header.classList.remove("active");
    });
}

function getElfromRowCol(row, col){
    return document.querySelector("#cell_" + row + col);
}


//Cell 을 랜더링하는 함수
function drawSheet(){
    for(let i = 0; i < spreadsheet.length; i++){
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";
        for(let j = 0; j < spreadsheet[i].length; j++){
            const cell = spreadsheet[i][j];
            rowContainerEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}

initSpreadsheet();

//헤더인지 아닌지 확인하는 데이터
