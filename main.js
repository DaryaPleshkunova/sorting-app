(() => {
  function addStudent() {
    // ФИО
    const name = createStudentFullName();
    if (name === false) return false;

    // поле с датой рождения
    const birthDateInput = document.getElementById('student-birth-date-input');
    const birthDay = transformBirthDate(birthDateInput).transformedDate;
    const age = getAge(birthDateInput);
    const birthDate = `${birthDay}, (${age.age} ${age.ageLabel})`;

    // годы обучения
    const studyYears = calcStudyYears();
    if (studyYears === false) return false;
    const department = validateDepartmentInput();
    if (department === false) return false;

    const student = {
      name,
      birthDate,
      studyYears,
      department,
    };

    arrOfStudents.push(student);
    return student
  }

  // Функции отрисовки таблицы

  function addTableRow(student) {
    const studentName = document.createElement('td');
    studentName.textContent = student.name;
    const studentDepartment = document.createElement('td');
    studentDepartment.textContent = student.department;
    const studentBirthDate = document.createElement('td');
    studentBirthDate.textContent = student.birthDate;
    const studentStudyYears = document.createElement('td');
    studentStudyYears.textContent = student.studyYears;

    const tableRow = document.createElement('tr');
    tableRow.append(studentName);
    tableRow.append(studentDepartment);
    tableRow.append(studentBirthDate);
    tableRow.append(studentStudyYears);

    const tableBody = document.getElementById('table-body');
    tableBody.append(tableRow);
  }

  function addTable(array) {
    for (let eachPosition of array) {
      addTableRow(eachPosition);
    }
  }

  function removeTable() {
    const tableBody = document.getElementById('table-body');

    const arrayOfChildren = Array.from(tableBody.children);
    for (let item of arrayOfChildren) {
      item.remove();
    }
  }

  // Функции валидации

  function returnInitialState(input) {
    const inputValue = input.value.toString().trim();
    const warning = input.parentNode.querySelector('.text-danger');
    warning.textContent = '';
    input.style.borderColor = '';
    return { inputValue, warning };
  }

  function validateIsNotEmpty(input) {
    const inputValue = returnInitialState(input).inputValue;
    const warning = returnInitialState(input).warning;
    if (inputValue === '') {
      warning.textContent = 'Заполните это поле';
      input.style.borderColor = '#dc3545'
      return false
    }
  }

  function validateIncludesOnlyLetters(input) {
    const inputValue = returnInitialState(input).inputValue;
    const warning = returnInitialState(input).warning;

    const allowedLetters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz- ';
    const checkingString = Array.from(inputValue.toLowerCase());
    for (let item of checkingString) {
      if (allowedLetters.includes(item) === false) {
        warning.textContent = 'Введите буквы русского/латинского алфавита';
        return false;
      }
    }
  }

  function validateIsOneWord(input) {
    const inputValue = returnInitialState(input).inputValue;
    const warning = returnInitialState(input).warning;
    const arrOfStrings = inputValue.split(' ');
    if (arrOfStrings.length > 1) {
      warning.textContent = 'Введите одно слово';
      return false;
    }
  }

  function validateNameInput(input) {
    const isEmpty = validateIsNotEmpty(input);
    if (isEmpty === false) return false;
    const oneWord = validateIsOneWord(input);
    if (oneWord === false) return false;
    const includesOnlyLetters = validateIncludesOnlyLetters(input);
    if (includesOnlyLetters === false) return false;
    return input.value;
  }

  function validateDepartmentInput() {
    const studentDepartmentInput = document.getElementById('student-department-input');
    const isEmpty = validateIsNotEmpty(studentDepartmentInput);
    if (isEmpty === false) return false;
    const onlyLetters = validateIncludesOnlyLetters(studentDepartmentInput);
    if (onlyLetters === false) return false;
    const transformed = transformText(studentDepartmentInput.value);
    return transformed
  }

  function setMaxForEnterYearInput() {
    const enterYearInput = document.getElementById('student-enter-year-input');
    const currentYear = new Date().getFullYear();
    enterYearInput.max = currentYear;
  }

  function setMaxForBirthDateInput() {
    const birthDateInput = document.getElementById('student-birth-date-input');
    const currentDate = new Date();
    // привожу месяц к двузначному формату, заменяю индекс января с 0 на 1
    let currentMonth = currentDate.getMonth();
    currentMonth += 1;
    if (currentMonth < 10) {
      currentMonth = '0' + currentMonth;
    }
    // устанавливаю максимальное значение для др - сегодняшний день
    const today = `${currentDate.getFullYear()}-${currentMonth}-${currentDate.getDate()}`
    birthDateInput.max = today;
  }

  // Функции представления данных таблицы

  function transformText(text) {
    const lowerCaseString = text.toLowerCase();
    const firstLetter = lowerCaseString.charAt(0);
    const validatedString = lowerCaseString.replace(firstLetter, firstLetter.toUpperCase())
    return validatedString;
  }

  function createStudentFullName() {
    const nameInput = document.getElementById('student-name-input');
    const secondNameInput = document.getElementById('student-second-name-input');
    const lastNameInput = document.getElementById('student-last-name-input');

    let name = validateNameInput(nameInput);
    if (name === false) return false;
    let lastName = validateNameInput(lastNameInput);
    if (lastName === false) return false;
    let secondName = validateNameInput(secondNameInput);
    if (secondName === false) return false;

    name = transformText(name);
    secondName = transformText(secondName);
    lastName = transformText(lastName);

    const fullName = `${lastName} ${name} ${secondName}`;
    return fullName
  }

  function transformBirthDate(currentBirthDate) {
    currentBirthDate = document.getElementById('student-birth-date-input');
    let validatedBirthDate = validateIsNotEmpty(currentBirthDate);
    if (validatedBirthDate === false) return false;
    currentBirthDate = currentBirthDate.valueAsDate;
    // Привожу день и месяц к двузначному формату
    let currentDay = currentBirthDate.getDate()
    if (currentDay < 10) {
      currentDay = '0' + currentDay;
    }
    let currentMonth = currentBirthDate.getMonth() + 1;
    if (currentMonth < 10) {
      currentMonth = '0' + currentMonth;
    }

    const transformedDate = `${currentDay}.${currentMonth}.${currentBirthDate.getFullYear()}`;
    return { currentBirthDate, transformedDate };
  }

  function getAge(currentBirthDate) {
    const today = new Date;
    currentBirthDate = transformBirthDate().currentBirthDate;

    // вычисляю возраст
    let age = today.getFullYear() - currentBirthDate.getFullYear();
    if (currentBirthDate.getMonth() >= today.getMonth()) {
      if (currentBirthDate.getDate() > today.getDate()) {
        age -= 1;
      }
    }

    // добавляю надпись "... лет"
    const ageLastNumber = age.toString().slice(-1);
    let ageLabel;
    switch(ageLastNumber) {
      case '1':
        ageLabel = 'год';
        break;
      case '2':
      case '3':
      case '4':
        ageLabel = 'года';
        break;
      default: ageLabel = 'лет'
    }

    return { age, ageLabel };
  }

  function calcStudyYears() {
    const enterYearInput = document.getElementById('student-enter-year-input');
    const validatedYear = validateIsNotEmpty(enterYearInput);
    if (validatedYear === false) return false;
    const enterYear = Number(enterYearInput.value);
    const finishYear = enterYear + 4;
    const currentDate = new Date;

    // вычисляю курс
    let currentYear = currentDate.getFullYear() - enterYear;
    if (currentDate.getMonth() >= 8) {
      currentYear += 1;
    }

    // добавляю статус студента
    let courseLabel = currentYear + ' курс';
    if (enterYear === currentDate.getFullYear() && currentDate.getMonth() < 8) {
      courseLabel = 'Абитуриент';
    }
    if (finishYear < currentDate.getFullYear() || finishYear === currentDate.getFullYear() && currentDate.getMonth() >= 8) {
      courseLabel = 'Закончил';
    }

    const studyYears = `${enterYear} - ${finishYear} (${courseLabel})`;
    return studyYears
  }

  // Функции сортировки

  function sortBy(sortingArray, property, isSorted) {
    removeTable();
    if (property === 'name' || property === 'department') {
      sortStrings(sortingArray, property, isSorted);
    }
    if (property === 'year') {
      sortByEnterYear(sortingArray, isSorted);
    }
    if (property === 'birthdate') {
      sortByBirthDate(sortingArray, isSorted);
    }
    addTable(sortingArray);
  }

  function sortStrings(sortingArray, property, isSorted) {
    sortingArray.sort((a, b) => {
      if (isSorted) {
        let c = a;
        a = b;
        b = c;
      }

      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }

      return 0;
    })
  }

  function sortByEnterYear(sortingArray, isSorted) {
    sortingArray.sort((a, b) => {
      if (isSorted) {
        let c = a;
        a = b;
        b = c;
      }

      const yearA = Number(a.studyYears.split('-').shift());
      const yearB = Number(b.studyYears.split('-').shift());

      return yearA - yearB;
    })
  }

  function sortByBirthDate(sortingArray, isSorted) {
    sortingArray.sort((a, b) => {
      if (isSorted) {
        let c = a;
        a = b;
        b = c;
      }

      const dateA = a.birthDate.split(',').shift().split('.');
      const dateB = b.birthDate.split(',').shift().split('.');

      const yearA = dateA.pop();
      const monthA = dateA.pop();
      const dayA = dateA.pop();

      const yearB = dateB.pop();
      const monthB = dateB.pop();
      const dayB = dateB.pop();

      if (yearA < yearB) {
        return -1;
      }
      if (yearA > yearB) {
        return 1;
      }
      if (monthA < monthB) {
        return -1;
      }
      if (monthA > monthB) {
        return 1;
      }
      if (dayA < dayB) {
        return -1;
      }
      if (dayA > dayB) {
        return 1;
      }

      return 0;
    })
  }

  // Функции фильтрации

  function filterStrings(arrayToFilter, inputId, property) {
    const filter = document.getElementById(inputId).value.split(' ').filter(text => text.trim().length > 0).toString().replaceAll(',',' ').toLowerCase();
    if (filter !== '') {
      const filteredArray = arrayToFilter.filter(student => student[property].toLowerCase().includes(filter))
      return filteredArray
    } else return arrayToFilter
  }

  function filterYear(arrayToFilter, inputId, defineYear) {
    const filter = document.getElementById(inputId).value.toString();
    if (filter !== '') {
      if (filter.length === 4) {
        filteredArray = arrayToFilter.filter(student => {
          if (defineYear === 'finish') {
            return student.studyYears.split('-').pop().split('(').shift().trim().includes(filter);
          } else {
            return student.studyYears.split('-').shift().includes(filter);
          }
        })
        return filteredArray
      } else return arrayToFilter
    } else return arrayToFilter
  }

  let arrOfStudents = [];
  const startTable = JSON.parse(localStorage.getItem('studentTable'));
  if (startTable !== null) {
    addTable(startTable);
    arrOfStudents = startTable;
  }

  const addForm = document.getElementById('add-form');
  addForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const currentStudent = addStudent();
    if (currentStudent === false) return false;
    removeTable();
    addTable(arrOfStudents);

    // очищаю значения в полях
    const inputs = document.querySelectorAll('.form-control');
    for (let item of inputs) {
      item.value = '';
      item.blur();
    }

    localStorage.clear();
    localStorage.setItem('studentTable', JSON.stringify(arrOfStudents));
  })

  setMaxForEnterYearInput();
  setMaxForBirthDateInput();

  const nameColumnHeading = document.getElementById('name-column-heading');
  const studyYearsColumnHeading = document.getElementById('study-years-heading');
  const birthDateColumnHeading = document.getElementById('birth-date-heading');
  const departmentColumnHeading = document.getElementById('department-heading');

  let currentArrayOfStudents = arrOfStudents;
  const filtersHeading = document.getElementById('filters-heading');
  const filtersWrapper = document.getElementById('filters-wrapper');
  filtersHeading.addEventListener('click', () => {
    filtersWrapper.classList.toggle('flex-visible')
  })

  const filters = document.querySelectorAll('.filter-input');
  filters.forEach((e) => {
    e.addEventListener('input', () => {
      removeTable();
      currentArrayOfStudents = arrOfStudents;
      currentArrayOfStudents = filterStrings(currentArrayOfStudents, 'name-filter-input', 'name');
      currentArrayOfStudents = filterStrings(currentArrayOfStudents, 'department-filter-input', 'department');
      currentArrayOfStudents = filterYear(currentArrayOfStudents, 'enter-year-filter-input', 'enter');
      currentArrayOfStudents = filterYear(currentArrayOfStudents, 'finish-year-filter-input', 'finish');
      addTable(currentArrayOfStudents);
      return currentArrayOfStudents;
    })
  });

  let isSortedByName = false;
  let isSortedByDepartment = false;
  let isSortedByYear = false;
  let isSortedByBirthdate = false;

  nameColumnHeading.addEventListener('click', () => {
    sortBy(currentArrayOfStudents, 'name', isSortedByName);
    isSortedByName = !isSortedByName;
  })
  studyYearsColumnHeading.addEventListener('click', () => {
    sortBy(currentArrayOfStudents, 'year', isSortedByYear);
    isSortedByYear = !isSortedByYear;
  })
  birthDateColumnHeading.addEventListener('click', () => {
    sortBy(currentArrayOfStudents, 'birthdate', isSortedByBirthdate);
    isSortedByBirthdate = !isSortedByBirthdate;
  })
  departmentColumnHeading.addEventListener('click', () => {
    sortBy(currentArrayOfStudents, 'department', isSortedByDepartment);
    isSortedByDepartment = !isSortedByDepartment;
  })
})()
