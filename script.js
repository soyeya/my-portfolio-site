// GitHub Configuration
// 이 계정만 연동할 수 있음
const GITHUB_USERNAME = 'soyeya';

// Projects Data
const projects = [
    {
        title: 'Portfolio Website',
        description: 'React와 Tailwind CSS로 만든 반응형 포트폴리오 사이트',
        image: '🌐',
        tech: ['React', 'Tailwind CSS', 'JavaScript'],
        demo: '#',
        github: '#'
    },
    {
        title: 'Todo App',
        description: 'Vue.js로 만든 기능 완성도 높은 할일 관리 애플리케이션',
        image: '✅',
        tech: ['Vue.js', 'JavaScript', 'LocalStorage'],
        demo: '#',
        github: '#'
    },
    {
        title: 'Blog Platform',
        description: 'Next.js와 마크다운으로 만든 블로그 플랫폼',
        image: '📝',
        tech: ['Next.js', 'Markdown', 'Vercel'],
        demo: '#',
        github: '#'
    },
    {
        title: 'Weather Dashboard',
        description: 'Open-Meteo API로 실시간 날씨를 보여주는 대시보드',
        image: '⛅',
        tech: ['JavaScript', 'REST API', 'Tailwind CSS'],
        demo: '#',
        github: '#'
    },
    {
        title: 'Activity Tracker',
        description: 'GitHub 활동과 할일을 히트맵으로 시각화하는 도구',
        image: '📊',
        tech: ['TypeScript', 'React', 'GitHub API'],
        demo: '#',
        github: '#'
    },
    {
        title: 'Design System',
        description: '재사용 가능한 UI 컴포넌트 라이브러리',
        image: '🎨',
        tech: ['React', 'TypeScript', 'Storybook'],
        demo: '#',
        github: '#'
    }
];

// ==================== Theme Toggle ====================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check localStorage or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ==================== Mobile Menu ====================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking on a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// ==================== Weather Widget ====================
async function initWeather() {
    const weatherWidget = document.getElementById('weatherWidget');
    const weatherContent = document.getElementById('weatherContent');
    const weatherStatus = document.getElementById('weatherStatus');
    const weatherTemp = document.getElementById('weatherTemp');
    const weatherMinMax = document.getElementById('weatherMinMax');

    // Map weather codes to icon files and Korean text
    const weatherMap = {
        0: { icon: 'icon1', text: '맑음' },
        1: { icon: 'icon1', text: '대부분 맑음' },
        2: { icon: 'icon3', text: '부분 흐림' },
        3: { icon: 'icon3', text: '흐림' },
        45: { icon: 'icon7', text: '안개' },
        48: { icon: 'icon7', text: '성에' },
        51: { icon: 'icon4', text: '가벼운 이슬비' },
        53: { icon: 'icon4', text: '이슬비' },
        55: { icon: 'icon4', text: '강한 이슬비' },
        61: { icon: 'icon4', text: '약한 비' },
        63: { icon: 'icon4', text: '비' },
        65: { icon: 'icon5', text: '강한 비' },
        71: { icon: 'icon2', text: '약한 눈' },
        73: { icon: 'icon2', text: '눈' },
        75: { icon: 'icon2', text: '강한 눈' },
        77: { icon: 'icon2', text: '눈입자' },
        80: { icon: 'icon5', text: '약한 소나기' },
        81: { icon: 'icon5', text: '소나기' },
        82: { icon: 'icon5', text: '강한 소나기' },
        85: { icon: 'icon2', text: '약한 눈소나기' },
        86: { icon: 'icon2', text: '눈소나기' },
        95: { icon: 'icon6', text: '뇌우' },
        96: { icon: 'icon6', text: '우박 뇌우' },
        99: { icon: 'icon6', text: '우박 뇌우' }
    };

    function updateWeather(lat, lon) {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,temperature_2m_max,temperature_2m_min&daily=temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto`)
            .then(res => res.json())
            .then(data => {
                const current = data.current;
                const daily = data.daily;
                const code = current.weather_code;
                const weather = weatherMap[code] || { icon: 'icon1', text: '날씨 정보' };

                // Load SVG icon
                fetch(`weather-icons/${weather.icon}.svg`)
                    .then(res => res.text())
                    .then(svgText => {
                        weatherContent.innerHTML = svgText;
                    })
                    .catch(() => {
                        weatherContent.innerHTML = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle fill="#f8b62d" cx="50" cy="50" r="30"/></svg>';
                    });

                weatherStatus.textContent = weather.text;
                weatherTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
                weatherMinMax.textContent = `최고: ${Math.round(daily.temperature_2m_max[0])}°C / 최저: ${Math.round(daily.temperature_2m_min[0])}°C`;
            })
            .catch(err => {
                console.error('Weather error:', err);
                weatherStatus.textContent = '날씨를 불러오지 못했어요';
                weatherContent.innerHTML = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle fill="#888" cx="50" cy="50" r="30"/></svg>';
            });
    }

    // Try to get location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                updateWeather(latitude, longitude);
            },
            () => {
                // Default to Seoul
                updateWeather(37.57, 126.98);
            }
        );
    } else {
        // Default to Seoul
        updateWeather(37.57, 126.98);
    }
}

// ==================== Projects ====================
function initProjects() {
    const container = document.getElementById('projectsContainer');

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow hover:shadow-xl transition transform hover:scale-105 animate-fadeIn';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="text-6xl p-8 bg-gradient-to-br from-indigo-100 dark:from-indigo-900/30 to-violet-100 dark:to-violet-900/30 text-center">
                ${project.image}
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-3">${project.title}</h3>
                <p class="text-slate-600 dark:text-slate-400 mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${project.tech.map(t => `<span class="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full font-semibold">${t}</span>`).join('')}
                </div>
                <div class="flex gap-4">
                    <a href="${project.demo}" class="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-center font-semibold hover:shadow-lg transition">
                        Demo
                    </a>
                    <a href="${project.github}" class="flex-1 px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg text-center font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                        GitHub
                    </a>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// ==================== Email Copy ====================
function initEmailCopy() {
    const copyBtn = document.getElementById('copyEmail');
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('sypwork1207@gmail.com');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '복사됨!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}

// ==================== Today's Code / Activity Heatmap ====================

// Store activity data
let activityData = {
    manual: {}, // date -> count
    github: {}  // date -> count
};

let selectedPeriod = 'quarter';
let selectedDate = new Date();
let githubConnected = false;

// Get or create activity count for date
function getActivityCount(dateStr) {
    const manualCount = activityData.manual[dateStr] || 0;
    const githubCount = activityData.github[dateStr] || 0;
    return manualCount + githubCount;
}

// Load stored todos and GitHub data
function loadActivityData() {
    const stored = localStorage.getItem('todayCode.activity');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            activityData = parsed;
        } catch (e) {
            console.error('Failed to parse activity data', e);
        }
    }

    // Fixed GitHub account only; drop any username stored by older versions
    localStorage.removeItem('todayCode.github.username');
    document.getElementById('githubUsername').value = GITHUB_USERNAME;
    githubConnected = true;
    fetchGitHubActivity();
}

// Save activity data
function saveActivityData() {
    localStorage.setItem('todayCode.activity', JSON.stringify(activityData));
}

// Get todos for a date
function getTodos(dateStr) {
    const stored = localStorage.getItem(`todayCode.todos.${dateStr}`);
    return stored ? JSON.parse(stored) : [];
}

// Save todos for a date
function saveTodos(dateStr, todos) {
    localStorage.setItem(`todayCode.todos.${dateStr}`, JSON.stringify(todos));
    // Update manual activity count
    const completed = todos.filter(t => t.completed).length;
    if (completed > 0) {
        activityData.manual[dateStr] = completed;
    } else {
        delete activityData.manual[dateStr];
    }
    saveActivityData();
    renderHeatmap();
    updateStats();
}

// Format date as YYYY-MM-DD
function formatDate(date) {
    // Local date (toISOString is UTC and shifts the day in KST)
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// Get date range based on period
function getDateRange(period) {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);

    switch(period) {
        case 'week':
            start.setDate(end.getDate() - 6);
            break;
        case 'twoweeks':
            start.setDate(end.getDate() - 13);
            break;
        case 'month':
            start.setDate(end.getDate() - 29);
            break;
        case 'quarter':
            start.setDate(end.getDate() - 89);
            break;
    }
    start.setHours(0, 0, 0, 0);

    return [start, end];
}

// Get activity level (0-5) for color coding
function getActivityLevel(count) {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count >= 3 && count <= 4) return 3;
    return 4;
}

// Get cell color based on activity level
function getCellColor(level, isDark) {
    const colors = [
        isDark ? 'bg-slate-700' : 'bg-slate-200',
        isDark ? 'bg-emerald-900' : 'bg-emerald-100',
        isDark ? 'bg-emerald-800' : 'bg-emerald-200',
        isDark ? 'bg-emerald-600' : 'bg-emerald-400',
        isDark ? 'bg-emerald-500' : 'bg-emerald-500'
    ];
    return colors[level];
}

// GitHub-style tooltip: "1 contribution on October 4, 2026"
let heatmapTooltip = null;

function showHeatmapTooltip(cell) {
    if (!heatmapTooltip) {
        heatmapTooltip = document.createElement('div');
        heatmapTooltip.className = 'fixed z-[60] pointer-events-none px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-lg';
        document.body.appendChild(heatmapTooltip);
    }
    const count = Number(cell.dataset.count);
    const label = new Date(cell.dataset.date + 'T00:00:00')
        .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    heatmapTooltip.textContent = count === 0
        ? `No contributions on ${label}`
        : `${count} contribution${count > 1 ? 's' : ''} on ${label}`;
    heatmapTooltip.style.display = 'block';

    const rect = cell.getBoundingClientRect();
    const tipRect = heatmapTooltip.getBoundingClientRect();
    const left = Math.min(Math.max(8, rect.left + rect.width / 2 - tipRect.width / 2), window.innerWidth - tipRect.width - 8);
    heatmapTooltip.style.left = `${left}px`;
    heatmapTooltip.style.top = `${rect.top - tipRect.height - 8}px`;
}

function hideHeatmapTooltip() {
    if (heatmapTooltip) heatmapTooltip.style.display = 'none';
}

// Render the heatmap
function renderHeatmap() {
    const container = document.getElementById('heatmapContainer');
    const [startDate, endDate] = getDateRange(selectedPeriod);
    const isDark = document.documentElement.classList.contains('dark');

    // Create weeks structure
    const weeks = [];
    let currentWeek = [];

    // Find the first Sunday before startDate
    const firstDate = new Date(startDate);
    const dayOfWeek = firstDate.getDay();
    firstDate.setDate(firstDate.getDate() - dayOfWeek);

    let currentDate = new Date(firstDate);

    while (currentDate <= endDate) {
        const day = new Date(currentDate);
        currentWeek.push(day);

        if (currentWeek.length === 7) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    // Build HTML
    let html = '<div class="flex gap-1">';

    // Day labels (vertical)
    html += '<div class="flex flex-col gap-1"><div class="h-6"></div>';
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayLabels.forEach(day => {
        html += `<div class="w-8 h-8 text-xs flex items-center justify-center text-slate-600 dark:text-slate-400">${day.slice(0,1)}</div>`;
    });
    html += '</div>';

    // Weeks and cells
    weeks.forEach((week, weekIndex) => {
        html += '<div class="flex flex-col gap-1">';

        // Month label (first day of month in this week)
        const monthDate = week[0];
        const monthLabel = monthDate.getDate() === 1 ?
            ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'][monthDate.getMonth()] + ' ' + monthDate.getDate() :
            '';
        html += `<div class="h-6 text-xs text-slate-600 dark:text-slate-400 leading-6">${monthLabel}</div>`;

        // Day cells
        week.forEach((date, dayIndex) => {
            const dateStr = formatDate(date);
            const count = getActivityCount(dateStr);
            const level = getActivityLevel(count);
            const isToday = formatDate(new Date()) === dateStr;
            const isInRange = date >= startDate && date <= endDate;

            const cellClass = isInRange ? getCellColor(level, isDark) : (isDark ? 'bg-slate-800' : 'bg-slate-100');
            const borderClass = isToday ? 'ring-2 ring-offset-1 ring-violet-500' : '';

            html += `<div class="w-8 h-8 ${cellClass} rounded-sm cursor-pointer transition hover:opacity-80 ${borderClass}"
                        data-date="${dateStr}"
                        data-count="${count}"></div>`;
        });

        html += '</div>';
    });

    html += '</div>';

    container.innerHTML = html;

    // Add event listeners to cells
    container.querySelectorAll('[data-date]').forEach(cell => {
        cell.addEventListener('mouseenter', () => showHeatmapTooltip(cell));
        cell.addEventListener('mouseleave', hideHeatmapTooltip);
        cell.addEventListener('click', () => {
            selectedDate = new Date(cell.dataset.date + 'T00:00:00');
            updateTodoPanel(true);
        });
    });
}

// Fetch GitHub activity
async function fetchGitHubActivity() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=300`);
        if (!response.ok) throw new Error('User not found');

        const events = await response.json();

        // Count events per day
        const counts = {};
        events.forEach(event => {
            const dateStr = formatDate(new Date(event.created_at));
            counts[dateStr] = (counts[dateStr] || 0) + 1;
        });

        activityData.github = counts;
        saveActivityData();
        renderHeatmap();
        updateStats();
    } catch (error) {
        console.error('GitHub fetch error:', error);
    }
}

// Update todo panel
function updateTodoPanel(focusInput = false) {
    const dateStr = formatDate(selectedDate);
    const todos = getTodos(dateStr);
    const todoList = document.getElementById('todoList');
    const todoInput = document.getElementById('todoInput');

    // Update date label
    const dateLabel = document.getElementById('selectedDateLabel');
    const today = formatDate(new Date());
    if (dateStr === today) {
        dateLabel.textContent = '오늘';
    } else {
        dateLabel.textContent = selectedDate.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric'
        });
    }

    // Clear and render todos
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg';
        item.innerHTML = `
            <input type="checkbox" class="todo-checkbox w-5 h-5 cursor-pointer" data-index="${index}" ${todo.completed ? 'checked' : ''}>
            <span class="flex-1 ${todo.completed ? 'line-through text-slate-400' : ''}">${todo.text}</span>
            <button class="todo-delete px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition" data-index="${index}">삭제</button>
        `;

        const checkbox = item.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => {
            todos[index].completed = checkbox.checked;
            saveTodos(dateStr, todos);
            updateTodoPanel(true);
        });

        const deleteBtn = item.querySelector('.todo-delete');
        deleteBtn.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos(dateStr, todos);
            updateTodoPanel(true);
        });

        todoList.appendChild(item);
    });

    // Clear input
    todoInput.value = '';
    if (focusInput) todoInput.focus({ preventScroll: true });
}

// Add todo
function addTodo(text) {
    if (!text.trim()) return;

    const dateStr = formatDate(selectedDate);
    const todos = getTodos(dateStr);
    todos.push({ text: text.trim(), completed: false });
    saveTodos(dateStr, todos);
    updateTodoPanel(true);
}

// Update stats
function updateStats() {
    const [startDate, endDate] = getDateRange(selectedPeriod);
    let totalCount = 0;
    let activeDays = 0;
    let maxStreak = 0;
    let currentStreak = 0;

    // Iterate through all dates in range
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count activities
    dates.forEach(dateStr => {
        const count = getActivityCount(dateStr);
        totalCount += count;

        if (count > 0) {
            activeDays++;
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    });

    document.getElementById('totalActivity').textContent = totalCount;
    document.getElementById('activeDays').textContent = activeDays;
    document.getElementById('streakDays').textContent = maxStreak;
}

// Initialize Today's Code
function initTodayCode() {
    loadActivityData();

    // Period buttons
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-violet-600', 'text-white'));
            btn.classList.add('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-violet-600', 'text-white');
            selectedPeriod = btn.dataset.period;
            renderHeatmap();
            updateStats();
        });
    });

    // Set initial active button
    document.querySelector('[data-period="quarter"]').classList.add('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-violet-600', 'text-white');

    // GitHub sync (fixed account)
    const usernameInput = document.getElementById('githubUsername');
    usernameInput.value = GITHUB_USERNAME;
    usernameInput.readOnly = true;
    usernameInput.classList.add('opacity-70', 'cursor-not-allowed');

    // Todo add
    document.getElementById('todoAdd').addEventListener('click', () => {
        const input = document.getElementById('todoInput');
        addTodo(input.value);
    });

    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo(e.target.value);
        }
    });

    // Demo data button
    document.getElementById('useDemoData').addEventListener('click', () => {
        const demoTodos = [
            { text: '프로필 사이트 제작', completed: true },
            { text: '날씨 API 연동', completed: true },
            { text: '활동량 히트맵 구현', completed: false }
        ];

        const dateStr = formatDate(selectedDate);
        saveTodos(dateStr, demoTodos);
        updateTodoPanel(true);
    });

    // Initial render (GitHub sync removed to prevent scroll jumping on page load)
    renderHeatmap();
    updateTodoPanel();
    updateStats();
}

// ==================== Scroll Animation ====================
function initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section > div').forEach(el => {
        observer.observe(el);
    });
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initWeather();
    initProjects();
    initEmailCopy();
    initTodayCode();
    initScrollAnimation();
});
