export const COURSE_NAMES = {
  INTRO: 'Nhập môn lập trình',
  TECH: 'Kỹ thuật lập trình',
  DATA: 'Cấu trúc dữ liệu & GT',
  OOP: 'Lập trình HĐT'
};

export const CLASS_LIST = ['22CT111', '22CT112', '22CT113'];

const firstNames = [
  'Minh',
  'Hương',
  'Nam',
  'Lan',
  'Tuấn',
  'Hằng',
  'Mai',
  'An',
  'Bình',
  'Cường',
  'Dung',
  'Phương',
  'Quang',
  'Khang',
  'Linh',
  'Hải',
  'Sơn',
  'Hoa',
  'Thủy',
  'Giang',
  'Tài',
  'Đức',
  'Thành',
  'Vy',
  'My',
  'Trang',
  'Ngọc',
  'Loan',
  'Duyên',
  'Phúc',
  'Hiếu',
  'Tú',
  'Nhi',
  'Thảo',
  'Phát',
  'Trung',
  'Huy',
  'Tâm',
  'Khôi',
  'Thiện'
];

const lastNames = [
  'Nguyễn',
  'Trần',
  'Lê',
  'Phạm',
  'Hoàng',
  'Đặng',
  'Bùi',
  'Võ',
  'Đỗ',
  'Huỳnh',
  'Phan',
  'Đinh',
  'Dương',
  'Lương',
  'Chu',
  'Vân',
  'Trịnh',
  'Tô',
  'Vũ'
];

const randomScore = (min, max, center = null) => {
  const mean = center ?? (min + max) / 2;
  const sway = (Math.random() - 0.5) * (max - min);
  const value = Math.min(max, Math.max(min, mean + sway));
  return Math.round(value);
};

const skillGenerators = {
  [COURSE_NAMES.INTRO]: (base) => ({
    ifElse: randomScore(base - 5, base + 5, base),
    forWhile: randomScore(base - 7, base + 3, base - 2),
    function: randomScore(base - 4, base + 6, base + 1),
    array: randomScore(base - 10, base + 2, base - 4),
    string: randomScore(base - 12, base, base - 6),
    debug: randomScore(base - 8, base + 2, base - 3)
  }),
  [COURSE_NAMES.TECH]: (base) => ({
    advancedFunction: randomScore(base - 5, base + 5, base + 2),
    arrayMatrix: randomScore(base - 6, base + 4, base),
    pointer: randomScore(base - 8, base + 2, base - 3),
    struct: randomScore(base - 6, base + 4, base - 1),
    fileIO: randomScore(base - 8, base + 2, base - 2),
    recursion: randomScore(base - 10, base, base - 4),
    debugTesting: randomScore(base - 6, base + 4, base + 1)
  }),
  [COURSE_NAMES.DATA]: (base) => ({
    linkedList: randomScore(base - 4, base + 6, base + 2),
    stackQueue: randomScore(base - 6, base + 4, base),
    tree: randomScore(base - 8, base + 2, base - 2),
    graph: randomScore(base - 10, base, base - 4),
    sort: randomScore(base - 6, base + 4, base + 1),
    search: randomScore(base - 8, base + 2, base - 1)
  }),
  [COURSE_NAMES.OOP]: (base) => ({
    classObject: randomScore(base - 4, base + 6, base + 3),
    encapsulation: randomScore(base - 6, base + 4, base),
    inheritance: randomScore(base - 6, base + 4, base - 1),
    polymorphism: randomScore(base - 6, base + 4, base),
    abstraction: randomScore(base - 8, base + 2, base - 2),
    designPattern: randomScore(base - 10, base, base - 4)
  })
};

const generateStudentName = (index, usedNames) => {
  let attempts = 0;
  let fullName = '';

  do {
    const last = lastNames[(index + attempts) % lastNames.length];
    const first = firstNames[(index * 2 + attempts) % firstNames.length];
    fullName = `${last} ${first}`;

    if (usedNames.has(fullName)) {
      fullName = `${fullName} ${Math.floor(index / 50) + 1}`;
    }

    attempts += 1;
  } while (usedNames.has(fullName) && attempts < 10);

  usedNames.add(fullName);
  return fullName;
};

const generateStudentId = (className, index) => {
  // Format: 122000XXX (9 chữ số)
  // 122 = năm nhập học (2022)
  // 000 = padding
  // XXX = số thứ tự sinh viên (001-999)
  const classNumber = className.slice(-3); // 111, 112, 113
  const studentNumber = String(index + 1).padStart(3, '0');
  return `122${classNumber}${studentNumber}`;
};

const clampPercent = (value) => Math.round(Math.min(100, Math.max(0, value)));

const calculateAvgScore = (skills) => {
  const values = Object.values(skills);
  const total = values.reduce((sum, value) => sum + value, 0);
  const averagePercent = total / values.length;
  return Math.round((averagePercent / 10) * 10) / 10;
};

const generateCoursePerformanceData = (cohort, semester, studentsPerClass = 40) => {
  const students = [];
  const usedNames = new Set();

  CLASS_LIST.forEach((className, classIndex) => {
    for (let i = 0; i < studentsPerClass; i += 1) {
      const globalIndex = classIndex * studentsPerClass + i;
      const baseBand = Math.random();
      let baseScore;
      let completionRate;

      if (baseBand < 0.35) {
        baseScore = randomScore(85, 95, 90);
        completionRate = randomScore(90, 100, 95);
      } else if (baseBand < 0.75) {
        baseScore = randomScore(75, 85, 80);
        completionRate = randomScore(80, 90, 85);
      } else if (baseBand < 0.93) {
        baseScore = randomScore(60, 75, 68);
        completionRate = randomScore(65, 80, 73);
      } else {
        baseScore = randomScore(40, 60, 50);
        completionRate = randomScore(45, 65, 55);
      }

      const courseEntry = {};

      Object.values(COURSE_NAMES).forEach((courseName) => {
        const offset =
          courseName === COURSE_NAMES.INTRO
            ? 10
            : courseName === COURSE_NAMES.TECH
              ? -2
              : courseName === COURSE_NAMES.DATA
                ? -8
                : -15;

        const rawSkills = skillGenerators[courseName](baseScore + offset);
        const skillSet = Object.keys(rawSkills).reduce((acc, key) => {
          acc[key] = clampPercent(rawSkills[key]);
          return acc;
        }, {});

        courseEntry[courseName] = {
          completionRate: clampPercent(completionRate + offset),
          avgScore: calculateAvgScore(skillSet),
          skills: skillSet
        };
      });

      students.push({
        id: globalIndex + 1,
        name: generateStudentName(globalIndex, usedNames),
        studentId: generateStudentId(className, i),
        className,
        cohort,
        semester,
        courses: courseEntry
      });
    }
  });

  return {
    cohort,
    semester,
    totalStudents: students.length,
    students
  };
};

export const coursePerformanceData = generateCoursePerformanceData('22', 'Học kỳ 1 - 2024', 40);
