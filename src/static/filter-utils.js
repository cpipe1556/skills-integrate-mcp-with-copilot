export function normalizeText(value = '') {
  return String(value).trim().toLowerCase();
}

function parseScheduleDay(schedule = '') {
  const dayMap = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  const normalized = normalizeText(schedule);

  for (const [dayName, dayNumber] of Object.entries(dayMap)) {
    if (normalized.includes(dayName)) {
      return dayNumber;
    }
  }

  return Number.MAX_SAFE_INTEGER;
}

function parseScheduleTime(schedule = '') {
  const match = String(schedule).match(/(\d{1,2}:\d{2}\s?(?:AM|PM))/i);
  if (!match) {
    return 0;
  }

  const time = match[1].toUpperCase();
  const [clock, meridiem] = time.split(/(?=AM|PM)/i);
  const [hours, minutes] = clock.split(':').map(Number);
  const hourValue = meridiem === 'PM' && hours !== 12 ? hours + 12 : hours;

  return hourValue * 60 + minutes;
}

export function filterAndSortActivities(activities, options = {}) {
  const category = normalizeText(options.category || 'all');
  const searchText = normalizeText(options.searchText || '');
  const sortBy = options.sortBy || 'name';

  return Object.entries(activities)
    .filter(([name, details]) => {
      const matchesCategory =
        category === 'all' || normalizeText(details.category || '') === category;
      const haystack = [
        name,
        details.description || '',
        details.schedule || '',
        details.category || '',
      ].join(' ');
      const matchesSearch =
        searchText === '' || normalizeText(haystack).includes(searchText);

      return matchesCategory && matchesSearch;
    })
    .sort(([nameA, detailsA], [nameB, detailsB]) => {
      if (sortBy === 'time') {
        const dayDiff =
          parseScheduleDay(detailsA.schedule) - parseScheduleDay(detailsB.schedule);
        if (dayDiff !== 0) {
          return dayDiff;
        }

        return parseScheduleTime(detailsA.schedule) - parseScheduleTime(detailsB.schedule);
      }

      return String(nameA).localeCompare(String(nameB));
    });
}
