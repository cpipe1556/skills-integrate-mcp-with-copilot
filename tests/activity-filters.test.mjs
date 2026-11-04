import test from 'node:test';
import assert from 'node:assert/strict';

import { filterAndSortActivities } from '../src/static/filter-utils.js';

const activities = {
  'Chess Club': {
    category: 'Sports',
    description: 'Learn strategies and compete in chess tournaments',
    schedule: 'Fridays, 3:30 PM - 5:00 PM',
    max_participants: 12,
    participants: ['a@example.com'],
  },
  'Math Club': {
    category: 'Academic',
    description: 'Solve challenging problems and participate in math competitions',
    schedule: 'Tuesdays, 3:30 PM - 4:30 PM',
    max_participants: 10,
    participants: ['b@example.com'],
  },
  'Art Club': {
    category: 'Arts',
    description: 'Explore your creativity through painting and drawing',
    schedule: 'Thursdays, 3:30 PM - 5:00 PM',
    max_participants: 15,
    participants: ['c@example.com'],
  },
};

test('filterAndSortActivities returns matching activities for a category and search term', () => {
  const result = filterAndSortActivities(activities, {
    category: 'Academic',
    searchText: 'math',
    sortBy: 'name',
  });

  assert.deepEqual(result.map(([name]) => name), ['Math Club']);
});

test('filterAndSortActivities sorts alphabetically by name when requested', () => {
  const result = filterAndSortActivities(activities, {
    category: 'all',
    searchText: '',
    sortBy: 'name',
  });

  assert.deepEqual(result.map(([name]) => name), ['Art Club', 'Chess Club', 'Math Club']);
});

test('filterAndSortActivities sorts by schedule order when requested', () => {
  const result = filterAndSortActivities(activities, {
    category: 'all',
    searchText: '',
    sortBy: 'time',
  });

  assert.deepEqual(result.map(([name]) => name), ['Math Club', 'Art Club', 'Chess Club']);
});
