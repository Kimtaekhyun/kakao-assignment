// 내가 저장할 투두 배열이랑 지금 보고 있는 탭 상태
let myTasks = [];
let nowViewing = 'all'; 

let clickedDate = new Date();
clickedDate.setHours(0, 0, 0, 0);

function makeDateString(d) {
    let yyyy = d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();

    if (mm < 10) { 
        mm = '0' + mm; 
    }
    if (dd < 10) { 
        dd = '0' + dd; 
    }
    
    return yyyy + '-' + mm + '-' + dd;
}

// 로컬스토리지에 저장
function saveToBrowser() {
    localStorage.setItem('my_todo_data', JSON.stringify(myTasks));
}

// 켤 때 저장된 데이터 가져오는 함수
function loadFromBrowser() {
    let savedData = localStorage.getItem('my_todo_data');
    if (savedData !== null) {
        myTasks = JSON.parse(savedData);
    }
}

// HTML에 있는 태그들 가져오기
const inputBox = document.getElementById('todo-input');
const plusBtn = document.getElementById('add-button');
const ulTag = document.getElementById('todo-list');
const tabButtons = document.querySelectorAll('.filter-btn');

const leftBtn = document.getElementById('prev-week-btn');
const rightBtn = document.getElementById('next-week-btn');
const monthText = document.getElementById('current-month-display');
const calendarBox = document.getElementById('week-days');

let calendarBaseDate = new Date(clickedDate);

// 할 일 등록
function addNewTask() {
    let textValue = inputBox.value.trim();

    if (textValue === '') {
        alert('할 일을 입력해 주세요.');
        return;
    }

    let newTaskObj = {
        id: Date.now(),
        text: textValue,
        isDone: false,
        dateStr: makeDateString(clickedDate)
    };

    myTasks.push(newTaskObj);
    saveToBrowser();
    inputBox.value = '';
    
    showMyTasks();
}

function clickTab(event) {

    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    event.target.classList.add('active');

    nowViewing = event.target.dataset.filter;
    showMyTasks();
}

function showMyTasks() {
    ulTag.innerHTML = '';

    let todayStr = makeDateString(clickedDate);
    
    let dateMatchedTasks = [];
    for (let i = 0; i < myTasks.length; i++) {
        let task = myTasks[i];

        if (task.dateStr === todayStr || task.dateStr === undefined) {
            dateMatchedTasks.push(task);
        }
    }

    let finalTasks = [];
    for (let i = 0; i < dateMatchedTasks.length; i++) {
        let task = dateMatchedTasks[i];
        
        if (nowViewing === 'all') {
            finalTasks.push(task);
        } else if (nowViewing === 'active') {
            if (task.isDone === false) {
                finalTasks.push(task);
            }
        } else if (nowViewing === 'completed') {
            if (task.isDone === true) {
                finalTasks.push(task);
            }
        }
    }

    // 할 일 데이터 없을 때 안내 문구
    if (finalTasks.length === 0) {
        let emptyLi = document.createElement('li');
        emptyLi.style.textAlign = 'center';
        emptyLi.style.padding = '20px';
        emptyLi.style.color = '#b2bec3';
        emptyLi.textContent = '등록된 할 일이 없습니다.';
        ulTag.appendChild(emptyLi);
    }

    for (let i = 0; i < finalTasks.length; i++) {
        let item = finalTasks[i];

        let li = document.createElement('li');
        li.className = 'todo-item';
        if (item.isDone === true) {
            li.classList.add('completed');
        }

        let spanText = document.createElement('span');
        spanText.className = 'todo-text';
        spanText.textContent = item.text;

        let btnWrap = document.createElement('div');
        btnWrap.className = 'button-group';

        // 완료 버튼
        let doneBtn = document.createElement('button');
        doneBtn.className = 'action-btn complete-btn';
        if (item.isDone === true) {
            doneBtn.textContent = '취소';
        } else {
            doneBtn.textContent = '완료';
        }
        doneBtn.addEventListener('click', function() {
            changeDoneState(item.id);
        });

        // 수정 버튼 만들기
        let editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = '수정';
        
        editBtn.addEventListener('click', function() {
            if (editBtn.textContent === '수정') {
                // 글씨 부분을 지우고 글씨 쓸 수 있는 인풋창 집어넣기
                let inputForEdit = document.createElement('input');
                inputForEdit.type = 'text';
                inputForEdit.className = 'edit-input';
                inputForEdit.value = item.text;
                
                li.insertBefore(inputForEdit, spanText);
                li.removeChild(spanText);
                
                editBtn.textContent = '저장';
                inputForEdit.focus();
                
                // 엔터 쳐도 저장되게
                inputForEdit.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        editBtn.click();
                    }
                });
            } else {

                let currentInput = li.querySelector('.edit-input');
                let changedText = currentInput.value.trim();
                
                if (changedText !== '') {

                    for (let j = 0; j < myTasks.length; j++) {
                        if (myTasks[j].id === item.id) {
                            myTasks[j].text = changedText;
                        }
                    }
                    saveToBrowser();
                    showMyTasks();
                } else {
                    alert('할 일을 입력해 주세요.');
                }
            }
        });

        // 삭제 버튼
        let delBtn = document.createElement('button');
        delBtn.className = 'action-btn delete-btn';
        delBtn.textContent = '삭제';
        delBtn.addEventListener('click', function() {
            removeTask(item.id);
        });

        btnWrap.appendChild(doneBtn);
        btnWrap.appendChild(editBtn);
        btnWrap.appendChild(delBtn);

        li.appendChild(spanText);
        li.appendChild(btnWrap);
        ulTag.appendChild(li);
    }

    drawWeeklyCalendar();
}

// 완료 상태 (체크.해제)
function changeDoneState(targetId) {
    for (let i = 0; i < myTasks.length; i++) {
        if (myTasks[i].id === targetId) {
            myTasks[i].isDone = !myTasks[i].isDone;
        }
    }
    saveToBrowser();
    showMyTasks();
}

// 할 일 지우기
function removeTask(targetId) {
    let newArray = [];
    for (let i = 0; i < myTasks.length; i++) {
        if (myTasks[i].id !== targetId) {
            newArray.push(myTasks[i]);
        }
    }
    myTasks = newArray;
    saveToBrowser();
    showMyTasks(); 
}

for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener('click', clickTab);
}

plusBtn.addEventListener('click', addNewTask);
inputBox.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addNewTask();
    }
});


// 이번 주 월요일이 며칠인지 찾아주는 함수
function findMonday(dateObj) {
    let d = new Date(dateObj);
    let dayOfWeek = d.getDay();
    // 요일 초기화
    let adjust = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(d.setDate(adjust));
}

function drawWeeklyCalendar() {
    calendarBox.innerHTML = '';
    
    let mondayDate = findMonday(calendarBaseDate);
    let currentMonth = mondayDate.getMonth() + 1;
    let currentYear = mondayDate.getFullYear();
    monthText.textContent = currentYear + '년 ' + currentMonth + '월';

    let dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
    
    let realTodayStr = makeDateString(new Date());
    let clickedDateStr = makeDateString(clickedDate);

    for (let i = 0; i < 7; i++) {
        let tempDate = new Date(mondayDate);
        tempDate.setDate(mondayDate.getDate() + i);
        
        let dateStr = makeDateString(tempDate);

        let taskCount = 0;
        for (let j = 0; j < myTasks.length; j++) {
            if (myTasks[j].dateStr === dateStr) {
                taskCount++;
            }
        }

        let dayDiv = document.createElement('div');
        dayDiv.className = 'day-item';
        
        if (dateStr === clickedDateStr) {
            dayDiv.classList.add('selected');
        }
        if (dateStr === realTodayStr) {
            dayDiv.classList.add('today');
        }

        dayDiv.innerHTML = `
            <span class="day-name">${dayLabels[i]}</span>
            <span class="day-number">${tempDate.getDate()}</span>
            <span class="todo-count">${taskCount}</span>
        `;

        dayDiv.addEventListener('click', function() {
            clickedDate = new Date(tempDate);
            drawWeeklyCalendar();
            showMyTasks();
        });

        calendarBox.appendChild(dayDiv);
    }
}

// 저번주, 다음주 화살표 버튼
leftBtn.addEventListener('click', function() {
    calendarBaseDate.setDate(calendarBaseDate.getDate() - 7);
    drawWeeklyCalendar();
});

rightBtn.addEventListener('click', function() {
    calendarBaseDate.setDate(calendarBaseDate.getDate() + 7);
    drawWeeklyCalendar();
});

loadFromBrowser();
drawWeeklyCalendar();
showMyTasks();