const emojis = [
  { emoji: '😊', emotion: 'Happy' },
  { emoji: '😢', emotion: 'Sad' },
  { emoji: '😠', emotion: 'Angry' },
  { emoji: '😮', emotion: 'Surprised' },
  { emoji: '😍', emotion: 'Love' },
  { emoji: '😎', emotion: 'Cool' },
  { emoji: '😴', emotion: 'Sleepy' },
  { emoji: '🤔', emotion: 'Thinking' },
  { emoji: '🥳', emotion: 'Celebration' },
  { emoji: '😷', emotion: 'Sick' },
  { emoji: '😐', emotion: 'Neutral' },
  { emoji: '🤩', emotion: 'Excited' },
];

document.addEventListener('DOMContentLoaded', () => {
  loadEmojis();
  // updateTimeline();
  document
    .getElementById('timeline')
    .addEventListener('change', updateTimeline);
});

document.getElementById('logMood').addEventListener('click', submitMoodStatus);

// Load All emojis dd event listener on each emoji
function loadEmojis() {
  const emojiGrid = document.getElementById('emojiGrid');
  emojis.forEach((item) => {
    const emojiElement = document.createElement('div');
    emojiElement.classList.add(
      'text-2xl',
      'cursor-pointer',
      'hover:scale-125',
      'transition-transform'
    );
    emojiElement.textContent = item.emoji;
    emojiElement.addEventListener('click', () => selectMood(item));
    emojiGrid.appendChild(emojiElement);
  });
}

function selectMood(item) {
  const emojiInput = document.getElementById('emojiInput');
  emojiInput.value = `${item.emoji} ${item.emotion}`;
}

function submitMoodStatus() {
  const emojiInput = document.getElementById('emojiInput');
  if (emojiInput.value) {
    const success = storeTodayMood(emojiInput.value);
    if (success) {
      const successMessage = document.getElementById('successMessage');
      successMessage.classList.remove('hidden');
      setTimeout(() => successMessage.classList.add('hidden'), 3000);
    } else {
      const failedMessage = document.getElementById('failedMessage');
      failedMessage.classList.remove('hidden');
      setTimeout(() => failedMessage.classList.add('hidden'), 3000);
    }
  } else {
    alert('Please select an emoji first!');
  }
  emojiInput.value = '';
  updateTimeline();
}

function storeTodayMood(todayMood) {
  const today = new Date().toDateString();
  if (localStorage.getItem(today)) {
    return false;
  } else {
    localStorage.setItem(today, todayMood);
    return true;
  }
}

function getMoods() {
  const moods = [];
  for (let i = 0; i < localStorage.length; i++) {
    const date = localStorage.key(i);
    const mood = localStorage.getItem(date);
    moods.push({ date, mood });
  }
  return moods;
}

function updateTimeline() {
  const timeline = document.getElementById('timeline').value;
  const timelineView = document.getElementById('timelineView');
  timelineView.innerHTML = '';
  const moods = getMoods();
  const filteredMoods = filterMoodsByTimeline(moods, timeline);
  filteredMoods.forEach((mood) => {
    const moodElement = document.createElement('div');
    moodElement.classList.add('text-xl', 'mb-2');
    moodElement.textContent = `${mood.date}: ${mood.mood}`;
    timelineView.appendChild(moodElement);
  });
}

function filterMoodsByTimeline(moods, timeline) {
  const today = new Date();
  if (timeline === 'day') {
    return moods.filter(
      (mood) => new Date(mood.date).toDateString() === today.toDateString()
    );
  } else if (timeline === 'week') {
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(today.setDate(today.getDate() + 6));
    return moods.filter((mood) => {
      const moodDate = new Date(mood.date);
      return moodDate >= startOfWeek && moodDate <= endOfWeek;
    });
  } else if (timeline === 'month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return moods.filter((mood) => {
      const moodDate = new Date(mood.date);
      return moodDate >= startOfMonth && moodDate <= endOfMonth;
    });
  }
  return moods;
}
